import { Box, Flex, Link, Text, VStack } from "@chakra-ui/react";
import SuggestedHeader from "./SuggestedHeader";
import SuggestedUser from "./SuggestedUser";
import useGetSuggestedUsers from "../../hooks/useGetSuggestedUsers";

const SuggestedUsers = () => {
	const { isLoading, suggestedUsers } = useGetSuggestedUsers();

	// optional: render loading skeleton
	if (isLoading) return null;

	return (
		<VStack py={8} px={6} gap={4}>
			{/* Suggested Header outside of the card */}
			<SuggestedHeader />

			{/* Only the suggested users list inside the card */}
			<Box
				w="full"
				bg="#FFFFFF" // Grey background for the card
				borderRadius="lg" // Rounded corners
				boxShadow="md" // Add shadow for card-like effect
				overflow="hidden" // Optional: to avoid content overflowing the border radius
				p={6} // Padding around the content
			>
				{/* Section header */}
				{suggestedUsers.length > 0 && (
					<Flex alignItems={"center"} justifyContent={"space-between"} w={"full"}>
						<Text fontSize={14} marginBottom={"4"}fontWeight={"bold"} color={"gray.500"}>
							Suggested for you
						</Text>
						<Text fontSize={12} marginBottom={"4"} fontWeight={"bold"} _hover={{ color: "gray.400" }} cursor={"pointer"}>
							See All
						</Text>
					</Flex>
				)}

				{/* Suggested users list */}
				{suggestedUsers.map((user) => (
					<SuggestedUser user={user} key={user.id} />
				))}
			</Box>

			{/* Footer */}
			<Box fontSize={12} color={"gray.500"} mt={5} alignSelf={"start"}>
				© 2025 Built By{" "}
				<Link href='' target='_blank' color='blue.500' fontSize={14}>
					MeetQ
				</Link>
			</Box>
		</VStack>
	);
};

export default SuggestedUsers;





/*
import { Box, Flex, Link, Text, VStack } from "@chakra-ui/react";
import SuggestedHeader from "./SuggestedHeader";
import SuggestedUser from "./SuggestedUser";
import useGetSuggestedUsers from "../../hooks/useGetSuggestedUsers";

const SuggestedUsers = () => {
	const { isLoading, suggestedUsers } = useGetSuggestedUsers();

	// optional: render loading skeleton
	if (isLoading) return null;

	return (
		<VStack py={8} px={6} gap={4}>
			<SuggestedHeader />

			{suggestedUsers.length >= 0 && (
				<Flex alignItems={"center"} justifyContent={"space-between"} w={"full"}>
					<Text fontSize={12} fontWeight={"bold"} color={"gray.500"}>
						Suggested for you
					</Text>
					<Text fontSize={12} fontWeight={"bold"} _hover={{ color: "gray.400" }} cursor={"pointer"}>
						See All
					</Text>
				</Flex>
			)}

			{suggestedUsers.map((user) => (
				<SuggestedUser user={user} key={user.id} />
			))}

			<Box fontSize={12} color={"gray.500"} mt={5} alignSelf={"start"}>
				© 2023 Built By{" "}
				<Link href='https://www.youtube.com/@asaprogrammer_' target='_blank' color='blue.500' fontSize={14}>
					As a Programmer
				</Link>
			</Box>
		</VStack>
	);
};

export default SuggestedUsers;
*/