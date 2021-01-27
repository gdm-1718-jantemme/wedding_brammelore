import React from 'react';
import PropTypes from 'prop-types';

import '../../App.sass';

function FinishModal(props) {
  return (
    <div id="finish-modal" className="finish-modal">
      <div>
        {props.checkmark}
        <p>Bedankt voor het antwoorden op je uitnodiging!</p>
      </div>
    </div>
  );
}

FinishModal.propTypes = {
  checkmark: PropTypes.element,
};

//FinishModal.defaultProps = {
//};

export default FinishModal;
