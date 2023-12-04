import { baseApiSlice } from "../api/baseApiSlice";

export const usersApiSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: ({ page, limit }) => `/user/all?page=${page}&limit=${limit}`,
      providesTags: (result) =>
        result
          ? [...result.users.map(({ id }) => ({ type: 'User', id })), { type: 'User', id: 'LIST' }]
          : [{ type: 'User', id: 'LIST' }]
    }),
    getUserProfile: builder.query({
      query: () => ({
        url: '/user/profile',
      }),
      providesTags: [{ type: "User", id: "SINGLE_USER" }]
    }),
    updateUserProfile: builder.mutation({
      query: (data) => ({
        url: '/user/profile',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: [{ type: "User", id: "SINGLE_USER" }]
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/user/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }]
    }),
    deleteMyAccount: builder.mutation({
      query: () => ({
        url: `/user/profile`,
        method: 'DELETE'
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }]
    }),
    deactivateUser: builder.mutation({
      query: (id) => ({
        url: `/user/${id}/deactivate`,
        method: 'PATCH'
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }]
    }),
    activateUser: builder.mutation({
      query: (id) => ({
        url: `/user/${id}/activate`,
        method: 'PATCH'
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }]
    }),
    updateAvatar: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append('logo',file)
        return {
          url: '/upload',
          method: "PATCH",
          body: formData,
        }
      }
    }),
    getDashboardData: builder.query({
      query: () => '/user/dashboard',
      providesTags: ["Customer","Invoice"]
    }),

  })
})
export const {
  useGetAllUsersQuery,
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useDeleteMyAccountMutation,
  useDeleteUserMutation,
  useDeactivateUserMutation,
  useActivateUserMutation,
  useUpdateAvatarMutation,
  useGetDashboardDataQuery
} = usersApiSlice

