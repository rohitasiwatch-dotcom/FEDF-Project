// React Hook: createContext creates a context object.
// React Hook: useContext subscribes to context changes.
// React Hook: useState manages component local state.
// React Hook: useEffect handles side effects.
import React, { createContext, useContext, useState, useEffect } from "react";
import { initialNotifications } from "../data/mockData";
import { useAuth } from "./AuthContext";

// Creating NotificationContext
const NotificationContext = createContext();

// NotificationProvider provides notification states and behaviors

export const NotificationProvider = ({ children }) => {

  // Custom Hook: useAuth consumes the AuthContext

  const { currentUser } = useAuth();

  // useState: local state for notifications array

  const [notifications, setNotifications] = useState([]);

  // useState with Lazy Initialization: runs the state initialization callback only on initial render

  const [whatsappSettings, setWhatsappSettings] = useState(() => {
    const saved = localStorage.getItem("whatsappSettings");
    return saved
      ? JSON.parse(saved)
      : {
          enabled: false,
          phoneNumber: "",
          reminderAlerts: true,
          announcements: false,
          verificationAlerts: true
        };
  });

  // useEffect
  // React Hook: useEffect to sync WhatsApp settings with localStorage whenever they change

  useEffect(() => {
    localStorage.setItem("whatsappSettings", JSON.stringify(whatsappSettings));
  }, [whatsappSettings]);

  // useEffect
  // React Hook: useEffect to load notifications from localStorage on initial component mount
  
  useEffect(() => {
    const stored = localStorage.getItem("vaccineNotifications");
    if (stored) {
      setNotifications(JSON.parse(stored));
    } else {
      localStorage.setItem("vaccineNotifications", JSON.stringify(initialNotifications));
      setNotifications(initialNotifications);
    }
  }, []);

  const saveNotifications = (updated) => {
    setNotifications(updated);
    localStorage.setItem("vaccineNotifications", JSON.stringify(updated));
  };

  // User specific notifications
  const getUserNotifications = () => {
    if (!currentUser) return [];
    // User can see their own specific notifications, or "all" (announcements)
    return notifications.filter(
      (n) => n.userId === currentUser.id || n.userId === "all"
    );
  };

  const addNotification = (notifData) => {
    const newNotif = {
      id: `not-${Date.now()}`,
      read: false,
      timestamp: new Date().toISOString(),
      ...notifData
    };
    const updated = [newNotif, ...notifications];
    saveNotifications(updated);

    // Simulate WhatsApp send if enabled
    if (whatsappSettings.enabled && whatsappSettings.phoneNumber) {
      console.log(
        `[WhatsApp API Simulation] Sent message to ${whatsappSettings.phoneNumber}: "${newNotif.title} - ${newNotif.message}"`
      );
    }

    return newNotif;
  };

  const markAsRead = (id) => {
    const updated = notifications.map((n) => {
      if (n.id === id) return { ...n, read: true };
      return n;
    });
    saveNotifications(updated);
  };

  const markAllAsRead = () => {
    if (!currentUser) return;
    const updated = notifications.map((n) => {
      if (n.userId === currentUser.id || n.userId === "all") {
        return { ...n, read: true };
      }
      return n;
    });
    saveNotifications(updated);
  };

  const deleteNotification = (id) => {
    const updated = notifications.filter((n) => n.id !== id);
    saveNotifications(updated);
  };

  const updateWhatsappSettings = (settings) => {
    setWhatsappSettings((prev) => ({ ...prev, ...settings }));
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        whatsappSettings,
        getUserNotifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        updateWhatsappSettings
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// React Concept: Custom hook to use NotificationContext using useContext
export const useNotification = () => useContext(NotificationContext);
