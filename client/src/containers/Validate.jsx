import React from 'react';
import { connect } from 'react-redux';

const Validate = props => (
  <div className="container validate">
    <div className="validate__quote-wrap">
      <div className="validate__quote">
        <i className="fa fa-quote-left fa-3x fa-pull-left" aria-hidden="true" />
        {`Two roads diverged in a wood, and I —
        I took the one less traveled by,
        And that has made all the difference.`}
      </div>
      <div className="validate__quote-author">
        <a
          href="https://www.poetryfoundation.org/poems/44272/the-road-not-taken"
          target="_blank"
          rel="noopener noreferrer"
        >
          Robert Frost
        </a>
      </div>
    </div>
    <h2 className="title">Validation Successful</h2>
    <div className="validate__text-wrap">
      <div className="validate__text-header">
        {`Congratulations ${props.profile.userProfile.username}!`}
      </div>
      <div className="validate__text">
        You have validated your account and started your Co/Ment journey.
        The next step is to decide your path.  Are you looking for an adviser,
        or are you ready to be a guiding star?

        Whichever path you choose, get started by updating your profile,
        then head over to the Posts page.
      </div>
    </div>
  </div>
);

const mapStateToProps = state => ({
  profile: state.profiles,
});

export default connect(mapStateToProps)(Validate);
