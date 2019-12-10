import React from 'react';
import Logo from '../assets/logo/aglogo.png';

export default class Header extends React.Component {
  render() {
    return (
        <header className="header">
            <img src={Logo} className="header__logo"/>
        </header>
        );
  }
}
