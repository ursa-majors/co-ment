import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import InputAutosuggest from './InputAutosuggest';
import { skills, adjustTextArea } from '../utils';
import parseSKill from '../utils/skillsparser';

import * as Actions from '../store/actions/postActions';
import * as apiActions from '../store/actions/apiPostActions';

class EditPost extends React.Component {

  // For a URL with a specific ID param
  componentDidMount() {
    if (this.props.match.params.id) {
      // copy the current post properties into the editable object
      this.props.actions.setEditPost(this.props.posts.currentPost);
    }
  }

  componentDidUpdate() {
    adjustTextArea(this.textInput);
  }

  // Reset form on unmount
  componentWillUnmount() {
    this.props.actions.resetForm();
  }

  // handle autosuggest selection
  onChange = (id, newValue) => {
    this.props.actions.setFormField(id, newValue);
  }

  // event handler for form inputs...sets the state value based on element id
  handleChange = (event) => {
    // limit post body to 620 chars
    if (event.target.id === 'content' && event.target.value.length > 620) {
      event.preventDefault();
      return null;
    }
    // handle input
    this.props.actions.setFormField(event.target.id, event.target.value);
    // expand textarea height to match content
    if (event.target.id === 'content') {
      adjustTextArea(this.textInput);
    }
    return null;
  }

  // Add Keywords on Comma or Enter
  handleKeyPressAdd = (e) => {
    if (e.charCode === 44 || e.which === 44 || e.charCode === 13 || e.which === 13) {
      e.preventDefault();
      this.addKeyword();
    }
  }

  // event handler for checkbox change
  handleCheckboxChange = (e) => {
    const active = e.target.checked;
    this.props.actions.setFormField('active', active);
  }

  // keywords are entered into a text input, this function pushes them
  // into the array that goes to the DB. Ignore dupes.
  addKeyword = () => {
    const newWord = this.props.posts.editForm.keyword;
    for (let i = 0; i < this.props.posts.editForm.keywords.length; i += 1) {
      if (this.props.posts.editForm.keywords[i] === newWord) {
        this.props.actions.setFormField('keyword', '');
        return;
      }
    }
    this.props.actions.addKeyword(parseSKill(newWord));
  }

  // remove keyword with keyboard
  handleKeyPressRemove = (event) => {
    if (event.charCode === 13 || event.which === 13) {
      this.removeKeyword(event);
    }
  }

  // allow user to remove the keywords
  removeKeyword = (event) => {
    for (let i = 0; i < this.props.posts.editForm.keywords.length; i += 1) {
      if (this.props.posts.editForm.keywords[i] === event.target.id) {
        this.props.actions.removeKeyword(i);
        break;
      }
    }
  }

  validateInputs = () => {
    let msg = '';
    if (this.props.posts.editForm.title === '') {
      msg = 'Title is required.  ';
    }
    if (this.props.posts.editForm.content === '') {
      msg += 'Post content is required. ';
    }
    if (this.props.posts.editForm.keywords.length === 0) {
      msg += 'At least 1 keyword is required.';
    }
    if (msg.length > 0) {
      this.props.actions.setFormField('errMsg', msg);
      this.props.actions.setFormField('hideErr', '');
      return false;
    }
    return true;
  }

  savePost = () => {
    // clear previous errors
    this.props.actions.setFormField('hideErr', 'hidden');

    // if user has entered a keyword, but not added it to the array, add it now
    if (this.props.posts.editForm.keyword !== '') {
      this.addKeyword();
    }
    // check for required fields
    // message will be displayed; exit if validate fails
    if (!this.validateInputs()) { return; }

    let excerpt;
    if (this.props.posts.editForm.content.length > 140) {
      excerpt = this.props.posts.editForm.content.substr(0, 140);
    } else {
      excerpt = null;
    }

    const body = {
      author: this.props.profiles.userProfile.username,
      author_id: this.props.profiles.userProfile._id,
      author_name: this.props.profiles.userProfile.name,
      author_avatar: this.props.profiles.userProfile.avatarUrl,
      author_timezone: this.props.profiles.userProfile.time_zone,
      author_languages: this.props.profiles.userProfile.languages,
      author_gender: this.props.profiles.userProfile.gender,
      role: this.props.posts.editForm.role,
      title: this.props.posts.editForm.title,
      body: this.props.posts.editForm.content,
      excerpt,
      keywords: this.props.posts.editForm.keywords,
      active: this.props.posts.editForm.active,
      availability: '',
    };

    if (this.props.posts.editForm.update) {
      this.props.api.modifyPost(this.props.appState.authToken, this.props.match.params.id, body)
        .then(() => {
          this.props.history.push('/posts');
        });
    } else {
      this.props.api.addPost(this.props.appState.authToken, body)
      .then(() => {
        this.props.history.push('/posts');
      });
    }
  }

