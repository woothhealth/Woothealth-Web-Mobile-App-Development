import DatePicker from "./DatePicker";
import CustomSelect from "./CustomSelect";
import { CiLocationOn } from "react-icons/ci";
import Image from "next/image";

export default function BookingPage({doctor, onClose }: any) {
  return (
    <section className="fixed inset-0 bg-black/40 flex items-center justify-center min-h-screen p-6 z-20">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow p-8 space-y-8">
        <div className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <div className="border border-[#D9D9D9] rounded-full w-fit">
          <Image src={doctor.avatar} alt="" width={56} height={56} className="rounded-full h-fit" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">{doctor.name}</h2>
          <p className="text-gray-500 text-sm">{doctor.specialty}</p>
          <p className="text-sm text-gray-500">⭐ {doctor.rating} ({doctor.reviews})</p>
          <p className="text-sm text-gray-500"><CiLocationOn className='inline-flex mr-2'/>  {doctor.location}</p>
        </div>
      </div>

      <span className="bg-green-100 text-green-600 px-4 py-1 rounded-full text-sm">
        Available
      </span>
    </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <DatePicker />
          </div>

          <div className="space-y-6">
            <CustomSelect
              label="Select Time"
              options={["10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM"]}
            />

            <CustomSelect
              label="Reason for Booking"
              options={[
                "Routine checkup",
                "Consultation",
                "Follow up",
                "Emergency",
              ]}
            />

            <div>
              <label className="block text-sm font-medium mb-2">
                Add details (Optional)
              </label>
              <textarea
                className="w-full border rounded-lg p-3 h-28 resize-none"
                placeholder="Write additional information..."
              />
            </div>
          </div>
        </div>

        <button onClick={onClose} className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg transition">
          Book Session
        </button>
      </div>
    </section>
  );
}