// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signOut } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCV-IDYuLCFjkKLSuq0FtMkfQHNjWhQ2pM",
  authDomain: "nica-source-video-app.firebaseapp.com",
  projectId: "nica-source-video-app",
  storageBucket: "nica-source-video-app.appspot.com",
  messagingSenderId: "442847289081",
  appId: "1:442847289081:web:8a1852153b200afdf8cc28",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const logOut = () => {
  signOut(auth).then((res) => {
    console.log(res);
    window.location.replace("/")
  });
};

export { auth, app,  logOut};


