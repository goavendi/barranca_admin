import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import BASE_URL from "../../environment";
import { useHistory } from "react-router-dom";

// import axios from 'axios'
// import BASE_URL from '../../environment'

const NewBooking = () => {
  const initialValues = {
    guestFirstName: "",
    guestLastName: "",
    roomNumber: "",
    dateCheckin: "",
    dateCheckout: "",
  };

  const history = useHistory();
  const [isLoading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState([]);

  const submit = async (values) => {
    setLoading(true);
    try {
      await axios({
        url: `${BASE_URL}/booking`,
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          guestFirstName: values.guestFirstName,
          guestLastName: values.guestLastName,
          roomNumber: values.roomNumber,
          // description: values.description,
          // description: "default description",
          dateCheckin: values.dateCheckin,
          dateCheckout: values.dateCheckout,
          creditCard: false,
        },
      });
      setLoading(false);
      history.push("/booking");
    } catch (err) {
      let error = err.response.data.error;
      if (error.details) setErrors(error.details);
      else alert("ERROR: " + error.message);
      setLoading(false);
    }
  };

  const emesg = (param) => {
    let msg;
    errors.forEach((e) => {
      if (e.param === param) {
        msg = e.message + " ";
      }
    });
    return msg;
  };

  return (
    <div id="app__content" className="page_booking content-padding">
      <h3 className="page__heading">New Booking</h3>

      <Formik initialValues={initialValues} onSubmit={submit}>
        {(formik) => (
          <Form>
            <div className="form-group row">
              <div className="col-sm-6">
                <label>First Name</label>
                <Field
                  type="text"
                  name="guestFirstName"
                  className="form-control form-control-sm"
                  placeholder=""
                />
                <ErrorMessage
                  component="span"
                  name="guestFirstName"
                  className="text-danger"
                />
                <span className="text-danger">{emesg("guestFirstName")}</span>
              </div>
              <div className="col-sm-6">
                <label>Last Name</label>
                <Field
                  type="text"
                  name="guestLastName"
                  className="form-control form-control-sm"
                  placeholder=""
                />
                <ErrorMessage
                  component="span"
                  name="guestLastName"
                  className="text-danger"
                />
                <span className="text-danger">{emesg("guestLastName")}</span>
              </div>
            </div>

            <div className="form-group">
              <label>Room Number</label>
              <Field
                type="text"
                name="roomNumber"
                className="form-control form-control-sm"
                placeholder=""
              />
              <ErrorMessage
                component="span"
                name="roomNumber"
                className="text-danger"
              />
              <span className="text-danger">{emesg("roomNumber")}</span>
            </div>

            {/* <div className="form-group">
              <label>Description</label>
              <Field
                as="textarea"
                name="description"
                className="form-control form-control-sm"
                placeholder=""
              />
              <ErrorMessage
                component="span"
                name="description"
                className="text-danger"
              />
              <span className="text-danger">{emesg("description")}</span>
            </div> */}

            <div className="form-group row">
              <div className="col-sm-6">
                <label>Check in</label>
                <Field
                  type="date"
                  name="dateCheckin"
                  className="form-control form-control-sm"
                  placeholder=""
                />
                <ErrorMessage
                  component="span"
                  name="dateCheckin"
                  className="text-danger"
                />
                <span className="text-danger">{emesg("dateCheckin")}</span>
              </div>

              <div className="col-sm-6">
                <label>Check out</label>
                <Field
                  type="date"
                  name="dateCheckout"
                  className="form-control form-control-sm"
                  placeholder=""
                />
                <ErrorMessage
                  component="span"
                  name="dateCheckout"
                  className="text-danger"
                />
                <span className="text-danger">{emesg("dateCheckout")}</span>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-sm btn-black"
              disabled={!formik.isValid || isLoading}
            >
              Add Booking
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default NewBooking;
