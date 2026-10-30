
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function AdminLogin() {
    const navigate = useNavigate();

    const [loginData, setLoginData] = useState({
        username: "",
        password: ""
    });

    const handleChange = (e) => {
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/inquiries/admin/login/",
                loginData
            );

            sessionStorage.setItem("adminToken", response.data.token);

            toast.success("Login successful!");

            navigate("/admin/dashboard");

        } catch (error) {
            toast.error(
                error.response?.data?.error || "Login failed!"
            );
        }
    };

    return (
        <div className="admin-login">
            <h1>Admin Login</h1>
            <p>Login to manage student inquiries</p>

            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={loginData.username}
                    onChange={handleChange}
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={loginData.password}
                    onChange={handleChange}
                    required
                />

                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default AdminLogin;
