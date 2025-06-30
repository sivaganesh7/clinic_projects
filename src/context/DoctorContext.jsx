import React, { createContext, useContext, useState, useEffect } from "react";

const DoctorContext = createContext();

// Custom hook to consume context
export const useDoctor = () => {
  const context = useContext(DoctorContext);
  if (!context) {
    throw new Error("useDoctor must be used within a DoctorProvider");
  }
  return context;
};

// Provider
export const DoctorProvider = ({ children }) => {
  const [doctorInfo, setDoctorInfo] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("⚠️ No token found in localStorage.");
      return;
    }

    const fetchDoctorInfo = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/doctor/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const contentType = res.headers.get("content-type") || "";

        if (!res.ok || !contentType.includes("application/json")) {
          const text = await res.text();
          throw new Error(`❌ API Error (${res.status}): ${text}`);
        }

        const data = await res.json();
        setDoctorInfo(data);
      } catch (error) {
        console.error("❌ Error fetching doctor info:", error.message);
      }
    };

    fetchDoctorInfo();
  }, []);

  return (
    <DoctorContext.Provider value={{ doctorInfo, setDoctorInfo }}>
      {children}
    </DoctorContext.Provider>
  );
};

export default DoctorContext;
