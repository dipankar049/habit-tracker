import React from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
    const navigate = useNavigate();

    const habits = [
        { name: 'Morning Exercise', time: '30 min', done: true },
        { name: 'DSA Practice',     time: '90 min', done: true },
        { name: 'Book Reading',     time: '40 min', done: false },
        { name: 'Meditation',       time: '15 min', done: false },
    ];

    const features = [
        { icon: '⚡', title: 'Smart Routine System',  desc: 'Create habits with custom duration goals and schedule them daily, alternate days, or selected weekdays.' },
        { icon: '✅', title: 'Daily Task Tracking',   desc: 'Mark tasks as completed and log the actual time spent to measure real productivity — not just intent.' },
        { icon: '📊', title: 'Weekly Analytics',      desc: 'See exactly how many hours you invest in each habit with a clear weekly calendar overview.' },
        { icon: '🗓', title: 'GitHub-style Heatmap',  desc: 'Monthly summary with a contribution-style heatmap to visualize your consistency over time.' },
        { icon: '✏️', title: 'Edit Anytime',          desc: 'Routines evolve. Easily update your habits, adjust durations, and refine schedules whenever needed.' },
        { icon: '🎨', title: 'Clean Interface',       desc: 'A focused, distraction-free UI engineered for deep work and daily momentum — nothing unnecessary.' },
    ];

    return (
        <div className="min-h-screen -my-16 -mx-4 md:-ml-[30%] md:-mr-[4%] sm:-mt-20 bg-slate-900 text-white overflow-hidden">

            {/* Background orbs */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute -top-24 -left-24 w-[500px] h-[500px] rounded-full bg-indigo-600/20 blur-[100px]" />
                <div className="absolute bottom-0 -right-24 w-[450px] h-[450px] rounded-full bg-violet-600/15 blur-[100px]" />
                <div className="absolute top-1/2 left-1/3 w-[350px] h-[350px] rounded-full bg-indigo-500/10 blur-[80px]" />
            </div>

            <div className="relative z-10">

                {/* Hero */}
                <section className="px-8 md:px-14 pt-24 pb-28 grid md:grid-cols-[55%_40%] gap-16 items-center">

                    <div>
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-400/25 px-4 py-1.5 rounded-full text-xs font-medium text-indigo-300 mb-8">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                            Now with weekly analytics & heatmaps
                        </div>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight mb-6">
                            Build habits
                            <br />
                            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                                that stick.
                            </span>
                        </h1>

                        <p className="text-base md:text-lg text-slate-400 leading-relaxed mb-10 max-w-lg">
                            Track daily routines, measure real time spent, and visualize
                            your consistency — all in one clean, distraction-free workspace.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <button
                                className="px-8 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all"
                                onClick={() => navigate('/register')}
                            >
                                Get started free →
                            </button>
                            <button className="px-8 py-3.5 rounded-xl font-medium text-slate-300 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 hover:-translate-y-0.5 transition-all">
                                See how it works
                            </button>
                        </div>

                        <div className="flex items-center gap-5 mt-12">
                            <div className="flex -space-x-2">
                                {['bg-indigo-500','bg-violet-500','bg-purple-400','bg-indigo-700'].map((c, i) => (
                                    <div key={i} className={`w-8 h-8 rounded-full border-2 border-slate-900 ${c}`} />
                                ))}
                            </div>
                            <p className="text-sm text-slate-500">
                                Joined by <span className="text-slate-300 font-medium">2,400+</span> productive people
                            </p>
                        </div>
                    </div>

                    {/* Preview card */}
                    <div className="bg-slate-800/60 backdrop-blur-sm border border-white/10 rounded-3xl p-7 space-y-5">

                        <div className="flex items-center justify-between">
                            <p className="text-xs text-slate-500 uppercase tracking-widest font-medium">Today · Sunday</p>
                            <span className="text-xs bg-indigo-500/10 border border-indigo-400/25 text-indigo-300 px-3 py-1 rounded-full">75% done</span>
                        </div>

                        {habits.map((h, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${h.done ? 'bg-violet-500/20 border border-violet-500/40' : 'border border-white/10'}`}>
                                    {h.done && <span className="text-violet-300 text-[10px]">✓</span>}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className={`text-sm font-medium ${h.done ? 'text-white' : 'text-slate-500'}`}>{h.name}</span>
                                        <span className={`text-xs ${h.done ? 'text-violet-400' : 'text-slate-600'}`}>{h.time}</span>
                                    </div>
                                    <div className="w-full bg-white/5 rounded-full h-1.5">
                                        <div
                                            className={`h-1.5 rounded-full ${h.done ? 'bg-gradient-to-r from-indigo-500 to-violet-500' : ''}`}
                                            style={{ width: h.done ? '100%' : '0%' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { label: 'Done',   value: '2/4' },
                                { label: 'Hours',  value: '2h'  },
                                { label: 'Streak', value: '14d 🔥' },
                            ].map((s, i) => (
                                <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 text-center">
                                    <p className="text-base font-bold text-white">{s.value}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
                                </div>
                            ))}
                        </div>

                    </div>

                </section>


                {/* Features */}
                <section id="features" className="px-8 md:px-14 py-24 bg-slate-800/30">

                    <div className="text-center mb-16">
                        <p className="text-xs text-violet-400 uppercase tracking-widest font-medium mb-3">Features</p>
                        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                            Everything you need
                        </h2>
                        <p className="text-slate-400 mt-4 text-base max-w-md mx-auto">
                            Built around the psychology of habit formation, not just task lists.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-5">
                        {features.map((f, i) => (
                            <div
                                key={i}
                                className="bg-slate-800/50 border border-white/[0.07] rounded-2xl p-7 hover:border-indigo-500/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20 transition-all"
                            >
                                <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-xl mb-5">
                                    {f.icon}
                                </div>
                                <h3 className="font-bold text-lg text-white mb-2">{f.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>

                </section>


                {/* CTA Banner */}
                <section className="px-8 md:px-14 py-24">
                    <div className="relative overflow-hidden rounded-3xl p-12 md:p-16 text-center bg-gradient-to-br from-indigo-500/10 via-violet-500/[0.08] to-indigo-500/5 border border-indigo-500/20">

                        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-violet-600/20 blur-[80px] pointer-events-none" />
                        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-indigo-600/15 blur-[80px] pointer-events-none" />

                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                                Start building better habits
                                <br />
                                <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                                    today.
                                </span>
                            </h2>
                            <p className="text-slate-400 mb-8 max-w-md mx-auto">
                                Free to start. No credit card. No noise. Just clarity.
                            </p>
                            <button
                                className="px-10 py-4 rounded-xl font-semibold text-white text-base bg-gradient-to-r from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all"
                                onClick={() => navigate('/register')}
                            >
                                Create free account →
                            </button>
                        </div>

                    </div>
                </section>


                {/* Footer */}
                <footer className="px-8 md:px-14 py-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-xs">H</div>
                        <span className="font-bold text-sm text-white">HabitTracker</span>
                    </div>
                    <p className="text-slate-600 text-sm">© 2025 HabitTracker. All rights reserved.</p>
                    <div className="flex gap-6 text-sm text-slate-600">
                        <a href="#" className="hover:text-slate-400 transition-colors">Privacy</a>
                        <a href="#" className="hover:text-slate-400 transition-colors">Terms</a>
                        <a href="#" className="hover:text-slate-400 transition-colors">Contact</a>
                    </div>
                </footer>

            </div>
        </div>
    );
}