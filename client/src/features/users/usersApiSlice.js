import { baseApiSlice } from "../api/baseApiSlice";

export const usersApiSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
      getAllUsers: builder.query({
        query: ({page,limit}) => `/user/all?page=${page}&limit=${limit}`,
        providesTags: (result)=>
          result
          ? [...result.users.map(({id})=>({type:'Users', id})), {type:'Users', id:'LIST'}]
          : [{type:'Users', id:'LIST'}]
      }),
    })
})

export const {
  useGetAllUsersQuery,
} = usersApiSlice

