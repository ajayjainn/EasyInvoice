import { createApi } from '@reduxjs/toolkit/query/react'
import { fetchBaseQuery } from '@reduxjs/toolkit/query'
import { logIn, logOut } from '../auth/authSlice'

const baseQuery = fetchBaseQuery({
  baseUrl: '/api/v1',
  creadentials: 'include',
  prepareHeaders: (headers, {getState}) => { 
    const token = getState().auth.user?.token
    if(token){
      headers.set('authorization',`Bearer ${token}`)
    }
    return headers
  }
})

const baseQueryWithReAuth = async (args,api,extraOptions)=>{
  let response  = await baseQuery(args,api,extraOptions)
  if(response?.error?.originalStatus===403){
    const refreshResponse = await baseQuery('/auth/new_access_token',api,extraOptions)
    if(refreshResponse?.data){
      api.dispatch(logIn({...refreshResponse.data}))
      response = await baseQuery(args,api, extraOptions)
    }else{
      api.dispatch(logOut())
    }
  }

  return response

}

export const baseApiSlice = createApi({
  reducerPath: 'api',
  baseQuery:baseQueryWithReAuth,
  tagTypes:['User','Customer','Document'],
  endpoints: () => ({}),
})
