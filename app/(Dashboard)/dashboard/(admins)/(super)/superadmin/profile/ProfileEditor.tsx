"use client";

import React, { useState } from "react";
import { LuPencilLine } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import { useNotifications } from "@/context/NotificationContext";
import { useBusinessDashboardUser } from "@/Components/BusinessDashboardUserProvider";

interface ProfileData {
  industry: string;
  email: string;
  phone: string;
  status: string;
  userId: string;
  role: string;
  plan: string;
  companyAddress: string;
  regNumber: string;
}

interface ProfileEditorProps {
  profileData: ProfileData;
}

export default function ProfileEditor({ profileData }: ProfileEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(profileData);
  const { addNotification } = useNotifications();
  const businessUser = useBusinessDashboardUser();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        industry: formData.industry,
        companyAddress: formData.companyAddress,
        regNumber: formData.regNumber,
      };

      const response = await fetch("/api/business/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          industry: formData.industry,
          companyAddress: formData.companyAddress,
          regNumber: formData.regNumber,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update profile");
      }

      addNotification(
        "Profile Updated",
        "Your profile has been updated successfully",
        "success"
      );

      // Reload the page to reflect changes everywhere
      window.location.reload();

      setIsOpen(false);
    } catch (error: any) {
      addNotification(
        "Update Failed",
        error.message || "Failed to update profile",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Edit Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 hover:bg-gray-100 rounded-full transition"
        title="Edit profile"
      >
        <LuPencilLine className="text-xl text-gray-600" />
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-fit overflow-y-hidden">
            {/* Header */}
            <div className="flex justify-between items-center px-4 lg:px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Edit Profile</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded transition"
              >
                <IoClose size={24} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="space-y-4">
                {/* Industry */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Industry
                  </label>
                  <input
                    type="text"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300"
                    required
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Address
                  </label>
                  <input
                    type="text"
                    name="companyAddress"
                    value={formData.companyAddress}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Registration Number
                  </label>
                  <input
                    type="text"
                    name="regNumber"
                    value={formData.regNumber}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300"
                    required
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4 lg:pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-2 px-2 lg:px-4 lg:py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition text-sm md:text-base"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="lg:flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition disabled:opacity-50 text-sm md:text-base"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
