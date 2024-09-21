"use client";
import React from "react";
import { motion } from "framer-motion";
import MainPatientLayout from "@/layout/patient";
import { usePrivy } from "@privy-io/react-auth";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Loader2,
  Calendar,
  Clock,
  Activity,
  Heart,
  Thermometer,
  Droplet,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

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
  image: "/avatars/1.jpeg",
  medications: ["Lisinopril 10mg"],
});

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

const PatientInfo = ({ data }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Card className="mb-6">
      <CardContent className="flex items-center p-6">
        <Avatar className="h-24 w-24 mr-6">
          <AvatarImage src={data.image} alt={data.name} />
          <AvatarFallback>
            {data.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-2xl font-bold mb-2">{data.name}</h2>
          <p className="text-gray-500 mb-1">ID: {data.id}</p>
          <p className="text-gray-500 mb-1">
            {data.age} years old • {data.gender}
          </p>
          <p className="text-gray-500">
            {data.condition} • Blood Type: {data.bloodType}
          </p>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const VitalSigns = ({ data }) => (
  <motion.div
    className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5, delay: 0.2 }}
  >
    <VitalCard icon={Heart} title="Heart Rate" value={data.heartRate} />
    <VitalCard
      icon={Droplet}
      title="Blood Pressure"
      value={data.bloodPressure}
    />
    <VitalCard
      icon={Thermometer}
      title="Temperature"
      value={data.temperature}
    />
  </motion.div>
);

const VitalCard = ({ icon: Icon, title, value }) => (
  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
    <Card>
      <CardContent className="flex items-center p-6">
        <Icon className="h-8 w-8 text-primary mr-4" />
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const PastVisitsTable = ({ visits }) => (
  <motion.div
    className="overflow-x-auto"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5, delay: 0.4 }}
  >
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Patient</TableHead>
          <TableHead>Diagnosis</TableHead>
          <TableHead>Last Visit</TableHead>
          <TableHead>Treatment</TableHead>
          <TableHead>Next Appointment</TableHead>
          <TableHead>Patient ID</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {visits.map((visit, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src="/avatars/1.jpeg" alt="Patient" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <div>John Doe</div>
                  <div className="text-sm text-muted-foreground">
                    Hypertension
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell>{visit.diagnosis}</TableCell>
            <TableCell>{visit.date}</TableCell>
            <TableCell>{visit.treatment}</TableCell>
            <TableCell>05-15-2023</TableCell>
            <TableCell>23444-23</TableCell>
            <TableCell>
              <Button variant="outline">View Record</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </motion.div>
);

const Page = () => {
  const { authenticated, ready } = usePrivy();

  if (!ready || !authenticated) {
    return (
      <div className="h-screen grid place-items-center">
        <div className="animate-spin text-yellow-400">
          <Loader2 />
        </div>
      </div>
    );
  }

  const patientData = getPatientData("23444-23");

  return (
    <MainPatientLayout>
      <div>
        <PatientHeader />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue="item-1"
          >
            <AccordionItem value="item-1">
              <AccordionTrigger className="px-6">
                Patient Overview
              </AccordionTrigger>
              <AccordionContent className="px-6">
                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <PatientInfo data={patientData} />
                  <VitalSigns data={patientData} />
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Last Checkup
                        </CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {patientData.lastCheckup}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Next Appointment
                        </CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {patientData.nextAppointment}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Medication Adherence
                        </CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {patientData.medicationAdherence}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="px-6">Past Visits</AccordionTrigger>
              <AccordionContent className="px-6">
                <PastVisitsTable visits={pastVisits} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>
      </div>
    </MainPatientLayout>
  );
};

export default Page;

const PatientHeader = ({}) => (
  <div className="flex justify-between items-center px-6 border-b py-4">
    <h1 className="text-2xl font-semibold text-gray-800">Patient Dashboard</h1>
    <span className="text-gray-500 text-sm">
      {/* Total Patients: {totalPatients} */}
    </span>
  </div>
);