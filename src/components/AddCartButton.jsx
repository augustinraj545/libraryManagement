import React, { useState } from 'react';
import classNames from 'classnames';

const AddCartButton = ({ price, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const buttonClasses = classNames(
    'mt-2 w-full px-4 py-2 rounded-md font-bold bg-white text-blue-600',
    {
      'text-white hover:bg-blue-600': isHovered,
    }
  );

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <button
      className={buttonClasses}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {isHovered ? 'Add to Cart' : price}
    </button>
  );
};

export default AddCartButton;