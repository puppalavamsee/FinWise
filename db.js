import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot
} from "firebase/firestore";

import app from "./firebase";

const db = getFirestore(app);

export {
  db,
  collection,
  addDoc,
  onSnapshot
};