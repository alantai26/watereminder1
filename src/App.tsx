import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from './components/ui/select';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { format } from 'date-fns';

interface ReminderEvent {
  start: Date;
  end: Date;
  summary: string;
}

const generateICS = (events: ReminderEvent[]): string => {
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//YourApp//WaterReminder//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ];

  events.forEach((event) => {
    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${event.start.getTime()}@yourapp.com`);
    lines.push(`DTSTAMP:${format(new Date(), 'yyyyMMdd\'T\'HHmmss')}`);
    lines.push(`DTSTART:${format(event.start, 'yyyyMMdd\'T\'HHmmss')}`);
    lines.push(`DTEND:${format(event.end, 'yyyyMMdd\'T\'HHmmss')}`);
    lines.push(`SUMMARY:${event.summary}`);
    lines.push('END:VEVENT');
  });

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
};

const App: React.FC = () => {
  const [waterAmount, setWaterAmount] = useState<number>(2000);
  const [reminders, setReminders] = useState<number>(8);
  const [sleepTime, setSleepTime] = useState<string>('23:00');
  const [wakeUpTime, setWakeUpTime] = useState<string>('07:00');
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [warning, setWarning] = useState<string>('');
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  const generateTimeOptions = (): string[] => {
    const times: string[] = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        times.push(time);
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const today = new Date();
    const sleepDate = new Date(today);
    sleepDate.setHours(parseInt(sleepTime.split(':')[0]), parseInt(sleepTime.split(':')[1]));
    const wakeDate = new Date(today);
    wakeDate.setHours(parseInt(wakeUpTime.split(':')[0]), parseInt(wakeUpTime.split(':')[1]));

    if (sleepDate <= wakeDate) {
      sleepDate.setDate(sleepDate.getDate() + 1);
    }

    const availableMinutes = (sleepDate.getTime() - wakeDate.getTime()) / (1000 * 60);
    const interval = Math.floor(availableMinutes / (reminders - 1));
    const waterPerReminder = waterAmount / reminders;
    const events: ReminderEvent[] = [];

    for (let i = 0; i < reminders; i++) {
      const reminderTime = new Date(wakeDate.getTime() + interval * i * 60 * 1000);
      const endTime = new Date(reminderTime.getTime() + 10 * 60 * 1000);
      events.push({
        start: reminderTime,
        end: endTime,
        summary: `${waterPerReminder.toFixed(0)} ml WaterMinder`,
      });
    }

    const icsContent = generateICS(events);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    setDownloadUrl(url);

    if (waterPerReminder > 500) {
      setWarning(`Warning: You are drinking ${waterPerReminder.toFixed(0)}ml per reminder, which may be too much.`);
    } else {
      setWarning('');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: '#e0f7fa' }} // Light blue background
    >
      <div className="max-w-md mx-auto p-6 text-center relative w-full" style={{ maxWidth: '500px' }}>
        {/* Water bottle background overlay */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(/images/bottle-water-plastic.png)',
            backgroundSize: 'contain',
            backgroundPosition: 'center bottom',
            backgroundRepeat: 'no-repeat',
            height: '400px',
            marginTop: '50px', 
          }}
        />

        {/* Add an overlay behind text for better readability */}
        <div className="relative z-10 p-4">
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)', 
              padding: '20px',
              borderRadius: '8px',
            }}
          >
            <h1 className="text-2xl font-bold mb-4 text-black">WaterMinder</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="waterAmount" className="text-black">
                  Daily Water Intake (ml)
                </Label>
                <Input
                  id="waterAmount"
                  type="number"
                  min="0"
                  value={waterAmount}
                  onChange={(e) => setWaterAmount(Number(e.target.value))}
                  required
                  className="text-black"
                />
              </div>
              <div>
                <Label htmlFor="reminders" className="text-black">
                  Number of Reminders
                </Label>
                <Input
                  id="reminders"
                  type="number"
                  min="1"
                  value={reminders}
                  onChange={(e) => setReminders(Number(e.target.value))}
                  required
                  className="text-black"
                />
              </div>
              <div>
                <Label htmlFor="wakeUpTime" className="text-black">
                  Wake Up Time
                </Label>
                <Select
                  value={wakeUpTime}
                  onValueChange={(value) => setWakeUpTime(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Wake Up Time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="sleepTime" className="text-black">
                  Sleep Time
                </Label>
                <Select
                  value={sleepTime}
                  onValueChange={(value) => setSleepTime(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Sleep Time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit">Generate Calendar</Button>
            </form>
            {warning && <div className="mt-4 text-red-500">{warning}</div>}
            {downloadUrl && (
              <div className="mt-4">
                <a href={downloadUrl} download="water_reminders.ics">
                  <Button>Download .ics File</Button>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Example Image below, outside of the form container */}
        <div className="relative z-10 mt-8">
          <p className="text-sm mt-2">Example: Click to zoom</p>
          <img
            src="/images/water-reminder-example.png" 
            alt="WaterMinder Example"
            className={`mx-auto cursor-pointer ${
              isZoomed ? 'w-full' : 'w-32 h-32'
            }`}
            onClick={() => setIsZoomed(!isZoomed)} 
          />
          
        </div>
      </div>
    </div>
  );
};

export default App;
