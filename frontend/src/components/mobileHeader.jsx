import React from 'react';

import '../App.sass';

function MobileHeader() {
  return (
    <div className="mobile-header">
      <div className="rsvp-container">
        <div className="dot" />
        <p className="title">RSVP</p>
        <div className="dot" />
      </div>
      <p className="date">03.07.21</p>
    </div>
  );
}

export default MobileHeader;
