import React from 'react';

const ShnoorLogo = ({ size = 48 }) => {
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    }}>
      <img 
        src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=375,h=252,fit=crop/AQEZlaZbvrt8n2qw/shnoor_tm_logo-removebg-preview-Y4LPVNJDezc30XEY.png"  // Replace with your actual image URL
        alt="SHNOOR Logo" 
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
      />
    </div>
  );
};

export default ShnoorLogo;