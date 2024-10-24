import { Client, RemoteAuth } from 'whatsapp-web.js';
import { getFirestore, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import ZWAPIConfig from './configs';
import { updateClient } from './db';

// Initialize Firestore
const db = getFirestore(); // Firestore instance
const collectionName = "wa-sessions"; // Firestore collection name

// Method to check if the session exists
const sessionExists = async ({ session }: { session: string }): Promise<boolean> => {
  const docRef = doc(db, collectionName, session);
  const docSnap = await getDoc(docRef);
  return docSnap.exists();
};

// Method to extract session data from Firestore
const extract = async ({ session }: { session: string }): Promise<any | null> => {
  const docRef = doc(db, collectionName, session);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    console.log(`Session ${session} loaded from Firestore.`);
    return docSnap.data(); // Return the session data directly
  } else {
    console.log(`No session found for ${session}.`);
    return null;
  }
};

// Method to save session data to Firestore
const save = async ({ session }: { session: string;}): Promise<void> => {
  const docRef = doc(db, collectionName, session);
  await setDoc(docRef, {session}, { merge: true });
  console.log(`Session ${session} saved to Firestore.`);
};

// Method to delete the session from Firestore
const Delete = async ({ session }: { session: string }): Promise<void> => {
  const docRef = doc(db, collectionName, session);
  await deleteDoc(docRef);
  console.log(`Session ${session} deleted from Firestore.`);
};

// Initialize the WhatsApp client
export const waclient = new Client({
  authStrategy: new RemoteAuth({
    store: {
      sessionExists,
      extract,
      save,
      delete: Delete,
    },
    clientId: "lVFvxVlXYpgqLj1iyAlM", // Change this if you are using multiple instances
    dataPath: './.wwebjs_auth/', // Change this if you want a different path for saving session files
    backupSyncIntervalMs: 60000, // Set backup sync interval to 1 minute
  }),
  puppeteer: {
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-site-isolation-trials",
      "--disable-setuid-sandbox",
    ],
  },
  webVersionCache: {
    type: "remote",
    remotePath: ZWAPIConfig.REMOTE_URL,
  },
});

// Event listeners for the WhatsApp client
waclient.on('qr', async (qr) => {
  // console.log('QR Code:', qr);
  await updateClient(qr);
});

waclient.on('ready', () => {
  console.log('⚡ WhatsApp client is ready!');
});

waclient.on('disconnected', async () => {
  console.log('Client disconnected.');
  await Delete({ session: "RemoteAuth-lVFvxVlXYpgqLj1iyAlM" }); // Adjust session ID accordingly
});
