import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);

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
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl sm:text-2xl font-bold">Contacts</h1>
          <Link
            to="/dashboard"
            className="text-sm text-indigo-600 hover:underline"
          >
            ← Back to Dashboard
          </Link>
        </div>
        <p className="text-gray-600 text-sm mb-8">
          Every visitor who's interacted with your popups, unified into a single
          profile.
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg px-3 py-2 mb-6">
            {error}
          </div>
        )}

        {contacts.length === 0 ? (
          <div className="bg-white border rounded-lg p-10 text-center text-gray-500 text-sm">
            No contacts yet. Once someone submits one of your popups, they'll
            show up here.
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border divide-y">
            {contacts.map((contact) => {
              const isExpanded = expandedId === contact.id;
              return (
                <div key={contact.id} className="p-4 sm:p-5">
                  <button
                    onClick={() =>
                      setExpandedId(isExpanded ? null : contact.id)
                    }
                    className="w-full flex items-center justify-between text-left"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {contact.email}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {contact.events.length} event
                        {contact.events.length === 1 ? "" : "s"} · First seen{" "}
                        {new Date(contact.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-gray-400 text-sm">
                      {isExpanded ? "Hide" : "View"} timeline
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="mt-4 pl-4 border-l-2 border-gray-100 space-y-3">
                      {contact.events.map((event) => (
                        <div key={event.id} className="text-sm">
                          <p className="font-medium text-gray-800">
                            {formatEventType(event.type)}
                          </p>
                          {event.metadata?.popupTitle && (
                            <p className="text-gray-500 text-xs">
                              via "{event.metadata.popupTitle}"
                            </p>
                          )}
                          <p className="text-gray-400 text-xs">
                            {new Date(event.createdAt).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Contacts;
