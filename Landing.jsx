// React Hook: useState is a React Hook that lets you add a state variable to your component.
import React, { useState } from "react";
import { Link } from "react-router-dom";
// Context subscription hook
import { useTheme } from "../context/ThemeContext";
import {
  ShieldCheck,
  CalendarDays,
  QrCode,
  Sparkles,
  ChevronDown,
  ArrowRight,
  CheckCircle,
  FileCheck2,
  Users2,
  Lock
} from "lucide-react";

// React Concept: Landing is a functional presentation component displaying the portal home screen
export default function Landing() {
  // Custom Hook: useTheme to access translation function t()
  const { t } = useTheme();

  // useState: local state to store index of currently active/open FAQ item
  const [activeFaq, setActiveFaq] = useState(null);

  const stats = [
    { label: "Active Platform Users", value: "24,000+", icon: Users2 },
    { label: "Vaccinations Tracked", value: "65,000+", icon: FileCheck2 },
    { label: "Verification Success Rate", value: "99.9%", icon: ShieldCheck }
  ];

  const features = [
    {
      title: "Smart Scheduling Calendar",
      desc: "Interactive schedule grid that customizes booking intervals, tracks multiple doses, and sends alerts for upcoming appointments.",
      icon: CalendarDays,
      color: "bg-blue-500/10 text-blue-600 dark:text-sky-400"
    },
    {
      title: "Digital Certificate Credentials",
      desc: "Instantly compile a verified PDF record with securing metadata and unique verification QR code for travel, work, or school.",
      icon: QrCode,
      color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
    },
    {
      title: "AI Health Assistant",
      desc: "Chat client-side with a specialized model trained on immunization schedules, vaccine types, guidelines, and side effects.",
      icon: Sparkles,
      color: "bg-sky-500/10 text-sky-600 dark:text-sky-400"
    },
    {
      title: "Secure Health Records",
      desc: "All health records are stored in browser local state, encrypted client-side, avoiding cloud leaks or data hacks.",
      icon: Lock,
      color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
    }
  ];

  const faqs = [
    {
      q: "Is my medical data secure on VaxShield?",
      a: "Yes. VaxShield runs in Frontend Simulation Mode, meaning your personal health records, profile uploads, and scheduling timelines are stored entirely locally in your browser's localStorage. No medical database records are transmitted to third-party cloud servers."
    },
    {
      q: "How does the QR verification feature work?",
      a: "When your vaccine log is approved by an administrator, the platform generates a unique Certificate ID and QR code. Anyone scanning this QR code is directed to a secure, public verification screen displaying your record's authenticity, hospital details, and verified date."
    },
    {
      q: "How does the recommendation engine calculate my guidelines?",
      a: "VaxShield implements local algorithms using CDC and WHO guidelines. It parses your Date of Birth to determine age, analyzes gender/pregnancy flags, inspects medical conditions like asthma or diabetes, and cross-references your current logged vaccines to compute dose priorities."
    },
    {
      q: "Can I print my emergency health card?",
      a: "Absolutely. Under the patient panel premium settings, you can render an Emergency Health Card displaying your blood type, chronic allergies, primary emergency contact, and a quick-scan emergency summary barcode, ready for desktop printing."
    }
  ];

  const testimonials = [
    {
      name: "Dr. David Carter",
      role: "Public Health Director",
      text: "VaxShield provides an incredibly clean patient dashboard. The local recommendation engine accurately maps adult booster intervals and simplifies clinical compliance audits."
    },
    {
      name: "Sarah Jenkins",
      role: "International Traveler",
      text: "Having my vaccine QR code and downloadable PDF certificates instantly accessible saved me hours of clearance documentation at customs. The interface is gorgeous!"
    }
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-sky-400 text-xs font-semibold mb-6 animate-pulse">
            <ShieldCheck className="w-3.5 h-3.5" />
            Voted #1 Vaccination Record Interface
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight max-w-4xl mx-auto">
            {t("heroTitle")}
          </h1>
          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t("heroSub")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
            >
              {t("getStarted")}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto px-8 py-4 text-sm font-semibold rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition flex items-center justify-center gap-2"
            >
              {t("learnMore")}
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div key={idx} className="flex items-center gap-4 justify-center md:justify-start p-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-sky-400 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{s.value}</div>
                  <div className="text-xs font-semibold text-slate-400 dark:text-slate-500">{s.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{t("features")}</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            A comprehensive, patient-centered suite of tools designed for precision immunization scheduling and compliance tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col items-start"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-5 ${f.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 mb-3">{f.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-slate-100/50 dark:bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          <div>
            <span className="text-xs font-bold text-blue-600 dark:text-sky-400 uppercase tracking-wider">Testimonials</span>
            <h2 className="text-3xl font-bold tracking-tight mt-2 mb-4">What Health Experts & Users Say</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Discover how VaxShield makes tracking vaccine records easier, and helps healthcare offices oversee immunization clearance.
            </p>
          </div>
          <div className="col-span-1 lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between"
              >
                <p className="text-sm text-slate-600 dark:text-slate-300 italic mb-6 leading-relaxed">"{t.text}"</p>
                <div>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-white">{t.name}</h4>
                  <span className="text-xs text-slate-400">{t.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-2">Frequently Asked Questions</h2>
          <p className="text-slate-500 dark:text-slate-400">Everything you need to know about VaxShield's operation.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((f, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden transition"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full px-6 py-4 flex items-center justify-between font-bold text-sm text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
                >
                  <span className="text-slate-800 dark:text-slate-200">{f.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800">
                    {f.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-600 dark:bg-blue-700 text-white relative">
        <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
            Protect Yourself and Your Family Today
          </h2>
          <p className="text-slate-100 max-w-xl mx-auto text-sm md:text-base mb-8 leading-relaxed opacity-90">
            Create an immunization account in seconds. Schedule doses, log vaccination certifications, and export verified travel credentials instantly.
          </p>
          <div className="flex justify-center">
            <Link
              to="/register"
              className="px-8 py-3.5 bg-white text-blue-600 hover:bg-slate-50 font-bold rounded-xl transition shadow-lg flex items-center gap-2"
            >
              Create Free Account
              <CheckCircle className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
