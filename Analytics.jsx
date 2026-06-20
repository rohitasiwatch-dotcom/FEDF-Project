// used re rendering
import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { BarChart3, TrendingUp, Users, PieChart as PieIcon, HelpCircle } from "lucide-react";

export default function Analytics() {
  
  // Chart 1: Vaccination Trends (Area Chart over last 6 months)
  const trendsData = [
    { name: "Jan", vaccinations: 45 },
    { name: "Feb", vaccinations: 60 },
    { name: "Mar", vaccinations: 85 },
    { name: "Apr", vaccinations: 120 },
    { name: "May", vaccinations: 190 },
    { name: "Jun", vaccinations: 240 }
  ];

  // Chart 2: Vaccine Popularity (Horizontal Bar Chart)
  const popularityData = [
    { name: "COVID-19", count: 320, color: "#2563EB" },
    { name: "Hepatitis B", count: 180, color: "#10B981" },
    { name: "Influenza", count: 210, color: "#0EA5E9" },
    { name: "Tdap Booster", count: 95, color: "#6366F1" },
    { name: "Shingles", count: 65, color: "#F59E0B" }
  ];

  // Chart 3: Age Group Distribution (Pie Chart)
  const ageGroupData = [
    { name: "Pediatric (0-12)", value: 15, color: "#3B82F6" },
    { name: "Youth (13-24)", value: 25, color: "#06B6D4" },
    { name: "Adult (25-49)", value: 40, color: "#10B981" },
    { name: "Seniors (50+)", value: 20, color: "#F59E0B" }
  ];

  // Chart 4: Monthly Reports Status (Stacked Bar Chart)
  const statusData = [
    { name: "Jan", Completed: 35, Pending: 8, Missed: 5 },
    { name: "Feb", Completed: 48, Pending: 10, Missed: 2 },
    { name: "Mar", Completed: 72, Pending: 15, Missed: 4 },
    { name: "Apr", Completed: 95, Pending: 20, Missed: 8 },
    { name: "May", Completed: 160, Pending: 30, Missed: 12 },
    { name: "Jun", Completed: 210, Pending: 25, Missed: 10 }
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold dark:text-white">Immunization Registry Analytics</h2>
        <p className="text-xs text-slate-400">Statistical evaluations of vaccination rates, demographics, and inventory trends.</p>
      </div>

      {/* Grid of charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Trends */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
            <TrendingUp className="w-4.5 h-4.5 text-blue-500" />
            Vaccination Administration Trends (6-Month Area)
          </h3>
          <div className="h-64 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVax" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "8px" }} />
                <Area type="monotone" dataKey="vaccinations" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#colorVax)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Popularity */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
            <BarChart3 className="w-4.5 h-4.5 text-indigo-500" />
            Vaccine Type Popularity (Doses Administered)
          </h3>
          <div className="h-64 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={popularityData} layout="vertical" margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" className="dark:stroke-slate-800" />
                <XAxis type="number" stroke="#94a3b8" />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" width={80} />
                <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "8px" }} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {popularityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Age Distribution */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
            <Users className="w-4.5 h-4.5 text-emerald-500" />
            Patient Demographics (Age Group Distribution %)
          </h3>
          <div className="h-64 w-full text-xs flex flex-col sm:flex-row items-center justify-center">
            <div className="w-full sm:w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ageGroupData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {ageGroupData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "8px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Legend checklist list */}
            <div className="w-full sm:w-1/2 flex flex-col gap-2 p-4">
              {ageGroupData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs">
                  <div className="w-3.5 h-3.5 rounded" style={{ backgroundColor: item.color }} />
                  <span className="font-semibold text-slate-655 dark:text-slate-350">{item.name}</span>
                  <span className="font-bold ml-auto">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart 4: Monthly Completion */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
            <PieIcon className="w-4.5 h-4.5 text-sky-500" />
            Administration Success Rate (Completed vs Missed)
          </h3>
          <div className="h-64 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "8px" }} />
                <Legend iconSize={10} verticalAlign="top" height={36} wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="Completed" stackId="a" fill="#10B981" />
                <Bar dataKey="Pending" stackId="a" fill="#3B82F6" />
                <Bar dataKey="Missed" stackId="a" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
