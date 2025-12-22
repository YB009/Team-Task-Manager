import PrivateRoute from "./PrivateRoute";

<Route
  path="/dashboard"
  element={
    <PrivateRoute>
      <DashboardPage />
    </PrivateRoute>
  }
/>

<Route
  path="/projects"
  element={
    <PrivateRoute>
      <ProjectListPage />
    </PrivateRoute>
  }
/>
