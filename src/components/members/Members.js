import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../../environment';
import { FaPen, FaUserCircle } from 'react-icons/fa';
import { BsTrash } from 'react-icons/bs';

import ReactPaginate from 'react-paginate';

import './Member.css';

const Members = () => {
  const [pageCount, setPageCount] = useState(0);

  const [members, setMembers] = React.useState([]);

  useEffect(() => {
    async function fetchMembers() {
      try {
        const response = await axios(`${BASE_URL}/team/staffs`);
        setMembers(response.data.data.data);
        /*for pagination*/
        setPageCount(
          Math.ceil(
            response.data.data.meta.total / response.data.data.meta.size
          )
        );
      } catch (err) {
        alert('_________ERROR_____________________');
      }
    }
    fetchMembers();
  }, []);

  const deleteMember = async (id, index) => {
    if (window.confirm('Are you sure?')) {
      try {
        await axios({
          method: 'delete',
          url: `${BASE_URL}/user/${id}`,
        });

        const _members = [...members];
        _members.splice(index, 1);
        setMembers(_members);
      } catch (err) {
        alert('ERROR DELETING');
      }
    }
  };

  const handlePageClick = async (data) => {
    try {
      let page = data.selected + 1;
      const response = await axios(
        `${BASE_URL}/team/staffs?size=10&page=${page}`
      );
      setMembers(response.data.data.data);
      //pagination
      setPageCount(
        Math.ceil(response.data.data.meta.total / response.data.data.meta.size)
      );
    } catch (err) {
      alert('ERROR');
    }
  };

  return (
    <div id="app__content" className="page__members content-padding">
      <h2 className="page__heading float-left">Team Members</h2>

      <Link to="/members/add" className="btn btn-sm btn-black float-right ">
        Add Member
      </Link>

      <table className="table table__members">
        <tbody>
          {members.map((member, index) => {
            return (
              <tr key={`member_${index}`}>
                <td style={{ width: '7%' }}>
                  {member.userId.imageUrl ? (
                    <img
                      src={member.userId.imageUrl}
                      alt="member"
                      className="member__img rounded-circle"
                    />
                  ) : (
                    <FaUserCircle size={54} style={{ color: '#e9e9e9' }} />
                  )}
                </td>
                <td>
                  <strong className="member__name">
                    {member.userId.firstName} {member.userId.lastName}
                  </strong>
                  <span className="member__staff__id">
                    Staff ID: {member.staffId}
                  </span>
                </td>
                {/*<td><strong>{member.userId.phone}</strong></td>*/}
                {/*<td>4.2 stars rating</td>*/}
                <td>
                  <strong>{member.department}</strong>
                </td>
                <td>
                  <Link
                    to={`/members/edit/${member.userId._id}`}
                    className="btn btn-sm"
                  >
                    <FaPen /> Edit
                  </Link>
                  <button
                    className="btn btn-sm btn-delete"
                    onClick={() => {
                      deleteMember(member.userId._id, index);
                    }}
                  >
                    <BsTrash /> Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* PAGINATION */}

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

export default Members;
