import React from 'react';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';


class Nav extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      menu: 'closed',
      menuBackground: '',
    };
  }

  componentDidMount() {
    window.addEventListener('scroll', this.throttle(this.setBackground, 100));
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.setState({ menu: 'closing' }, ()=>{this.setBackground();});
        setTimeout(() => {
          this.setState({ menu: 'closed' }, ()=>{this.setBackground();});
        }, 300);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.setBackground);
  }

  setBackground = () => {
    let menuBackground = '';
    // need background for open menu on mobile, even if not scrolled
    if (window.scrollY || (this.props.appState.windowSize.width < 650 && this.state.menu !== 'closed')) {
      menuBackground = 'h-nav__side-bkg-noscroll';
    }
    if (this.state.menuBackground !== menuBackground) {
      this.setState({ menuBackground });
    }
  }

  navToggle = (e) => {
    if (this.props.appState.windowSize.width < 650) {
      if (this.state.menu === 'closed') {
        this.setState({ menu: 'open' }, ()=>{this.setBackground();});
      } else {
        this.setState({ menu: 'closing' }, ()=>{this.setBackground();});
        setTimeout(() => {
          this.setState({ menu: 'closed' }, ()=>{this.setBackground();});
        }, 300);
      }
    }
  }

  throttle(callback, wait, context = this) {
    let timeout = null;

    const later = () => {
      callback.apply(context);
      timeout = null;
    };

    return function () {
      if (!timeout) {
        timeout = setTimeout(later, wait);
      }
    };
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
    return (
      <div className={`h-nav__side-bkg ${this.state.menuBackground}`}>
      <div className={classObj[this.state.menu].menu} aria-expanded={classObj[this.state.menu].ariaE} aria-controls="nav" onClick={this.navToggle}>
        <span className={classObj[this.state.menu].span}>
          <button className="h-nav__icon" >
            <span className="sr-only">Toggle navigation</span>
            <div className={classObj[this.state.menu].bar1} />
            <div className={classObj[this.state.menu].bar2} />
            <div className={classObj[this.state.menu].bar3} />
          </button>
          <span className={classObj[this.state.menu].menuspan}>
          Menu</span>
        </span>
      </div>
      <nav className={classObj[this.state.menu].nav}>
        <ul className={classObj[this.state.menu].ul}>
          <li className="h-nav__item">
            <NavLink
              to="/"
              className="h-nav__item-link"
              activeClassName="h-nav__item-link--active"
            >
              Home
            </NavLink>
          </li>
          <li className="h-nav__item">
            <NavLink
              to="/about"
              className="h-nav__item-link h-nav__item-link"
              activeClassName="h-nav__item-link--active"
            >
              About
            </NavLink>
          </li>
          {this.props.links.map((item) => {
            let classes;
            if (item === 'login' || item === 'logout') {
              classes = 'h-nav__item-link h-nav__item-link--login';
            } else {
              classes = 'h-nav__item-link h-nav__item-link';
            }
            return (
              <li className="h-nav__item" key={item}>
                <NavLink
                  to={`/${item}`}
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
      </nav>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  appState: state.appState,
});

const HeaderNav = withRouter(Nav);
export default connect(mapStateToProps)(HeaderNav);
