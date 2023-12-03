import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import {
	Button,
	Container,
	FormHelperText,
	Grid,
	InputLabel,
	OutlinedInput,
	Stack,
	Typography,
} from "@mui/material";
import { Formik } from "formik";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import Spinner from "../../../components/Spinner";
import StyledDivider from "../../../components/StyledDivider";
import useTitle from "../../../hooks/useTitle";
import { useCreateCustomerMutation } from "../customersApiSlice";

const CustomerCreateForm = () => {
	useTitle("Create Customer - EASY Invoice");

	const navigate = useNavigate();
	const location = useLocation();
	const goBack = () => navigate(-1);

	const from = location.state?.from?.pathname || "/customers";

	const [createCustomer, { isSuccess, isLoading }] =
		useCreateCustomerMutation();

	useEffect(() => {
		if (isSuccess) {
			navigate(from, { replace: true });
		}
	}, [isSuccess, navigate, from]);

	return (
		<>
			<Formik
				initialValues={{
					name: "",
					email: "",
					phoneNo: "",
					address: "",
				}}
				validationSchema={Yup.object().shape({
					name: Yup.string()
						.max(255)
						.required("A customer must have a name"),
					email: Yup.string()
						.email("Must be a valid email")
						.max(255)
						.required("Email is required"),
					phoneNo: Yup
					.string()
					// .matches(/^(\+\d{1,3}[- ]?)?\d{10}$/,"Must be a valid mobile phone number with country code.")
					
				})}
				onSubmit={async (values, { setStatus, setSubmitting }) => {
					try {
						const response = await createCustomer(values).unwrap();
						toast.success(response.message)
						setStatus({ success: true });
						setSubmitting(false);
					} catch (err) {
						toast.error(err.data.message);
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
					touched,
					values,
				}) => (
					<>
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
							<form
								noValidate
								autoComplete="off"
								onSubmit={handleSubmit}
							>
								<Grid>
									<Grid item xs={12}>
										<Stack
											direction="row"
											justifyContent="center"
											alignItems="center"
										>
											<Stack
												direction="row"
												alignItems="center"
											>
												<SaveAsIcon
													sx={{ fontSize: 60 }}
												/>
												<Typography variant="h3">
													Create Customer
												</Typography>
											</Stack>
											<Button
												variant="contained"
												color="warning"
												size="small"
												sx={{
													fontSize: "1rem",
													ml: "10px",
												}}
												onClick={goBack}
											>
												Go Back
											</Button>
										</Stack>
										<StyledDivider />
									</Grid>
									{isLoading ? (
										<Spinner />
									) : (
										<Grid container>
											<Grid item xs={12}>
												<Stack spacing={1}>
													<InputLabel htmlFor="customer-name">
														Customer name*
													</InputLabel>
													<OutlinedInput
														fullWidth
														error={Boolean(
															touched.name &&
																errors.name
														)}
														id="customer-name"
														type="name"
														value={values.name}
														name="name"
														onBlur={handleBlur}
														onChange={handleChange}
														placeholder="Nikhil Jain"
														inputProps={{}}
													/>
													{touched.name &&
														errors.name && (
															<FormHelperText
																error
																id="helper-text-customer-name"
															>
																{errors.name}
															</FormHelperText>
														)}
													{/* email address */}
													<InputLabel htmlFor="email-signup">
														Email Address*
													</InputLabel>
													<OutlinedInput
														fullWidth
														error={Boolean(
															touched.email &&
																errors.email
														)}
														id="email-signup"
														type="email"
														value={values.email}
														name="email"
														onBlur={handleBlur}
														onChange={handleChange}
														placeholder="email@example.com"
														inputProps={{}}
													/>
													{touched.email &&
														errors.email && (
															<FormHelperText
																error
																id="helper-text-email-signup"
															>
																{errors.email}
															</FormHelperText>
														)}
													{/* phone number */}
													<InputLabel htmlFor="customer-phoneNo">
														Mobile Phone Number*
													</InputLabel>
													<OutlinedInput
														fullWidth
														error={Boolean(
															touched.phoneNo &&
																errors.phoneNo
														)}
														id="customer-phoneNo"
														type="phoneNo"
														value={
															values.phoneNo
														}
														name="phoneNo"
														onBlur={handleBlur}
														onChange={handleChange}
														placeholder="e.g +919876543210 - must be a valid mobile phone number with country code."
														inputProps={{}}
													/>
													{touched.phoneNo &&
														errors.phoneNo && (
															<FormHelperText
																error
																id="helper-text-customer-phoneNo"
															>
																{
																	errors.phoneNo
																}
															</FormHelperText>
														)}
													
													

													{/* Address */}
													<InputLabel htmlFor="customer-address">
														Address
													</InputLabel>
													<OutlinedInput
														fullWidth
														error={Boolean(
															touched.address &&
																errors.address
														)}
														id="customer-address"
														type="address"
														value={values.address}
														name="address"
														onBlur={handleBlur}
														onChange={handleChange}
														placeholder="Kudasan, Gandhinagar"
														inputProps={{}}
													/>
													{touched.address &&
														errors.address && (
															<FormHelperText
																error
																id="helper-text-address"
															>
																{errors.address}
															</FormHelperText>
														)}
												
													{/* button */}
													<Grid item xs={12}>
														<Button
															sx={{
																mt: 3,
																mb: 2,
															}}
															type="submit"
															fullWidth
															variant="contained"
															color="success"
															size="large"
															endIcon={
																<PersonAddAlt1Icon fontSize="large" />
															}
															disabled={
																!values.email ||
																!values.phoneNo ||
																!values.name
															}
														>
															Create Customer
														</Button>
													</Grid>
												</Stack>
											</Grid>
										</Grid>
									)}
								</Grid>
							</form>
						</Container>
					</>
				)}
			</Formik>
		</>
	);
};

export default CustomerCreateForm;