import { useState } from "react";
import {
  auth,
  googleProvider,
  facebookProvider,
  githubProvider,
  twitterProvider,
} from "../../api/firebase";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState("login"); // "login" | "signup"

  const loginEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (mode === "signup") {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  const popupLogin = async (provider) => {
    setLoading(true);
    setError("");

    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 text-gray-900">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md animate-fadeIn">
        <h1 className="text-3xl font-semibold text-center mb-6 text-gray-900">
          Team Task Manager Login
        </h1>

        {error && (
          <div className="bg-red-100 text-red-600 px-3 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Email Login */}
        <form onSubmit={loginEmail} className="space-y-4 text-left">
          <label className="block text-sm font-medium text-gray-700">
            Email
            <input
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
              className="mt-1 w-full border rounded px-3 py-2 focus:ring focus:border-blue-400 bg-white text-gray-900 placeholder-gray-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Password
            <input
              type="password"
              placeholder="••••••••"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              required
              minLength={6}
              className="mt-1 w-full border rounded px-3 py-2 focus:ring focus:border-blue-400 bg-white text-gray-900 placeholder-gray-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
          >
            {loading
              ? "Loading..."
              : mode === "signup"
              ? "Create account"
              : "Login"}
          </button>
        </form>

        <div className="text-center text-sm text-gray-600 mt-3">
          {mode === "signup" ? "Already have an account?" : "New here?"}{" "}
          <button
            type="button"
            className="text-blue-600 hover:underline font-medium"
            onClick={() => setMode(mode === "signup" ? "login" : "signup")}
            disabled={loading}
          >
            {mode === "signup" ? "Switch to login" : "Create an account"}
          </button>
        </div>

        <div className="text-center text-gray-500 my-4">or</div>

        {/* OAuth Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => popupLogin(googleProvider)}
            className="w-full bg-white border shadow-sm hover:bg-gray-50 py-2 rounded flex items-center justify-center gap-2 transition"
          >
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" className="w-5 h-5" />
            Sign in with Google
          </button>

          <button
            onClick={() => popupLogin(facebookProvider)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded flex items-center justify-center gap-2 transition"
          >
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/facebook/facebook-original.svg" className="w-5 h-5" />
            Continue with Facebook
          </button>

          <button
            onClick={() => popupLogin(githubProvider)}
            className="w-full bg-black hover:bg-gray-800 text-white py-2 rounded flex items-center justify-center gap-2 transition"
          >
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" className="w-5 h-5" />
            Login with GitHub
          </button>

          <button
            onClick={() => popupLogin(twitterProvider)}
            className="w-full bg-sky-500 hover:bg-sky-600 text-white py-2 rounded flex items-center justify-center gap-2 transition"
          >
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/twitter/twitter-original.svg" className="w-5 h-5" />
            Sign in with Twitter (X)
          </button>
        </div>
      </div>
    </div>
  );
}
