import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBi1HEAKLpsGrwB8okTn_AOJ0l0AvvFpb0",
  authDomain: "docu-share-2daee.firebaseapp.com",
  projectId: "docu-share-2daee",
  storageBucket: "docu-share-2daee.appspot.com",
  messagingSenderId: "6096885039",
  appId: "1:6096885039:web:a7cb4590ceebda70383dda",
  measurementId: "G-8191TXFCYZ",
  databaseURL: "https://docu-share-2daee-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app
