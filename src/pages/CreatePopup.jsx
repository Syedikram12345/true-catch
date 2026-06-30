import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import api from "../api";

function CreatePopup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    buttonText: "Subscribe",
    delaySeconds: 5,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      await api.post(
        "/popups",
        {
          ...formData,
          delaySeconds: Number(formData.delaySeconds),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      navigate("/my-popups");
    } catch (err) {
      if (err.response?.data?.limitReached) {
        setError(
          "You've reached the free plan limit of 3 popups. Upgrade to Pro for unlimited popups.",
        );
      } else {
        setError(err.response?.data?.error || "Failed to create popup.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen overflow-hidden bg-gray-50 px-6 py-6 flex flex-col">
      <div className="max-w-5xl mx-auto w-full flex flex-col flex-1 min-h-0">
        <h1 className="text-2xl font-bold mb-1">Create a Popup</h1>
        <p className="text-gray-600 mb-6 text-sm">
          Set up a lead capture popup for your website.
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg px-3 py-2 mb-4 flex items-center justify-between">
            <span>{error}</span>
            {error.includes("limit") && (
              <Link
                to="/upgrade"
                className="ml-3 shrink-0 bg-indigo-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-indigo-700"
              >
                Upgrade →
              </Link>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0">
          {/* LEFT: Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow-sm border space-y-4 overflow-y-auto"
          >
            <div>
              <label className="block text-sm font-medium mb-1">
                Popup Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Join our newsletter"
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="e.g. Get weekly tips straight to your inbox."
                className="w-full border rounded-lg px-3 py-2"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Button Text
              </label>
              <input
                type="text"
                name="buttonText"
                value={formData.buttonText}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Show after how many seconds?
              </label>
              <input
                type="number"
                name="delaySeconds"
                value={formData.delaySeconds}
                onChange={handleChange}
                min="0"
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Popup"}
            </button>
          </form>

          {/* RIGHT: Live Preview */}
          <div className="flex flex-col min-h-0">
            <p className="text-sm font-medium text-gray-500 mb-2">
              Live Preview
            </p>
            <div className="bg-gray-200 rounded-lg flex-1 flex items-center justify-center relative overflow-hidden">
              <p className="text-gray-400 text-sm">Your website content</p>

              <div className="absolute bottom-6 right-6 left-6 sm:left-auto sm:w-80 bg-white rounded-lg shadow-xl p-5 border">
                <h3 className="font-bold text-lg mb-1">
                  {formData.title || "Your popup title"}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {formData.message || "Your popup message will appear here."}
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="you@example.com"
                    disabled
                    className="flex-1 border rounded-lg px-3 py-2 text-sm bg-gray-50"
                  />
                  <button
                    type="button"
                    disabled
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap"
                  >
                    {formData.buttonText || "Subscribe"}
                  </button>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              This popup will appear {formData.delaySeconds || 0} second
              {formData.delaySeconds === "1" ? "" : "s"} after a visitor lands
              on your page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatePopup;
