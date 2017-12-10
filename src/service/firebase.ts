import * as firebase from 'firebase';
import 'firebase/firestore';
import { ObjectWithId } from 'models';

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID
};

firebase.initializeApp(config);

const firestore = firebase.firestore();
const auth = firebase.auth();

function mapDocToT<T extends ObjectWithId>(doc: firebase.firestore.DocumentSnapshot): T {
  return {
    id: doc.id,
    ...doc.data()
  } as T;
}

export default firebase;
export { firestore, auth, mapDocToT };
