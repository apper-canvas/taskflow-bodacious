import { Route, Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import React from "react";
import Layout from "@/components/organisms/Layout";
import Dashboard from "@/components/pages/Dashboard";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white p-2">
        <div className="min-h-[calc(100vh-1rem)] bg-gradient-to-br from-white via-surface/20 to-primary-50/30 rounded-xl overflow-hidden">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
            </Route>
          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            className="z-50"
            toastClassName="font-body"
          />
        </div>
      </div>
    </Router>
  );
}

export default App;