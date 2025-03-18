// utils/firebaseUtils.js
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

// Store NSFW results in the report document
export const storeNsfwResultsInReport = async (postId, nsfwScores) => {
  try {
    // Get a reference to the 'reports' collection in Firestore
    const reportDocRef = doc(firestore, "reports", postId);

    // Update the report document with NSFW scores
    await updateDoc(reportDocRef, {
      nsfwScores: nsfwScores, // Store the NSFW scores in the report document
    });

    console.log("NSFW scores saved successfully!");
  } catch (error) {
    console.error("Error saving NSFW scores:", error);
  }
};
