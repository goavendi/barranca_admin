import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/custom.css';

import { useLocation, useHistory, Switch, Route } from 'react-router-dom';

import Header from './components/Header';
import Main from './components/Main';
import Login from './components/Login';
import Register from './components/Register';
// import Footer from './components/Footer'
import Admin from './pages/Admin';

// import Pusher from 'pusher-js';

// import { getTanant } from './services/helper';
// import * as serviceWorker from './serviceWorker';

import { useStateValue } from './context/context';

import * as authService from './services/authService';
authService.init();

// const pusher = new Pusher('dd973fb6b3feeb4df833', {
//   cluster: 'ap2',
// });

/* --------- IMPORTANT web notification for the first time ------ */
// if (Notification.permission !== 'denied') {
//   Notification.requestPermission().then((permission) => {});
// }

function App(prop) {
  const history = useHistory();
  const location = useLocation();
  const [, dispatch] = useStateValue();

  React.useEffect(() => {
    const access_token = localStorage.getItem('accessToken');
    if (access_token) {
      const userLS = JSON.parse(localStorage.getItem('avendi_user'));
      dispatch({ type: 'SET_CURRENT_USER', data: userLS });
    }
  }, [dispatch, history]);

  /*THIS IS FOR CHROME MOBILE NOTIFICATION*/
  //   React.useEffect(() => {
  //     console.info("REGISTER: GLOBAL pusher listener for service worker notification");

  //     const childEventCallback =async (data)=>{
  //       const options = {
  //         body:data.details,
  //         vibrate: [200, 100, 200, 100, 200, 100, 200],
  //       };
  //       serviceWorker.app_SW.showNotification(data.requestType, options)
  //     }

  //     const channel = pusher.subscribe(getTanant());
  //     channel.bind("guest_request_foodandbev", childEventCallback);
  //     channel.bind("guest_request_housekeeping", childEventCallback);
  //     channel.bind("guest_request_front_office", childEventCallback);

  //     return () => {
  //       channel.bind("guest_request_front_office", childEventCallback);
  //       channel.bind("guest_request_housekeeping", childEventCallback);
  //       channel.unbind("guest_request_foodandbev", childEventCallback);
  //     };
  //   }, []);

  const routes = ['/login', '/register', '/', '/admin'];

  /*This routes have seperate designs || Segragated*/
  if (routes.includes(location.pathname)) {
    return (
      <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/admin" component={Admin} />
      </Switch>
    );
  }

  return (
    <React.Fragment>
      <Header />
      <Main />
    </React.Fragment>
  );
}

export default App;
