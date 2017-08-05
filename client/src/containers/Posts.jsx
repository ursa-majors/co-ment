import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import * as Actions from '../store/actions/postActions';

class Posts extends React.Component {

  componentDidMount() {
    axios.get('https://co-ment.glitch.me/api/posts', {
      headers: {
        Authorization: `Bearer ${this.props.appState.authToken}`,
      },
    })
    .then((response) => {
      this.props.actions.setPosts(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  render() {
    return (
      <div className="container posts">
        <div className="posts__header">
          Posts
          <span className="form__button-wrap">
            <Link to="/addpost">
              <button className="splash__button pointer" id="btn-login">
                <i className="fa fa-plus-square-o" />
              </button>
            </Link>
          </span>
        </div>
        <div className="posts__body">
          <div className="row">
            <div className="column">AUTHOR</div>
            <div className="column">TITLE</div>
            <div className="column">DATE POSTED</div>
          </div>
          {
            this.props.posts.entries.map((item) => {
              return (
                <div className="row" key={item._id}>
                  <div className="column">{item.author}</div>
                  <Link to={`/viewpost/${item._id}`}>
                    <div className="column">{item.title}</div>
                  </Link>
                  <div className="column">{item.updated}</div>
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  appState: state.appState,
  posts: state.posts,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Posts);
