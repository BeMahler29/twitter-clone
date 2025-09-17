import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { deleteTweetThread } from "../../firebaseFunctions/tweets";
import { firestore } from "../../firebase";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import anonymous from "../../assets/anonymous.jpg";

export default function TweetCard({ tweet, onDeleted }) {
  // Variable
  const { user } = useAuth();
  const navigate = useNavigate();

  // State
  const [author, setAuthor] = useState(null);
  const [replyCount, setReplyCount] = useState(0);

  // Cycles
  useEffect(() => {
    async function fetchAuthor() {
      const userDoc = await getDoc(doc(firestore, "users", tweet.authorId));
      if (userDoc.exists()) setAuthor(userDoc.data());
    }
    fetchAuthor();
  }, [tweet.authorId]);

  // Mise à jour en temps réel du nombre de réponses                        // Realtime replies counter update
  useEffect(() => {
    const repliesRef = collection(firestore, "tweets");
    const q = query(repliesRef, where("replyTo", "==", tweet.id));

    const unsubscribe = onSnapshot(q, (snap) => {
      setReplyCount(snap.size);
    });

    return () => unsubscribe();
  }, [tweet.id]);

  //  Function

  const stop = (e) => e.stopPropagation();

  if (!author) return <div className="p-4">Loading...</div>;

  return (
    <div
      className="border-b border-gray-200 py-4 hover:bg-gray-50 transition cursor-pointer"
      onClick={() => navigate(`/tweet/${tweet.id}`)}
      role="button"
      tabIndex={0}
    >
      <div className="flex items-center mb-2">
        <img
          src={author.photoURL || anonymous}
          alt="avatar"
          className="w-10 h-10 rounded-full mr-2"
          onClick={stop}
        />
        <Link
          to={`/profile/${author.uid}`}
          className="font-semibold hover:underline"
          onClick={stop}
        >
          {author.displayName}
        </Link>

        {/* Le timestamp = permalien vers le tweet */}
        <Link
          to={`/tweet/${tweet.id}`}
          className="text-sm text-gray-500 ml-2 hover:underline"
          onClick={stop}
        >
          {tweet.createdAt?.toDate().toLocaleString()}
        </Link>

        {user && user.uid === tweet.authorId && (
          <button
            className="ml-auto text-red-500 hover:underline text-sm"
            onClick={async (e) => {
              stop(e);
              if (
                !window.confirm("Etes-vous sûr de vouloir supprimer ce tweet ?")
              )
                return;
              try {
                await deleteTweetThread(tweet.id);
                  toast.success("Tweet supprimé !");
                  onDeleted && onDeleted();
              } catch (error) {
                toast.error("Erreur lors de la suppression : " + error.message);
              }
            }}
          >
            Supprimer
          </button>
        )}
      </div>

      <p className="ml-12 text-gray-800 break-words ">{tweet.content}</p>
      <div className="ml-12 mt-2 flex items-center gap-4" onClick={stop}>
        <Link
          to={`/tweet/${tweet.id}`}
          className="text-blue-500 text-sm hover:underline"
        >
          Répondre
        </Link>
      </div>
    </div>
  );
}
