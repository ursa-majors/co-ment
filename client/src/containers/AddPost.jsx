import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';
import * as Actions from '../store/actions/postActions';

class AddPost extends React.Component {

  // use local state for form inputs
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      keywords: [],
      keyword: '',
      role: 'mentor',
      body: '',
    };
  }

  // event handler for form inputs...sets the state value based on element id
  handleChange(event) {
    switch (event.target.id) {

      case 'title':
        this.setState({ title: event.target.value });
        break;

      case 'keyword':
        this.setState({ keyword: event.target.value });
        break;

      case 'body':
        this.setState({ body: event.target.value });
        break;

      case 'role':
        this.setState({ role: event.target.value.toLowerCase() });
        break;

      default:
        break;
    }
  }

  // keywords are entered into a text input, this function pushes them
  // into the array that goes to the DB. Ignore dupes.
  addKeyword() {
    const newWord = this.state.keyword;
    for (let i=0; i<this.state.keywords.length; i += 1) {
      if (this.state.keywords[i] === newWord) {
        this.setState({ keyword: '' });
        return;
      }
    }
    this.setState({
      keyword: '',
      keywords: this.state.keywords.concat(newWord),
    });
  }

  // allow user to remove the keywords
  removeKeyword(event) {
    let newArray = this.state.keywords;
    for (let i = 0; i < this.state.keywords.length; i += 1) {
      if (this.state.keywords[i] === event.target.id) {
        newArray.splice(i, 1);
        this.setState({ keywords: newArray });
        break;
      }
    }
  }

  validateInputs() {
    let msg = '';
    if (this.state.title === '') {
      msg = 'Title is required. ';
    }
    if (this.state.body === '') {
      msg += 'Post content is required';
    }
    if (msg.length > 0) {
      this.props.actions.setPostError(msg);
      return false;
    }
    return true;
  }

  addPost() {
    // clear previous errors
    this.props.actions.setPostError('');

    // if user has entered a keyword, but not added it to the array, add it now
    if (this.state.keyword !== '') {
      this.addKeyword();
    }
    // check for required fields
    // message will be displayed; exit if validate fails
    if (!this.validateInputs()) { return; }

    // set axios headers - this appears to be needed for CORS preflight options call
    // otherwise we have issues with the Authorization header
    axios.defaults.baseURL = 'https://co-ment.glitch.me';
    axios.defaults.headers.common['Authorization'] = `Bearer ${this.props.appState.authToken}`;

    axios.post('/api/posts', {
      author: this.props.appState.profile.username,
      author_id: this.props.appState.profile._id,
      role: this.state.role,
      title: this.state.title,
      body: this.state.title,
      keywords: this.state.keywords,
      availability: '',
    })
    // push the post to state and reset the form fields
    .then((response) => {
      this.props.actions.addPost([response.data]);
      this.setState({
        title: '',
        keywords: [],
        keyword: '',
        role: 'mentor',
        body: '',
      });
      this.props.history.push('/posts');
    })

    .catch((error) => {
      console.log(error);
    });
  }

  render() {
    return (
      <div className="container form">
        <div className="form__body">
          <div className="form__header">Place an Ad</div>
          <div className="form__input-group">
            <label className="posts__input-label" htmlFor="language">Title:
              <input className="form__input" type="text" id="title" value={this.state.title} onChange={event => this.handleChange(event)} />
            </label>
          </div>
          <div className="form__input-group">
            <label className="posts__input-label" htmlFor="timezone">Role:
              <select value={this.state.role} id="role" onChange={event => this.handleChange(event)} >
                <option value="mentor" id="mentor">Mentor</option>
                <option value="mentee" id="mentee">Mentee</option>
              </select>
            </label>
          </div>
          <div className="form__input-group">
            {this.state.keywords.map((item) => {
              return (<span className="h-nav__item-link" key={item}>{item}
                <span>
                  <i className="fa fa-times" id={item} role="button" tabIndex="0" onClick={event => this.removeKeyword(event)} />
                </span>
              </span>);
            })}
            <label className="posts__input-label" htmlFor="certs">Keywords:
              <input className="form__input" type="text" id="keyword" value={this.state.keyword} onChange={event => this.handleChange(event)} />
              <button className="splash__button pointer" id="btn-login" onClick={() => this.addKeyword()}>
                <i className="fa fa-plus-square-o" />
              </button>
            </label>
          </div>
          <div className="form__input-group">
            <label className="posts__input-label" htmlFor="timezone">Post Content:
              <textarea className="form__input" id="body" value={this.state.body} onChange={event => this.handleChange(event)} />
            </label>
          </div>
          <div className="form__input-group">
            <div className="form__error">{this.props.posts.postErrorMsg}</div>
          </div>
        </div>
        <div className="form__input-group">
          <div className="form__button-wrap">
            <button className="splash__button pointer" id="btn-add" onClick={() => this.addPost()}>&nbsp;&nbsp;&nbsp;Add&nbsp;&nbsp;&nbsp;</button>
          </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(AddPost);
