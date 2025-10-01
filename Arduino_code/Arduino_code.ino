#include <WiFi.h>
#include <PZEM004Tv30.h>
#include <HardwareSerial.h>
#include <Firebase_ESP_Client.h>
#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"
#include <LiquidCrystal_I2C.h>
#include <Wire.h>

// WiFi credentials
#define WIFI_SSID "Pramuda Kulathunga" // Add Your wifi username
#define WIFI_PASSWORD ""  // Add your passowrd

// Firebase configuration
#define API_KEY ""  // Add Firebase api key
#define DATABASE_URL ""  // Add Firebase URL

// LCD Configuration (Software I2C with different pins)
#define LCD_SDA 18  // Use pin 18 for SDA instead of 21
#define LCD_SCL 5   // Use pin 5 for SCL instead of 22
LiquidCrystal_I2C lcd(0x27, 16, 2);

// Relay pins (FIXED - cannot change)
#define RELAY1_PIN 19
#define RELAY2_PIN 21  // Conflict with original I2C SDA
#define RELAY3_PIN 22  // Conflict with original I2C SCL

// Physical switch pins (INPUT_PULLUP)
#define PHYSICAL_SWITCH1 13
#define PHYSICAL_SWITCH2 12
#define PHYSICAL_SWITCH3 14

// PZEM RX/TX pin definitions
#define RX_PIN1 16
#define TX_PIN1 17
#define RX_PIN2 32
#define TX_PIN2 33
#define RX_PIN3 3
#define TX_PIN3 1

// Hardware serials
HardwareSerial pzemSerial1(2);  // use UART2
HardwareSerial pzemSerial2(1);  // use UART1
HardwareSerial pzemSerial3(0);  // use UART0

PZEM004Tv30 pzem1(pzemSerial1, RX_PIN1, TX_PIN1);
PZEM004Tv30 pzem2(pzemSerial2, RX_PIN2, TX_PIN2);
PZEM004Tv30 pzem3(pzemSerial3, RX_PIN3, TX_PIN3);

// Firebase objects
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;
bool signupOk = false;

// Timing variables
unsigned long lastDbCheckMillis = 0;
unsigned long lastSensorReadMillis = 0;
unsigned long lastDisplayUpdateMillis = 0;
unsigned long lastDebounceTime[3] = {0, 0, 0};
const unsigned long DB_CHECK_INTERVAL = 1000;    // Check Firebase every 1 second
const unsigned long SENSOR_READ_INTERVAL = 2000; // Read sensors every 2 seconds
const unsigned long DISPLAY_UPDATE_INTERVAL = 1000; // Update display every 1 second
const unsigned long DEBOUNCE_DELAY = 50;         // Debounce time for physical switches

// Switch states
int firebaseSwitches[3] = {0, 0, 0};      // States from Firebase
int physicalSwitchStates[3] = {HIGH, HIGH, HIGH};  // Current states of physical switches
int lastPhysicalSwitchStates[3] = {HIGH, HIGH, HIGH}; // Previous states for debouncing
bool switchPressed[3] = {false, false, false}; // Track if switch is currently pressed

// Sensor data structure
struct SensorData {
  float voltage;
  float current;
  float power;
  float energy;
  float frequency;
  float pf;
};

SensorData sensorData[3] = {
  {0, 0, 0, 0, 0, 0},
  {0, 0, 0, 0, 0, 0},
  {0, 0, 0, 0, 0, 0}
};

// Display variables
int displayMode = 0; // 0: Port 1, 1: Port 2, 2: Port 3
int displayPage = 0; // 0: Voltage/Current, 1: Power/Frequency
unsigned long lastDisplayChangeMillis = 0;
const unsigned long DISPLAY_CHANGE_INTERVAL = 3000; // Change display every 3 seconds

