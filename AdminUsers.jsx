// React Hook: useState is a React Hook that lets you add state variables to your component.
import React, { useState } from "react";
// Context subscription hook
import { useAuth } from "../context/AuthContext";
import {
  Users,
  Edit2,
  Lock,
  Unlock,
  Trash2,
  X,
  ShieldAlert,
  Search,
  CheckCircle,
  XCircle
} from "lucide-react";
// react-hook-form: form state and validation provider
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

// React Concept: AdminUsers renders the administrative user directory layout, managing patient edit and status actions
export default function AdminUsers() {
  // Global auth context subscription
  const { users, adminUpdateUser, suspendUser, deleteUser } = useAuth();

  // useState: state trackers for query inputs, current user selection for editing, and modal visibility
  const [searchQuery, setSearchQuery] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // useForm Hook: registers edit form inputs
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    reset({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role
    });
    setModalOpen(true);
  };

  const handleFormSubmit = (data) => {
    if (editingUser) {
      adminUpdateUser(editingUser.id, data);
      toast.success("User credentials updated successfully!");
      setModalOpen(false);
    }
  };

  const handleSuspend = (id, name, status) => {
    const action = status === "active" ? "suspend" : "activate";
    if (window.confirm(`Are you sure you want to ${action} ${name}?`)) {
      suspendUser(id);
      toast.success(`User account has been ${status === "active" ? "suspended" : "activated"}!`);
    }
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete user ${name}? This action is permanent.`)) {
      deleteUser(id);
      toast.success("User account deleted.");
    }
  };

  // Filter patient/staff profiles
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold dark:text-white">Patient & User Directory</h2>
          <p className="text-xs text-slate-400 font-medium">Verify login statuses, suspend accounts, and edit profile fields.</p>
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name or email..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none dark:text-white"
          />
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Mobile</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-450 italic">
                    No users matching search query.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/25 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border flex items-center justify-center font-bold text-blue-600">
                          {user.avatar ? (
                            <img src={user.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                          ) : (
                            user.name.split(" ").map((n) => n[0]).join("")
                          )}
                        </div>
                        <span className="font-bold text-slate-800 dark:text-white">{user.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-500 dark:text-slate-400">{user.email}</td>
                    <td className="p-4 text-slate-500 dark:text-slate-400 font-semibold">{user.mobile || "N/A"}</td>
                    <td className="p-4 uppercase font-bold text-[10px]">
                      <span className={`px-2 py-0.5 rounded ${user.role === "admin" ? "bg-purple-500/10 text-purple-600 dark:text-purple-400" : "bg-blue-500/10 text-blue-600 dark:text-sky-400"}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 font-semibold">
                      {user.status === "active" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold">
                          <XCircle className="w-3.5 h-3.5" />
                          Suspended
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex gap-1.5 justify-end">
                        <button
                          onClick={() => handleOpenEdit(user)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                          title="Edit User Details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleSuspend(user.id, user.name, user.status)}
                          className={`p-1.5 rounded-lg border ${
                            user.status === "active"
                              ? "border-amber-200/50 hover:bg-amber-50 dark:border-amber-900/50 text-amber-500"
                              : "border-emerald-200/50 hover:bg-emerald-50 dark:border-emerald-900/50 text-emerald-500"
                          }`}
                          title={user.status === "active" ? "Suspend Account" : "Activate Account"}
                        >
                          {user.status === "active" ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => handleDelete(user.id, user.name)}
                          disabled={user.role === "admin"}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 disabled:opacity-30"
                          title="Delete User"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Modal Overlay */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-3 mb-4">
              <h3 className="font-bold text-sm dark:text-white">Edit User: {editingUser?.name}</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-450 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  {...register("name", { required: "Name is required" })}
                  className="w-full px-4 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-805 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-450 uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  {...register("email", { required: "Email is required" })}
                  className="w-full px-4 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-805 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-450 uppercase mb-1">Mobile Number</label>
                <input
                  type="text"
                  {...register("mobile")}
                  className="w-full px-4 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-805 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-455 uppercase mb-1">Role</label>
                <select
                  {...register("role")}
                  className="w-full px-4 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-805 rounded-xl focus:outline-none dark:text-white"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t border-slate-100 dark:border-slate-805">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-805 text-slate-650 dark:text-slate-350"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
