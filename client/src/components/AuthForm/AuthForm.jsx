import { Box, Flex, Image, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
import GoogleAuth from "./GoogleAuth";
import PasskeyAuth from "./PasskeyAuth.jsx";


const AuthForm = () => {
	const [isLogin, setIsLogin] = useState(true);

	return (
		<>
			<Box w="100%" border={"1px solid gray"} borderRadius={4} padding={5}>
				<VStack spacing={4}>
					{/*<Image src='/logo.png' h={24} cursor={"pointer"} alt='Instagram' />*/}

					{isLogin ? <Login /> : <Signup />}

					{/* ---------------- OR -------------- */}
					<Flex alignItems={"center"} color={"black"} justifyContent={"center"} my={4} gap={1} w={"full"}>
						<Box flex={2} color={"black"} h={"1px"} bg={"gray.400"} />
						<Text mx={1}  color={"black"}>
							OR
						</Text>
						<Box flex={2} color={"black"} h={"1px"} bg={"gray.400"} />
					</Flex>

					{isLogin? <PasskeyAuth prefix={"Log in"}/>:<></>}
				</VStack>
			</Box>

			<Box border={"1px solid gray"} borderRadius={4} color={"black"} padding={5}>
				<Flex alignItems={"center"} justifyContent={"center"}>
					<Box mx={2} fontSize={14}>
						{isLogin ? "Don't have an account?" : "Already have an account?"}
					</Box>
					<Box onClick={() => setIsLogin(!isLogin)} color={"blue.500"} cursor={"pointer"}>
						{isLogin ? "Sign up" : "Log in"}
					</Box>
				</Flex>
			</Box>
		</>
	);
};

export default AuthForm;
