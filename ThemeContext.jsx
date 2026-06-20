// React Hook: createContext initializes a Context object to pass properties down the tree
// React Hook: useContext is a React Hook that lets you read and subscribe to context from your component.
// React Hook: useState lets you add a state variable to your component.
// React Hook: useEffect lets you synchronize a component with an external system.
import React, { createContext, useContext, useState, useEffect } from "react";

// ThemeContext is created to manage theme, language, and network connectivity state.
const ThemeContext = createContext();

const translations = {
  en: {
    // Nav
    dashboard: "Dashboard",
    records: "Vaccine Records",
    timeline: "Timeline",
    scheduler: "Smart Scheduler",
    search: "Search & History",
    profile: "Health Profile",
    admin: "Admin Console",
    logout: "Log Out",
    welcome: "Welcome back",
    // Stats
    totalTaken: "Total Vaccines Taken",
    upcoming: "Upcoming Vaccines",
    missed: "Missed Vaccines",
    certificates: "Certificates Available",
    // Landing
    heroTitle: "Smart Vaccination Record Management",
    heroSub: "Securely track, schedule, and verify your vaccinations. Empowering individuals and healthcare providers with digital health credentials.",
    getStarted: "Get Started Now",
    learnMore: "Learn More",
    features: "Platform Features",
    // Chatbot
    chatTitle: "AI Health Assistant",
    chatPlaceholder: "Ask about vaccine recommendations or schedules...",
    // Profile
    editProfile: "Edit Health Profile",
    personalInfo: "Personal Information",
    medicalRisk: "Medical & Risk Factors",
    allergies: "Allergies",
    healthConditions: "Health Conditions",
    chronicDiseases: "Chronic Diseases",
    riskFactors: "Risk Factors",
    pregnancyStatus: "Pregnancy Status (if applicable)",
    saveChanges: "Save Changes",
    // Table
    vaccineName: "Vaccine Name",
    dose: "Dose No.",
    date: "Vaccination Date",
    hospital: "Hospital/Center",
    doctor: "Physician",
    batch: "Batch Number",
    status: "Verification Status",
    actions: "Actions",
    noRecords: "No records found.",
    addRecord: "Log New Vaccination"
  },
  es: {
    dashboard: "Panel de Control",
    records: "Registros de Vacunas",
    timeline: "Línea de Tiempo",
    scheduler: "Programador Inteligente",
    search: "Buscar e Historial",
    profile: "Perfil de Salud",
    admin: "Consola de Admin",
    logout: "Cerrar Sesión",
    welcome: "Bienvenido de nuevo",
    totalTaken: "Total de Vacunas Recibidas",
    upcoming: "Próximas Vacunas",
    missed: "Vacunas Omitidas",
    certificates: "Certificados Disponibles",
    heroTitle: "Gestión Inteligente de Vacunación",
    heroSub: "Rastree, programe y verifique sus vacunas de forma segura. Empoderando a personas y proveedores de salud con credenciales digitales.",
    getStarted: "Comenzar Ahora",
    learnMore: "Saber Más",
    features: "Características de la Plataforma",
    chatTitle: "Asistente de Salud IA",
    chatPlaceholder: "Pregunte sobre recomendaciones de vacunas...",
    editProfile: "Editar Perfil de Salud",
    personalInfo: "Información Personal",
    medicalRisk: "Factores Médicos y de Riesgo",
    allergies: "Alergias",
    healthConditions: "Condiciones de Salud",
    chronicDiseases: "Enfermedades Crónicas",
    riskFactors: "Factores de Riesgo",
    pregnancyStatus: "Estado de Embarazo",
    saveChanges: "Guardar Cambios",
    vaccineName: "Nombre de Vacuna",
    dose: "Dosis No.",
    date: "Fecha de Vacunación",
    hospital: "Hospital/Centro",
    doctor: "Médico",
    batch: "Número de Lote",
    status: "Estado de Verificación",
    actions: "Acciones",
    noRecords: "No se encontraron registros.",
    addRecord: "Registrar Nueva Vacunación"
  },
  hi: {
    dashboard: "डैशबोर्ड",
    records: "टीकाकरण रिकॉर्ड",
    timeline: "समयरेखा",
    scheduler: "स्मार्ट शेड्यूलर",
    search: "खोज और इतिहास",
    profile: "स्वास्थ्य प्रोफ़ाइल",
    admin: "व्यवस्थापक कंसोल",
    logout: "लॉग आउट",
    welcome: "स्वागत है",
    totalTaken: "कुल टीके लिए गए",
    upcoming: "आने वाले टीके",
    missed: "छूटे हुए टीके",
    certificates: "उपलब्ध प्रमाणपत्र",
    heroTitle: "स्मार्ट टीकाकरण रिकॉर्ड प्रबंधन",
    heroSub: "सुरक्षित रूप से अपने टीकाकरण को ट्रैक करें, शेड्यूल करें और सत्यापित करें।",
    getStarted: "अभी शुरू करें",
    learnMore: "और जानें",
    features: "प्लेटफ़ॉर्म विशेषताएं",
    chatTitle: "एआई स्वास्थ्य सहायक",
    chatPlaceholder: "टीका सिफारिशों के बारे में पूछें...",
    editProfile: "स्वास्थ्य प्रोफ़ाइल संपादित करें",
    personalInfo: "व्यक्तिगत जानकारी",
    medicalRisk: "चिकित्सा और जोखिम कारक",
    allergies: "एलर्जी",
    healthConditions: "स्वास्थ्य स्थितियां",
    chronicDiseases: "पुरानी बीमारियाँ",
    riskFactors: "जोखिम कारक",
    pregnancyStatus: "गर्भावस्था की स्थिति",
    saveChanges: "बदलाव सहेजें",
    vaccineName: "टीके का नाम",
    dose: "खुराक संख्या",
    date: "टीकाकरण की तिथि",
    hospital: "अस्पताल/केंद्र",
    doctor: "चिकित्सक",
    batch: "बैच नंबर",
    status: "सत्यापन की स्थिति",
    actions: "कार्रवाई",
    noRecords: "कोई रिकॉर्ड नहीं मिला।",
    addRecord: "नया टीकाकरण दर्ज करें"
  }
};

// ThemeProvider component wrapper for supplying theme and application-wide utilities
export const ThemeProvider = ({ children }) => {
  // useState with Lazy Initialization: reads initial dark mode state from localStorage
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });


  // Offline capability simulation
  // useState: tracking offline status and PWA installation state
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [pwaInstalled, setPwaInstalled] = useState(false);

  // useEffect
  // React Hook: useEffect to sync darkMode status to the document's classList and localStorage
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);


  // useEffect
  // React Hook: useEffect with clean-up function to subscribe to network status events on mount
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Clean-up function returned to remove event listeners on component unmount
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const t = (key) => {
    const dict = translations.en;
    return dict[key] || key;
  };

  const simulatePWAInstall = () => {
    setPwaInstalled(true);
  };

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        toggleDarkMode,
        t,
        isOffline,
        pwaInstalled,
        simulatePWAInstall
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// React Concept: Custom hook to use ThemeContext using useContext
export const useTheme = () => useContext(ThemeContext);
