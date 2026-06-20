// React Router: Link handles navigation, useNavigate handles programmatic routing.
import React from "react";
import { Link, useNavigate } from "react-router-dom";
// react-hook-form: Custom form management library providing validation, submission handling, and status.
import { useForm } from "react-hook-form";
// Auth Context subscription hook
import { useAuth } from "../context/AuthContext";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

// React Concept: ForgotPassword represents a form component for requesting password recovery codes
export default function ForgotPassword() {
  // Custom Hook: useAuth accesses authentication actions like forgotPassword()
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();

  // useForm Hook: registers inputs and handles submission state
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm();

  const onSubmit = async (data) => {
    try {
      forgotPassword(data.email);
      toast.success("Security reset code sent! Use code 123456.");
      navigate(`/reset-password?email=${encodeURIComponent(data.email)}`);
    } catch (error) {
      toast.error(error.message || "Email address not found.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-white">Recover Password</h3>
        <p className="text-xs text-slate-400 mt-1">Enter your registered email to receive a reset code.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
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
              placeholder="e.g. name@domain.com"
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
            />
          </div>
          {errors.email && <span className="text-[10px] text-rose-500 mt-1 block">{errors.email.message}</span>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Reset Code"}
        </button>
      </form>

      {/* Back to Login link */}
      <div className="text-center">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-sky-400"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Login
        </Link>
      </div>
    </div>
  );
}
