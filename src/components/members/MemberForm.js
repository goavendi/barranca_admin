import React from 'react'

import { Formik, Field, Form, ErrorMessage } from 'formik'
import axios from 'axios'
import * as Yup from 'yup'

import { useParams } from 'react-router-dom'

import BASE_URL from '../../environment'

import { FaUserCircle } from 'react-icons/fa';

import './Member.css'



const MemberForm = ({ mode }) => {

	const [isLoading, setLoading] = React.useState()
	const params = useParams()
	const memberId = params.id;
	const [profileImage, setProfileImage] = React.useState()
	const [profilePreview, setProfileImagePreview] = React.useState()


	const [initialValues, setInitialValues] = React.useState({
		"firstName": "",
		"lastName": "",
		"password": "",
		"email": "",
		"confirmPassword": "",
		"type": "supervisor",
		"department": "",
		"phone": "",
		"staffId": ""
	})

	const validationSchema = Yup.object({
		firstName: Yup.string().required("Required"),
		lastName: Yup.string().required("Required"),
		email: Yup.string().email().required("Required"),
		department: Yup.string().required("Required"),
		type: Yup.string().required("Required"),
		phone: Yup.string().required("Required"),
		staffId: Yup.string().required("Required"),
	})


	React.useEffect(() => {
		async function fetchData() {
			let response = await axios({
				url: `${BASE_URL}/user/${memberId}`
			})
			response = response.data.data

			let values = {
				firstName: response.firstName,
				lastName: response.lastName,
				email: response.email,
				department: response.department || "",
				type: response.type || "",
				phone: response.phone || "",
				staffId: response.staffId || ""
			}
			setInitialValues(values)

			if (response.imageUrl) {
				// setProfileImage(true)
				setProfileImagePreview(response.imageUrl)
			}
		}

		if (mode === "EDIT") {
			try {
				fetchData();
			} catch (err) {
				console.log(err.response, "$$$$");
			}
		}

	}, [mode, memberId])

	const submit = async (values) => {
		setLoading(true)
		const { firstName, lastName, email, type, department, staffId, phone } = values;
		const data = { firstName, lastName, email, type, department, staffId, phone }

		const formData = new FormData()
		for (let key in data) {
			formData.append(key, data[key])
		}

		if (profileImage) {

			formData.append("image", profileImage)
		}

		if (mode === "EDIT") {
			try {
				await axios({
					url: `${BASE_URL}/user/${memberId}`,
					method: 'PUT',
					headers: {
						"Content-Type": "multipart/form-data"
					},
					data: formData
				})
				// alert("SUCCESS!")
				setLoading(false)

			} catch (err) {
				alert("ERROR!")
				console.log(err.response, "$$$$");
				setLoading(false)
			}
		} else {

		}
	}

	const handleProfileImage = (e) => {
		const file = e.target.files[0]

		if (file) {

			setProfileImage(file)
			var reader = new FileReader();
			reader.readAsDataURL(file);

			reader.onload = function(e) {
				setProfileImagePreview(e.target.result)
			}

		}
	}//end handle profile image


	return <React.Fragment>

		<Formik initialValues={initialValues} enableReinitialize onSubmit={submit} validationSchema={validationSchema}>

			{formik => (

				<Form className="member__form">

					<div className="form-group">
						<label>First Name</label>
						<Field type="text" className="form-control form-control-sm" name="firstName" />
						<ErrorMessage name="firstName" component="span" className="text-danger" />
					</div>

					<div className="form-group">
						<label>Last Name</label>
						<Field type="text" className="form-control form-control-sm" name="lastName" />
						<ErrorMessage name="lastName" component="span" className="text-danger" />
					</div>

					<div className="form-group">
						<label>Email</label>
						<Field type="text" className="form-control form-control-sm" name="email" />
						<ErrorMessage name="email" component="span" className="text-danger" />

					</div>

					<div className="form-group row">
						<div className="col-sm-6">
							<label>Type</label>
							<Field as="select" className="form-control input-sm" name="type" >
								<option value="supervisor" >Supervisor</option>
								<option value="staff">Staff</option>
							</Field>
							<ErrorMessage name="type" component="span" className="text-danger" />
						</div>
						<div className="col-sm-6">
							<label>Staff ID</label>
							<Field type="text" className="form-control form-control-sm" name="staffId" />
							<ErrorMessage name="staffId" component="span" className="text-danger" />

						</div>
					</div>

					<div className="form-group">
						<label>Phone Number</label>
						<Field type="text" className="form-control form-control-sm" name="phone" />
						<ErrorMessage name="phone" component="span" className="text-danger" />
					</div>

					<div className="form-group">
						<label>Department</label>
						<Field type="text" className="form-control form-control-sm" name="department" />
						<ErrorMessage name="department" component="span" className="text-danger" />
					</div>

					<div className="row form-group">
						<div className="col-sm-6">
							<label>Profile Image</label>
							<input type="file" onChange={handleProfileImage} className="form-control form-control-sm" />
							<div className="profile__image">
								{profilePreview ?
									<img src={profilePreview} alt="profile" className="rounded-circle" />
									: <FaUserCircle size={54} style={{ color: "#e9e9e9" }} />}
							</div>
						</div>
					</div>

					<button type="submit" disabled={isLoading || !formik.isValid} className="btn btn-black">Update</button>

				</Form>
			)}

		</Formik>


	</React.Fragment>
}


export default MemberForm