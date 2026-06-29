import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

function MyPopups() {
  const [popups, setPopups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [codeFor, setCodeFor] = useState(null); // which popup's code is currently shown
  const [copied, setCopied] = useState(false);

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
      setError("Failed to load popups.");
    } finally {
      setLoading(false);
    }
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
      alert("Failed to delete popup.", err);
    }
  }

  function getEmbedCode(popupId) {
    const apiBase = import.meta.env.VITE_API_URL.replace("/api", "");
    return `<script src="${apiBase}/embed.js" data-popup-id="${popupId}"></script>`;
  }

  function handleCopy(popupId) {
    navigator.clipboard.writeText(getEmbedCode(popupId));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">
        Loading your popups...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">My Popups</h1>
            <p className="text-gray-600 text-sm mt-1">
              Manage all the popups you've created.
            </p>
          </div>
          <Link
            to="/create-popup"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            + New Popup
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg px-3 py-2 mb-4">
            {error}
          </div>
        )}

        {popups.length === 0 ? (
          <div className="bg-white border rounded-lg p-12 text-center text-gray-500">
            You haven't created any popups yet.
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

                {codeFor === popup.id && (
                  <div className="bg-gray-900 rounded-lg p-3 mb-4">
                    <code className="text-xs text-green-400 break-all">
                      {getEmbedCode(popup.id)}
                    </code>
                    <button
                      onClick={() => handleCopy(popup.id)}
                      className="mt-2 text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-md hover:bg-indigo-700"
                    >
                      {copied ? "Copied!" : "Copy code"}
                    </button>
                  </div>
                )}

                <div className="mt-auto flex gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setCodeFor(codeFor === popup.id ? null : popup.id)
                    }
                    className="flex-1 border rounded-lg py-2 text-sm hover:bg-gray-50"
                  >
                    {codeFor === popup.id ? "Hide Code" : "Get Code"}
                  </button>
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
