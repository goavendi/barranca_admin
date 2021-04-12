import React from 'react'

import axios from 'axios'

import { useHistory } from 'react-router-dom'

import { Formik, Field, Form, ErrorMessage } from 'formik'

import * as Yup from 'yup'

import BASE_URL from '../../environment'

import './Member.css'

const AddMember = () => {

	const [isLoading, setLoading] = React.useState()
	const [profileImage, setProfileImage] = React.useState()

	const history = useHistory()

	const initialValues = {
		"firstName": "",
		"lastName": "",
		"password": "",
		"email": "",
		"confirmPassword": "",
		"phone": "",
		"type": "supervisor",
		"department": "",
		"staffId":""
	}

	const validationSchema = Yup.object({
		firstName: Yup.string().required("Required"),
		lastName: Yup.string().required("Required"),
		email: Yup.string().email().required("Required"),
		department: Yup.string().required("Required"),
		type: Yup.string().required("Required"),
		password: Yup.string().required('Pasword is required'),
		confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Required'),
		phone: Yup.string().required("Required")
	})

	const submit = async (values, action) => {

		setLoading(true)
		const { firstName, lastName, email, password, type, department, staffId } = values;
		const data = { firstName, lastName, email, password, type, department, staffId } 

		const formData =  new FormData()
		for(let key in data ){
			formData.append(key, data[key] )
		}
		formData.append("image", profileImage)

		try {
			await axios({
				url: `${BASE_URL}/user`,
				method: "post",
				headers:{
					"Content-Type": "multipart/form-data"
				},
				data: formData
			})

			setLoading(false)
			history.push('/members')
			// alert("Member created successfully")

		} catch (err) {

			setLoading(false)
			alert("ERROR")
			console.log(err.repsonse, "ERROR ______________________________$$$$");
		}
	}

	const handleProfileImage = (e)=>{

		const file = e.target.files[0]
		setProfileImage(file)
		//todo set error validations///

	}

	return (<div id="app__content" className="page_add_member">
		<h3 className="page__heading">Add Team Member</h3>

		<Formik initialValues={initialValues} onSubmit={submit} validationSchema={validationSchema}>

			{formik => (

				<Form>
					<div className="form-group row">
						<div className="col-sm-6">
							<label>First Name</label>
							<Field type="text" className="form-control form-control-sm" name="firstName" />
							<ErrorMessage name="firstName" component="span" className="text-danger" />
						</div>

						<div className="col-sm-6">
							<label>Last Name</label>
							<Field type="text" className="form-control form-control-sm" name="lastName" />
							<ErrorMessage name="lastName" component="span" className="text-danger" />
						</div>
					</div>

					<div className="form-group">
						<label>Email</label>
						<Field type="text" className="form-control form-control-sm" name="email" />
						<ErrorMessage name="email" component="span" className="text-danger" />
					</div>


					<div className="form-group row">
						<div className="col-sm-6">
							<label>Password</label>
							<Field type="password" className="form-control form-control-sm" name="password" />
							<ErrorMessage name="password" component="span" className="text-danger" />
						</div>

						<div className="col-sm-6">
							<label>Confirm Password</label>
							<Field type="password" className="form-control form-control-sm" name="confirmPassword" />
							<ErrorMessage name="confirmPassword" component="span" className="text-danger" />
						</div>
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
						</div>
					</div>


					<div className="row form-group">
						<div className="col-sm-6">
							<label>Phone Number</label>
							<Field type="text" className="form-control form-control-sm" name="phone" />
							<ErrorMessage name="phone" component="span" className="text-danger" />
						</div>

						<div className="col-sm-6">
							<label>Department</label>
							<Field type="text" className="form-control form-control-sm" name="department" />
							<ErrorMessage name="department" component="span" className="text-danger" />
						</div>
					</div>


					<div className="row form-group">
						<div className="col-sm-6">
							<label>Profile Image</label>
							<input type="file" onChange={handleProfileImage} className="form-control form-control-sm"/>
						</div>
					</div>


					<button type="submit" disabled={isLoading} className="btn btn-sm btn-black">Add Member</button>

				</Form>
			)}

		</Formik>
		

	</div>)
}


export default AddMember