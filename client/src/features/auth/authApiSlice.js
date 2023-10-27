import { baseApiSlice } from "../api/baseApiSlice"

export const extendedApiSlice = baseApiSlice.injectEndpoints({
  endpoints: builder=>({
    registerUser: builder.mutation({
      query: userData=>({
        url:'/auth/register',
        method: 'POST',
        body:userData,
      })
    })
  })
})

export const {useRegisterUserMutation} = extendedApiSlice
 