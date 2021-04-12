import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { BsTrash } from 'react-icons/bs';

import { useParams } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../../environment';
import { useHistory } from 'react-router-dom';

import Noty from 'noty';
import { generateUID } from '../../utils';

import '../../../node_modules/noty/lib/noty.css';
import '../../../node_modules/noty/lib/themes/mint.css';

const MenuForm = ({ mode }) => {
  const history = useHistory();

  const params = useParams();
  const [menuImage, setMenuImage] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [optionName, setOptionName] = useState('');
  const [optionPrice, setOptionPrice] = useState('');
  const [optionsList, setOptionsList] = useState([]);
  const [initialValues, setValues] = useState({
    name: '',
    description: '',
    categories: '',
    price: '',
    menuType: '',
    dietaryRestrictions: '',
    image: '',
  });

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axios(`${BASE_URL}/food-menu/${params.id}`);
        const res = response.data.data;
        if (res.options && res.options.length) setOptionsList(res.options);
        setValues(res);
      } catch (err) {
        alert(err.response);
      }
    };
    fetchItem();
  }, [params]);

  const validationSchema = Yup.object({
    name: Yup.string().required('Required'),
    description: Yup.string().required('Required'),
    // categoryId: Yup.string().required("Required"),
    price: Yup.string().required('Required'),
  });

  const submit = async (values) => {
    /**/
    delete values._id;
    delete values.__v;
    delete values.image;
    delete values.createdAt;
    delete values.updatedAt;

    if (optionsList) values.options = JSON.stringify(optionsList);
    const formData = new FormData();

    for (let key in values) {
      formData.append(key, values[key]);
    }

    if (menuImage) formData.append('image', menuImage);
    setLoading(true);

    if (mode === 'EDIT') {
      try {
        await axios({
          url: `${BASE_URL}/food-menu/${params.id}`,
          method: 'put',
          data: formData,
        });
        setLoading(false);

        /*NOTIFY*/
        new Noty({
          text: 'Menu updated succesfully',
          type: 'success',
          layout: 'bottomRight',
          closeWith: ['click', 'button'],
          timeout: 3000,
          // theme: 'mint'
        }).show();
      } catch (err) {
        setLoading(false);
        alert('ERROR');
      }
    } else {
      try {
        await axios({
          url: `${BASE_URL}/food-menu`,
          method: 'post',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          data: formData,
        });
        setLoading(false);
        history.push('/food-menu');
      } catch (err) {
        setLoading(false);
        alert('ERROR');
      }
    }
  };

  const handleProfileImage = (e) => {
    const file = e.target.files[0];
    setMenuImage(file);
  };

  const handleRemoveFromListClick = (optionId) => {
    const newList = optionsList.filter((item) => item.id !== optionId);
    setOptionsList(newList);
  };

  const handleOptionAddClick = () => {
    if (!optionName || !optionPrice) {
      alert('Please enter option name and price!');
      return;
    }
    const option = { name: optionName, price: optionPrice };
    option.id = generateUID();
    setOptionsList([...optionsList, option]);
    setOptionName('');
    setOptionPrice('');
  };

  const handleOptionNameChange = (e) => setOptionName(e.target.value);
  const handleOptionPriceChange = (e) => setOptionPrice(e.target.value);

  return (
    <React.Fragment>
      <Formik
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={submit}
        enableReinitialize
      >
        {(formik) => {
          return (
            <Form>
              <div className="form-group">
                <label>Item Name</label>
                <Field
                  type="text"
                  name="name"
                  className="form-control form-control-sm"
                  placeholder="Eg. Chicken Curry"
                />
                <ErrorMessage
                  component="span"
                  name="name"
                  className="text-danger"
                />
              </div>

              <div className="form-group row">
                <div className="col-sm-6">
                  <label>Price</label>
                  <Field
                    type="text"
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
                  <label>Menu Type</label>

                  <Field
                    as="select"
                    className="form-control form-control-sm"
                    name="menuType"
                  >
                    <option value="breakfast">breakfast</option>
                    <option value="lunch">lunch</option>
                    <option value="dinner">dinner</option>
                    <option value="all day">all day</option>
                    <option value="beverage">beverage </option>
                    <option value="dessert">dessert</option>
                    <option value="other">other</option>
                  </Field>
                </div>
              </div>

              <div className="form-group">
                <label>Sub-categories</label>
                <Field
                  type="text"
                  name="categories"
                  className="form-control form-control-sm"
                  placeholder="Enter Sub-categories"
                />
                <ErrorMessage
                  component="span"
                  name="categoryId"
                  className="text-danger"
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <Field
                  as="textarea"
                  name="description"
                  className="form-control form-control-sm"
                  placeholder="Eg. Chicken pieces are cooked in a deliciously seasoned curry sauce then finished off with cream for richness and cilantro for color and freshness. "
                />
                <ErrorMessage
                  component="span"
                  name="description"
                  className="text-danger"
                />
              </div>

              <div className="form-group">
                <label>Dietary Restrictions</label>
                <Field
                  type="text"
                  name="dietaryRestrictions"
                  className="form-control form-control-sm"
                  placeholder="Eg. Lactose intolerant"
                />
              </div>
              <div className="form-group menu__item">
                <label>Image</label>
                <input
                  type="file"
                  name="image"
                  className="form-control form-control-sm"
                  onChange={handleProfileImage}
                />
                {mode === 'EDIT' && initialValues.image ? (
                  <img
                    src={initialValues.image}
                    alt={initialValues.name}
                    width="100"
                    height="100"
                  />
                ) : null}
              </div>

              <div className="form-group row">
                <div className="col-sm-8">
                  <div className="form-group">
                    <input
                      name="optionName"
                      className="form-control"
                      placeholder="Enter option name"
                      value={optionName}
                      onChange={handleOptionNameChange}
                    />
                  </div>
                </div>
                <div className="col-sm-2">
                  <div className="form-group">
                    <input
                      name="optionPrice"
                      type="number"
                      className="form-control"
                      placeholder="Enter option price"
                      value={optionPrice}
                      onChange={handleOptionPriceChange}
                    />
                  </div>
                </div>
                <div className="col-sm-2">
                  <button
                    onClick={handleOptionAddClick}
                    type="button"
                    className="btn btn-sm btn-black"
                  >
                    Add New
                  </button>
                </div>
              </div>

              <div className="form-group">
                {optionsList && optionsList.length
                  ? optionsList.map((item) => {
                      return (
                        <div key={item.id}>
                          <button
                            onClick={() => handleRemoveFromListClick(item.id)}
                            className="btn btn-sm btn_default"
                          >
                            {item.name} - {item.price} &nbsp;
                            <BsTrash />
                          </button>
                        </div>
                      );
                    })
                  : ''}
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
    </React.Fragment>
  );
};

export default MenuForm;
