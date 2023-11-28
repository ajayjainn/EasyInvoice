import {useSelector} from "react-redux";
import {decodeToken} from 'react-jwt'
import { selectCurrentUserGoogleToken, selectCurrentUserToken } from "../features/auth/authSlice";

const useAuthUser = () => {
  let token = useSelector(selectCurrentUserToken)
  const googleToken = useSelector(selectCurrentUserGoogleToken)
  if(!token) token = googleToken
  let roles = []
  let isAdmin = false
  if(token){
    const decodedToken = decodeToken(token)
    roles =  decodedToken.roles,
    isAdmin = decodedToken.roles.includes('Admin') 
  }
  return {roles, isAdmin}
} 

export default useAuthUser;
