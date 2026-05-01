'use client';

import { useState } from 'react';
import { Provider } from '../ProvidersClient';
import { FaEdit, FaUpload, FaEye, FaUserSlash, FaBan } from 'react-icons/fa';

interface ProviderViewClientProps {
  provider: Provider;
}

export default function ProviderViewClient({ provider }: ProviderViewClientProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Provider Image and Basic Info */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center">
            <span className="text-2xl font-semibold text-slate-600">{provider.name.charAt(0)}</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">{provider.name}</h2>
            <p className="text-sm text-slate-600">{provider.type}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-sm text-slate-600">Admin Officer:</span>
            <span className="text-sm font-medium text-slate-900">{provider.adminOfficer || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-slate-600">Email:</span>
            <span className="text-sm font-medium text-slate-900">{Array.isArray(provider.email) ? provider.email[0] : provider.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-slate-600">Phone:</span>
            <span className="text-sm font-medium text-slate-900">{Array.isArray(provider.phone) ? provider.phone[0] : provider.phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-slate-600">Provider Tier:</span>
            <span className="text-sm font-medium text-slate-900">{provider.tier}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-slate-600">NHIA Number:</span>
            <span className="text-sm font-medium text-slate-900">{provider.nhiaNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-slate-600">Woot ID:</span>
            <span className="text-sm font-medium text-slate-900">{provider.wootId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-slate-600">Type:</span>
            <span className="text-sm font-medium text-slate-900">{provider.type}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-slate-600">Onboarding Date:</span>
            <span className="text-sm font-medium text-slate-900">{provider.onboardingDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-slate-600">Status:</span>
            <span className={`text-sm font-medium ${provider.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
              {provider.status}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-slate-600">Mapped Plans:</span>
            <span className="text-sm font-medium text-slate-900">{Array.isArray(provider.mappedPlans) ? provider.mappedPlans.join(', ') : provider.mappedPlans}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Actions</h3>
        <div className="grid gap-3">
          <button
            onClick={() => setShowEditModal(true)}
            className="flex items-center gap-3 w-full p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition"
          >
            <FaEdit className="text-slate-600" />
            <span className="text-sm font-medium text-slate-900">Edit Profile</span>
          </button>
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-3 w-full p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition"
          >
            <FaUpload className="text-slate-600" />
            <span className="text-sm font-medium text-slate-900">Upload Tariff</span>
          </button>
          <button
            onClick={() => setShowViewModal(true)}
            className="flex items-center gap-3 w-full p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition"
          >
            <FaEye className="text-slate-600" />
            <span className="text-sm font-medium text-slate-900">View Tariff</span>
          </button>
          <button
            onClick={() => setShowSuspendModal(true)}
            className="flex items-center gap-3 w-full p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition"
          >
            <FaUserSlash className="text-slate-600" />
            <span className="text-sm font-medium text-slate-900">Suspend Provider</span>
          </button>
          <button
            onClick={() => setShowDeactivateModal(true)}
            className="flex items-center gap-3 w-full p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition"
          >
            <FaBan className="text-slate-600" />
            <span className="text-sm font-medium text-slate-900">Deactivate Provider</span>
          </button>
        </div>
      </div>

      {/* Recent Feed */}
      <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Feed</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div>
              <p className="text-sm text-slate-900">Provider profile updated</p>
              <p className="text-xs text-slate-600">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <div>
              <p className="text-sm text-slate-900">New tariff uploaded</p>
              <p className="text-xs text-slate-600">1 day ago</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
            <div>
              <p className="text-sm text-slate-900">Provider status changed to Active</p>
              <p className="text-xs text-slate-600">3 days ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modals would go here - simplified for brevity */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>
            <p className="text-sm text-slate-600 mb-4">Edit profile functionality would be implemented here.</p>
            <button onClick={() => setShowEditModal(false)} className="px-4 py-2 bg-blue-500 text-white rounded">Close</button>
          </div>
        </div>
      )}
      {/* Similar modals for other actions */}
    </div>
  );
}