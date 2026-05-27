'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaPlus, FaEye, FaEllipsisV, FaTrash, FaTimes } from 'react-icons/fa';
import { toast } from 'sonner';
import DeleteConfirmModal from '../../DeleteConfirmModal';
import { Role, ModuleAccess, Permission, MODULES, PERMISSIONS } from '../mockRoles';
import { FaCheck } from 'react-icons/fa6';

export default function RolesClient() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Role | null>(null);
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    const role = roles.find((r) => r.id === id);
    if (!role) return;
    setDeleteTarget(role);
    setOpenActionMenu(null);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    // Optimistic UI update
    const id = deleteTarget.id;
    setRoles((current) => current.filter((role) => role.id !== id));
    setDeleteTarget(null);

    fetch('/api/admin/role', {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to delete role');
        toast.success('Role deleted successfully.');
      })
      .catch(() => {
        toast.error('Failed to delete role. Refresh to retry.');
      });
  };

  const handleCreateRole = (role: Role) => {
    // POST to API then prepend
    const payload = { ...role };
    fetch('/api/admin/role', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        const created: Role = data?.data || payload;
        setRoles((current) => [created, ...current]);
        setShowCreateModal(false);
        toast.success('Role created successfully.');
      })
      .catch(() => {
        toast.error('Failed to create role.');
      });
  };

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch('/api/admin/role', { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to load roles');
        const json = await res.json();
        const list: Role[] = json?.data || [];
        if (mounted) setRoles(list);
      })
      .catch(() => {
        toast.error('Failed to load roles.');
      })
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Roles</h1>
        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 rounded-2xl bg-[#49A5EF] px-5 py-3 text-sm w-fit font-semibold text-white hover:bg-[#3d8ed8]"
        >
          <FaPlus />
          Create Role
        </button>
      </div>

      <div className="">
        <div className='space-y-2'>
          {loading ? (
            <div className="px-4 py-6">
              <p className="text-sm text-slate-500">Loading roles...</p>
            </div>
          ) : roles.length === 0 ? (
            <div>
              <p className="px-4 py-10 text-center text-sm text-slate-500">
                No roles found.
              </p>
            </div>
          ) : (
            roles.map((role) => (
              <div key={role.id} className="bg-[#ffffff] flex items-center justify-between px-4 py-2 rounded-[15px]">
                <span className="text-lg font-medium">{role.name}</span>
                <span className="relative text-center">
                  <button
                    onClick={() => setOpenActionMenu(openActionMenu === role.id ? null : role.id)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-200"
                  >
                    <FaEllipsisV />
                  </button>
                  {openActionMenu === role.id && (
                    <div className="absolute right-4 top-full z-10 mt-2 w-36 overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white shadow-lg">
                      <Link
                        href={`/dashboard/superadmin/roles/view?id=${role.id}`}
                        className="flex items-center gap-2 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
                        onClick={() => setOpenActionMenu(null)}
                      >
                        <FaEye />
                        View
                      </Link>
                      <button
                        onClick={() => handleDelete(role.id)}
                        className="flex w-full items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-slate-50"
                      >
                        <FaTrash />
                        Delete
                      </button>
                    </div>
                  )}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {deleteTarget && (
        <DeleteConfirmModal
          title="Delete Role"
          description={`Are you sure you want to delete the "${deleteTarget.name}" role? This action cannot be undone and will affect ${deleteTarget.totalUsers} users.`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      )}

      {showCreateModal && (
        <CreateRoleModal onClose={() => setShowCreateModal(false)} onCreate={handleCreateRole} />
      )}
    </div>
  );
}

function CreateRoleModal({ onClose, onCreate }: { onClose: () => void; onCreate: (role: Role) => void }) {
  const [step, setStep] = useState<'name' | 'permissions'>('name');
  const [roleName, setRoleName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [moduleAccess, setModuleAccess] = useState<ModuleAccess[]>(
    MODULES.map(module => ({
      module,
      permissions: PERMISSIONS.map(permission => ({
        name: permission,
        enabled: false
      }))
    }))
  );

  const handleNext = () => {
    if (!roleName.trim()) {
      toast.error('Please enter a role name.');
      return;
    }
    setStep('permissions');
  };

  const togglePermission = (moduleName: string, permissionName: Permission['name']) => {
    setModuleAccess(current =>
      current.map(module =>
        module.module === moduleName
          ? {
              ...module,
              permissions: module.permissions.map(permission =>
                permission.name === permissionName
                  ? { ...permission, enabled: !permission.enabled }
                  : permission
              )
            }
          : module
      )
    );
  };

  const handleCreate = () => {
    const hasPermissions = moduleAccess.some(module =>
      module.permissions.some(permission => permission.enabled)
    );

    if (!hasPermissions) {
      toast.error('Please select at least one permission.');
      return;
    }

    const newRole: Role = {
      id: `role-${Date.now()}`,
      name: roleName,
      description: roleDescription || `${roleName} role`,
      totalUsers: 0,
      users: [],
      moduleAccess,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onCreate(newRole);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="w-full md:w-3xl overflow-y-auto rounded-[15px] bg-white p-6 shadow-xl max-h-[90vh]">
        <div className="flex items-start justify-between gap-4 mb-6">
          <h2 className="text-2xl font-semibold">{step === 'name' ? 'Create New Role' : 'Module access'}</h2>
          <button onClick={onClose} className=" 
          hover:text-slate-900">
            <FaTimes size={20} />
          </button>
        </div>

        {step === 'name' && (
          <div className="space-y-4">
            <div>
              <label className="block text-base font-semibold mb-2">
                Role Name *
              </label>
              <input
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                placeholder="Enter role name"
                className="w-full rounded-xl border border-[#D9D9D9] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
              />
            </div>
            <div>
              <label className="block text-base font-medium mb-2">
                Description
              </label>
              <textarea
                value={roleDescription}
                onChange={(e) => setRoleDescription(e.target.value)}
                placeholder="Enter role description"
                rows={3}
                className="w-full rounded-xl border border-[#D9D9D9] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF] resize-none"
              />
            </div>
          </div>
        )}

        {step === 'permissions' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-[1.8fr_1.2fr] gap-6 max-h-[400px]">
              {/* Left Column: Module Selection */}
              <div className="overflow-y-auto h-90 pr-2">
                <div className="space-y-2">
                  {moduleAccess.map((module) => {
                    const enabledCount = module.permissions.filter(p => p.enabled).length;
                    const isSelected = selectedModule === module.module;

                    return (
                      <div
                        key={module.module}
                        onClick={() => setSelectedModule(module.module)}
                        className={`w-full flex flex-col gap-1 px-4 py-2 text-[17px] rounded-xl text-left transition cursor-pointer ${
                          isSelected
                            ? 'bg-[#49A5EF] text-white'
                            : 'border border-[#D9D9D9] bg-white hover:border-[#49A5EF]'
                        }`}
                      >
                        <span className="font-medium capitalize">
                          {module.module.replace('-', ' ')}
                        </span>
                        {enabledCount > 0 && (
                          <span className={`text-xs ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                            {enabledCount} permission{enabledCount !== 1 ? 's' : ''} enabled
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Permissions for Selected Module */}
              <div className="border border-[#D9D9D9] rounded-2xl overflow-y-auto h-90">
                {selectedModule ? (
                  <div className="p-4 space-y-4">
                    <h3 className="font-medium text-slate-900 capitalize">
                      {selectedModule.replace('-', ' ')} Permissions
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      {moduleAccess
                        .find(m => m.module === selectedModule)
                        ?.permissions.map((permission) => (
                          <div
                            key={permission.name}
                            onClick={() => togglePermission(selectedModule, permission.name)}
                            className={`flex items-center gap-3 px-2 text-sm transition`}
                          >
                            <div className={`w-4 h-4 rounded-[15px] border-2 flex items-center justify-center shrink-0 ${
                              permission.enabled
                                ? 'bg-[#49A5EF] border-[#49A5EF]'
                                : 'border-slate-300'
                            }`}>
                              {permission.enabled && (
                                <FaCheck className="text-white font-semibold" size={12}/>
                              )}
                            </div>
                            <span>{permission.name}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-500">
                    <p className="text-center text-sm">Select a module to view permissions</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          {step === 'permissions' && (
            <button
              type="button"
              onClick={() => setStep('name')}
              className="rounded-2xl border border-[#D9D9D9] px-8 py-2 text-base hover:bg-slate-50"
            >
              Back
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl bg-[#EF4444] px-8 py-2 text-base text-[#ffffff] hover:bg-[#EF44441A]"
          >
            Cancel
          </button>
          {step === 'name' ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center justify-center rounded-2xl bg-[#49A5EF] px-5 py-2 text-base font-semibold text-white hover:bg-[#3d8ed8]"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleCreate}
              className="inline-flex items-center justify-center rounded-2xl bg-[#49A5EF] px-5 py-2 text-base font-semibold text-white hover:bg-[#3d8ed8]"
            >
              Create Role
            </button>
          )}
        </div>
      </div>
    </div>
  );
}