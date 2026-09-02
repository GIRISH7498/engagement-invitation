import { TestBed } from '@angular/core/testing';

import { InvitationEventConfig } from '../models/invitation.model';
import { CalendarService } from './calendar.service';

describe('CalendarService', () => {
  const event: InvitationEventConfig = {
    title: 'WE ARE GETTING ENGAGED',
    date: '12 November 2026',
    time: '12 PM onwards',
    venueName: 'Padole Lawn',
    venueAddress: 'Dighori, Bahadura, Maharashtra 440034',
    googleMapsUrl:
      'https://www.google.com/maps/place/Padole+Lawn/@21.1055174,79.140073,17z/data=!4m14!1m7!3m6!1s0x3bd4b9d4ad5bad93:0xbb50ad219b350c3f!2sPadole+Lawn!8m2!3d21.1055124!4d79.1426479!16s%2Fg%2F11hdrx8pst!3m5!1s0x3bd4b9d4ad5bad93:0xbb50ad219b350c3f!8m2!3d21.1055124!4d79.1426479!16s%2Fg%2F11hdrx8pst?entry=ttu&g_ep=EgoyMDI2MDgzMC4wIKXMDSoASAFQAw%3D%3D',
    calendarDurationHours: 3,
    calendarTimeZone: 'Asia/Kolkata',
  };

  it('creates a Google Calendar URL from the configured event details', () => {
    const service = TestBed.inject(CalendarService);
    const calendarUrl = service.createGoogleCalendarUrl(event);

    expect(calendarUrl).toBeTruthy();

    const params = new URL(calendarUrl!).searchParams;

    expect(params.get('action')).toBe('TEMPLATE');
    expect(params.get('text')).toBe('WE ARE GETTING ENGAGED');
    expect(params.get('dates')).toBe('20261112T120000/20261112T150000');
    expect(params.get('location')).toBe('Padole Lawn, Dighori, Bahadura, Maharashtra 440034');
    expect(params.get('ctz')).toBe('Asia/Kolkata');
    expect(params.get('details')).toContain(event.googleMapsUrl);
  });

  it('returns null when the configured event date or time cannot be parsed', () => {
    const service = TestBed.inject(CalendarService);

    expect(service.createGoogleCalendarUrl({ ...event, date: 'Someday soon' })).toBeNull();
    expect(service.createGoogleCalendarUrl({ ...event, time: 'Evening' })).toBeNull();
  });
});
