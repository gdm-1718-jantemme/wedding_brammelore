import React, { useState, useEffect } from 'react';
import { IoChevronForwardOutline } from 'react-icons/io5/index.js';
import { IconContext } from 'react-icons';
import PropTypes from 'prop-types';

import '../../App.sass';

function CodeModal(props) {
  const [code, setCode] = useState('');

  const checkCode = () => {
    const inputContainer = document.getElementById('input-container');

    fetch('http://78.21.137.1:5001/api/codes/check', {
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
          props.renderFestivities(res.data.festivities);
          props.nextModal();
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

  const handleCodeEnter = (e) => {
    if (e.keyCode === 13) {
      checkCode();
    }
  };

  return (
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
  );
}

CodeModal.propTypes = {
  nextModal: PropTypes.func,
  renderFestivities: PropTypes.func,
};

//CodeModal.defaultProps = {
//};

export default CodeModal;
