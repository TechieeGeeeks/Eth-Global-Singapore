export const PatientHeader = ({ totalPatients }) => (
  <div className="flex justify-between items-center mb-4 px-6 border-b py-4">
    <h1 className="text-2xl font-semibold text-gray-800">My Patients</h1>
    <span className="text-gray-500 text-sm">
      Total Patients: {totalPatients}
    </span>
  </div>
);

export const PatientListHeader = () => (
  <div className="flex items-center bg-[#fff9e6] p-4 rounded-lg font-semibold text-sm text-gray-700">
    <div className="w-[20%]">Patient</div>
    <div className="flex w-[65%]">
      <span className="w-1/5">Blood Type</span>
      <span className="w-1/5">Last Visit</span>
      <span className="w-1/5">Medication</span>
      <span className="w-1/5 text-center">Next Appointment</span>
      <span className="w-1/5 text-center">Patient ID</span>
    </div>
    <div className="w-[15%]"></div>
  </div>
);
