import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
    const [form, setForm] = useState({ 
        username: "",
        email: "",
        password: ""
    });
    const navigate = useNavigate();

    const handleRegister = () => {
        axios.post(`${import.meta.env.VITE_NODE_URI}/auth/register`, {
            username: form.username,
            email: form.email,
            password: form.password
        })
        .then((res) => {
            console.log(res.data.message);
            navigate("/login", { replace: true });
        })
        .catch((err) => {
            if (err.response && err.response.data) {
                console.log(err.response.data.message || err.response.data.error);
            } else {
                console.log("Unknown error:", err.message);
            }
        });
    }

    return (
        <div className="min-h-screen -my-16 -mx-4 md:-ml-[32%] md:-mr-[4%] sm:-mt-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 flex items-center justify-center px-8 sm:px-4 font-sans">
            <div className="backdrop-blur-md bg-white/10 border border-white/20 shadow-xl rounded-2xl p-8 w-full max-w-md text-white">
                <h2 className="text-3xl font-bold text-center mb-6 tracking-wide">Create Account ✨</h2>

                <div className="space-y-4">
                    <input
                        type="text"
                        value={form.username}
                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                        placeholder="Username"
                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />

                    <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="Email"
                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />

                    <input
                        type="password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        placeholder="Password"
                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />

                    <button
                        onClick={handleRegister}
                        className="w-full bg-green-500 hover:bg-green-600 transition duration-200 text-white py-3 rounded-lg font-semibold shadow-md"
                    >
                        Register
                    </button>
                </div>

                <p className="text-center text-sm mt-6 text-gray-300">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-400 hover:underline font-medium">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
}
