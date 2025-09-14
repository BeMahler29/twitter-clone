import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCallback, useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { firestore } from "../firebase";
import { followUser, unfollowUser } from "../firebaseFunctions/follows";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner/Spinner";
import anonymous from "../assets/anonymous.jpg";
import TweetCard from "../components/Tweet/TweetCard";

export default function Profile() {
  // Variables
  const { uid } = useParams();
  const { user } = useAuth();

  // States
  const [profileUser, setProfileUser] = useState(null);
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isMe, setIsMe] = useState(false);

  // function
  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    try {
      // Récupère l'utilisateur visité                      // Get the visited user
      const userDoc = await getDoc(doc(firestore, "users", uid));
      if (userDoc.exists()) {
        setProfileUser(userDoc.data());
        setIsMe(user && user.uid === uid);
      }

      // Récupérer les tweets de l'utilisateur              // Get user's tweets
      const tweetsRef = collection(firestore, "tweets");
      const q = query(
        tweetsRef,
        where("authorId", "==", uid),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(q);
      const tws = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setTweets(tws);

      // Vérifier si je suis l'utilisateur (si ce n'est pas moi)           //Check if I follow the user (if it's not me)
      if (user && user.uid !== uid) {
        const followDocs = await getDocs(
          query(
            collection(firestore, "follows"),
            where("followerId", "==", user.uid),
            where("followingId", "==", uid)
          )
        );
        setIsFollowing(!followDocs.empty);
      }
    } catch (err) {
      toast.error("Une erreur est survenue :" + err.message);
    } finally {
      setLoading(false);
    }
  }, [uid, user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Suivre la personne                               // Follow  the user
  const handleFollow = async () => {
    try {
      await followUser(user.uid, uid);
      setIsFollowing(true);
      toast.success("Compte suivi 👍");
    } catch (error) {
      toast.error("Erreur follow : " + error.message);
    }
  };

  // Ne plus suivre la personne                         // Unfollow the user
  const handleUnfollow = async () => {
    try {
      await unfollowUser(user.uid, uid);
      setIsFollowing(false);
      toast.info("Vous vous êtes désabonné.");
    } catch (error) {
      toast.error("Erreur unfollow : " + error.message);
    }
  };

  if (loading) return <Spinner />;

  if (!profileUser) return <p>Utilisateur introuvable.</p>;

  return (
    <div>
      <div className="flex items-center mb-6">
        <img
          src={profileUser.photoURL || anonymous}
          alt="avatar"
          className="w-20 h-20 rounded-full mr-4"
        />
        <div>
          <h2 className="text-2xl font-semibold">{profileUser.displayName}</h2>
          <p className="text-gray-500">
            Membre depuis{" "}
            {profileUser.createdAt?.toDate?.().toLocaleDateString?.() || "-"}
          </p>
        </div>
        {!isMe && user && (
          <button
            onClick={isFollowing ? handleUnfollow : handleFollow}
            className={`ml-auto px-4 py-2 rounded ${
              isFollowing
                ? "bg-gray-300 text-gray-700"
                : "bg-blue-500 text-white"
            } hover:opacity-90 transition`}
          >
            {isFollowing ? "Abonné" : "S'abonner"}
          </button>
        )}
      </div>
      <h3 className="text-xl mb-4">Tweets</h3>
      {tweets.length === 0 ? (
        <p className="text-gray-500">Aucun tweet pour le moment.</p>
      ) : (
        tweets.map((tw) => (
          <TweetCard
            key={tw.id}
            tweet={tw}
            onDeleted={() =>
              setTweets((prev) => prev.filter((t) => t.id !== tw.id))
            }
          />
        ))
      )}
    </div>
  );
}
