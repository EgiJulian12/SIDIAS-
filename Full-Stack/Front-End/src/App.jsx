import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./store/AuthContext";

import Dashboard from "./pages/Dashboard";
import Diagnosis from "./pages/Diagnosis";
import History from "./pages/History";
import NutriGuide from "./pages/NutriGuide";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/layout/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Default Redirect */}
          <Route path="/" element={<Navigate to="/dashboard" />} />

          {/* Protected Pages */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/diagnosis"
            element={
              <ProtectedRoute>
                <Diagnosis />
              </ProtectedRoute>
            }
          />

          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />

          <Route
            path="/nutriguide"
            element={
              <ProtectedRoute>
                <NutriGuide />
              </ProtectedRoute>
            }
          />

          {/* Public Auth Pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
