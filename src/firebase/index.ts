// Import the functions you need from the SDKs you need
import * as Firestore from "firebase/firestore"
import { initializeApp } from "firebase/app";
import {getFirestore}  from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCJMNFHiZ7Mxq_ilmY1m1XQuzACMhORnao",
  authDomain: "bim-dev-mater.firebaseapp.com",
  projectId: "bim-dev-mater",
  storageBucket: "bim-dev-mater.firebasestorage.app",
  messagingSenderId: "604811560620",
  appId: "1:604811560620:web:6f520a246fc43558ea4109"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestoreDB = getFirestore()

export function getCollection<T>(path: string){
  return Firestore.collection(firestoreDB,path) as Firestore.CollectionReference<T>
}

export async function deleteDocument(path: string, id: string){
  const doc=Firestore.doc(firestoreDB,`${path}/${id}`) 
  await Firestore.deleteDoc(doc)

}

export async function updateDocument<T extends Record<string, any>>(path: string, id: string, data: T){
  const doc=Firestore.doc(firestoreDB,`${path}/${id}`) 
  await Firestore.updateDoc(doc, data)
}