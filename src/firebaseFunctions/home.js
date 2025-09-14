import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
  limit,
  startAfter,
} from "firebase/firestore";
import { firestore } from "../firebase";

// récupère les tweets des personnes suivies et les notres pour le fil "abonnements"  // Get tweets from people followed and ours
export async function getFeedTweets({
  authors,
  tweetLimit,
  startAfterDoc = null,
}) {
  let q = query(
    collection(firestore, "tweets"),
    where("authorId", "in", authors),
    where("replyTo", "==", null),
    orderBy("createdAt", "desc"),
    limit(tweetLimit)
  );

  if (startAfterDoc) {
    q = query(q, startAfter(startAfterDoc));
  }

  const snapshot = await getDocs(q);
  const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const last = snapshot.docs.length
    ? snapshot.docs[snapshot.docs.length - 1]
    : null;
  const hasMore = snapshot.docs.length === tweetLimit;

  return { docs, last, hasMore };
}

// Récupère les tweets de tout le monde  pour le fil "Pour vous"   // Get everyone's tweets
export async function getAllTweets({ tweetLimit, startAfterDoc = null }) {
  let q = query(
    collection(firestore, "tweets"),
    where("replyTo", "==", null),
    orderBy("createdAt", "desc"),
    limit(tweetLimit)
  );

  if (startAfterDoc) {
    q = query(q, startAfter(startAfterDoc));
  }

  const snapshot = await getDocs(q);
  const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const last = snapshot.docs.length
    ? snapshot.docs[snapshot.docs.length - 1]
    : null;
  const hasMore = snapshot.docs.length === tweetLimit;

  return { docs, last, hasMore };
}
