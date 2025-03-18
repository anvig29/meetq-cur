/*import { useEffect, useState, useMemo } from "react";
import usePostStore from "../store/postStore";
import useAuthStore from "../store/authStore";
import useShowToast from "./useShowToast";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

const useGetFeedPosts = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { posts, setPosts } = usePostStore();
  const authUser = useAuthStore((state) => state.user);
  const showToast = useShowToast();

  useEffect(() => {
    const getFeedPosts = async () => {
      setIsLoading(true);

      if (!authUser?.following?.length) {
        setIsLoading(false);
        setPosts([]);
        return;
      }

      const q = query(
        collection(firestore, "posts"),
        where("createdBy", "in", authUser.following),
        limit(13)
      );

      try {
        const querySnapshot = await getDocs(q);
        const feedPosts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPosts(feedPosts);
      } catch (error) {
        let errorMessage = error.message;
        if (error.code === "permission-denied") {
          errorMessage = "You do not have permission to view these posts.";
        }
        showToast("Error", errorMessage, "error");
      } finally {
        setIsLoading(false);
      }
    };

    if (authUser) {
      getFeedPosts();
    }
  }, [authUser, showToast, setPosts]);

  const sortedPosts = useMemo(() => {
    return posts.sort((a, b) => b.createdAt - a.createdAt);
  }, [posts]);

  return { isLoading, posts: sortedPosts };
};

export default useGetFeedPosts;
*/

/*import { useEffect, useState, useMemo } from "react";
import usePostStore from "../store/postStore";
import useAuthStore from "../store/authStore";
import useShowToast from "./useShowToast";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

const useGetFeedPosts = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { posts, setPosts } = usePostStore();
  const authUser = useAuthStore((state) => state.user);
  const showToast = useShowToast();

  useEffect(() => {
    const getFeedPosts = async () => {
      setIsLoading(true);

      if (!Array.isArray(authUser.following) || authUser.following.length === 0) {
        setIsLoading(false);
        setPosts([]);
        return;
      }

      const q = query(
        collection(firestore, "posts"),
        where("createdBy", "in", authUser.following),
        limit(13)  
      );

      try {
        const querySnapshot = await getDocs(q);
        const feedPosts = [];

        querySnapshot.forEach((doc) => {
          feedPosts.push({ id: doc.id, ...doc.data() });
        });

        setPosts(feedPosts);
      } catch (error) {
        let errorMessage = error.message;
        if (error.code === "permission-denied") {
          errorMessage = "You do not have permission to view these posts.";
        }
        showToast("Error", errorMessage, "error");
      } finally {
        setIsLoading(false);
      }
    };

    if (authUser) {
      getFeedPosts();
    }
  }, [authUser, showToast, setPosts]);


  const sortedPosts = useMemo(() => {
    return posts.sort((a, b) => b.createdAt - a.createdAt);
  }, [posts]);

  return { isLoading, posts: sortedPosts };
};

export default useGetFeedPosts;
*/















import { useEffect, useState } from "react";
import usePostStore from "../store/postStore";
import useAuthStore from "../store/authStore";
import useShowToast from "./useShowToast";
import useUserProfileStore from "../store/userProfileStore";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

const useGetFeedPosts = () => {
	const [isLoading, setIsLoading] = useState(true);
	const { posts, setPosts } = usePostStore();
	const authUser = useAuthStore((state) => state.user);
	const showToast = useShowToast();
	const { setUserProfile } = useUserProfileStore();

	useEffect(() => {
		const getFeedPosts = async () => {
			setIsLoading(true);
			if (authUser.following.length === 0) {
				setIsLoading(false);
				setPosts([]);
				return;
			}
			const q = query(collection(firestore, "posts"), where("createdBy", "in", authUser.following));
			try {
				const querySnapshot = await getDocs(q);
				const feedPosts = [];

				querySnapshot.forEach((doc) => {
					feedPosts.push({ id: doc.id, ...doc.data() });
				});

				feedPosts.sort((a, b) => b.createdAt - a.createdAt);
				setPosts(feedPosts);
			} catch (error) {
				showToast("Error", error.message, "error");
			} finally {
				setIsLoading(false);
			}
		};

		if (authUser) getFeedPosts();
	}, [authUser, showToast, setPosts, setUserProfile]);

	return { isLoading, posts };
};

export default useGetFeedPosts;