// Custom I2C implementation for Software I2C
void lcd_i2c_init() {
  Wire.begin(LCD_SDA, LCD_SCL); // Initialize I2C with custom pins
}

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("Initializing System with PZEM Sensors and LCD...");

  // Initialize custom I2C for LCD
  lcd_i2c_init();
  
  // Initialize LCD
  lcd.init();
  lcd.backlight();
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Initializing...");
  lcd.setCursor(0, 1);
  lcd.print("Please wait");

  // Initialize PZEM serials
  pzemSerial1.begin(9600, SERIAL_8N1, RX_PIN1, TX_PIN1);
  pzemSerial2.begin(9600, SERIAL_8N1, RX_PIN2, TX_PIN2);
  pzemSerial3.begin(9600, SERIAL_8N1, RX_PIN3, TX_PIN3);
  Serial.println("PZEM serials started");

  // Initialize relay pins
  pinMode(RELAY1_PIN, OUTPUT);
  pinMode(RELAY2_PIN, OUTPUT);
  pinMode(RELAY3_PIN, OUTPUT);
  
  // Initialize physical switch pins
  pinMode(PHYSICAL_SWITCH1, INPUT_PULLUP);
  pinMode(PHYSICAL_SWITCH2, INPUT_PULLUP);
  pinMode(PHYSICAL_SWITCH3, INPUT_PULLUP);
  
  // Turn off all relays initially
  digitalWrite(RELAY1_PIN, LOW);
  digitalWrite(RELAY2_PIN, LOW);
  digitalWrite(RELAY3_PIN, LOW);

  // Connect to WiFi
  connectToWiFi();

  // Initialize Firebase
  initializeFirebase();

  // Read initial switch states from Firebase
  readFirebaseSwitches();
  updateRelays();

  // Read initial sensor data
  readAllSensors();
  updateFirebaseSensorData();

  // Update LCD with initial data
  updateLCD();

  Serial.println("System initialized. Ready for operation...");
  Serial.println("Pin Configuration:");
  Serial.println("- Relays: 19, 21, 22");
  Serial.println("- LCD I2C: SDA=18, SCL=5");
  Serial.println("- Physical Switches: 13, 12, 14");
  Serial.println("- PZEM1: RX=16, TX=17");
  Serial.println("- PZEM2: RX=32, TX=33");
  Serial.println("- PZEM3: RX=3, TX=1");
  printSwitchStates();
}

void loop() {
  unsigned long currentMillis = millis();

  // Check physical switches for changes
  checkPhysicalSwitches(currentMillis);

  // Read sensors at regular intervals
  if (currentMillis - lastSensorReadMillis >= SENSOR_READ_INTERVAL) {
    lastSensorReadMillis = currentMillis;
    readAllSensors();
    updateFirebaseSensorData();
  }

  // Check Firebase for switch updates at regular intervals
  if (currentMillis - lastDbCheckMillis >= DB_CHECK_INTERVAL) {
    lastDbCheckMillis = currentMillis;
    readFirebaseSwitches();
    updateRelays();
    printSwitchStates();
  }

  // Update LCD display at regular intervals
  if (currentMillis - lastDisplayUpdateMillis >= DISPLAY_UPDATE_INTERVAL) {
    lastDisplayUpdateMillis = currentMillis;
    updateLCD();
  }

  // Auto-change display mode every few seconds
  if (currentMillis - lastDisplayChangeMillis >= DISPLAY_CHANGE_INTERVAL) {
    lastDisplayChangeMillis = currentMillis;
    displayMode = (displayMode + 1) % 3; // Cycle through ports 0,1,2
    displayPage = 0; // Reset to first page when changing port
  }

  // Small delay to avoid tight loop
  delay(10);
}

void connectToWiFi() {
  lcd.setCursor(0, 0);
  lcd.print("Connecting WiFi ");
  lcd.setCursor(0, 1);
  lcd.print("                ");
  
  Serial.print("Connecting to WiFi");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    lcd.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println();
    Serial.print("Connected! IP address: ");
    Serial.println(WiFi.localIP());
    
    lcd.setCursor(0, 1);
    lcd.print("Connected!     ");
  } else {
    Serial.println();
    Serial.println("WiFi connection failed!");
    
    lcd.setCursor(0, 1);
    lcd.print("WiFi Failed!   ");
  }
  delay(1000);
}

