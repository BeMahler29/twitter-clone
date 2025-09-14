import { getFeedTweets, getAllTweets } from "../firebaseFunctions/home";
import { useAuth } from "../contexts/AuthContext";
import { useCallback, useEffect, useState } from "react";
import { getFollowingList } from "../firebaseFunctions/follows";
import Spinner from "../components/Spinner/Spinner";
import CreateTweet from "../components/Tweet/CreateTweet";
import TweetCard from "../components/Tweet/TweetCard";
import { toast } from "react-toastify";

export default function Home() {
  // Variables
  const { user } = useAuth();
  const tweetLimit = 10; // tweet limit = 10 because "in" Firestore

  // States
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [following, setFollowing] = useState(true);

  // Function

  // Get 1st page according to the tab
  const fetchInitial = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    try {
      let result;

      if (following) {
        const followings = await getFollowingList(user.uid);
        const authors = [...followings, user.uid].slice(0, tweetLimit);
        result = await getFeedTweets({ authors, tweetLimit });
      } else {
        // !following
        result = await getAllTweets({ tweetLimit });
      }

      setTweets(result.docs);
      setLastDoc(result.last);
      setHasMore(result.hasMore);
    } catch (err) {
      toast.error("Une erreur est survenue :" + err.message);
    } finally {
      setLoading(false);
    }
  }, [user, following]);

  // Cycle
  // The first page
  useEffect(() => {
    fetchInitial();
  }, [fetchInitial]);

  // Function

  // More tweets
  const loadMore = async () => {
    if (!lastDoc) return;
    setLoadingMore(true);

    try {
      let result;

      if (following) {
        const followings = await getFollowingList(user.uid);
        const authors = [...followings, user.uid].slice(0, tweetLimit);
        result = await getFeedTweets({
          authors,
          tweetLimit,
          startAfterDoc: lastDoc,
        });
      } else {
        result = await getAllTweets({
          tweetLimit,
          startAfterDoc: lastDoc,
        });
      }

      setTweets((prev) => [...prev, ...result.docs]);
      setLastDoc(result.last);
      setHasMore(result.hasMore);
    } catch (err) {
      toast.error("Une erreur est survenue :" + err.message);
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-4">
      {/* Switch Tab */}
      <div className="flex gap-6 border-b border-gray-200 pb-2">
        <button
          className={`pb-2 cursor-pointer ${
            following
              ? "font-semibold border-b-2 border-blue-500"
              : "text-gray-500"
          }`}
          onClick={() => {
            if (!following) {
              setFollowing(true);
            }
          }}
        >
          Abonnements
        </button>
        <button
          className={`pb-2 cursor-pointer ${
            !following
              ? "font-semibold border-b-2 border-blue-500"
              : "text-gray-500"
          }`}
          onClick={() => {
            if (following) {
              setFollowing(false);
            }
          }}
        >
          Pour vous
        </button>
      </div>
      <CreateTweet currentUser={user} onPosted={fetchInitial} />

      {tweets.map((tw) => (
        <TweetCard key={tw.id} tweet={tw} onDeleted={fetchInitial} />
      ))}

      {hasMore && (
        <div className="flex justify-center">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition"
          >
            {loadingMore ? "Chargement..." : "Encore plus de tweets"}
          </button>
        </div>
      )}
    </div>
  );
}
