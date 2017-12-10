import * as firebase from 'firebase';
import 'firebase/firestore';
import { ObjectWithId } from 'models';

const config = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
};

firebase.initializeApp(config);

const firestore = firebase.firestore();
const auth = firebase.auth();

function mapDocToT<T extends ObjectWithId>(doc: firebase.firestore.DocumentSnapshot): T {
  return {
    id: doc.id,
    ...doc.data(),
  } as T;
}

export default firebase;
export { firestore, auth, mapDocToT };
