export interface Booking {
  date: string;
  time: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface CalendarData {
  year: number;
  month: number;
  firstDay: number;
  daysInMonth: number;
}
