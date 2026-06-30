import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

function MyToasters() {
  const [toasters, setToasters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchToasters();
  }, []);

  async function fetchToasters() {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/toasters", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setToasters(response.data.toasters);
    } catch (err) {
      setError("Failed to load toasters.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm("Delete this announcement bar?");
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      await api.delete(`/toasters/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setToasters(toasters.filter((t) => t.id !== id));
    } catch (err) {
      alert("Failed to delete.");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 py-8 sm:py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Announcement Bars</h1>
            <p className="text-gray-600 text-sm mt-1">
              Manage your top announcement bars.
            </p>
          </div>
          <Link
            to="/create-toaster"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm"
          >
            + New Bar
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg px-3 py-2 mb-6">
            {error}
          </div>
        )}

        {toasters.length === 0 ? (
          <div className="bg-white border rounded-lg p-12 text-center text-gray-500 text-sm">
            No announcement bars yet.{" "}
            <Link to="/create-toaster" className="text-indigo-600 underline">
              Create your first one
            </Link>
            .
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {toasters.map((toaster) => (
              <div
                key={toaster.id}
                className="bg-white rounded-lg border shadow-sm overflow-hidden flex flex-col"
              >
                {/* Color preview strip */}
                <div
                  style={{ background: toaster.bgColor }}
                  className="h-2 w-full"
                />
                <div className="p-5 flex flex-col flex-1">
                  <p className="font-medium text-gray-900 mb-1">
                    {toaster.message}
                  </p>
                  {toaster.ctaText && (
                    <p className="text-xs text-gray-500 mb-1">
                      CTA: {toaster.ctaText} → {toaster.ctaUrl}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mb-4">
                    {toaster.triggerType === "immediate"
                      ? "Shows immediately"
                      : `Shows after ${toaster.delaySeconds}s`}{" "}
                    · 👀 {toaster.views} views
                  </p>

                  <div className="mt-auto flex gap-3">
                    <button
                      type="button"
                      onClick={() => alert("Edit coming soon!")}
                      className="flex-1 border rounded-lg py-2 text-sm hover:bg-gray-50"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(toaster.id)}
                      className="flex-1 border border-red-200 text-red-600 rounded-lg py-2 text-sm hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyToasters;
