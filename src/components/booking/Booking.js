import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import BASE_URL from '../../environment';
import { FaPen } from 'react-icons/fa';
import { BsTrash } from 'react-icons/bs';
import 'jspdf-autotable';
import jsPDF from 'jspdf';

import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';
import moment from 'moment';

const Booking = () => {
  const [pageCount, setPageCount] = useState(0);
  const [pageRefresh, setPageRefresh] = useState(false);
  const [searchRoomNumber, setSearchRoomNumber] = useState('');

  const [bookings, setBooking] = useState([]);
  const [allBookings, setAllBookings] = useState([]);

  useEffect(() => {
    axios.get(`${BASE_URL}/booking/all`).then((res) => {
      setAllBookings(res.data.data);
    });
  }, []);

  useEffect(() => {
    let FETCH_URL = `${BASE_URL}/booking`;
    if (searchRoomNumber)
      FETCH_URL = `${BASE_URL}/booking?roomNumber=${searchRoomNumber}`;
    const fetchBooking = async () => {
      const response = await axios(`${FETCH_URL}`);
      setBooking(response.data.data);

      setPageCount(
        Math.ceil(response.data.meta.total / response.data.meta.size)
      );
    };

    fetchBooking();
  }, [pageRefresh, searchRoomNumber]);

  const deleteBooking = async (bookingId) => {
    try {
      const res = await axios({
        url: `${BASE_URL}/booking/${bookingId}`,
        method: 'delete',
      });
      if (res) setPageRefresh(!pageRefresh);
      Swal.fire('SUCCESS', 'Booking deleted successfully', 'success');
    } catch (err) {
      Swal.fire('ERROR', 'Internal server error', 'error');
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    const isConfirm = await Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      html: `Booking details will be deleted`,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    });
    if (isConfirm.value) {
      return deleteBooking(bookingId);
    }
  };

  const handlePageClick = async (data) => {
    try {
      let page = data.selected + 1;
      const response = await axios(`${BASE_URL}/booking?size=10&page=${page}`);
      setBooking(response.data.data);
      setPageCount(
        Math.ceil(response.data.meta.total / response.data.meta.size)
      );
    } catch (err) {
      alert('ERROR');
    }
  };

  const handleRoomNumberChange = (e) => {
    setSearchRoomNumber(e.target.value);
  };

  const exportPDF = (e) => {
    e.preventDefault();
    const unit = 'pt';
    const size = 'A4'; // Use A1, A2, A3 or A4
    const orientation = 'portrait'; // portrait or landscape

    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);
    doc.setFontSize(15);

    const title = 'Booking Report';
    const headers = [
      [
        'Guest Name',
        'Room Number',
        'Room Type',
        'Checkin Date',
        'Checkout Date',
      ],
    ];

    console.log('All==>', allBookings);

    const data = allBookings.map((booking) => [
      booking.guestId.firstName + ' ' + booking.guestId.lastName,
      booking.roomId.number,
      booking.roomId.type,
      moment(booking.dateCheckin).format('MMMM Do YYYY'),
      moment(booking.dateCheckout).format('MMMM Do YYYY'),
    ]);

    let content = {
      startY: 50,
      head: headers,
      body: data,
    };

    doc.text(title, marginLeft, 40);
    doc.autoTable(content);
    doc.save('booking_report.pdf');
  };

  return (
    <div id="app__content" className="content-padding">
      <h2 className="page__heading float-left">Bookings</h2>

      <div className="float-right" style={{ marginBottom: 5 }}>
        <input
          value={searchRoomNumber}
          onChange={handleRoomNumberChange}
          type="text"
          name="roomNumber"
          placeholder="Search by room number..."
        />
        <button
          type="button"
          style={{ marginLeft: 5, marginBottom: 5 }}
          className="btn btn-sm btn-primary"
          onClick={(e) => exportPDF(e)}
        >
          Export as PDF
        </button>
      </div>
      <table className="table">
        <tbody>
          {bookings.map((booking, index) => {
            return (
              <tr key={index + '__'}>
                <td>
                  <strong>
                    {booking.guestId.firstName} {booking.guestId.lastName}
                  </strong>
                </td>
                <td>{booking.roomId.number}</td>
                <td>{booking.roomId.type}</td>
                <td>
                  <strong className="text-info">{booking.status}</strong>
                </td>
                <td>{moment(booking.dateCheckin).format('MMMM Do YYYY')}</td>
                <td>{moment(booking.dateCheckout).format('MMMM Do YYYY')}</td>
                <td>
                  <Link
                    to={`booking/edit/${booking._id}`}
                    className="btn btn-sm"
                  >
                    <strong>
                      <FaPen /> Edit
                    </strong>
                  </Link>
                  <button
                    className="btn btn-sm"
                    onClick={() => handleDeleteBooking(booking._id)}
                  >
                    <strong>
                      <BsTrash /> Delete
                    </strong>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <ReactPaginate
        containerClassName="app__pagination"
        subContainerClassName={'pages pagination'}
        activeClassName={'active'}
        pageCount={pageCount}
        onPageChange={handlePageClick}
      />
    </div>
  );
};

export default Booking;
