import CalendarMonth from "@mui/icons-material/CalendarMonth";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import NoteAdd from "@mui/icons-material/NoteAdd";
import NoteAddCircleOutlined from "@mui/icons-material/AddCircleOutline";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import { produce } from "immer";
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
  Autocomplete,
  TextField,
  Chip,
  Input,
} from "@mui/material";
import { format, add } from "date-fns";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../../../components/Spinner";
import StyledDivider from "../../../components/StyledDivider";
import StyledTableCell from "../../../components/StyledTableCell";
import StyledTableRow from "../../../components/StyledTableRow";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  useGetInvoiceQuery,
  useCreateInvoiceMutation,
  useUpdateInvoiceMutation,
} from "../invoiceApiSlice";
import { useGetAllCustomersQuery } from "../../customers/customersApiSlice";
import { itemsInitialState } from "./initalState";
import { toast } from "react-toastify";

const InvoiceCreateEditForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: customers } = useGetAllCustomersQuery({ page: 1, limit: -1 });
  const { data: invoice } = useGetInvoiceQuery(id);

  const [createInvoice, { isLoading }] = useCreateInvoiceMutation();
  const [updateInvoice, { isLoading: updateInvoiceLoading }] =
    useUpdateInvoiceMutation();

  const goBack = () => navigate(-1);

  const [itemsData, setItemsData] = useState(itemsInitialState);
  const [tax, setTax] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [status, setStatus] = useState("NOT PAID");
  const [customer, setCustomer] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [terms, setTerms] = useState('');

  const doc = invoice?.invoice;

  const today = new Date();
  const [dueDate, setDueDate] = useState(add(today, { days: 7 }));

  useEffect(() => {
    if (doc) {
      setItemsData(doc.items);
      setTax(doc.tax);
      setSubTotal(doc.subTotal);
      setTotalAmount(doc.totalAmount);
      setStatus(doc.status);
      setCustomer(doc.customer);
      setRemarks(doc.remarks);
      setTerms(doc.terms);
      setDueDate(new Date(doc.dueDate));
    }
  }, [doc]);

  const handleAddItem = (e) => {
    e.preventDefault();
    setItemsData(
      produce(itemsData, (draft) => {
        draft.push({
          name: "",
          rate: 0,
          quantity: 0,
        });
      }),
    );
  };

  const handleCreateUpdateInvoice = async (e) => {
    e.preventDefault();

    const dataToSend = {
      status,
      tax,
      subTotal,
      totalAmount,
      items: itemsData,
      customer: customer.id,
      terms: terms,
      remarks: remarks,
      dueDate: dueDate,
    };

    try {
      let response = null;
      if (doc) {
        response = await updateInvoice({
          id: doc.id,
          data: dataToSend,
        }).unwrap();
      } else {
        response = await createInvoice(dataToSend).unwrap();
      }
      toast.success(response?.message);
      goBack()
    } catch (err) {
      console.log(err.data.message);
      toast.error(err.data.message);
    }
  };

  //subtotal
  useEffect(() => {
    setSubTotal(
      itemsData.reduce((total, item) => total + item.rate * item.quantity, 0),
    );
  }, [itemsData]);

  //Total
  useEffect(() => {
    const taxValue = subTotal * 0.01 * tax;
    setTotalAmount(subTotal + taxValue);
    setTaxAmount(taxValue);
  }, [subTotal, tax]);

  return (
    <Container
      component="main"
      maxWidth="md"
      sx={{ mt: 15, mb: 20, padding: 3, border: "2px solid" }}
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
        <Typography variant="h3">Create Invoice</Typography>

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
      

      {isLoading || updateInvoiceLoading ? (
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
          onSubmit={handleCreateUpdateInvoice}
        >
          <Container>
            <Grid
              container
              justifyContent="space-between"
              sx={{ marginTop: "30px" }}
            >
              <Grid item sx={{ width: "50%", marginBottom: "40px" }}>
                <Container>
                  <Typography
                    variant="h6"
                    style={{ color: "5a5a5a", pl: "3px" }}
                    textTransform="uppercase"
                    gutterBottom
                  >
                    Send To
                  </Typography>
                  {customer ? (
                    <>
                      <Typography variant="subtitle1" gutterBottom>
                        <b>Name: </b> {customer.name}
                        <br />
                        <b>Email: </b> {customer.email}
                        <br />
                        <b>Account No: </b> {customer.accountNo}
                        <br />
                        <b>Phone No: </b> {customer.phoneNo}
                        <br />
                        <b>Address: </b> {customer.address}
                        <br />
                      </Typography>
                      <Button
                        sx={{ textTransform: "none" }}
                        color="warning"
                        size="large"
                        onClick={() => setCustomer(null)}
                      >
                        <ChangeCircleIcon />
                        Choose another Customer
                      </Button>
                    </>
                  ) : (
                    <>
                      {customers?.customers ? (
                        <Autocomplete
                          disablePortal
                          id="combo-box-demo"
                          options={customers?.customers || []}
                          sx={{ width: 300 }}
                          getOptionLabel={(option) => option.name}
                          renderInput={(params) => (
                            <TextField {...params} label="Select A Customer" />
                          )}
                          onChange={(e, v) => setCustomer(v)}
                        />
                      ) : (
                        <>
                          <Typography variant="subtitle1" gutterBottom>
                            <b>No Customer Found</b>
                            <br />
                            <Chip
                              icon={<NoteAddCircleOutlined />}
                              label="Add a Customer"
                              color="primary"
                              onClick={() => navigate("/customers/new")}
                            />
                          </Typography>
                        </>
                      )}
                    </>
                  )}
                </Container>
              </Grid>

              <Grid item style={{ marginRight: 20, textAlign: "right" }}>
                <Typography
                  sx={{ display: "flex" }}
                  mb="10px"
                  variant="body"
                  gutterBottom
                >
                  <CalendarMonth sx={{ alignItems: "center" }} />
                  Date Of Issue
                  <Typography pl="5px" gutterBottom>
                    <b>{format(today, "do LLL yyyy")}</b>
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
                    <b>{dueDate && format(dueDate, "do LLL yyyy")}</b>
                  </Typography>
                </Typography>
              </Grid>
            </Grid>

            <Divider />

            <div>
              <TableContainer component={Paper} sx={{ marginBottom: "100px" }}>
                <Table sx={{ minWidth: 700 }}>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="left">#</StyledTableCell>
                      <StyledTableCell align="left">Product</StyledTableCell>
                      <StyledTableCell align="left">Unit Price</StyledTableCell>
                      <StyledTableCell align="left">Quantiy</StyledTableCell>
                      <StyledTableCell align="left">Amount(Rs)</StyledTableCell>
                      <StyledTableCell align="left">Delete</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {itemsData?.map((item, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell align="left">
                          {index + 1}
                        </StyledTableCell>

                        <StyledTableCell align="left">
                          <Input
                            value={item.name}
                            onChange={(e) =>
                              setItemsData(
                                produce(itemsData, (draft) => {
                                  draft[index].name = e.target.value;
                                }),
                              )
                            }
                            placeholder="Name"
                          />
                        </StyledTableCell>

                        <StyledTableCell align="left">
                          <Input
                            value={item.rate}
                            onChange={(e) =>
                              setItemsData(
                                produce(itemsData, (draft) => {
                                  draft[index].rate = e.target.value;
                                }),
                              )
                            }
                            placeholder="Unit Price"
                          />
                        </StyledTableCell>

                        <StyledTableCell align="left">
                          <Input
                            value={item.quantity}
                            onChange={(e) =>
                              setItemsData(
                                produce(itemsData, (draft) => {
                                  draft[index].quantity = e.target.value;
                                }),
                              )
                            }
                            placeholder="Quantity"
                          />
                        </StyledTableCell>

                        <StyledTableCell align="left">
                          ₹{(item.rate * item.quantity).toLocaleString()}
                        </StyledTableCell>

                        <StyledTableCell align="left">
                          <DeleteIcon
                            onClick={() => {
                              setItemsData(
                                produce(itemsData, (draft) => {
                                  draft.splice(index, 1);
                                }),
                              );
                            }}
                            sx={{ cursor: "pointer" }}
                          />
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Button
                startIcon={<NoteAdd />}
                variant="outlined"
                onClick={handleAddItem}
              >
                New Item
              </Button>
            </div>

            <Box
              sx={{
                marginLeft: "50%",
                textAlign: "left",
                borderBottom: "1px solid ",
                marginBottom:"50px"
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
                <Typography variant="body1">Sub total:</Typography>
                <h4>₹{subTotal.toFixed(2)}</h4>
              </div>
              <div className="billItem">
                <Typography variant="body1">Tax Amount:</Typography>
                <h4>₹{taxAmount}</h4>
              </div>
              <div className="billItem">
                <Typography variant="h5">Total:</Typography>
                <h4>₹{totalAmount.toLocaleString()}</h4>
              </div>
            </Box>

            <Grid container>
              <Grid item>
                <TextField
                  sx={{ marginRight: "20px" }}
                  type="number"
                  variant="outlined"
                  value={tax==0?'': tax}
                  label="Tax(%)"
                  placeholder="Tax"
                  onChange={(e) => setTax(Number(e.target.value))}
                />
              </Grid>

              <Grid item>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    format="dd.MM.yyyy"
                    label="Set Due Date"
                    value={dueDate}
                    onChange={(date) => {
                      setDueDate(date);
                    }}
                    minDate={today}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>

            <Box
              sx={{
                marginTop: "30px",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Box item>
                <Typography sx={{marginBottom:'4px'}} variant="h4" color="rgb(17, 65, 141)">
                  <u>Remarks</u>
                </Typography>
                <TextField
                  id="outlined-multiline-static"
                  label="Remark"
                  multiline
                  rows={3}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Add a remark"
                />
              </Box>
              <Box item>
                <Typography sx={{marginBottom:'4px'}} variant="h4" color="rgb(17, 65, 141)">
                  <u>Terms & Conditions</u>
                </Typography>
                <TextField
                  id="outlined-multiline-static"
                  label="Terms and Conditions"
                  multiline
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  rows={3}
                  placeholder="Add legal terms and conditions like return and refund policy etc."
                />
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Button
                onClick={handleCreateUpdateInvoice}
                startIcon={<SaveAsIcon />}
                sx={{ marginTop: "40px" }}
                size="large"
                variant="contained"
              >
                Create/Update Invoice
              </Button>
            </Box>
          </Container>
        </Box>
      )}
    </Container>
  );
};

export default InvoiceCreateEditForm;
