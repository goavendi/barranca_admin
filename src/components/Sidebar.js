import React from 'react';

import { Link, useLocation } from 'react-router-dom';
import { useStateValue } from '../context/context';

import './Sidebar.css';

const Sidebar = () => {
  const [{ user }] = useStateValue();
  const location = useLocation();

  //   const requestNotifyPermission = () => {
  //     setLoading(true);
  //     try {
  //       const messaging = firebase.messaging();
  //       Notification.requestPermission()
  //         .then(() => {
  //           return messaging.getToken();
  //         })
  //         .then((token) => {
  //           if (token) {
  //             setTimeout(() => {
  //               saveUserFcmToken(token).then(() => {
  //                 setFcmToken(token);
  //               });
  //             }, 1000);
  //           }
  //           setLoading(false);
  //         })
  //         .catch(() => {
  //           setLoading(false);
  //         });
  //     } catch (err) {
  //       setLoading(false);
  //     }
  //   };

  //   useEffect(requestNotifyPermission, []);

  return (
    <aside className="">
      <ul className="">
        {/* {user.type === 'admin' ? (
          <li
            className={['/members'].includes(location.pathname) ? 'active' : ''}
          >
            <Link to="/members">
              <i className="icon icon-team"></i>Team Members
            </Link>
          </li>
        ) : null} */}

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

        {/* <li>
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
        </li> */}
      </ul>
    </aside>
  );
};

export default Sidebar;
