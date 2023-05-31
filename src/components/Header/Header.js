import React, { useEffect } from "react";
import "./headerStyle.scss";
import logo from "../../assets/logo2.PNG";
import { Link } from "react-router-dom";
import AOS from "aos";
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Header = () => {

  const open = () => {
    document.getElementById('menu').classList.toggle('open')
  }

  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <div className="header">
      <div className="img-search">
        <Link to="/"><img
          src={logo}
          alt=""
          data-aos="fade-right"
          data-aos-anchor="#example-anchor"
          data-aos-offset="500"
          data-aos-duration="200"
        /></Link>
      </div>

      <div class="menu" id="menu" onClick={open}>
        <div class="button" title="set Salaries"><Link to="/createData"><i class='bx bx-male-female icons'></i></Link></div>
        <div class="button" title="Ids"><Link to="/seeIds"><i class='bx bx-group icons'></i></Link></div>
        <div class="button" title="Stream"><Link to="/stream"><i class='bx bx-money-withdraw icons'></i></Link></div>
        <div class="button" title="Past Transactions"><Link to="/pastTransactions"><i class='bx bxs-wallet-alt icons'></i></Link></div>
        <div class="button"><ConnectButton accountStatus="avatar" chainStatus="none" showBalance={false} /></div>
      </div>
    </div>
  );
};

export default Header;