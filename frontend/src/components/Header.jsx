import React from 'react'
import logo from '../assets/images/SHOP.CO.png'
import searchIcon from '../assets/icons/search.png'
import cartIcon from '../assets/icons/cart.png'
import accountIcon from '../assets/icons/account.png'

const Header = () => {
  return (

    <header class="site-header">
    <nav class="site-header__nav">
                <button type="button" class="site-header__menu-toggle"></button>
      <a href="index.html" class="site-header__logo-link"><img src={logo} alt="Shop.co Logo "
          class="site-header__logo" /></a>

      <ul class="site-header__menu">
        <li class="site-header__menu-item">
          <a href="" class="site-header__link">Shop</a>
        </li>
        <li class="site-header__menu-item">
          <a href="" class="site-header__link">On Sale</a>
        </li>
        <li class="site-header__menu-item">
          <a href="" class="site-header__link">New Arrival</a>
        </li>
        <li class="site-header__menu-item">
          <a href="" class="site-header__link">Brands</a>
        </li>
      </ul>

      <div class="site-header__search">
        <img src={searchIcon} alt="Search Icon" class="site-header__search-icon" />
        <input type="search" placeholder="Search for products..." class="site-header__search-input" />
      </div>

      <div class="site-header__actions">
        <a href="cart.html"><img src="../assets/icons/cart.png" class="site-header__action-icon" alt="Go to cart" /></a>
        <a href="login.html"><img src={accountIcon} class="site-header__action-icon" alt="Account Login" /></a>
      </div>
    </nav>
  </header>


  )
  
}

export default Header;
