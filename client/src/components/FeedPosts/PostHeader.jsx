import React from "react";
import {
  Avatar,
  Box,
  Flex,
  Skeleton,
  SkeletonCircle,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  RadioGroup,
  Stack,
  Radio,
  useDisclosure,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FiMoreVertical } from "react-icons/fi";
import { timeAgo } from "../../utils/timeAgo";
import { addDoc, collection, serverTimestamp, doc, deleteDoc } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";
import { getAuth } from "firebase/auth";

const PostHeader = ({ post, creatorProfile, onSaveClick, onDeleteClick }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedReason, setSelectedReason] = React.useState("Inappropriate content");
  const toast = useToast();
  const auth = getAuth();
  const currentUser = auth.currentUser;

  // Admin email list
  const adminEmails = [
    "anvigautam19@gmail.com", 
    "shwetamandalbm@gmail.com", 
    "suresh12345x@gmail.com"
  ];

  // Check if the current user is an admin
  const isAdmin = currentUser && adminEmails.includes(currentUser.email);

  const handleReportSubmit = async () => {
    if (!currentUser) {
      toast({
        title: "Not Logged In",
        description: "You must be logged in to report a post.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!post?.id) {
      console.warn("Post ID is undefined");
      return;
    }

    try {
      await addDoc(collection(firestore, "reports"), {
        postId: post.id,
        reason: selectedReason,
        reportedBy: currentUser.uid,
        timestamp: serverTimestamp(),
      });

      toast({
        title: "Report Submitted",
        description: "Thank you for reporting. We will review this post shortly.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      console.error("Error reporting post:", error);
      toast({
        title: "Error",
        description: "An error occurred while reporting. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Handle post deletion for admins
  const handleDeletePost = async () => {
    try {
      const postRef = doc(firestore, "posts", post.id);
      await deleteDoc(postRef);
      toast({
        title: "Post Deleted",
        description: "The post has been deleted successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      
      // Trigger the parent function to update the UI
      if (onDeleteClick) {
        onDeleteClick(post.id);  // Pass the deleted post ID to parent to remove it from the feed
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Error",
        description: "An error occurred while deleting the post. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex justifyContent="space-between" alignItems="center" w="full" my={2}>
      <Flex alignItems="center" gap={2}>
        {creatorProfile ? (
          <Link to={`/${creatorProfile.username}`}>
            <Avatar src={creatorProfile.profilePicURL} alt="user profile pic" size="sm" />
          </Link>
        ) : (
          <SkeletonCircle size="10" />
        )}

        <Flex fontSize={12} fontWeight="bold" gap="2">
          {creatorProfile ? (
            <Link to={`/${creatorProfile.username}`}>{creatorProfile.username}</Link>
          ) : (
            <Skeleton w="100px" h="10px" />
          )}
          <Box color="gray.500">• {timeAgo(post.createdAt)}</Box>
        </Flex>
      </Flex>

      {/* Menu */}
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="More options"
          icon={<FiMoreVertical />}
          variant="ghost"
          border={"1px solid black"}
          color={"black"}
          size="sm"
          _hover={{ backgroundColor: "#F1F4F9" }}
        />
        <MenuList bg="white" borderColor="gray.300">
          <MenuItem onClick={onSaveClick} bg="white" _hover={{ backgroundColor: "#F1F4F9" }}>
            Save
          </MenuItem>
          <MenuItem onClick={onOpen} bg="white" _hover={{ backgroundColor: "#F1F4F9" }}>
            Report
          </MenuItem>

          {/* Only show "Delete" if the user is an admin */}
          {isAdmin && (
            <MenuItem onClick={handleDeletePost} bg="white" _hover={{ backgroundColor: "#F1F4F9" }} color="red">
              Delete
            </MenuItem>
          )}
        </MenuList>
      </Menu>

      {/* Report Modal */}
      {isOpen && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader bg={"white"}>
              Report Post
              <Button variant="ghost" mr={18} border={"1px solid black"} colorScheme="red" onClick={onClose}>
                X
              </Button>
            </ModalHeader>
            <ModalBody bg={"white"}>
              <RadioGroup onChange={setSelectedReason} value={selectedReason}>
                <Stack direction="column">
                  <Radio value="Inappropriate content">Inappropriate content</Radio>
                  <Radio value="Spam">Spam</Radio>
                  <Radio value="Harassment">Harassment</Radio>
                  <Radio value="False Information">False Information</Radio>
                </Stack>
              </RadioGroup>
            </ModalBody>
            <ModalFooter bg={"white"}>
              <Button variant="ghost" mr={3} colorScheme="black" onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleReportSubmit}>
                Submit Report
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Flex>
  );
};

export default PostHeader;


/*import React from "react";
import {
  Avatar,
  Box,
  Flex,
  Skeleton,
  SkeletonCircle,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  RadioGroup,
  Stack,
  Radio,
  useDisclosure,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FiMoreVertical } from "react-icons/fi";
import { timeAgo } from "../../utils/timeAgo";
import { addDoc, collection, serverTimestamp, doc, deleteDoc } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";
import { getAuth } from "firebase/auth";

const PostHeader = ({ post, creatorProfile, onSaveClick, onDeleteClick }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedReason, setSelectedReason] = React.useState("Inappropriate content");
  const toast = useToast();
  const auth = getAuth();
  const currentUser = auth.currentUser;

  // Admin email list
  const adminEmails = [
    "anvigautam19@gmail.com", 
    "shwetamandalbm@gmail.com", 
    "suresh12345x@gmail.com"
  ];

  // Check if the current user is an admin
  const isAdmin = currentUser && adminEmails.includes(currentUser.email);

  const handleReportSubmit = async () => {
    if (!currentUser) {
      toast({
        title: "Not Logged In",
        description: "You must be logged in to report a post.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!post?.id) {
      console.warn("Post ID is undefined");
      return;
    }

    try {
      await addDoc(collection(firestore, "reports"), {
        postId: post.id,
        reason: selectedReason,
        reportedBy: currentUser.uid,
        timestamp: serverTimestamp(),
      });

      toast({
        title: "Report Submitted",
        description: "Thank you for reporting. We will review this post shortly.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      console.error("Error reporting post:", error);
      toast({
        title: "Error",
        description: "An error occurred while reporting. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Handle post deletion for admins
  const handleDeletePost = async () => {
    try {
      const postRef = doc(firestore, "posts", post.id);
      await deleteDoc(postRef);
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
        title: "Error",
        description: "An error occurred while deleting the post. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex justifyContent="space-between" alignItems="center" w="full" my={2}>
      <Flex alignItems="center" gap={2}>
        {creatorProfile ? (
          <Link to={`/${creatorProfile.username}`}>
            <Avatar src={creatorProfile.profilePicURL} alt="user profile pic" size="sm" />
          </Link>
        ) : (
          <SkeletonCircle size="10" />
        )}

        <Flex fontSize={12} fontWeight="bold" gap="2">
          {creatorProfile ? (
            <Link to={`/${creatorProfile.username}`}>{creatorProfile.username}</Link>
          ) : (
            <Skeleton w="100px" h="10px" />
          )}
          <Box color="gray.500">• {timeAgo(post.createdAt)}</Box>
        </Flex>
      </Flex>

 
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="More options"
          icon={<FiMoreVertical />}
          variant="ghost"
          border={"1px solid black"}
          color={"black"}
          size="sm"
          _hover={{ backgroundColor: "#F1F4F9" }}
        />
        <MenuList bg="white" borderColor="gray.300">
          <MenuItem onClick={onSaveClick} bg="white" _hover={{ backgroundColor: "#F1F4F9" }}>
            Save
          </MenuItem>
          <MenuItem onClick={onOpen} bg="white" _hover={{ backgroundColor: "#F1F4F9" }}>
            Report
          </MenuItem>

          {isAdmin && (
            <MenuItem onClick={handleDeletePost} bg="white" _hover={{ backgroundColor: "#F1F4F9" }} color="red">
              Delete
            </MenuItem>
          )}
        </MenuList>
      </Menu>

    
      {isOpen && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader bg={"white"}>
              Report Post
              <Button variant="ghost" mr={18} border={"1px solid black"} colorScheme="red" onClick={onClose}>
                X
              </Button>
            </ModalHeader>
            <ModalBody bg={"white"}>
              <RadioGroup onChange={setSelectedReason} value={selectedReason}>
                <Stack direction="column">
                  <Radio value="Inappropriate content">Inappropriate content</Radio>
                  <Radio value="Spam">Spam</Radio>
                  <Radio value="Harassment">Harassment</Radio>
                  <Radio value="False Information">False Information</Radio>
                </Stack>
              </RadioGroup>
            </ModalBody>
            <ModalFooter bg={"white"}>
              <Button variant="ghost" mr={3} colorScheme="black" onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleReportSubmit}>
                Submit Report
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Flex>
  );
};

export default PostHeader;
*/

/*import React from "react";
import {
  Avatar,
  Box,
  Flex,
  Skeleton,
  SkeletonCircle,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  RadioGroup,
  Stack,
  Radio,
  useDisclosure,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FiMoreVertical } from "react-icons/fi";
import { timeAgo } from "../../utils/timeAgo";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";
import { getAuth } from "firebase/auth";

const PostHeader = ({ post, creatorProfile, onSaveClick }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedReason, setSelectedReason] = React.useState("Inappropriate content");
  const toast = useToast();
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const handleReportSubmit = async () => {
    if (!currentUser) {
      toast({
        title: "Not Logged In",
        description: "You must be logged in to report a post.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!post?.id) {
      console.warn("Post ID is undefined");
      return;
    }

    try {
      await addDoc(collection(firestore, "reports"), {
        postId: post.id,
        reason: selectedReason,
        reportedBy: currentUser.uid,
        timestamp: serverTimestamp(),
      });

      toast({
        title: "Report Submitted",
        description: "Thank you for reporting. We will review this post shortly.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      console.error("Error reporting post:", error);
      toast({
        title: "Error",
        description: "An error occurred while reporting. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex justifyContent="space-between" alignItems="center" w="full" my={2}>
      <Flex alignItems="center" gap={2}>
        {creatorProfile ? (
          <Link to={`/${creatorProfile.username}`}>
            <Avatar src={creatorProfile.profilePicURL} alt="user profile pic" size="sm" />
          </Link>
        ) : (
          <SkeletonCircle size="10" />
        )}

        <Flex fontSize={12} fontWeight="bold" gap="2">
          {creatorProfile ? (
            <Link to={`/${creatorProfile.username}`}>{creatorProfile.username}</Link>
          ) : (
            <Skeleton w="100px" h="10px" />
          )}
          <Box color="gray.500">• {timeAgo(post.createdAt)}</Box>
        </Flex>
      </Flex>

 
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="More options"
          icon={<FiMoreVertical />}
          variant="ghost"
          border={"1px solid black"}
          color={"black"}
          size="sm"
          _hover={{ backgroundColor: "#F1F4F9" }}
        />
        <MenuList bg="white" borderColor="gray.300">
          <MenuItem onClick={onSaveClick} bg="white" _hover={{ backgroundColor: "#F1F4F9" }}>
            Save
          </MenuItem>
          <MenuItem onClick={onOpen} bg="white" _hover={{ backgroundColor: "#F1F4F9" }}>
            Report
          </MenuItem>
        </MenuList>
      </Menu>


      {isOpen && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader bg={"white"}>Report Post 
			<Button variant="ghost" mr={18} border={"1px solid black"} colorScheme="red" onClick={onClose}>
               X
              </Button>
			</ModalHeader>
            <ModalBody bg={"white"}>
              <RadioGroup onChange={setSelectedReason} value={selectedReason}>
                <Stack direction="column">
                  <Radio value="Inappropriate content">Inappropriate content</Radio>
                  <Radio value="Spam">Spam</Radio>
                  <Radio value="Harassment">Harassment</Radio>
                  <Radio value="False Information">False Information</Radio>
                </Stack>
              </RadioGroup>
            </ModalBody>
            <ModalFooter bg={"white"}>
              <Button variant="ghost" mr={3} colorScheme="black" onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleReportSubmit}>
                Submit Report
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Flex>
  );
};

export default PostHeader;


*/


/*
import {
	Avatar,
	Box,
	Flex,
	Skeleton,
	SkeletonCircle,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	IconButton,
	useToast,
  } from "@chakra-ui/react";
  import { Link } from "react-router-dom";
  import { FiMoreVertical } from "react-icons/fi";
  import { timeAgo } from "../../utils/timeAgo";
  import useFollowUser from "../../hooks/useFollowUser";
  
  const PostHeader = ({ post, creatorProfile, onReportClick, onSaveClick }) => {
	const { handleFollowUser, isFollowing, isUpdating } = useFollowUser(post.createdBy);
	const toast = useToast();
  
	const handleUnfollow = async () => {
	  if (isFollowing) {
		await handleFollowUser(); // Unfollow logic
		toast({
		  title: "Unfollowed",
		  description: `You have unfollowed ${creatorProfile.username}`,
		  status: "info",
		  duration: 3000,
		  isClosable: true,
		});
	  }
	};
  
	return (
	  <Flex justifyContent="space-between" alignItems="center" w="full" my={2}>
		<Flex alignItems="center" gap={2}>
		  {creatorProfile ? (
			<Link to={`/${creatorProfile.username}`}>
			  <Avatar src={creatorProfile.profilePicURL} alt="user profile pic" size="sm" />
			</Link>
		  ) : (
			<SkeletonCircle size="10" />
		  )}
  
		  <Flex fontSize={12} fontWeight="bold" gap="2">
			{creatorProfile ? (
			  <Link to={`/${creatorProfile.username}`}>{creatorProfile.username}</Link>
			) : (
			  <Skeleton w="100px" h="10px" />
			)}
  
			<Box color="gray.500">• {timeAgo(post.createdAt)}</Box>
		  </Flex>
		</Flex>
  
	
		<Menu>
		  <MenuButton
			as={IconButton}
			aria-label="More options"
			icon={<FiMoreVertical />}
			variant="ghost"
			border={"1px solid black"}
			color={"black"}
			size="sm"
			_hover={{ backgroundColor: "#F1F4F9" }}
		  />
		  <MenuList bg="white" borderColor="gray.300">
			<MenuItem
			  onClick={onSaveClick}
			  bg="white"
			  color="black"
			  _hover={{ backgroundColor: "#F1F4F9" }}
			>
			  Save
			</MenuItem>
			<MenuItem
			  onClick={handleUnfollow}
			  bg="white"
			  color="black"
			  _hover={{ backgroundColor: "#F1F4F9" }}
			>
			  Unfollow
			</MenuItem>
			<MenuItem
			  onClick={onReportClick}
			  bg="white"
			  color="black"
			  _hover={{ backgroundColor: "#F1F4F9" }}
			>
			  Report
			</MenuItem>
		  </MenuList>
		</Menu>
	  </Flex>
	);
  };
  
  export default PostHeader;
  

*/







/*import {
	Avatar,
	Box,
	Flex,
	Skeleton,
	SkeletonCircle,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	IconButton,
	useToast,
  } from "@chakra-ui/react";
  import { Link } from "react-router-dom";
  import { FiMoreVertical } from "react-icons/fi";
  import { timeAgo } from "../../utils/timeAgo";
  import useFollowUser from "../../hooks/useFollowUser";
  
  const PostHeader = ({ post, creatorProfile, onReportClick, onSaveClick }) => {
	const { handleFollowUser, isFollowing, isUpdating } = useFollowUser(post.createdBy);
	const toast = useToast();
  
	const handleUnfollow = async () => {
	  if (isFollowing) {
		await handleFollowUser(); // Unfollow logic
		toast({
		  title: "Unfollowed",
		  description: `You have unfollowed ${creatorProfile.username}`,
		  status: "info",
		  duration: 3000,
		  isClosable: true,
		});
	  }
	};
  
	return (
	  <Flex justifyContent="space-between" alignItems="center" w="full" my={2}>
		<Flex alignItems="center" gap={2}>
		  {creatorProfile ? (
			<Link to={`/${creatorProfile.username}`}>
			  <Avatar src={creatorProfile.profilePicURL} alt="user profile pic" size="sm" />
			</Link>
		  ) : (
			<SkeletonCircle size="10" />
		  )}
  
		  <Flex fontSize={12} fontWeight="bold" gap="2">
			{creatorProfile ? (
			  <Link to={`/${creatorProfile.username}`}>{creatorProfile.username}</Link>
			) : (
			  <Skeleton w="100px" h="10px" />
			)}
  
			<Box color="gray.500">• {timeAgo(post.createdAt)}</Box>
		  </Flex>
		</Flex>
  
	
		<Menu>
		  <MenuButton
			as={IconButton}
			aria-label="More options"
			icon={<FiMoreVertical />}
			variant="ghost"
			border={"1px solid black"}
			color={"black"}
			size="sm"
			_hover={{ backgroundColor: "#F1F4F9" }}
		  />
		  <MenuList bg="white" borderColor="gray.300">
			<MenuItem onClick={onSaveClick} _hover={{ backgroundColor: "#F1F4F9" }}>
			  Save
			</MenuItem>
			<MenuItem onClick={handleUnfollow} _hover={{ backgroundColor: "#F1F4F9" }}>
			  Unfollow
			</MenuItem>
			<MenuItem onClick={onReportClick} _hover={{ backgroundColor: "#F1F4F9" }}>
			  Report
			</MenuItem>
		  </MenuList>
		</Menu>
	  </Flex>
	);
  };
  
  export default PostHeader;
  



*/













/*import { Avatar, Box, Flex, Skeleton, SkeletonCircle, Menu, MenuButton, MenuList, MenuItem, IconButton } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FiMoreVertical } from "react-icons/fi";
import { timeAgo } from "../../utils/timeAgo";

const PostHeader = ({ post, creatorProfile, onReportClick }) => {
  return (
    <Flex justifyContent={"space-between"} alignItems={"center"} w={"full"} my={2}>
      <Flex alignItems={"center"} gap={2}>
        {creatorProfile ? (
          <Link to={`/${creatorProfile.username}`}>
            <Avatar src={creatorProfile.profilePicURL} alt='user profile pic' size={"sm"} />
          </Link>
        ) : (
          <SkeletonCircle size='10' />
        )}

        <Flex fontSize={12} fontWeight={"bold"} gap='2'>
          {creatorProfile ? (
            <Link to={`/${creatorProfile.username}`}>{creatorProfile.username}</Link>
          ) : (
            <Skeleton w={"100px"} h={"10px"} />
          )}

          <Box color={"gray.500"}>• {timeAgo(post.createdAt)}</Box>
        </Flex>
      </Flex>


      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="More options"
          icon={<FiMoreVertical />}
          variant="ghost"
		  border={"1px solid black"}
		  color={"black"}
          size="sm"
          _hover={{ backgroundColor: "#F1F4F9" }}
        />
        <MenuList>
          <MenuItem onClick={onReportClick}>Report Post</MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
};

export default PostHeader;


*/













/*import { Avatar, Box, Button, Flex, Skeleton, SkeletonCircle } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import useFollowUser from "../../hooks/useFollowUser";
import { timeAgo } from "../../utils/timeAgo";

const PostHeader = ({ post, creatorProfile }) => {
	const { handleFollowUser, isFollowing, isUpdating } = useFollowUser(post.createdBy);

	return (
		<Flex justifyContent={"space-between"} alignItems={"center"} w={"full"} my={2}>
			<Flex alignItems={"center"} gap={2}>
				{creatorProfile ? (
					<Link to={`/${creatorProfile.username}`}>
						<Avatar src={creatorProfile.profilePicURL} alt='user profile pic' size={"sm"} />
					</Link>
				) : (
					<SkeletonCircle size='10' />
				)}

				<Flex fontSize={12} fontWeight={"bold"} gap='2'>
					{creatorProfile ? (
						<Link to={`/${creatorProfile.username}`}>{creatorProfile.username}</Link>
					) : (
						<Skeleton w={"100px"} h={"10px"} />
					)}

					<Box color={"gray.500"}>• {timeAgo(post.createdAt)}</Box>
				</Flex>
			</Flex>
			<Box cursor={"pointer"}>
				<Button
					size={"xs"}
					bg={"transparent"}
					fontSize={12}
					color={"blue.500"}
					fontWeight={"bold"}
					_hover={{
						color: "white",
					}}
					transition={"0.2s ease-in-out"}
					onClick={handleFollowUser}
					isLoading={isUpdating}
				>
					
				</Button>
			</Box>
		</Flex>
	);
};

export default PostHeader;
*/