import React, { useState } from 'react';
import { IoChevronForwardOutline } from 'react-icons/io5/index.js';
import { IconContext } from 'react-icons';
import './App.sass';

function App() {
  const [code, setCode] = useState('');
  const [emailField, setEmailField] = useState(<></>);

  const checkCode = () => {
    fetch('http://localhost:5000/api/codes/check', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ code: code }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (res.data.accepted) animate();
      })
      .catch((err) => console.log(err));
  };

  const animate = () => {
    document.getElementById('left_half').classList.add('fullWidth');
    document.getElementById('code-modal').classList.add('disappear');
    setTimeout(() => {
      document.getElementById('form-modal').classList.add('appear');
    }, 750);
  };

  const handleEnter = (e) => {
    if (e.keyCode === 13) {
      const form = e.target.form;
      const index = Array.prototype.indexOf.call(form, e.target);
      form.elements[index + 1].focus();
      e.preventDefault();
    }
  };

  const toggleEmailField = () => {
    const checkbox = document.getElementById('confirmation');

    if (checkbox.checked)
      setEmailField(
        <>
          <p>Email</p>
          <div className="input-container">
            <input type="email" placeholder="Bv. hannelore@gmail.com" />
          </div>
        </>,
      );
    else setEmailField(<></>);
  };

  return (
    <div className="App">
      <div id="code-modal" className="code-modal">
        <div className="code-container">
          <p>Code</p>
          <div className="input-container">
            <div style={{ width: '30px', height: '30px' }} />
            <input type="text" name="code" id="input_code" value={code} onChange={(e) => setCode(e.target.value)} />
            <button onClick={() => checkCode()}>
              <IconContext.Provider value={{ style: { padding: 0, margin: 0, width: '30px', height: '30px' } }}>
                <IoChevronForwardOutline />
              </IconContext.Provider>
            </button>
          </div>
        </div>
      </div>

      <div id="form-modal" className="form-modal">
        <form className="form-container">
          <p>Voornaam</p>
          <div className="input-container">
            <input type="text" placeholder="Bv. Hannelore" onKeyDown={(e) => handleEnter(e)} />
          </div>
          <p>Achternaam</p>
          <div className="input-container">
            <input type="text" placeholder="Bv. Temmerman" />
          </div>
          <p>Aanwezig bij</p>
          <div className="checkboxes-container">
            <div className="checkbox-container">
              <input type="checkbox" id="reception" name="reception" value="reception"></input>
              <label htmlFor="reception">Receptie</label>
            </div>
            <div className="checkbox-container">
              <input type="checkbox" id="diner" name="diner" value="diner"></input>
              <label htmlFor="diner">Diner</label>
            </div>
            <div className="checkbox-container">
              <input type="checkbox" id="party" name="party" value="party"></input>
              <label htmlFor="party">Feest</label>
            </div>
          </div>
          <p>Aantal personen</p>
          <div className="input-container">
            <input type="number" min={0} />
          </div>
          <div className="checkbox_mail-container">
            <input
              type="checkbox"
              id="confirmation"
              name="confirmation"
              value="confirmation"
              onChange={() => toggleEmailField()}
            ></input>
            <label htmlFor="confirmation">Ik wil een bevestigingsmail ontvangen</label>
          </div>
          {emailField}
        </form>
        <div className="divider" />
        <button id="submit" className="submit-button">
          Versturen
        </button>
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
