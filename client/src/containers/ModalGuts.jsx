import React from 'react';
import PostFull from './PostFull';

const ModalGuts = (props) => (

      <div className="modal__dialog">
          <div className="modal__header">
            <h2 className="sr-only" id="modalTitle">{props.title}</h2>
          </div>
          <div className="modal__body">
          	<PostFull
          		id={props.post._id}
              post={props.post}
              closeModal={props.closeModal}
              history={props.history}
          	/>
          </div>
      </div>
    );

export default ModalGuts;
