import { TestBed } from '@angular/core/testing';

import { invitationConfig } from '../../config/invitation.config';
import { VenueComponent } from './venue';

describe('VenueComponent', () => {
  it('renders configured venue details and opens directions in a new tab', () => {
    const fixture = TestBed.createComponent(VenueComponent);
    fixture.componentRef.setInput('event', {
      title: 'Engagement Ceremony',
      date: '20 December 2026',
      time: '6:30 PM',
      venueName: 'Engagement Venue',
      venueAddress: 'City, India',
      googleMapsUrl: 'https://maps.google.com/?q=Engagement+Venue',
    });
    fixture.componentRef.setInput('labels', invitationConfig.labels);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const venueLink = compiled.querySelector<HTMLAnchorElement>('.venue-map-link');
    const directionsLink = compiled.querySelector<HTMLAnchorElement>('a.primary-action');

    expect(compiled.textContent).toContain('Engagement Venue');
    expect(compiled.textContent).toContain('City, India');
    expect(venueLink?.href).toBe('https://maps.google.com/?q=Engagement+Venue');
    expect(venueLink?.target).toBe('_blank');
    expect(venueLink?.rel).toContain('noopener');
    expect(directionsLink?.textContent).toContain('Get Directions');
    expect(directionsLink?.href).toBe('https://maps.google.com/?q=Engagement+Venue');
    expect(directionsLink?.target).toBe('_blank');
    expect(directionsLink?.rel).toContain('noopener');
  });

  it('opens a configured calendar link and emits continue actions', () => {
    const fixture = TestBed.createComponent(VenueComponent);
    fixture.componentRef.setInput('event', {
      title: 'Engagement Ceremony',
      date: '20 December 2026',
      time: '6:30 PM',
      venueName: 'Engagement Venue',
      venueAddress: 'City, India',
      googleMapsUrl: 'https://maps.google.com',
    });
    fixture.componentRef.setInput('labels', invitationConfig.labels);

    const calendarSpy = vi.fn();
    const continueSpy = vi.fn();
    fixture.componentInstance.addToCalendar.subscribe(calendarSpy);
    fixture.componentInstance.continueFlow.subscribe(continueSpy);
    fixture.detectChanges();

    const calendarLink = fixture.nativeElement.querySelector(
      'a.secondary-action',
    ) as HTMLAnchorElement | null;
    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll('button'),
    ) as HTMLButtonElement[];

    expect(calendarLink?.href).toContain('https://calendar.google.com/calendar/render');

    calendarLink?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    buttons.find((button) => button.textContent?.includes('Continue'))?.click();

    expect(calendarSpy).toHaveBeenCalledOnce();
    expect(continueSpy).toHaveBeenCalledOnce();
  });

  it('hides the calendar action when disabled', () => {
    const fixture = TestBed.createComponent(VenueComponent);
    fixture.componentRef.setInput('event', {
      title: 'Engagement Ceremony',
      date: '20 December 2026',
      time: '6:30 PM',
      venueName: 'Engagement Venue',
      venueAddress: 'City, India',
      googleMapsUrl: 'https://maps.google.com',
    });
    fixture.componentRef.setInput('labels', invitationConfig.labels);
    fixture.componentRef.setInput('showCalendarAction', false);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).not.toContain('Add to Calendar');
  });

  it('hides the continue action for the scrolling story', () => {
    const fixture = TestBed.createComponent(VenueComponent);
    fixture.componentRef.setInput('event', {
      title: 'Engagement Ceremony',
      date: '20 December 2026',
      time: '6:30 PM',
      venueName: 'Engagement Venue',
      venueAddress: 'City, India',
      googleMapsUrl: 'https://maps.google.com',
    });
    fixture.componentRef.setInput('labels', invitationConfig.labels);
    fixture.componentRef.setInput('showContinueAction', false);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).not.toContain('Continue');
  });
});
