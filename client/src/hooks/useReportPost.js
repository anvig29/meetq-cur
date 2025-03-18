// hooks/useReportPost.js
import { useState } from "react";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { firestore } from "../firebase/firebase";
import { getAuth } from "firebase/auth";

const useReportPost = () => {
  const [isReporting, setIsReporting] = useState(false);
  const auth = getAuth();

  const reportPost = async (postId, imageURL, caption) => {
    setIsReporting(true);

    try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        throw new Error("User not logged in.");
      }

      const reportData = {
        reportedBy: currentUser.uid,
        postId,
        imageURL,
        caption,
        reason: "Spam", 
        timestamp: new Date().toISOString(),
      };

      const postRef = doc(firestore, "posts", postId);
      await updateDoc(postRef, {
        reported: arrayUnion(currentUser.uid),
      });

      console.log("Post reported successfully");
    } catch (error) {
      console.error("Error reporting post:", error);
    } finally {
      setIsReporting(false);
    }
  };

  return { isReporting, reportPost };
};

export default useReportPost;

/*import { firestore } from "../firebase/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

// Client-side code to interact with the backend (make API requests)
const useReportPost = () => {
  const reportPost = async (postId, userId, imageURL, caption, reason) => {
    console.log("🚀 reportPost function called for post:", postId);

    try {
      // Log for NSFW analysis
      console.log("📸 Analyzing image for NSFW content...");
      
      // Call the server's analyzeImage function (make an API call to the backend)
      const nsfwResult = await fetch('/api/analyzeImage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageURL }),
      })
      .then(response => response.json());

      // Check if analyzeImage returns valid data
      if (!nsfwResult) {
        console.error("⚠️ NSFW analysis failed.");
        return { success: false, error: "Image analysis failed" };
      }

      console.log("📢 NSFW Scores Before Saving:", nsfwResult); // Log NSFW scores before saving

      // Save report to Firestore
      const reportRef = doc(firestore, "reports", postId);
      await setDoc(
        reportRef,
        {
          postId,
          reportedBy: userId,
          reason,
          timestamp: serverTimestamp(), // Use Firestore server timestamp
          imageURL,
          caption,
          isNSFW: nsfwResult.adult >= 3 || nsfwResult.violence >= 3,  // Check if the content is NSFW
          nsfwScores: {
            adult: nsfwResult.adult,
            medical: nsfwResult.medical,
            spoof: nsfwResult.spoof,
            violence: nsfwResult.violence,
            racy: nsfwResult.racy,
          },
        },
        { merge: true }
      );

      console.log("✅ Post reported successfully with NSFW scores.");
      alert("✅ Post reported successfully! Check Firestore.");
      return { success: true };
    } catch (error) {
      console.error("❌ Error reporting post:", error);
      alert("❌ Error reporting post! Check console.");
      return { success: false, error };
    }
  };

  return reportPost;
};

export default useReportPost;

*/


/*import { firestore } from "../firebase/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

// Client-side code to interact with the backend (make API requests)
const useReportPost = () => {
  const reportPost = async (postId, userId, imageURL, caption, reason) => {
    console.log("🚀 reportPost function called for post:", postId);

    try {
      // Log for NSFW analysis
      console.log("📸 Analyzing image for NSFW content...");
      
      // Call the server's analyzeImage function (make an API call to the backend)
      const nsfwResult = await fetch('/api/analyzeImage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageURL }),
      })
      .then(response => response.json());

      // Check if analyzeImage returns valid data
      if (!nsfwResult) {
        console.error("⚠️ NSFW analysis failed.");
        return { success: false, error: "Image analysis failed" };
      }

      console.log("📢 NSFW Scores Before Saving:", nsfwResult); // Log NSFW scores before saving

      // Save report to Firestore
      const reportRef = doc(firestore, "reports", postId);
      await setDoc(
        reportRef,
        {
          postId,
          reportedBy: userId,
          reason,
          timestamp: serverTimestamp(), // Use Firestore server timestamp
          imageURL,
          caption,
          isNSFW: nsfwResult.adult >= 3 || nsfwResult.violence >= 3,  // Check if the content is NSFW
          nsfwScores: {
            adult: nsfwResult.adult,
            medical: nsfwResult.medical,
            spoof: nsfwResult.spoof,
            violence: nsfwResult.violence,
            racy: nsfwResult.racy,
          },
        },
        { merge: true }
      );

      console.log("✅ Post reported successfully with NSFW scores.");
      alert("✅ Post reported successfully! Check Firestore.");
      return { success: true };
    } catch (error) {
      console.error("❌ Error reporting post:", error);
      alert("❌ Error reporting post! Check console.");
      return { success: false, error };
    }
  };

  return reportPost;
};

export default useReportPost;

*/





