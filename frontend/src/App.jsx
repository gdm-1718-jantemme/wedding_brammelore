import React, { useState, useEffect } from 'react';
import { Checkmark } from 'react-checkmark';

import './App.sass';
import CodeModal from './components/modals/codeModal';
import FormModal from './components/modals/formModal';
import FinishModal from './components/modals/finishModal';
import LeftHalfBG from './components/leftHalfBG';
import MobileHeader from './components/mobileHeader';

function App() {
  const [receptionIsGoing, setReceptionIsGoing] = useState(false);
  const [dinerIsGoing, setDinerIsGoing] = useState(false);
  const [partyIsGoing, setPartyIsGoing] = useState(false);
  //const [emailField, setEmailField] = useState(<></>);
  const [festivitiesCheckboxes, setFestivitiesCheckboxes] = useState([]);
  const [checkmark, setCheckmark] = useState(<></>);

  useEffect(() => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    window.addEventListener('resize', () => {
      // We execute the same script as before
      vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    });

    return;
  }, []);

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

  const showFormModal = () => {
    document.getElementById('left_half').classList.add('fullWidth');
    document.getElementById('code-modal').classList.add('disappear');
    setTimeout(() => {
      document.getElementById('form-modal').classList.add('appear');
    }, 750);
  };

  const showFinishModal = () => {
    setTimeout(() => {
      document.getElementById('form-modal').classList.remove('appear');
      setTimeout(() => {
        document.getElementById('form-modal').style.display = 'none';
      }, 500); // Setting display to none because overflow issue on iphone 5
      document.getElementById('finish-modal').classList.add('appear');
      //document.getElementById('left_half').classList.remove('fullWidth');
      setCheckmark(<Checkmark size="60px" color="#223344" />);
    }, 1500); // Most connections are so fast the loading spinner wont even trigger, so i add a delay to let the user know something's happening/happened already
  };

  return (
    <div className="App">
      <CodeModal nextModal={showFormModal} renderFestivities={renderFestivities} />

      <FormModal
        showFinishModal={showFinishModal}
        festivitiesCheckboxes={festivitiesCheckboxes}
        partyIsGoing={partyIsGoing}
        dinerIsGoing={dinerIsGoing}
        receptionIsGoing={receptionIsGoing}
      />

      <FinishModal checkmark={checkmark} />

      <MobileHeader />

      <LeftHalfBG />

      <div className="background" />
    </div>
  );
}

export default App;
