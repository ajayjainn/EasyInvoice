import {useSelector} from "react-redux";
import {decodeToken} from 'react-jwt'
import { selectCurrentUserToken } from "../features/auth/authSlice";

const useAuthUser = () => {
  const token = useSelector(selectCurrentUserToken)
  let isAdmin = false
  
  if(token){
    const decodedToken = decodeToken(token)
    isAdmin = decodedToken.roles.includes('Admin')
  }
  return {isAdmin}
} 

export default useAuthUser;