/*import { firestore } from "../firebase/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
const { analyzeImage } = require("../../../server/google-ai/analyzeImage.js");

const useReportPost = () => {
  const reportPost = async (postId, userId, imageURL, caption, reason) => {
    console.log("🚀 reportPost function called for post:", postId);

    try {
      // Log for NSFW analysis
      console.log("📸 Analyzing image for NSFW content...");
      
      // Call server's analyzeImage function
      const nsfwResult = await analyzeImage(imageURL);
      
      // Check if analyzeImage returns valid data
      if (!nsfwResult) {
        console.error("⚠️ NSFW analysis failed.");
        return { success: false, error: "Image analysis failed" };
      }

      console.log("📢 NSFW Scores Before Saving:", nsfwResult); // Log NSFW scores before saving

      // Save report to Firestore
      const reportRef = doc(firestore, "reports", postId);
      await setDoc(
        reportRef,
        {
          postId,
          reportedBy: userId,
          reason,
          timestamp: serverTimestamp(), // Use Firestore server timestamp
          imageURL,
          caption,
          isNSFW: nsfwResult.adult >= 3 || nsfwResult.violence >= 3,  // Check if the content is NSFW
          nsfwScores: {
            adult: nsfwResult.adult,
            medical: nsfwResult.medical,
            spoof: nsfwResult.spoof,
            violence: nsfwResult.violence,
            racy: nsfwResult.racy,
          },
        },
        { merge: true }
      );

      console.log("✅ Post reported successfully with NSFW scores.");
      alert("✅ Post reported successfully! Check Firestore.");
      return { success: true };
    } catch (error) {
      console.error("❌ Error reporting post:", error);
      alert("❌ Error reporting post! Check console.");
      return { success: false, error };
    }
  };

  return reportPost;
};

export default useReportPost;


*/



/*import { firestore } from "../firebase/firebase";
import { doc, setDoc } from "firebase/firestore";
import { analyzeImage } from "../google-ai/analyzeImage"; 

const useReportPost = () => {
  const reportPost = async (postId, userId, imageURL, caption, reason) => {
    try {
      // Analyze the image for NSFW content
      const nsfwResult = await analyzeImage(imageURL);

      console.log("📢 NSFW Scores Before Saving:", nsfwResult); // Log NSFW scores before saving

      if (!nsfwResult) {
        console.error("⚠️ NSFW analysis failed.");
        return { success: false, error: "Image analysis failed" };
      }

      // Define if the image is NSFW (Adjust thresholds as needed)
      const isNSFW = nsfwResult.adult >= 3 || nsfwResult.violence >= 3; 

      // Save report to Firestore
      const reportRef = doc(firestore, "reports", postId);
      await setDoc(
        reportRef,
        {
          postId,
          reportedBy: userId,
          reason,
          timestamp: new Date(),
          imageURL,
          caption,
          isNSFW,
          nsfwScores: { // Save NSFW scores
            adult: nsfwResult.adult,
            medical: nsfwResult.medical,
            spoof: nsfwResult.spoof,
            violence: nsfwResult.violence,
            racy: nsfwResult.racy,
          },
        },
        { merge: true } // Merge to avoid overwriting
      );

      console.log("✅ Post reported successfully with NSFW scores.");
      return { success: true }; 
    } catch (error) {
      console.error("❌ Error reporting post:", error);
      return { success: false, error };
    }
  };

  return reportPost;
};

export default useReportPost;

*/

