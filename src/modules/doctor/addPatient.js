import React, { useState, useCallback, useMemo } from "react";
import { Plus, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

const medications = [
  "Aspirin",
  "Ibuprofen",
  "Acetaminophen",
  "Amoxicillin",
  "Lisinopril",
  "Levothyroxine",
  "Metformin",
  "Amlodipine",
  "Metoprolol",
  "Omeprazole",
];

export const avatarPaths = [
  "/avatars/1.jpeg",
  "/avatars/2.jpeg",
  "/avatars/3.png",
  "/avatars/4.jpeg",
  "/avatars/5.jpeg",
  "/avatars/6.jpeg",
  "/avatars/7.png",
];

const getRandomAvatar = () => {
  const randomIndex = Math.floor(Math.random() * avatarPaths.length);
  return avatarPaths[randomIndex];
};
const AddPatientDialog = ({ onAddPatient }) => {
  const [open, setOpen] = useState(false);
  const today = new Date();
  const [newPatient, setNewPatient] = useState({
    name: "",
    condition: "",
    bloodType: "",
    lastVisit: today,
    medications: [],
    nextAppointment: null,
    id: "",
  });
  const [errors, setErrors] = useState({});
  const [openMedications, setOpenMedications] = useState(false);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setNewPatient((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }, []);

  const handleDateChange = useCallback((date, field) => {
    setNewPatient((prev) => ({ ...prev, [field]: date }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!newPatient.name.trim()) newErrors.name = "Name is required";
    if (!newPatient.condition.trim())
      newErrors.condition = "Condition is required";
    if (!newPatient.bloodType.trim())
      newErrors.bloodType = "Blood type is required";
    if (newPatient.medications.length === 0)
      newErrors.medications = "At least one medication is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [newPatient]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (validateForm()) {
        const patientToAdd = {
          ...newPatient,
          id: newPatient.id || Math.random().toString(36).substr(2, 9),
          image: getRandomAvatar(),
          isUrgent: false,
          lastVisit: format(newPatient.lastVisit, "MM-dd-yyyy"),
          nextAppointment: newPatient.nextAppointment
            ? format(newPatient.nextAppointment, "MM-dd-yyyy")
            : "Not scheduled",
        };
        onAddPatient(patientToAdd);
        setOpen(false);
        setNewPatient({
          name: "",
          condition: "",
          bloodType: "",
          lastVisit: today,
          medications: [],
          nextAppointment: null,
          id: "",
        });
      }
    },
    [newPatient, onAddPatient, validateForm]
  );

  const FormField = useCallback(
    ({ label, name, value, onChange, error, placeholder }) => (
      <div className="space-y-1">
        <Label htmlFor={name}>{label}</Label>
        <Input
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={cn(
            "w-full px-3 py-1 border rounded-md",
            error ? "border-red-500" : "border-gray-300"
          )}
        />
        {error && <p className="text-red-500 text-xs">{error}</p>}
      </div>
    ),
    []
  );

  const toggleMedication = useCallback((medication) => {
    setNewPatient((prev) => {
      const updatedMedications = prev.medications.includes(medication)
        ? prev.medications.filter((m) => m !== medication)
        : [...prev.medications, medication];
      return { ...prev, medications: updatedMedications };
    });
    setErrors((prev) => ({ ...prev, medications: "" }));
  }, []);

  const sortedMedications = useMemo(() => {
    return medications.sort((a, b) => a.localeCompare(b));
  }, []);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button className="bg-[#f4bf55] hover:bg-[#f4bf55]/70 text-white text-xs px-3">
          <Plus size={16} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white rounded-lg shadow-xl max-w-2xl mx-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-bold text-gray-800">
            Add New Patient
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600">
            Please enter the patient's information below.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 my-4">
          <FormField
            label="Patient Name"
            name="name"
            value={newPatient.name}
            onChange={handleInputChange}
            error={errors.name}
            placeholder="Enter patient name"
          />
          <FormField
            label="Medical Condition"
            name="condition"
            value={newPatient.condition}
            onChange={handleInputChange}
            error={errors.condition}
            placeholder="Enter medical condition"
          />
          <FormField
            label="Blood Type"
            name="bloodType"
            value={newPatient.bloodType}
            onChange={handleInputChange}
            error={errors.bloodType}
            placeholder="Enter blood type"
          />
          <div className="space-y-1">
            <Label>Medications</Label>
            <Popover open={openMedications} onOpenChange={setOpenMedications}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openMedications}
                  className="w-full justify-between"
                >
                  {newPatient.medications.length > 0
                    ? `${newPatient.medications.length} selected`
                    : "Select medications"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0">
                <div className="p-2">
                  {sortedMedications.map((medication) => (
                    <div
                      key={medication}
                      className="flex items-center space-x-2 py-1.5 px-2 cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70 hover:bg-gray-100 rounded-sm"
                    >
                      <Checkbox
                        id={medication}
                        checked={newPatient.medications.includes(medication)}
                        onCheckedChange={() => toggleMedication(medication)}
                      />
                      <label
                        htmlFor={medication}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {medication}
                      </label>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            {errors.medications && (
              <p className="text-red-500 text-xs">{errors.medications}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label>Next Appointment</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal py-1",
                    !newPatient.nextAppointment && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {newPatient.nextAppointment ? (
                    format(newPatient.nextAppointment, "MM-dd-yyyy")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={newPatient.nextAppointment}
                  onSelect={(date) => handleDateChange(date, "nextAppointment")}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <FormField
            label="Patient ID (optional)"
            name="id"
            value={newPatient.id}
            onChange={handleInputChange}
            placeholder="Enter patient ID (optional)"
          />
        </form>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-gray-200 text-gray-800 hover:bg-gray-300">
            Cancel{" "}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleSubmit}
            className="bg-[#f4bf55] hover:bg-[#f4bf55]/70 text-white"
          >
            Add Patient
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AddPatientDialog;
