import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import "firebase/compat/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "<your api key here>",
  authDomain: "your authDomain here",
  projectId: "<your projectId here>",
  storageBucket: "<your storageBucket here>",
  messagingSenderId: "<your messagingSenderId here>",
  appId: "<your appId here>",
  measurementId: "<your measurementId here>",
};

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

// accessing and using the firestore
const db = app.firestore();
const storage = firebase.storage();
const auth = firebase.auth(app);
const provider = new firebase.auth.GoogleAuthProvider();

export { db, storage, provider, auth };