/*import { firestore } from "../firebase/firebase";
import { doc, setDoc } from "firebase/firestore";
import { analyzeImage } from "../google-ai/vision"; // Import the analyzeImage function

const useReportPost = () => {
  const reportPost = async (postId, userId, imageURL, caption, reason) => {
    try {
      // Analyze the image to get NSFW scores
      const nsfwResult = await analyzeImage(imageURL);

      if (!nsfwResult) {
        console.error("NSFW analysis failed.");
        return { success: false, error: "Image analysis failed" };
      }

      console.log("NSFW Analysis Result:", nsfwResult); // Debugging output

      // Determine if the post is NSFW
      const isNSFW = nsfwResult.adult >= 3 || nsfwResult.violence >= 3; // Adjust thresholds as needed

      // Firestore reference (Store report under the post ID)
      const reportRef = doc(firestore, "reports", postId);

      await setDoc(
        reportRef,
        {
          postId,
          reportedBy: userId,
          reason,
          timestamp: new Date(),
          imageURL,
          caption,
          isNSFW,
          nsfwScores: {
            adult: nsfwResult.adult,
            medical: nsfwResult.medical,
            spoof: nsfwResult.spoof,
            violence: nsfwResult.violence,
            racy: nsfwResult.racy,
          },
        },
        { merge: true } // Merge to prevent overwriting existing reports
      );

      console.log("Post reported successfully with NSFW scores.");
      return { success: true }; // Return success
    } catch (error) {
      console.error("Error reporting post:", error);
      return { success: false, error };
    }
  };

  return reportPost;
};

export default useReportPost;
*/


/*import { firestore } from "../firebase/firebase";
import { doc, setDoc } from "firebase/firestore";
import { analyzeImage } from '../google-ai/vision'; // Import the analyzeImage function

const useReportPost = () => {
  const reportPost = async (userId, imageURL, caption, reason) => {
    try {
      // Get NSFW scores by analyzing the image
      const nsfwResult = await analyzeImage(imageURL);

      if (!nsfwResult) {
        console.error("Unable to analyze the image for NSFW content.");
        return { success: false, error: "Image analysis failed" };
      }

      // Determine if the image is NSFW based on the adult score (adjust the threshold as needed)
      const isNSFW = nsfwResult.adult >= 0.5;

      // Generate a custom report ID (userId-timestamp)
      const reportId = `${userId}-${new Date().getTime()}`;

      // Create or update a document in the 'reports' collection for the post
      const reportRef = doc(firestore, "reports", reportId);

      await setDoc(
        reportRef,
        {
          reportedBy: userId,
          reason,
          timestamp: new Date(),
          imageURL,
          caption,
          isNSFW,
          nsfwScores: {
            adult: nsfwResult.adult,
            medical: nsfwResult.medical,
            spoof: nsfwResult.spoof,
            violence: nsfwResult.violence,
            racy: nsfwResult.racy,
          },
        },
        { merge: true }  // Merge fields to avoid overwriting existing data
      );

      console.log("Post reported successfully.");
      return { success: true }; // Return success status
    } catch (error) {
      console.error("Error reporting post:", error);
      return { success: false, error };
    }
  };

  return reportPost;
};

export default useReportPost;



*/

