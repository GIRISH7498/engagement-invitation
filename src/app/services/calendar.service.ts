import { Injectable } from '@angular/core';

import { InvitationEventConfig } from '../models/invitation.model';

interface DateParts {
  year: number;
  month: number;
  day: number;
}

interface TimeParts {
  hours: number;
  minutes: number;
}

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  private readonly defaultDurationHours = 3;
  private readonly defaultTimeZone = 'Asia/Kolkata';
  private readonly monthIndexes = new Map(
    [
      'january',
      'february',
      'march',
      'april',
      'may',
      'june',
      'july',
      'august',
      'september',
      'october',
      'november',
      'december',
    ].map((month, index) => [month, index]),
  );

  createGoogleCalendarUrl(event: InvitationEventConfig): string | null {
    const startDate = this.parseTargetDate(event.date, event.time);

    if (!startDate) {
      return null;
    }

    const endDate = new Date(
      startDate.getTime() + this.resolveDurationHours(event.calendarDurationHours) * 60 * 60 * 1000,
    );
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.title,
      dates: `${this.formatCalendarDateTime(startDate)}/${this.formatCalendarDateTime(endDate)}`,
      details: this.createDetails(event),
      location: [event.venueName, event.venueAddress].filter(Boolean).join(', '),
      ctz: event.calendarTimeZone?.trim() || this.defaultTimeZone,
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }

  private createDetails(event: InvitationEventConfig): string {
    return [
      event.title,
      `${event.date}, ${event.time}`,
      event.venueName,
      event.venueAddress,
      event.googleMapsUrl,
    ]
      .filter(Boolean)
      .join('\n');
  }

  private parseTargetDate(dateValue: string, timeValue: string): Date | null {
    const dateParts = this.parseConfiguredDate(dateValue.trim());
    const timeParts = this.parseConfiguredTime(timeValue.trim());

    if (!dateParts || !timeParts) {
      return null;
    }

    return new Date(
      Date.UTC(dateParts.year, dateParts.month, dateParts.day, timeParts.hours, timeParts.minutes),
    );
  }

  private parseConfiguredDate(value: string): DateParts | null {
    const indianDate = /^(\d{1,2})\s+([a-zA-Z]+)\s+(\d{4})$/.exec(value);

    if (indianDate) {
      const month = this.monthIndexes.get(indianDate[2].toLowerCase());

      return month === undefined
        ? null
        : this.createValidatedDateParts(Number(indianDate[3]), month, Number(indianDate[1]));
    }

    const isoDate = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

    if (!isoDate) {
      return null;
    }

    return this.createValidatedDateParts(
      Number(isoDate[1]),
      Number(isoDate[2]) - 1,
      Number(isoDate[3]),
    );
  }

  private parseConfiguredTime(value: string): TimeParts | null {
    const cleanValue = value
      .toLowerCase()
      .replace(/\bonwards\b|\bsharp\b/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    const match = /^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/.exec(cleanValue);

    if (!match) {
      return null;
    }

    const hour = Number(match[1]);
    const minutes = match[2] ? Number(match[2]) : 0;
    const meridiem = match[3];

    if (minutes > 59 || (meridiem && (hour < 1 || hour > 12)) || (!meridiem && hour > 23)) {
      return null;
    }

    return {
      hours: meridiem ? this.to24HourTime(hour, meridiem) : hour,
      minutes,
    };
  }

  private createValidatedDateParts(year: number, month: number, day: number): DateParts | null {
    const date = new Date(Date.UTC(year, month, day));

    if (
      date.getUTCFullYear() !== year ||
      date.getUTCMonth() !== month ||
      date.getUTCDate() !== day
    ) {
      return null;
    }

    return { year, month, day };
  }

  private resolveDurationHours(value: number | undefined): number {
    return typeof value === 'number' && Number.isFinite(value) && value > 0
      ? value
      : this.defaultDurationHours;
  }

  private to24HourTime(hour: number, meridiem: string): number {
    if (meridiem === 'am') {
      return hour === 12 ? 0 : hour;
    }

    return hour === 12 ? 12 : hour + 12;
  }

  private formatCalendarDateTime(date: Date): string {
    return [
      date.getUTCFullYear(),
      this.padDatePart(date.getUTCMonth() + 1),
      this.padDatePart(date.getUTCDate()),
      'T',
      this.padDatePart(date.getUTCHours()),
      this.padDatePart(date.getUTCMinutes()),
      '00',
    ].join('');
  }

  private padDatePart(value: number): string {
    return value.toString().padStart(2, '0');
  }
}
