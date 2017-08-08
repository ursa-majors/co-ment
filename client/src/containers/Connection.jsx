import React from 'react';

class Connection extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      recipient: '',
      sender: '',
      subject: '',
      body: '',
      formError: '',
    };
  }

  handleChange = (event) => {
    this.setState({ [event.target.id]: event.target.value, error: false });
  }

  render() {
    return (
      <div className="container form">
        <div className="form__body">
          <div className="form__connection-header">Request Connection</div>
          <div className="form__input-group">
            <label className="form__label" htmlFor="recipient">TO:
            </label>
            <input className="form__input form__connection-input" type="text" id="recipient" value={this.state.recipient} onChange={event => this.handleChange(event)} />
          </div>
          <div className="form__input-group">
            <label className="form__label" htmlFor="sender">FROM:
            </label>
            <input className="form__input form__connection-input" type="text" id="sender" value={this.state.sender} onChange={event => this.handleChange(event)} />
          </div>
          <div className="form__input-group">
            <label className="form__label" htmlFor="sender">Subject:
            </label>
            <input className="form__input form__connection-input" type="text" id="subject" value={this.state.subject} onChange={event => this.handleChange(event)} />
          </div>
          <div className="form__input-group">
            <label className="form__label" htmlFor="timezone">Body:
            </label>
            <textarea className="form__input form__connection-input" id="body" value={this.state.body} onChange={event => this.handleChange(event)} />
          </div>
          <div className="form__input-group">
            <div className="form__error">{this.state.formError}</div>
          </div>
          <div className="form__input-group">
            <div className="form__button-wrap">
              <button className="splash__button pointer" id="btn-add" onClick={() => this.addPost()}>&nbsp;&nbsp;&nbsp;Add&nbsp;&nbsp;&nbsp;</button>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

export default Connection;
