import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore} from "firebase/firestore"
import {getStorage} from "firebase/storage"

const firebaseConfig = {
    apiKey: "AIzaSyBNS2SsGOlSeJnYje-5huCnWnKaWnLP-ho",
    authDomain: "todo-e7475.firebaseapp.com",
    projectId: "todo-e7475",
    storageBucket: "todo-e7475.appspot.com",
    messagingSenderId: "724477751063",
    appId: "1:724477751063:web:87756218cba1ff78135152",
    measurementId: "G-RSKKZVW8SJ"
} 


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app)
export const storage = getStorage(app)
export default app



