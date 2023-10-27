import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:1997/api/v1',
  creadentials: 'include',
  prepareHeaders: (headers, {getState}) => { 
    const token = getState().auth.user?.token
    if(token){
      headers.set('authorization',`Bearer ${token}`)
    }
    return headers
  }
})

export const baseApiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  endpoints: (builder) => ({}),
})
