import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function Upgrade() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser();
  }, []);

  async function fetchUser() {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data.user);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleUpgrade() {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      // Step 1: Create Razorpay order
      const orderRes = await api.post(
        "/payment/create-order",
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const { orderId, amount, currency } = orderRes.data;

      // Step 2: Open Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount,
        currency,
        name: "TrueCatch",
        description: "Pro Plan — ₹199/month",
        order_id: orderId,
        handler: async function (response) {
          // Step 3: Verify payment on our backend
          try {
            await api.post(
              "/payment/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              { headers: { Authorization: `Bearer ${token}` } },
            );

            alert("🎉 You're now on Pro! Welcome to TrueCatch Pro.");
            navigate("/dashboard");
          } catch (err) {
            setError("Payment verification failed. Contact support.");
          }
        },
        prefill: {
          email: user?.email || "",
        },
        theme: {
          color: "#4f46e5",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError("Failed to initiate payment. Try again.");
    } finally {
      setLoading(false);
    }
  }

  const isPro = user?.plan === "pro";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Upgrade to Pro
          </h1>
          <p className="text-gray-500">
            Unlock unlimited widgets, contacts, analytics, and no branding.
          </p>
        </div>

        {/* Plan comparison */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden mb-6">
          <div className="grid grid-cols-2 divide-x">
            {/* Free */}
            <div className="p-5">
              <p className="text-sm font-semibold text-gray-500 mb-3">Free</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✅ 3 popups</li>
                <li>✅ 1 toaster</li>
                <li>✅ 100 contacts</li>
                <li>✅ Email notifications</li>
                <li>❌ Analytics</li>
                <li>❌ No branding</li>
                <li>❌ Unlimited widgets</li>
              </ul>
              <p className="mt-4 font-bold text-gray-900">Free</p>
            </div>

            {/* Pro */}
            <div className="p-5 bg-indigo-50">
              <p className="text-sm font-semibold text-indigo-600 mb-3">Pro</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✅ Unlimited popups</li>
                <li>✅ Unlimited toasters</li>
                <li>✅ Unlimited contacts</li>
                <li>✅ Email notifications</li>
                <li>✅ Analytics</li>
                <li>✅ No "Powered by" branding</li>
                <li>✅ All future widgets</li>
              </ul>
              <p className="mt-4 font-bold text-indigo-700">₹199/month</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg px-3 py-2 mb-4">
            {error}
          </div>
        )}

        {isPro ? (
          <div className="bg-green-50 text-green-700 text-center rounded-xl p-4 font-medium">
            🎉 You're already on Pro!
          </div>
        ) : (
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 text-lg"
          >
            {loading ? "Opening payment..." : "Upgrade for ₹199/month"}
          </button>
        )}

        <p className="text-xs text-center text-gray-400 mt-4">
          Powered by Razorpay · UPI, Cards, Net Banking accepted
        </p>
      </div>
    </div>
  );
}

export default Upgrade;
