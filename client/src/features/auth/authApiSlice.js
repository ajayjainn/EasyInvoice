import { baseApiSlice } from "../api/baseApiSlice"

export const extendedApiSlice = baseApiSlice.injectEndpoints({
  endpoints: builder=>({
    registerUser: builder.mutation({
      query: userData=>({
        url:'/auth/register',
        method: 'POST',
        body:userData,
      })
    }),
    loginUser: builder.mutation({
      query: cred=>({
        url:'/auth/login',
        method: 'POST',
        body:cred,
      })
    }),
  })
})

export const {useRegisterUserMutation, useLoginUserMutation} = extendedApiSlice
 