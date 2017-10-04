import React from 'react';
import PostFull from './PostFull';

const ModalGuts = (props) => (

      <div className="modal__dialog">
          <div className="modalbig__header">
            <h2 className="sr-only" id="modalTitle">{props.title}</h2>
          </div>
          <div className="modal__body">
          	<PostFull
              onRequestClose={props.onRequestClose}
              post={props.post}
              closeModal={props.closeModal}
              history={props.history}
              shuffle={props.shuffle}
          	/>
          </div>
      </div>
    );

export default ModalGuts;
