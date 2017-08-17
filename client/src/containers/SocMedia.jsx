import React from 'react';
// import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
// import * as Actions from '../store/actions/profileActions';
// import * as apiActions from '../store/actions/apiActions';

const SocMedia = (props) => (
  <div>
      <div className="form__input-group">
        <label htmlFor="location" className="form__label">Twitter
        </label>
        <input
          className="form__input"
          type="url"
          pattern="https?://.+"
          id="twitter"
          name="twitter"
          value={props.profiles.editForm.twitter}
          onChange={e => props.handleInput(e)}
          placeholder="Twitter URL"
        />
      </div>
      <div className="form__input-group">
        <label htmlFor="location" className="form__label">Facebook
        </label>
        <input
          className="form__input"
          type="url"
          pattern="https?://.+"
          id="facebook"
          name="facebook"
          value={props.profiles.editForm.facebook}
          onChange={e => props.handleInput(e)}
          placeholder="Facebook URL"
        />
      </div>
      <div className="form__input-group">
        <label htmlFor="location" className="form__label">Portfolio link
        </label>
        <input
          className="form__input"
          type="url"
          pattern="https?://.+"
          id="link"
          name="link"
          value={props.profiles.editForm.link}
          onChange={e => props.handleInput(e)}
          placeholder="Portfolio URL"
        />
      </div>
      <div className="form__input-group">
        <label htmlFor="location" className="form__label">LinkedIn
        </label>
        <input
          className="form__input"
          type="url"
          pattern="https?://.+"
          id="linkedin"
          name="linkedin"
          value={props.profiles.editForm.linkedin}
          onChange={e => props.handleInput(e)}
          placeholder="LinkedIn URL"
        />
      </div>
      <div className="form__input-group">
        <label htmlFor="location" className="form__label">CodePen
        </label>
        <input
          className="form__input"
          type="url"
          pattern="https?://.+"
          id="codepen"
          name="codepen"
          value={props.profiles.editForm.codepen}
          onChange={e => props.handleInput(e)}
          placeholder="CodePen URL"
        />
      </div>
      </div>
    );

// const mapStateToProps = state => ({
//   appState: state.appState,
//   profiles: state.profiles,
// });

// const mapDispatchToProps = dispatch => ({
//   actions: bindActionCreators(Actions, dispatch),
//   api: bindActionCreators(apiActions, dispatch),
// });

export default SocMedia;
