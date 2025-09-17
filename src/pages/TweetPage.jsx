import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { firestore } from "../firebase";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { postTweet } from "../firebaseFunctions/tweets";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner/Spinner";
import TweetCard from "../components/Tweet/TweetCard";
import { useForm } from "react-hook-form";

export default function TweetPage() {
  // Variables
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { tweetId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  // States
  const [mainTweet, setMainTweet] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cycle

  // Live: tweet principal + réponses
  useEffect(() => {
    setLoading(true);

    // live du tweet principal
    const unsubTweet = onSnapshot(doc(firestore, "tweets", tweetId), (snap) => {
      if (snap.exists()) {
        setMainTweet({ id: snap.id, ...snap.data() });
      } else {
        setMainTweet(null);
      }
      setLoading(false);
    });

    // live des réponses directes
    const repliesRef = collection(firestore, "tweets");
    const q = query(
      repliesRef,
      where("replyTo", "==", tweetId),
      orderBy("createdAt", "asc")
    );
    const unsubReplies = onSnapshot(q, (snap) => {
      setReplies(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubTweet();
      unsubReplies();
    };
  }, [tweetId]);

  // function
  const onReply = async ({ content }) => {
    try {
      await postTweet(user.uid, content, tweetId);
      toast.success("Réponse postée !");
      reset(); // la liste se mettra à jour via onSnapshot
    } catch (error) {
      toast.error("Erreur réponse : " + error.message);
    }
  };
  if (loading) return <Spinner />;

  if (!mainTweet) return <p>Ce tweet n'existe pas</p>;

  return (
    <div>
      <TweetCard
        tweet={mainTweet}
        onDeleted={() => {
          toast.success("Tweet supprimé.");
          navigate("/");
        }}
      />
      <form onSubmit={handleSubmit(onReply)} className="mt-6">
        <textarea
          {...register("content", {
            required: "Réponse vide ?",
            maxLength: { value: 280, message: "≤ 280 caractères" },
          })}
          className="w-full border rounded p-2"
          rows={2}
          placeholder="Ecrire une réponse"
        />
        {errors.content && (
          <p className="text-red-500 text-sm">{errors.content.message}</p>
        )}
        <button
          type="submit"
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Répondre
        </button>
      </form>

      <h4 className="mt-6 mb-2 font-semibold">Réponses</h4>
      {replies.length === 0 ? (
        <p className="text-gray-500">Pas encore de réponses.</p>
      ) : (
        replies.map((rep) => (
          <TweetCard
            key={rep.id}
            tweet={rep}
            onDeleted={() =>
              setReplies((prev) => prev.filter((t) => t.id !== rep.id))
            }
          />
        ))
      )}
    </div>
  );
}
