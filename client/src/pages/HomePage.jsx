import { Box, Button, Grid, Link, styled, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import "../assets/styles/homepage.css";
import useAuthUser from "../hooks/useAuthUser";

const StyledTypography = styled(Typography)(({ theme }) => ({
  fontSize: "12rem",
  [theme.breakpoints.down("sm")]: {
    fontSize: "9rem",
  },
}));

const CreateAccountButton = styled(Button)({
  borderColor: "#000000",
  borderRadius: "25px",
  border: "3px solid",
  "&:hover": {
    borderColor: "#07f011",
    boxShadow: "none",
    border: "2px solid",
  },
});

const HomePage = () => {
  const { roles } = useAuthUser();
  return (
    <>
      <header className="masthead main-bg-image">
        <Grid>
          <Grid item md={12} lg={12} sm={6}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <StyledTypography
                variant="h1"
                align="center"
                sx={{ textTransform: "uppercase", mt: "13rem" }}
              >
                EASY Invoice
              </StyledTypography>

              <Typography
                align="center"
                variant="h4"
                component="div"
                gutterBottom
                sx={{ color: "rgba(255,255,255,0.6)" }}
              >
                Whatever business you run, Creating Invoices,Receipts and
                Quotations is made easy with our app.
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                mt: 5,
              }}
            >
              <CreateAccountButton
                variant="contained"
                color="success"
                size="large"
                sx={{ fontSize: "1.5em", borderRadius: "25px" }}
              >
                {!roles ? (
                  <Link
                    component={RouterLink}
                    to="/register"
                    sx={{
                      textDecoration: "none",
                      color: "white",
                      fontSize: "2rem",
                    }}
                  >
                    Create Account
                  </Link>
                ) : (
                  <Link
                    component={RouterLink}
                    to="/dashboard"
                    sx={{
                      textDecoration: "none",
                      color: "white",
                      fontSize: "2rem",
                    }}
                  >
                    Dashboard
                  </Link>
                )}
              </CreateAccountButton>
            </Box>
          </Grid>
        </Grid>
      </header>
    </>
  );
};

export default HomePage;
