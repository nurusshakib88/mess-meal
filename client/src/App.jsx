import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import RegisterManager from "./pages/RegisterManager";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import { UserRoleProvider } from "./contexts/UserRoleContext";
import Profile from "./pages/Profile";
import Layout from "./components/Layout";
import CreateOrder from "./pages/CreateOrder";
import AllOrder from "./pages/AllOrders";
import DepositRequest from "./pages/DepositRequest";
import AddExpense from "./pages/AddExpense";
import CreateUser from "./pages/CreateUser";
import CreateUserByAdmin from "./pages/CreateUserByAdmin";

function App() {
  return (
    <Router>
      <AuthProvider>
        <UserRoleProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />

            {/* Login Route */}
            <Route
              path="/login"
              element={
                <ProtectedRoute redirectTo="/dashboard">
                  <Login />
                </ProtectedRoute>
              }
            />

            {/* Register Manager Route */}
            <Route
              path="/register-manager"
              element={
                <ProtectedRoute redirectTo="/dashboard">
                  <RegisterManager />
                </ProtectedRoute>
              }
            />

            {/* Protected Dashboard Route */}
            <Route element={<AuthenticatedRoute redirectTo="/login" />}>
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/order" element={<CreateOrder />} />
                <Route path="/all-order" element={<AllOrder />} />
                <Route path="/deposit" element={<DepositRequest />} />
                <Route path="/expense" element={<AddExpense />} />
                <Route path="/add-member" element={<CreateUser />} />
                <Route path="/create-user" element={<CreateUserByAdmin />} />
              </Route>
            </Route>
          </Routes>
        </UserRoleProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
