import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePaginationActions from "../../../components/TablePaginationActions";
import React, { useEffect } from "react";
import { Badge, Box, Checkbox, Container, CssBaseline, TableHead, Typography, styled } from "@mui/material";
import { useActivateUserMutation, useDeleteUserMutation, useGetAllUsersQuery } from "../usersApiSlice";
import ClearIcon from "@mui/icons-material/Clear";
import { MdOutlineBadge } from "react-icons/md";
import Spinner from "../../../components/Spinner";
import StyledDivider from "../../../components/StyledDivider";
import GroupIcon from "@mui/icons-material/Group";
import { useDeactivateUserMutation } from "../usersApiSlice";
import { toast } from "react-toastify";


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const UserListPage = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = React.useState([]);

  const { data, isLoading, isSuccess, error, isError } = useGetAllUsersQuery({
    page: page + 1,
    limit: rowsPerPage,
  });

  const [deactivateUser] = useDeactivateUserMutation()
  const [activateUser] = useActivateUserMutation()
  const [deleteUser] = useDeleteUserMutation()

  useEffect(() => {
    if (isSuccess) {
      setRows(data?.users || []);
    }
  }, [data, isSuccess]);

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

  const handleDeactivate = async (e,id) => {
    try{
      let result={}
      if(!e.target.checked){
        result = await deactivateUser(id).unwrap()
      }else{
        result = await activateUser(id).unwrap()
      }
      toast.success(result.message)
    }catch(err){
      toast.error(error)
    }
  }
  const handleDelete = async (id) => {
    try{
      const result = await deleteUser(id).unwrap()
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
      <Box
				sx={{
					display: "flex",
					flexDirection: "row",
				}}
			>
				<Typography variant="h4"> Total: </Typography>
				<Badge
					badgeContent={data?.count}
					color="primary"
					sx={{ marginTop: "3px", marginLeft: "5px" }}
				>
					<GroupIcon color="action" fontSize="large" />
				</Badge>
			</Box>
      {isLoading ? (
				<Spinner />
			) : (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell align="right">Username</StyledTableCell>
              <StyledTableCell align="right">Provider</StyledTableCell>
              <StyledTableCell align="right">Is Email Verifi</StyledTableCell>
              <StyledTableCell align="right">Roles</StyledTableCell>
              <StyledTableCell align="right">Active</StyledTableCell>
              <StyledTableCell align="right">Delete</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row">
                  {row.email}
                </TableCell>
                <TableCell style={{ width: 160 }} align="right">
                  {row.username}
                </TableCell>
                <TableCell style={{ width: 160 }} align="right">
                  {row.provider}
                </TableCell>
                <TableCell style={{ width: 160 }} align="right">
                  {row.isEmailVerified.toString()}
                </TableCell>

                <TableCell style={{ width: 160 }} align="right">
                  {row.roles.join(", ")}
                </TableCell>

                <TableCell style={{ width: 160 }} align="right">
                  {/* deactivate user account */}
                  <Box>
                    <Checkbox checked={row.active} onClick={(e)=>handleDeactivate(e,row.id)}/>
                  </Box>
                </TableCell>

                <TableCell style={{ width: 160 }} align="right">
                  {/* delete user account */}
                  <ClearIcon
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
                <TableCell colSpan={7} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                colSpan={7}
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

export default UserListPage;
