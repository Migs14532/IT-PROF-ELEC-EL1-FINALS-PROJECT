import React, { useState } from "react";
import { ChevronLeft, Camera, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();

  // Empty initial profile state (dynamic user input)
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    image: "",
  });

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempProfile, setTempProfile] = useState(profile);

  // Handle input changes inside modal
  const handleChange = (e) => {
    setTempProfile({ ...tempProfile, [e.target.name]: e.target.value });
  };

  // Handle image upload inside modal
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTempProfile({ ...tempProfile, image: URL.createObjectURL(file) });
    }
  };

  // Save changes
  const handleSave = () => {
    setProfile(tempProfile);
    setIsModalOpen(false);
  };

  // Logout (optional navigation)
  const handleLogout = () => {
    console.log("User logged out");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 px-4 relative">
      {/* Back Button */}
      <button
        onClick={() => navigate("/dashboard")}
        className="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-300 transition cursor-pointer"
      >
        <ChevronLeft className="w-6 h-6 text-gray-700 hover:text-gray-900" />
      </button>

      {/* Profile Card */}
      <div className="w-full max-w-sm sm:max-w-md bg-white/70 backdrop-blur-sm shadow-md rounded-2xl p-6 flex flex-col items-center space-y-6">
        {/* Profile Image */}
        <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-blue-100 flex items-center justify-center">
          {profile.image ? (
            <img
              src={profile.image}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <p className="text-blue-500 font-medium text-sm">No Image</p>
          )}
        </div>

        <h1 className="text-lg sm:text-xl font-semibold text-blue-600">
          Personal Details
        </h1>

        {/* Edit Button */}
        <button
          onClick={() => {
            setTempProfile(profile);
            setIsModalOpen(true);
          }}
          className="w-75 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-full text-sm sm:text-base font-medium transition"
        >
          Edit Profile
        </button>

        {/* Profile Info */}
        <div className="w-full text-gray-800 space-y-3 text-center sm:text-left">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium text-base break-words">
              {profile.name || "No name set"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium text-base break-words">
              {profile.email || "No email set"}
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-25 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-full text-sm sm:text-base font-medium transition mt-4"
        >
          Logout
        </button>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-11/12 max-w-sm relative">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-semibold text-blue-600 mb-4 text-center">
              Edit Profile
            </h2>

            {/* Profile Image Preview */}
            <div className="flex justify-center mb-4 relative">
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white flex items-center justify-center">
                {tempProfile.image ? (
                  <img
                    src={tempProfile.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <p className="text-blue-400 font-medium text-sm">No Image</p>
                )}
              </div>
              <label
                htmlFor="imageUpload"
                className="absolute bottom-2 right-1 bg-blue-500 p-2 rounded-full cursor-pointer hover:bg-blue-600 transition"
              >
                <Camera className="text-white w-4 h-4" />
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </div>

            {/* Input Fields */}
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <input
                  type="text"
                  name="name"
                  value={tempProfile.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full border border-blue-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>

              <div>
                <p className="text-sm text-gray-500">Email</p>
                <input
                  type="email"
                  name="email"
                  value={tempProfile.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full border border-blue-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleSave}
                className="bg-blue-500 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-600 transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
