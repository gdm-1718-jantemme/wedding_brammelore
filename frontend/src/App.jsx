import React, { useState, useEffect } from 'react';
import { IoChevronForwardOutline } from 'react-icons/io5/index.js';
import { IconContext } from 'react-icons';
import './App.sass';
import { check } from 'prettier';

function App() {
  const [code, setCode] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [personAmount, setPersonAmount] = useState(0);
  const [receptionIsGoing, setReceptionIsGoing] = useState(false);
  const [dinerIsGoing, setDinerIsGoing] = useState(false);
  const [partyIsGoing, setPartyIsGoing] = useState(false);
  //const [emailField, setEmailField] = useState(<></>);
  const [festivitiesCheckboxes, setFestivitiesCheckboxes] = useState(<></>);

  useEffect(() => {
    if (personAmount > 5) setPersonAmount(5);
    else if (personAmount < 0) setPersonAmount(0);
    return;
  }, [personAmount]);

  const checkCode = () => {
    const inputContainer = document.getElementById('input-container');

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

        if (res.data.accepted) {
          renderFestivities(res.data.festivities);
          animate();
          inputContainer.classList.remove('wrong');
        } else {
          inputContainer.classList.add('wrong');
          inputContainer.classList.add('wrong-animation');
          setTimeout(() => {
            inputContainer.classList.remove('wrong-animation');
          }, 820);
        }
      })
      .catch((err) => console.log(err));
  };

  const renderFestivities = (festivities) => {
    const toRender = festivities.map((festivity) => {
      return (
        <div className="checkbox-container" key={festivity}>
          <input
            type="checkbox"
            id={festivity}
            name={festivity}
            value={festivity}
            onChange={(e) => handleFestivityCheckbox(festivity, e.target.checked)}
          ></input>
          <label htmlFor={festivity}>{festivity[0].toUpperCase() + festivity.slice(1)}</label>
        </div>
      );
    });
    setFestivitiesCheckboxes(toRender);
  };

  const handleFestivityCheckbox = (festivity, isChecked) => {
    console.log(festivity, isChecked);
    switch (festivity) {
      case 'receptie':
        setReceptionIsGoing(isChecked);
        break;
      case 'eten':
        setDinerIsGoing(isChecked);
        break;
      case 'avondfeest':
        setPartyIsGoing(isChecked);
        break;
    }
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

  const handleCodeEnter = (e) => {
    if (e.keyCode === 13) {
      checkCode();
    }
  };

  const submitForm = () => {
    fetch('http://localhost:5000/api/attendees/add', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        name: firstname,
        surname: lastname,
        reception: {
          isGoing: receptionIsGoing,
          attendees: personAmount,
        },
        diner: {
          isGoing: dinerIsGoing,
          attendees: personAmount,
        },
        party: {
          isGoing: partyIsGoing,
          attendees: personAmount,
        },
        email: email,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);

        if (res.data.accepted) {
          renderFestivities(res.data.festivities);
          animate();
          inputContainer.classList.remove('wrong');
        } else {
          inputContainer.classList.add('wrong');
          inputContainer.classList.add('wrong-animation');
          setTimeout(() => {
            inputContainer.classList.remove('wrong-animation');
          }, 820);
        }
      })
      .catch((err) => console.log(err));
  };

  /*
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
  */

  return (
    <div className="App">
      <div id="code-modal" className="code-modal">
        <div className="code-container">
          <p>Code</p>
          <div className="input-container" id="input-container">
            <div style={{ width: '30px', height: '30px' }} />
            <input
              type="text"
              name="code"
              id="input_code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => handleCodeEnter(e)}
              autoComplete="off"
            />
            <button onClick={() => checkCode()}>
              <IconContext.Provider value={{ style: { padding: 0, margin: 0, width: '30px', height: '30px' } }}>
                <IoChevronForwardOutline />
              </IconContext.Provider>
            </button>
          </div>
        </div>
      </div>

      <div id="form-modal" className="form-modal">
        <form className="form-container" autoComplete="on">
          <p>Voornaam</p>
          <div className="input-container">
            <input
              type="text"
              placeholder="Bv. Hannelore"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              onKeyDown={(e) => handleEnter(e)}
              autoComplete="given-name"
            />
          </div>
          <p>Achternaam</p>
          <div className="input-container">
            <input
              type="text"
              placeholder="Bv. Temmerman"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              autoComplete="family-name"
            />
          </div>
          <p>Aanwezig bij</p>
          <div className="checkboxes-container">{festivitiesCheckboxes}</div>
          <p>Aantal personen</p>
          <div className="input-container">
            <input
              type="number"
              min={0}
              max={5}
              value={personAmount}
              onChange={(e) => setPersonAmount(e.target.value)}
            />
          </div>
          <p>Email</p>
          <div className="input-container">
            <input
              type="email"
              placeholder="Bv. hannelore@gmail.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {/*
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
          */}
        </form>
        <div className="divider" />
        <button id="submit" className="submit-button" onClick={() => submitForm()}>
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
