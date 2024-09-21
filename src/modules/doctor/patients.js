import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const PatientItem = ({ patient }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="flex items-center bg-white border border-gray-200 p-4 rounded-lg">
        <div className="flex items-center space-x-4 w-[20%]">
          <img
            src={patient.image}
            alt={patient.name}
            className="w-12 h-12 rounded-full"
          />
          <div>
            <Link href={`/patients/${patient.id}`} className="hover:underline">
              <h3 className="font-semibold text-base">{patient.name}</h3>
            </Link>
            <p className="text-xs text-gray-500">{patient.condition}</p>
          </div>
        </div>
        <div className="flex w-[65%] text-xs text-gray-600 items-center">
          <span className="w-1/5">{patient.bloodType}</span>
          <span className="w-1/5">{patient.lastVisit}</span>
          <span className="w-1/5">{patient.medications.join(", ")}</span>
          <span className="w-1/5 text-center">{patient.nextAppointment}</span>
          <span className="w-1/5 text-center">{patient.id}</span>
        </div>
        <div className="w-[15%] text-right">
          <Button
            className="rounded-full px-7 bg-[#f4bf55] hover:bg-[#f4bf55]/70 text-white text-xs"
            onClick={() => setIsOpen(true)}
          >
            VIEW RECORD
          </Button>
        </div>
      </div>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Patient Record: {patient.name}</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-2">
                <p>
                  <strong>ID:</strong> {patient.id}
                </p>
                <p>
                  <strong>Condition:</strong> {patient.condition}
                </p>
                <p>
                  <strong>Blood Type:</strong> {patient.bloodType}
                </p>
                <p>
                  <strong>Last Visit:</strong> {patient.lastVisit}
                </p>
                <p>
                  <strong>Medications:</strong> {patient.medications.join(", ")}
                </p>
                <p>
                  <strong>Next Appointment:</strong> {patient.nextAppointment}
                </p>
                <p>
                  <strong>Urgent:</strong> {patient.isUrgent ? "Yes" : "No"}
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button onClick={() => setIsOpen(false)}>Close</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};


