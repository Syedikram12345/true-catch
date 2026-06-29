import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  // Get the logged-in user we saved during login
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // Fake popup data for now — we'll pull this from a backend later
  const popups = [
    { id: 1, name: "Newsletter Signup", views: 1240, conversions: 86 },
    { id: 2, name: "Exit Intent Offer", views: 540, conversions: 21 },
  ];

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="flex items-center justify-between px-8 py-4 bg-white border-b">
        <h1 className="text-xl font-bold text-indigo-600">TrueCatch</h1>

        <nav className="flex items-center gap-6 text-sm text-gray-600">
          <Link to="/dashboard" className="text-indigo-600 font-medium">
            Dashboard
          </Link>
          <Link to="/my-popups" className="hover:text-indigo-600">
            My Popups
          </Link>
          <Link to="/create-popup" className="hover:text-indigo-600">
            Create Popup
          </Link>

          <span className="text-gray-300">|</span>

          <span className="text-gray-700">
            Hi, <span className="font-medium">{user?.name || "there"}</span>
          </span>

          <button
            onClick={handleLogout}
            className="border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50"
          >
            Logout
          </button>
        </nav>
      </header>

      {/* Main content */}
      <main className="px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Overview</h2>
          <Link
            to="/create-popup"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            + New Popup
          </Link>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <p className="text-sm text-gray-500">Total Popups</p>
            <p className="text-3xl font-bold mt-1">{popups.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <p className="text-sm text-gray-500">Total Views</p>
            <p className="text-3xl font-bold mt-1">
              {popups.reduce((sum, p) => sum + p.views, 0)}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <p className="text-sm text-gray-500">Total Conversions</p>
            <p className="text-3xl font-bold mt-1">
              {popups.reduce((sum, p) => sum + p.conversions, 0)}
            </p>
          </div>
        </div>

        {/* Popup list */}
        <div className="bg-white rounded-lg shadow-sm border">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-sm text-gray-500">
                <th className="px-6 py-3">Popup Name</th>
                <th className="px-6 py-3">Views</th>
                <th className="px-6 py-3">Conversions</th>
              </tr>
            </thead>
            <tbody>
              {popups.map((popup) => (
                <tr key={popup.id} className="border-b last:border-0">
                  <td className="px-6 py-4 font-medium">{popup.name}</td>
                  <td className="px-6 py-4">{popup.views}</td>
                  <td className="px-6 py-4">{popup.conversions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
