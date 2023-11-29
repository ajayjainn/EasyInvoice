import { baseApiSlice } from "../api/baseApiSlice";
export const customersApiSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCustomer: builder.mutation({
      query: (data) => ({
        url: '/customers',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ["Customer"]
    }),
    updateCustomer: builder.mutation({
      query: (data) => ({
        url: `/customers/${data.id}`,
        method: "PATCH",
        body: data
      }),
      invalidatesTags: ["Customer"]
    }),
    deleteCustomer: builder.mutation({
      query: (id) => ({
        url: `/customers/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Customer']
    }),
    getCustomer: builder.query({
      query: (id) => `/customers/${id}`,
      providesTags: ['Customer']
    }),
    getAllCustomers: builder.query({
      query: ({page,limit}) => `/customers?page=${page}&limit=${limit}`,
      providesTags: ['Customer']
    })
  })
})

export const {
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
  useGetAllCustomersQuery,
  useGetCustomerQuery
} = customersApiSlice