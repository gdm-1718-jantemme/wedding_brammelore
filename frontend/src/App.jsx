import React from 'react';
import { IoChevronForwardOutline } from 'react-icons/io5/index.js';
import { IconContext } from 'react-icons';
import './App.sass';

function App() {
  const animate = () => {
    document.getElementById('left_half').classList.add('fullWidth');
    document.getElementById('code-modal').classList.add('disappear');
    setTimeout(() => {
      document.getElementById('form-modal').classList.add('appear');
    }, 750);
  };

  return (
    <div className="App">
      <div id="code-modal" className="code-modal">
        <div className="code-container">
          <p>Code</p>
          <div className="input-container">
            <div style={{ width: '30px', height: '30px' }} />
            <input type="text" name="code" id="input_code" />
            <button onClick={() => animate()}>
              <IconContext.Provider value={{ style: { padding: 0, margin: 0, width: '30px', height: '30px' } }}>
                <IoChevronForwardOutline />
              </IconContext.Provider>
            </button>
          </div>
        </div>
      </div>
      <div id="form-modal" className="form-modal">
        <div className="form-container">
          <p>Voornaam</p>
          <div className="input-container">
            <input type="text" />
          </div>
          <p>Achternaam</p>
          <div className="input-container">
            <input type="text" />
          </div>
          <div className="input-container">
            <input type="text" />
          </div>
          <div className="input-container">
            <input type="text" />
          </div>
        </div>
      </div>
      <div id="left_half" className="left_half-container">
        <div>
          <div className="rsvp-container">
            <div className="dot" />
            <p className="title">RSVP</p>
            <div className="dot" />
          </div>
          <p className="date">30.08.21</p>
        </div>
        <div className="names_and-container">
          <p>&</p>
          <div className="names-container">
            <p>Bram</p>
            <p>Hannelore</p>
          </div>
        </div>
      </div>
      <div className="background" />
    </div>
  );
}

export default App;
