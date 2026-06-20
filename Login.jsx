// React Hook: useState is a React Hook that lets you add a state variable to your component.
import React, { useState } from "react";
// React Router: Link handles navigation, useNavigate handles programmatic routing.
import { Link, useNavigate } from "react-router-dom";
// react-hook-form: Custom form management library providing validation, submission handling, and status.
import { useForm } from "react-hook-form";
// Auth Context subscription hook
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

// React Concept: Login represents the sign-in form page utilizing managed form validation
export default function Login() {
  // Custom Hook: useAuth accesses authentication actions like login()
  const { login } = useAuth();
  const navigate = useNavigate();

  // useState: state variable for toggling password visibility
  const [showPassword, setShowPassword] = useState(false);

  // useForm Hook: initializes configuration for react-hook-form
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = async (data) => {
    try {
      const user = login(data.email, data.password);
      toast.success(`Welcome back, ${user.name}!`);
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(error.message || "Failed to log in.");
    }
  };

  const handlePreFill = (role) => {
    if (role === "admin") {
      setValue("email", "admin@smartvaccine.com");
      setValue("password", "admin123");
    } else {
      setValue("email", "user@smartvaccine.com");
      setValue("password", "user123");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-white">Sign In to VaxShield</h3>
        <p className="text-xs text-slate-400 mt-1">Access your vaccination portfolio and calendar.</p>
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
                  message: "Invalid email address"
                }
              })}
              placeholder="e.g. user@smartvaccine.com"
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
            />
          </div>
          {errors.email && <span className="text-[10px] text-rose-500 mt-1 block">{errors.email.message}</span>}
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs font-semibold text-blue-600 dark:text-sky-400 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </span>
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
              className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <span className="text-[10px] text-rose-500 mt-1 block">{errors.password.message}</span>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
        </button>
      </form>

      {/* Pre-fill Quick Buttons */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60">
        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mb-2">
          Demo Accounts
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handlePreFill("user")}
            className="px-3 py-1.5 rounded-lg border border-dashed border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 text-xs text-slate-500 dark:text-slate-400 transition"
          >
            User Demo
          </button>
          <button
            onClick={() => handlePreFill("admin")}
            className="px-3 py-1.5 rounded-lg border border-dashed border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 text-xs text-slate-500 dark:text-slate-400 transition"
          >
            Admin Demo
          </button>
        </div>
      </div>

      {/* Auth Links */}
      <div className="text-center text-xs text-slate-400">
        Don't have an account?{" "}
        <Link to="/register" className="font-semibold text-blue-600 dark:text-sky-400 hover:underline">
          Register Here
        </Link>
      </div>
    </div>
  );
}
