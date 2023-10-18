import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ProfilePage from "../pages/ProfilePage";

function ProfilePageWrapper() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get("user_id");

  useEffect(() => {
    if (!userId) {
      navigate("/home");
    }
  }, [userId, navigate]);

  return userId ? <ProfilePage userId={userId} /> : null;
}

export default ProfilePageWrapper;
