# 🏠 HomeSphere – Smart Plug System  

### Smart Energy Management & Control  

HomeSphere is an **IoT-based smart plug system** designed to provide efficient control and real time monitoring of electrical appliances. It enables users to **control switches both physically and via a mobile app**, while analyzing live power parameters through integrated sensors.

---

## ⚙️ Features  

- **Smart Plug Control:** Switch appliances ON/OFF via mobile app or physical button.  
- **Real-Time Monitoring:** Track **voltage, current, power, power factor, and frequency** using the **PZEM module**.  
- **Mobile App:**  
  - Displays real time electrical data.  
  - Visualizes power changes through interactive graphs.  
  - Provides insights on energy usage trends.
     
- **ESP32 Based System:** Handles Wi-Fi connectivity and data processing for seamless communication.  
- **Compact Product Design:** Sleek and practical casing for user friendly operation.

---

## 🧩 System Architecture  

### 1. Hardware Components  
- **ESP32** – Wi-Fi-enabled microcontroller  
- **PZEM-004T** – Power monitoring module  
- **Relay module** – For appliance switching  
- **Switches** – Manual control input  

### 2. Software Components  
- **Arduino firmware** for ESP32 handles control logic and sensor readings
- **Mobile application** built using React Native Expo for control and monitoring  

### 3. Communication  
- Wi-Fi based communication between ESP32 and the mobile app using Firebase updates  

---

## 👥 Team Members & Responsibilities  

| Name | Role | Responsibilities |
|------|------|------------------|
| **Pramuda Kulathunga** | Mobile App Developer & Product Designer | Developed mobile app UI & functionality, designed product casing |
| **Sasindu Amesh** | Hardware Engineer | Designed PCB and handled circuit integration |
| **Dulara Shrimantha** | Firmware Developer | Developed Arduino code for ESP32 |

---

## 🧰 Technologies Used  

- **ESP32** (Microcontroller)  
- **PZEM-004T** (Energy Measurement)  
- **Arduino IDE** (Firmware Development)  
- **React Native** (Mobile App Development)  
- **Firebase** (Communication)  

---
