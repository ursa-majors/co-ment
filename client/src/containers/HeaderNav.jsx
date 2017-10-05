import React from 'react';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { skip } from '../utils';
import { setMenuState, setAdminMenuState, setMenuBackground } from '../store/actions';

class Nav extends React.Component {

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.props.actions.setMenuState('closing');
      this.props.actions.setMenuBackground();
      setTimeout(() => {
        this.props.actions.setMenuState('closed');
        this.props.actions.setMenuBackground();
      }, 300);
    }
  }


  navToggle = () => {
    if (this.props.appState.windowSize.width < 650) {
      if (this.props.appState.menuState === 'closed') {
        this.props.actions.setMenuState('open');
        this.props.actions.setMenuBackground();
      } else {
        this.props.actions.setMenuState('closing');
        setTimeout(() => {
          this.props.actions.setMenuState('closed');
          this.props.actions.setMenuBackground();
        }, 300);
      }
    }
  }


  adminNavToggle = () => {
      if (this.props.appState.adminMenuState === 'closed') {
        this.props.actions.setAdminMenuState('open');
      } else {
        this.props.actions.setAdminMenuState('closing');
        setTimeout(() => {
          this.props.actions.setAdminMenuState('closed');
        }, 300);
      }
    }

  render() {
    const classObj = {
      closed: {
        menu: 'h-nav__item-menu',
        nav: 'h-nav__nav',
        ul: 'h-nav',
        bar1: 'h-nav__bar h-nav__bar--top',
        bar2: 'h-nav__bar h-nav__bar--mid',
        bar3: 'h-nav__bar h-nav__bar--bot',
        span: 'h-nav__item-link--menu',
        menuspan: 'h-nav__menuspan',
        ariaE: false,
      },

      open: {
        menu: 'h-nav__item-menu--open',
        nav: 'h-nav__nav--side',
        ul: 'h-nav__side',
        bar1: 'h-nav__bar h-nav__bar--top h-nav__bar--top-active',
        bar2: 'h-nav__bar h-nav__bar--mid h-nav__bar--mid-active',
        bar3: 'h-nav__bar h-nav__bar--bot h-nav__bar--bot-active',
        span: 'h-nav__item-link--menu-open',
        menuspan: 'h-nav__menuspan--open',
        ariaE: true,
      },

      closing: {
        menu: 'h-nav__item-menu',
        nav: 'h-nav__nav h-nav__nav--hidden',
        ul: 'h-nav',
        bar1: 'h-nav__bar h-nav__bar--top',
        bar2: 'h-nav__bar h-nav__bar--mid',
        bar3: 'h-nav__bar h-nav__bar--bot',
        span: 'h-nav__item-link--menu',
        menuspan: 'h-nav__menuspan',
        ariaE: false,
      },
    };

    let avatarUrl;
    if (this.props.appState.user.avatarUrl === 'https://cdn.glitch.com/4965fcd8-26e0-4a69-a667-bb075062e086%2Fandroid-chrome-384x384.png?1504907183396' || !this.props.appState.user.avatarUrl ) {
      avatarUrl = 'https://raw.githubusercontent.com/ursa-majors/co-ment/master/design/usericon2.png'
    } else {
      avatarUrl = this.props.appState.user.avatarUrl;
    }
    const backgroundStyle = {
      backgroundImage: `url(${avatarUrl})`,
      backgroundSize: "cover",
      backgroundPosition: "center center",
    }

    const adminLinks = ['inbox', 'profile', 'connections', 'logout'];

    const adminMenuClass = this.props.appState.adminMenuState === 'open' ? 'visible' : 'hidden';
    console.log('adminMenuClass =' + adminMenuClass);

    return (
      <div className={`h-nav__side-bkg ${this.props.appState.menuBackground}`}>
      <button
        className="skip"
        data-taborder=""
        onClick={ () => skip('main')}><span className="skip__text">Skip to content</span> <i className="fa fa-angle-right" /></button>
      <div className={classObj[this.props.appState.menuState].menu} aria-expanded={classObj[this.props.appState.menuState].ariaE} aria-controls="nav" onClick={this.navToggle}>
        <span className={classObj[this.props.appState.menuState].span}>
          <button className="h-nav__icon" data-taborder="" >
            <span className="sr-only">Toggle navigation</span>
            <div className={classObj[this.props.appState.menuState].bar1} />
            <div className={classObj[this.props.appState.menuState].bar2} />
            <div className={classObj[this.props.appState.menuState].bar3} />
          </button>
          <span className={classObj[this.props.appState.menuState].menuspan}>
          Menu</span>
        </span>
      </div>
      <nav className={classObj[this.props.appState.menuState].nav}>
        <ul className={classObj[this.props.appState.menuState].ul}>
          <li className="h-nav__item">
            <NavLink
              to="/"
              data-taborder=""
              className="h-nav__item-link"
              activeClassName="h-nav__item-link--active"
            >
              Home
            </NavLink>
          </li>
          <li className="h-nav__item">
            <NavLink
              to="/about"
              data-taborder=""
              className="h-nav__item-link h-nav__item-link"
              activeClassName="h-nav__item-link--active"
            >
              About
            </NavLink>
          </li>
          {this.props.links.map((item) => {
            let classes;
            if (item === 'login') {
              classes = 'h-nav__item-link h-nav__item-link--login';
            } else if (item === 'logout') {
              classes = 'h-nav__item-link h-nav__item-link--logout';
            } else {
              classes = 'h-nav__item-link h-nav__item-link';
            }
            return (
              <li className="h-nav__item" key={item}>
                <NavLink
                  to={`/${item}`}
                  data-taborder=""
                  className={classes}
                  activeClassName="h-nav__item-link--active"
                >
                  {item}
                </NavLink>
              </li>
            );
          })
        }
        </ul>
        {this.props.appState.loggedIn &&
          <div>
            <button
              className="h-nav__avatar aria-button"
              data-taborder=""
              onClick={() => this.adminNavToggle()}
              aria-expanded={this.props.appState.adminMenuState === 'open' ? true : false}
              >
              <div className="h-nav__image-aspect">
                <div className="h-nav__image-crop">
                  <div
                    className="h-nav__image"
                    style={backgroundStyle}
                    role="image"
                    aria-label={this.props.appState.user.username} />
                </div>
              </div>
            </button>
            <div className={adminMenuClass}>
              <div className="a-nav__caret"></div>
              <div>
                <ul className="a-nav">
                  {adminLinks.map((item) => {
                    return (
                      <li className="a-nav__item" key={item}>
                        <NavLink
                          to={`/${item}`}
                          data-taborder=""
                          className="a-nav__item-link"
                          activeClassName="a-nav__item-link--active"
                        >
                          {item}
                        </NavLink>
                      </li>
                      );
                    })
                  }
                </ul>
              </div>
            </div>
          </div>
        }
      </nav>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  appState: state.appState,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ setMenuState, setMenuBackground, setAdminMenuState }, dispatch),
});

const connectedNav = connect(mapStateToProps, mapDispatchToProps)(Nav)
const HeaderNav = withRouter(connectedNav);
export default HeaderNav;
