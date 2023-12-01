import { baseApiSlice } from "../api/baseApiSlice";
export const invoiceApiSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllInvoices: builder.query({
      query: ({page,limit})=> `/invoices?page=${page}&limit=${limit}`,
      providesTags: ['Invoice']
    }),
    getInvoice: builder.query({
      query: (id) => `/invoices/${id}`,
      providesTags: ['Invoice']
    }),
    deleteInvoice: builder.mutation({
      query: (id)=>({
        url: `/invoices/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ['Invoice']
    }),
    createInvoice: builder.mutation({
      query: (data) => ({
        url: '/invoices',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Invoice']
    }),
    updateInvoice: builder.mutation({
      query: (a)=>{
        console.log(a,a.data)
        return {
        url:`/invoices/${a.id}`,
        method:"PATCH",
        body: a.data
      }},
      invalidatesTags: ["Invoice"]
    })
  })
})

export const {
  useCreateInvoiceMutation,
  useDeleteInvoiceMutation,
  useGetAllInvoicesQuery,
  useGetInvoiceQuery,
  useUpdateInvoiceMutation
} = invoiceApiSlice