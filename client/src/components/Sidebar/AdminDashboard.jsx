import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Button, useToast } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";
import { getAuth } from "firebase/auth";

const AdminDashboard = () => {
  const [reportedPosts, setReportedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();
  const auth = getAuth();

  // Fetch all reported posts for the admin dashboard
  useEffect(() => {
    const fetchReportedPosts = async () => {
      try {
        // Fetch all reported posts (from a separate "reports" collection)
        const reportsSnapshot = await getDocs(collection(firestore, "reports"));
        const reportedPostsData = [];

        for (const reportDoc of reportsSnapshot.docs) {
          const reportData = reportDoc.data();
          const postRef = doc(firestore, "posts", reportData.postId);
          const postSnap = await getDoc(postRef);
          
          if (postSnap.exists()) {
            reportedPostsData.push(postSnap.data());
          }
        }

        setReportedPosts(reportedPostsData);
      } catch (error) {
        console.error("Error fetching reported posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportedPosts();
  }, []);

  // Handle deleting a reported post
  const handleDeletePost = async (postId) => {
    try {
      // Delete the post from the "posts" collection
      const postDocRef = doc(firestore, "posts", postId);
      await deleteDoc(postDocRef);

      toast({
        title: "Post Deleted",
        description: "The reported post has been deleted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Remove the post from the list
      setReportedPosts((prev) => prev.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Delete Failed",
        description: "Could not delete the post.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4}>
      <Heading mb={4}>Admin Dashboard - Reported Posts</Heading>
      
      {isLoading ? (
        <Box>Loading reported posts...</Box>
      ) : (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Post Title</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {reportedPosts.map((post) => (
              <Tr key={post.id}>
                <Td>{post.title}</Td>
                <Td>
                  <Button colorScheme="red" onClick={() => handleDeletePost(post.id)}>
                    Delete
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
};

export default AdminDashboard;
