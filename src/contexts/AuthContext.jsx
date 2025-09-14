import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth, firestore } from "../firebase";
import { createContext, useContext, useEffect, useState } from "react";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Changement d'états de connexion   // On Authentication State Change
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsub;
  }, []);

  // Fonction inscription                 // Signup
  async function signup(email, password, displayName) {
    const credentials = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // MAJ du profil Firebase Auth        // Update Firebase Profile
    await updateProfile(credentials.user, { displayName });

    // Création du doc utilisateur dans Firestore     // Create doc users in Firestore
    const userDocRef = doc(firestore, "users", credentials.user.uid);
    await setDoc(userDocRef, {
      uid: credentials.user.uid,
      displayName,
      email,
      photoURL: "",
      createdAt: serverTimestamp(),
    });
    return credentials;
  }

  // Login
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Logout
  function logout() {
    return signOut(auth);
  }

  const authValue = {
    user,
    loading,
    signup,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
}
