import { Box, CssBaseline, Typography, Link } from "@mui/material";
import { FaMoneyBillWave } from "react-icons/fa";

const Copyright = () => {
  return (
    <Typography variant="body2" align="center" sx={{ color: "#ffffff" }}>
      Copyright
      <Link color="inherit" href="https://github.com/ajayjainn"></Link>
      {new Date().getFullYear()}
    </Typography>
  );
};

const Footer = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: "0",
        width: "100%",
      }}
      className='footer'
    >
      <CssBaseline />
      <Box
        component="footer"
        sx={{
          py: 1,
          px: 1,
          mt: "auto",
          backgroundColor: "black",
        }}
      >
        <Typography
          variant="subtitle1"
          align="center"
          component="p"
          sx={{
            color: "#07f011",
          }}
        >
          <FaMoneyBillWave />
            MONEY is as important as oxygen
          <FaMoneyBillWave />
        </Typography>
        <Copyright/>
      </Box>
    </Box>
  );
};

export default Footer;
