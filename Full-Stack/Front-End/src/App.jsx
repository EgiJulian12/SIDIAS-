import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Diagnosis from "./pages/Diagnosis";
import History from "./pages/History";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Default Redirect */}
        <Route
          path="/"
          element={<Navigate to="/dashboard" />}
        />

        {/* Pages */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/diagnosis"
          element={<Diagnosis />}
        />

        <Route
          path="/history"
          element={<History />}
        />

        <Route 
        path="/login" 
        element={<Login />} />


        <Route 
        path="/signup" 
        element={<Signup />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;