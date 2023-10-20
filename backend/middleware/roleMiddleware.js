import { USER, ADMIN } from '../constants/index.js'

const ROLES = {
  User: USER,
  Admin: ADMIN,
}

const checkRole = (...allowedRoles) => (req, res, next) => {
  if (!req?.user || !req.roles) {
    res.status(401)
    throw new Error('you are not authorized to use our platform. ')
  }

  const rolesArray = [...allowedRoles]
  const roleFound = req.roles
    .map((role) => rolesArray.includes(role))
    .find((value) => value === true)
  if (!roleFound) {
    res.status(401)
    throw new Error('you are not authorized to use our platform. ')
  }
  next()
}

export default [ROLES, checkRole]
