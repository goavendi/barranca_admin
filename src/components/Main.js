import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import Sidebar from './Sidebar';
import FrontOffice from './frontOffice/FrontOffice';
import FoodMenu from './foodMenu/FoodMenu';
import AddFoodMenu from './foodMenu/AddFoodMenu';
import EditFoodMenu from './foodMenu/Edit';
import ManageServices from './ManageServices';
import Members from './members/Members';
import AddMember from './members/AddMember';
import EditMember from './EditMember';

import Booking from './booking/Booking';
import NewBooking from './booking/New';
import EditBooking from './booking/Edit';
import HouseKeeping from './housekeeping/HouseKeeping';
import FoodBeverage from './foodMenu/FoodBeverage';
import PrintBookingDetails from './booking/PrintBookingDetails';
import TravelDesk from './traveldesk';
import AddTravelDesk from './traveldesk/AddNew';
import EditTravelDesk from './traveldesk/Edit';
import LiveChat from './chat';

import Test from './Test';

const Main = () => {
  const access_token = localStorage.getItem('accessToken');
  if (!access_token) {
    return <Redirect to="/login" />;
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-sm-2 d-none d-md-block app__sidebar">
          <Sidebar />
        </div>
        <div className="col-sm-10 no-padding">
          <Switch>
            {/*Bookings*/}
            <Route exact path="/booking" component={Booking} />
            <Route exact path="/booking/new" component={NewBooking} />
            <Route
              exact
              path="/booking/print"
              component={PrintBookingDetails}
            />
            <Route exact path="/booking/edit/:id" component={EditBooking} />
            <Route exact path="/front-office" component={FrontOffice} />
            <Route exact path="/food-beverage" component={FoodBeverage} />
            <Route exact path="/food-menu" component={FoodMenu} />
            <Route exact path="/food-menu/new" component={AddFoodMenu} />
            <Route exact path="/food-menu/edit/:id" component={EditFoodMenu} />
            <Route exact path="/housekeeping" component={HouseKeeping} />
            <Route exact path="/chat" component={LiveChat} />
            <Route exact path="/manage-services" component={ManageServices} />
            <Route exact path="/members" component={Members} />
            <Route exact path="/members/add" component={AddMember} />
            <Route exact path="/members/edit/:id" component={EditMember} />
            <Route exact path="/traveldesk" component={TravelDesk} />
            <Route exact path="/traveldesk/new" component={AddTravelDesk} />
            <Route
              exact
              path="/traveldesk/edit/:id"
              component={EditTravelDesk}
            />

            <Route exact path="/test" component={Test} />
          </Switch>
        </div>
      </div>
    </div>
  );
};

export default Main;
