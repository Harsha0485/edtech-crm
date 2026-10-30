
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
    const [inquiries, setInquiries] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [userType, setUserType] = useState("");

    useEffect(() => {
        fetchInquiries();
    }, []);

    const fetchInquiries = async () => {
        try {
            const token = sessionStorage.getItem("adminToken");

            const response = await axios.get(
                `${API_URL}/api/inquiries/admin/inquiries/`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setInquiries(response.data.inquiries);

        } catch (error) {
            toast.error("Unable to load inquiries. Please login again.");
        }
    };

    const filteredInquiries = inquiries.filter((item) => {
        const searchMatch =
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.phone.includes(search);

        const categoryMatch =
            category === "" || item.category === category;

        const userMatch =
            userType === "" || item.user_type === userType;

        return searchMatch && categoryMatch && userMatch;
    });
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.removeItem("adminToken");
        toast.success("Logged out successfully!");
        navigate("/admin");
    };

    const API_URL = import.meta.env.VITE_API_URL;

    const handleStatusChange = async (id, newStatus) => {
        try {
            const token = sessionStorage.getItem("adminToken");

            await axios.post(
                `${API_URL}/api/inquiries/admin/inquiries/${id}/status/`,
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            toast.success("Inquiry status updated!");

            fetchInquiries();

        } catch (error) {
            toast.error("Unable to update status!");
        }
    };

    return (
        <div className="admin-dashboard">
            <div className="dashboard-header">
                <div className="header-content">
                    <h1>Admin Dashboard</h1>
                    <p className="dashboard-subtitle">
                        Manage and track student inquiries
                    </p>
                </div>

                <button onClick={handleLogout}>Logout</button>
            </div>
            
            <div className="dashboard-cards">
                <div className="stat-card">
                    <h3>Total Inquiries</h3>
                    <h2>{inquiries.length}</h2>
                </div>

                <div className="stat-card">
                    <h3>New Inquiries</h3>
                    <h2>
                        {inquiries.filter(item => item.status === "New").length}
                    </h2>
                </div>
            </div>

            <div className="filter-section">

                <input
                    type="text"
                    placeholder="Search by name or phone"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="">All Categories</option>
                    <option value="Scholarship">Scholarship</option>
                    <option value="Concert">Concert</option>
                    <option value="Admission">Admission</option>
                    <option value="General Query">General Query</option>
                </select>

                <select
                    value={userType}
                    onChange={(e) => setUserType(e.target.value)}
                >
                    <option value="">All Users</option>
                    <option value="Parent">Parent</option>
                    <option value="Student">Student</option>
                    <option value="School">School</option>
                </select>

            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>User Type</th>
                            <th>Category</th>
                            <th>Message</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredInquiries.map((item) => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.name}</td>
                                <td>{item.email}</td>
                                <td>{item.phone}</td>
                                <td>{item.user_type}</td>
                                <td>{item.category}</td>
                                <td>{item.message}</td>
                                <td>
                                    <select
                                        value={item.status}
                                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                                    >
                                        <option value="New">New</option>
                                        <option value="Contacted">Contacted</option>
                                        <option value="Resolved">Resolved</option>
                                    </select>
                                </td>
                            </tr>
                        ))}

                        {filteredInquiries.length === 0 && (
                            <tr>
                                <td colSpan="8">No inquiries found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

        </div>
    );
}

export default AdminDashboard;
