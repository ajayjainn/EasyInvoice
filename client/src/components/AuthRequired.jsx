import {
  Navigate,
  Outlet,
  useLocation
} from 'react-router-dom'
import useAuthUser from '../hooks/useAuthUser'

const AuthRequired = ({allowedRoles}) => {
  const {roles} = useAuthUser()
  const location = useLocation()

  if (allowedRoles.some(role => roles.includes(role))) {
    return <Outlet />
  }else{
    return <Navigate to='/login' state={{from:location}} replace />
  } 
}

export default AuthRequired