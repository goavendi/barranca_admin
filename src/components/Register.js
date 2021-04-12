import React, {useState} from 'react'
import axios from 'axios'

import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import Spinner from 'react-bootstrap/Spinner'
import Toast from 'react-bootstrap/Toast'
// import {Link} from 'react-router-dom'
import BASE_URL from '../environment'


const Register = () => {

	const [isLoading, setLoading] = useState(false)
	const [showA, setShowA] = useState(false);
	const toggleShowA = () => setShowA(!showA);

	const initialValues = {
		"firstName": "",
		"lastName": "",
		"password": "",
		"email": "",
		"confirmPassword": "",
		"phone": "",
		"type": "admin",
		"department": "fandB",
		"currency": "AED"
	}


	const validationSchema = Yup.object({
		firstName: Yup.string().required("First name is required."),
		lastName: Yup.string().required('Last name is required'),
		email: Yup.string().email('Invalid email').required('Email is required'),
		password: Yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
		confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Required')
	})

	const submit = async (values) => {
		setLoading(true)
		console.log(values, "$$$$");

		delete values.confirmPassword

		try {
			let response = await axios({
				url: `${BASE_URL}/user`,
				method: "post",
				data:values
			})
			toggleShowA()
			console.log(response, "_______RESPONSE__________$$$$");
			setLoading(false)
		} catch (err) {
			console.log(err.response, "$$$$");
			setLoading(false)
			alert("Error")
		}
	}

	return <div className="container">

		<div id="app__signup__page" className="row ">

			<div className="col-sm-4 signup__form">

				<h1 id="logo">avendi</h1>

				<div className="clearfix"></div>

				<Formik initialValues={initialValues} onSubmit={submit} validationSchema={validationSchema}>
					{formik => (
						<Form>
							<h3>Sign up</h3>

							<div className="form-group">
								<label htmlFor="">First Name</label>
								<Field type="text" className="form-control" name="firstName" />
								<ErrorMessage component="span" name="firstName" className="text-danger" />
							</div>

							<div className="form-group">
								<label htmlFor="">Last Name</label>
								<Field type="text" className="form-control" name="lastName" />
								<ErrorMessage component="span" name="lastName" className="text-danger" />
							</div>

							<div className="form-group">
								<label htmlFor="">Email</label>
								<Field type="text" className="form-control" name="email" />
								<ErrorMessage component="span" name="email" className="text-danger" />

							</div>

							<div className="form-group">
								<label htmlFor="">Password</label>
								<Field type="password" className="form-control" name="password" />
								<ErrorMessage component="span" name="password" className="text-danger" />
							</div>
							<div className="form-group">
								<label htmlFor="">Confirm Password</label>
								<Field type="password" className="form-control" name="confirmPassword" />
								<ErrorMessage component="span" name="confirmPassword" className="text-danger" />
							</div>

							<div className="form-group">
								<label htmlFor="">Phone</label>
								<Field type="text" className="form-control" name="phone" />
							</div>
							<button type="submit" className="btn btn-primary" disabled={!formik.isValid || isLoading}>
								{isLoading ? <Spinner size="sm" animation="border" role="status"></Spinner> : null} Login
							</button>
						</Form>
					)}
				</Formik>
			</div>
		</div>

		{/*____________TOAST________*/}
				<Toast show={showA} onClose={toggleShowA} style={{
		      position: 'absolute',
		      bottom: 20,
		      right: 20,
		    }}>
		    	<Toast.Header className="text-success">
		    		Successfully Registered
			    </Toast.Header>
        </Toast>
	</div>
}

export default Register