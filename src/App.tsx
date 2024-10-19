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

const parseTime = (time: string, referenceDate: Date): Date => {
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date(referenceDate);
  date.setHours(hours, minutes, 0, 0);
  return date;
};

const App: React.FC = () => {
  const [waterAmount, setWaterAmount] = useState<number>(2000);
  const [reminders, setReminders] = useState<number>(8);
  const [sleepTime, setSleepTime] = useState<string>('23:00');
  const [wakeUpTime, setWakeUpTime] = useState<string>('07:00');
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [warning, setWarning] = useState<string>('');

  const generateTimeOptions = (): string[] => {
    const times: string[] = [];
    for (let hour = 0; hour < 24; hour++) {
      ['00', '30'].forEach((minute) => {
        const time = `${hour.toString().padStart(2, '0')}:${minute}`;
        times.push(time);
      });
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const today = new Date();
    const sleepDate = parseTime(sleepTime, today);
    const wakeDate = parseTime(wakeUpTime, today);

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
    <div className="max-w-md mx-auto p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Water Intake Scheduler</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="waterAmount">Daily Water Intake (ml)</Label>
          <Input
            id="waterAmount"
            type="number"
            min="0"
            value={waterAmount}
            onChange={(e) => setWaterAmount(Number(e.target.value))}
            required
          />
        </div>

        <div>
          <Label htmlFor="reminders">Number of Reminders</Label>
          <Input
            id="reminders"
            type="number"
            min="1"
            value={reminders}
            onChange={(e) => setReminders(Number(e.target.value))}
            required
          />
        </div>

        <div>
          <Label htmlFor="wakeUpTime">Wake Up Time</Label>
          <Select value={wakeUpTime} onValueChange={(value) => setWakeUpTime(value)}>
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
          <Label htmlFor="sleepTime">Sleep Time</Label>
          <Select value={sleepTime} onValueChange={(value) => setSleepTime(value)}>
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

      {warning && (
        <div className="mt-4 text-red-500">
          {warning}
        </div>
      )}

      {downloadUrl && (
        <div className="mt-4">
          <a href={downloadUrl} download="water_reminders.ics">
            <Button>Download .ics File</Button>
          </a>
        </div>
      )}
    </div>
  );
};

export default App;
