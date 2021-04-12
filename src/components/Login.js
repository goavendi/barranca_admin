/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react';
import './Login.css';
import BASE_URL from '../environment';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { useStateValue } from '../context/context';

import { getTanant } from '../services/helper';
/*...subdomain check function...*/
// const isSubdomain = (url) => {
//   url = url || 'http://www.test-domain.com'; // just for the example
//   var regex = new RegExp(/^([a-z]+\/{2})?([\w-]+\.[\w-]+\.\w+)$/);
//   return !!url.match(regex); // make sure it returns boolean
// };

const Login = () => {
  const history = useHistory();
  const [fcmToken, setFcmToken] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [, dispatch] = useStateValue();

  const initialValues = {
    password: '',
    email: '',
  };

  const submit = async (values) => {
    const tenantName = getTanant();
    const payload = { ...values };
    if (fcmToken) payload.fcmToken = fcmToken;
    try {
      setLoading(true);
      const response = await axios({
        url: `${BASE_URL}/auth/login`,
        method: 'post',
        headers: {
          tenant: tenantName || 'avendi',
        },
        data: payload,
      });
      const { data } = response.data;
      if (data.org_details) saveOrgDetails(data.org_details);
      localStorage.setItem('accessToken', data.accessToken);
      setLoading(false);
      dispatch({ type: 'SET_CURRENT_USER', data: data.userInfo });
      history.push('/front-office');
    } catch (err) {
      setLoading(false);
      alert('ERROR');
    }
  };

  const saveOrgDetails = (data) => {
    localStorage.setItem('org_details', JSON.stringify(data));
  };

  useEffect(() => {
    window.addEventListener('message', (message) => {
      const { data } = message;
      if (typeof data === 'string') setFcmToken(data);
    });
  }, []);

  return (
    <div className="container">
      <div id="app__login__page" className="row ">
        <div className="col-sm-4 login__form">
          <h1 id="splash_logo">Avendi Login</h1>
          <div className="clearfix"></div>

          <Formik initialValues={initialValues} onSubmit={submit}>
            {(formik) => (
              <Form>
                <div className="form-group">
                  <label htmlFor="">Email</label>
                  <Field type="text" className="form-control" name="email" />
                </div>
                <div className="form-group">
                  <label htmlFor="">Password</label>
                  <Field
                    type="password"
                    className="form-control"
                    name="password"
                  />
                </div>
                <button
                  disabled={isLoading}
                  type="submit"
                  className="btn btn-primary"
                >
                  Submit
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Login;
