// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  setDoc,
} from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDtwniw7xpmhROd2Ve2IGqTo1lTSfNGeZE",
  authDomain: "rationale-eea43.firebaseapp.com",
  projectId: "rationale-eea43",
  storageBucket: "rationale-eea43.appspot.com",
  messagingSenderId: "419967050653",
  appId: "1:419967050653:web:a601a793bc63ff79f00574",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const SESSION_COLLECTION = "wa-sessions";
const SESSION_ID = "lVFvxVlXYpgqLj1iyAlM";
// Initialize Firestore
export const  db = getFirestore(app);

// Define TypeScript interfaces for consistency

interface Client {
  clientId: string;
}

// Function to add a new client
export const addClient = async (id: string): Promise<void> => {
  try {
    const docRef = await addDoc(collection(db, "client"), { clientId: id });
    console.log("Client added with ID:", docRef.id);
  } catch (e) {
    console.error("Error adding client:", e);
  }
};

// Function to get a user by ID
export const getClient = async (): Promise<string | null> => {
  try {
    const docRef = doc(db, "client", "cyIsuuQtJxvmCvX9NUWi"); // Reference the specific document
    const docSnap = await getDoc(docRef); // Fetch the document snapshot

    if (docSnap.exists()) {
      const userData = docSnap.data() as Client; // Type assertion to match the User interface
      console.log("User Data:", userData);
      const client = userData.clientId;
      return client;
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (e) {
    console.error("Error fetching user:", e);
    return null;
  }
};

// Function to update a client's ID
export const updateClient = async (newId: string): Promise<void> => {
  try {
    const userRef = doc(db, "client", "cyIsuuQtJxvmCvX9NUWi"); // Replace with your dynamic ID if needed

    await updateDoc(userRef, { clientId: newId });
    console.log("Client updated!");
  } catch (e) {
    console.error("Error updating client:", e);
  }
};
export const loadSession = async (): Promise<any> => {
  const docRef = doc(db, SESSION_COLLECTION, SESSION_ID);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log("Session data loaded from Firestore:", docSnap.data());
    return docSnap.data();
  } else {
    console.log("No session found.");
    return null;
  }
};
export const saveSession = async (session: any) => {
  try {
    await setDoc(doc(db, SESSION_COLLECTION, SESSION_ID), session);
    console.log("Session data saved to Firestore.");
  } catch (e) {
    console.error("Error saving session:", e);
  }
};
