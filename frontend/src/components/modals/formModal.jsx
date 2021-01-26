import React, { useState, useEffect } from 'react';
import PulseLoader from 'react-spinners/PulseLoader';
import PropTypes from 'prop-types';

import '../../App.sass';

function FormModal(props) {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [personAmount, setPersonAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  //const [emailField, setEmailField] = useState(<></>);
  const [firstNameWarning, setFirstNameWarning] = useState(<></>);
  const [lastnameWarning, setLastnameWarning] = useState(<></>);
  const [festivitiesWarning, setFestivitiesWarning] = useState(<></>);
  const [amountWarning, setAmountWarning] = useState(<></>);
  const [emailWarning, setEmailWarning] = useState(<></>);

  useEffect(() => {
    if (personAmount > 5) setPersonAmount(5);
    else if (personAmount < 0) setPersonAmount(0);
    return;
  }, [personAmount]);

  const handleEnter = (e) => {
    if (e.keyCode === 13) {
      const form = e.target.form;
      const index = Array.prototype.indexOf.call(form, e.target);
      form.elements[index + 1].focus();
      e.preventDefault();
    }
  };

  const isImpossible = () => {
    if (!isNaN(personAmount)) {
      if (personAmount > 0 && !props.receptionIsGoing && !props.dinerIsGoing && !props.partyIsGoing) return true;
      else if (personAmount === 0 && (props.receptionIsGoing || props.dinerIsGoing || props.partyIsGoing)) return true;
      else return false;
    } else return true;
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
            isGoing: props.receptionIsGoing,
            attendees: personAmount,
          },
          diner: {
            isGoing: props.dinerIsGoing,
            attendees: personAmount,
          },
          party: {
            isGoing: props.partyIsGoing,
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
          }, 1500);
          props.showFinishModal();
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
        if (isNaN(personAmount)) {
          document.getElementById('amount-input').classList.add('wrong');
          setAmountWarning(<em className="wrong-text">Geef in met hoeveel personen je komt</em>);
          setFestivitiesWarning(<></>);
          document.getElementById('checkboxes-container').classList.remove('wrong');
        } else if (personAmount > 0 && !props.receptionIsGoing && !props.dinerIsGoing && !props.partyIsGoing) {
          document.getElementById('checkboxes-container').classList.add('wrong');
          setFestivitiesWarning(<em className="wrong-text">Geen aanwezigheid aangeduid</em>);
          setAmountWarning(<></>);
          document.getElementById('amount-input').classList.remove('wrong');
        } else if (personAmount === 0 && (props.receptionIsGoing || props.dinerIsGoing || props.partyIsGoing)) {
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
          {props.festivitiesCheckboxes}
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
  );
}

FormModal.propTypes = {
  showFinishModal: PropTypes.func,
  festivitiesCheckboxes: PropTypes.array,
  partyIsGoing: PropTypes.bool,
  dinerIsGoing: PropTypes.bool,
  receptionIsGoing: PropTypes.bool,
};

//FormModal.defaultProps = {
//};

export default FormModal;
