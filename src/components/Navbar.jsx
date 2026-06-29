import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 sm:px-10 py-5 max-w-6xl mx-auto">
      <Link to="/" className="text-xl font-semibold text-gray-900">
        TrueCatch
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900">
          Login
        </Link>
        <Link
          to="/signup"
          className="text-sm bg-gray-900 text-white px-4 py-2 rounded-full hover:bg-gray-800"
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
