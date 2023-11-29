import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePaginationActions from "../../../components/TablePaginationActions";
import { Badge, Box, Button, Container, CssBaseline, Stack, TableHead, Typography, styled } from "@mui/material";
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { MdOutlineBadge, MdPersonAddAlt1 } from "react-icons/md";
import Spinner from "../../../components/Spinner";
import StyledDivider from "../../../components/StyledDivider";
import GroupIcon from "@mui/icons-material/Group";
import { toast } from "react-toastify";
import { useDeleteCustomerMutation, useGetAllCustomersQuery } from "../customersApiSlice";
import { useNavigate} from 'react-router-dom'
import { useState } from "react";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const CustomersListPage = () => {
  const navigate = useNavigate()
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);


  const { data, isLoading} = useGetAllCustomersQuery({
    page: page + 1,
    limit: rowsPerPage,
  });
  const [deleteCustomer] = useDeleteCustomerMutation()

  const rows = data?.customers || []
  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data?.count) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = async (id) => {
    try{
      const result = await deleteCustomer(id).unwrap()
      toast.success(result.message)
    }catch(err){
      toast.error(err)
    }
  }

  return (
    <Container component="main" maxWidth="lg" sx={{ mt: 10,mb:20 }}>
      <CssBaseline />

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <MdOutlineBadge className="auth-svg" />
        <Typography variant="h1"> Users</Typography>
      </Box>
      <StyledDivider />
      <Stack
				sx={{
					display: "flex",
					flexDirection: "row",
          justifyContent: 'space-between'
				}}
			>
        <Stack direction="row">

				<Typography variant="h4"> Total: </Typography>
				<Badge
					badgeContent={data?.count || 0}
					color="primary"
					sx={{ marginTop: "3px", marginLeft: "5px" }}
				>
					<GroupIcon color="action" fontSize="large" />
				</Badge>
        </Stack>

        <Button className="new-customer-btn" variant="contained" color='primary'
        startIcon={<MdPersonAddAlt1/>} onClick={()=>navigate('/customers/new')}
        >
          New Customer
        </Button>

			</Stack>


      {isLoading ? (
				<Spinner />
			) : (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 300 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">Name</StyledTableCell>
              <StyledTableCell align="center">Email</StyledTableCell>
              <StyledTableCell align="center">Address</StyledTableCell>
              <StyledTableCell align="center">Account Number</StyledTableCell>
              <StyledTableCell align="center">Delete</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell style={{ width: 160 }} align="center">
                  {row.name}
                </TableCell>
                <TableCell style={{ width: 160 }} align="center">
                  {row.email}
                </TableCell>

                <TableCell style={{ width: 160 }} align="center">
                  {row.address}
                </TableCell>

                <TableCell style={{ width: 160 }} align="center">
                  {row.accountNo}
                </TableCell>

                <TableCell style={{ width: 160 }} align="center">
                  {/* delete user account */}
                  <PersonRemoveIcon
                    sx={{ cursor: "pointer" }}
                    color="error"
                    fontSize="medium"
                    onClick={()=>handleDelete(row.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 75 * emptyRows }}>
                <TableCell colSpan={5} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                colSpan={5}
                count={data?.count || 0}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: {
                    "aria-label": "rows per page",
                  },
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>)}
    </Container>
  );
};

export default CustomersListPage;
