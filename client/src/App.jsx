import { CssBaseline } from "@mui/material";

import { ThemeProvider } from "@mui/material/styles";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import Footer from "./components/Footer.jsx";
import Layout from "./components/Layout.jsx";
import NotFound from "./components/NotFound.jsx";
import { customTheme } from "./customTheme.js";

import useTitle from "./hooks/useTitle";
import HomePage from "./pages/HomePage";

function App() {
  useTitle("Easy Invoice - Home");
  return (
    <>
      <ThemeProvider theme={customTheme}>
        <CssBaseline /> 
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
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