/*import { firestore } from "../firebase/firebase";
import { doc, setDoc, arrayUnion } from "firebase/firestore";

const useReportPost = () => {
  const reportPost = async (postId, userId, imageURL, caption, reason) => {
    try {
      // Create or update a document in the 'reports' collection for the post
      const reportRef = doc(firestore, "reports", postId);
      await setDoc(
        reportRef,
        {
          postId,
          reportedBy: userId,
          reason,
          timestamp: new Date(),
          imageURL,
          caption,
        },
        { merge: true }  // Merge fields to avoid overwriting existing data
      );

      console.log("Post reported successfully.");
      return { success: true }; // Return success status
    } catch (error) {
      console.error("Error reporting post:", error);
      return { success: false, error };
    }
  };

  return reportPost;
};

export default useReportPost;


*/


/*import { firestore } from "../firebase/firebase";
import { doc, setDoc, arrayUnion } from "firebase/firestore";

const useReportPost = () => {
  const reportPost = async (postId, userId, imageURL, caption, reason) => {
    try {
      const reportRef = doc(firestore, "reports", postId);  // Assuming reports are stored by postId
      await setDoc(reportRef, {
        postId,
        reportedBy: userId,
        reason,
        timestamp: new Date(),
        imageURL,
        caption,
      }, { merge: true });

      console.log("Post reported successfully.");
      return { success: true }; // Return success status
    } catch (error) {
      console.error("Error reporting post:", error);
      return { success: false, error };
    }
  };

  return reportPost;
};

export default useReportPost;



*/
/*import { firestore } from "../firebase/firebase";
import { collection, addDoc } from "firebase/firestore";

const useReportPost = () => {
  return async (postId, uid, imageURL, caption, reason) => {
    try {
      // Create a new report in the Firestore 'reports' collection
      const reportDoc = await addDoc(collection(firestore, "reports"), {
        postId: postId,
        reportedBy: uid,  // Use the uid of the user who is reporting
        reason: reason,  // Reason for reporting (e.g., "Spam")
        timestamp: new Date(),
      });

      console.log("Report submitted successfully:", reportDoc.id);

      // Return some mock data for the result (you can adjust this part based on actual analysis logic)
      return {
        nsfwScore: 0.5,  
        isNsfw: false,   
        hasOffensiveText: false,  
      };
    } catch (error) {
      console.error("Error reporting post:", error);
      return null;
    }
  };
};

export default useReportPost;



*/




/*import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";

const useReportPost = () => {
  const toast = useToast();

  const reportPost = async (postId, reportedBy, reason, imageURL, caption) => {
    try {
      const response = await axios.post("https://your-region-your-project-id.cloudfunctions.net/reportPost", {
        postId,
        reportedBy,
        reason,
        imageURL,
        caption, // Send text content (caption) with the request if needed
      });

      const { nsfwDetected, nsfwScore } = response.data;

      let toastMessage = `NSFW Score: ${nsfwScore.toFixed(2)}`;
      let toastColor = "green";

      if (nsfwDetected) {
        toastColor = "red";
        toastMessage += " - NSFW content detected!";
      }

      toast({
        title: "Report Status",
        description: toastMessage,
        status: toastColor,
        duration: 5000,
        isClosable: true,
      });

      return { success: true, nsfwDetected, nsfwScore };
    } catch (error) {
      console.error("Error reporting post:", error);
      toast({
        title: "Report Failed",
        description: "There was an issue reporting the post. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });

      return { success: false, message: "Failed to submit report." };
    }
  };

  return reportPost;
};

export default useReportPost;

*/
/*import axios from 'axios';

const useReportPost = () => {
  const reportPost = async (postId, reportedBy, imageURL, textContent) => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/analyze/", {
        post_id: postId,
        reported_by: reportedBy,
        image_url: imageURL,
        text_content: textContent,
      });

      return { 
        success: true, 
        nsfwScore: response.data.nsfw_score,
        hasOffensiveText: response.data.has_offensive_text,
        isNsfw: response.data.is_nsfw,
      };
    } catch (error) {
      console.error("Error reporting post:", error);
      return { success: false, message: "Failed to submit report." };
    }
  };

  return reportPost;
};

export default useReportPost;



*/




