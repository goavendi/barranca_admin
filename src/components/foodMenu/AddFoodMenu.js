import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { BsTrash } from 'react-icons/bs';
import { FaEdit } from 'react-icons/fa';

import { useHistory } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../../environment';
import { generateUID } from '../../utils';
import ModalWrapper from '../global/ModalWrapper';
import { CURRENCIES } from '../../constants';

import './FoodMenu.css';

const AddFoodMenu = () => {
  const history = useHistory();

  const [menuImage, setMenuImage] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [optionName, setOptionName] = useState('');
  const [optionPrice, setOptionPrice] = useState('');
  const [optionsList, setOptions] = useState([]);
  const [currencyModal, setCurrencyModal] = useState(false);
  const [currencyList, setCurrencyList] = useState([]);
  const [selectCurrency, setSelectedCurrency] = useState('');
  const [currentCurrency, setCurrentCurrency] = useState('USD');
  const [orgDetailsChanged, setOrgDetailsChanged] = useState(false);

  const toggleCurrencyModal = (e) => {
    if (e) e.preventDefault();
    setCurrencyModal(!currencyModal);
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Required'),
    description: Yup.string().required('Required'),
    categories: Yup.string().required('Required'),
    price: Yup.string().required('Required'),
  });

  const initialValues = {
    name: '',
    description: '',
    categories: '',
    price: '',
    menuType: 'breakfast',
    dietaryRestrictions: '',
  };

  const submit = async (values) => {
    const formData = new FormData();
    for (let key in values) {
      formData.append(key, values[key]);
    }

    if (menuImage) formData.append('image', menuImage);

    if (optionsList && optionsList.length)
      formData.append('options', JSON.stringify(optionsList));

    setLoading(true);
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
  };

  const handleRemoveFromListClick = (optionId) => {
    const newList = optionsList.filter((item) => item.id !== optionId);
    setOptions(newList);
  };

  const handleOptionAddClick = () => {
    if (!optionName || !optionPrice) {
      alert('Please enter option name and price!');
      return;
    }
    const option = { name: optionName, price: optionPrice };
    option.id = generateUID();
    setOptions([...optionsList, option]);
    setOptionName('');
    setOptionPrice('');
  };

  const handleOptionNameChange = (e) => setOptionName(e.target.value);
  const handleOptionPriceChange = (e) => setOptionPrice(e.target.value);

  const handleProfileImage = (e) => {
    const file = e.target.files[0];
    setMenuImage(file);
  };

  const handleCurrencyChange = (e) => {
    setSelectedCurrency(e.value);
  };

  const handleOrgDetailsSubmit = async (e) => {
    e.preventDefault();
    if (!selectCurrency) {
      alert('Please select your curency');
      return;
    }
    try {
      const res = await submitOrgDetailsReqeust({ currency: selectCurrency });
      const { data } = res.data;
      saveOrgDetails(data);
      setOrgDetailsChanged(!orgDetailsChanged);
      toggleCurrencyModal();
    } catch (err) {
      console.log('ERR==>', err);
    }
  };

  const saveOrgDetails = (data) => {
    localStorage.setItem('org_details', JSON.stringify(data));
  };

  const getOrgDetails = () => {
    let data = localStorage.getItem('org_details');
    if (data) return JSON.parse(data);
    return null;
  };

  const submitOrgDetailsReqeust = (payload) => {
    return axios({
      url: `${BASE_URL}/user/org_details`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      data: payload,
    });
  };

  const fetchOrgDetails = () => {
    const org_details = getOrgDetails();
    if (org_details) setCurrentCurrency(org_details.currency);
  };

  const fetchCurrencyList = () => {
    let currencyArr = [];
    if (CURRENCIES.length) {
      for (let item of CURRENCIES) {
        let obj = { value: item.code, label: `${item.name}(${item.symbol})` };
        currencyArr.push(obj);
      }
      setCurrencyList(currencyArr);
    }
  };

  useEffect(fetchOrgDetails, [orgDetailsChanged]);
  useEffect(fetchCurrencyList, []);

  return (
    <div id="app__content" className="page__add__food content-padding">
      <ModalWrapper
        title="Set Currency"
        isOpen={currencyModal}
        toggleModal={toggleCurrencyModal}
        handleSubmit={handleOrgDetailsSubmit}
      >
        <div className="form-group">
          <label>Select Currency</label>
          <Select onChange={handleCurrencyChange} options={currencyList} />
        </div>
      </ModalWrapper>
      <h3 className="page__heading">Add Menu Item</h3>
      <div>
        <span>
          Your Currency : <strong>{currentCurrency}</strong>
          <a
            style={{ textDecoration: 'none' }}
            onClick={toggleCurrencyModal}
            title="Edit currency"
            href="#set_currency"
          >
            {' '}
            &nbsp;
            <FaEdit />{' '}
          </a>
        </span>
      </div>
      <hr />
      <Formik
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={submit}
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
              <div className="form-group">
                <label>Image</label>
                <input
                  type="file"
                  name="image"
                  className="form-control form-control-sm"
                  onChange={handleProfileImage}
                />
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
    </div>
  );
};

export default AddFoodMenu;
