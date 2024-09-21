import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PatientItem } from "./patients";
import { PatientHeader, PatientListHeader } from "./patientHeader";
import AddPatientDialog from "./addPatient";
import { SearchBar } from "./patientSearchbar";
const initialPatients = [
  {
    name: "John Doe",
    condition: "Hypertension",
    bloodType: "A+",
    lastVisit: "01-22-2023",
    medications: ["Lisinopril 10mg"],
    nextAppointment: "05-15-2023",
    id: "23444-23",
    image: "/avatars/1.jpeg",
    isUrgent: false,
  },
  {
    name: "Jane Smith",
    condition: "Diabetes",
    bloodType: "O-",
    lastVisit: "02-07-2023",
    medications: ["Metformin 500mg", "Insulin 10 units"],
    nextAppointment: "05-20-2023",
    id: "18922-07",
    image: "/avatars/2.jpeg",
    isUrgent: false,
  },
  {
    name: "Mike Johnson",
    condition: "Pneumonia",
    bloodType: "B+",
    lastVisit: "03-12-2023",
    medications: ["Azithromycin 250mg", "Cough syrup"],
    nextAppointment: "05-18-2023",
    id: "18242-22",
    image: "/avatars/3.png",
    isUrgent: true,
  },
  {
    name: "Emily Brown",
    condition: "Appendicitis",
    bloodType: "AB-",
    lastVisit: "04-08-2023",
    medications: ["Ceftriaxone 1g", "Pain reliever"],
    nextAppointment: "05-22-2023",
    id: "25321-78",
    image: "/avatars/5.jpeg",
    isUrgent: false,
  },
];
const PatientList = () => {
  const [patients, setPatients] = useState(initialPatients);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddPatient = (newPatient) => {
    setPatients((prevPatients) => [...prevPatients, newPatient]);
  };

  return (
    <div className="bg-white">
      <PatientHeader totalPatients={patients.length} />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center mb-6 px-6"
      >
        <div className="flex items-center space-x-4"></div>
        <div className="flex items-center gap-3">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <AddPatientDialog onAddPatient={handleAddPatient} />
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-2 px-6"
      >
        <PatientListHeader />
        <AnimatePresence>
          {filteredPatients.map((patient) => (
            <motion.div
              key={patient.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <PatientItem patient={patient} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default PatientList;
