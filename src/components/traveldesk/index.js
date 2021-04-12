import React, { useState, useEffect } from 'react';
import { FaPen } from 'react-icons/fa';
import ReactPaginate from 'react-paginate';
import { useHistory, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

import axios from 'axios';
import BASE_URL from '../../environment';

export default function Index() {
  const history = useHistory();
  const [pageCount, setPageCount] = useState(1); // Total pages
  const [travelDeskList, setTravelDeskList] = useState([]);
  const [selectedPage, setSelectedPage] = useState(1);

  const handlePageClick = (data) => {
    let page = data.selected + 1;
    setSelectedPage(page);
  };

  useEffect(() => {
    async function fetchMenu() {
      try {
        const response = await axios(
          `${BASE_URL}/traveldesk?page=${selectedPage}`
        );
        const { data } = response;
        setTravelDeskList(data.data);
        setPageCount(Math.ceil(data.meta.total / data.meta.size));
      } catch (err) {
        Swal.fire('ERROR', 'Internal server error!', 'error');
      }
    }
    fetchMenu(selectedPage);
  }, [selectedPage]);

  const handleAddClick = () => {
    history.push('/traveldesk/new');
  };

  return (
    <>
      <section id="app__content" className="content-padding">
        <h3 className="page__heading float-left">Traveldesk List</h3>
        <button
          type="button"
          onClick={handleAddClick}
          className="btn btn-sm btn-black btn-add-menu"
        >
          Add New
        </button>
        <table className="table">
          <tbody>
            {travelDeskList && travelDeskList.length > 0 ? (
              travelDeskList.map((item) => {
                return (
                  <tr key={item._id}>
                    <td width="40%">
                      <p>
                        <strong>{item.title}</strong>
                      </p>
                    </td>
                    <td>
                      <p>{item.category}</p>
                    </td>
                    <td className="price">
                      <p>
                        <strong>{item.price}</strong>
                      </p>
                    </td>
                    <td>
                      <p>{item.status}</p>
                    </td>
                    <td className="menu__action" width="250px">
                      <Link
                        to={`/traveldesk/edit/${item._id}`}
                        className="btn btn-sm"
                      >
                        <strong>
                          <FaPen /> Edit
                        </strong>
                      </Link>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td>No travel data.</td>
              </tr>
            )}
          </tbody>
        </table>

        <ReactPaginate
          containerClassName="app__pagination"
          subContainerClassName={'pages pagination'}
          activeClassName={'active'}
          pageCount={pageCount}
          onPageChange={handlePageClick}
        />
      </section>
    </>
  );
}