  render() {
    return (
      <div className="posts">
        <div className="form__body">
          <div className="form__header">{this.props.match.params.id ? 'Edit Post' : 'New Post'}</div>
          <div className="form__input-group">
            <label htmlFor="ghUserName" className="form__label">Title
            </label>
            <input
              className="form__input"
              type="text"
              id="title"
              name="ghUserName"
              value={this.props.posts.editForm.title}
              onChange={e => this.handleChange(e)}
              placeholder="Title"
            />
          </div>
          <div className="form__input-group">
            <label htmlFor="role" className="form__label">Role
            </label>
            <select className="form__input form__input--select" value={this.props.posts.editForm.role} id="role" onChange={event => this.handleChange(event)} >
              <option value="mentor" id="mentor">Mentor</option>
              <option value="mentee" id="mentee">Mentee</option>
            </select>
          </div>


          <div className="form__input-group">
            <label htmlFor="keyword" className="form__label">
              Keywords
            </label>
            <div>
              {this.props.posts.editForm.keywords.map(skill => (
                <span className="skill-value" key={skill}>
                  <span className="skill-value__icon" aria-hidden="true">
                    <span
                      className="skill"
                      id={skill}
                      role="button"
                      tabIndex="0"
                      onClick={e => this.removeKeyword(e)}
                      onKeyDown={e => this.handleKeyPressRemove(e)}
                    >
                       &times;
                    </span>
                  </span>
                  <span className="skill-value__label" role="option" aria-selected="true">
                    {skill}
                    <span className="skill-aria-only">&nbsp;</span>
                  </span>
                </span>
              ))}
            </div>
            <InputAutosuggest
              className="form__input"
              id="keyword"
              name="keyword"
              placeholder="Add Keywords"
              onChange={this.onChange}
              list={skills}
              onKeyPress={e => this.handleKeyPressAdd(e)}
              value={this.props.posts.editForm.keyword}
              addTag={this.addKeyword}
              removeTag={this.removeKeyword}
              ref={(instance) => { this.skillInput = instance; }}
            />
          </div>
          <div className="form__input-group">
            <label htmlFor="content" className="form__label">Post Body
            </label>
            <textarea
              className="form__input"
              id="content"
              name="content"
              value={this.props.posts.editForm.content}
              onChange={e => this.handleChange(e)}
              ref={(input) => { this.textInput = input; }}
              placeholder="Add post content (limit 620 characters)"
              maxLength="620"
            />
            {this.props.posts.editForm.content &&
              <div className="character-count"> {620 - this.props.posts.editForm.content.length} characters remaining</div> }
          </div>
          <div className="form__input-group" >
            <input
              className="form__input--option form__input--checkbox"
              type="checkbox"
              id="active"
              name="active"
              onChange={this.handleCheckboxChange}
              value={this.props.posts.editForm.active}
              checked={this.props.posts.editForm.active}
            />
            <label htmlFor="active" className="form__label--checkbox">Publish this post? (uncheck to deactivate)</label>
          </div>

          <div className="form__input-group">
            <div className={`form__error ${this.props.posts.editForm.hideErr}`}>
              {this.props.posts.editForm.errMsg}
            </div>
          </div>
          <div className="form__input-group">
            <div className="form__button-wrap">
              <button className="form__button pointer" id="btn-add" onClick={() => this.savePost()}>&nbsp;Save&nbsp;</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

EditPost.propTypes = {
  actions: PropTypes.shape({
    clearCurrentPost: PropTypes.func,
    resetForm: PropTypes.func,
    setFormField: PropTypes.func,
    setEditPost: PropTypes.func,
    addKeyword: PropTypes.func,
    removeKeyword: PropTypes.func,
  }).isRequired,
  api: PropTypes.shape({
    viewPost: PropTypes.func,
    modifyPost: PropTypes.func,
    addPost: PropTypes.func,
  }).isRequired,
  appState: PropTypes.shape({
    loggedIn: PropTypes.bool,
    authToken: PropTypes.string,
    user: PropTypes.shape({
      _id: PropTypes.string,
      avatarUrl: PropTypes.string,
      username: PropTypes.string,
    }).isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  posts: PropTypes.shape({
    editForm: PropTypes.shape({
      keyword: PropTypes.string,
      keywords: PropTypes.arrayOf(PropTypes.string),
      title: PropTypes.string,
      content: PropTypes.string,
      role: PropTypes.string,
      active: PropTypes.bool,
      update: PropTypes.bool,
      hideErr: PropTypes.string,
      errMsg: PropTypes.string,
    }),
    currentPost: PropTypes.shape({
      _id: PropTypes.string,
      role: PropTypes.string.isRequired,
      author: PropTypes.shape({
        _id: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
  profiles: PropTypes.shape({
    userProfile: PropTypes.shape({
      likedPosts: PropTypes.arrayOf(PropTypes.string),
      username: PropTypes.string.isRequired,
      _id: PropTypes.string.isRequired,
      avatarUrl: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      time_zone: PropTypes.string.isRequired,
      languages: PropTypes.arrayOf(PropTypes.string),
      gender: PropTypes.string,
    }),
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
};

EditPost.defaultProps = {
  match: null,
  posts: {
    currentPost: {
      _id: null,
    },
  },
};

const mapStateToProps = state => ({
  appState: state.appState,
  posts: state.posts,
  profiles: state.profiles,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
  api: bindActionCreators(apiActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditPost);
