import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [popups, setPopups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPopups();
  }, []);

  async function fetchPopups() {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/popups", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPopups(response.data.popups);
    } catch (err) {
      setError("Failed to load your popups.");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  const totalViews = popups.reduce((sum, p) => sum + p.views, 0);
  const totalConversions = popups.reduce((sum, p) => sum + p.conversions, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 sm:px-8 py-4 bg-white border-b">
        <h1 className="text-lg sm:text-xl font-bold text-indigo-600">
          TrueCatch
        </h1>

        <nav className="flex items-center gap-3 sm:gap-6 text-sm text-gray-600">
          <Link
            to="/my-popups"
            className="hidden sm:inline hover:text-indigo-600"
          >
            My Popups
          </Link>
          <Link
            to="/create-popup"
            className="hidden sm:inline hover:text-indigo-600"
          >
            Create Popup
          </Link>

          <span className="hidden sm:inline text-gray-300">|</span>

          <span className="hidden sm:inline text-gray-700">
            Hi, <span className="font-medium">{user?.name || "there"}</span>
          </span>

          <button
            onClick={handleLogout}
            className="border border-gray-300 px-3 py-1.5 rounded-lg text-xs sm:text-sm hover:bg-gray-50"
          >
            Logout
          </button>
        </nav>
      </header>

      {/* Mobile-only quick links (since nav links are hidden above on small screens) */}
      <div className="flex sm:hidden gap-3 px-4 py-3 bg-white border-b text-sm">
        <Link to="/my-popups" className="text-indigo-600 font-medium">
          My Popups
        </Link>
        <Link to="/create-popup" className="text-indigo-600 font-medium">
          Create Popup
        </Link>
      </div>

      {/* Main content */}
      <main className="px-4 sm:px-8 py-8 sm:py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h2 className="text-xl sm:text-2xl font-bold">Overview</h2>
          <Link
            to="/create-popup"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-center text-sm"
          >
            + New Popup
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg px-3 py-2 mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-gray-500 text-sm">Loading your stats...</p>
        ) : (
          <>
            {/* Stats cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
              <div className="bg-white p-5 sm:p-6 rounded-lg shadow-sm border">
                <p className="text-sm text-gray-500">Total Popups</p>
                <p className="text-2xl sm:text-3xl font-bold mt-1">
                  {popups.length}
                </p>
              </div>
              <div className="bg-white p-5 sm:p-6 rounded-lg shadow-sm border">
                <p className="text-sm text-gray-500">Total Views</p>
                <p className="text-2xl sm:text-3xl font-bold mt-1">
                  {totalViews}
                </p>
              </div>
              <div className="bg-white p-5 sm:p-6 rounded-lg shadow-sm border">
                <p className="text-sm text-gray-500">Total Conversions</p>
                <p className="text-2xl sm:text-3xl font-bold mt-1">
                  {totalConversions}
                </p>
              </div>
            </div>

            {/* Popup list */}
            {popups.length === 0 ? (
              <div className="bg-white border rounded-lg p-10 text-center text-gray-500 text-sm">
                You haven't created any popups yet.{" "}
                <Link to="/create-popup" className="text-indigo-600 underline">
                  Create your first one
                </Link>
                .
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border overflow-x-auto">
                <table className="w-full text-left min-w-[420px]">
                  <thead>
                    <tr className="border-b text-sm text-gray-500">
                      <th className="px-4 sm:px-6 py-3">Popup Name</th>
                      <th className="px-4 sm:px-6 py-3">Views</th>
                      <th className="px-4 sm:px-6 py-3">Conversions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {popups.map((popup) => (
                      <tr key={popup.id} className="border-b last:border-0">
                        <td className="px-4 sm:px-6 py-4 font-medium text-sm">
                          {popup.title}
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-sm">
                          {popup.views}
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-sm">
                          {popup.conversions}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
