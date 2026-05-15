import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyC-i8x9MdvjuoQnQT0g72FGIy3dz2qE0rg",
  authDomain: "finwise-78dce.firebaseapp.com",
  projectId: "finwise-78dce",
  storageBucket: "finwise-78dce.firebasestorage.app",
  messagingSenderId: "42718728241",
  appId: "1:42718728241:web:733501a720cd8354250510"
};

const app = initializeApp(firebaseConfig);

export default app;