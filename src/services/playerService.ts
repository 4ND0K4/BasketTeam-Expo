import { firestore, storage } from '../../firebaseConfig';
import { Player } from '../models/Player';
import { collection, doc, getDoc, getDocs, query, orderBy, startAfter, limit, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { ref as storageRef, getDownloadURL, uploadBytesResumable } from 'firebase/storage';

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
export const uploadFile = async (file: string, path: string): Promise<string> => {
  const response = await fetch(file);
  const blob = await response.blob();
  const fileRef = storageRef(storage, path);
  const uploadTask = uploadBytesResumable(fileRef, blob);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      null,
      reject,
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        } catch (err) {
          reject(err);
        }
      }
    );
  });
};

// Función para agregar un jugador a Firestore
export const addPlayer = async (player: Player, imageFile: string | null, videoFile: string | null) => {
  try {
    await addDoc(playersCollection, player);
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
    const imageUrl = await uploadFile(imageFile, `images/${id}`);
    player.img = imageUrl;
  }

  if (videoFile) {
    const videoUrl = await uploadFile(videoFile, `videos/${id}`);
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