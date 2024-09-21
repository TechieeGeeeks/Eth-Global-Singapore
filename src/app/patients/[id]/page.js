"use client";
import React from "react";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import MainDocLayout from "@/layout/doctor";
import {
  Activity,
  ArrowDown,
  Calendar,
  Heart,
  Info,
  Thermometer,
  ChevronDown,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { GiMedicinePills } from "react-icons/gi";

const pastVisits = [
  {
    date: "2023-03-15",
    diagnosis: "Common cold",
    treatment: "Rest and fluids",
    notes: "Patient reported fatigue and runny nose",
  },
  {
    date: "2022-11-20",
    diagnosis: "Sprained ankle",
    treatment: "RICE method, pain medication",
    notes: "X-ray negative for fracture",
  },
  {
    date: "2022-06-05",
    diagnosis: "Annual check-up",
    treatment: "N/A",
    notes: "All vitals normal, recommended increased exercise",
  },
];

const getPatientData = (id) => ({
  name: "John Doe",
  id: id,
  age: 45,
  gender: "Male",
  condition: "Hypertension",
  bloodType: "A+",
  heartRate: "72 bpm",
  bloodPressure: "120/80 mmHg",
  temperature: "98.6°F",
  weight: "180 lbs",
  height: "5'10\"",
  bmi: "25.8",
  lastCheckup: "2023-05-15",
  nextAppointment: "2023-09-20",
  medicationAdherence: "85%",
});

export default function PatientDetails({ params }) {
  const patient = getPatientData(params.id);
  const [activeAccordion, setActiveAccordion] = useState("item-2");

  return (
    <MainDocLayout path={["Patient", patient.name]}>
      <div className="mx-auto">
        <Header totalRecords={pastVisits.length} name={patient.name} />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className=""
        >
          <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue="item-2"
            onValueChange={setActiveAccordion}
          >
            <AccordionItem value="item-1">
              <AccordionTrigger className="px-6">
                Patient Overview
              </AccordionTrigger>
              <AccordionContent className="px-6">
                <AnimatePresence>
                  {activeAccordion === "item-1" && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <BentoGrid patient={patient} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="px-6">Past Visits</AccordionTrigger>
              <AccordionContent className="px-6">
                <AnimatePresence>
                  {activeAccordion === "item-2" && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <PastVisitsTable visits={pastVisits} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>
      </div>
    </MainDocLayout>
  );
}

const Header = ({ totalRecords, name }) => (
  <div className="flex justify-between items-center px-6 border-b py-4">
    <div className="flex items-center gap-4">
      <Link href="/">
        <ArrowDown
          size={18}
          className="text-gray-300 rotate-90 cursor-pointer hover:text-black"
        />
      </Link>
      <h1 className="text-2xl font-semibold text-gray-800">{name}</h1>
    </div>
    <span className="text-gray-500 text-sm">
      Total Past Visits: {totalRecords}
    </span>
  </div>
);

const BentoGrid = ({ patient }) => (
  <motion.div
    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5, staggerChildren: 0.1 }}
  >
    <BentoItem title="Vital Signs" icon={<Heart className="text-red-500" />}>
      <p>Heart Rate: {patient.heartRate}</p>
      <p>Blood Pressure: {patient.bloodPressure}</p>
      <p>Temperature: {patient.temperature}</p>
    </BentoItem>
    <BentoItem
      title="Body Metrics"
      icon={<Activity className="text-blue-500" />}
    >
      <p>Weight: {patient.weight}</p>
      <p>Height: {patient.height}</p>
      <p>BMI: {patient.bmi}</p>
    </BentoItem>
    <BentoItem
      title="Appointments"
      icon={<Calendar className="text-green-500" />}
    >
      <p>Last Checkup: {patient.lastCheckup}</p>
      <p>Next Appointment: {patient.nextAppointment}</p>
    </BentoItem>
    <BentoItem
      title="Medication"
      icon={<GiMedicinePills className="text-purple-500" />}
    >
      <p>Adherence: {patient.medicationAdherence}</p>
    </BentoItem>
    <BentoItem
      title="Condition"
      icon={<Thermometer className="text-orange-500" />}
    >
      <p>{patient.condition}</p>
      <p>Blood Type: {patient.bloodType}</p>
    </BentoItem>
    <BentoItem title="Patient Info" icon={<Info className="text-gray-500" />}>
      <p>Age: {patient.age}</p>
      <p>Gender: {patient.gender}</p>
      <p>ID: {patient.id}</p>
    </BentoItem>
  </motion.div>
);

const BentoItem = ({ title, icon, children }) => (
  <motion.div
    className="bg-white p-4 rounded-lg border shadow-sm hover:bg-yellow-100"
    whileHover={{ scale: 1.01 }}
    whileTap={{ scale: 0.95 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div className="flex items-center mb-2">
      {icon}
      <h3 className="text-lg font-semibold ml-2">{title}</h3>
    </div>
    <div className="text-sm text-gray-600">{children}</div>
  </motion.div>
);

const PastVisitsTable = ({ visits }) => (
  <motion.div
    className="bg-white border rounded-lg"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <div className="flex items-center bg-[#fff9e6] p-4 rounded-t-lg font-semibold text-sm text-gray-700">
      <div className="w-[20%]">Date</div>
      <div className="w-[20%]">Diagnosis</div>
      <div className="w-[25%]">Treatment</div>
      <div className="w-[35%]">Notes</div>
    </div>
    {visits.map((visit, index) => (
      <motion.div
        key={index}
        className="flex items-center border-t p-4 text-sm"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
      >
        <div className="w-[20%]">{visit.date}</div>
        <div className="w-[20%]">{visit.diagnosis}</div>
        <div className="w-[25%]">{visit.treatment}</div>
        <div className="w-[35%]">{visit.notes}</div>
      </motion.div>
    ))}
  </motion.div>
);
