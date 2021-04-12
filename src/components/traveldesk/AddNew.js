import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';

import BASE_URL from '../../environment';
import { TRAVEL_DESK_CATEGORIES } from '../../constants';

export default function AddNew() {
  const validationSchema = Yup.object({
    title: Yup.string().required('Required'),
    maxCapacity: Yup.number().required('Required'),
    minCapacity: Yup.number().required('Required'),
    price: Yup.string().required('Required'),
    travelDuration: Yup.number().required('Required'),
    overview: Yup.string().required('Required'),
  });

  const initialValues = {
    title: '',
    imageUrl: '',
    minCapacity: '',
    maxCapacity: '',
    travelDuration: '',
    category: '',
    price: '',
    overview: '',
    pickupInfo: '',
    expectations: '',
  };

  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [featuredImg, setFeaturedImg] = useState(null);

  const submitTravelDesk = (values) => {
    const formData = new FormData();
    for (let key in values) {
      formData.append(key, values[key]);
    }
    if (featuredImg) formData.append('image', featuredImg);
    return submitRequest(formData);
  };

  const submitRequest = async (payload) => {
    setIsLoading(true);
    try {
      await axios({
        url: `${BASE_URL}/traveldesk`,
        method: 'post',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: payload,
      });
      setIsLoading(false);
      history.push('/traveldesk');
    } catch (err) {
      setIsLoading(false);
      Swal.fire('ERROR', 'Internal server error!', 'error');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setFeaturedImg(file);
  };

  return (
    <>
      <div id="app__content" className="page__add__food content-padding">
        <h3 className="page__heading">Add Traveldesk Item</h3>
        <Formik
          validationSchema={validationSchema}
          initialValues={initialValues}
          onSubmit={submitTravelDesk}
        >
          {(formik) => {
            return (
              <Form>
                <div className="form-group">
                  <label>Title</label>
                  <Field
                    type="text"
                    name="title"
                    className="form-control form-control-sm"
                    placeholder="Enter suitable title"
                  />
                  <ErrorMessage
                    component="span"
                    name="title"
                    className="text-danger"
                  />
                </div>

                <div className="form-group row">
                  <div className="col-sm-6">
                    <label>Price</label>
                    <Field
                      type="text"
                      min="1"
                      name="price"
                      className="form-control form-control-sm"
                      placeholder="Eg. 10"
                    />
                    <ErrorMessage
                      component="span"
                      name="price"
                      className="text-danger"
                    />
                  </div>

                  <div className="col-sm-6">
                    <label>Category</label>

                    <Field
                      as="select"
                      className="form-control form-control-sm"
                      name="category"
                    >
                      <option value="">--Select Category--</option>
                      {TRAVEL_DESK_CATEGORIES.map((category) => {
                        return (
                          <option key={category.id} value={category.value}>
                            {category.label}
                          </option>
                        );
                      })}
                    </Field>
                  </div>
                </div>

                <div className="form-group row">
                  <div className="col-sm-4">
                    <label>Travel Duration</label>
                    <Field
                      type="number"
                      min="1"
                      name="travelDuration"
                      className="form-control form-control-sm"
                      placeholder="Enter nos of travel days"
                    />
                    <ErrorMessage
                      component="span"
                      name="travelDuration"
                      className="text-danger"
                    />
                  </div>
                  <div className="col-sm-4">
                    <label>Minimum Capacity</label>
                    <Field
                      type="number"
                      min="1"
                      name="minCapacity"
                      className="form-control form-control-sm"
                      placeholder="Eg: 2"
                    />
                    <ErrorMessage
                      component="span"
                      name="minCapacity"
                      className="text-danger"
                    />
                  </div>
                  <div className="col-sm-4">
                    <label>Maximum Capacity</label>
                    <Field
                      type="number"
                      min="1"
                      name="maxCapacity"
                      className="form-control form-control-sm"
                      placeholder="Eg: 10"
                    />
                    <ErrorMessage
                      component="span"
                      name="maxCapacity"
                      className="text-danger"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Pickup Info</label>
                  <Field
                    type="text"
                    name="pickupInfo"
                    className="form-control form-control-sm"
                    placeholder="Enter pickup information"
                  />
                  <ErrorMessage
                    component="span"
                    name="categoryId"
                    className="text-danger"
                  />
                </div>

                <div className="form-group">
                  <label>Overview</label>
                  <Field
                    as="textarea"
                    name="overview"
                    className="form-control form-control-sm"
                    placeholder="Write detail overview. "
                  />
                  <ErrorMessage
                    component="span"
                    name="overview"
                    className="text-danger"
                  />
                </div>

                <div className="form-group">
                  <label>Expectations</label>
                  <Field
                    as="textarea"
                    name="expectations"
                    className="form-control form-control-sm"
                  />
                </div>

                <div className="form-group">
                  <label>Image</label>
                  <input
                    type="file"
                    name="image"
                    className="form-control form-control-sm"
                    onChange={handleImageUpload}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-sm btn-black"
                  disabled={!formik.isValid || isLoading}
                >
                  Submit
                </button>
              </Form>
            );
          }}
        </Formik>
      </div>
    </>
  );
}
