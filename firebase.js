import { initializeApp } from "firebase/app";

const firebaseConfig = {
  authDomain: "finwise-78dce.firebaseapp.com",
  projectId: "finwise-78dce",
  storageBucket: "finwise-78dce.firebasestorage.app",
};

const app = initializeApp(firebaseConfig);

export default app;