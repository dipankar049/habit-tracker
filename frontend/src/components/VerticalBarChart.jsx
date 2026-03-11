import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";

// const colors = [
//     "#4ade80", // green-400
//     "#60a5fa", // blue-400
//     "#fbbf24", // yellow-400
//     "#f87171", // red-400
//     "#a78bfa", // purple-400
//     "#34d399", // teal-400
// ];

const colors = [
  "#8B5CF6",
  "#6366F1",
  "#22C55E",
  "#F59E0B",
  "#06B6D4",
  "#F43F5E",
];

export default function VerticalBarChart({ tasks }) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                layout="vertical"
                data={tasks}
                margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                barSize={26}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                    type="number"
                    label={{
                        value: "Minutes",
                        position: "insideBottomRight",
                        offset: 0,
                        fill: "#6B7280",
                        fontSize: 14,
                    }}
                    tick={{ fontSize: 14, fill: "#4B5563" }}
                    domain={[0, "dataMax"]}
                    allowDecimals={false}
                />
                <YAxis
                    dataKey="taskName"
                    type="category"
                    tickFormatter={(value) => value.length > 18 ? value.slice(0, 12) + "…" : value}
                    tick={{ fontSize: 13, fill: "#4B5563" }}
                    width={60}
                />

                <Tooltip
                    formatter={(value) => `${value} mins`}
                    contentStyle={{
                        backgroundColor: "#ffffff",
                        borderRadius: "10px",
                        border: "1px solid #E5E7EB",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
                    }}
                    itemStyle={{ color: "#4B5563" }}
                />
                <Bar dataKey="timeSpent" radius={[0, 6, 6, 0]}>
                    {tasks.map((entry, index) => (
                        <Cell key={entry._id || index} fill={colors[index % colors.length]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}
