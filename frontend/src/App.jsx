import React, { useState, useEffect } from 'react';
import { IoChevronForwardOutline } from 'react-icons/io5/index.js';
import { IconContext } from 'react-icons';
import PulseLoader from 'react-spinners/PulseLoader';
import { Checkmark } from 'react-checkmark';

import './App.sass';

function App() {
  const [code, setCode] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [personAmount, setPersonAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [receptionIsGoing, setReceptionIsGoing] = useState(false);
  const [dinerIsGoing, setDinerIsGoing] = useState(false);
  const [partyIsGoing, setPartyIsGoing] = useState(false);
  //const [emailField, setEmailField] = useState(<></>);
  const [festivitiesCheckboxes, setFestivitiesCheckboxes] = useState(<></>);
  const [firstNameWarning, setFirstNameWarning] = useState(<></>);
  const [lastnameWarning, setLastnameWarning] = useState(<></>);
  const [festivitiesWarning, setFestivitiesWarning] = useState(<></>);
  const [amountWarning, setAmountWarning] = useState(<></>);
  const [emailWarning, setEmailWarning] = useState(<></>);
  const [checkmark, setCheckmark] = useState(<></>);

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

  const isImpossible = () => {
    if (personAmount > 0 && !receptionIsGoing && !dinerIsGoing && !partyIsGoing) return true;
    else if (personAmount === 0 && (receptionIsGoing || dinerIsGoing || partyIsGoing)) return true;
    else return false;
  };

  const isEmailValid = (emailString) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(emailString).toLowerCase());
  };

  const checkForm = () => {
    if (firstname === '' || lastname === '' || !isEmailValid(email) || isImpossible()) return false;
    else return true;
  };

  const clearAllWarnings = () => {
    document.getElementById('firstname-input').classList.remove('wrong');
    document.getElementById('lastname-input').classList.remove('wrong');
    document.getElementById('email-input').classList.remove('wrong');
    document.getElementById('amount-input').classList.remove('wrong');
    document.getElementById('checkboxes-container').classList.remove('wrong');
    setFirstNameWarning(<></>);
    setLastnameWarning(<></>);
    setFestivitiesWarning(<></>);
    setAmountWarning(<></>);
    setEmailWarning(<></>);
  };

  const submitForm = () => {
    if (checkForm()) {
      clearAllWarnings();
      setIsLoading(true);

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
          setTimeout(() => {
            setIsLoading(false);
            document.getElementById('form-modal').classList.remove('appear');
            document.getElementById('finish-modal').classList.add('appear');
            //document.getElementById('left_half').classList.remove('fullWidth');
            setCheckmark(<Checkmark size="60px" color="#223344" />);
          }, 1500); // Most connections are so fast the loading spinner wont even trigger, so i add a delay to let the user know something's happening/happened already

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
    } else {
      console.log('Form not correct.');
      if (firstname === '') {
        document.getElementById('firstname-input').classList.add('wrong');
        setFirstNameWarning(<em className="wrong-text">Verplicht</em>);
      } else {
        document.getElementById('firstname-input').classList.remove('wrong');
        setFirstNameWarning(<></>);
      }
      if (lastname === '') {
        document.getElementById('lastname-input').classList.add('wrong');
        setLastnameWarning(<em className="wrong-text">Verplicht</em>);
      } else {
        document.getElementById('lastname-input').classList.remove('wrong');
        setLastnameWarning(<></>);
      }
      if (!isEmailValid(email)) {
        document.getElementById('email-input').classList.add('wrong');
        if (email === '') setEmailWarning(<em className="wrong-text">Verplicht</em>);
        else setEmailWarning(<em className="wrong-text">Geen geldig emailadres</em>);
      } else {
        document.getElementById('email-input').classList.remove('wrong');
        setEmailWarning(<></>);
      }
      if (isImpossible()) {
        document.getElementById('amount-input').classList.add('wrong');
        document.getElementById('checkboxes-container').classList.add('wrong');
        if (personAmount > 0 && !receptionIsGoing && !dinerIsGoing && !partyIsGoing) {
          document.getElementById('checkboxes-container').classList.add('wrong');
          setFestivitiesWarning(<em className="wrong-text">Geen aanwezigheid aangeduid</em>);
          setAmountWarning(<></>);
          document.getElementById('amount-input').classList.remove('wrong');
        } else if (personAmount === 0 && (receptionIsGoing || dinerIsGoing || partyIsGoing)) {
          document.getElementById('amount-input').classList.add('wrong');
          setAmountWarning(<em className="wrong-text">Geef in met hoeveel personen je komt</em>);
          setFestivitiesWarning(<></>);
          document.getElementById('checkboxes-container').classList.remove('wrong');
        }
      } else {
        document.getElementById('amount-input').classList.remove('wrong');
        document.getElementById('checkboxes-container').classList.remove('wrong');
        setFestivitiesWarning(<></>);
        setAmountWarning(<></>);
      }
    }
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
          <p>Voornaam {firstNameWarning}</p>
          <div className="input-container" id="firstname-input">
            <input
              type="text"
              placeholder="Bv. Hannelore"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              onKeyDown={(e) => handleEnter(e)}
              autoComplete="given-name"
            />
          </div>
          <p>Achternaam {lastnameWarning}</p>
          <div className="input-container" id="lastname-input">
            <input
              type="text"
              placeholder="Bv. Temmerman"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              autoComplete="family-name"
            />
          </div>
          <p>Aanwezig bij {festivitiesWarning}</p>
          <div className="checkboxes-container" id="checkboxes-container">
            {festivitiesCheckboxes}
          </div>
          <p>Aantal personen {amountWarning}</p>
          <div className="input-container" id="amount-input">
            <input
              type="number"
              min={0}
              max={5}
              value={personAmount}
              onChange={(e) => setPersonAmount(parseInt(e.target.value))}
            />
          </div>
          <p>Email {emailWarning}</p>
          <div className="input-container" id="email-input">
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
          {isLoading ? <PulseLoader color={'#7C5B34'} loading={true} size={6} /> : 'Versturen'}
        </button>
      </div>

      <div id="finish-modal" className="finish-modal">
        <div>
          {checkmark}
          <p>Bedankt voor het antwoorden op je uitnodiging!</p>
        </div>
      </div>

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
      <div className="background" />
    </div>
  );
}

export default App;
