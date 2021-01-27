import React, { useState, useEffect } from 'react';

import '../App.sass';

function LeftHalfBG() {
  return (
    <div id="left_half" className="left_half-container">
      <div>
        <div className="rsvp-container">
          <div className="dot" />
          <p className="title">RSVP</p>
          <div className="dot" />
        </div>
        <p className="date">03.07.21</p>
      </div>
      <div className="names_and-container">
        <p>&</p>
        <div className="names-container">
          <p>Bram</p>
          <p>Hannelore</p>
        </div>
      </div>
    </div>
  );
}

export default LeftHalfBG;
