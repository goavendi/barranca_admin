import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';

import BASE_URL from '../../environment';
import { getTanant } from '../../services/helper';

import { usePusher } from '../../context/context';
import { BsChevronDown } from 'react-icons/bs';
import { BsClock } from 'react-icons/bs';
import { BsArrowsExpand } from 'react-icons/bs';

import Noty from 'noty';
import '../../../node_modules/noty/lib/noty.css';
import '../../../node_modules/noty/lib/themes/mint.css';

// import * as serviceWorker from '../../serviceWorker';

const FoodBeverage = () => {
  const pusher = usePusher();
  const [requests, setRequests] = useState([]);
  const [members, setMembers] = useState([]);

  const [currentPage, setPage] = useState(1);
  const [tdStyle, setTdStyle] = useState({ rowId: null, height: '100px' });

  // const [{globalNotifications}] =useStateValue()

  const fetchRequests = async (page) => {
    let size = 10;
    let page_ = page || currentPage;
    const response = await axios(
      `${BASE_URL}/guest-request?type=housekeeping&size=${size}&page=${page_}`
    );
    return response.data.data;
  };

  const loadMore = async () => {
    let page = currentPage + 1;
    let response = await fetchRequests(page);

    const newRequests = [...requests, ...response];
    setRequests(newRequests);

    setPage(page);
  };

  useEffect(() => {
    const fetchRequests = async () => {
      const response = await axios(`${BASE_URL}/guest-request?type=foodandbev`);
      setRequests(response.data.data);
    };

    setTimeout(async () => {
      fetchRequests();
    }, 200);
  }, []);

  useEffect(() => {
    const childEventCallback = async (data) => {
      /* const options = {
        body:data.details,
        vibrate: [200, 100, 200, 100, 200, 100, 200],
      };
      serviceWorker.app_SW.showNotification(data.requestType, options)*/

      const response = await axios(
        `${BASE_URL}/guest-request?type=foodandbev&size=10&page=1`
      );

      setRequests([]);
      setRequests(response.data.data);
    };

    const channel = pusher.subscribe(getTanant());

    channel.bind('guest_request_foodandbev', childEventCallback);

    //REALTIME STATUS BROADCAST
    channel.bind('guest_request_foodandbev_update', childEventCallback);

    return () => {
      channel.unbind('guest_request_foodandbev', childEventCallback);
      channel.unbind('guest_request_foodandbev_update', childEventCallback);
    };
  }, [requests, pusher]);

  useEffect(() => {
    async function fetchMembers() {
      try {
        const response = await axios(`${BASE_URL}/team`);
        setMembers(response.data.data.data);
      } catch (err) {
        alert('_________ERROR_____________________');
      }
    }
    fetchMembers();
  }, []);

  const assignRequestToStaff = async (e, requestId) => {
    const staffId = e.target.value;
    try {
      await axios({
        url: `${BASE_URL}/guest-request/${requestId}/assign`,
        method: 'put',
        data: { assignedTo: staffId },
      });

      /*NOTIFICATION.....*/
      new Noty({
        text: 'Request assigned successfully',
        type: 'success',
        layout: 'bottomRight',
        closeWith: ['click', 'button'],
        timeout: 3000,
        // theme: 'mint'
      }).show();
    } catch (err) {
      alert('Request assigning failed');
    }
    // /api/guest-request/:requestId/assign
  };

  const updateStatus = async (e, requestId) => {
    const status = e.target.value;

    //select color change...
    const target = e.target;
    const color = getColor(status);
    const newClassName = target.className.replace(/(?:orange|green)/i, '');
    target.className = `${newClassName} ${color}`;

    try {
      await axios({
        url: `${BASE_URL}/guest-request/${requestId}`,
        method: 'put',
        data: { status },
      });

      new Noty({
        text: 'Status updated successfully',
        type: 'success',
        layout: 'bottomRight',
        closeWith: ['click', 'button'],
        timeout: 3000,
        // theme: 'mint'
      }).show();

      // alert("Status updated successfully");
    } catch (err) {
      alert('Status updating failed');
    }
  };

  const getColor = (status) => {
    switch (status) {
      case 'In-Progress':
        return 'orange';

      case 'Completed':
        return 'green';

      default:
        return '';
    }
  };

  /* const checkIsNewRequest = (request)=>{
    for(const [,notification] of globalNotifications.entries()){
      if(request._id === notification._id){
        return <BsFillCircleFill className="important_notification" />
      }
    }
  }
*/

  const handleDivExpandClick = (e, requestId) => {
    e.preventDefault();
    if (requestId === tdStyle.rowId) {
      const currentHeight = tdStyle.height === 'auto' ? '100px' : 'auto';
      setTdStyle({ rowId: requestId, height: currentHeight });
    } else {
      setTdStyle({ rowId: requestId, height: 'auto' });
    }
  };

  const handleClockClick = (e) => {
    e.preventDefault();
  };

  return (
    <section id="app__content" className="app__front_office">
      <div className="container">
        <div className="row">
          <div className="col-sm-12 status__area">
            <h3 className="page__heading">Status</h3>

            <table className="table table__requests">
              <tbody>
                {requests.map((request, index) => {
                  return (
                    <tr key={index + 'request'}>
                      <td>
                        <p className="name">
                          <strong>
                            {request.guestId
                              ? request.guestId.lastName
                              : 'No guest!'}{' '}
                          </strong>
                        </p>
                        <p className="room">
                          Villa:{' '}
                          {request.guestId && request.guestId.villaName
                            ? request.guestId.villaName.replace(/_/g, ' ')
                            : 'N/A'}{' '}
                        </p>
                        {/*<p className="action__room"><span id="" className="">Change Room</span></p>*/}
                      </td>
                      <td
                        style={{
                          height:
                            tdStyle && tdStyle.rowId === request._id
                              ? tdStyle.height
                              : '100px',
                        }}
                      >
                        <p>
                          <a
                            href="#target"
                            onClick={(e) =>
                              handleDivExpandClick(e, request._id)
                            }
                          >
                            <BsArrowsExpand />
                          </a>{' '}
                          &nbsp;
                          {request.details}
                        </p>
                        <p className="status">
                          <strong>{request.completionBy}</strong>
                          <br />
                          <span>
                            <a
                              href="#target"
                              onClick={(e) => handleClockClick(e)}
                              data-toggle="tooltip"
                              title="Requested At"
                            >
                              <BsClock />
                            </a>{' '}
                            &nbsp;
                            {''}
                            {moment(request.createdAt).format(
                              'MMMM Do YYYY, h:mm:ss a'
                            )}
                          </span>
                        </p>
                      </td>
                      <td>
                        <p className="label">Assigned to</p>
                        <select
                          className={'select-member'}
                          onChange={(e) => {
                            assignRequestToStaff(e, request._id);
                          }}
                          defaultValue={
                            request.assignedTo ? request.assignedTo._id : ''
                          }
                        >
                          <option>Unassigned</option>
                          {members.map((member, memberIndex) => {
                            return (
                              <option
                                key={memberIndex + 'member'}
                                value={member.userId._id}
                              >
                                {member.userId.firstName}{' '}
                                {member.userId.lastName}
                              </option>
                            );
                          })}
                        </select>
                      </td>
                      <td>
                        <select
                          className={
                            'select-status ' + getColor(request.status)
                          }
                          defaultValue={request.status}
                          onChange={(e) => {
                            updateStatus(e, request._id);
                          }}
                        >
                          <option value="Not Assigned">Not Assigned</option>
                          <option value="In-Progress">In-Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="app_load_more">
              <span className="app_show_more_action" onClick={() => loadMore()}>
                Show More <BsChevronDown />
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FoodBeverage;
