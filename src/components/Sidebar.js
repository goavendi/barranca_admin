import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import { BsCalendar } from 'react-icons/bs';
import { BsBriefcaseFill, BsBell, BsCheck } from 'react-icons/bs';
import { FaPlane } from 'react-icons/fa';
import { useStateValue } from '../context/context';
import firebase from '../firebase';
import BASE_URL from '../environment';

import './Sidebar.css';

const Sidebar = () => {
  const [{ user }] = useStateValue();
  const location = useLocation();
  const [fcmToken, setFcmToken] = useState('');
  const [loading, setLoading] = useState(false);

  function handleClick(e) {
    e.preventDefault();
  }

  const handleSubscribeClick = (e) => {
    e.preventDefault();
    return requestNotifyPermission();
  };

  const saveUserFcmToken = (token) => {
    return new Promise((resolve, reject) => {
      const avendiUser = localStorage.getItem('avendi_user');
      const jsonUser = avendiUser ? JSON.parse(avendiUser) : null;
      if (jsonUser && jsonUser._id) {
        const data = { fcmToken: token, userId: jsonUser._id };
        axios
          .post(`${BASE_URL}/notify`, data)
          .then((res) => {
            resolve(res.data);
          })
          .catch((err) => reject(err));
      }
    });
  };

  const requestNotifyPermission = () => {
    setLoading(true);
    try {
      const messaging = firebase.messaging();
      Notification.requestPermission()
        .then(() => {
          return messaging.getToken();
        })
        .then((token) => {
          if (token) {
            setTimeout(() => {
              saveUserFcmToken(token).then(() => {
                setFcmToken(token);
              });
            }, 1000);
          }
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(requestNotifyPermission, []);

  return (
    <aside className="">
      <ul className="">
        {user.type === 'admin' ? (
          <li
            className={
              ['/booking', '/booking/new'].includes(location.pathname)
                ? 'active'
                : ''
            }
          >
            <Link to="/booking">
              <BsCalendar />
              Booking status
            </Link>
            <ul>
              <li>
                <Link to="/booking/new">New Booking</Link>
              </li>
            </ul>
          </li>
        ) : null}

        {user.type === 'admin' ? (
          <li
            className={['/members'].includes(location.pathname) ? 'active' : ''}
          >
            <Link to="/members">
              <i className="icon icon-team"></i>Team Members
            </Link>
          </li>
        ) : null}

        {user.type === 'admin' ||
        user.type === 'supervisor' ||
        (user.staffId && user.staffId.department === 'FrontOffice') ? (
          <li
            className={
              ['/front-office'].includes(location.pathname) ? 'active' : ''
            }
          >
            <Link to="/front-office">
              <BsBriefcaseFill />
              Front Office
            </Link>
            <ul>
              {/*<li><a href="/" className="disabled" onClick={(e)=>handleClick(e)}>Extension Pricing</a></li>*/}
              <li>
                <a
                  href="/"
                  className="disabled"
                  onClick={(e) => handleClick(e)}
                >
                  Messages
                </a>
              </li>
            </ul>
          </li>
        ) : null}

        {user.type === 'admin' ||
        user.type === 'supervisor' ||
        (user.staffId && user.staffId.department === 'Housekeeping') ? (
          <li
            className={
              ['/housekeeping', '/manage-services'].includes(location.pathname)
                ? 'active'
                : ''
            }
          >
            <Link to="/housekeeping">
              <i className="icon icon-housekeeping"></i>House Keeping
            </Link>
            {/*<ul>
						<li><Link to='/manage-services'>Manage Services</Link></li>
					</ul>*/}
          </li>
        ) : null}

        {user.type === 'admin' ||
        user.type === 'supervisor' ||
        (user.staffId && user.staffId.department === 'FoodBeverage') ? (
          <li
            className={
              ['/food-beverage', '/food-menu', '/food-menu/new'].includes(
                location.pathname
              )
                ? 'active'
                : ''
            }
          >
            <Link to="/food-beverage">
              <i className="icon icon-pizza"></i>Food and Beverages
            </Link>

            {user.type === 'admin' ? (
              <ul>
                <li>
                  <Link to="/food-menu">Manage Menu</Link>
                </li>
                <li>
                  <Link to="/food-menu/new">Add Menu</Link>
                </li>
              </ul>
            ) : null}
          </li>
        ) : null}
        {user.type === 'admin' || user.type === 'supervisor' ? (
          <li
            style={{ display: 'none' }}
            className={
              ['/traveldesk', '/traveldesk/new'].includes(location.pathname)
                ? 'active'
                : ''
            }
          >
            <Link to="/traveldesk">
              <FaPlane />
              Traveldesk
            </Link>

            {user.type === 'admin' ? (
              <ul>
                <li>
                  <Link to="/traveldesk">List Traveldesk</Link>
                </li>
                <li>
                  <Link to="/traveldesk/new">Add New</Link>
                </li>
              </ul>
            ) : null}
          </li>
        ) : null}

        <li>
          {fcmToken ? (
            <span>
              <BsCheck /> Subscribed to Notification
            </span>
          ) : (
            <a href="#subscribe" onClick={(e) => handleSubscribeClick(e)}>
              <BsBell />
              {loading ? 'Subscribing to notification..' : 'Click to subscibe'}
            </a>
          )}
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
