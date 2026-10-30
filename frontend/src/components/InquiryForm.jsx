
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function InquiryForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        user_type: "",
        category: "",
        message: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const API_URL = import.meta.env.VITE_API_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                `${API_URL}/api/inquiries/submit/`,
                formData
            );

            toast.success(response.data.message);

            setFormData({
                name: "",
                email: "",
                phone: "",
                user_type: "",
                category: "",
                message: ""
            });
        } catch (error) {
            toast.error(
                error.response?.data?.error || "Something went wrong!"
            );
        }
    };

    return (
        <div className="inquiry-container">
            <h1>Submit Your Inquiry</h1>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                />

                <select
                    name="user_type"
                    value={formData.user_type}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select User Type</option>
                    <option value="Parent">Parent</option>
                    <option value="Student">Student</option>
                    <option value="School">School</option>
                </select>

                <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Inquiry Category</option>
                    <option value="Scholarship">Scholarship</option>
                    <option value="Concert">Concert</option>
                    <option value="Admission">Admission</option>
                    <option value="General Query">General Query</option>
                </select>

                <textarea
                    name="message"
                    placeholder="Write your message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                />

                <button type="submit">Submit Inquiry</button>
            </form>
        </div>
    );
}

export default InquiryForm;
