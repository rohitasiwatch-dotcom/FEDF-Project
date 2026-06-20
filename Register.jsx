// React Hook: useState is a React Hook that lets you add a state variable to your component.
import React, { useState } from "react";
// React Router: Link handles navigation, useNavigate handles programmatic routing.
import { Link, useNavigate } from "react-router-dom";
// react-hook-form: Custom form management library providing input registry and form state tracking.
import { useForm } from "react-hook-form";
// Auth Context subscription hook
import { useAuth } from "../context/AuthContext";
import { User, Mail, Phone, Calendar, UserCheck, ShieldAlert, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

// React Concept: Register is a form component that lets new users signup
export default function Register() {
  // Custom Hook: useAuth accesses authentication actions like register()
  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();

  // useState: state variables for toggling password visibility fields
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // useForm Hook: registers inputs and tracks validation state
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm();

  // watch: a helper function from useForm that listens to updates on specified input field(s)
  const passwordVal = watch("password");

  const onSubmit = async (data) => {
    try {
      const user = registerAuth(data);
      toast.success(`Account created successfully! Welcome, ${user.name}`);
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message || "Failed to create account.");
    }
  };

  const genders = ["Male", "Female", "Other"];
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-white">Create Immunization Account</h3>
        <p className="text-xs text-slate-400 mt-1">Register to start logging and scheduling vaccines.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Full Name
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </span>
            <input
              type="text"
              {...register("fullName", { required: "Full Name is required" })}
              placeholder="e.g. John Doe"
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
            />
          </div>
          {errors.fullName && <span className="text-[10px] text-rose-500 mt-1 block">{errors.fullName.message}</span>}
        </div>

        {/* Email & Mobile Number (2-column on larger screens) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email"
                  }
                })}
                placeholder="e.g. user@domain.com"
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
              />
            </div>
            {errors.email && <span className="text-[10px] text-rose-500 mt-1 block">{errors.email.message}</span>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Mobile Number
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" />
              </span>
              <input
                type="text"
                {...register("mobile", { required: "Mobile number is required" })}
                placeholder="e.g. +1 (555) 000-0000"
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
              />
            </div>
            {errors.mobile && <span className="text-[10px] text-rose-500 mt-1 block">{errors.mobile.message}</span>}
          </div>
        </div>

        {/* DOB, Gender & Blood Group (3-column on larger screens) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Date of Birth
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Calendar className="w-4 h-4" />
              </span>
              <input
                type="date"
                {...register("dob", { required: "DOB is required" })}
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
              />
            </div>
            {errors.dob && <span className="text-[10px] text-rose-500 mt-1 block">{errors.dob.message}</span>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Gender
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <UserCheck className="w-4 h-4" />
              </span>
              <select
                {...register("gender", { required: "Gender is required" })}
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
              >
                <option value="">Select</option>
                {genders.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            {errors.gender && <span className="text-[10px] text-rose-500 mt-1 block">{errors.gender.message}</span>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Blood Group
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <ShieldAlert className="w-4 h-4" />
              </span>
              <select
                {...register("bloodGroup", { required: "Blood Group is required" })}
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
              >
                <option value="">Select</option>
                {bloodGroups.map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
            {errors.bloodGroup && <span className="text-[10px] text-rose-500 mt-1 block">{errors.bloodGroup.message}</span>}
          </div>
        </div>

        {/* Passwords (2-column on larger screens) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Must be at least 6 characters"
                  }
                })}
                placeholder="••••••••"
                className="w-full px-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <span className="text-[10px] text-rose-500 mt-1 block">{errors.password.message}</span>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword", {
                  required: "Please confirm password",
                  validate: (value) => value === passwordVal || "Passwords do not match"
                })}
                placeholder="••••••••"
                className="w-full px-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="text-[10px] text-rose-500 mt-1 block">{errors.confirmPassword.message}</span>
            )}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign Up"}
        </button>
      </form>

      {/* Login link */}
      <div className="text-center text-xs text-slate-400">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-blue-600 dark:text-sky-400 hover:underline">
          Sign In Here
        </Link>
      </div>
    </div>
  );
}
