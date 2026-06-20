// React Hook: useState is a React Hook that lets you add local state variables to your component.
import React, { useState } from "react";
// Context subscription hooks
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useNotification } from "../context/NotificationContext";
// qrcode.react: External library for generating QR code SVGs client-side
import { QRCodeSVG } from "qrcode.react";
import {
  Sparkles,
  Printer,
  ToggleLeft,
  ToggleRight,
  BadgeAlert,
  Save,
  MessageSquare
} from "lucide-react";
import { toast } from "react-toastify";

// React Concept: PremiumFeatures contains settings for emergency medical cards and third-party alert dispatches (WhatsApp)
export default function PremiumFeatures() {
  // Global context retrievals
  const { currentUser } = useAuth();
  const { whatsappSettings, updateWhatsappSettings } = useNotification();

  // useState: state variables for syncing WhatsApp settings and emergency card modal visibility
  const [whatsappPhone, setWhatsappPhone] = useState(whatsappSettings.phoneNumber || "");
  const [whatsappEnabled, setWhatsappEnabled] = useState(whatsappSettings.enabled || false);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);

  const handleSaveWhatsApp = (e) => {
    e.preventDefault();
    updateWhatsappSettings({
      enabled: whatsappEnabled,
      phoneNumber: whatsappPhone
    });
    toast.success("WhatsApp notifications preferences synced!");
  };

  const handlePrintEmergencyCard = () => {
    window.print();
  };

  const emergencyUrl = `${window.location.origin}/verify?certId=emergency-${currentUser?.id}`;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Title */}
      <div className="no-print">
        <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-blue-600 dark:text-sky-400 animate-pulse" />
          Premium Health Modules
        </h2>
        <p className="text-xs text-slate-400 font-medium">Activate auxiliary options, sync device alerts, and export Emergency IDs.</p>
      </div>

      {/* Grid of features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 no-print">
        
        {/* WhatsApp alerts */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
            <MessageSquare className="w-4.5 h-4.5 text-emerald-500" />
            WhatsApp Notification Dispatcher
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Sync appointment reminders and approval certificate notifications directly to your phone.
          </p>

          <form onSubmit={handleSaveWhatsApp} className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-550 dark:text-slate-350">Enable Alerts</span>
              <button
                type="button"
                onClick={() => setWhatsappEnabled(!whatsappEnabled)}
                className="text-blue-600"
              >
                {whatsappEnabled ? <ToggleRight className="w-8 h-8 text-emerald-500" /> : <ToggleLeft className="w-8 h-8 text-slate-400" />}
              </button>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Mobile WhatsApp Number</label>
              <input
                type="text"
                value={whatsappPhone}
                onChange={(e) => setWhatsappPhone(e.target.value)}
                placeholder="e.g. +1 (555) 123-4567"
                disabled={!whatsappEnabled}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none dark:text-white disabled:opacity-40"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition shadow flex items-center justify-center gap-1"
            >
              <Save className="w-3.5 h-3.5" />
              Save Preference
            </button>
          </form>
        </div>

        {/* Emergency Health Card Trigger */}
        <div className="col-span-full bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <BadgeAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-800 dark:text-white">Emergency Medical Card</h4>
              <p className="text-xs text-slate-400">Generate a printable credit-card sized profile with allergen flags and emergency contacts.</p>
            </div>
          </div>
          <button
            onClick={() => setEmergencyModalOpen(true)}
            className="w-full sm:w-auto px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow transition"
          >
            Generate Medical Card
          </button>
        </div>

      </div>

      {/* Printable Emergency Health Card Modal */}
      {emergencyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-805 flex flex-col items-center">
            
            {/* Modal Header Actions (No print) */}
            <div className="flex justify-between items-center w-full border-b border-slate-100 dark:border-slate-850 pb-3 mb-6 no-print">
              <h3 className="font-bold text-xs dark:text-white uppercase tracking-wider">Emergency Medical Card</h3>
              <button onClick={() => setEmergencyModalOpen(false)} className="text-slate-400 hover:text-slate-655 font-bold text-xs">
                Close
              </button>
            </div>

            {/* Printable Credit Card */}
            <div
              id="certificate-print-area"
              className="w-full max-w-md bg-gradient-to-br from-slate-900 to-slate-950 text-white border-2 border-slate-700 p-5 rounded-2xl shadow-xl flex flex-col justify-between min-h-[200px]"
            >
              {/* Header */}
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded bg-rose-600 flex items-center justify-center">
                    <BadgeAlert className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="font-extrabold text-xs tracking-wider uppercase">Emergency Health ID</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500 font-bold">VAX-EMERG-ID</span>
              </div>

              {/* Patient Core details */}
              <div className="grid grid-cols-2 gap-3 text-xs my-4">
                <div>
                  <span className="block text-[8px] text-slate-500 font-bold uppercase">Patient Name</span>
                  <span className="font-bold truncate block">{currentUser?.name}</span>
                </div>
                <div>
                  <span className="block text-[8px] text-slate-500 font-bold uppercase">Date of Birth</span>
                  <span className="font-semibold block">{currentUser?.dob ? new Date(currentUser.dob).toLocaleDateString() : "N/A"}</span>
                </div>
                <div>
                  <span className="block text-[8px] text-slate-500 font-bold uppercase">Blood Group</span>
                  <span className="font-extrabold text-rose-500 block">{currentUser?.bloodGroup || "O+"}</span>
                </div>
                <div>
                  <span className="block text-[8px] text-slate-500 font-bold uppercase">Emergency Contact</span>
                  <span className="font-bold block truncate">{currentUser?.mobile || "+1 (555) 000-0000"}</span>
                </div>
                <div className="col-span-2">
                  <span className="block text-[8px] text-slate-500 font-bold uppercase">Allergy Alert Flags</span>
                  <span className="font-semibold text-[10px] text-rose-455 block truncate">
                    {currentUser?.allergies?.length > 0 ? currentUser.allergies.join(", ") : "No chronic allergies registered."}
                  </span>
                </div>
              </div>

              {/* Card Footer Barcode & QR Code */}
              <div className="flex justify-between items-center border-t border-slate-800 pt-2 text-[8px]">
                <div className="leading-tight text-slate-550">
                  <span className="block uppercase font-bold text-slate-500">Medical Warning</span>
                  <p>In case of emergency, scan QR for active immunization files.</p>
                </div>
                <div className="p-1 bg-white rounded flex items-center justify-center shrink-0">
                  <QRCodeSVG value={emergencyUrl} size={36} level="M" />
                </div>
              </div>
            </div>

            {/* Modal Actions (No print) */}
            <div className="flex gap-2 w-full mt-6 pt-4 border-t border-slate-100 dark:border-slate-805 no-print">
              <button
                onClick={() => setEmergencyModalOpen(false)}
                className="flex-1 py-2 text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-805 rounded-xl text-slate-650 dark:text-slate-350"
              >
                Close Window
              </button>
              <button
                onClick={handlePrintEmergencyCard}
                className="flex-grow py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                Print Emergency Card
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
