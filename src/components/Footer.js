import React from 'react';
import Logo from '../assets/logo/engine.png';

export default class Header extends React.Component {
  render() {
    return (
        <footer className="footer">
            <img src={Logo} className="footer__logo"/>
        </footer>
        );
  }
}
