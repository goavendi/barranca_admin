import React from 'react';
import { Form, Modal } from 'react-bootstrap';

export default function ModalWrapper(props) {
  const { title, children, isOpen, toggleModal, handleSubmit } = props;
  return (
    <>
      <Modal show={isOpen} className="popup_area show" onHide={toggleModal}>
        <Modal.Header closeButton>
          <span className="modal-title">{title || 'Modal Title'}</span>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>{children || 'No child elements supplied.'}</Modal.Body>
          <Modal.Footer>
            <div className="ha_button pop_button">
              <input type="submit" value="Submit" readOnly />
            </div>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
