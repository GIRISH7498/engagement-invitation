import { TestBed } from '@angular/core/testing';

import { invitationConfig } from '../../config/invitation.config';
import { EventDetailsComponent } from './event-details';

describe('EventDetailsComponent', () => {
  it('renders configured invitation details and emits when continuing', () => {
    const fixture = TestBed.createComponent(EventDetailsComponent);
    fixture.componentRef.setInput('couple', {
      groomName: 'Groom Name',
      brideName: 'Bride Name',
      coupleDisplayName: 'Groom Name & Bride Name',
      couplePhoto: 'assets/engagement/images/couple-main.webp',
      secondaryPhoto: '',
    });
    fixture.componentRef.setInput('event', {
      title: 'A Joyful Engagement',
      date: '20 December 2026',
      time: '6:30 PM onwards',
      venueName: 'Engagement Venue',
      venueAddress: 'City, India',
      googleMapsUrl: 'https://maps.google.com',
    });
    fixture.componentRef.setInput('families', {
      groomFamily: 'Groom Family',
      brideFamily: 'Bride Family',
    });
    fixture.componentRef.setInput('messages', {
      welcomeMessage: 'Welcome',
      coupleMessage: 'Two hearts, one beautiful beginning.',
      invitationMessage:
        'With immense joy in our hearts,\nwe invite you to celebrate\nthe beginning of our forever.',
      countdownMessage: 'Counting down to our special day',
      eventStartedMessage: 'Our beautiful journey begins today.',
      closingMessage: 'Thank you',
      closingSupportingMessage: "We can't wait to celebrate with you.",
    });
    fixture.componentRef.setInput('labels', invitationConfig.labels);

    const emitSpy = vi.fn();
    fixture.componentInstance.continueFlow.subscribe(emitSpy);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const text = compiled.textContent?.replace(/\s+/g, ' ').trim() ?? '';

    expect(text).toContain('A Joyful Engagement');
    expect(text).toContain('Groom Name & Bride Name');
    expect(text).toContain('With immense joy in our hearts');
    expect(text).toContain('6:30 PM onwards');
    expect(text).toContain('Engagement Venue');
    expect(text).toContain('City, India');
    expect(text).toContain('With blessings from');
    expect(text.indexOf('Bride Family')).toBeLessThan(text.indexOf('Groom Family'));
    expect(compiled.querySelector('.date-month')?.textContent?.trim()).toBe('DECEMBER');
    expect(compiled.querySelector('.date-day')?.textContent?.trim()).toBe('20');
    expect(compiled.querySelector('.date-year')?.textContent?.trim()).toBe('2026');
    expect(compiled.querySelector('.date-weekday')?.textContent?.trim()).toBe('SUNDAY');
    expect(compiled.querySelector('time')?.getAttribute('datetime')).toBe('2026-12-20');

    compiled.querySelector<HTMLButtonElement>('button')?.click();

    expect(emitSpy).toHaveBeenCalledOnce();
  });

  it('completely hides the family section when disabled', () => {
    const fixture = TestBed.createComponent(EventDetailsComponent);
    fixture.componentRef.setInput('couple', {
      groomName: 'Groom Name',
      brideName: 'Bride Name',
      coupleDisplayName: 'Groom Name & Bride Name',
      couplePhoto: 'assets/engagement/images/couple-main.webp',
      secondaryPhoto: '',
    });
    fixture.componentRef.setInput('event', {
      title: 'Engagement Ceremony',
      date: '20 December 2026',
      time: '6:30 PM',
      venueName: 'Engagement Venue',
      venueAddress: 'City, India',
      googleMapsUrl: 'https://maps.google.com',
    });
    fixture.componentRef.setInput('families', {
      groomFamily: 'Groom Family',
      brideFamily: 'Bride Family',
    });
    fixture.componentRef.setInput('messages', {
      welcomeMessage: 'Welcome',
      coupleMessage: 'Two hearts, one beautiful beginning.',
      invitationMessage: 'Please join us',
      countdownMessage: 'Counting down to our special day',
      eventStartedMessage: 'Our beautiful journey begins today.',
      closingMessage: 'Thank you',
      closingSupportingMessage: "We can't wait to celebrate with you.",
    });
    fixture.componentRef.setInput('labels', invitationConfig.labels);
    fixture.componentRef.setInput('showFamilies', false);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('app-family-details')).toBeNull();
    expect(compiled.textContent).not.toContain('Bride Family');
    expect(compiled.textContent).not.toContain('Groom Family');
  });

  it('can hide venue details and the continue action for the scrolling story', () => {
    const fixture = TestBed.createComponent(EventDetailsComponent);
    fixture.componentRef.setInput('couple', {
      groomName: 'Groom Name',
      brideName: 'Bride Name',
      coupleDisplayName: 'Groom Name & Bride Name',
      couplePhoto: 'assets/engagement/images/couple-main.webp',
      secondaryPhoto: '',
    });
    fixture.componentRef.setInput('event', {
      title: 'Engagement Ceremony',
      date: '20 December 2026',
      time: '6:30 PM',
      venueName: 'Engagement Venue',
      venueAddress: 'City, India',
      googleMapsUrl: 'https://maps.google.com',
    });
    fixture.componentRef.setInput('families', {
      groomFamily: 'Groom Family',
      brideFamily: 'Bride Family',
    });
    fixture.componentRef.setInput('messages', {
      welcomeMessage: 'Welcome',
      coupleMessage: 'Two hearts, one beautiful beginning.',
      invitationMessage: 'Please join us',
      countdownMessage: 'Counting down to our special day',
      eventStartedMessage: 'Our beautiful journey begins today.',
      closingMessage: 'Thank you',
      closingSupportingMessage: "We can't wait to celebrate with you.",
    });
    fixture.componentRef.setInput('labels', invitationConfig.labels);
    fixture.componentRef.setInput('showVenueDetails', false);
    fixture.componentRef.setInput('showAction', false);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).not.toContain('Engagement Venue');
    expect(compiled.querySelector('button')).toBeNull();
  });
});
