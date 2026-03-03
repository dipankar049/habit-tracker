import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { validateUserInput } from '../util/validateInput';
import { toast } from 'react-toastify';
import { Eye, EyeOff } from "lucide-react";

export default function Register() {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: ""
    });
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleRegister = () => {
        setLoading(true);
        const validation = validateUserInput({
            email: form.email,
            password: form.password,
            name: form.username,
        });
        if(!validation.isValid) {
            toast.error(validation.message);
            setLoading(false);
            return;
        }

        axios.post(`${import.meta.env.VITE_NODE_URI}/auth/register`, {
            username: form.username,
            email: form.email,
            password: form.password
        })
        .then((res) => {
            toast.success(res.data.message);
            navigate("/login", { replace: true });
        })
        .catch((err) => {
            if (err.response && err.response.data) {
                toast.error(err.response.data.message || err.response.data.error);
            } else {
                console.log("Unknown error:", err.message);
            }
        }).finally(() => setLoading(false));
    }

    return (
        <div className="min-h-screen -my-4 -mx-4 md:-ml-[32%] md:-mr-[4%] sm:-mt-20 bg-slate-900 flex items-center justify-center px-4 overflow-hidden">

            {/* Background orbs */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute -top-24 -right-24 w-[400px] h-[400px] rounded-full bg-violet-600/20 blur-[100px]" />
                <div className="absolute bottom-0 -left-24 w-[400px] h-[400px] rounded-full bg-indigo-600/15 blur-[100px]" />
            </div>

            <div className="relative z-10 w-full max-w-5xl grid md:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-2xl shadow-black/40 border border-white/[0.07]">

                {/* Left — form panel */}
                <div className="bg-slate-900/95 backdrop-blur-sm p-10 md:p-12 flex flex-col justify-center">

                    {/* Mobile logo */}
                    <div className="flex items-center gap-2.5 mb-8 md:hidden">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-xs">H</div>
                        <span className="text-white font-extrabold text-base tracking-tight">HabitTracker</span>
                    </div>

                    <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">Create account</h2>
                    <p className="text-slate-400 text-sm mb-8">Start building habits that stick ✨</p>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Username</label>
                            <input
                                type="text"
                                value={form.username}
                                onChange={(e) => setForm({ ...form, username: e.target.value })}
                                placeholder="yourname"
                                className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-sm"
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Email</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                placeholder="you@example.com"
                                className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-sm"
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
                                Password
                            </label>

                            <div className="relative">

                                <input
                                type={showPassword ? "text" : "password"}
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 pr-12 rounded-xl bg-slate-800/80 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-sm"
                                disabled={loading}
                                />

                                <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                                >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={handleRegister}
                            className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none mt-2"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                                    </svg>
                                    Signing you up...
                                </span>
                            ) : "Create Account"}
                        </button>
                    </div>

                    <p className="text-center text-sm mt-8 text-slate-500">
                        Already have an account?{" "}
                        {!loading ?
                            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                                Login here
                            </Link>
                            :
                            <span className="text-slate-600 cursor-not-allowed">Login here</span>
                        }
                    </p>

                </div>

                {/* Right — illustration panel */}
                <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-violet-600/20 to-indigo-600/30 border-l border-white/[0.07] p-12">

                    {/* Logo */}
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/30">
                            H
                        </div>
                        <span className="text-white font-extrabold text-lg tracking-tight">HabitTracker</span>
                    </div>

                    {/* Illustration — replace src with your image */}
                    <div className="flex-1 flex items-center justify-center py-10 relative">
                        <img
                            src="YOUR_IMAGE_URL_HERE"
                            alt="Habit tracking illustration"
                            className="w-full max-w-xs opacity-90 drop-shadow-xl"
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                        {/* Fallback decorative UI if no image */}
                        <div className="absolute bg-slate-800/60 border border-white/10 rounded-2xl p-6 w-64 backdrop-blur-sm">
                            <div className="flex items-center gap-2 mb-5">
                                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                                <p className="text-xs text-slate-400 uppercase tracking-widest">Today's habits</p>
                            </div>
                            {[
                                { name: 'Morning Run',   pct: 100, done: true },
                                { name: 'DSA Practice',  pct: 100, done: true },
                                { name: 'Book Reading',  pct: 0,   done: false },
                            ].map((h, i) => (
                                <div key={i} className="flex items-center gap-3 mb-3">
                                    <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] flex-shrink-0 ${h.done ? 'bg-violet-500/30 border border-violet-400/50 text-violet-300' : 'border border-white/10 text-transparent'}`}>✓</div>
                                    <div className="flex-1">
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className={h.done ? 'text-slate-300' : 'text-slate-500'}>{h.name}</span>
                                        </div>
                                        <div className="w-full bg-white/5 rounded-full h-1">
                                            <div className={`h-1 rounded-full ${h.done ? 'bg-gradient-to-r from-indigo-500 to-violet-500' : ''}`} style={{ width: `${h.pct}%` }} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="mt-4 pt-4 border-t border-white/5 flex justify-between">
                                <span className="text-xs text-slate-500">Streak</span>
                                <span className="text-xs font-bold text-white">14 days 🔥</span>
                            </div>
                        </div>
                    </div>

                    {/* Quote */}
                    <p className="text-slate-400 text-sm leading-relaxed">
                        "Small daily improvements are the key to staggering long-term results."
                        <span className="block text-slate-500 mt-1">— Robin Sharma</span>
                    </p>

                </div>

            </div>
        </div>
    );
}