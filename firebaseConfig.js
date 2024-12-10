import { initializeApp, getApp, getApps } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyD6wfgYd4esehVHfGKWQOfRgmgMzcGIkZo",
  authDomain: "movicoders-basketproject.firebaseapp.com",
  databaseURL: "https://movicoders-basketproject-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "movicoders-basketproject",
  storageBucket: "movicoders-basketproject.appspot.com",
  messagingSenderId: "869836237509",
  appId: "1:869836237509:android:8f20d542f0fa009564deac",
};

// Inicializar Firebase solo si no ha sido inicializado previamente
let firebaseApp;
if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApp();
}

// Inicializar Auth con persistencia en AsyncStorage solo si no ha sido inicializado previamente
let auth;
try {
  auth = initializeAuth(firebaseApp, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} catch (e) {
  if (e.code === 'auth/already-initialized') {
    auth = getAuth(firebaseApp);
  } else {
    throw e;
  }
}

const storage = getStorage(firebaseApp);
const firestore = getFirestore(firebaseApp);

export { firebaseApp, auth, storage, firestore };