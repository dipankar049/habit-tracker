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

const colors = [
    "#4ade80", // green-400
    "#60a5fa", // blue-400
    "#fbbf24", // yellow-400
    "#f87171", // red-400
    "#a78bfa", // purple-400
    "#34d399", // teal-400
];

export default function VerticalBarChart({ tasks }) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                layout="vertical"
                data={tasks}
                margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
                barSize={30}
            >
                <CartesianGrid strokeDasharray="3 3" />
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
                    tick={{ fontSize: 14, fill: "#4B5563" }}
                    width={100}
                />

                <Tooltip
                    formatter={(value) => `${value} mins`}
                    contentStyle={{
                        backgroundColor: "#F9FAFB",
                        borderRadius: "8px",
                        borderColor: "#D1D5DB",
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
