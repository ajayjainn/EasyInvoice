import { useEffect, useState } from "react";
import {
  Autocomplete,
  Button,
  Container,
  TextField,
  Typography,
} from "@mui/material";

import { useCreatePaymentMutation } from "../invoiceApiSlice";
import PaymentDate from "./components/PaymentDate";
import Spinner from "../../../components/Spinner";
import { toast } from "react-toastify";

const PaymentForm = ({ id }) => {
  const [createPayment, { isLoading }] = useCreatePaymentMutation();
  const [paymentDate, setPaymentDate] = useState(new Date());
  const [paymentMode, setPaymentMode] = useState("CASH");
  const [remarks, setRemarks] = useState("");
  const [amount, setAmount] = useState(0);

  const [validate, setValidate] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();
    const data = {
      amount,
      paymentDate,
      paymentMode,
      remarks,
    };
    const res = await createPayment({ id, data }).unwrap();
    setAmount(0);
    toast.success(res.message);
  };
  useEffect(() => {
    setValidate(amount > 0);
  }, [amount]);
  return (
    <Container
      component="main"
      maxWidth="md"
      sx={{
        mb: 20,
        padding: 3,
        border: "2px solid",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography sx={{ marginBottom: "8px" }} variant="h3" align="center">
        Record a Payment
      </Typography>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <PaymentDate
            paymentDate={paymentDate}
            setPaymentDate={setPaymentDate}
          />
          <TextField
            sx={{ marginBottom: "8px" }}
            margin="dense"
            label="Amount Paid"
            fullWidth
            type="number"
            variant="outlined"
            value={amount === 0 ? "" : amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />

          <Autocomplete
            value={paymentMode}
            onChange={(event, newValue) => {
              setPaymentMode(newValue);
            }}
            disablePortal
            options={["CASH", "CHEQUE", "NEFT", "UPI", "OTHERS"]}
            sx={{ width: "100%", marginBottom: "8px" }}
            renderInput={(params) => (
              <TextField {...params} label="Payment Mode" />
            )}
          />

          <TextField
            value={remarks}
            sx={{ marginBottom: "8px" }}
            fullWidth
            onChange={(e) => setRemarks(e.target.value)}
            label="Remarks"
            variant="outlined"
          />

          <Button
            disabled={!validate}
            sx={{ marginBottom: "8px" }}
            variant="contained"
            onClick={handlePayment}
          >
            Record Payment
          </Button>
        </>
      )}
    </Container>
  );
};

export default PaymentForm;
