export const invoiceInitialState = {
  status: 'NOT PAID',
  additionInfo:"",
  total: 0,
  tax: 0,
  subTotal: 0,
  customer: "",
}

export const itemsInitialState = [{
  name:"",
  rate:0,
  quantity:0
}]

export const paymentInitialState = [{
  paymentDate:new Date(),
  amount:0,
  paymentMode: "",
  remarks: ""
}]