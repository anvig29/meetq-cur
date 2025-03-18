import { useState, useEffect } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

const useReportedPosts = () => {
  const [reportedPostIds, setReportedPostIds] = useState(new Set()); // Use Set for quick lookup
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReportedPosts = async () => {
      try {
        const reportsQuery = query(collection(firestore, "reports"));
        const reportsSnapshot = await getDocs(reportsQuery);

        // Extract only post IDs
        const reportedIds = new Set(reportsSnapshot.docs.map(doc => doc.data().postId));

        console.log("Reported Post IDs:", reportedIds); // Log the IDs to see if they are being fetched

        setReportedPostIds(reportedIds);
      } catch (error) {
        console.error("Error fetching reported posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportedPosts();
  }, []);

  return { reportedPostIds, isLoading };
};

export default useReportedPosts;


/*import { useState, useEffect } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

const useReportedPosts = () => {
  const [reportedPostIds, setReportedPostIds] = useState(new Set()); // Use Set for quick lookup
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReportedPosts = async () => {
      try {
        const reportsQuery = query(collection(firestore, "reports"));
        const reportsSnapshot = await getDocs(reportsQuery);

        // Extract only post IDs
        const reportedIds = new Set(reportsSnapshot.docs.map(doc => doc.data().postId));

        setReportedPostIds(reportedIds);
      } catch (error) {
        console.error("Error fetching reported posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportedPosts();
  }, []);

  return { reportedPostIds, isLoading };
};

export default useReportedPosts;

*/
/*import { useState, useEffect } from "react";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

const useReportedPosts = () => {
  const [reportedPosts, setReportedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReportedPosts = async () => {
      try {
        // Step 1: Fetch all reported post IDs from "reports"
        const reportsQuery = query(collection(firestore, "reports"));
        const reportsSnapshot = await getDocs(reportsQuery);
        const reportedPostIds = reportsSnapshot.docs.map(doc => doc.data().postId);

        if (reportedPostIds.length === 0) {
          setReportedPosts([]);
          setIsLoading(false);
          return;
        }

        // Step 2: Fetch post details from "posts" collection
        const postsPromises = reportedPostIds.map(async (postId) => {
          const postRef = doc(firestore, "posts", postId);
          const postSnap = await getDoc(postRef);
          return postSnap.exists() ? { id: postSnap.id, ...postSnap.data() } : null;
        });

        const reportedPostsData = (await Promise.all(postsPromises)).filter(Boolean);
        setReportedPosts(reportedPostsData);
      } catch (error) {
        console.error("Error fetching reported posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportedPosts();
  }, []);

  return { reportedPosts, isLoading };
};

export default useReportedPosts;
*/