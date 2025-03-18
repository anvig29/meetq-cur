/*import { Box, Container, Text, VStack } from "@chakra-ui/react";
import FeedPost from "./FeedPost";
import useGetFeedPosts from "../../hooks/useGetFeedPosts";
import { useState, useEffect } from "react";

const FeedPosts = () => {
  const { isLoading, posts } = useGetFeedPosts();
  const [feedPosts, setFeedPosts] = useState(posts);

  useEffect(() => {
    setFeedPosts(posts);
  }, [posts]);

  return (
    <Container maxW="container.sm" py={1} px={2}>
      {isLoading && [0, 1, 2].map((_, idx) => (
        <VStack key={idx} gap={4} alignItems="flex-start" mb={10}>

          <Text>Loading...</Text>
        </VStack>
      ))}

      {!isLoading && feedPosts.length > 0 &&
        feedPosts.map((post) => <FeedPost key={post.id} post={post} />)}

      {!isLoading && feedPosts.length === 0 && (
        <Box textAlign="center" mt={10}>
          <Text fontSize="lg" color="gray.500">
            No posts found. Try following more people!
          </Text>
        </Box>
      )}
    </Container>
  );
};

export default FeedPosts;


/*import { Box, Container, Text, VStack } from "@chakra-ui/react";
import FeedPost from "./FeedPost";
import useGetFeedPosts from "../../hooks/useGetFeedPosts";
import { useState, useEffect } from "react";

const FeedPosts = () => {
  const { isLoading, posts } = useGetFeedPosts();
  const [feedPosts, setFeedPosts] = useState(posts);

  // Handle post deletion by removing it from the feed
  const handlePostDelete = (deletedPostId) => {
    setFeedPosts((prevPosts) => prevPosts.filter(post => post.id !== deletedPostId));
  };

  useEffect(() => {
    setFeedPosts(posts);
  }, [posts]);

  return (
    <Container maxW="container.sm" py={1} px={2}>
      {isLoading &&
        [0, 1, 2].map((_, idx) => (
          <VStack key={idx} gap={4} alignItems="flex-start" mb={10}>
            
          </VStack>
        ))}

      {!isLoading &&
        feedPosts.length > 0 &&
        feedPosts.map((post) => (
          <FeedPost key={post.id} post={post} onPostDelete={handlePostDelete} />
        ))}

      {!isLoading && feedPosts.length === 0 && (
        <Box textAlign="center" mt={10}>
          <Text fontSize="lg" color="gray.500">
            No posts found. Try following more people!
          </Text>
        </Box>
      )}
    </Container>
  );
};

export default FeedPosts;

*/


import { Box, Container, Flex, Skeleton, SkeletonCircle, Text, VStack } from "@chakra-ui/react";
import FeedPost from "./FeedPost";
import useGetFeedPosts from "../../hooks/useGetFeedPosts";

const FeedPosts = () => {
  const { isLoading, posts } = useGetFeedPosts();

  return (
    <Container maxW="container.sm" py={1} px={2}>
      {isLoading &&
        [0, 1, 2].map((_, idx) => (
          <VStack key={idx} gap={4} alignItems="flex-start" mb={10}>
            <Flex gap="2">
              <SkeletonCircle size="10" />
              <VStack gap={2} alignItems="flex-start">
                <Skeleton height="10px" w="200px" />
                <Skeleton height="10px" w="200px" />
              </VStack>
            </Flex>
            <Skeleton w="full">
              <Box h="400px">Loading post...</Box>
            </Skeleton>
          </VStack>
        ))}

      {!isLoading &&
        posts.length > 0 &&
        posts.map((post) => <FeedPost key={post.id} post={post} />)}

      {!isLoading && posts.length === 0 && (
        <Box textAlign="center" mt={10}>
          <Text fontSize="lg" color="gray.500">
            No posts found. Try following more people!
          </Text>
        </Box>
      )}
    </Container>
  );
};

export default FeedPosts;



