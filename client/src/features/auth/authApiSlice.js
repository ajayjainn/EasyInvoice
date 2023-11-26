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
    }),
    passwordResetRequest: builder.mutation({
      query: (email) => ({
        url: 'auth/reset_password_request',
        method: 'POST',
        body: email,
      })
    }),
    passwordReset: builder.mutation({
      query: (data) => ({
        url: 'auth/reset_password',
        method: 'POST',
        body: data,
      })
    }),

  })
})

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useResendVerifyEmailMutation,
  usePasswordResetRequestMutation,
  usePasswordResetMutation
 } = extendedApiSlice
