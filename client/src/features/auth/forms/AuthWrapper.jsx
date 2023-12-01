import { Box } from "@mui/material";

const AuthWrapper = ({ children }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        marginBottom: "5rem",
      }}
    >
      {children}
    </Box>
  );
}
export default AuthWrapper;