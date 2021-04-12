import React from 'react';
import ChatThumbnail from '../../assets/image/chat1.png';
import SearchIcon from '../../assets/icons/search.svg';

import '../../assets/chat.css';

export default function Index() {
  return (
    <div id="app__content" className="content-padding">
      <section className="avn_chat_area">
        <div className="avn_chat_row">
          <div className="avn_col_2">
            <div className="avn_single_services">
              <div className="avn_search_box">
                <h3>Front Office</h3>
                <form action>
                  <input type="text" placeholder="Search" />
                  <button type="submit">
                    <img src={SearchIcon} alt="Search Icon" />
                  </button>
                </form>
              </div>
              <div className="avn_chat_box">
                <div className="avn_single_chat_items chat_active">
                  <div className="avn_chat_logo">
                    <img src={ChatThumbnail} alt="Chat thumbnail" />
                  </div>
                  <div className="avn_chat_title">
                    <h3>Andy Bernard</h3>
                    <p>Great thank you, this is ver…</p>
                    <span>09:23</span>
                  </div>
                </div>
                <div className="avn_single_chat_items">
                  <div className="avn_chat_logo">
                    <img src={ChatThumbnail} alt="Chat thumbnail" />
                  </div>
                  <div className="avn_chat_title">
                    <h3>Creed Bratton</h3>
                    <p>This is a sample message…</p>
                    <span>09:23</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="avn_col_3">
            <div className="avn_chating_area">
              {/* items box */}
              <div className="avn_chating_top">
                <div className="avn_cname_box">
                  <div className="avn_cname_logo">
                    <img src={ChatThumbnail} alt="Chat Thumbnail" />
                  </div>
                  <div className="avn_chat_title">
                    <h3>Andy Bernard</h3>
                    <p>Room 1203</p>
                  </div>
                </div>
                <div className="avn_ctop_buttno">
                  <div className="avn_ctop_chack">
                    <a href="#target">
                      <img src={ChatThumbnail} alt="Chat Thumbnail" />
                    </a>
                  </div>
                  <div className="avn_onOff_btn">
                    <input id="checkbox" type="checkbox" className="checkbox" />
                    <label htmlFor="checkbox" className="switch">
                      <span className="switch__circle">
                        <span className="switch__circle-inner" />
                      </span>
                      <span className="switch__left" />
                      <span className="switch__right" />
                    </label>
                  </div>
                </div>
              </div>
              {/* items box */}
              {/* items box */}
              <div className="avn_cwriting_box">
                <div className="input_output_text" id="scroll">
                  <ul>
                    <li className="left_send_msg">
                      <div className="c_logo">
                        <img src={ChatThumbnail} alt="Chat Thumbnail" />
                      </div>
                      <div className="msg_left_items">
                        <div className="single_send_msg">
                          <p>
                            This is another sample message of how <br />
                            it can be if its a longer message
                          </p>
                        </div>
                        <div className="single_send_msg">
                          <p>This is another sample message</p>
                        </div>
                        <span className="send_time">09:23</span>
                      </div>
                    </li>
                    <li className="right_send_msg">
                      <div className="msg_right_items">
                        <div className="single_send_msg">
                          <p>
                            This is a sample message of how it would look like
                          </p>
                        </div>
                        <span className="send_time">09:23</span>
                      </div>
                    </li>
                    <li className="left_send_msg">
                      <div className="c_logo">
                        <img src={ChatThumbnail} alt="Chat Thumbnail" />
                      </div>
                      <div className="msg_left_items">
                        <div className="single_send_msg">
                          <p>This is another sample message</p>
                        </div>
                        <span className="send_time">09:23</span>
                      </div>
                    </li>
                    <li className="right_send_msg">
                      <div className="msg_right_items">
                        <div className="single_send_msg">
                          <p>
                            This is a sample message of how it would look like
                          </p>
                        </div>
                        <span className="send_time">09:23</span>
                      </div>
                    </li>
                    <li className="left_send_msg">
                      <div className="c_logo">
                        <img src={ChatThumbnail} alt="Chat Thumbnail" />
                      </div>
                      <div className="msg_left_items">
                        <div className="single_send_msg">
                          <p>
                            This is another sample message of how <br />
                            it can be if its a longer message
                          </p>
                        </div>
                        <span className="send_time">09:23</span>
                      </div>
                    </li>
                    <li className="right_send_msg">
                      <div className="msg_right_items">
                        <div className="single_send_msg">
                          <p>
                            This is a sample message of how it would look like
                          </p>
                        </div>
                        <span className="send_time">09:23</span>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="avn_typeing_box">
                  <div className="typeing_row">
                    <div className="type_msg">
                      <input type="text" placeholder="Type your message" />
                    </div>
                    <div className="msg_send_btn">
                      <button type="button">Send Message</button>
                    </div>
                  </div>
                </div>
              </div>
              {/* items box */}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
