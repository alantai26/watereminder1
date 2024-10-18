import React from 'react';

// Define props for the ReminderScheduler component
interface ReminderSchedulerProps {
  reminders: number;    // Number of reminders
  totalWater: number;   // Desired amount of water
  awakeHours: number;   // Total awake hours
}

const ReminderScheduler: React.FC<ReminderSchedulerProps> = ({ reminders, totalWater, awakeHours }) => {
  // Calculate the interval between reminders
  const interval = awakeHours / reminders;

  // Calculate how much water per reminder
  const waterPerReminder = totalWater / reminders;

  // Generate the reminder times
  const reminderTimes: string[] = [];
  const currentDate = new Date();
  
  for (let i = 0; i < reminders; i++) {
    const reminderTime = new Date(currentDate);
    reminderTime.setHours(currentDate.getHours() + Math.floor(i * interval));
    const formattedTime = reminderTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    reminderTimes.push(formattedTime);
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold">Water Intake Reminders</h2>
      <p>Total Water Goal: {totalWater} liters</p>
      <p>Reminders: {reminders}</p>
      <p>Total Awake Hours: {awakeHours} hours</p>
      
      <h3 className="mt-4">Reminder Schedule</h3>
      <ul>
        {reminderTimes.map((time, index) => (
          <li key={index}>
            Reminder {index + 1} at {time} - Drink {waterPerReminder.toFixed(2)} liters of water
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReminderScheduler;
