import { useState, useEffect } from "react";
import { Box, Table, Thead, Tbody, Tr, Th, Td, Button, useToast } from "@chakra-ui/react";
import { firestore } from "../../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

const AdminReports = () => {
  const [reportedPosts, setReportedPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        // Fetch reported posts or any reports collection from Firestore
        const reportsSnapshot = await getDocs(collection(firestore, "reports"));
        const reportedPostsData = [];

        reportsSnapshot.forEach((doc) => {
          reportedPostsData.push(doc.data());
        });

        setReportedPosts(reportedPostsData);
      } catch (error) {
        console.error("Error fetching reports:", error);
        toast({
          title: "Error",
          description: "Failed to load reports.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <Box p={4}>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Post Title</Th>
            <Th>Reason</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {loading ? (
            <Tr>
              <Td colSpan="3">Loading reports...</Td>
            </Tr>
          ) : (
            reportedPosts.map((report, index) => (
              <Tr key={index}>
                <Td>{report.postTitle}</Td>
                <Td>{report.reason}</Td>
                <Td>
                  <Button colorScheme="red" onClick={() => {/* Handle delete or action */}}>
                    Take Action
                  </Button>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
    </Box>
  );
};

export default AdminReports;
