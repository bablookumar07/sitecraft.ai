import React from "react";
import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import BuilderPage from "./pages/BuilderPage";
import PreviewPage from "./pages/PreviewPage";
import PublishPage from "./pages/PublishPage";

import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Routes>
      {/* ================= PUBLIC ROUTES ================= */}

      <Route path="/" element={<HomePage />} />

      <Route path="/login" element={<LoginPage />} />

      <Route path="/register" element={<RegisterPage />} />

      {/* ================= PROTECTED ROUTES ================= */}

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />

        <Route path="/builder" element={<BuilderPage />} />
        <Route path="/builder/:projectId" element={<BuilderPage />} />

        <Route path="/preview" element={<PreviewPage />} />
        <Route path="/preview/:projectId" element={<PreviewPage />} />

        <Route path="/publish" element={<PublishPage />} />
        <Route path="/publish/:projectId" element={<PublishPage />} />
      </Route>
    </Routes>
  );
};

export default App;