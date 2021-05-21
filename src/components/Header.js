import React, { useState /*useEffect*/ } from 'react';
import { Link } from 'react-router-dom';

import { AiFillSetting } from 'react-icons/ai';
import { IoIosNotifications } from 'react-icons/io';
// import {Dropdown} from 'react-bootstrap'

import { BsGrid3X3Gap, BsChatDots } from 'react-icons/bs';

import Sidebar from './Sidebar';
import { usePusher, useStateValue } from '../context/context';

import { getTanant } from '../services/helper';

import './Header.css';
import logo from '../assets/image/barranca_logo.png';

import { useHistory } from 'react-router-dom';

const Header = () => {
  const pusher = usePusher();
  const history = useHistory();
  const [menuState, setMenuState] = useState('hidden');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notify, setNotify] = useState(false);

  const notificationRef = React.useRef();
  const acMenuRef = React.useRef();

  const [showACMenu, setShowACMenu] = useState(false);

  const [, dispatch] = useStateValue();

  const toggleMenu = () => {
    menuState === 'hidden' ? setMenuState('shown') : setMenuState('hidden');
  };

  React.useEffect(() => {
    function childEventCallback(data) {
      const new_notification = [data, ...notifications];
      setNotifications(new_notification);

      dispatch({ type: 'SET_NOTIFICATIONS', data: new_notification });
      setNotify(true);
    }

    const channel = pusher.subscribe(getTanant());
    channel.bind('guest_request_front_office', childEventCallback);
    channel.bind('guest_request_housekeeping', childEventCallback);
    channel.bind('guest_request_foodandbev', childEventCallback);
    return () => {
      channel.unbind('guest_request_front_office', childEventCallback);
      channel.unbind('guest_request_housekeeping', childEventCallback);
      channel.unbind('guest_request_foodandbev', childEventCallback);
    };
  }, [notifications, pusher, dispatch]);

  /*external click detection*/
  React.useEffect(() => {
    document.onclick = (e) => {
      if (acMenuRef.current && !acMenuRef.current.contains(e.target)) {
        setShowACMenu(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target)
      ) {
        setShowNotifications(false);
      }
    };
  }, []);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setNotify(false);
  };

  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('avendi_user');
    localStorage.clear();
    history.push('/login');
    // dispatch({type: "LOGOUT"})
  };

  const getACMenu = () => {
    if (showACMenu) {
      return (
        <ul className="dropdown">
          <li onClick={(e) => logout(e)}>Logout</li>
        </ul>
      );
    }
  };

  const handleACMenu = (e) => {
    e.preventDefault();
    showACMenu ? setShowACMenu(false) : setShowACMenu(true);
  };

  return (
    <React.Fragment>
      <div className={`app__sidebar app__mobile__menu ${menuState}`}>
        <button
          type="button"
          className="close app__menu__close"
          aria-label="Close"
          onClick={() => toggleMenu()}
        >
          <span aria-hidden="true">&times;</span>
        </button>
        <Sidebar />
      </div>

      <header id="app__header" className="sticky-top">
        <div className="container-fluid main">
          <div className="row">
            <div className="col-sm-12">
              <div className="app__nav__top clearfix">
                <span
                  className="d-done d-sm-block d-md-none "
                  id="sidemenu__toggle"
                  onClick={(e) => toggleMenu(e)}
                >
                  <BsGrid3X3Gap />
                </span>

                <h1 id="logo">
                  <img
                    src={logo}
                    alt="Hotel Barranca"
                    style={{ padding: '20px', height: '70px', width: 'auto' }}
                  />
                </h1>

                <nav id="app__account__nav">
                  <ul>
                    <li style={{ display: 'none' }}>
                      <span>
                        <Link to="/chat" title="Live Chat">
                          <BsChatDots />
                        </Link>
                      </span>
                    </li>
                    &nbsp;
                    <li ref={notificationRef} style={{ display: 'none' }}>
                      <span
                        className={showNotifications ? 'active' : null}
                        onClick={(e) => toggleNotifications(e)}
                      >
                        <IoIosNotifications color="grey" size={24} />
                        {notify ? <i className="notify-dot"></i> : null}
                      </span>

                      {showNotifications ? (
                        <ul className="app_notifications">
                          {notifications.length ? (
                            notifications.map((notification, index) => {
                              return (
                                <li key={index + '_notification'}>
                                  <h4>{notification.completionBy}</h4>
                                  <p className="room">
                                    {notification.bookingId.roomId.number}
                                  </p>
                                  <p className="info">{notification.details}</p>
                                </li>
                              );
                            })
                          ) : (
                            <li>
                              <p>No notifications</p>
                            </li>
                          )}
                        </ul>
                      ) : null}
                    </li>
                    <li ref={acMenuRef} className="app__account__menu">
                      <a href="/" onClick={(e) => handleACMenu(e)}>
                        <AiFillSetting color="grey" size={24} />
                      </a>
                      {getACMenu()}
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </header>
    </React.Fragment>
  );
};

export default Header;
