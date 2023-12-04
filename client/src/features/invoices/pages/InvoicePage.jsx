import CalendarMonth from "@mui/icons-material/CalendarMonth";
import NoteAdd from "@mui/icons-material/NoteAdd";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import EditIcon from "@mui/icons-material/Edit";
import AttachEmailIcon from "@mui/icons-material/AttachEmail";
import CircularProgress from "@mui/material/CircularProgress";
import {
  Paper,
  Box,
  Button,
  Container,
  CssBaseline,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Divider,
  Grid,
} from "@mui/material";
import { format } from "date-fns";

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../../../components/Spinner";
import StyledDivider from "../../../components/StyledDivider";
import StyledTableCell from "../../../components/StyledTableCell";
import StyledTableRow from "../../../components/StyledTableRow";
import {
  useGetInvoiceQuery,
  useEmailInvoiceMutation,
} from "../invoiceApiSlice";
import PaymentForm from "./PaymentForm";
import { toast } from "react-toastify";

const InvoicePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: doc, isLoading } = useGetInvoiceQuery(id);
  const [emailInvoice] = useEmailInvoiceMutation();
  const [sendMail, setSendMail] = useState(false);

  const goBack = () => navigate(-1);

  const invoice = doc?.invoice;

  const handleSendMail = async () => {
    setSendMail(true);
    try {
      const resp = await emailInvoice(id).unwrap();
      console.log(resp);
      toast.success(resp.message);
    } catch (err) {
      toast.error(err);
    } finally {
      setSendMail(false);
    }
  };

  return (
    <>
      <Container
        component="main"
        maxWidth="md"
        sx={{ mt: 15, mb: 5, padding: 3, border: "2px solid" }}
      >
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <NoteAdd sx={{ fontSize: 70 }} />
          <Typography variant="h3">INVOICE</Typography>

          <Button
            color="warning"
            size="small"
            variant="contained"
            onClick={goBack}
            sx={{ fontSize: "1rem", ml: "10px" }}
          >
            Go back
          </Button>
        </Box>

        <StyledDivider />

        <Grid container spacing={2} sx={{ mt: "30px" }}>
          <Grid item md={6}>
            <Button
              sx={{ borderRadius: "50px", cursor: "pointer" }}
              fullWidth
              variant="outlined"
              color="primary"
              size="small"
              startIcon={<EditIcon fontSize="large" />}
              onClick={() => navigate(`/invoices/${invoice.id}/edit`)}
            >
              <Typography variant="h5"> Edit Invoice</Typography>
            </Button>
          </Grid>

          <Grid item md={6}>
            {sendMail ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <Button
                sx={{
                  borderRadius: "50px",
                  cursor: "pointer",
                }}
                fullWidth
                variant="outlined"
                color="secondary"
                size="small"
                startIcon={<AttachEmailIcon />}
                onClick={handleSendMail}
              >
                <Typography variant="h5">Email Invoice to Customer</Typography>
              </Button>
            )}
          </Grid>
        </Grid>

        {isLoading ? (
          <Spinner />
        ) : (
          <Box
            sx={{
              mt: "1rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
            component="form"
            noValidate
            autoComplete="off"
          >
            <Container>
              <Grid
                container
                justifyContent="space-between"
                sx={{ marginTop: "30px" }}
              >
                <Grid item sx={{ width: "30%", marginBottom: "40px" }}>
                  <Typography
                    variant="h6"
                    style={{ color: "5a5a5a", pl: "3px" }}
                    textTransform="uppercase"
                    gutterBottom
                  >
                    From
                  </Typography>

                  <Typography variant="subtitle1" gutterBottom>
                    {invoice?.user?.buisnessName}
                    <br />
                    {invoice?.user?.email}
                    <br />
                    {invoice?.user?.phoneNo}
                    <br />
                    {invoice?.user?.address}
                  </Typography>
                </Grid>

                <Grid item sx={{ width: "30%", marginBottom: "40px" }}>
                  <Container>
                    <Typography
                      variant="h6"
                      style={{ color: "5a5a5a", pl: "3px" }}
                      textTransform="uppercase"
                      gutterBottom
                    >
                      For
                    </Typography>
                    {invoice?.customer && (
                      <>
                        <Typography variant="subtitle1" gutterBottom>
                          {invoice.customer.name}
                          <br />
                          {invoice.customer.email}
                          <br />
                          {invoice.customer.accountNo}
                          <br />
                          {invoice.customer.phoneNo}
                          <br />
                          {invoice.customer.address}
                          <br />
                        </Typography>
                      </>
                    )}
                  </Container>
                </Grid>

                <Grid item style={{ marginRight: 20, textAlign: "right" }}>
                  <Typography
                    sx={{ display: "flex",flexDirection:"column", alignItems: "flex-start" }}
                    mb="10px"
                    variant="body"
                    gutterBottom
                  >
                    
                    <Typography mb="2px" variant="h4">
                      Status
                    </Typography>
                    <Typography color="success" pl="5px" gutterBottom>
                      <b>{invoice.status}</b>
                    </Typography>

                  </Typography>

                  <Typography
                    sx={{ display: "flex" }}
                    mb="10px"
                    variant="body"
                    gutterBottom
                  >
                    <CalendarMonth sx={{ alignItems: "center" }} />
                    Date Of Issue
                    <Typography pl="5px" gutterBottom>
                      <b>
                        {format(new Date(invoice.createdAt), "do LLL yyyy")}
                      </b>
                    </Typography>
                  </Typography>

                  <Typography
                    sx={{ display: "flex" }}
                    mb="10px"
                    variant="body"
                    gutterBottom
                  >
                    <CalendarMonth sx={{ alignItems: "center" }} />
                    Due Date
                    <Typography pl="5px" gutterBottom>
                      <b>
                        {invoice.dueDate &&
                          format(new Date(invoice.dueDate), "do LLL yyyy")}
                      </b>
                    </Typography>
                  </Typography>
                </Grid>
              </Grid>

              <Divider />

              <div>
                <TableContainer component={Paper} sx={{ marginBottom: "50px" }}>
                  <Table sx={{ minWidth: 700 }}>
                    <TableHead>
                      <TableRow>
                        <StyledTableCell align="left">#</StyledTableCell>
                        <StyledTableCell align="left">Product</StyledTableCell>
                        <StyledTableCell align="left">
                          Unit Price
                        </StyledTableCell>
                        <StyledTableCell align="left">Quantiy</StyledTableCell>
                        <StyledTableCell align="left">
                          Amount(Rs)
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {invoice.items?.map((item, index) => (
                        <StyledTableRow key={index}>
                          <StyledTableCell align="left">
                            {index + 1}
                          </StyledTableCell>

                          <StyledTableCell align="left">
                            {item.name}
                          </StyledTableCell>

                          <StyledTableCell align="left">
                            {item.rate}
                          </StyledTableCell>

                          <StyledTableCell align="left">
                            {item.quantity}
                          </StyledTableCell>

                          <StyledTableCell align="left">
                            ₹{(item.rate * item.quantity).toLocaleString()}
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>

              <Box
                sx={{
                  marginLeft: "50%",
                  textAlign: "left",
                  borderBottom: "1px solid ",
                }}
              >
                <Typography
                  className="title"
                  sx={{ textAlign: "center", mb: "10px" }}
                  variant="h5"
                >
                  Cost Summary
                </Typography>

                <Divider />

                <div className="billItem">
                  <Typography variant="body2">Sub total:</Typography>
                  <h4>₹{invoice.subTotal.toFixed(2)}</h4>
                </div>
                <div className="billItem">
                  <Typography variant="body2">
                    Tax Amount (%{Number(invoice.tax.toFixed(2))}):
                  </Typography>
                  <h4>₹{invoice.tax * invoice.totalAmount * 0.01}</h4>
                </div>
                <div className="billItem">
                  <Typography variant="h6">Total:</Typography>
                  <h4>₹{invoice.totalAmount.toFixed(2)}</h4>
                </div>
                <div className="billItem">
                  <Typography variant="body2">Amount Paid:</Typography>
                  <h4>₹{invoice.totalAmountReceived.toFixed(2)}</h4>
                </div>
                <div className="billItem">
                  <Typography variant="h6">Balance:</Typography>
                  <h4>
                    ₹
                    {(
                      invoice.totalAmount - invoice.totalAmountReceived
                    ).toFixed(2)}
                  </h4>
                </div>
              </Box>

              <Box
                sx={{
                  marginTop: "30px",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Box item>
                  <Typography
                    sx={{ marginBottom: "4px" }}
                    variant="h4"
                    color="rgb(17, 65, 141)"
                  >
                    <u>Remarks</u>
                  </Typography>
                  <Typography>{invoice.remarks || "Not Available"}</Typography>
                </Box>
                <Box item>
                  <Typography
                    sx={{ marginBottom: "4px" }}
                    variant="h4"
                    color="rgb(17, 65, 141)"
                  >
                    <u>Terms & Conditions</u>
                  </Typography>
                  <Typography>{invoice.terms || "Not Available"}</Typography>
                </Box>
              </Box>
            </Container>
          </Box>
        )}
      </Container>

      <PaymentForm id={id} />
    </>
  );
};

export default InvoicePage;