void initializeFirebase() {
  lcd.setCursor(0, 0);
  lcd.print("Firebase Init  ");
  lcd.setCursor(0, 1);
  lcd.print("                ");
  
  // Configure Firebase API key and database URL
  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;

  // Anonymous authentication
  if (Firebase.signUp(&config, &auth, "", "")) {
    Serial.println("Firebase authentication successful");
    signupOk = true;
    lcd.setCursor(0, 1);
    lcd.print("FB: Connected  ");
  } else {
    Serial.printf("Firebase authentication failed: %s\n", config.signer.signupError.message.c_str());
    lcd.setCursor(0, 1);
    lcd.print("FB: Failed     ");
  }

  // Initialize Firebase
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  // Configure timeouts
  config.timeout.serverResponse = 10 * 1000;
  config.timeout.networkReconnect = 10 * 1000;
  config.timeout.rtdbKeepAlive = 20 * 1000;
  config.timeout.rtdbStreamReconnect = 2 * 1000;
  
  delay(1000);
}

void checkPhysicalSwitches(unsigned long currentMillis) {
  int switchPins[3] = {PHYSICAL_SWITCH1, PHYSICAL_SWITCH2, PHYSICAL_SWITCH3};
  
  for (int i = 0; i < 3; i++) {
    int currentReading = digitalRead(switchPins[i]);
    
    // Check if switch state changed (for debouncing)
    if (currentReading != lastPhysicalSwitchStates[i]) {
      lastDebounceTime[i] = currentMillis;
    }
    
    // If the switch state has been stable for longer than the debounce delay
    if ((currentMillis - lastDebounceTime[i]) > DEBOUNCE_DELAY) {
      // If the switch state has changed
      if (currentReading != physicalSwitchStates[i]) {
        physicalSwitchStates[i] = currentReading;
        
        // Switch pressed (LOW because of INPUT_PULLUP)
        if (currentReading == LOW && !switchPressed[i]) {
          switchPressed[i] = true;
          // Toggle Firebase switch state on press
          firebaseSwitches[i] = !firebaseSwitches[i];
          updateFirebaseSwitch(i, firebaseSwitches[i]);
          updateRelays();
          Serial.printf("Switch %d PRESSED. Toggled to: %d\n", i + 1, firebaseSwitches[i]);
        }
        // Switch released (HIGH because of INPUT_PULLUP)
        else if (currentReading == HIGH && switchPressed[i]) {
          switchPressed[i] = false;
          // Toggle Firebase switch state again on release
          firebaseSwitches[i] = !firebaseSwitches[i];
          updateFirebaseSwitch(i, firebaseSwitches[i]);
          updateRelays();
          Serial.printf("Switch %d RELEASED. Toggled to: %d\n", i + 1, firebaseSwitches[i]);
        }
        
        printSwitchStates();
      }
    }
    
    lastPhysicalSwitchStates[i] = currentReading;
  }
}

void updateFirebaseSwitch(int switchIndex, int state) {
  String path = "/Switches/" + String(switchIndex);
  
  if (Firebase.RTDB.setInt(&fbdo, path.c_str(), state)) {
    Serial.printf("Successfully updated Firebase switch %d to: %d\n", switchIndex + 1, state);
  } else {
    Serial.printf("Failed to update Firebase switch %d: %s\n", switchIndex + 1, fbdo.errorReason().c_str());
  }
}

void readFirebaseSwitches() {
  for (int i = 0; i < 3; i++) {
    String path = "/Switches/" + String(i);
    
    if (Firebase.RTDB.getInt(&fbdo, path.c_str())) {
      if (fbdo.dataType() == "int") {
        int newState = fbdo.intData();
        if (newState != firebaseSwitches[i]) {
          firebaseSwitches[i] = newState;
          Serial.printf("Firebase switch %d updated remotely to: %d\n", i + 1, firebaseSwitches[i]);
        }
      }
    } else {
      Serial.printf("Failed to read Firebase switch %d: %s\n", i + 1, fbdo.errorReason().c_str());
    }
  }
}

void updateRelays() {
  // Update relays based on Firebase switch states
  digitalWrite(RELAY1_PIN, firebaseSwitches[0] ? HIGH : LOW);
  digitalWrite(RELAY2_PIN, firebaseSwitches[1] ? HIGH : LOW);
  digitalWrite(RELAY3_PIN, firebaseSwitches[2] ? HIGH : LOW);
}