/*import axios from "axios";

const useReportPost = () => {
  const reportPost = async (postId, reportedBy, imageURL, textContent) => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/analyze/", {
        post_id: postId,
        reported_by: reportedBy,
        image_url: imageURL,
        text_content: textContent
      });

      return { 
        success: true, 
        nsfwScore: response.data.nsfw_score,
        hasOffensiveText: response.data.has_offensive_text,
        isNsfw: response.data.is_nsfw
      };
    } catch (error) {
      console.error("Error reporting post:", error);
      return { success: false, message: "Failed to submit report." };
    }
  };

  return reportPost;
};

export default useReportPost;
*/




/*import axios from "axios";

const useReportPost = () => {
  const reportPost = async (postId, reportedBy, imageURL, textContent) => {
    try {
      const response = await axios.post("http://localhost:8000/analyze/", {
        image_url: imageURL,
        post_id: postId,
        reported_by: reportedBy,
        text_content: textContent
      });

      return { 
        success: true, 
        nsfwScore: response.data.nsfwScore
      };
    } catch (error) {
      console.error("Error reporting post:", error);
      return { success: false, message: "Failed to submit report." };
    }
  };

  return reportPost;
};

export default useReportPost;






*/





/*import axios from "axios";

const useReportPost = () => {
  const reportPost = async (postId, reportedBy, reason, imageURL, textContent) => {
    try {
      const response = await axios.post("https://<your-cloud-function-url>/reportPost", {
        postId,
        reportedBy,
        reason,
        imageURL,
        textContent,
      });

      return { 
        success: true, 
        message: response.data.message, 
        nsfwScore: response.data.nsfwScore || 0.3  
      };
    } catch (error) {
      console.error("Error reporting post:", error);
      return { success: false, message: "Failed to submit report." };
    }
  };

  return reportPost;
};

export default useReportPost;



*/

/*import axios from "axios";

const useReportPost = () => {
  const reportPost = async (postId, reportedBy, reason, imageURL, textContent) => {
    try {
      const response = await axios.post("https://<your-cloud-function-url>/reportPost", {
        postId,
        reportedBy,
        reason,
        imageURL,
        textContent, 
      });

      return { success: true, message: response.data };
    } catch (error) {
      console.error("Error reporting post:", error);
      return { success: false, message: "Failed to submit report." };
    }
  };

  return reportPost;
};

export default useReportPost;


*/




/*import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

const useReportPost = () => {
  const reportPost = async (postId, reportedBy, reason) => {
    try {
      await addDoc(collection(firestore, "reports"), {
        postId,
        reportedBy,
        reason,
        timestamp: serverTimestamp(),
      });
      return { success: true, message: "Report submitted successfully!" };
    } catch (error) {
      console.error("Error reporting post:", error);
      return { success: false, message: "Failed to submit report." };
    }
  };

  return reportPost;
};

export default useReportPost;


*/






/*import { firestore, collection, addDoc, serverTimestamp } from "../firebase/firebase";
import useShowToast from "./useShowToast";
import useAuthStore from "../store/authStore";

const useReportPost = () => {
  const showToast = useShowToast();
  const authUser = useAuthStore((state) => state.user);

  const reportPost = async (postId, reason) => {
    if (!authUser) {
      showToast("Error", "You must be logged in to report a post.", "error");
      return;
    }

    try {
      await addDoc(collection(firestore, "reports"), {
        postId,
        reportedBy: authUser.uid,
        reason,
        timestamp: serverTimestamp(),
      });

      showToast("Reported", "Post has been reported successfully.", "success");
    } catch (error) {
      console.error("Error reporting post:", error);
      showToast("Error", "Failed to report the post.", "error");
    }
  };

  return reportPost;
};

export default useReportPost;
*/