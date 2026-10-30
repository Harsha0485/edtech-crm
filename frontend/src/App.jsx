
import { BrowserRouter, Routes, Route } from "react-router-dom";

import InquiryForm from "./components/InquiryForm";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<InquiryForm />} />
                <Route path="/admin" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Routes>

            <ToastContainer position="top-right" />
        </BrowserRouter>
    );
}

export default App;
