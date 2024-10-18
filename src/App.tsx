import React, { useState } from 'react';
import IntegerInput from './components/ui/integer-input.tsx';
import TimeCalculator from './components/ui/time-calculator.tsx';
import ScheduleConverter from './components/ui/schedule-converter.tsx';



function App() {
  return (
    <>
      {/* Header */}
      <div className="flex flex-col items-center bg-gray-100 py-6 px-8">
        <div className="w-full max-w-md text-center">
          {/* WaterMinder title with a blue background just around the text */}
          <h1 className="text-5xl font-extrabold tracking-wide bg-blue-600 text-white py-2 px-4 inline-block rounded-lg">
            WaterMinder
          </h1>
          {/* Smaller text underneath WaterMinder */}
          <p className="text-base mt-2 text-gray-700">
            Stay hydrated, stay healthy!
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex justify-center w-full mt-8">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
          {/* First IntegerInput for water intake */}
          <h2 className="text-2xl font-semibold mb-4 text-center">Amount of desired water to drink?</h2>
          <IntegerInput label="Enter (in ounces)" unit="ounces" />

          {/* Second IntegerInput for reminders */}
          <h2 className="text-2xl font-semibold mt-6 mb-4 text-center">How many reminders would you like?</h2>
          <IntegerInput label="Enter number of reminders" />

          {/* Time Calculator */}
          <div className="mt-6">
            <TimeCalculator />
          </div>
        </div>
      </div>
      
    </>
  );
}

export default App;
