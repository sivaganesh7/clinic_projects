import React, { createContext, useContext, useState } from 'react';

const DoctorContext = createContext();

export const useDoctor = () => useContext(DoctorContext);

export const DoctorProvider = ({ children }) => {
const [doctorInfo, setDoctorInfo] = useState(null);

return (
<DoctorContext.Provider value={{ doctorInfo, setDoctorInfo }}>
{children}
</DoctorContext.Provider>
);
};