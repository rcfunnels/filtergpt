import './App.css'
import googleLogo from './assets/google.svg';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import LoginScreen from './LoginScreen';



function App() {

  // Replace with your own config
  var firebaseConfig = {
    apiKey: "AIzaSyB23rpD8DI3x-spPp655x8ypNoW1ywbVfU",
    authDomain: "social-inbox-7390f.firebaseapp.com",
    projectId: "social-inbox-7390f",
    storageBucket: "social-inbox-7390f.appspot.com",
    messagingSenderId: "409687560963",
    appId: "1:409687560963:web:4d7202dd36907ddbb84f36"
  };

  firebase.initializeApp(firebaseConfig);

  let navigate = useNavigate();

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        navigate("/login");
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <Routes>
      <Route path="/login">
        <Route path=":token" element={<LoginScreen />} />
        <Route path="" element={<LoginScreen />} />
      </Route>
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
}

export default App;
