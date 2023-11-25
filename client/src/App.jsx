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

function App() {
  useTitle("Easy Invoice - Home");
  return (
    <>
      <ThemeProvider theme={customTheme}>
        <CssBaseline /> 
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth/verified" element={<VerifiedPage />} />
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
