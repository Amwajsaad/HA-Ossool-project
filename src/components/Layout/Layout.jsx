import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import Sidebar from '../sidebar'; 

const Layout = ({ children }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <>
      {!isLoginPage && <Header />}
      {!isLoginPage && <Sidebar />}
      <main>{children}</main>
      {!isLoginPage && <Footer />}
    </>
  );
};

export default Layout;