import {
  Badge,
  Box,
  Button,
  Container,
  CssBaseline,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../../../components/Spinner";
import StyledTableCell from "../../../components/StyledTableCell";
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions";
import {
  useDeleteInvoiceMutation,
  useGetAllInvoicesQuery,
} from "../invoiceApiSlice";
import StyledDivider from "../../../components/StyledDivider";
import { FaFileInvoiceDollar } from "react-icons/fa6";
import { MdAssignmentAdd } from "react-icons/md";
import Paper from "@mui/material/Paper";
import { TiDocumentDelete } from "react-icons/ti";
import addBillSvg from "../../../assets/images/add_bill.svg";
import '../../../assets/styles/customer-button.css'

const InvoicePage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const { data, isLoading } = useGetAllInvoicesQuery({
    page: page + 1,
    limit: rowsPerPage,
  });
  const [deleteInvoice] = useDeleteInvoiceMutation();

  const rows = data?.invoices || [];

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
    try {
      const result = await deleteInvoice(id).unwrap();
      toast.success(result.message);
      navigate('/invoices')
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <Container component="main" maxWidth="lg" sx={{ mt: 10, mb: 20 }}>
      <CssBaseline />

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h1"> Invoices </Typography>
      </Box>
      <StyledDivider />
      <Stack
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Stack direction="row">
          <Typography variant="h4"> Total: </Typography>
          <Badge
            badgeContent={data?.count || 0}
            color="primary"
            sx={{ marginTop: "3px", marginLeft: "5px" }}
          >
            <FaFileInvoiceDollar size={40} color="action" fontSize="large" />
          </Badge>
        </Stack>

        <Button
          className="new-customer-btn"
          variant="contained"
          color="primary"
          startIcon={<MdAssignmentAdd />}
          onClick={() => navigate("/invoices/new")}
        >
          New Invoice
        </Button>
      </Stack>

      {isLoading ? (
        <Spinner />
      ) : rows?.length === 0 ? (
        <>
          <Typography variant="h3" sx={{ mt: 5 }}>
            No Invoices Added yet! Click on the button above to add a new
            invoice!
          </Typography>
          <img style={{display:"block", width:"60%", margin:"auto"}} src={addBillSvg} />
        </>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell align="right">Email</StyledTableCell>
                <StyledTableCell align="right">Status</StyledTableCell>
                <StyledTableCell align="right">Amount</StyledTableCell>
                <StyledTableCell align="right">Delete Invoice</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows?.map((row) => (
                <TableRow
                  onClick={() => navigate(`/invoices/${row.id}`)}
                  key={row.id}
                >
                  <TableCell style={{ width: 160 }}>
                    {row.customer?.name}
                  </TableCell>
                  <TableCell style={{ width: 160 }}>
                    {row.customer?.email}
                  </TableCell>

                  <TableCell style={{ width: 160 }}>{row.status}</TableCell>

                  <TableCell style={{ width: 160 }}>
                    {row.totalAmount}
                  </TableCell>

                  <TableCell style={{ width: 160 }} align="left">
                    {/* delete user account */}
                    <TiDocumentDelete
                      sx={{ cursor: "pointer" }}
                      color="error"
                      fontSize="medium"
                      size={40}
                      onClick={() => handleDelete(row.id)}
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
        </TableContainer>
      )}
    </Container>
  );
};

export default InvoicePage;
