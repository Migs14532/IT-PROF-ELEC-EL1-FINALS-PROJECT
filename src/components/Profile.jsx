import React, { useState, useEffect } from "react";
import { ChevronLeft, Camera, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import supabase from "../lib/supabase";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({ name: "", email: "", image: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempProfile, setTempProfile] = useState(profile);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return navigate("/login");
      setUser(data.user);

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();
      if (profileData) setProfile(profileData);
    };
    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => setTempProfile({ ...tempProfile, [e.target.name]: e.target.value });
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setTempProfile({ ...tempProfile, image: URL.createObjectURL(file) });
  };

  const handleSave = async () => {
    if (!user) return;
    const { error } = await supabase.from("profiles")
      .upsert({ id: user.id, name: tempProfile.name, email: tempProfile.email, image: tempProfile.image });
    if (!error) setProfile(tempProfile);
    setIsModalOpen(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 px-4 relative">
      {/* Your existing JSX remains */}
      {/* ... */}
    </div>
  );
}
