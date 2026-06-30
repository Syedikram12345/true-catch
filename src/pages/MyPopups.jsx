import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

function MyPopups() {
  const [popups, setPopups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [siteId, setSiteId] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const token = localStorage.getItem("token");

      const [popupsRes, meRes] = await Promise.all([
        api.get("/popups", { headers: { Authorization: `Bearer ${token}` } }),
        api.get("/me", { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      setPopups(popupsRes.data.popups);
      setSiteId(meRes.data.user.siteId);
    } catch (err) {
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  }

  function getEmbedCode() {
    const apiBase = import.meta.env.VITE_API_URL.replace("/api", "");
    return `<script src="${apiBase}/embed.js" data-site-id="${siteId}"></script>`;
  }

  function handleCopy() {
    navigator.clipboard.writeText(getEmbedCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this popup?",
    );
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      await api.delete(`/popups/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPopups(popups.filter((popup) => popup.id !== id));
    } catch (err) {
      alert("Failed to delete popup.");
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
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">My Popups</h1>
            <p className="text-gray-600 text-sm mt-1">
              Manage your popups and grab your install script.
            </p>
          </div>
          <Link
            to="/create-popup"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm"
          >
            + New Popup
          </Link>
        </div>

        {/* Installation block */}
        {siteId && (
          <div className="bg-white border rounded-lg p-5 sm:p-6 mb-8">
            <h2 className="font-semibold text-gray-900 mb-1">
              Your install script
            </h2>
            <p className="text-sm text-gray-500 mb-3">
              Paste this once into your website's{" "}
              <code className="bg-gray-100 px-1 rounded">{"</body>"}</code> tag.
              All your popups load from it automatically.
            </p>
            <div className="bg-gray-900 rounded-lg p-3 mb-3">
              <code className="text-xs text-green-400 break-all">
                {getEmbedCode()}
              </code>
            </div>
            <button
              onClick={handleCopy}
              className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              {copied ? "Copied!" : "Copy install script"}
            </button>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg px-3 py-2 mb-6">
            {error}
          </div>
        )}

        {/* Popup cards */}
        {popups.length === 0 ? (
          <div className="bg-white border rounded-lg p-12 text-center text-gray-500 text-sm">
            You haven't created any popups yet.{" "}
            <Link to="/create-popup" className="text-indigo-600 underline">
              Create your first one
            </Link>
            .
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {popups.map((popup) => (
              <div
                key={popup.id}
                className="bg-white rounded-lg border shadow-sm p-6 flex flex-col"
              >
                <h3 className="font-bold text-lg mb-1">{popup.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{popup.message}</p>

                <div className="flex gap-6 text-sm text-gray-500 mb-4">
                  <span>👀 {popup.views} views</span>
                  <span>✅ {popup.conversions} conversions</span>
                </div>

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
                    onClick={() => handleDelete(popup.id)}
                    className="flex-1 border border-red-200 text-red-600 rounded-lg py-2 text-sm hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyPopups;
