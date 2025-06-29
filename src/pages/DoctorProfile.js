import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDoctor } from "../context/DoctorContext";
import DoctorNavbar from "../components/Doctor/DoctorNavbar";
import BackButton from "../components/BackButton";

const DoctorProfile = () => {
  const { doctorInfo, setDoctorInfo } = useDoctor();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Populate formData from doctorInfo
  useEffect(() => {
    if (doctorInfo) {
      setFormData({
        firstName: doctorInfo.firstName || "",
        lastName: doctorInfo.lastName || "",
        email: doctorInfo.email || "",
        specialization: doctorInfo.specialization || "",
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
    try {
      const res = await axios.put("http://localhost:5000/api/doctor/profile", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setDoctorInfo(res.data);
      setIsEditing(false);
    } catch (err) {
      console.error("❌ Update error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!formData) return <p className="text-center mt-10">Loading profile...</p>;

  return (
    <div>
      <DoctorNavbar />
             <div className="my-5 ml-5">       
        <BackButton/>
        </div>
   
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Doctor Profile</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        {/* First Name */}
        <div className="flex flex-col">
          <label htmlFor="firstName" className="font-medium mb-1">
            First Name
          </label>
          <input
            id="firstName"
            name="firstName"
            placeholder="First Name"
            disabled={!isEditing}
            value={formData.firstName}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>

        {/* Last Name */}
        <div className="flex flex-col">
          <label htmlFor="lastName" className="font-medium mb-1">
            Last Name
          </label>
          <input
            id="lastName"
            name="lastName"
            placeholder="Last Name"
            disabled={!isEditing}
            value={formData.lastName}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>

        {/* Email (read-only) */}
        <div className="flex flex-col">
          <label htmlFor="email" className="font-medium mb-1">
            Email (read-only)
          </label>
          <input
            id="email"
            name="email"
            disabled
            value={formData.email}
            className="border p-2 rounded bg-gray-100"
          />
        </div>

        {/* Specialization */}
        <div className="flex flex-col">
          <label htmlFor="specialization" className="font-medium mb-1">
            Specialization
          </label>
          <input
            id="specialization"
            name="specialization"
            placeholder="Specialization"
            disabled={!isEditing}
            value={formData.specialization}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>

        {/* Submit Button */}
        {isEditing && (
          <div className="col-span-2 text-right">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </form>
    </div>
    </div>
  );
};

export default DoctorProfile;
