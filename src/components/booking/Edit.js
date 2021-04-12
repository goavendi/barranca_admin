import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import BASE_URL from "../../environment";
import { useParams } from "react-router-dom";
import moment from 'moment'

import * as Yup from "yup";

// import axios from 'axios'
// import BASE_URL from '../../environment'

import Noty  from 'noty'
import '../../../node_modules/noty/lib/noty.css'
import '../../../node_modules/noty/lib/themes/mint.css'

const NewBooking = () => {
  
  // const history = useHistory();
  const params = useParams()
  const [isLoading, setLoading] = React.useState(false);
  // const [errors, setErrors] = React.useState([]);

  const [initialValues, setValues] = React.useState({
    guestFirstName: "",
    guestLastName: "",
    roomNumber: "",
    dateCheckin: "",
    dateCheckout: "",
  })

  const validationSchema = Yup.object({
    guestFirstName: Yup.string().required("Required"),
    guestLastName: Yup.string().required("Required"),
    roomNumber: Yup.string().required("Required"),
    dateCheckin: Yup.string().required("Required"),
  });

  React.useEffect(() => {

    async function fetch() {
      try {
        const response = await axios({
          url: `${BASE_URL}/booking/${params.id}`
        })
        let data = response.data.data;
        setValues({
          guestFirstName: data.guestId.firstName,
          guestLastName: data.guestId.lastName,
          roomNumber: data.roomId.number.toString(),
          dateCheckin: moment(data.dateCheckin).format("yyyy-MM-DD"),
          dateCheckout: moment(data.dateCheckout).format("yyyy-MM-DD")
        })
      } catch (err) {
        console.log(err, "$$$$");
      }
    }

    fetch()

  },[params.id])

  const submit = async (values) => {
    setLoading(true)

    try {
      await axios({
        url: `${BASE_URL}/booking/${params.id}`,
        method: "put",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          guestFirstName: values.guestFirstName,
          guestLastName: values.guestLastName,
          roomNumber: values.roomNumber,
          dateCheckin: values.dateCheckin,
          dateCheckout: values.dateCheckout
        },
      });
      setLoading(false);

      /*NOTIFY*/
        new Noty({
          text: "Booking updated succesfully",
          type: "success",
          layout: "bottomRight",
          closeWith: ['click', 'button'],
          timeout: 3000
          // theme: 'mint'
        }).show();

      // history.push("/booking");
    } catch (err) {
      console.log(err)

      /*NOTIFY*/
        new Noty({
          text: "Error updating. Please try again",
          type: "error",
          layout: "bottomRight",
          closeWith: ['click', 'button'],
          timeout: 3000
        }).show();
      // let error = err.response.data.error;
      // if (error.details) setErrors(error.details);
      // else alert("ERROR: " + error.message);
      // setLoading(false);
    }

  };

  return (
    <div id="app__content" className="page_booking content-padding">
      <h3 className="page__heading">Edit Booking</h3>

      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={submit} enableReinitialize>
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
            </div>

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
              </div>
            </div>

          
            <button
              type="submit"
              className="btn btn-sm btn-black"
              disabled={!formik.isValid || isLoading}
            >
              Update
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default NewBooking;
