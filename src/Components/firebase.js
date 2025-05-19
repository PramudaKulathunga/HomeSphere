import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, update } from "firebase/database";
import "firebase/database";
import firebase from "firebase/compat/app";

const firebaseConfig = {
  apiKey: "AIzaSyDRnlQOxkzD2jV9NdGxHNV0uBPTmYyQq4I",
  authDomain: "homespherenew.firebaseapp.com",
  databaseURL:"https://homespherenew-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "homespherenew",
  storageBucket: "homespherenew.appspot.com",
  messagingSenderId: "852033732308",
  appId: "1:852033732308:web:d5d0cc1f3cc1cbbc988541",
  measurementId: "G-3JCXHRSTT9"
};

if(firebase.apps.length === 0){
  firebase.initializeApp(firebaseConfig)
}
const db = getDatabase();

export { db, ref, onValue, update }; 