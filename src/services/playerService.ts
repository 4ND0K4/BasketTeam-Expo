import { firestore } from '../../firebaseConfig';
import { Player } from '../models/Player';
import { collection, doc, getDoc, getDocs, query, orderBy, startAfter, limit, updateDoc, deleteDoc, addDoc, FirestoreError } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import uuid from 'react-native-uuid';

const playersCollection = collection(firestore, 'players');

// Obtener jugadores con paginación
export const getPlayers = async (lastKey: string | null = null, limitNumber: number = 10): Promise<Player[]> => {
  let q = query(playersCollection, orderBy('id'), limit(limitNumber));
  if (lastKey) {
    const lastDoc = await getDoc(doc(firestore, 'players', lastKey));
    q = query(playersCollection, orderBy('id'), startAfter(lastDoc), limit(limitNumber));
  }

  const snapshot = await getDocs(q);
  const players: Player[] = [];
  snapshot.forEach((doc) => {
    const player = doc.data() as Player;
    player.id = doc.id;
    players.push(player);
  });
  return players;
};

// Obtener jugador por ID
export const getPlayerById = async (id: string): Promise<Player | null> => {
  const docRef = doc(firestore, 'players', id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Player : null;
};

// Función para subir archivos a Firebase Storage
export const uploadFile = async (uri: string): Promise<string> => {
  try {
    if (!uri) {
      throw new Error("No se proporcionó una URI válida para el archivo");
    }

    const response = await fetch(uri);
    if (!response.ok) {
      throw new Error(`Error al obtener el archivo: ${response.statusText}`);
    }

    const blob = await response.blob();
    const storage = getStorage();
    const uniqueFileName = `${uuid.v4()}-${uri.split('/').pop()}`;
    const storageRef = ref(storage, `players/${uniqueFileName}`);

    const snapshot = await uploadBytes(storageRef, blob);
    console.log(snapshot.metadata);

    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error al subir el archivo:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      if (error instanceof FirestoreError) {
        console.error('Firebase error code:', error.code);
        console.error('Firebase error payload:', error);
      }
    }
    throw error;
  }
};

// Función para agregar un jugador a Firestore
export const addPlayer = async (player: Player, imageFile: string | null, videoFile: string | null) => {
  try {
    if (imageFile) {
      const imageUrl = await uploadFile(imageFile);
      player.img = imageUrl;
    }

    if (videoFile) {
      const videoUrl = await uploadFile(videoFile);
      player.video = videoUrl;
    }

    const docRef = await addDoc(playersCollection, player);
    await updateDoc(docRef, { id: docRef.id });
  } catch (error) {
    console.error('Error al agregar el jugador:', error);
    if (error instanceof Error) {
      throw new Error(`Error al agregar el jugador: ${error.message}`);
    } else {
      throw new Error('Error al agregar el jugador');
    }
  }
};

// Actualizar jugador existente
export const updatePlayer = async (
  id: string,
  player: Player,
  imageFile?: any,
  videoFile?: any
): Promise<void> => {
  if (imageFile) {
    const imageUrl = await uploadFile(imageFile);
    player.img = imageUrl;
  }

  if (videoFile) {
    const videoUrl = await uploadFile(videoFile);
    player.video = videoUrl;
  }

  const playerDoc = doc(firestore, 'players', id);
  await updateDoc(playerDoc, { ...player });
};

// Eliminar jugador
export const deletePlayer = async (id: string): Promise<void> => {
  const playerDoc = doc(firestore, 'players', id);
  await deleteDoc(playerDoc);
};