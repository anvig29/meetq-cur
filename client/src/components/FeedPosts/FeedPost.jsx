import { Box, Image, Divider, useToast } from "@chakra-ui/react";
import PostFooter from "./PostFooter";
import PostHeader from "./PostHeader";
import useGetUserProfileById from "../../hooks/useGetUserProfileById";
import { useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";
import { getAuth } from "firebase/auth";
import useReportPost from "../../hooks/useReportPost";

const FeedPost = ({ post }) => {
  const [nsfwResult, setNsfwResult] = useState(null);
  const toast = useToast();
  const auth = getAuth();
  const [currentUser, setCurrentUser] = useState(null);
  const [isDeleted, setIsDeleted] = useState(post.isDeleted);

  const { userProfile } = useGetUserProfileById(post.createdBy);
  const [isReporting, setIsReporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Admin emails
  const adminEmails = [
    "anvigautam19@gmail.com",
    "shwetamandalbm@gmail.com",
    "suresh12345x@gmail.com",
  ];

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user || null);
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    const analyzeImageForNSFW = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/analyzeImage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageURL: post.imageURL }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        setNsfwResult(result);
        console.log("📊 NSFW Result:", result);
      } catch (error) {
        console.error("❌ Error analyzing image:", error);
      }
    };

    if (post?.imageURL) {
      console.log("🖼️ Analyzing image for NSFW content...");
      analyzeImageForNSFW();
    }
  }, [post]);

  const reportPost = useReportPost();

  const isAdmin = currentUser && adminEmails.includes(currentUser.email);

  const handleDeletePost = async () => {
    if (!isAdmin) return;

    setIsDeleted(true); 

    try {
      const postRef = doc(firestore, "posts", post.id);
      await updateDoc(postRef, { isDeleted: true });
      toast({
        title: "Post Deleted",
        description: "The post has been deleted successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        //title: "Error",
        description:"Ensure your content is safe.",
        //description: "An error occurred while deleting the post. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box my={4} position="relative" backgroundColor="white" borderRadius="8px" boxShadow="sm" p={4}>
      {/* Overlay !!check navigate error, bio, error on deleting*/}
      {isDeleted && (
        <Box 
          position="absolute" 
          top={0} 
          left={0} 
          right={0} 
          bottom={0} 
          backgroundColor="rgba(0, 0, 0, 0.6)" 
          display="flex" 
          alignItems="center" 
          justifyContent="center"
          borderRadius="8px"
          zIndex={2}
        >
          <Box 
            backgroundColor="rgba(244, 70, 70, 0.73)" 
            p={3} 
            borderRadius="8px" 
            boxShadow="md" 
            textAlign="center"
          >
            <strong>This post has been deleted by admin!</strong>
          </Box>
        </Box>
      )}

      {/* Post Content - Visible only if not deleted or if user is admin */}
      {!isDeleted || isAdmin ? (
        <>
          <PostHeader post={post} creatorProfile={userProfile} onDeleteClick={handleDeletePost} />
          <Divider my={2} borderColor="gray.300" borderWidth="0.9px" />
          <Box my={2} borderRadius={4} overflow="hidden">
            <Image src={post.imageURL} alt="Feed Post" />
          </Box>
          {nsfwResult && isAdmin && (
            <Box mt={2} p={2} borderRadius="8px" backgroundColor="gray.100">
              <p><strong>NSFW Report-</strong></p>
              <pre>{JSON.stringify(nsfwResult, null, 2)}</pre>
            </Box>
          )}
          <PostFooter post={post} />
        </>
      ) : null}
    </Box>
  );
};

export default FeedPost;


/*CODE IS WORKING WELL!!*/
/*import { Box, Image, Divider, useToast } from "@chakra-ui/react";
import PostFooter from "./PostFooter";
import PostHeader from "./PostHeader";
import useGetUserProfileById from "../../hooks/useGetUserProfileById";
import { useState, useEffect } from "react";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";
import { getAuth } from "firebase/auth";
import useReportPost from "../../hooks/useReportPost";

const FeedPost = ({ post }) => {
  const [nsfwResult, setNsfwResult] = useState(null); // Store NSFW analysis result
  const toast = useToast();
  const auth = getAuth();
  const [currentUser, setCurrentUser] = useState(null);

  const { userProfile } = useGetUserProfileById(post.createdBy);
  const [isReporting, setIsReporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user || null);
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    const analyzeImageForNSFW = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/analyzeImage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageURL: post.imageURL }),
        });
        

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        setNsfwResult(result);
        console.log("📊 NSFW Result:", result);
      } catch (error) {
        console.error("❌ Error analyzing image:", error);
      }
    };

    if (post?.imageURL) {
      console.log("🖼️ Analyzing image for NSFW content...");
      analyzeImageForNSFW();
    }
  }, [post]);

  const reportPost = useReportPost();

  const handleReportPost = async () => {
    setIsReporting(true);

    if (!currentUser) {
      console.error("❌ User not logged in.");
      setIsReporting(false);
      return;
    }

    try {
      const reportData = {
        reportedBy: currentUser.uid,
        postId: post.id,
        imageURL: post.imageURL,
        caption: post.caption,
        reason: "Spam", 
        timestamp: new Date().toISOString(),
      };

      const postRef = doc(firestore, "posts", post.id);
      await updateDoc(postRef, {
        reported: arrayUnion(currentUser.uid),
      });

      toast({
        title: "✅ Report Submitted",
        description: "Post has been reported successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("❌ Error reporting post:", error);
      toast({
        title: "Error",
        description: "Failed to report the post. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsReporting(false);
    }
  };

  const handleSavePost = async () => {
    if (!currentUser) {
      console.error("❌ User not logged in.");
      return;
    }

    setIsSaving(true);
    try {
      const userDocRef = doc(firestore, "users", currentUser.uid);
      await updateDoc(userDocRef, {
        savedPosts: arrayUnion(post.id),
      });

      toast({
        title: "✅ Post Saved",
        description: "The post has been saved to your profile.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("❌ Error saving post:", error);
      toast({
        title: "Save Failed",
        description: "Could not save the post.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
    console.log("Updated saved posts for user:", currentUser.uid);
  };

  return (
    <Box my={4} position="relative" backgroundColor="white" borderRadius="8px" boxShadow="sm" p={4}>
      <PostHeader
        post={post}
        creatorProfile={userProfile}
        onReportClick={handleReportPost}
        
      />

      <Divider my={2} borderColor="gray.300" borderWidth="0.9px" />

      <Box my={2} borderRadius={4} overflow="hidden">
        <Image src={post.imageURL} alt="Feed Post" />
      </Box>

      {nsfwResult && (
        <Box mt={2} p={2} borderRadius="8px" backgroundColor="gray.100">
          <p><strong>NSFW Score:</strong></p>
          <pre>{JSON.stringify(nsfwResult, null, 2)}</pre>
        </Box>
      )}

      <PostFooter post={post} />
    </Box>
  );
};

export default FeedPost;*/