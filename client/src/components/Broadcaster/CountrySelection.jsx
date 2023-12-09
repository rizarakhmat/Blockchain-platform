import React, { useState } from 'react';

const CountrySelection = () => {
  const [countries, setCountries] = useState([{ id: 0, value: '' }]);
  const [count, setCount] = useState(1);

  const handleAddCountry = () => {
    setCountries([...countries, { id: count, value: '' }]);
    setCount(count + 1);
  };

  const handleCountryChange = (id, value) => {
    const updatedCountries = countries.map((country) =>
      country.id === id ? { ...country, value } : country
    );
    setCountries(updatedCountries);
  };

  return (
    <div>
      {countries.map((country) => (
        <div key={country.id}>
          <FormField 
            labelName="Country Name *"
            placeholder="Enter country"
            inputType="text"
            value={country.value}
            handleChange={(e) => {
              handleCountryChange(country.id, e.target.value);
              console.log("working")
            }}
          />
        </div>
      ))}
      <button onClick={handleAddCountry}>+</button>
    </div>
  );
};

export default CountrySelection;
