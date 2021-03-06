// Import the functions you need from the SDKs you need
// import firebase from 'firebase-admin';

import { getDateSorter } from "./utils/sorters";

// import { initializeApp } from 'firebase/app';
const firebase = require("firebase/app");
const initializeApp = firebase.initializeApp;
// import { getAnalytics } from 'firebase/analytics';
// import { getDatabase } from 'firebase/database';
const getFirestore = require("firebase/firestore/lite").getFirestore;
export const collection = require("firebase/firestore/lite").collection;
export const getDocs = require("firebase/firestore/lite").getDocs;
export const _getDoc = require("firebase/firestore/lite").getDoc;
export const _setDoc = require("firebase/firestore/lite").setDoc;
export const query = require("firebase/firestore/lite").query;
export const where = require("firebase/firestore/lite").where;
export const doc = require("firebase/firestore/lite").doc;
export const _deleteDoc = require("firebase/firestore/lite").deleteDoc;
export const serverTimestamp =
  require("firebase/firestore/lite").serverTimestamp;
export const getAuth = require("firebase/auth").getAuth;
export const deleteUser = require("firebase/auth").deleteUser;
export const updateProfile = require("firebase/auth").updateProfile;
export const updatePassword = require("firebase/auth").updatePassword;
export const updateEmail = require("firebase/auth").updateEmail;
export const signInWithEmailAndPassword =
  require("firebase/auth").signInWithEmailAndPassword;
export const createUserWithEmailAndPassword =
  require("firebase/auth").createUserWithEmailAndPassword;

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCuEhWEkQ2izuteD7zggQFuJ1ji7I2TGZM",
  authDomain: "toptal-test-ba424.firebaseapp.com",
  projectId: "toptal-test-ba424",
  storageBucket: "toptal-test-ba424.appspot.com",
  messagingSenderId: "748907834625",
  appId: "1:748907834625:web:4ca52b2080d3ae1c433f00",
  measurementId: "G-R18RN8J4TG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// const analytics = getAnalytics(app);
// export const db = getDatabase(app);

export const getDoc = async (collectionName, id) =>
  (await _getDoc(doc(db, collectionName, id))).data();

export const getByUniqueField = async (collectionName, fieldName, value) => {
  const q = query(
    collection(db, collectionName),
    where(fieldName, "==", value)
  );
  let data = null;
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    // console.log(doc.id, " => ", doc.data());
    data = doc.data();
  });
  return data;
};

export const setDoc = async (path, data) => await _setDoc(doc(db, path), data);
export const deleteDoc = async (path) => await _deleteDoc(doc(db, path));
export const fetchDocs = async (collectionName) =>
  (await getDocs(collection(db, collectionName))).docs
    .map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        ...data,
        createdAt: !(
          typeof data.createdAt === "string" || data.createdAt instanceof String
        )
          ? data.createdAt?.toDate()?.toString()
          : data.createdAt,
      };
    })
    .sort(getDateSorter("createdAt"))
    .reverse();
