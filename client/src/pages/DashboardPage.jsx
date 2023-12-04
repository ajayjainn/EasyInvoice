import Box from "@mui/material/Box";

import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import { useGetDashboardDataQuery } from "../features/users/usersApiSlice";
import Spinner from "../components/Spinner.jsx";
import StyledDivider from "../components/StyledDivider.jsx";
import { LuLayoutDashboard } from "react-icons/lu";

const DashboardCard = ({ title, data, link }) => {
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        minWidth: 300,
        border: "3px dotted black",
        display: "flex",
        mr: 2,
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <CardContent>
        <Typography textAlign="center" variant="h4" component="div">
          {title}
        </Typography>

        <Typography
          textAlign="center"
          color="text.secondary"
          variant="h3"
          component="div"
        >
          {data}
        </Typography>
        {link && (
          <CardActions>
            <Button
              onClick={() => navigate(link.link)}
              variant="contained"
              sx={{ margin: "auto" }}
              size="large"
            >
              {link.text}
            </Button>
          </CardActions>
        )}
      </CardContent>
    </Card>
  );
};

const DashboardPage = () => {
  const { data } = useGetDashboardDataQuery();

  if (!data) {
    return <Spinner />;
  }

  const boxStyle = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "left",
    marginLeft: "250px",
    mt: 10,
  };
  return (
    <>
      <Box
        sx={{
          mt: 10,
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "6rem",
        }}
      >
        <LuLayoutDashboard />
        <Typography pl="5px" sx={{ textAlign: "center" }} variant="h1">
          Dashboard
        </Typography>
      </Box>

      <StyledDivider />

      <Box sx={boxStyle}>
        <DashboardCard
          title="No of invoices"
          data={data.totalInvoices}
          link={{ text: "View All", link: "/invoices/" }}
        />
        <DashboardCard
          title="No of customers"
          data={data.totalCustomers}
          link={{ text: "View All", link: "/customers/" }}
        />
      </Box>

      <Box sx={boxStyle}>
        <DashboardCard title="Sales this month" data={`₹${data.totalSales}`} />
        <DashboardCard title="Amount Pending" data={`₹${data.amountPending}`} />
        <DashboardCard
          title="Amount Received"
          data={`₹${data.amountReceived}`}
        />
      </Box>
      <Box sx={boxStyle}>
        <DashboardCard title="Fully Paid Invoices" data={data.fullyPaid} />
        <DashboardCard title="UnPaid Invoices" data={data.unPaid} />
        <DashboardCard title="Overdue Invoices" data={data.overdue} />
      </Box>
    </>
  );
};

export default DashboardPage;
