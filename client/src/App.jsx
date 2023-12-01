import { CssBaseline } from "@mui/material";

import { ThemeProvider } from "@mui/material/styles";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import Footer from "./components/Footer.jsx";
import Layout from "./components/Layout.jsx";
import NotFound from "./components/NotFound.jsx";
import { customTheme } from "./customTheme.js";

import useTitle from "./hooks/useTitle.jsx";
import HomePage from "./pages/HomePage.jsx";
import RegisterPage from './features/auth/pages/RegisterPage';
import VerifiedPage from "./features/auth/pages/VerifiedPage.jsx";
import LoginPage from "./features/auth/pages/LoginPage.jsx";
import Navbar from './components/navbar/index.jsx'
import { useSelector } from "react-redux";
import ResendEmailTokenPage from "./features/auth/pages/ResendEmailToken.jsx";
import PasswordResetRequestPage from "./features/auth/pages/PasswordResetRequestPage.jsx";
import PasswordResetPage from "./features/auth/pages/PasswordResetPage.jsx";
import Dashboard from './pages/DashboardPage.jsx'
import UserListPage from "./features/users/pages/UserListPage.jsx";
import AuthRequired from './components/AuthRequired.jsx'
import Roles from '../src/config/roles.js'
import ProfilePage from "./features/users/pages/ProfilePage.jsx";
import EditProfilePage from "./features/users/pages/EditProfilePage.jsx";
import CustomersListPage from "./features/customers/pages/CustomersListPage.jsx";
import NewCustomerPage from "./features/customers/pages/NewCustomerPage.jsx";
import InvoicePage from "./features/invoices/pages/InvoicePage.jsx";
import InvoiceCreateEditPage from "./features/invoices/pages/InvoiceCreateEditForm.jsx";


function App() {
  useTitle("Easy Invoice - Home");
  const {user} = useSelector((state=>state.auth))
  return (
    <>
      <ThemeProvider theme={customTheme}>
        <CssBaseline /> 
        {user && <Navbar/>  }
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth/verified" element={<VerifiedPage />} />
            <Route path="/resend_token" element={<ResendEmailTokenPage />} />
            <Route path="/reset_password_request" element={<PasswordResetRequestPage />} />
            <Route path="/auth/reset_password" element={<PasswordResetPage />} />

            <Route element={<AuthRequired allowedRoles={[Roles.User]}/>}>
              <Route path="/dashboard" element={<Dashboard/>} />
              <Route path="/profile" element={<ProfilePage/>} />
              <Route path="/profile/edit" element={<EditProfilePage/>} />
              <Route path="/customers" element={<CustomersListPage/>} />
              <Route path="/customers/new" element={<NewCustomerPage/>} />
              <Route path="/invoices" element={<InvoicePage/>} />
              <Route path="/invoices/new" element={<InvoiceCreateEditPage/>} />
              <Route path="/invoices/edit/:id" element={<InvoiceCreateEditPage/>} />
            </Route>

            <Route element={<AuthRequired allowedRoles={[Roles.Admin]}/>}>
              <Route path="/users" element={<UserListPage/>} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        <Footer/>
        <ToastContainer theme='dark'/>
      </ThemeProvider>
    </>
  );
}

export default App;
