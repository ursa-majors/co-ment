import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
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

  // Add Keywords on Comma or Enter
  handleKeyPressAdd(e) {
    if (e.charCode === 44 || e.which === 44 || e.charCode === 13 || e.which === 13) {
      e.preventDefault();
      this.addKeyword();
    }
  }

  // event handler for form inputs...sets the state value based on element id
  handleChange(event) {
    this.props.actions.setFormField(event.target.id, event.target.value);
  }

  // keywords are entered into a text input, this function pushes them
  // into the array that goes to the DB. Ignore dupes.
  addKeyword() {
    const newWord = this.props.posts.editForm.keyword;
    for (let i = 0; i < this.props.posts.editForm.keywords.length; i += 1) {
      if (this.props.posts.editForm.keywords[i] === newWord) {
        this.props.actions.setFormField('keyword', '');
        return;
      }
    }
    this.props.actions.addKeyword(newWord);
  }

  // remove keyword with keyboard
  handleKeyPressRemove(event) {
    if (event.charCode === 13 || event.which === 13) {
      this.removeKeyword(event);
    }
  }

  // allow user to remove the keywords
  removeKeyword(event) {
    const newArray = this.props.posts.editForm.keywords;
    for (let i = 0; i < this.props.posts.editForm.keywords.length; i += 1) {
      if (this.props.posts.editForm.keywords[i] === event.target.id) {
        this.props.actions.removeKeyword(i);
        break;
      }
    }
  }

  validateInputs() {
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
      this.props.actions.setFormField( 'errMsg', msg);
      this.props.actions.setFormField( 'hideErr', '');
      return false;
    }
    return true;
  }

  savePost() {
    // clear previous errors
    this.props.actions.setFormField('hideErr', 'posts__hidden');

    // if user has entered a keyword, but not added it to the array, add it now
    if (this.props.posts.editForm.keyword !== '') {
      this.addKeyword();
    }
    // check for required fields
    // message will be displayed; exit if validate fails
    if (!this.validateInputs()) { return; }

    const body = {
      author: this.props.profiles.userProfile.username,
      author_id: this.props.profiles.userProfile._id,
      role: this.props.posts.editForm.role,
      title: this.props.posts.editForm.title,
      body: this.props.posts.editForm.content,
      keywords: this.props.posts.editForm.keywords,
      availability: '',
    };

    if (this.props.posts.editForm.update) {
      this.props.api.modifyPost(this.props.appState.authToken, this.props.match.params.id, body);
    } else {
      this.props.api.addPost(this.props.appState.authToken, body);
    }

    this.props.history.push('/posts');;
  }

  render() {
    return (
      <div className="posts">
        <div className="form__body">
          <div className="form__header">Create an Ad</div>
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
            <label htmlFor="keyword" className="form__label">Keywords
            </label>
            <div>
              {this.props.posts.editForm.keywords.map(item => (
                <span className="skill-value" key={item}>
                  <span className="skill-value__icon" aria-hidden="true">
                    <span
                      id={item}
                      role="button"
                      tabIndex="0"
                      onClick={e => this.removeKeyword(e)}
                      onKeyPress={e => this.handleKeyPressRemove(e)}
                    >
                        &times;
                      </span>
                  </span>
                  <span className="skill-value__label" role="option" aria-selected="true">
                    {item}
                    <span className="skill-aria-only">&nbsp;</span>
                  </span>
                </span>
                ))}
            </div>
            <input
              className="form__input"
              type="text"
              id="keyword"
              name="keyword"
              value={this.props.posts.editForm.keyword}
              onChange={e => this.handleChange(e)}
              onKeyPress={e => this.handleKeyPressAdd(e)}
              placeholder="Add Keywords"
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
              placeholder="Add post content"
            />
          </div>

          <div className="form__input-group">
            <div className={`form__error ${this.props.posts.editForm.hideErr}`}>{this.props.posts.editForm.errMsg}</div>
          </div>
          <div className="form__input-group">
            <div className="form__button-wrap">
              <button className="splash__button pointer" id="btn-add" onClick={() => this.savePost()}>&nbsp;Save&nbsp;</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

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
