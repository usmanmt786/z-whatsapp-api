import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./db";
const collectionName: string = "wa-sessions";

// Check if session exists
export const sessionExists = async ({
  session,
}: {
  session: string;
}): Promise<boolean> => {
  const docRef = doc(db, collectionName, session);
  const docSnap = await getDoc(docRef);
  return docSnap.exists();
};

// Save session data to Firestore
export const save = async ({ session }: { session: string }): Promise<any> => {
  const docRef = doc(db, collectionName, session);
  // Assuming that we will be saving the session state in some way
  const stateToSave = {
    // Example: Include session information you want to store.
    // Replace this with your actual session state data.
    someKey: "someValue",
  };
  await setDoc(docRef, stateToSave, { merge: true });
  console.log(`Session ${session} saved to Firestore.`);
};

// Delete session from Firestore
export const Delete = async ({
  session,
}: {
  session: string;
}): Promise<any> => {
  const docRef = doc(db, collectionName, session);
  await deleteDoc(docRef);
  console.log(`Session ${session} removed from Firestore.`);
};

// Extract session data from Firestore
export const extract = async ({
  session,
  path,
}: {
  session: string;
  path: string;
}): Promise<any> => {
  const docRef = doc(db, collectionName, session);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log(`Session ${session} loaded from Firestore.`);
    return docSnap.data();
  } else {
    console.log(`No session found for ${session}.`);
    return null;
  }
};
