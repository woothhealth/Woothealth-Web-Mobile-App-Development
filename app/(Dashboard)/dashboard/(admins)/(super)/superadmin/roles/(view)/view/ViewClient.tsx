'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaEye, FaEyeSlash, FaChevronDown, FaChevronUp, FaCheck, FaTimes } from 'react-icons/fa';
import { toast } from 'sonner';
import { Role as RoleType } from '../../mockRoles';
import { fetchRole } from '../../rolesService';

export default function RolesViewClient() {
  const searchParams = useSearchParams();
  const roleId = searchParams.get('id');
  const [role, setRole] = useState<RoleType | null>(null);
  const [showUsers, setShowUsers] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [showEditModal, setShowEditModal] = useState(false);
  const [editRoleDraft, setEditRoleDraft] = useState<RoleType | null>(null);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    if (roleId) {
      fetchRole(roleId)
        .then((r) => { if (mounted) setRole(r); })
        .catch(() => { if (mounted) setRole(null); });
    }
    return () => { mounted = false };
  }, [roleId]);

  useEffect(() => {
    if (showEditModal && role) {
      setEditRoleDraft(role);
      setSelectedModule(role.moduleAccess[0]?.module ?? null);
    }
  }, [showEditModal, role]);

  const toggleModuleExpansion = (module: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(module)) {
      newExpanded.delete(module);
    } else {
      newExpanded.add(module);
    }
    setExpandedModules(newExpanded);
  };

  if (!role) {
    return (
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="text-center py-10">
          <p className="text-slate-500">Role not found.</p>
          <Link
            href="/dashboard/superadmin/roles"
            className="inline-flex items-center gap-2 mt-4 text-[#49A5EF] hover:text-[#3d8ed8]"
          >
            <FaArrowLeft />
            Back to Roles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className='p-6 space-y-4'>
      <Link
        href="/dashboard/superadmin/roles"
        className="inline-flex items-center gap-2 mb-4 rounded-full border border-[#D9D9D9] p-4 text-sm"
      >
        <FaArrowLeft size={22} />
      </Link>
    <div className="rounded-3xl bg-white p-6 shadow-sm space-y-4">
      <div className='flex items-start justify-between'>
        <div className="">
          <h1 className="text-2xl font-semibold text-slate-900">{role.name}</h1>
          <p className="mt-1 text-sm text-slate-600">{role.description}</p>
        </div>
        <button
          type="button"
          onClick={() => setShowEditModal(true)}
          className='bg-[#49A5EF] text-[#ffffff] px-6 py-2 hover:bg-[#3d8ed8]'
        >
          Edit
        </button>
      </div>

      <div className="rounded-2xl bg-[#E5E7EB4D] px-4 py-2 space-y-2">
        <div className="flex items-center gap-3 justify-between">
        <div>
          <p className="text-[17px] font-medium">Total Users</p>
        </div>
        <button
          onClick={() => setShowUsers(!showUsers)}
          className="flex items-center gap-2 text-[#49A5EF] hover:text-[#3d8ed8]"
        >
          {showUsers ? <FaEyeSlash /> : <FaEye />}
          {showUsers ? 'Hide' : 'View'} Users
        </button>
      </div>

      {showUsers && (
        <div className="rounded-[10px] border border-[#D9D9D9]">
          <div className="divide-y divide-[#E5E7EB]">
            {role.users.map((user) => (
              <div key={user.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">{user.name}</p>
                  <p className="text-sm text-slate-600">{user.email}</p>
                </div>
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                  user.status === 'active'
                    ? 'bg-[#D1FAE5] text-[#10B981]'
                    : 'bg-[#FEE2E2] text-[#991B1B]'
                }`}>
                  {user.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>

      <div className="">
        <div className="p-4 border-b border-[#E5E7EB]">
          <h3 className="font-semibold text-[17px]">Module Access & Permissions</h3>
        </div>
        <div className="p-4 space-y-3">
          {role.moduleAccess.map((module) => {
            const isExpanded = expandedModules.has(module.module);
            const enabledPermissions = module.permissions.filter(p => p.enabled);

            return (
              <div key={module.module} className="bg-[#E5E7EB4D] rounded-[15px]">
                <button
                  type="button"
                  onClick={() => toggleModuleExpansion(module.module)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50"
                >
                  <div>
                    <span className="font-medium text-[17px] capitalize">
                      {module.module.replace('-', ' ')}
                    </span>
                    {enabledPermissions.length > 0 && (
                      <span className="ml-2 text-xs text-slate-500">
                        ({enabledPermissions.length} permissions)
                      </span>
                    )}
                  </div>
                  {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-[#D9D9D9]">
                    <div className="pt-3">
                      <p className="text-[15px] font-medium mb-3">Permissions</p>
                      <div className="flex gap-3">
                        {module.permissions.map((permission) => (
                          <div
                            key={permission.name}
                            className={`flex items-center gap-2 px-3 text-xs transition`}
                          >
                            <div className={`w-4 h-4 rounded-[10px] border ${
                              permission.enabled
                                ? 'bg-[#10B981] border-[#10B981]'
                                : 'border-slate-300 bg-white'
                            }`}>
                              {permission.enabled && (
                                <div className="w-full h-full flex items-center justify-center">
                                  <FaCheck className="text-white font-bold" size={12} />
                                </div>
                              )}
                            </div>
                            {permission.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {showEditModal && editRoleDraft && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="w-full md:w-3xl max-h-[90vh] overflow-y-auto rounded-[15px] bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Edit Role</h2>
                <p className="text-sm text-slate-600">Update the role name, description, and module permissions.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="text-slate-500 hover:text-slate-900"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Role Name</label>
                <input
                  type="text"
                  value={editRoleDraft.name}
                  onChange={(e) => setEditRoleDraft(prev => prev ? { ...prev, name: e.target.value } : prev)}
                  className="w-full rounded-xl border border-[#D9D9D9] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Description</label>
                <textarea
                  value={editRoleDraft.description}
                  onChange={(e) => setEditRoleDraft(prev => prev ? { ...prev, description: e.target.value } : prev)}
                  rows={3}
                  className="w-full rounded-xl border border-[#D9D9D9] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF] resize-none"
                />
              </div>

              <div className="grid gap-6 md:grid-cols-[250px_1fr]">
                <div className="rounded-2xl border border-[#E5E7EB] p-4 space-y-2 overflow-y-auto max-h-[360px]">
                  <h3 className="text-sm font-semibold text-slate-900">Modules</h3>
                  <div className="space-y-2">
                    {editRoleDraft.moduleAccess.map((module) => {
                      const enabledCount = module.permissions.filter(p => p.enabled).length;
                      const isActive = selectedModule === module.module;

                      return (
                        <button
                          key={module.module}
                          type="button"
                          onClick={() => setSelectedModule(module.module)}
                          className={`w-full rounded-2xl px-4 py-3 text-left transition ${
                            isActive ? 'bg-[#49A5EF] text-white' : 'border border-[#E5E7EB] bg-white text-slate-900 hover:border-[#49A5EF]'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="capitalize">{module.module.replace('-', ' ')}</span>
                            {enabledCount > 0 && (
                              <span className="text-xs text-slate-200">{enabledCount} enabled</span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-2xl border border-[#E5E7EB] p-4 min-h-[360px]">
                  {selectedModule ? (
                    <>
                      <h3 className="text-sm font-semibold text-slate-900 capitalize">{selectedModule.replace('-', ' ')} Permissions</h3>
                      <div className="mt-4 grid gap-3">
                        {editRoleDraft.moduleAccess.find(m => m.module === selectedModule)?.permissions.map((permission) => (
                          <button
                            key={permission.name}
                            type="button"
                            onClick={() => {
                              setEditRoleDraft(prev => {
                                if (!prev) return prev;
                                return {
                                  ...prev,
                                  moduleAccess: prev.moduleAccess.map((module) =>
                                    module.module === selectedModule
                                      ? {
                                          ...module,
                                          permissions: module.permissions.map((item) =>
                                            item.name === permission.name
                                              ? { ...item, enabled: !item.enabled }
                                              : item
                                          )
                                        }
                                      : module
                                  )
                                };
                              });
                            }}
                            className={`flex items-center gap-3 w-full rounded-xl border px-4 py-3 text-sm transition ${
                              permission.enabled
                                ? 'border-[#49A5EF] bg-[#EFF6FF] text-[#49A5EF]'
                                : 'border-[#E5E7EB] bg-white text-slate-700 hover:border-[#49A5EF]'
                            }`}
                          >
                            <span className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                              permission.enabled ? 'bg-[#49A5EF] border-[#49A5EF]' : 'border-slate-300'
                            }`}>
                              {permission.enabled && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </span>
                            <span>{permission.name}</span>
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-500">
                      <p>Select a module to edit permissions</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="rounded-2xl border border-[#E5E7EB] px-5 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!editRoleDraft) return;
                  if (!editRoleDraft.name.trim()) {
                    toast.error('Please enter a role name.');
                    return;
                  }

                  setRole(editRoleDraft);
                  setShowEditModal(false);
                  toast.success('Role updated successfully.');
                }}
                className="inline-flex items-center justify-center rounded-2xl bg-[#49A5EF] px-5 py-2 text-sm font-semibold text-white hover:bg-[#3d8ed8]"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </section>
  );
}