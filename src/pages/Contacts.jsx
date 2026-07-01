import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchContacts();
  }, []);

  async function fetchContacts() {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/contacts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContacts(response.data.contacts);
    } catch (err) {
      setError("Failed to load contacts.");
    } finally {
      setLoading(false);
    }
  }

  function formatEventType(type) {
    return type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  }

  function getEventIcon(type) {
    if (type.includes("popup")) return "🪟";
    if (type.includes("toaster")) return "🍞";
    if (type.includes("page_view")) return "📄";
    if (type.includes("identify")) return "👤";
    if (type.includes("cart")) return "🛒";
    if (type.includes("video")) return "🎥";
    if (type.includes("pricing")) return "💰";
    if (type.includes("click")) return "👆";
    return "⚡";
  }

  const filtered = contacts.filter((c) =>
    c.email.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">
        Loading contacts...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-8 py-8 sm:py-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl sm:text-2xl font-bold">Contacts</h1>
          <Link
            to="/dashboard"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Dashboard
          </Link>
        </div>
        <p className="text-gray-500 text-sm mb-6">
          Every visitor who's interacted with your widgets, unified into a
          single profile.
        </p>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm mb-6 bg-white"
        />

        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg px-3 py-2 mb-6">
            {error}
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="bg-white border rounded-lg p-10 text-center text-gray-500 text-sm">
            {contacts.length === 0
              ? "No contacts yet. Once someone submits one of your popups, they'll show up here."
              : "No contacts match your search."}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border divide-y">
            {filtered.map((contact) => {
              const isExpanded = expandedId === contact.id;
              return (
                <div key={contact.id}>
                  {/* Contact row */}
                  <button
                    onClick={() =>
                      setExpandedId(isExpanded ? null : contact.id)
                    }
                    className="w-full flex items-start justify-between text-left px-5 py-4 hover:bg-gray-50"
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
                        {contact.email[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {contact.email}
                        </p>
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                          <span className="text-xs text-gray-400">
                            {contact.events.length} event
                            {contact.events.length === 1 ? "" : "s"}
                          </span>
                          {contact.device && (
                            <span className="text-xs text-gray-400">
                              {contact.device === "mobile"
                                ? "📱"
                                : contact.device === "tablet"
                                  ? "📟"
                                  : "💻"}{" "}
                              {contact.device}
                            </span>
                          )}
                          {contact.browser && (
                            <span className="text-xs text-gray-400">
                              🌐 {contact.browser}
                            </span>
                          )}
                          {contact.os && (
                            <span className="text-xs text-gray-400">
                              🖥 {contact.os}
                            </span>
                          )}
                          {(contact.city || contact.country) && (
                            <span className="text-xs text-gray-400">
                              📍 {contact.city ? `${contact.city}, ` : ""}
                              {contact.country}
                            </span>
                          )}
                          {contact.pageUrl && (
                            <span className="text-xs text-gray-400 max-w-xs truncate">
                              🔗 {contact.pageUrl}
                            </span>
                          )}
                          <span className="text-xs text-gray-400">
                            First seen{" "}
                            {new Date(contact.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 shrink-0 mt-1">
                      {isExpanded ? "▲ Hide" : "▼ Timeline"}
                    </span>
                  </button>

                  {/* Event timeline */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1">
                      <div className="ml-12 border-l-2 border-gray-100 pl-4 space-y-4">
                        {contact.events.length === 0 ? (
                          <p className="text-sm text-gray-400">
                            No events yet.
                          </p>
                        ) : (
                          contact.events.map((event) => (
                            <div key={event.id} className="relative">
                              <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-indigo-200 border-2 border-indigo-400" />
                              <div className="bg-gray-50 rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-sm">
                                    {getEventIcon(event.type)}
                                  </span>
                                  <p className="text-sm font-medium text-gray-800">
                                    {formatEventType(event.type)}
                                  </p>
                                </div>
                                {event.metadata &&
                                  Object.keys(event.metadata).length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-1">
                                      {Object.entries(event.metadata).map(
                                        ([key, val]) => (
                                          <span
                                            key={key}
                                            className="text-xs bg-white border rounded px-2 py-0.5 text-gray-500"
                                          >
                                            {key}: {String(val)}
                                          </span>
                                        ),
                                      )}
                                    </div>
                                  )}
                                <p className="text-xs text-gray-400 mt-1.5">
                                  {new Date(event.createdAt).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Total count */}
        {contacts.length > 0 && (
          <p className="text-xs text-gray-400 text-center mt-4">
            {filtered.length} of {contacts.length} contacts
          </p>
        )}
      </div>
    </div>
  );
}

export default Contacts;
