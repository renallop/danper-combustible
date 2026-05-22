// ─── CONFIGURACIÓN FIREBASE ───────────────────────────────────────────────────
// Credenciales de danper-combustible
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, getDocs, setDoc, updateDoc, onSnapshot, query, orderBy } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyALamMfb2VlceXLwszg7PKBbHQpFgM-HY8",
  authDomain: "danper-combustible.firebaseapp.com",
  projectId: "danper-combustible",
  storageBucket: "danper-combustible.firebasestorage.app",
  messagingSenderId: "830547462647",
  appId: "1:830547462647:web:43a9e47ae2d2cdc18a06f2"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// ─── FUNCIONES DE BASE DE DATOS ───────────────────────────────────────────────

// Guardar o actualizar un documento en una colección
export async function guardar(coleccion, id, datos) {
  const ref = doc(db, coleccion, String(id));
  await setDoc(ref, { ...datos, _updatedAt: new Date().toISOString() }, { merge: true });
}

// Obtener todos los documentos de una colección
export async function obtenerTodos(coleccion) {
  const snap = await getDocs(collection(db, coleccion));
  return snap.docs.map(d => ({ _fireId: d.id, ...d.data() }));
}

// Escuchar cambios en tiempo real en una colección
export function escuchar(coleccion, callback) {
  return onSnapshot(collection(db, coleccion), snap => {
    const datos = snap.docs.map(d => ({ _fireId: d.id, ...d.data() }));
    callback(datos);
  });
}

// Guardar la lista de maestros (un solo documento)
export async function guardarMaestros(maestros) {
  await setDoc(doc(db, "config", "maestros"), maestros);
}

// Obtener maestros
export async function obtenerMaestros() {
  const snap = await getDocs(collection(db, "config"));
  const maestrosDoc = snap.docs.find(d => d.id === "maestros");
  return maestrosDoc ? maestrosDoc.data() : null;
}

// Guardar la lista de usuarios
export async function guardarUsuarios(users) {
  await setDoc(doc(db, "config", "usuarios"), { lista: users });
}

// Obtener usuarios
export async function obtenerUsuarios() {
  const snap = await getDocs(collection(db, "config"));
  const usersDoc = snap.docs.find(d => d.id === "usuarios");
  return usersDoc ? usersDoc.data().lista : null;
}

// Guardar counter de vales
export async function guardarCounter(n) {
  await setDoc(doc(db, "config", "counter"), { valeNum: n });
}

export async function obtenerCounter() {
  const snap = await getDocs(collection(db, "config"));
  const counterDoc = snap.docs.find(d => d.id === "counter");
  return counterDoc ? counterDoc.data().valeNum : 1;
}
