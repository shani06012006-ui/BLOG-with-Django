import { useEffect, useState } from "react";
import { apiClient } from "../api/client";

const Profile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const load = async () => {
      const res = await apiClient("http://127.0.0.1:8000/api/profile/");
      const data = await res.json();
      setProfile(data);
    };

    load();
  }, []);

  return (
    <div>
      <h2>Profile</h2>
      <p>Name: {profile?.name}</p>
      <p>Email: {profile?.email}</p>
      <p>Username: {profile?.username}</p>
    </div>
  );
};

export default Profile;