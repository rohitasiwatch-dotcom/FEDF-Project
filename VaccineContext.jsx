// React Hook: createContext to initialize a context instance
// React Hook: useContext to retrieve/consume context values
// React Hook: useState to initialize and update local component state
// React Hook: useEffect to handle side effects
import React, { createContext, useContext, useState, useEffect } from "react";
import { initialRecords, initialSchedules } from "../data/mockData";
import { useAuth } from "./AuthContext";

// VaccineContext manages vaccine records and schedules
const VaccineContext = createContext();

export const VaccineProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [records, setRecords] = useState([]);
  const [schedules, setSchedules] = useState([]);

  // useEffect
  // React Hook: useEffect to load initial records and schedules from localStorage on mount
  useEffect(() => {
    const storedRecords = localStorage.getItem("vaccineRecords");
    if (storedRecords) {
      setRecords(JSON.parse(storedRecords));
    } else {
      localStorage.setItem("vaccineRecords", JSON.stringify(initialRecords));
      setRecords(initialRecords);
    }

    const storedSchedules = localStorage.getItem("vaccineSchedules");
    if (storedSchedules) {
      setSchedules(JSON.parse(storedSchedules));
    } else {
      localStorage.setItem("vaccineSchedules", JSON.stringify(initialSchedules));
      setSchedules(initialSchedules);
    }
  }, []);

  const saveRecords = (updated) => {
    setRecords(updated);
    localStorage.setItem("vaccineRecords", JSON.stringify(updated));
  };

  const saveSchedules = (updated) => {
    setSchedules(updated);
    localStorage.setItem("vaccineSchedules", JSON.stringify(updated));
  };

  // VACCINATION RECORD CRUD
  const addRecord = (recordData) => {
    const newRecord = {
      id: `rec-${Date.now()}`,
      userId: currentUser ? currentUser.id : "user-1",
      verifiedStatus: currentUser?.role === "admin" ? "approved" : "pending",
      rejectionReason: "",
      ...recordData
    };
    const updated = [newRecord, ...records];
    saveRecords(updated);

    // If there is a matching upcoming schedule, update it to complete
    const matchingSchedule = schedules.find(
      (s) =>
        s.userId === newRecord.userId &&
        s.vaccineName.toLowerCase().includes(newRecord.vaccineName.toLowerCase().split(" ")[0]) &&
        s.doseNumber === Number(newRecord.doseNumber) &&
        s.status === "upcoming"
    );

    if (matchingSchedule) {
      updateScheduleStatus(matchingSchedule.id, "completed");
    }

    return newRecord;
  };

  const updateRecord = (id, updatedFields) => {
    const updated = records.map((r) => {
      if (r.id === id) {
        // Reset status to pending if user edits it, unless admin edits it
        const status = currentUser?.role === "admin" ? r.verifiedStatus : "pending";
        return { ...r, ...updatedFields, verifiedStatus: status };
      }
      return r;
    });
    saveRecords(updated);
  };

  const deleteRecord = (id) => {
    const updated = records.filter((r) => r.id !== id);
    saveRecords(updated);
  };

  // SCHEDULE CRUD
  const addSchedule = (scheduleData) => {
    const newSchedule = {
      id: `sch-${Date.now()}`,
      userId: currentUser ? currentUser.id : "user-1",
      status: "upcoming",
      ...scheduleData
    };
    const updated = [...schedules, newSchedule];
    saveSchedules(updated);
    return newSchedule;
  };

  const updateSchedule = (id, date) => {
    const updated = schedules.map((s) => {
      if (s.id === id) {
        return { ...s, scheduledDate: date };
      }
      return s;
    });
    saveSchedules(updated);
  };

  const updateScheduleStatus = (id, status) => {
    const updated = schedules.map((s) => {
      if (s.id === id) {
        return { ...s, status };
      }
      return s;
    });
    saveSchedules(updated);
  };

  const deleteSchedule = (id) => {
    const updated = schedules.filter((s) => s.id !== id);
    saveSchedules(updated);
  };

  // Convert Schedule to active record
  const completeScheduleRecord = (scheduleId, completionData) => {
    const schedule = schedules.find((s) => s.id === scheduleId);
    if (!schedule) return;

    // Add to records
    const record = addRecord({
      vaccineName: schedule.vaccineName,
      doseNumber: schedule.doseNumber,
      vaccinationDate: completionData.vaccinationDate,
      hospitalName: completionData.hospitalName,
      doctorName: completionData.doctorName,
      batchNumber: completionData.batchNumber || "MOCK-BATCH",
      nextDueDate: completionData.nextDueDate || "",
      notes: completionData.notes || "Completed from scheduled event.",
      fileName: completionData.fileName || ""
    });

    // Mark schedule as completed
    updateScheduleStatus(scheduleId, "completed");

    return record;
  };

  // ADMIN OPERATIONS
  const approveRecord = (id) => {
    const updated = records.map((r) => {
      if (r.id === id) {
        return { ...r, verifiedStatus: "approved", rejectionReason: "" };
      }
      return r;
    });
    saveRecords(updated);

    // Dynamic certificate generation is implicitly handled because approvals add to approved records.
    // Send a notification through Notification system
    triggerMockCertificateNotification(id);
  };

  const rejectRecord = (id, reason) => {
    const updated = records.map((r) => {
      if (r.id === id) {
        return { ...r, verifiedStatus: "rejected", rejectionReason: reason };
      }
      return r;
    });
    saveRecords(updated);
  };

  const requestCorrection = (id, feedback) => {
    const updated = records.map((r) => {
      if (r.id === id) {
        return { ...r, verifiedStatus: "correction", rejectionReason: feedback };
      }
      return r;
    });
    saveRecords(updated);
  };

  const triggerMockCertificateNotification = (recordId) => {
    const rec = records.find((r) => r.id === recordId);
    if (!rec) return;

    const storedNotifications = localStorage.getItem("vaccineNotifications");
    const notifications = storedNotifications ? JSON.parse(storedNotifications) : [];

    const newNotification = {
      id: `not-${Date.now()}`,
      userId: rec.userId,
      type: "certificate",
      title: "Certificate Approved",
      message: `Your certificate for ${rec.vaccineName} (Dose ${rec.doseNumber}) is approved and available for download.`,
      read: false,
      timestamp: new Date().toISOString()
    };

    localStorage.setItem("vaccineNotifications", JSON.stringify([newNotification, ...notifications]));
  };

  // DYNAMIC RECOMMENDATION ENGINE
  const getRecommendations = (user) => {
    if (!user) return [];

    const recommendations = [];
    const completedVaccines = records
      .filter((r) => r.userId === user.id && r.verifiedStatus === "approved")
      .map((r) => r.vaccineName.toLowerCase());

    const birthDate = new Date(user.dob);
    const ageInMilliseconds = Date.now() - birthDate.getTime();
    const ageInYears = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);

    // Recommendation 1: Influenza (Flu Vaccine)
    const takenFluThisYear = records.some((r) => {
      if (r.userId !== user.id || r.verifiedStatus !== "approved") return false;
      if (!r.vaccineName.toLowerCase().includes("influenza") && !r.vaccineName.toLowerCase().includes("flu")) return false;
      const recYear = new Date(r.vaccinationDate).getFullYear();
      const currentYear = new Date().getFullYear();
      return recYear === currentYear;
    });

    if (!takenFluThisYear) {
      recommendations.push({
        id: "rec-flu",
        vaccineName: "Influenza (Flu Shot)",
        priority: "High",
        reason: "Annual protection against seasonal flu strains is highly recommended for all age groups.",
        suggestedDate: new Date(new Date().getFullYear(), 9, 15).toISOString().split("T")[0] // Suggest Oct 15
      });
    }

    // Recommendation 2: COVID-19 Booster
    const covidRecords = records
      .filter((r) => r.userId === user.id && r.verifiedStatus === "approved" && r.vaccineName.toLowerCase().includes("covid"))
      .sort((a, b) => new Date(b.vaccinationDate) - new Date(a.vaccinationDate));

    if (covidRecords.length === 0) {
      recommendations.push({
        id: "rec-covid-primary",
        vaccineName: "COVID-19 Primary Series",
        priority: "High",
        reason: "No history of COVID-19 vaccination found. Establishing baseline immunity is crucial.",
        suggestedDate: new Date().toISOString().split("T")[0]
      });
    } else if (covidRecords.length >= 2) {
      const lastCovidDate = new Date(covidRecords[0].vaccinationDate);
      const monthsSinceLastCovid = (Date.now() - lastCovidDate.getTime()) / (1000 * 60 * 60 * 24 * 30.43);
      if (monthsSinceLastCovid >= 6) {
        recommendations.push({
          id: "rec-covid-booster",
          vaccineName: "COVID-19 Updated Booster",
          priority: "Medium",
          reason: `It has been ${Math.round(monthsSinceLastCovid)} months since your last dose. Boosters are recommended to combat waning immunity and new variants.`,
          suggestedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0] // Suggest in 7 days
        });
      }
    }

    // Recommendation 3: Tdap (Tetanus, Diphtheria, Pertussis)
    const hasTdap = records.some((r) => r.userId === user.id && r.verifiedStatus === "approved" && r.vaccineName.toLowerCase().includes("tdap"));
    if (!hasTdap) {
      recommendations.push({
        id: "rec-tdap",
        vaccineName: "Tdap (Tetanus, Diphtheria, Pertussis)",
        priority: "Medium",
        reason: "Adult routine booster dose against lockjaw, diphtheria, and whooping cough is recommended once every 10 years.",
        suggestedDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0] // Suggest in 30 days
      });
    }

    // Recommendation 4: Pregnancy specific (Tdap & Flu)
    if (user.gender === "Female" && user.pregnancyStatus === "yes") {
      const pregnantTdap = records.some((r) => {
        if (r.userId !== user.id || r.verifiedStatus !== "approved") return false;
        if (!r.vaccineName.toLowerCase().includes("tdap")) return false;
        // Check if vaccination date is very recent (e.g. in last 6 months)
        const dateDiff = (Date.now() - new Date(r.vaccinationDate).getTime()) / (1000 * 60 * 60 * 24 * 30.43);
        return dateDiff < 8;
      });

      if (!pregnantTdap) {
        recommendations.push({
          id: "rec-preg-tdap",
          vaccineName: "Tdap (Pregnancy Booster)",
          priority: "High",
          reason: "Recommended between weeks 27 and 36 of pregnancy to pass protective antibodies to the baby, defending them from whooping cough at birth.",
          suggestedDate: new Date().toISOString().split("T")[0]
        });
      }
    }

    // Recommendation 5: Shingles (Shingrix) for 50+
    if (ageInYears >= 50) {
      const hasShingles = records.some((r) => r.userId === user.id && r.verifiedStatus === "approved" && r.vaccineName.toLowerCase().includes("shingles"));
      if (!hasShingles) {
        recommendations.push({
          id: "rec-shingles",
          vaccineName: "Shingles (Shingrix)",
          priority: "High",
          reason: "Age-based recommendation. Shingrix is 90% effective at preventing shingles and long-term nerve pain in adults 50 and older.",
          suggestedDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
        });
      }
    }

    // Recommendation 6: Pneumococcal (Pneumonia) for 65+ or High Risk Conditions
    const isHighRiskPneumo = user.chronicDiseases?.includes("COPD") || 
                            user.chronicDiseases?.includes("Diabetes") ||
                            user.healthConditions?.includes("Asthma") ||
                            user.healthConditions?.includes("Heart Condition");

    if (ageInYears >= 65 || isHighRiskPneumo) {
      const hasPneumo = records.some((r) => r.userId === user.id && r.verifiedStatus === "approved" && r.vaccineName.toLowerCase().includes("pneumo"));
      if (!hasPneumo) {
        recommendations.push({
          id: "rec-pneumo",
          vaccineName: "Pneumococcal Vaccine",
          priority: "High",
          reason: ageInYears >= 65 
            ? "Age-based recommendation. Seniors have an increased risk of contracting serious pneumococcal infections like pneumonia, meningitis, and bloodstream infections."
            : "Condition-based recommendation. Asthma, diabetes, or heart disease increases risk of severe complications from pneumococcal disease.",
          suggestedDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
        });
      }
    }

    // Recommendation 7: HPV for youth
    if (ageInYears >= 9 && ageInYears <= 26) {
      const hasHpv = records.some((r) => r.userId === user.id && r.verifiedStatus === "approved" && r.vaccineName.toLowerCase().includes("hpv"));
      if (!hasHpv) {
        recommendations.push({
          id: "rec-hpv",
          vaccineName: "HPV (Human Papillomavirus)",
          priority: "Medium",
          reason: "Protects against cancers caused by HPV. Most effective when administered in adolescence or young adulthood.",
          suggestedDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
        });
      }
    }

    return recommendations;
  };

  return (
    <VaccineContext.Provider
      value={{
        records,
        schedules,
        addRecord,
        updateRecord,
        deleteRecord,
        addSchedule,
        updateSchedule,
        updateScheduleStatus,
        deleteSchedule,
        completeScheduleRecord,
        approveRecord,
        rejectRecord,
        requestCorrection,
        getRecommendations
      }}
    >
      {children}
    </VaccineContext.Provider>
  );
};

// React Concept: Custom hook to use VaccineContext using useContext
export const useVaccine = () => useContext(VaccineContext);
