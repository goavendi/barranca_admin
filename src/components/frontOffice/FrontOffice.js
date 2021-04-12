import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';

import BASE_URL from '../../environment';
import { BsChevronDown } from 'react-icons/bs';
import { BsClock } from 'react-icons/bs';
import { BsArrowsExpand } from 'react-icons/bs';

// import {BsFillCircleFill} from 'react-icons/bs'
import { usePusher } from '../../context/context';
import { getTanant } from '../../services/helper';

import Noty from 'noty';
import '../../../node_modules/noty/lib/noty.css';
import '../../../node_modules/noty/lib/themes/mint.css';

import './FrontOffice.css';

const FrontOffice = () => {
  const pusher = usePusher();
  const [requests, setRequests] = React.useState([]);
  const [members, setMembers] = React.useState([]);

  const [currentPage, setPage] = React.useState(1);
  const [tdStyle, setTdStyle] = useState({ rowId: null, height: '100px' });

  // const [{globalNotifications}] =useStateValue()

  const fetchRequests = async (page) => {
    let size = 10;
    let page_ = page || currentPage;
    const response = await axios(
      `${BASE_URL}/guest-request?type=front_office&size=${size}&page=${page_}`
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
      const response = await axios(
        `${BASE_URL}/guest-request?type=front_office&size=10&page=1`
      );
      setRequests(response.data.data);
    };

    //timeout for hacks...
    setTimeout(() => {
      fetchRequests();
    }, 200);
  }, []);

  useEffect(() => {
    const childEventCallback = async (data) => {
      const response = await axios(
        `${BASE_URL}/guest-request?type=front_office&size=10&page=1`
      );

      setRequests([]);
      setRequests(response.data.data);
    };
    const channel = pusher.subscribe(getTanant());
    channel.bind('guest_request_front_office', childEventCallback);

    //realtime status broadcast
    channel.bind('guest_request_front_office_update', childEventCallback);

    return () => {
      channel.unbind('guest_request_front_office', childEventCallback);
      channel.unbind('guest_request_front_office_update', childEventCallback);
    };
  }, [requests, pusher]);

  useEffect(() => {
    async function fetchMembers() {
      try {
        const response = await axios(`${BASE_URL}/team`);
        const data = response.data.data.data;
        setMembers(data);
      } catch (err) {
        // alert("_________ERROR_____________________100");
      }
    }
    fetchMembers();
  }, []);

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

      /*NOTIFY*/
      new Noty({
        text: 'Status updated successfully',
        type: 'success',
        layout: 'bottomRight',
        closeWith: ['click', 'button'],
        timeout: 3000,
        // theme: 'mint'
      }).show();
    } catch (err) {
      alert('Status updating failed');
    }
  };

  const assignRequestToStaff = async (e, requestId) => {
    const staffId = e.target.value;
    try {
      await axios({
        url: `${BASE_URL}/guest-request/${requestId}/assign`,
        method: 'put',
        data: {
          assignedTo: staffId,
        },
      });

      /*NOTIFY*/
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

  //   const checkAssigend = (request, index) => {
  //     console.log('ASSIGNED==>', request.assignedTo);
  //     if (request && request.assignedTo) return request.assignedTo._id;
  //     return '';
  //   };

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

  const handleDivExpandClick = (e, requestId) => {
    e.preventDefault();
    if (requestId === tdStyle.rowId) {
      const currentHeight = tdStyle.height === 'auto' ? '100px' : 'auto';
      setTdStyle({ rowId: requestId, height: currentHeight });
    } else {
      setTdStyle({ rowId: requestId, height: 'auto' });
    }
  };

  /* const checkIsNewRequest = (request)=>{
    for(const [,notification] of globalNotifications.entries()){
      if(request._id === notification._id){
        return <BsFillCircleFill className="important_notification" />
      }
    }
  }*/

  return (
    <section id="app__content" className="app__front_office">
      <div className="container no-margin w-100">
        <div className="row">
          <div className="col-sm-12 status__area border-right">
            <h3 className="page__heading">Status</h3>

            <table className="table table__requests">
              <tbody>
                {requests.map((request, index) => {
                  return (
                    <tr key={index + 'request'}>
                      <td>
                        <p className="name">
                          <strong>
                            {request.bookingId
                              ? request.bookingId.guestId.firstName
                              : 'N/A'}{' '}
                            {request.bookingId
                              ? request.bookingId.guestId.lastName
                              : ''}
                          </strong>
                        </p>
                        <p className="room">
                          Room{' '}
                          {request.bookingId
                            ? request.bookingId.roomId.number
                            : 'N/A'}
                        </p>
                        <p className="action__room">
                          <span id="" className="">
                            {request.requestType}
                          </span>
                        </p>
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
                          {/*checkIsNewRequest(request)*/}
                          {request.details}
                        </p>
                        <p className="status">
                          <strong>{request.completionBy}</strong>
                          <br />
                          <span>
                            <a
                              href="#target"
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
                          className="select-member"
                          onChange={(e) => {
                            assignRequestToStaff(e, request._id);
                          }}
                          defaultValue={
                            request.assignedTo ? request.assignedTo._id : ''
                          }
                        >
                          <option value=""> Unassigned </option>
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
                        {/*<p className="text-success">{request.status}</p>*/}
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

          {/*<div className="col-sm-5 extensions__area" >

					<h3 className="page__heading">Extensions</h3>

					<table className="table table__extensions">
						<tbody>
							<tr>
								<td>
									<p><strong>Michael Scott</strong></p>
									<p>Room 1204</p>
									<p className="date"><BsArrowUpRight /> 20th Aug 20</p>
									<button className="btn btn-sm btn-black">Message</button>
								</td>
								<td>
									<p><BsArrowsAngleContract /> extending upto <br /><strong>30th Aug 20</strong></p>
									<p className="price"><BsCreditCard /> AED300</p>
								</td>
								<td>
									<p className="text-warning">On going</p>
								</td>
							</tr>

							<tr>
								<td>
									<p><strong>Michael Scott</strong></p>
									<p>Room 1204</p>
									<p className="date"><BsArrowUpRight /> 20th Aug 20</p>
									<button className="btn btn-sm btn-black">Message</button>
								</td>
								<td>
									<p><BsArrowsAngleContract /> extending upto <br /><strong>30th Aug 20</strong></p>
									<p className="price"><BsCreditCard /> AED300</p>
								</td>
								<td>
									<p className="text-warning">On going</p>
								</td>
							</tr>


							<tr>
								<td>
									<p><strong>Michael Scott</strong></p>
									<p>Room 1204</p>
									<p className="date"><BsArrowUpRight />20th Aug 20</p>
									<button className="btn btn-sm btn-black">Message</button>
								</td>
								<td>
									<p><BsArrowsAngleContract /> extending upto <br /><strong>30th Aug 20</strong></p>
									<p className="price"><BsCreditCard /> AED300</p>
								</td>
								<td>
									<p className="text-warning">On going</p>
								</td>
							</tr>

							<tr>
								<td>
									<p><strong>Michael Scott</strong></p>
									<p>Room 1204</p>
									<p className="date"><BsArrowUpRight /> 20th Aug 20</p>
									<button className="btn btn-sm btn-black">Message</button>
								</td>
								<td>
									<p>extending upto <br /><strong>30th Aug 20</strong></p>
									<p className="price"><BsCreditCard /> AED300</p>
								</td>
								<td>
									<p className="text-warning">On going</p>
								</td>
							</tr>
						</tbody>
					</table>
				</div>*/}
        </div>
      </div>
    </section>
  );
};

export default FrontOffice;
