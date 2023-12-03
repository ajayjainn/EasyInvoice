import { baseApiSlice } from "../api/baseApiSlice";
export const invoiceApiSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllInvoices: builder.query({
      query: ({ page, limit }) => `/invoices?page=${page}&limit=${limit}`,
      providesTags: ['Invoice']
    }),
    getInvoice: builder.query({
      query: (id) => `/invoices/${id}`,
      providesTags: ['Invoice']
    }),
    deleteInvoice: builder.mutation({
      query: (id) => ({
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
      query: (a) => ({
        url: `/invoices/${a.id}`,
        method: "PATCH",
        body: a.data
      }),
      invalidatesTags: ["Invoice"]
    }),
    createPayment: builder.mutation({
      query: (a) => ({
        url: `/invoices/${a.id}/payment`,
        method: 'POST',
        body: a.data
      }),
      invalidatesTags: ['Invoice']
    }),
    emailInvoice: builder.mutation({
      query: (id)=> ({
        url:`/invoices/${id}/sendInvoice`,
        method:"POST"
      })
    })
  })
})

export const {
  useCreateInvoiceMutation,
  useDeleteInvoiceMutation,
  useGetAllInvoicesQuery,
  useGetInvoiceQuery,
  useUpdateInvoiceMutation,
  useCreatePaymentMutation,
  useEmailInvoiceMutation
} = invoiceApiSlice