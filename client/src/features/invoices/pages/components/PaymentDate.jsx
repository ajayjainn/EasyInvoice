import {AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import {DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import {LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { TextField } from '@mui/material'

const PaymentDate = ({paymentDate, setPaymentDate}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DesktopDatePicker sx={{width:"100%",marginBottom:"3px"}} label="date Paid" value={paymentDate} onChange={setPaymentDate}
      renderInput={(params)=>{
        <TextField sx={{width:'100%'}} variant="standard" {...params}/>
      }}
      />
    </LocalizationProvider>
  )
}

export default PaymentDate