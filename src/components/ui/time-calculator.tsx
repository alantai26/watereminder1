import React, { useState } from 'react';

const TimeCalculator: React.FC = () => {
  const [wakeUpTime, setWakeUpTime] = useState<string>('');
  const [sleepTime, setSleepTime] = useState<string>('');
  const [awakeHours, setAwakeHours] = useState<number | null>(null);

  const handleCalculate = () => {
    if (wakeUpTime && sleepTime) {
      const totalAwakeHours = calculateAwakeHours(wakeUpTime, sleepTime);
      setAwakeHours(totalAwakeHours);
    }
  };

  const calculateAwakeHours = (wakeUp: string, sleep: string): number => {
    // Convert time strings to Date objects
    const wakeUpDate = parseTime(wakeUp);
    const sleepDate = parseTime(sleep);

    if (!wakeUpDate || !sleepDate) {
      alert('Please enter valid time formats (e.g., "8 am", "11 pm")');
      return 0;
    }

    // Calculate time difference in hours
    let diffInHours = (sleepDate.getTime() - wakeUpDate.getTime()) / (1000 * 60 * 60);

    // Handle case where sleep time is on the next day
    if (diffInHours < 0) {
      diffInHours += 24;
    }

    return diffInHours;
  };

  const parseTime = (timeStr: string): Date | null => {
    const timeRegex = /^(\d{1,2})(:\d{2})?\s?(am|pm)$/i;
    const match = timeStr.match(timeRegex);

    if (!match) return null;

    let hours = parseInt(match[1]);
    const period = match[3].toLowerCase();
    
    // Convert "pm" to 24-hour format, except for 12 pm
    if (period === 'pm' && hours !== 12) {
      hours += 12;
    }

    // Handle "12 am" (midnight) case
    if (period === 'am' && hours === 12) {
      hours = 0;
    }

    const date = new Date();
    date.setHours(hours);
    date.setMinutes(match[2] ? parseInt(match[2].slice(1)) : 0);
    date.setSeconds(0);
    return date;
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold">What times do you wake up and sleep?</h2>
      
      <div className="mt-4">
        <label className="block mb-2">Wake up time (e.g., 8 am):</label>
        <input
          type="text"
          value={wakeUpTime}
          onChange={(e) => setWakeUpTime(e.target.value)}
          className="border border-gray-300 p-2 rounded"
        />
      </div>

      <div className="mt-4">
        <label className="block mb-2">Sleep time (e.g., 11 pm):</label>
        <input
          type="text"
          value={sleepTime}
          onChange={(e) => setSleepTime(e.target.value)}
          className="border border-gray-300 p-2 rounded"
        />
      </div>

      <button
        onClick={handleCalculate}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
      >
        Calculate Awake Hours
      </button>

      {awakeHours !== null && (
        <p className="mt-4 text-xl">
          You are awake for <strong>{awakeHours} hours</strong>.
        </p>
      )}
    </div>
  );
};

export default TimeCalculator;
