import React, { useState } from 'react';
import Navbar from './Navbar';

function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={styles.wrapper}>
      <Navbar onCollapse={setCollapsed} />
      <div style={{
        ...styles.main,
        marginLeft: collapsed ? '70px' : '220px'
      }}>
        {children}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f0f2f5'
  },
  main: {
    flex: 1,
    transition: 'margin-left 0.3s ease',
    minHeight: '100vh'
  }
};

export default Layout;