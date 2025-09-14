import { collection, addDoc, serverTimestamp } from "firebase/firestore";
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

  // Ajouter le tweet sur Firestore
  const docRef = await addDoc(tweetsRef, newTweet);
  return docRef.id;
}
