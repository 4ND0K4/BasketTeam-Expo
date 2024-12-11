import { initializeApp, getApp, getApps } from 'firebase/app';
import { getStorage } from 'firebase/storage';
// import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCk2J0PWEnqxJJOJbRpYvWj2o8QT0XpqJI",
      authDomain: "movicoders-basketproject.firebaseapp.com",
      databaseURL: "https://movicoders-basketproject-default-rtdb.europe-west1.firebasedatabase.app",
      projectId: "movicoders-basketproject",
      storageBucket: "movicoders-basketproject.firebasestorage.app",
      messagingSenderId: "869836237509",
      appId: "1:869836237509:web:cce39da28a77151964deac",
      measurementId: "G-5Q9TNYC2VJ"
};

// Inicializar Firebase solo si no ha sido inicializado previamente
let firebaseApp;
if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApp();
}

// Eliminar la inicialización de Auth
// let auth;
// try {
//   auth = initializeAuth(firebaseApp, {
//     persistence: getReactNativePersistence(AsyncStorage)
//   });
// } catch (e) {
//   if (e.code === 'auth/already-initialized') {
//     auth = getAuth(firebaseApp);
//   } else {
//     throw e;
//   }
// }

const storage = getStorage(firebaseApp);
const firestore = getFirestore(firebaseApp);

export { firebaseApp, storage, firestore };