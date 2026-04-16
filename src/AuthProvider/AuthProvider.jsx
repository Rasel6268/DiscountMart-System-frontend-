'use client';
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/config/api";

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return "useAuth must be used within an AuthProvider";
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const res = await api.get("/auth/me");

      if (res.status === 200) {
        const data = await res.json();
        setUser(data);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    
    setLoading(true);
    try {
     const result = await api.post("/auth/register", { name, email, password });
     
      return result.data;
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      setUser(res.data.user);
      console.log(res);
    //   if (res.data.user.role === "admin") {
    //     router.push("/admin/dashboard");
    //   } else {
    //     router.push("/dashboard");
    //   }

      toast.success(`Welcome back, ${res.data.user.name}!`);
      return { success: true, user: res.data.user };
    } catch (error) {
      console.error("Login error:", error);
      const message = error.response?.data?.error || "Login failed";
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };
  const logout = async () => {};
  const forgotPassword = async (email) => {};
  const resetPassword = async (token, password) => {};
  const authData = {
    user,
    loading,
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
    useAuth,
  };

  return <AuthContext value={authData}>{children}</AuthContext>;
};

export default AuthProvider;
