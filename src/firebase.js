// ─── CONFIGURACIÓN FIREBASE ───────────────────────────────────────────────────
// Credenciales de danper-combustible
import { initializeApp } from "firebase/app";
import {
  getFirestore, collection, doc,
  getDocs, getDoc, setDoc,
  onSnapshot, runTransaction
} from "firebase/firestore";

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

// Guardar o actualizar un documento en una colección.
// Usa merge:true para no perder campos que no estén en `datos`.
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

// Guardar la lista de maestros (un solo documento).
// merge:true evita borrar campos que no se incluyan en `maestros`
// (importante cuando dos clientes editan secciones distintas en paralelo).
export async function guardarMaestros(maestros) {
  await setDoc(
    doc(db, "config", "maestros"),
    { ...maestros, _updatedAt: new Date().toISOString() },
    { merge: true }
  );
}

// Obtener maestros (lectura directa por id, más eficiente que listar la colección)
export async function obtenerMaestros() {
  const ref = doc(db, "config", "maestros");
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

// Guardar la lista de usuarios
export async function guardarUsuarios(users) {
  await setDoc(
    doc(db, "config", "usuarios"),
    { lista: users, _updatedAt: new Date().toISOString() },
    { merge: true }
  );
}

// Obtener usuarios
export async function obtenerUsuarios() {
  const ref = doc(db, "config", "usuarios");
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data().lista || null) : null;
}

// Guardar counter de vales (escritura simple — válida cuando el caller
// ya obtuvo el siguiente número con reservarSiguienteVale).
export async function guardarCounter(n) {
  await setDoc(
    doc(db, "config", "counter"),
    { valeNum: n, _updatedAt: new Date().toISOString() },
    { merge: true }
  );
}

export async function obtenerCounter() {
  const ref = doc(db, "config", "counter");
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data().valeNum || 1) : 1;
}

// ─── CONTADOR ATÓMICO ─────────────────────────────────────────────────────────
// Reserva el siguiente N° de vale de forma atómica (transacción).
// Garantiza unicidad incluso cuando varios almaceneros despachan en paralelo
// desde distintas terminales. Devuelve el número que el cliente debe usar
// y deja el contador ya incrementado en Firestore.
export async function reservarSiguienteVale() {
  const ref = doc(db, "config", "counter");
  return await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    const actual = snap.exists() ? (snap.data().valeNum || 1) : 1;
    const siguiente = actual + 1;
    tx.set(ref, { valeNum: siguiente, _updatedAt: new Date().toISOString() }, { merge: true });
    return actual; // este es el número que el cliente usará
  });
}

// Libera un número de vale previamente reservado, cuando el guardado del vale
// falló. Esto evita huecos en la numeración (ej. V-000014, V-000016...) que
// rompen auditoría SAP.
//
// Lógica de la transacción:
//  - Si el contador actual en Firestore es exactamente `numero+1`, significa
//    que nadie más reservó después de nosotros → lo devolvemos a `numero`.
//  - Si el contador ya avanzó más (otro almacenero reservó en paralelo), NO
//    tocamos nada — sería pisar su reserva y generar duplicados. En ese caso
//    el hueco es inevitable, pero solo bajo concurrencia real.
//
// Devuelve true si pudo liberar, false si no (por concurrencia).
export async function liberarVale(numero) {
  if (numero == null || numero < 1) return false;
  const ref = doc(db, "config", "counter");
  try {
    return await runTransaction(db, async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists()) return false;
      const actual = snap.data().valeNum || 1;
      // Solo liberar si nadie más reservó después
      if (actual === numero + 1) {
        tx.set(ref, { valeNum: numero, _updatedAt: new Date().toISOString() }, { merge: true });
        return true;
      }
      return false;
    });
  } catch (e) {
    console.warn("Error al liberar vale", numero, e);
    return false;
  }
}
