import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const PostActions = (props) => {
  if (props.postOwner) {
    return (
      <div>
        <Link className="f-nav__icon-link" to={`/editpost/${props.post._id}`}>Edit
        </Link>
        <span
          className="f-nav__icon-link pointer"
          to={`/editpost/${props.post._id}`}
          onClick={() => props.deleteHandler.deletePost()}
          role="button"
          tabIndex="0"
        >
          Delete
        </span>
      </div>
    );
  }

  // Else
  return (
    <div>
      <Link className="f-nav__icon-link" to={'/connection'}>
        Request Connection
      </Link>
    </div>
  );
};

/*PostActions.propTypes = {
  postOwner: PropTypes.boolean.isRequired,
  post: (PropTypes.shape(
    'active': PropTypes.string.isRequired,
    '_id': PropTypes.string.isRequired,
    'author': PropTypes.string.isRequired,
    'availability': PropTypes.string.isRequired,
    'body': PropTypes.string.isRequired,
    'keywords': PropTypes.array,
    'role': PropTypes.string.isRequired,
    'title': PropTypes.string.isRequired,
    'updatedAt': PropTypes.date.isRequired,
    'createdAt': PropTypes.date.isRequired,
  )).isRequired,
  deleteHandler: PropTypes.function.isRequired,
};
*/
export default PostActions;
