import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Home() {
  return (
    <div className="bg-white">
      <Navbar />

      {/* HERO */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-24 text-center">
        <span className="inline-block text-xs font-medium text-gray-500 border border-gray-200 rounded-full px-3 py-1 mb-6">
          Lead capture, made simple
        </span>
        <h1 className="text-4xl sm:text-5xl font-semibold text-gray-900 tracking-tight leading-tight">
          Turn website visitors
          <br />
          into real leads
        </h1>
        <p className="text-gray-500 text-lg mt-6 max-w-xl mx-auto">
          TrueCatch lets you build and embed smart popups in minutes — no code,
          no design work, just a script tag and you're live.
        </p>

        <div className="flex items-center justify-center gap-3 mt-9">
          <Link
            to="/signup"
            className="bg-gray-900 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-800"
          >
            Start for free
          </Link>
          <Link
            to="/login"
            className="text-gray-700 px-6 py-3 rounded-full text-sm font-medium border border-gray-200 hover:bg-gray-50"
          >
            Log in
          </Link>
        </div>

        <p className="text-xs text-gray-400 mt-5">
          No credit card required · Free to start
        </p>
      </section>

      {/* FEATURES */}
      <section className="max-w-5xl mx-auto px-6 py-20 border-t border-gray-100">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
          <div>
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mb-4 text-lg">
              ⚡
            </div>
            <h3 className="font-medium text-gray-900 mb-2">
              Live, instant preview
            </h3>
            <p className="text-sm text-gray-500">
              See exactly what your popup looks like as you build it — no
              guesswork, no surprises.
            </p>
          </div>

          <div>
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mb-4 text-lg">
              🔗
            </div>
            <h3 className="font-medium text-gray-900 mb-2">
              One script, anywhere
            </h3>
            <p className="text-sm text-gray-500">
              Copy a single line of code into your site. Update your popup
              anytime — no need to touch the code again.
            </p>
          </div>

          <div>
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mb-4 text-lg">
              📬
            </div>
            <h3 className="font-medium text-gray-900 mb-2">
              Leads, straight to your inbox
            </h3>
            <p className="text-sm text-gray-500">
              Every signup is emailed to you the moment it happens. No dashboard
              refreshing required.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-4xl mx-auto px-6 py-20 border-t border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-900 text-center mb-14">
          How it works
        </h2>

        <div className="space-y-10">
          <div className="flex gap-5">
            <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-medium shrink-0">
              1
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">
                Design your popup
              </h3>
              <p className="text-sm text-gray-500">
                Write your message, pick a button label, and set when it should
                appear — watch it update live as you type.
              </p>
            </div>
          </div>

          <div className="flex gap-5">
            <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-medium shrink-0">
              2
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">
                Copy your embed code
              </h3>
              <p className="text-sm text-gray-500">
                Every popup gets its own ready-made script tag. Paste it into
                your website — that's the entire setup.
              </p>
            </div>
          </div>

          <div className="flex gap-5">
            <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-medium shrink-0">
              3
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">
                Watch the leads come in
              </h3>
              <p className="text-sm text-gray-500">
                Visitors sign up right on your site. You get notified instantly,
                and every view and conversion is tracked for you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 py-24 text-center border-t border-gray-100">
        <h2 className="text-3xl font-semibold text-gray-900 mb-4">
          Ready to catch more leads?
        </h2>
        <p className="text-gray-500 mb-8">
          Set up your first popup in under five minutes.
        </p>
        <Link
          to="/signup"
          className="bg-gray-900 text-white px-7 py-3 rounded-full text-sm font-medium hover:bg-gray-800 inline-block"
        >
          Get started for free
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-100 py-8 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} TrueCatch. Built for real lead capture.
      </footer>
    </div>
  );
}

export default Home;
