// firebase_config.js

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: 'AIzaSyC4I6h7o-2VZ9wD6R5iaPx5pcC5Ou4preY',
  authDomain: 'admin-dash-359ad.firebaseapp.com',
  projectId: 'admin-dash-359ad',
  storageBucket: 'admin-dash-359ad.appspot.com',
  messagingSenderId: '884765990740',
  appId: '1:884765990740:web:f5b4d5eaf8a33eb926f2c1',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
export const auth = getAuth()

export { app, db, storage };