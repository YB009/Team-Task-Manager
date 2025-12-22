import "./App.css";
import LoginPage from "./pages/auth/LoginPage.jsx";
import { useAuthContext } from "./context/AuthContext.jsx";

function App() {
  const { user, firebaseUser, loading, logout } = useAuthContext();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading auth...</p>
      </div>
    );
  }

  if (!firebaseUser) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
      <div className="bg-white shadow rounded-lg p-6 w-full max-w-lg">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          You are logged in
        </h1>
        <p className="text-gray-700">
          Firebase user: <strong>{firebaseUser.email}</strong>
        </p>
        {user && (
          <p className="text-gray-700 mt-2">
            Backend user: <strong>{user.email}</strong> (provider: {user.provider})
          </p>
        )}
        <button
          onClick={logout}
          className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}

export default App;
