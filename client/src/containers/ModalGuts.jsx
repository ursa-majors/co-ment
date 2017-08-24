import React from 'react';
import PostFull from './PostFull';

const ModalGuts = (props) => (

      <div className="modal__dialog">
        <div className="modal__content">
          <div className="modal__header">
            <button
              type="button"
              onClick={props.closeModal}
              className="post__modal__close--x"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">×</span>
            </button>
            <h2 className="sr-only" id="modalTitle">{props.title}</h2>
          </div>
          <div className="modal__body">
          	<PostFull
          		id={props.post._id}
              post={props.post}
          	/>
          </div>
      </div>
      </div>
    );

export default ModalGuts;
