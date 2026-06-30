import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [popups, setPopups] = useState([]);
  const [toasters, setToasters] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit form state
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState("");

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [meRes, popupsRes, toastersRes, contactsRes] = await Promise.all([
        api.get("/me", { headers }),
        api.get("/popups", { headers }),
        api.get("/toasters", { headers }),
        api.get("/contacts", { headers }),
      ]);

      setUser(meRes.data.user);
      setName(meRes.data.user.name);
      setPopups(popupsRes.data.popups);
      setToasters(toastersRes.data.toasters);
      setContacts(contactsRes.data.contacts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();
    setUpdateError("");
    setUpdateSuccess("");
    setUpdateLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await api.put(
        "/me",
        { name, currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setUser(response.data.user);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setUpdateSuccess("Profile updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setUpdateError(err.response?.data?.error || "Failed to update profile.");
    } finally {
      setUpdateLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">
        Loading profile...
      </div>
    );
  }

  const totalViews =
    popups.reduce((sum, p) => sum + p.views, 0) +
    toasters.reduce((sum, t) => sum + t.views, 0);

  const totalConversions = popups.reduce((sum, p) => sum + p.conversions, 0);

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-8 py-8 sm:py-10">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Profile</h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage your account details and view your stats.
            </p>
          </div>
          <Link
            to="/dashboard"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Dashboard
          </Link>
        </div>

        {/* Plan badge + account info */}
        <div className="bg-white rounded-xl border shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-lg font-bold text-gray-900">
                  {user?.name}
                </h2>
                {user?.plan === "pro" ? (
                  <span className="bg-indigo-600 text-white text-xs px-2.5 py-0.5 rounded-full font-semibold">
                    Pro ⚡
                  </span>
                ) : (
                  <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                    Free
                  </span>
                )}
              </div>
              <p className="text-gray-500 text-sm">{user?.email}</p>
              <p className="text-gray-400 text-xs mt-1">
                Member since{" "}
                {new Date(user?.createdAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            {user?.plan === "free" && (
              <Link
                to="/upgrade"
                className="shrink-0 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
              >
                Upgrade to Pro
              </Link>
            )}
          </div>
        </div>

        {/* Stats summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border shadow-sm p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{popups.length}</p>
            <p className="text-xs text-gray-500 mt-1">Popups</p>
          </div>
          <div className="bg-white rounded-xl border shadow-sm p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">
              {toasters.length}
            </p>
            <p className="text-xs text-gray-500 mt-1">Toasters</p>
          </div>
          <div className="bg-white rounded-xl border shadow-sm p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{totalViews}</p>
            <p className="text-xs text-gray-500 mt-1">Total Views</p>
          </div>
          <div className="bg-white rounded-xl border shadow-sm p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">
              {contacts.length}
            </p>
            <p className="text-xs text-gray-500 mt-1">Contacts</p>
          </div>
        </div>

        {/* Plan details */}
        <div className="bg-white rounded-xl border shadow-sm p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Plan Details</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-500">Current plan</span>
              <span className="font-medium capitalize">{user?.plan}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-500">Popups used</span>
              <span className="font-medium">
                {popups.length}
                {user?.plan === "free" ? " / 3" : " / ∞"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-500">Toasters used</span>
              <span className="font-medium">
                {toasters.length}
                {user?.plan === "free" ? " / 1" : " / ∞"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-500">Contacts</span>
              <span className="font-medium">
                {contacts.length}
                {user?.plan === "free" ? " / 100" : " / ∞"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-500">Total conversions</span>
              <span className="font-medium">{totalConversions}</span>
            </div>
          </div>
        </div>

        {/* Edit profile form */}
        <div className="bg-white rounded-xl border shadow-sm p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Edit Profile</h3>

          {updateError && (
            <div className="bg-red-50 text-red-600 text-sm rounded-lg px-3 py-2 mb-4">
              {updateError}
            </div>
          )}

          {updateSuccess && (
            <div className="bg-green-50 text-green-700 text-sm rounded-lg px-3 py-2 mb-4">
              {updateSuccess}
            </div>
          )}

          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={user?.email}
                disabled
                className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-1">
                Email cannot be changed.
              </p>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Change Password{" "}
                <span className="text-gray-400 font-normal">
                  (leave blank to keep current)
                </span>
              </p>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={updateLoading}
              className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 text-sm"
            >
              {updateLoading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>

        {/* Logout */}
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-1">Sign Out</h3>
          <p className="text-sm text-gray-500 mb-4">
            You'll be redirected to the login page.
          </p>
          <button
            onClick={handleLogout}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