void readAllSensors() {
  // Read sensor data for each PZEM
  readSensor(0, pzem1, sensorData[0]);
  readSensor(1, pzem2, sensorData[1]);
  readSensor(2, pzem3, sensorData[2]);
}

void readSensor(int sensorIndex, PZEM004Tv30 &pzem, SensorData &data) {
  data.voltage = readSensorValue(pzem.voltage());
  data.current = readSensorValue(pzem.current());
  data.power = readSensorValue(pzem.power());
  data.energy = readSensorValue(pzem.energy());
  data.frequency = readSensorValue(pzem.frequency());
  data.pf = readSensorValue(pzem.pf());

  // Debug print
  Serial.printf("PZEM %d: V=%.1fV, I=%.3fA, P=%.1fW, E=%.1fWh, F=%.1fHz, PF=%.2f\n",
                sensorIndex + 1, data.voltage, data.current, data.power, 
                data.energy, data.frequency, data.pf);
}

float readSensorValue(float value) {
  return isnan(value) ? 0.0 : value;
}

void updateFirebaseSensorData() {
  for (int i = 0; i < 3; i++) {
    String basePath = "/" + String(i + 1); // Firebase locations: 1, 2, 3
    
    if (firebaseSwitches[i] == 1) {
      // Relay is ON - send actual sensor data
      Firebase.RTDB.setFloat(&fbdo, (basePath + "/Voltage").c_str(), sensorData[i].voltage);
      Firebase.RTDB.setFloat(&fbdo, (basePath + "/Current").c_str(), sensorData[i].current);
      Firebase.RTDB.setFloat(&fbdo, (basePath + "/Power").c_str(), sensorData[i].power);
      Firebase.RTDB.setFloat(&fbdo, (basePath + "/PowerFactor").c_str(), sensorData[i].pf);
      Firebase.RTDB.setFloat(&fbdo, (basePath + "/Frequency").c_str(), sensorData[i].frequency);
    } else {
      // Relay is OFF - send zero values
      Firebase.RTDB.setFloat(&fbdo, (basePath + "/Voltage").c_str(), 0.0);
      Firebase.RTDB.setFloat(&fbdo, (basePath + "/Current").c_str(), 0.0);
      Firebase.RTDB.setFloat(&fbdo, (basePath + "/Power").c_str(), 0.0);
      Firebase.RTDB.setFloat(&fbdo, (basePath + "/PowerFactor").c_str(), 0.0);
      Firebase.RTDB.setFloat(&fbdo, (basePath + "/Frequency").c_str(), 0.0);
    }
  }
}

void updateLCD() {
  lcd.clear();
  
  // Display port information on first line
  lcd.setCursor(0, 0);
  lcd.print("Port ");
  lcd.print(displayMode + 1);
  lcd.print(": ");
  lcd.print(firebaseSwitches[displayMode] ? "ON " : "OFF");
  
  // Display sensor data on second line based on current page
  lcd.setCursor(0, 1);
  SensorData data = sensorData[displayMode];
  
  if (displayPage == 0) {
    // Display Voltage and Current
    lcd.print("V:");
    lcd.print(data.voltage, 1);
    lcd.print(" I:");
    lcd.print(data.current, 2);
  } else {
    // Display Power and Frequency
    lcd.print("P:");
    lcd.print(data.power, 1);
    lcd.print(" F:");
    lcd.print(data.frequency, 1);
  }
  
  // Toggle page for next update
  displayPage = (displayPage + 1) % 2;
}

void printSwitchStates() {
  Serial.println("=== Current Switch States ===");
  for (int i = 0; i < 3; i++) {
    int physicalState = digitalRead(i == 0 ? PHYSICAL_SWITCH1 : i == 1 ? PHYSICAL_SWITCH2 : PHYSICAL_SWITCH3);
    Serial.printf("Switch %d: Physical=%s, Firebase=%d, Relay=%s\n", 
                  i + 1,
                  physicalState == LOW ? "PRESSED" : "RELEASED",
                  firebaseSwitches[i],
                  firebaseSwitches[i] ? "ON" : "OFF");
  }
  Serial.println("=============================");
}