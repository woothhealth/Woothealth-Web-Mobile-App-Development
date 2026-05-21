'use client';

import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaEllipsisV } from 'react-icons/fa';
import {
  useAdminEmployees,
  createAdminEmployee,
  updateAdminEmployee,
  deleteAdminEmployee,
  Employee,
  departments,
  employeeRoles as roles,
  employeeStatuses,
} from '@/lib/adminEmployees';

const ROWS_PER_PAGE = 10;
const statuses = ['All status', ...employeeStatuses];

export default function EmployeesClient() {
  const { data, isLoading, error, refetch } = useAdminEmployees();
  const employees = data?.data || [];
  
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('All roles');
  const [filterDepartment, setFilterDepartment] = useState('All departments');
  const [filterStatus, setFilterStatus] = useState('All status');
  const [openFilter, setOpenFilter] = useState<'role' | 'department' | 'status' | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [page, setPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);

  const filteredEmployees = useMemo(() => {
    const query = search.trim().toLowerCase();

    return employees.filter((employee : Employee) => {
      const matchesSearch =
        employee.name.toLowerCase().includes(query) ||
        employee.email.toLowerCase().includes(query) ||
        employee.phone.toLowerCase().includes(query);

      const matchesRole = filterRole === 'All roles' || employee.role === filterRole;
      const matchesDepartment = filterDepartment === 'All departments' || employee.department === filterDepartment;
      const matchesStatus = filterStatus === 'All status' || employee.status === filterStatus;

      return matchesSearch && matchesRole && matchesDepartment && matchesStatus;
    });
  }, [employees, search, filterRole, filterDepartment, filterStatus]);

  const paginatedEmployees = useMemo(() => {
    const start = (page - 1) * ROWS_PER_PAGE;
    return filteredEmployees.slice(start, start + ROWS_PER_PAGE);
  }, [filteredEmployees, page]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    if (type === 'success') {
      toast.success(message);
    } else {
      toast.error(message);
    }
  };

  const handleOpenFilter = (type: 'role' | 'department' | 'status') => {
    setOpenFilter((current) => (current === type ? null : type));
  };

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setIsModalOpen(true);
    setOpenFilter(null);
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
    setOpenFilter(null);
  };

  const handleDeleteEmployee = (id: string) => {
    const employee = employees.find((emp: Employee) => emp.id === id);
    if (employee) {
      setDeleteTarget(employee);
    }
  };

  const confirmDeleteEmployee = async () => {
    if (deleteTarget) {
      try {
        await deleteAdminEmployee(deleteTarget.id);
        toast.success(`Employee "${deleteTarget.name}" has been deleted successfully.`);
        refetch();
      } catch (err: any) {
        toast.error(err.message || 'Failed to delete employee');
      }
      setDeleteTarget(null);
    }
  };

  const handleSaveEmployee = async (employeeData: Omit<Employee, 'id'>) => {
    try {
      if (editingEmployee) {
        await updateAdminEmployee(editingEmployee.id, employeeData);
        showToast(`Employee "${employeeData.name}" has been updated successfully.`);
      } else {
        await createAdminEmployee(employeeData);
        showToast(`Employee "${employeeData.name}" has been added successfully.`);
      }
      setIsModalOpen(false);
      setEditingEmployee(null);
      refetch();
    } catch (err: any) {
      showToast(err.message || 'Failed to save employee', 'error');
    }
  };

  const statusColors: Record<string, string> = {
    'Active': 'bg-[#D1FAE5] text-[#10B981]',
    'Inactive': 'bg-[#EF44441A] text-[#EF4444]',
  };

  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / ROWS_PER_PAGE));
  const startRange = Math.min((page - 1) * ROWS_PER_PAGE + 1, filteredEmployees.length);
  const endRange = Math.min(page * ROWS_PER_PAGE, filteredEmployees.length);

  if (isLoading) {
    return (
      <div className="p-4 mb-8 w-full mx-auto">
        <div className="text-center py-12 text-slate-500">Loading employees...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 mb-8 w-full mx-auto">
        <div className="text-center py-12 text-red-500">Error loading employees: {(error as any).message}</div>
      </div>
    );
  }

  return (
    <div className="p-4 mb-8 w-full mx-auto">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
        <div className="flex flex-col space-y-2 md:space-y-0 md:gap-4 lg:flex-row lg:items-center lg:gap-3 w-full lg:w-auto z-10">
          <div className="flex w-full items-center gap-3">
            <input
              type="search"
              placeholder="Search name, email or phone"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="min-w-[280px] flex-1 rounded-lg border border-border bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition"
            />
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => handleOpenFilter('role')}
              className="w-full md:w-30 border border-slate-300 bg-white px-6 py-3 text-left text-sm text-slate-900 shadow-sm transition rounded-lg hover:border-border"
            >
              {filterRole}
            </button>
            {openFilter === 'role' && (
              <div className="absolute z-10 mt-2 w-full md:w-fit rounded-xl border border-border bg-white shadow-lg h-80 custom-scrollbar overflow-auto">
                <div
                  className="cursor-pointer px-4 py-3 text-sm hover:bg-slate-100"
                  onClick={() => {
                    setFilterRole('All roles');
                    setOpenFilter(null);
                  }}
                >
                  All roles
                </div>
                {roles.map((role) => (
                  <div
                    key={role}
                    className={`cursor-pointer px-4 py-3 text-sm hover:bg-slate-100 ${filterRole === role ? 'bg-[#49A5EF] text-white rounded-[5px]' : ''}`}
                    onClick={() => {
                      setFilterRole(role);
                      setOpenFilter(null);
                    }}
                  >
                    {role}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => handleOpenFilter('department')}
              className="w-36 rounded-lg border border-border bg-white px-4 py-3 text-left text-sm text-slate-900 shadow-sm transition hover:border-border"
            >
              {filterDepartment}
            </button>
            {openFilter === 'department' && (
              <div className="absolute z-10 mt-2 w-full rounded-xl border border-border bg-white shadow-lg">
                <div
                  className="cursor-pointer px-4 py-3 text-sm hover:bg-slate-100"
                  onClick={() => {
                    setFilterDepartment('All departments');
                    setOpenFilter(null);
                  }}
                >
                  All departments
                </div>
                {departments.map((department) => (
                  <div
                    key={department}
                    className={`cursor-pointer px-4 py-3 text-sm hover:bg-slate-100 ${filterDepartment === department ? 'bg-[#49A5EF] text-white rounded-[5px]' : ''}`}
                    onClick={() => {
                      setFilterDepartment(department);
                      setOpenFilter(null);
                    }}
                  >
                    {department}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => handleOpenFilter('status')}
              className="w-26 rounded-lg border border-border bg-white px-4 py-3 text-left text-sm text-slate-900 shadow-sm transition hover:border-border"
            >
              {filterStatus}
            </button>
            {openFilter === 'status' && (
              <div className="absolute z-10 mt-2 w-full rounded-xl border border-border bg-white shadow-lg">
                {statuses.map((status) => (
                  <div
                    key={status}
                    className={`cursor-pointer px-4 py-3 text-sm hover:bg-slate-200 ${filterStatus === status ? 'bg-[#49A5EF] text-white rounded-[5px]' : ''}`}
                    onClick={() => {
                      setFilterStatus(status);
                      setOpenFilter(null);
                    }}
                  >
                    {status}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleAddEmployee}
          className="inline-flex items-center gap-2 rounded-lg bg-[#49A5EF] w-fit px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#41a3f3]"
        >
          <FaPlus /> Add Employee
        </button>
      </div>

      <div className="overflow-x-auto rounded-[10px] bg-white shadow-sm custom-scrollbar">
        <table className="min-w-full divide-y divide-border text-[15px]">
          <thead className="font-semibold text-lg">
            <tr>
              <th className="px-4 py-4 text-left">Name</th>
              <th className="px-4 py-4 text-left">Department</th>
              <th className="px-4 py-4 text-left">Role</th>
              <th className="px-4 py-4 text-left">Email</th>
              <th className="px-4 py-4 text-left">Phone</th>
              <th className="px-4 py-4 text-center">Status</th>
              <th className="px-4 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {paginatedEmployees.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-slate-500">
                  No employees found
                </td>
              </tr>
            ) : (
              paginatedEmployees.map((employee : Employee) => (
                <tr key={employee.id} className="hover:bg-slate-50">
                  <td className="px-4 py-4 text-slate-900 whitespace-nowrap w-fit">{employee.name}</td>
                  <td className="px-4 py-4 text-slate-600">{employee.department}</td>
                  <td className="px-4 py-4 text-slate-600">{employee.role}</td>
                  <td className="px-4 py-4 text-slate-600">{employee.email}</td>
                  <td className="px-4 py-4 text-slate-600 whitespace-nowrap w-fit">{employee.phone}</td>
                  <td className="text-center py-2 text-slate-700">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[employee.status]}`}>
                      {employee.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === employee.id ? null : employee.id)}
                        className="text-slate-500 hover:text-slate-700"
                      >
                        <FaEllipsisV />
                      </button>
                      {openMenuId === employee.id && (
                        <div className="absolute right-0 mt-2 w-32 rounded-lg border border-slate-200 bg-white shadow-lg z-10">
                          <button
                            onClick={() => {
                              handleEditEmployee(employee);
                              setOpenMenuId(null);
                            }}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                          >
                            <FaEdit /> Edit
                          </button>
                          <button
                            onClick={() => {
                              handleDeleteEmployee(employee.id);
                              setOpenMenuId(null);
                            }}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                          >
                            <FaTrash /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between text-sm text-slate-600">
        <p>Showing {startRange}-{endRange} of {filteredEmployees.length} employees</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page === 1}
            className="rounded-lg border border-slate-300 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            disabled={page === totalPages}
            className="rounded-lg border border-slate-300 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {isModalOpen && (
        <EmployeeModal
          employee={editingEmployee}
          onSave={handleSaveEmployee}
          onClose={() => {
            setIsModalOpen(false);
            setEditingEmployee(null);
          }}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmModal
          employee={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDeleteEmployee}
        />
      )}

       <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
          margin-top: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #00000032;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #00000080;
          border-radius: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #e0e0e0;
        }
      `}</style>
    </div>
  );
}

interface EmployeeModalProps {
  employee: Employee | null;
  onSave: (employeeData: Omit<Employee, 'id'>) => void;
  onClose: () => void;
}

function EmployeeModal({ employee, onSave, onClose }: EmployeeModalProps) {
  const [formData, setFormData] = useState({
    name: employee?.name || '',
    department: employee?.department || '',
    role: employee?.role || '',
    email: employee?.email || '',
    phone: employee?.phone || '',
    status: employee?.status || 'Active',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [openField, setOpenField] = useState<'department' | 'role' | 'status' | null>(null);

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!formData.name.trim()) nextErrors.name = 'Name is required';
    if (!formData.email.trim()) nextErrors.email = 'Email is required';
    if (!formData.phone.trim()) nextErrors.phone = 'Phone number is required';
    if (!formData.department) nextErrors.department = 'Department is required';
    if (!formData.role) nextErrors.role = 'Role is required';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    onSave({
      name: formData.name,
      department: formData.department,
      role: formData.role,
      email: formData.email,
      phone: formData.phone,
      status: formData.status as 'Active' | 'Inactive',
    });
  };

  const chooseValue = (field: 'department' | 'role' | 'status', value: string) => {
    setFormData({ ...formData, [field]: value });
    setOpenField(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="w-full md:w-2xl rounded-xl bg-white p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{employee ? 'Edit Employee' : 'Add New Employee'}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900">
            <FaTimes size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 h-110 pr-2 md:h-124 overflow-auto custom-scrollbar">
          <div className='space-y-1'>
            <label className="block font-medium">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-[10px] border border-slate-300 px-4 py-2 outline-none focus:border-[#49A5EF]"
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>

          <div className='space-y-1'>
            <label className="block font-medium">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-[10px] border border-slate-300 px-4 py-2 outline-none focus:border-[#49A5EF]"
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
          </div>

          <div className='space-y-1'>
            <label className="block font-medium">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full rounded-[10px] border border-slate-300 px-4 py-2 outline-none focus:border-[#49A5EF]"
            />
            {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="relative space-y-1">
              <label className="block font-medium">Department</label>
              <div
                onClick={() => setOpenField((value) => (value === 'department' ? null : 'department'))}
                className="w-full rounded-[10px] border border-slate-300 px-4 py-2 text-left text-slate-700 outline-none cursor-pointer"
              >
                {formData.department || 'Select department'}
              </div>
              {openField === 'department' && (
                <div className="absolute z-20 mt-2 w-full rounded-xl border border-slate-200 bg-white shadow-lg h-30 overflow-auto custom-scrollbar">
                  {departments.map((department) => (
                    <div
                      key={department}
                      className="cursor-pointer px-4 py-3 text-sm hover:bg-slate-100"
                      onClick={() => chooseValue('department', department)}
                    >
                      {department}
                    </div>
                  ))}
                </div>
              )}
              {errors.department && <p className="mt-1 text-sm text-red-500">{errors.department}</p>}
            </div>

            <div className="relative space-y-1">
              <label className="block font-medium">Role</label>
              <div
                onClick={() => setOpenField((value) => (value === 'role' ? null : 'role'))}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2 text-left text-slate-700 outline-none cursor-pointer"
              >
                {formData.role || 'Select role'}
              </div>
              {openField === 'role' && (
                <div className="absolute z-20 mt-2 w-full overflow-auto rounded-2xl border border-slate-200 bg-white shadow-lg h-30 custom-scrollbar">
                  {roles.map((role) => (
                    <div
                      key={role}
                      className="cursor-pointer px-4 py-3 text-sm hover:bg-slate-100"
                      onClick={() => chooseValue('role', role)}
                    >
                      {role}
                    </div>
                  ))}
                </div>
              )}
              {errors.role && <p className="mt-1 text-sm text-red-500">{errors.role}</p>}
            </div>
          </div>

          <div className="relative">
            <label className="block font-medium">Status</label>
            <div
              onClick={() => setOpenField((value) => (value === 'status' ? null : 'status'))}
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2 text-left text-slate-700 outline-none cursor-pointer"
            >
              {formData.status}
            </div>
            {openField === 'status' && (
              <div className="absolute z-20 mt-2 w-full rounded-2xl border border-slate-200 bg-white shadow-lg">
                {['Active', 'Inactive'].map((statusOption) => (
                  <div
                    key={statusOption}
                    className="cursor-pointer px-4 py-3 text-sm hover:bg-slate-100"
                    onClick={() => chooseValue('status', statusOption)}
                  >
                    {statusOption}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-2xl bg-[#49A5EF] px-4 py-3 text-sm font-semibold text-white hover:bg-[#49A5EF]/90"
            >
              {employee ? 'Save changes' : 'Add employee'}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
          margin-top: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #00000032;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #00000080;
          border-radius: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #e0e0e0;
        }
      `}</style>
    </div>
  );
}

interface DeleteConfirmModalProps {
  employee: Employee;
  onCancel: () => void;
  onConfirm: () => void;
}

function DeleteConfirmModal({ employee, onCancel, onConfirm }: DeleteConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-slate-900">Delete Employee</h2>
        <p className="mt-3 text-slate-600">
          Are you sure you want to delete <strong className="text-slate-900">{employee.name}</strong>? This action cannot be undone and will permanently remove the employee from the system.
        </p>
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600 transition"
          >
            Delete Employee
          </button>
        </div>
      </div>
    </div>
  );
}

