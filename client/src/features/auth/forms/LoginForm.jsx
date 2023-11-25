import { useEffect, useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { useLoginUserMutation } from "../authApiSlice";

import {
	Box,
	Button,
	FormControl,
	FormHelperText,
	Grid,
	IconButton,
	InputAdornment,
	InputLabel,
	Link,
	OutlinedInput,
	Stack,
	Typography,
} from "@mui/material";

import { Formik, replace } from "formik";
import Spinner from "../../../components/Spinner";
import { useDispatch } from "react-redux";
import { logIn } from "../authSlice";


const LoginForm = () => {
	const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const from = location.state?.from?.pathname || '/dashboard' 


	const [showPassword, setShowPassword] = useState(false);

	const handleShowHidePassword = () => {
		setShowPassword(!showPassword);
	};

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};


	const [loginUser, { data, isLoading, isSuccess }] =
		useLoginUserMutation();

	useEffect(() => {
		if (isSuccess) {
			navigate(from,{replace:true});
		}
	}, [isSuccess, navigate, from]);

	return (
		<>
			<Formik
				initialValues={{
					email: "",
					password: "",
				}}
				validationSchema={Yup.object().shape({
					email: Yup.string()
						.email("Must be a valid email")
						.max(255)
						.required("Email is required"),
					password: Yup.string()
						.max(255)
						.required("Password is required"),
				})}
				onSubmit={async (values, { setStatus, setSubmitting }) => {
					try {
						const user = await loginUser(values).unwrap();
            dispatch(logIn(user))
						setStatus({ success: true });
						setSubmitting(false);
					} catch (err) {
						const message = err.data.message;
						toast.error(message);
						setStatus({ success: false });
						setSubmitting(false);
					}
				}}
			>
				{({
					errors,
					handleBlur,
					handleChange,
					handleSubmit,
					isSubmitting,
					touched,
					values,
				}) => (
					<form noValidate autoComplete="off" onSubmit={handleSubmit}>
						{isLoading ? (
							<Spinner />
						) : (
							<Grid container spacing={3}>
								{/* Email */}
								<Grid item xs={12}>
									<Stack spacing={1}>
										<InputLabel htmlFor="email-signup">
											Email Address*
										</InputLabel>
										<OutlinedInput
											id="email-signup"
											value={values.email}
											name="email"
											onBlur={handleBlur}
											onChange={handleChange}
											placeholder="email@example.com"
											inputProps={{}}
											fullWidth
											error={Boolean(
												touched.email && errors.email
											)}
										/>
										{touched.email && errors.email && (
											<FormHelperText
												error
												id="helper-text-email-signup"
											>
												{errors.email}
											</FormHelperText>
										)}
									</Stack>
								</Grid>
								{/* password */}
								<Grid item xs={12}>
									<Stack spacing={1}>
										<InputLabel htmlFor="password-signup">
											Password
										</InputLabel>
										<OutlinedInput
											fullWidth
											error={Boolean(
												touched.password &&
													errors.password
											)}
											id="password-signup"
											type={
												showPassword
													? "text"
													: "password"
											}
											value={values.password}
											name="password"
											onBlur={handleBlur}
											onChange={handleChange}
											endAdornment={
												<InputAdornment position="end">
													<IconButton
														aria-label="toggle password visiblity"
														onClick={
															handleShowHidePassword
														}
														onMouseDown={
															handleMouseDownPassword
														}
														edge="end"
														size="large"
													>
														{showPassword ? (
															<Visibility />
														) : (
															<VisibilityOff />
														)}
													</IconButton>
												</InputAdornment>
											}
											placeholder="******"
											inputProps={{}}
										/>
										{touched.password &&
											errors.password && (
												<FormHelperText
													error
													id="helper-text-password-signup"
												>
													{errors.password}
												</FormHelperText>
											)}
									</Stack>
								</Grid>
                {/* forgot password */}
                <Grid item xs={12}>
                  <Typography
                    component={RouterLink}
                    to="/reset_password"
                    variant="subtitle2"
                    sx={{ textDecoration: "none" }}
                    color="primary"
                  >
                    Forgot Password?
                  </Typography>
                </Grid>
	
								{/* Terms of service */}
								<Grid item xs={12}>
									<Typography variant="body2">
										By Logging in, you agree to our &nbsp;
										<Link
											variant="subtitle2"
											component={RouterLink}
											to="#"
										>
											Terms of Service
										</Link>
										&nbsp; and &nbsp;
										<Link
											variant="subtitle2"
											component={RouterLink}
											to="#"
										>
											Privacy Policy
										</Link>
									</Typography>
								</Grid>
								{/* display any submission errors */}
								{errors.submit && (
									<Grid item xs={12}>
										<FormHelperText error>
											{errors.submit}
										</FormHelperText>
									</Grid>
								)}
								{/* Sign In button */}
								<Grid item xs={12}>
										<Button
											disableElevation
											disabled={isSubmitting}
											fullWidth
											size="large"
											type="submit"
											variant="contained"
											color="secondary"
										>
											Log In
										</Button>
								</Grid>
							</Grid>
						)}
					</form>
				)}
			</Formik>
		</>
	);
};

export default LoginForm;