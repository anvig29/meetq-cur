import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar/Sidebar"; // Adjust the import path as needed
import AdminReports from "../components/Sidebar/AdminReports"; // Adjust the import path as needed
import { getAuth } from "firebase/auth";

const AdminPage = () => {
  const [showReports, setShowReports] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const adminEmails = [
    "anvigautam19@gmail.com", 
    "shwetamandalbm@gmail.com", 
    "suresh12345x@gmail.com"
  ];

  // Check if the current user is an admin
  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser && adminEmails.includes(currentUser.email)) {
      setIsAdmin(true);
    }
  }, []);

  const handleShowReports = () => {
    setShowReports(true);
  };

  return (
    <div>
      {isAdmin ? (
        <>
          <Sidebar onShowReports={handleShowReports} />
          {showReports && <AdminReports />}
        </>
      ) : (
        <div>You are not authorized to view this page.</div>
      )}
    </div>
  );
};

export default AdminPage;
