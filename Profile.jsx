// React Hook: useState is a React Hook that lets you add state variables to your component.
// React Hook: useEffect lets you synchronize a component with an external system.
import React, { useState, useEffect } from "react";
// Context hook to fetch session information and trigger updates
import { useAuth } from "../context/AuthContext";
// react-hook-form: Custom form management library providing validation, submission handling, and status.
import { useForm } from "react-hook-form";
import { Camera, Plus, X, Heart, ShieldCheck, HeartPulse } from "lucide-react";
import { toast } from "react-toastify";

// React Concept: Profile is a form editor for patients to specify emergency medical flags and contact credentials
export default function Profile() {
  // Global context access
  const { currentUser, updateProfile } = useAuth();

  // useState: state trackers for profile avatar picture conversion
  const [avatarBase64, setAvatarBase64] = useState("");
  
  // useState: custom tag list inputs for clinical allergies
  const [allergies, setAllergies] = useState([]);
  const [newAllergy, setNewAllergy] = useState("");
  
  // useState: custom tag list inputs for health conditions
  const [conditions, setConditions] = useState([]);
  const [newCondition, setNewCondition] = useState("");

  // useForm Hook: form controls initialization
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitting }
  } = useForm();

  // watch: listens to gender selection values to show pregnancy toggles dynamically
  const genderVal = watch("gender");

  // useEffect
  // React Hook: useEffect to load the initial profile particulars from currentUser into state once logged in
  useEffect(() => {
    if (currentUser) {
      reset({
        name: currentUser.name || "",
        mobile: currentUser.mobile || "",
        dob: currentUser.dob || "",
        gender: currentUser.gender || "",
        bloodGroup: currentUser.bloodGroup || "",
        pregnancyStatus: currentUser.pregnancyStatus || "no"
      });
      setAvatarBase64(currentUser.avatar || "");
      setAllergies(currentUser.allergies || []);
      setConditions(currentUser.healthConditions || []);
    }
  }, [currentUser, reset]);

  // Handle avatar upload converting to Base64
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addAllergy = () => {
    if (newAllergy.trim() && !allergies.includes(newAllergy.trim())) {
      setAllergies([...allergies, newAllergy.trim()]);
      setNewAllergy("");
    }
  };

  const removeAllergy = (index) => {
    setAllergies(allergies.filter((_, i) => i !== index));
  };

  const addCondition = () => {
    if (newCondition.trim() && !conditions.includes(newCondition.trim())) {
      setConditions([...conditions, newCondition.trim()]);
      setNewCondition("");
    }
  };

  const removeCondition = (index) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    try {
      const profilePayload = {
        name: data.name,
        mobile: data.mobile,
        dob: data.dob,
        gender: data.gender,
        bloodGroup: data.bloodGroup,
        pregnancyStatus: data.gender === "Female" ? data.pregnancyStatus : "no",
        avatar: avatarBase64,
        allergies: allergies,
        healthConditions: conditions
      };

      updateProfile(profilePayload);
      toast.success("Health profile updated successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to update profile.");
    }
  };

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const genders = ["Male", "Female", "Other"];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <HeartPulse className="w-8 h-8 text-blue-600 dark:text-sky-450" />
        <div>
          <h2 className="text-xl font-bold dark:text-white">Health Profile Management</h2>
          <p className="text-xs text-slate-400">Configure medical conditions, allergies, and contact credentials.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Avatar and Info Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 rounded-2xl shadow-sm text-center flex flex-col items-center justify-center">
            {/* Picture Upload Container */}
            <div className="relative group w-28 h-28 mb-4">
              <div className="w-28 h-28 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400">
                {avatarBase64 ? (
                  <img src={avatarBase64} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold text-slate-400 uppercase">
                    {currentUser?.name?.split(" ").map((n) => n[0]).join("")}
                  </span>
                )}
              </div>
              <label className="absolute bottom-1 right-1 p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-lg transition-transform scale-90 group-hover:scale-100 duration-200">
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>

            <h3 className="font-bold text-base text-slate-800 dark:text-white">{currentUser?.name}</h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
              {currentUser?.role === "admin" ? "Admin Staff" : "Patient Card"}
            </span>

            {/* Emergency Information Quick View */}
            <div className="w-full mt-6 pt-6 border-t border-slate-150 dark:border-slate-800/80 text-left space-y-2.5">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Emergency Flags</h4>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-semibold">Blood Group:</span>
                <span className="font-extrabold text-blue-600 dark:text-sky-400">{currentUser?.bloodGroup || "Not set"}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-semibold">Allergy Alerts:</span>
                <span className="font-bold text-rose-500">{allergies.length > 0 ? `${allergies.length} Flagged` : "None"}</span>
              </div>
            </div>
          </div>

          {/* Edit Forms */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Personal Details */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                Personal Credentials
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    {...register("name", { required: "Name is required" })}
                    className="w-full px-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Mobile Number</label>
                  <input
                    type="text"
                    {...register("mobile")}
                    className="w-full px-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Date of Birth</label>
                  <input
                    type="date"
                    {...register("dob")}
                    className="w-full px-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Gender</label>
                  <select
                    {...register("gender")}
                    className="w-full px-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
                  >
                    {genders.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Blood Group</label>
                  <select
                    {...register("bloodGroup")}
                    className="w-full px-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
                  >
                    <option value="">Select Group</option>
                    {bloodGroups.map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                {/* Conditional Pregnancy Field */}
                {genderVal === "Female" && (
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Pregnancy Status</label>
                    <select
                      {...register("pregnancyStatus")}
                      className="w-full px-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                      <option value="prefer-not">Prefer not to say</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Medical Risk profiles (Allergies, Health conditions tag manager) */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-6">
              <h3 className="font-bold text-sm text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500" />
                Medical & Risk Factors
              </h3>

              {/* Allergy Tag Manager */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Chronic Allergies</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newAllergy}
                    onChange={(e) => setNewAllergy(e.target.value)}
                    placeholder="e.g. Penicillin, Eggs"
                    className="flex-grow px-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={addAllergy}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1.5">
                  {allergies.length === 0 ? (
                    <span className="text-xs text-slate-400 italic">No allergies registered.</span>
                  ) : (
                    allergies.map((a, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs font-semibold"
                      >
                        {a}
                        <button type="button" onClick={() => removeAllergy(idx)} className="hover:text-rose-800">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Health Conditions Tag Manager */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Underlying Health Conditions</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value)}
                    placeholder="e.g. Asthma, COPD, Diabetes"
                    className="flex-grow px-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={addCondition}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1.5">
                  {conditions.length === 0 ? (
                    <span className="text-xs text-slate-400 italic">No health conditions registered.</span>
                  ) : (
                    conditions.map((c, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-sky-400 text-xs font-semibold"
                      >
                        {c}
                        <button type="button" onClick={() => removeCondition(idx)} className="hover:text-blue-800">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>

            </div>

            {/* Save Buttons */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-500/20 transition flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                Save Profile Configuration
              </button>
            </div>

          </div>

        </div>
      </form>
    </div>
  );
}
