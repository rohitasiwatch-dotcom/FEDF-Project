// React Hook: createContext is used to create a Context object that components can subscribe to.
// React Hook: useContext is used to read and subscribe to context from your component.
// React Hook: useState is a React Hook that lets you add a state variable to your component.
// React Hook: useEffect is a React Hook that lets you synchronize a component with an external system.
import React, { createContext, useContext, useState, useEffect } from "react";
import { initialUsers } from "../data/mockData";

// Creating AuthContext to share authentication state across components
const AuthContext = createContext();

// AuthProvider component to wrap application and provide authentication state
export const AuthProvider = ({ children }) => {
  // useState: local states to hold users list, current logged-in user, and app loading state
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect
  // React Hook: useEffect to run side effects (reading from localStorage on initial component mount)
  useEffect(() => {
    const storedUsers = localStorage.getItem("users");
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      localStorage.setItem("users", JSON.stringify(initialUsers));
      setUsers(initialUsers);
    }

    const sessionUser = localStorage.getItem("sessionUser");
    if (sessionUser) {
      setCurrentUser(JSON.parse(sessionUser));
    }
    setLoading(false);
  }, []);

  // Sync users with localStorage
  const saveUsers = (updatedUsers) => {
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  const login = (email, password) => {
    const foundUser = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!foundUser) {
      throw new Error("Invalid email or password.");
    }
    if (foundUser.status === "suspended") {
      throw new Error("Your account has been suspended. Please contact support.");
    }

    setCurrentUser(foundUser);
    localStorage.setItem("sessionUser", JSON.stringify(foundUser));
    return foundUser;
  };

  const register = (userData) => {
    const emailExists = users.some(
      (u) => u.email.toLowerCase() === userData.email.toLowerCase()
    );

    if (emailExists) {
      throw new Error("Email already registered.");
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: userData.fullName,
      email: userData.email,
      mobile: userData.mobile,
      dob: userData.dob,
      gender: userData.gender,
      bloodGroup: userData.bloodGroup,
      password: userData.password,
      role: "user",
      status: "active",
      avatar: "",
      allergies: [],
      healthConditions: [],
      chronicDiseases: [],
      riskFactors: [],
      pregnancyStatus: "no"
    };

    const updated = [...users, newUser];
    saveUsers(updated);

    // Auto login after register
    setCurrentUser(newUser);
    localStorage.setItem("sessionUser", JSON.stringify(newUser));
    return newUser;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("sessionUser");
  };

  const forgotPassword = (email) => {
    const found = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!found) {
      throw new Error("No account found with this email address.");
    }
    // Simulate sending reset link
    return true;
  };

  const resetPassword = (email, newPassword) => {
    const updated = users.map((u) => {
      if (u.email.toLowerCase() === email.toLowerCase()) {
        return { ...u, password: newPassword };
      }
      return u;
    });
    saveUsers(updated);

    // If current user is changing password, update session
    if (currentUser && currentUser.email.toLowerCase() === email.toLowerCase()) {
      const updatedUser = { ...currentUser, password: newPassword };
      setCurrentUser(updatedUser);
      localStorage.setItem("sessionUser", JSON.stringify(updatedUser));
    }
    return true;
  };

  const updateProfile = (profileData) => {
    if (!currentUser) return;

    const updatedUser = {
      ...currentUser,
      ...profileData
    };

    // Update in standard users array
    const updatedUsers = users.map((u) => (u.id === currentUser.id ? updatedUser : u));
    saveUsers(updatedUsers);

    // Update current session user
    setCurrentUser(updatedUser);
    localStorage.setItem("sessionUser", JSON.stringify(updatedUser));
  };

  // ADMIN OPERATIONS
  const adminUpdateUser = (userId, updatedFields) => {
    const updatedUsers = users.map((u) => {
      if (u.id === userId) {
        return { ...u, ...updatedFields };
      }
      return u;
    });
    saveUsers(updatedUsers);

    // If updating currently logged in profile (e.g. admin profile)
    if (currentUser && currentUser.id === userId) {
      const updatedUser = { ...currentUser, ...updatedFields };
      setCurrentUser(updatedUser);
      localStorage.setItem("sessionUser", JSON.stringify(updatedUser));
    }
  };

  const suspendUser = (userId) => {
    const updatedUsers = users.map((u) => {
      if (u.id === userId) {
        return { ...u, status: u.status === "active" ? "suspended" : "active" };
      }
      return u;
    });
    saveUsers(updatedUsers);
  };

  const deleteUser = (userId) => {
    const updatedUsers = users.filter((u) => u.id !== userId);
    saveUsers(updatedUsers);
  };

  return (
    <AuthContext.Provider
      value={{
        users,
        currentUser,
        loading,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        updateProfile,
        adminUpdateUser,
        suspendUser,
        deleteUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// React Concept: Custom hook to easily consume the AuthContext state using useContext
export const useAuth = () => useContext(AuthContext);
