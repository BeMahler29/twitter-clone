import {
  collection,
  doc,
  getDocs,
  query,
  where,
  deleteDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { firestore } from "../firebase";

export async function postTweet(authorId, content, replyTo = null) {
  // Ref
  const tweetsRef = collection(firestore, "tweets");

  // Data
  const newTweet = {
    authorId,
    content,
    createdAt: serverTimestamp(),
    replyTo: replyTo || null,
  };

  // Ajouter le tweet sur Firestore                                           // Add tweet in Firestore
  const docRef = await addDoc(tweetsRef, newTweet);
  return docRef.id;
}

export async function deleteTweetThread(tweetId) {
  // Récupérer les réponses directes                                          // Get the direct replies
  const repliesRef = collection(firestore, "tweets");
  const q = query(repliesRef, where("replyTo", "==", tweetId));
  const snap = await getDocs(q);

  // Supprimer récursivement toutes les sous-réponses, puis la réponse        // delete the replies of the replies
  await Promise.all(
    snap.docs.map(async (d) => {
      await deleteTweetThread(d.id);
      await deleteDoc(doc(firestore, "tweets", d.id));
    })
  );

  // 3) Supprimer le tweet courant                                             // delete the current Tweet
  await deleteDoc(doc(firestore, "tweets", tweetId));
}
