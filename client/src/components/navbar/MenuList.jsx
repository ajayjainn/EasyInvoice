import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  styled,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import TimelineIcon from "@mui/icons-material/Timeline";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import DescriptionIcon from "@mui/icons-material/Description";
import useAuthUser from "../../hooks/useAuthUser";

const StyledList = styled(List)({
  "&:hover": {
    backgroundColor: "#555a64",
  },
});

const StyledSideMenuDivider = styled(Divider)({
  height: "2px",
  borderColor: "#ffffff63",
});

const MenuList = () => {
  const navigate = useNavigate();

  const { isAdmin } = useAuthUser();

  return (

      <Box>
        <StyledList>
				<Tooltip title={<h1>Profile</h1>} placement="right">
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate("/profile")}>
              <ListItemIcon>
                <ManageAccountsIcon sx={{ fontSize: 40 }} color="green" />
              </ListItemIcon>
              <ListItemText primary="Manage Profile" />
            </ListItemButton>
          </ListItem>
					</Tooltip>
        </StyledList>
        <StyledSideMenuDivider />

        <StyledList>
          <Tooltip title={<h1>Dashboard</h1>} placement="right">
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate("/dashboard")}>
                <ListItemIcon>
                  <TimelineIcon sx={{ fontSize: 40 }} color="indigo" />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItemButton>
            </ListItem>
          </Tooltip>
        </StyledList>
        <StyledSideMenuDivider />

        <StyledList>
				<Tooltip title={<h1>Invoices</h1>} placement="right">
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate("/invoices")}>
              <ListItemIcon>
                <DescriptionIcon sx={{ fontSize: 40 }} color="orange" />
              </ListItemIcon>
              <ListItemText primary="Invoices" />
            </ListItemButton>
          </ListItem>
					</Tooltip>
        </StyledList>
        <StyledSideMenuDivider />

        <StyledList>
				<Tooltip title={<h1>Customers</h1>} placement="right">
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate("/customers")}>
              <ListItemIcon>
                <PeopleAltOutlinedIcon sx={{ fontSize: 40 }} color="blue" />
              </ListItemIcon>
              <ListItemText primary="Customers" />
            </ListItemButton>
          </ListItem>
					</Tooltip>
        </StyledList>
        <StyledSideMenuDivider />

        {isAdmin && (
          <StyledList>
						<Tooltip title={<h1>Admin Panel</h1>} placement="right">
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate("/users")}>
                <ListItemIcon>
                  <AdminPanelSettingsIcon
                    sx={{ fontSize: 40 }}
                    color="yellow"
                  />
                </ListItemIcon>
                <ListItemText primary="Admin Panel" />
              </ListItemButton>
            </ListItem>
						</Tooltip>
          </StyledList>
        )}
      </Box>
  );
};

export default MenuList;
