import {Box, Typography} from '@mui/material';

const UserListPage = () => {
  return (
    <Box sx={{
      display: 'flex',
      marginLeft: '250px',
      mt:10
    }}
    >
      <Typography variant='h4'>
        Admin Only Page
      </Typography>
    </Box>
  )
}

export default UserListPage