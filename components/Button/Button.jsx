import React from 'react';
import Style from './Button.module.css';

const Button = ({btnName, handleClick, classStyles}) => (
  <button className={`${Style.button} ${classStyles}`} type="button" onClick={handleClick}>
    {btnName}
  </button>
);

export default Button;
