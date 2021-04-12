import React from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import moment from 'moment';

export default function PrintBookingDetails(props) {
  const { booking } = props.location.state;

  const printDocument = () => {
    const input = document.getElementById('bookingDetails');
    html2canvas(input).then((canvas) => {
      var imgWidth = 200;
      var imgHeight = (canvas.height * imgWidth) / canvas.width;
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      var position = 10;
      pdf.addImage(imgData, 'JPEG', 15, position, imgWidth, imgHeight);
      pdf.save('booking_details.pdf');
    });
  };

  return (
    <>
      <div id="bookingDetails" style={{ margin: 30 }}>
        <h3>Booking Details</h3>

        <hr />
        <p>
          Guest Name :{' '}
          <strong>
            {booking.guestId.firstName} {booking.guestId.lastName}
          </strong>
        </p>
        <p>
          Room Number : <strong>{booking.roomId.number}</strong>{' '}
        </p>
        <p>
          Checkin Date :{' '}
          <strong>{moment(booking.dateCheckin).format('MMMM Do YYYY')}</strong>
        </p>
        <p>
          Checkout Date :{' '}
          <strong>{moment(booking.dateCheckout).format('MMMM Do YYYY')}</strong>
        </p>
        <p>
          Room Type : <strong>{booking.roomId.type}</strong>
        </p>
      </div>
      <button
        style={{ marginLeft: 30 }}
        onClick={printDocument}
        className="btn btn-primary"
      >
        Export as PDF
      </button>
    </>
  );
}
