import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDoctor } from "../context/DoctorContext";
import DoctorNavbar from "../components/Doctor/DoctorNavbar";
import BackButton from "../components/BackButton";
import { CheckCircle2 } from "lucide-react";

const DoctorProfile = () => {
  const { doctorInfo, setDoctorInfo } = useDoctor();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (doctorInfo) {
      setFormData({
        firstName: doctorInfo.firstName || "",
        lastName: doctorInfo.lastName || "",
        email: doctorInfo.email || "",
        specialization: doctorInfo.specialization || "",
        qualification: doctorInfo.qualification || "",
        experience: doctorInfo.experience || "",
        phone: doctorInfo.phone || "",
        bio: doctorInfo.bio || "",
      });
    }
  }, [doctorInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/doctor/profile`,
        formData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setDoctorInfo(res.data);
      if (res.data.firstName && res.data.lastName) {
        localStorage.setItem("doctorName", `${res.data.firstName} ${res.data.lastName}`);
      }
      setSuccess("Profile updated successfully!");
      setIsEditing(false);
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      console.error("❌ Update error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  if (!formData) return <p className="text-center mt-10 text-gray-600">Loading profile...</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <DoctorNavbar />
      <div className="my-5 ml-5">
        <BackButton />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white text-2xl font-bold border border-white/30">
                {formData.firstName?.[0]}
                {formData.lastName?.[0]}
              </div>
              <div>
                <h1 className="text-2xl font-extrabold">
                  Dr. {formData.firstName} {formData.lastName}
                </h1>
                <p className="text-blue-100 text-sm">{formData.specialization || "Medical Practitioner"}</p>
              </div>
            </div>

            <button
              onClick={() => {
                setIsEditing(!isEditing);
                setError("");
                setSuccess("");
              }}
              className="bg-white text-blue-700 hover:bg-blue-50 px-5 py-2.5 rounded-xl font-medium text-sm transition shadow"
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {success && (
              <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-3 mb-6 rounded-lg text-sm flex items-center gap-2">
                <CheckCircle2 size={16} /> {success}
              </div>
            )}

            {error && (
              <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 mb-6 rounded-lg text-sm">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* First Name */}
                <div>
                  <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    disabled={!isEditing}
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full border rounded-lg p-2.5 text-sm ${
                      isEditing ? "bg-white border-gray-300 focus:ring-2 focus:ring-blue-500" : "bg-gray-50 text-gray-700 border-gray-200"
                    }`}
                    required
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    disabled={!isEditing}
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full border rounded-lg p-2.5 text-sm ${
                      isEditing ? "bg-white border-gray-300 focus:ring-2 focus:ring-blue-500" : "bg-gray-50 text-gray-700 border-gray-200"
                    }`}
                    required
                  />
                </div>

                {/* Email (read-only) */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Professional Email (Read-Only)
                  </label>
                  <input
                    id="email"
                    name="email"
                    disabled
                    value={formData.email}
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-gray-100 text-gray-500"
                  />
                </div>

                {/* Specialization */}
                <div>
                  <label htmlFor="specialization" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Specialization
                  </label>
                  <input
                    id="specialization"
                    name="specialization"
                    disabled={!isEditing}
                    value={formData.specialization}
                    onChange={handleChange}
                    className={`w-full border rounded-lg p-2.5 text-sm ${
                      isEditing ? "bg-white border-gray-300 focus:ring-2 focus:ring-blue-500" : "bg-gray-50 text-gray-700 border-gray-200"
                    }`}
                    required
                  />
                </div>

                {/* Qualification */}
                <div>
                  <label htmlFor="qualification" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Qualification
                  </label>
                  <input
                    id="qualification"
                    name="qualification"
                    placeholder="e.g., MBBS, MD (General Medicine)"
                    disabled={!isEditing}
                    value={formData.qualification}
                    onChange={handleChange}
                    className={`w-full border rounded-lg p-2.5 text-sm ${
                      isEditing ? "bg-white border-gray-300 focus:ring-2 focus:ring-blue-500" : "bg-gray-50 text-gray-700 border-gray-200"
                    }`}
                  />
                </div>

                {/* Experience */}
                <div>
                  <label htmlFor="experience" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Years of Experience
                  </label>
                  <input
                    id="experience"
                    name="experience"
                    placeholder="e.g., 8 years"
                    disabled={!isEditing}
                    value={formData.experience}
                    onChange={handleChange}
                    className={`w-full border rounded-lg p-2.5 text-sm ${
                      isEditing ? "bg-white border-gray-300 focus:ring-2 focus:ring-blue-500" : "bg-gray-50 text-gray-700 border-gray-200"
                    }`}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Contact Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    placeholder="e.g., +91 9876543210"
                    disabled={!isEditing}
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full border rounded-lg p-2.5 text-sm ${
                      isEditing ? "bg-white border-gray-300 focus:ring-2 focus:ring-blue-500" : "bg-gray-50 text-gray-700 border-gray-200"
                    }`}
                  />
                </div>
              </div>

              {/* Bio / Description */}
              <div>
                <label htmlFor="bio" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Professional Bio / Description
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={3}
                  placeholder="Tell patients about your medical background, areas of interest, and clinic care philosophy..."
                  disabled={!isEditing}
                  value={formData.bio}
                  onChange={handleChange}
                  className={`w-full border rounded-lg p-3 text-sm ${
                    isEditing ? "bg-white border-gray-300 focus:ring-2 focus:ring-blue-500" : "bg-gray-50 text-gray-700 border-gray-200"
                  }`}
                />
              </div>

              {/* Submit Button */}
              {isEditing && (
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium text-sm hover:bg-gray-200 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl font-medium text-sm transition shadow"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
