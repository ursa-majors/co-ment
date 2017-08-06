import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';
import * as Actions from '../store/actions/postActions';

class EditPost extends React.Component {

  // use local state for form inputs
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      keywords: [],
      keyword: '',
      role: 'mentor',
      content: '',
      hideErr: 'form__hidden',
      errMsg: '',
      update: false,
    };
  }

  // For a URL with a specific ID param
  componentDidMount() {
    if (this.props.match.params.id) {
      // axios default headers
      axios.defaults.baseURL = 'https://co-ment.glitch.me';
      axios.defaults.headers.common['Authorization'] = `Bearer ${this.props.appState.authToken}`;
      axios.get(`/api/posts?id=${this.props.match.params.id}`)
        .then((response) => {
          this.setState({
            title: response.data[0].title,
            keywords: response.data[0].keywords,
            role: response.data[0].role,
            content: response.data[0].body,
            update: true,
            id: this.props.match.params.id,
          });
        });
    }
  }
  handleKeyPressAdd(e) {
    if (e.charCode === 44 || e.which === 44 || e.charCode === 13 || e.which === 13) {
      e.preventDefault();
      this.addKeyword();
    }
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

      case 'content':
        this.setState({ content: event.target.value });
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
    for (let i = 0; i < this.state.keywords.length; i += 1) {
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

  // remove keyword with keyboard
  handleKeyPressRemove(event) {
    if (event.charCode === 13 || event.which === 13) {
      this.removeKeyword(event);
    }
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
      msg = 'Title is required.  ';
    }
    if (this.state.content === '') {
      msg += 'Post content is required. ';
    }
    if (this.state.keywords.length === 0) {
      msg += 'At least 1 keyword is requried.';
    }
    if (msg.length > 0) {
      this.setState({ errMsg: msg, hideErr: '' });
      return false;
    }
    return true;
  }

  savePost() {
    // clear previous errors
    this.setState({ errMsg: '', hideErr: 'posts__hidden' });

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
    const body = {
      author: this.props.appState.profile.username,
      author_id: this.props.appState.profile._id,
      role: this.state.role,
      title: this.state.title,
      body: this.state.content,
      keywords: this.state.keywords,
      availability: '',
    };

    if (this.state.update) {
      axios.put(`/api/posts/${this.state.id}`, body)
      .then((response) => {
        this.props.actions.savePost([response.data]);
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
        this.setState({ errMsg: error.response.data.message, hideErr: ''})
      });
    } else {
      axios.post('/api/posts', body)
      // push the post to state and reset the form fields
      .then((response) => {
        this.props.actions.savePost([response.data]);
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
        this.setState({ errMsg: error.response.data.message, hideErr: ''})
      });
    }
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
              value={this.state.title}
              onChange={e => this.handleChange(e)}
              placeholder="Title"
            />
          </div>
          <div className="form__input-group">
            <label htmlFor="role" className="form__label">Role
            </label>
            <select className="form__input form__input--select" value={this.state.role} id="role" onChange={event => this.handleChange(event)} >
              <option value="mentor" id="mentor">Mentor</option>
              <option value="mentee" id="mentee">Mentee</option>
            </select>
          </div>
          <div className="form__input-group">
            <label htmlFor="keyword" className="form__label">Keywords
            </label>
            <input
              className="form__input"
              type="text"
              id="keyword"
              name="keyword"
              value={this.state.keyword}
              onChange={e => this.handleChange(e)}
              onKeyPress={e => this.handleKeyPressAdd(e)}
              placeholder="Add Keywords"
            />
            {this.state.keywords.map((item) => {
              return (
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
              );
            })}
          </div>
          <div className="form__input-group">
            <label htmlFor="content" className="form__label">Post Body
            </label>
            <textarea
              className="form__input"
              id="content"
              name="content"
              value={this.state.content}
              onChange={e => this.handleChange(e)}
              placeholder="Add post content"
            />
          </div>

          <div className="form__input-group">
            <div className={`form__error ${this.state.hideErr}`}>{this.state.errMsg}</div>
          </div>
        </div>
        <div className="form__input-group">
          <div className="form__button-wrap">
            <button className="splash__button pointer" id="btn-add" onClick={() => this.savePost()}>&nbsp;Save&nbsp;</button>
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

export default connect(mapStateToProps, mapDispatchToProps)(EditPost);
