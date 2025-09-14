import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { firestore } from "../../firebase";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import anonymous from "../../assets/anonymous.jpg";

export default function TweetCard({ tweet, onDeleted }) {
  // Variable
  const { user } = useAuth();

  // State
  const [author, setAuthor] = useState(null);
  const navigate = useNavigate();

  // Cycle
  useEffect(() => {
    async function fetchAuthor() {
      const userDoc = await getDoc(doc(firestore, "users", tweet.authorId));
      if (userDoc.exists()) setAuthor(userDoc.data());
    }
    fetchAuthor();
  }, [tweet.authorId]);

  //  Function

  const stop = (e) => e.stopPropagation();

  if (!author) return <div className="p-4">Loading...</div>;

  return (
    <div
      className="border-b border-gray-200 py-4 hover:bg-gray-50 transition cursor-pointer"
      onClick={() => navigate(`/tweet/${tweet.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) =>
        (e.key === "Enter" || e.key === " ") && navigate(`/tweet/${tweet.id}`)
      }
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
            onClick={(e) => {
              stop(e);
              // suppression inchangée
              if (
                !window.confirm("Etes-vous sûr de vouloir supprimer ce tweet ?")
              )
                return;
              deleteDoc(doc(firestore, "tweets", tweet.id))
                .then(() => {
                  toast.success("Tweet supprimé !");
                  onDeleted && onDeleted();
                })
                .catch((error) =>
                  toast.error(
                    "Erreur lors de la suppression : " + error.message
                  )
                );
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
