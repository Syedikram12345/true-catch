import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#4f46e5", "#7c3aed", "#db2777", "#ea580c", "#16a34a"];

function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAnalytics();
  }, []);

  async function fetchAnalytics() {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/analytics", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(response.data);
    } catch (err) {
      setError("Failed to load analytics.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">
        Loading analytics...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  const deviceData = Object.entries(data.deviceBreakdown || {}).map(
    ([name, value]) => ({ name, value }),
  );

  const browserData = Object.entries(data.browserBreakdown || {}).map(
    ([name, value]) => ({ name, value }),
  );

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-8 py-8 sm:py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Analytics</h1>
            <p className="text-gray-500 text-sm mt-1">
              How your widgets are performing.
            </p>
          </div>
          <Link
            to="/dashboard"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Dashboard
          </Link>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border shadow-sm p-5 text-center">
            <p className="text-2xl font-bold text-gray-900">
              {data.totalViews}
            </p>
            <p className="text-xs text-gray-500 mt-1">Total Views</p>
          </div>
          <div className="bg-white rounded-xl border shadow-sm p-5 text-center">
            <p className="text-2xl font-bold text-gray-900">
              {data.topWidgets.reduce((sum, w) => sum + w.conversions, 0)}
            </p>
            <p className="text-xs text-gray-500 mt-1">Total Conversions</p>
          </div>
          <div className="bg-white rounded-xl border shadow-sm p-5 text-center">
            <p className="text-2xl font-bold text-gray-900">
              {data.topWidgets.length > 0
                ? (
                    (data.topWidgets.reduce(
                      (sum, w) => sum + w.conversions,
                      0,
                    ) /
                      Math.max(data.totalViews, 1)) *
                    100
                  ).toFixed(1)
                : "0.0"}
              %
            </p>
            <p className="text-xs text-gray-500 mt-1">Conversion Rate</p>
          </div>
          <div className="bg-white rounded-xl border shadow-sm p-5 text-center">
            <p className="text-2xl font-bold text-gray-900">
              {data.topWidgets.length}
            </p>
            <p className="text-xs text-gray-500 mt-1">Active Widgets</p>
          </div>
        </div>

        {/* Views over time */}
        <div className="bg-white rounded-xl border shadow-sm p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-6">
            Views — Last 7 Days
          </h3>
          {data.viewsByDay.every((d) => d.views === 0) ? (
            <div className="text-center text-gray-400 text-sm py-10">
              No view data yet — embed your script on a website to start
              tracking.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={data.viewsByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(d) =>
                    new Date(d).toLocaleDateString("en-IN", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip
                  labelFormatter={(d) =>
                    new Date(d).toLocaleDateString("en-IN", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })
                  }
                />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  dot={{ fill: "#4f46e5", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Device + Browser breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          {/* Device */}
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-6">
              Device Breakdown
            </h3>
            {deviceData.length === 0 ? (
              <div className="text-center text-gray-400 text-sm py-8">
                No data yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={deviceData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {deviceData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Browser */}
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-6">
              Browser Breakdown
            </h3>
            {browserData.length === 0 ? (
              <div className="text-center text-gray-400 text-sm py-8">
                No data yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={browserData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11 }}
                    allowDecimals={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 11 }}
                    width={60}
                  />
                  <Tooltip />
                  <Bar dataKey="value" fill="#4f46e5" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Top widgets table */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h3 className="font-semibold text-gray-900">
              Top Widgets by Views
            </h3>
          </div>
          {data.topWidgets.length === 0 ? (
            <div className="p-10 text-center text-gray-400 text-sm">
              No widgets yet — create a popup or toaster to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[500px]">
                <thead>
                  <tr className="border-b text-xs text-gray-500 uppercase tracking-wide">
                    <th className="px-6 py-3">Widget</th>
                    <th className="px-6 py-3">Views</th>
                    <th className="px-6 py-3">Conversions</th>
                    <th className="px-6 py-3">Conversion Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {data.topWidgets.map((widget, index) => (
                    <tr
                      key={index}
                      className="border-b last:border-0 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 font-medium text-sm">
                        {widget.name}
                      </td>
                      <td className="px-6 py-4 text-sm">{widget.views}</td>
                      <td className="px-6 py-4 text-sm">
                        {widget.conversions}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`font-medium ${
                            parseFloat(widget.conversionRate) > 5
                              ? "text-green-600"
                              : parseFloat(widget.conversionRate) > 2
                                ? "text-amber-600"
                                : "text-gray-500"
                          }`}
                        >
                          {widget.conversionRate}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Analytics;
