import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getDatabase,
  ref,
  child,
  onValue,
  push,
  update,
} from "firebase/database";
import { DataSnapshot } from "@firebase/database";
import { MessageData } from "./components/message";

const app = initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
});
const database = getDatabase(app);

const endpoint = "messages/";

export function onMessage(callback: (snapshot: DataSnapshot) => unknown) {
  return onValue(ref(database, endpoint), callback);
}

export function sendMessage(data: MessageData) {
  // Create a new key for which to store our message in.
  const key = push(child(ref(database), endpoint)).key;

  const updates: { [key: string]: MessageData } = {};
  updates[endpoint + key] = data;
  // Insert all the data and return.

  return update(ref(database), updates);
}

export const auth = getAuth();
export default app;
