import React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Calendar, Droplet, IdCard, Stethoscope, User } from "lucide-react";
import { BiMale } from "react-icons/bi";
import { BiFemale } from "react-icons/bi";

const InfoItem = ({ icon, label, value, className = "" }) => (
  <div className={`flex items-center space-x-2 ${className}`}>
    <div className="text-gray-400">{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  </div>
);

const PatientInfoDialog = ({ isOpen, setIsOpen, patient }) => (
  <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
    <AlertDialogContent className="max-w-md">
      <AlertDialogHeader>
        <AlertDialogTitle className="text-2xl font-bold text-center mb-4">
          Patient Information
        </AlertDialogTitle>
        <AlertDialogDescription>
          <div className="space-y-4">
            <div className="flex items-center justify-center mb-6">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                <User size={48} className="text-gray-500" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InfoItem
                icon={<IdCard size={18} />}
                label="ID"
                value={patient.id}
              />
              <InfoItem
                icon={<Calendar size={18} />}
                label="Age"
                value={patient.age}
              />
              <InfoItem
                icon={
                  patient.gender === "Male" ? (
                    <BiMale size={18} />
                  ) : (
                    <BiFemale size={18} />
                  )
                }
                label="Gender"
                value={patient.gender}
              />
              <InfoItem
                icon={<Droplet size={18} />}
                label="Blood Type"
                value={patient.bloodType}
              />
              <InfoItem
                icon={<Stethoscope size={18} />}
                label="Condition"
                value={patient.condition}
                className="col-span-2"
              />
            </div>
          </div>
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter className="mt-6">
        <Button onClick={() => setIsOpen(false)} className="w-full">
          Close
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export default PatientInfoDialog;
