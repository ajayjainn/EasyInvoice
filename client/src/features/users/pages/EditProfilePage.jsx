import { useState, useEffect } from 'react'
import useTitle from '../../../hooks/useTitle';
import { useNavigate } from 'react-router-dom';
import { useGetUserProfileQuery, useUpdateAvatarMutation, useUpdateUserProfileMutation } from '../usersApiSlice';
import { toast } from 'react-toastify';
import BrowserUpdatedIcon from "@mui/icons-material/BrowserUpdated";
import CheckIcon from "@mui/icons-material/Check";
import PhotoCamera from "@mui/icons-material/PhotoCamera";

import validator from "validator";
import Spinner from "../../../components/Spinner";

import StyledDivider from "../../../components/StyledDivider";

import {
	Box,
	Button,
	CircularProgress,
	Container,
	CssBaseline,
	Grid,
	Input,
	TextField,
	Typography,
} from "@mui/material";
import { useDispatch } from 'react-redux';
import { logIn } from '../../auth/authSlice';

const EditProfilePage = () => {

  useTitle("Edit Profile - EASY Invoice");
  const navigate = useNavigate();
	const goBack = () => navigate(-1);

  
  const [fields,setFields] = useState({})
	const dispatch = useDispatch()

	const [uploading, setUploading] = useState(false);
  
  const {data,isLoading} = useGetUserProfileQuery()
  
  const isValidPhoneNumber = validator.isMobilePhone(fields.phoneNumber?fields.phoneNumber:"");

  const [updateProfile,{data:updatedData,isSuccess,isLoading:isUpdating}] = useUpdateUserProfileMutation()
  const [updateAvatar, {isLoading:isUploading}] = useUpdateAvatarMutation()

  useEffect(()=>{
    if(data) setFields(data.user)
  }, [data])

  useEffect(()=>{
    if(isSuccess){
      navigate("/profile");
      const message = updatedData?.message;
      toast.success(message);
    }
  }, [updatedData,navigate,isSuccess])

  if(isLoading){
    return (
      <Spinner/>
    )
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try{
      await updateProfile(fields).unwrap()
			const us = JSON.parse(localStorage.getItem(('user')))
			const data = {
				...us,
				avatar: fields.avatar,
				firstName: fields.firstName,
				lastName: fields.lastName,
				username: fields.username,
			}
			localStorage.setItem('user', JSON.stringify(data))
			dispatch(logIn(data))
    }catch(err){
      toast.error(err.data.message)
    }
  }

  const uploadFileHandler = async (e) => {
    try{
      e.preventDefault()
      setUploading(true)
      const file = e.target.files[0]
      const response = await updateAvatar(file).unwrap()
      setFields({...fields,avatar:response})
    }catch (err){
      console.log(err)
    }finally{
      setUploading(false)
    }
  }
  
  
  return (
    <Container
			component="main"
			maxWidth="sm"
			sx={{
				border: "2px solid  #e4e5e7",
				borderRadius: "25px",
				py: 2,
				mt: 10,
			}}
		>
			<CssBaseline />
			<Box
				sx={{
					display: "flex",
					flexDirection: "row",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<BrowserUpdatedIcon sx={{ fontSize: 70 }} />
				<Typography variant="h2">Update Profile</Typography>
				<Button
					variant="contained"
					color="warning"
					size="small"
					sx={{ fontSize: "1rem", ml: "10px" }}
					onClick={goBack}
				>
					Go Back
				</Button>
			</Box>
			<StyledDivider />
        
      {isLoading ? (
				<Spinner />
			) : (
        <Box
					sx={{
						mt: "1rem",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
					component="form"
					noValidate
					autoComplete="off"
					onSubmit={handleUpdate}
				>
					<Grid container spacing={2}>
						<Grid item md={6}>
							{/* firstName */}
							<TextField
								required
								fullWidth
								id="firstname"
								label="First Name"
								name="firstname"
								margin="normal"
								value={fields.firstName}
								onChange={(e) => setFields({...fields, firstName:e.target.value})}
							/>
						</Grid>
						<Grid item md={6}>
							{/* lastName */}
							<TextField
								required
								fullWidth
								id="lastname"
								label="Last Name"
								name="lastname"
								margin="normal"
								value={fields.lastName}
								onChange={(e) => setFields({...fields, lastName:e.target.value})}
							/>
						</Grid>
						<Grid item md={6}>
							{/* username */}
							<TextField
								required
								fullWidth
								id="username"
								label="Username"
								name="username"
								margin="normal"
								value={fields.username}
								onChange={(e) => setFields({...fields, username:e.target.value})}
							/>
						</Grid>

						<Grid item md={6}>
							{/* phoneNumber */}
							<TextField
								required
								fullWidth
								error={!isValidPhoneNumber}
								id="phonenumber"
								label={
									!isValidPhoneNumber
										? "Mobile Number Required"
										: "Phone Number"
								}
								name="phonenumber"
								margin="normal"
								helperText={
									!isValidPhoneNumber &&
									"A valid mobile phone number is required in the format of +(country-code) then followed by the number. e.g +254123456789"
								}
								value={fields.phoneNumber}
								onChange={(e) => setFields({...fields, phoneNumber:e.target.value})}
							/>
						</Grid>
						<Grid item md={6}>
							{/* business name */}
							<TextField
								required
								fullWidth
								id="businessName"
								label="Name of Business"
								name="businessName"
								margin="normal"
								value={fields.buisnessName}
								onChange={(e) =>
									setFields({...fields, buisnessName:e.target.value})
								}
							/>
						</Grid>
						<Grid item md={6}>
							{/* address */}
							<TextField
								required
								fullWidth
								id="address"
								label="Address"
								name="address"
								margin="normal"
								value={fields.address}
								onChange={(e) => setFields({...fields, address:e.target.value})}
							/>
						</Grid>
				
					</Grid>
			
					<TextField
						fullWidth
						id="avatar"
						name="avatar"
						margin="normal"
						value={fields.avatar || ""}
						onChange={(e) => setFields({...fields,avatar:e.target.value})}
					/>
					<label htmlFor="logo">
						<Input
							accept="image/*"
							id="logo"
							name="logo"
							type="file"
							onChange={uploadFileHandler}
						/>
						{!uploading ? (
							<Button
								sx={{ mt: "5px" }}
								variant="contained"
								component="span"
								endIcon={<PhotoCamera />}
							>
								Choose Your Logo
							</Button>
						) : (
							<CircularProgress size={60} />
						)}
					</label>


					<Button
						sx={{ mt: 3, mb: 5 }}
						type="submit"
						fullWidth
						variant="contained"
						color="success"
						size="large"
						disabled={isUpdating || isUploading}
						endIcon={<CheckIcon />}
					>
						<Typography variant="h5">Update Profile</Typography>
					</Button>
				</Box>
      )
      }


      </Container>
  )
}

export default EditProfilePage