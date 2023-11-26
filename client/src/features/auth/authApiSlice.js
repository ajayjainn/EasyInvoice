import { baseApiSlice } from "../api/baseApiSlice"
import { logOut } from "./authSlice"

export const extendedApiSlice = baseApiSlice.injectEndpoints({
  endpoints: builder => ({
    registerUser: builder.mutation({
      query: userData => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      })
    }),
    loginUser: builder.mutation({
      query: cred => ({
        url: '/auth/login',
        method: 'POST',
        body: cred,
      })
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'GET',
      }),
      async onQueryStarted(id, { dispatch}) {
        try {
          baseApiSlice.util.resetApiState()
          dispatch(logOut('Fetching post...'))
        } catch (err) {
          console.log(err)
        }
      },
    }),
    resendVerifyEmail: builder.mutation({
      query: (email) => ({
        url: '/auth/resend_email_token',
        method: 'POST',
        body: email,
      })
    })
  })
})

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useResendVerifyEmailMutation,
 } = extendedApiSlice
