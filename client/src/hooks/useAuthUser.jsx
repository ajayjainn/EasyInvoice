import {useSelector} from "react-redux";
import {decodeToken} from 'react-jwt'
import { selectCurrentUserToken } from "../features/auth/authSlice";

const useAuthUser = () => {
  const token = useSelector(selectCurrentUserToken)
  const decodedToken = decodeToken(token)
  
  return {
    roles: decodedToken.roles,
    isAdmin: decodedToken.roles.includes('Admin')
  }
} 

export default useAuthUser;
