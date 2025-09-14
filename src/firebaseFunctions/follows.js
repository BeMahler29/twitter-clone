import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { firestore } from "../firebase";

// Pour suivre qqun                      // Follow
export async function followUser(followerId, followingId) {
  // Ref
  const followsRef = collection(firestore, "follows");

  // Vérifier si la personne est déjà suivie                // Check if the person is already being followed
  const q = query(
    followsRef,
    where("followerId", "==", followerId),
    where("followingId", "==", followingId)
  );
  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    return;
  }

  // Add to Firestore
  await addDoc(followsRef, {
    followerId,
    followingId,
    createdAt: serverTimestamp(),
  });
}

// Pour ne plus suivre la personne                             // To unfollow the person
export async function unfollowUser(followerId, followingId) {
  const followsRef = collection(firestore, "follows");

  const q = query(
    followsRef,
    where("followerId", "==", followerId),
    where("followingId", "==", followingId)
  );
  const snapshot = await getDocs(q);
  await Promise.all(
    snapshot.docs.map((docSnap) =>
      deleteDoc(doc(firestore, "follows", docSnap.id))
    )
  );
}

// Pour récupérer la liste des suivis                           // Get Following List
export async function getFollowingList(userId) {
  const followsRef = collection(firestore, "follows");
  const q = query(followsRef, where("followerId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => docSnap.data().followingId);
}
