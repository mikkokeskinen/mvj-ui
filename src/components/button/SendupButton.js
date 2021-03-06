// @flow
import React from 'react';
import classNames from 'classnames';

import SendupIcon from '$components/icons/SendupIcon';

type Props = {
  className?: string,
  onClick: Function,
  text: string,
  title?: string,
  type?: string,
}

const SendupButton = ({className, onClick, text, title, type = 'button'}: Props) => {
  const handleKeyDown = (e: any) => {
    if(e.keyCode === 13) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <button
      className={classNames('sendup-button', className)}
      type={type}
      title={title}
      onClick={onClick}
      onKeyDown={handleKeyDown}
    >
      {text}
      <SendupIcon className='icon-small'/>
    </button>
  );
};

export default SendupButton;
