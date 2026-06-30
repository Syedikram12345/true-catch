import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function CreateToaster() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    message: "",
    ctaText: "",
    ctaUrl: "",
    bgColor: "#111827",
    triggerType: "immediate",
    delaySeconds: 0,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      await api.post("/toasters", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/my-toasters");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create toaster.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen overflow-hidden bg-gray-50 px-6 py-6 flex flex-col">
      <div className="max-w-5xl mx-auto w-full flex flex-col flex-1 min-h-0">
        <h1 className="text-2xl font-bold mb-1">Create an Announcement Bar</h1>
        <p className="text-gray-600 mb-6 text-sm">
          A full-width bar that appears at the top of your site.
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg px-3 py-2 mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0">
          {/* LEFT: Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow-sm border space-y-4 overflow-y-auto"
          >
            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <input
                type="text"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="e.g. 🔥 Sale ends tonight! Use code SAVE20"
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                CTA Button Text{" "}
                <span className="text-gray-400">(optional)</span>
              </label>
              <input
                type="text"
                name="ctaText"
                value={formData.ctaText}
                onChange={handleChange}
                placeholder="e.g. Shop Now"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                CTA Button URL <span className="text-gray-400">(optional)</span>
              </label>
              <input
                type="url"
                name="ctaUrl"
                value={formData.ctaUrl}
                onChange={handleChange}
                placeholder="https://yoursite.com/sale"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Background Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  name="bgColor"
                  value={formData.bgColor}
                  onChange={handleChange}
                  className="w-10 h-10 rounded cursor-pointer border"
                />
                <span className="text-sm text-gray-500">
                  {formData.bgColor}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                When should it appear?
              </label>
              <select
                name="triggerType"
                value={formData.triggerType}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="immediate">Immediately on page load</option>
                <option value="delay">After a delay</option>
              </select>
            </div>

            {formData.triggerType === "delay" && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Show after how many seconds?
                </label>
                <input
                  type="number"
                  name="delaySeconds"
                  value={formData.delaySeconds}
                  onChange={handleChange}
                  min="1"
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Announcement Bar"}
            </button>
          </form>

          {/* RIGHT: Live Preview */}
          <div className="flex flex-col min-h-0">
            <p className="text-sm font-medium text-gray-500 mb-2">
              Live Preview
            </p>
            <div className="bg-gray-100 rounded-lg flex-1 relative overflow-hidden border">
              {/* Toaster preview */}
              <div
                style={{ background: formData.bgColor }}
                className="absolute top-0 left-0 right-0 flex items-center justify-center gap-3 px-4 py-2.5"
              >
                <span className="text-white text-sm">
                  {formData.message || "Your announcement message here"}
                </span>
                {formData.ctaText && (
                  <span
                    style={{ color: formData.bgColor }}
                    className="bg-white px-3 py-0.5 rounded-full text-xs font-semibold"
                  >
                    {formData.ctaText}
                  </span>
                )}
                <span className="text-white opacity-60 text-base ml-auto">
                  ✕
                </span>
              </div>

              {/* Fake website content below */}
              <div className="pt-12 px-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mt-4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-full mb-2" />
                <div className="h-3 bg-gray-200 rounded w-5/6" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {formData.triggerType === "immediate"
                ? "Appears immediately when a visitor loads your page."
                : `Appears after ${formData.delaySeconds || 0} seconds.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateToaster;
