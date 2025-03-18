//server.js
require("dotenv").config();
const express = require("express");
const vision = require("@google-cloud/vision");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const client = new vision.ImageAnnotatorClient({
  keyFilename: "meetq-449218-65a83ba48b73.json",
});

// API endpoint to analyze images
app.post("/api/analyzeImage", async (req, res) => {
  const { imageURL } = req.body;

  if (!imageURL) {
    return res.status(400).json({ error: "Missing imageURL" });
  }

  try {
    console.log("🔍 Analyzing Image:", imageURL);
    const [result] = await client.safeSearchDetection(imageURL);
    const detections = result.safeSearchAnnotation;

    console.log("🟢 Analysis Result:", detections);
    return res.json(detections);
  } catch (error) {
    console.error("❌ Google Vision API Error:", error);
    return res.status(500).json({ error: "Failed to analyze image" });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

/*require("dotenv").config(); 

const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs, doc, setDoc, updateDoc, arrayUnion } = require("firebase/firestore");
const vision = require("@google-cloud/vision");
const serviceAccount = require("./serviceAccountKey.json");

const app = express();
const PORT = process.env.PORT || 5001;

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Firebase Config from .env
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const firestore = getFirestore(firebaseApp); // Ensure Firebase is initialized before Firestore

const client = new vision.ImageAnnotatorClient({
  keyFilename: "meetq-449218-65a83ba48b73.json",
});
app.use(cors());
app.use(express.json()); // Ensure JSON parsing is enabled

// Function to analyze NSFW content
const analyzeImage = async (imageURL) => {
  try {
    const [result] = await client.safeSearchDetection(imageURL);
    const safeSearch = result.safeSearchAnnotation;
    
    return {
      adult: safeSearch.adult,
      medical: safeSearch.medical,
      spoof: safeSearch.spoof,
      violence: safeSearch.violence,
      racy: safeSearch.racy,
    };
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw new Error("Image analysis failed");
  }
};

// API endpoint to analyze images
app.post("/api/analyzeImage", async (req, res) => {
  console.log("Received request body:", req.body); // Debugging log

  const imageURL = req.body.imageURL;

  if (!imageURL) {
    return res.status(400).json({ error: "No image URL provided" });
  }

  try {
    console.log("Analyzing image:", imageURL);
    const analysis = await analyzeImage(imageURL);
    res.json({ message: "Image analysis completed", analysis });
  } catch (error) {
    res.status(500).json({ error: "Failed to analyze image" });
  }
});

// Fetching posts
app.get("/api/posts", async (req, res) => {
  try {
    const postsSnapshot = await getDocs(collection(firestore, "posts"));
    const posts = postsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// Report a post API
app.post("/api/reportPost", async (req, res) => {
  const { postId, userId, imageURL, caption, reason } = req.body;

  try {
    // Analyze the image
    const analysis = await analyzeImage(imageURL);

    // Save the report to Firestore
    const reportRef = doc(firestore, "reports", postId);
    await setDoc(reportRef, {
      postId,
      reportedBy: userId,
      reason,
      timestamp: new Date(),
      imageURL,
      caption,
      isNSFW: analysis.adult >= 3 || analysis.violence >= 3,  // Check if content is NSFW
      nsfwScores: analysis,
    }, { merge: true });

    // Optionally, mark post as reported by adding to 'reported' field in posts
    const postRef = doc(firestore, "posts", postId);
    await updateDoc(postRef, {
      reported: arrayUnion(userId), // Add current user UID to the reported list
    });

    res.status(200).json({ message: "Post reported successfully!" });
  } catch (error) {
    console.error("Error reporting post:", error);
    res.status(500).json({ error: "Failed to report post" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

*/


/*require('dotenv').config();  // Load environment variables from .env file

const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, setDoc, updateDoc, arrayUnion } = require('firebase/firestore');
const vision = require('@google-cloud/vision');

// Use require for the service account JSON file
const serviceAccount = require('./serviceAccountKey.json');

const app = express();
const PORT = process.env.PORT || 5001;

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.VITE_DATABASE_URL,  // Using environment variable for database URL
});

// Firebase Config from .env
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const firestore = getFirestore(firebaseApp); // Ensure Firebase is initialized before Firestore

const client = new vision.ImageAnnotatorClient();

app.use(cors());
app.use(express.json()); // Ensure JSON parsing is enabled

// Function to analyze NSFW content
const analyzeImage = async (imageURL) => {
  try {
    const [result] = await client.safeSearchDetection(imageURL);
    const safeSearch = result.safeSearchAnnotation;

    return {
      adult: safeSearch.adult,
      medical: safeSearch.medical,
      spoof: safeSearch.spoof,
      violence: safeSearch.violence,
      racy: safeSearch.racy,
    };
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw new Error("Image analysis failed");
  }
};

// API endpoint to analyze images
app.post("/api/analyzeImage", async (req, res) => {
  const imageURL = req.body.imageURL;

  if (!imageURL) {
    return res.status(400).json({ error: "No image URL provided" });
  }

  try {
    const analysis = await analyzeImage(imageURL);
    res.json({ message: "Image analysis completed", analysis });
  } catch (error) {
    res.status(500).json({ error: "Failed to analyze image" });
  }
});

// Fetching posts
app.get("/api/posts", async (req, res) => {
  try {
    const postsSnapshot = await getDocs(collection(firestore, "posts"));
    const posts = postsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// Report a post API
app.post("/api/reportPost", async (req, res) => {
  const { postId, userId, imageURL, caption, reason } = req.body;

  try {
    const analysis = await analyzeImage(imageURL);

    const reportRef = doc(firestore, "reports", postId);
    await setDoc(reportRef, {
      postId,
      reportedBy: userId,
      reason,
      timestamp: new Date(),
      imageURL,
      caption,
      isNSFW: analysis.adult >= 3 || analysis.violence >= 3,  // Check if content is NSFW
      nsfwScores: analysis,
    }, { merge: true });

    const postRef = doc(firestore, "posts", postId);
    await updateDoc(postRef, {
      reported: arrayUnion(userId), // Add current user UID to the reported list
    });

    res.status(200).json({ message: "Post reported successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to report post" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


/*const express = require("express");
const axios = require("axios");
const admin = require("firebase-admin");
const { analyzeImage } = require("./google-ai/analyzeImage"); // Import the analyzeImage function

admin.initializeApp();
const db = admin.firestore();
const app = express();
app.use(express.json());

// Endpoint to analyze the image for NSFW content
app.post("/api/analyzeImage", async (req, res) => {
  const { imageURL } = req.body;

  try {
    // Call the analyzeImage function to analyze the image for NSFW content
    console.log("📸 Analyzing image for NSFW content...");
    const nsfwResult = await analyzeImage(imageURL);

    // Return the analysis result as a response
    res.json(nsfwResult);
  } catch (error) {
    console.error("Error analyzing image:", error);
    res.status(500).json({ error: "Failed to analyze the image." });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Node.js Server running on port ${PORT}`));


*/





/*const express = require("express");
const axios = require("axios");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();
const app = express();
app.use(express.json());

app.post("/reportPost", async (req, res) => {
  try {
    const { postId, reportedBy, imageURL, textContent } = req.body;
    // Import the delete handler
    const deleteHandler = require("./controllers/deleteHandler");

  // Use the delete handler for `/delete-image` route
      app.use("/delete-image", deleteHandler);
    // Call FastAPI ML model for NSFW analysis
    const fastApiResponse = await axios.post("http://localhost:8000/analyze/", {
      image_url: imageURL,
      post_id: postId,
      reported_by: reportedBy,
      text_content: textContent
    });

    const nsfwScore = fastApiResponse.data.nsfwScore;

    // Store report in Firebase
    await db.collection("reports").add({
      postId,
      reportedBy,
      imageURL,
      nsfwScore,
      textContent,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      status: "pending"
    });

    res.json({ message: "Report submitted", nsfwScore });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error processing request" });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Node.js Server running on port ${PORT}`));



*/







/*const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Enable CORS for all origins
app.use(cors());

// Import the delete handler
const deleteHandler = require("./controllers/deleteHandler");

// Use the delete handler for `/delete-image` route
app.use("/delete-image", deleteHandler);

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to the main server!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
*/