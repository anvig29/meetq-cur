import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";

// Global Styles for Chakra UI
const styles = {
  global: (props) => ({
    body: {
      bg: "#F1F4F9", 
      color: "#0C1024", 
    },
    // Disable hover for menu items, buttons, and icon buttons
    ".chakra-button:hover, .chakra-icon-button:hover, .chakra-menu-item:hover": {
      backgroundColor: "transparent", 
      boxShadow: "none",
    },
    // Specific styles for the post container
    '.post': {
      backgroundColor: "#FFFFFF", 
      borderRadius: '8px',
      padding: '1rem',
      boxShadow: 'sm', 
    },
    // Sidebar customization (make sure to apply className 'sidebar' to the component)
    '.sidebar': {
      color: "#0C1024",
      bg:"#0000000" ,
    },
    // Global style for all icons to be black
    ".chakra-icon": {
      color: "black", 
    },
  }),
};

// Theme configuration
const config = {
  initialColorMode: "light", 
  useSystemColorMode: false,
};

// Extend Chakra theme with custom styles and config
const theme = extendTheme({ config, styles });

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>
);


/*import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import { BrowserRouter } from "react-router-dom";

const styles = {
	global: (props) => ({
		body: {
			bg: mode("gray.100", "#000")(props),
			color: mode("gray.800", "whiteAlpha.900")(props),
		},
	}),
};

const config = {
	initialColorMode: "dark",
	useSystemColorMode: false,
};

// 3. extend the theme
const theme = extendTheme({ config, styles });

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<BrowserRouter>
			<ChakraProvider theme={theme}>
				<App />
			</ChakraProvider>
		</BrowserRouter>
	</React.StrictMode>
);
*/