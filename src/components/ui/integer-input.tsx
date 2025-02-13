import React, { useState } from 'react';

interface IntegerInputProps {
  label: string;
  unit?: string;
}

const IntegerInput: React.FC<IntegerInputProps> = ({ label}) => {
  const [inputValue, setInputValue] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    
    if (value === '' || /^[0-9]+$/.test(value)) {
      setInputValue(value);
    } 
  };

  return (
    <div>
      <label htmlFor="integerInput">{label}: </label>
      <input
        className="bg-blue-500"
        style={{ backgroundColor: '#E5E7EB', color: '#000000' }}
        type="text"
        id="integerInput"
        value={inputValue}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default IntegerInput;
