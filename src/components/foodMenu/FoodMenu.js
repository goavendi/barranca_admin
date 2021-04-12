import React, { useEffect, useState } from 'react';
import { FaPen } from 'react-icons/fa';
import { BsTrash } from 'react-icons/bs';
import { GiInfo } from 'react-icons/gi';

import axios from 'axios';
import BASE_URL from '../../environment';

import { useHistory, Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';

const FoodMenu = () => {
  const history = useHistory();
  const [menuItems, setMenuItems] = useState([]);

  /*for pagination...*/
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    async function fetchMenu() {
      try {
        const response = await axios(`${BASE_URL}/food-menu`);
        setMenuItems(response.data.data);

        //pagination
        setPageCount(
          Math.ceil(response.data.meta.total / response.data.meta.size)
        );
      } catch (err) {
        alert('ERROR');
      }
    }

    fetchMenu();
  }, []);

  const gotoAddMenu = () => {
    history.push('/food-menu/new');
  };

  const deleteItem = async (id, index) => {
    if (window.confirm('Do you want to delete?')) {
      try {
        await axios({
          method: 'delete',
          url: `${BASE_URL}/food-menu/${id}`,
        });

        // alert("DELETED SUCCESSFULLY")
        const items = [...menuItems];
        items.splice(index, 1);
        setMenuItems(items);
      } catch (err) {
        alert('ERROR');
      }
    }
  };

  const handlePageClick = async (data) => {
    try {
      let page = data.selected + 1;
      const response = await axios(
        `${BASE_URL}/food-menu?size=10&page=${page}`
      );
      setMenuItems(response.data.data);

      //pagination
      setPageCount(
        Math.ceil(response.data.meta.total / response.data.meta.size)
      );
    } catch (err) {
      alert('ERROR');
    }
  };

  return (
    <section id="app__content" className="content-padding">
      <h3 className="page__heading float-left">All Menu Items</h3>
      <button
        className="btn btn-sm btn-black btn-add-menu"
        onClick={gotoAddMenu}
      >
        Add Menu
      </button>
      <table className="table">
        <tbody>
          {menuItems.map((item, index) => {
            return (
              <tr key={`item_${index}`}>
                <td width="40%">
                  <p>
                    <strong>{item.name}</strong>
                  </p>
                  <p>{item.description}</p>
                </td>
                <td className="price">
                  <p>
                    <strong>{item.price}</strong>
                  </p>
                </td>
                <td className="menuType">
                  <p>{item.menuType}</p>
                </td>
                <td>{item.image ? 'Image Uploaded' : 'Image Not Uploaded'}</td>
                {/*<td className="image"><img src="https://picsum.photos/40/40" alt="menu" /></td>*/}
                <td className="menu__action" width="250px">
                  <button className="btn btn-sm">
                    <strong>
                      <GiInfo /> Details
                    </strong>
                  </button>

                  <Link
                    to={`/food-menu/edit/${item._id}`}
                    className="btn btn-sm"
                  >
                    <strong>
                      <FaPen /> Edit
                    </strong>
                  </Link>
                  <button
                    className="btn btn-sm"
                    onClick={() => {
                      deleteItem(item._id, index);
                    }}
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
    </section>
  );
};

export default FoodMenu;
