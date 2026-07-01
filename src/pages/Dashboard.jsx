import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [popups, setPopups] = useState([]);
  const [toasters, setToasters] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [siteId, setSiteId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [plan, setPlan] = useState("free");

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [popupsRes, toastersRes, contactsRes, meRes] = await Promise.all([
        api.get("/popups", { headers }),
        api.get("/toasters", { headers }),
        api.get("/contacts", { headers }),
        api.get("/me", { headers }),
      ]);

      setPopups(popupsRes.data.popups);
      setToasters(toastersRes.data.toasters);
      setContacts(contactsRes.data.contacts);
      setSiteId(meRes.data.user.siteId);
      setPlan(meRes.data.user.plan);
    } catch (err) {
      console.error("Failed to load dashboard data", err);
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

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  const totalViews =
    popups.reduce((sum, p) => sum + p.views, 0) +
    toasters.reduce((sum, t) => sum + t.views, 0);

  const totalConversions = popups.reduce((sum, p) => sum + p.conversions, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 sm:px-8 py-4 bg-white border-b">
        <h1 className="text-lg sm:text-xl font-bold text-indigo-600">
          TrueCatch
        </h1>

        <nav className="flex items-center gap-3 sm:gap-5 text-sm text-gray-600">
          <Link
            to="/my-popups"
            className="hidden sm:inline hover:text-indigo-600"
          >
            Popups
          </Link>
          <Link
            to="/my-toasters"
            className="hidden sm:inline hover:text-indigo-600"
          >
            Toasters
          </Link>
          <Link
            to="/analytics"
            className="hidden sm:inline hover:text-indigo-600"
          >
            Analytics
          </Link>
          <Link
            to="/contacts"
            className="hidden sm:inline hover:text-indigo-600"
          >
            Contacts
          </Link>
          <Link
            to="/profile"
            className="hidden sm:inline hover:text-indigo-600"
          >
            Profile
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

      {/* Mobile quick links */}
      <div className="flex sm:hidden gap-4 px-4 py-3 bg-white border-b text-sm overflow-x-auto">
        <Link
          to="/my-popups"
          className="text-indigo-600 font-medium whitespace-nowrap"
        >
          Popups
        </Link>
        <Link
          to="/my-toasters"
          className="text-indigo-600 font-medium whitespace-nowrap"
        >
          Toasters
        </Link>
        <Link
          to="/analytics"
          className="text-indigo-600 font-medium whitespace-nowrap"
        >
          Analytics
        </Link>
        <Link
          to="/contacts"
          className="text-indigo-600 font-medium whitespace-nowrap"
        >
          Contacts
        </Link>
        <Link
          to="/profile"
          className="text-indigo-600 font-medium whitespace-nowrap"
        >
          Profile
        </Link>
      </div>

      <main className="px-4 sm:px-8 py-8 sm:py-10 max-w-6xl mx-auto">
        {loading ? (
          <p className="text-gray-500 text-sm">Loading dashboard...</p>
        ) : (
          <>
            {/* Install Script — prominent at the top */}
            {siteId && (
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5 sm:p-6 mb-8">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h2 className="font-semibold text-indigo-900">
                      Your Install Script
                    </h2>
                    <p className="text-sm text-indigo-700 mt-0.5">
                      Paste this once into your website's{" "}
                      <code className="bg-indigo-100 px-1 rounded">
                        {"</body>"}
                      </code>{" "}
                      tag. All your widgets load automatically.
                    </p>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="shrink-0 text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <div className="bg-gray-900 rounded-lg px-4 py-3">
                  <code className="text-xs text-green-400 break-all">
                    {getEmbedCode()}
                  </code>
                </div>
              </div>
            )}

            {/* SDK Usage */}
            <div className="bg-white border rounded-lg p-5 sm:p-6 mb-8">
              <h2 className="font-semibold text-gray-900 mb-1">
                Event Tracking SDK
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                After adding the install script, you can track any custom event
                from your website's JavaScript:
              </p>
              <div className="space-y-3">
                <div className="bg-gray-900 rounded-lg px-4 py-3">
                  <code className="text-xs text-green-400">
                    {`// Track any custom event`}
                    <br />
                    {`TrueCatch.track("clicked_pricing", { plan: "pro" })`}
                  </code>
                </div>
                <div className="bg-gray-900 rounded-lg px-4 py-3">
                  <code className="text-xs text-green-400">
                    {`// Identify a logged-in user`}
                    <br />
                    {`TrueCatch.identify("user@example.com", { name: "John" })`}
                  </code>
                </div>
                <div className="bg-gray-900 rounded-lg px-4 py-3">
                  <code className="text-xs text-green-400">
                    {`// Page views are tracked automatically`}
                    <br />
                    {`// TrueCatch.page() is called on every load`}
                  </code>
                </div>
              </div>
            </div>

            {plan === "free" && (
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-4 sm:p-5 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-white font-semibold">
                    You're on the Free plan
                  </p>
                  <p className="text-indigo-200 text-sm mt-0.5">
                    Upgrade to Pro for unlimited widgets, contacts, and
                    analytics.
                  </p>
                </div>
                <Link
                  to="/upgrade"
                  className="shrink-0 bg-white text-indigo-600 px-5 py-2 rounded-lg font-semibold text-sm hover:bg-indigo-50"
                >
                  Upgrade — ₹199/mo
                </Link>
              </div>
            )}

            {/* Overview header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h2 className="text-xl sm:text-2xl font-bold">Overview</h2>
              <div className="flex gap-3">
                <Link
                  to="/create-popup"
                  className="border border-indigo-600 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 text-sm text-center"
                >
                  + Popup
                </Link>
                <Link
                  to="/create-toaster"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm text-center"
                >
                  + Toaster
                </Link>
              </div>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
              <div className="bg-white p-5 rounded-lg shadow-sm border">
                <p className="text-xs text-gray-500 mb-1">Popups</p>
                <p className="text-2xl font-bold">{popups.length}</p>
              </div>
              <div className="bg-white p-5 rounded-lg shadow-sm border">
                <p className="text-xs text-gray-500 mb-1">Toasters</p>
                <p className="text-2xl font-bold">{toasters.length}</p>
              </div>
              <div className="bg-white p-5 rounded-lg shadow-sm border">
                <p className="text-xs text-gray-500 mb-1">Total Views</p>
                <p className="text-2xl font-bold">{totalViews}</p>
              </div>
              <div className="bg-white p-5 rounded-lg shadow-sm border">
                <p className="text-xs text-gray-500 mb-1">Contacts</p>
                <p className="text-2xl font-bold">{contacts.length}</p>
              </div>
            </div>

            {/* Widgets table */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden mb-8">
              <div className="px-5 py-4 border-b flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">All Widgets</h3>
              </div>
              {popups.length === 0 && toasters.length === 0 ? (
                <div className="p-10 text-center text-gray-500 text-sm">
                  No widgets yet —{" "}
                  <Link
                    to="/create-popup"
                    className="text-indigo-600 underline"
                  >
                    create your first popup
                  </Link>{" "}
                  or{" "}
                  <Link
                    to="/create-toaster"
                    className="text-indigo-600 underline"
                  >
                    announcement bar
                  </Link>
                  .
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[500px]">
                    <thead>
                      <tr className="border-b text-xs text-gray-500 uppercase tracking-wide">
                        <th className="px-5 py-3">Name</th>
                        <th className="px-5 py-3">Type</th>
                        <th className="px-5 py-3">Views</th>
                        <th className="px-5 py-3">Conversions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {popups.map((popup) => (
                        <tr
                          key={popup.id}
                          className="border-b last:border-0 hover:bg-gray-50"
                        >
                          <td className="px-5 py-4 font-medium text-sm">
                            {popup.title}
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
                              Popup
                            </span>
                          </td>
                          <td className="px-5 py-4 text-sm">{popup.views}</td>
                          <td className="px-5 py-4 text-sm">
                            {popup.conversions}
                          </td>
                        </tr>
                      ))}
                      {toasters.map((toaster) => (
                        <tr
                          key={toaster.id}
                          className="border-b last:border-0 hover:bg-gray-50"
                        >
                          <td className="px-5 py-4 font-medium text-sm">
                            {toaster.message.length > 40
                              ? toaster.message.slice(0, 40) + "..."
                              : toaster.message}
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                              Toaster
                            </span>
                          </td>
                          <td className="px-5 py-4 text-sm">{toaster.views}</td>
                          <td className="px-5 py-4 text-sm">—</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Recent contacts */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="px-5 py-4 border-b flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Recent Contacts</h3>
                <Link
                  to="/contacts"
                  className="text-sm text-indigo-600 hover:underline"
                >
                  View all
                </Link>
              </div>
              {contacts.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-sm">
                  No contacts yet — they appear when someone submits a popup.
                </div>
              ) : (
                <div className="divide-y">
                  {contacts.slice(0, 5).map((contact) => (
                    <div
                      key={contact.id}
                      className="px-5 py-3 flex items-center justify-between"
                    >
                      <p className="text-sm font-medium text-gray-800">
                        {contact.email}
                      </p>
                      <p className="text-xs text-gray-400">
                        {contact.events.length} event
                        {contact.events.length === 1 ? "" : "s"} ·{" "}
                        {new Date(contact.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
