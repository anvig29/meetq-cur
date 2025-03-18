import { Avatar, Box, Flex, Image, Text, Badge } from "@chakra-ui/react";
import useAuthStore from "../../store/authStore";
import { Link } from "react-router-dom";

// Default banner image URL
const DEFAULT_BANNER_URL = "https://via.placeholder.com/300x80?text=Profile+Banner";

const SuggestedHeader = () => {
  const authUser = useAuthStore((state) => state.user);

  if (!authUser) return null;

  // Dummy Account Type Logic
  const isFanAccount = Math.random() < 0.5; // 50% chance for fan account
  const dummyIdol = ["@taylorswift", "@ratan_tata", "@bts_official", "@arianagrande", "@tom_cruise", "@justinbieber"][
    Math.floor(Math.random() * 6)
  ]; // Random idol

  return (
    <Box w="full" borderRadius="md" overflow="hidden" bg="white" mt={-12}>
      {/* Banner Section */}
      <Box w="100%" h="80px">
        <Image
          src={authUser.bannerURL || "https://i2.wp.com/rerouting.ca/wp-content/uploads/2021/03/Simple-Technology-LinkedIn-Banner-1.png?resize=1536%2C384&ssl=1"}
          alt="Profile Banner"
          w="100%"
          h="100%"
          objectFit="cover"
        />
      </Box>

      {/* User Info Section */}
      <Flex justifyContent="space-between" alignItems="center" w="full" p={3}>
        <Flex alignItems="center" gap={3}>
          <Link to={`/${authUser.username}`}>
            <Avatar size="lg" src={authUser.profilePicURL} mt={-9} ml={-2} />
          </Link>
          <Flex direction="column" justifyContent="center">
            <Link to={`/${authUser.username}`}>
              <Text fontSize={14} fontWeight="bold" mt={-4} ml={-2}>
                {authUser.username}
              </Text>
            </Link>
            {authUser.bio && (
              <Text fontSize={12} color="gray.500">
                {authUser.bio}
              </Text>
            )}

            {/* Dummy Account Type Tag */}
            {isFanAccount ? (
              <Flex direction="column">
                <Badge colorScheme="purple" mt={2} ml={-3} fontSize="0.75em">
                  Fan Account
                </Badge>
                <Text fontSize="0.7em" ml={-3} color="purple.600">
                  {dummyIdol}
                </Text>
              </Flex>
            ) : (
              <Badge colorScheme="blue" mt={2} ml={-4} fontSize="0.75em">
                Personal Account
              </Badge>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};

export default SuggestedHeader;



/*import { Avatar, Box, Flex, Image, Text } from "@chakra-ui/react";
import useAuthStore from "../../store/authStore";
import { Link } from "react-router-dom";

// Default banner image URL
const DEFAULT_BANNER_URL = "https://via.placeholder.com/300x80?text=Profile+Banner";

const SuggestedHeader = () => {
  const authUser = useAuthStore((state) => state.user);

  if (!authUser) return null;

  return (
    <Box w="full" borderRadius="md" overflow="hidden" bg="white" mt={-12}>
      
     
      <Box 
        w="100%" 
        h="80px" 
        
      >
        <Image
          src={authUser.bannerURL || "https://i2.wp.com/rerouting.ca/wp-content/uploads/2021/03/Simple-Technology-LinkedIn-Banner-1.png?resize=1536%2C384&ssl=1"}
          alt="Profile Banner"
          w="100%"
          h="100%"
          objectFit="cover"
        />
      </Box>

    
      <Flex justifyContent="space-between" alignItems="center" w="full" p={3}>
        <Flex alignItems="center" gap={3}>
          <Link to={`/${authUser.username}`}>
            <Avatar 
              size="lg" 
              src={authUser.profilePicURL} 
              mt={-9}  
              ml={-2} 
            />
          </Link>
          <Flex direction="column" justifyContent="center">
            <Link to={`/${authUser.username}`}>
              <Text fontSize={14} fontWeight="bold" mt={-6} ml={-2}>
                {authUser.username}
              </Text>
            </Link>
            {authUser.bio && (
              <Text fontSize={12} color="gray.500">
                {authUser.bio}
              </Text>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};

export default SuggestedHeader;
*/