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

export default function HorizontalBarChart({ data, selectedDate, onBarClick }) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                barSize={80}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="dayName" tick={{ fontSize: 14, fill: "#4B5563" }} />
                <YAxis
                    label={{
                        value: "Hours",
                        angle: -90,
                        position: "insideLeft",
                        fill: "#6B7280",
                        fontSize: 14,
                    }}
                    allowDecimals={false}
                    tick={{ fontSize: 14, fill: "#4B5563" }}
                />
                <Tooltip
                    formatter={(value) => `${value} hrs`}
                    labelFormatter={(label) => `Day: ${label}`}
                    contentStyle={{
                        backgroundColor: "#ffffff",
                        borderRadius: "10px",
                        border: "1px solid #E5E7EB",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
                    }}
                    itemStyle={{ color: "#4B5563" }}
                />
                <Bar
                    dataKey="totalHours"
                    radius={[6, 6, 0, 0]}
                    onClick={(data, index) => {
                        const clickedDate = data.date; // the date from payload
                        onBarClick(clickedDate);
                    }}
                >
                    {data.map((entry) => (
                        <Cell
                            key={entry.date}
                            fill={entry.date === selectedDate ? "#16A34A" : "#22C55E"}
                        />
                    ))}
                </Bar>

            </BarChart>
        </ResponsiveContainer>
    );
}
