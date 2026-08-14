import { ComponentFixture, TestBed } from '@angular/core/testing';

import { invitationConfig } from '../../config/invitation.config';
import { InvitationEventConfig, InvitationMessagesConfig } from '../../models/invitation.model';
import { CountdownComponent } from './countdown';

describe('CountdownComponent', () => {
  const messages: InvitationMessagesConfig = {
    welcomeMessage: 'Welcome',
    coupleMessage: 'Two hearts, one beautiful beginning.',
    invitationMessage: 'Please join us',
    countdownMessage: 'Counting down to our special day',
    eventStartedMessage: 'Our beautiful journey begins today.',
    closingMessage: 'Thank you',
    closingSupportingMessage: "We can't wait to celebrate with you.",
  };

  const event: InvitationEventConfig = {
    title: 'Engagement Ceremony',
    date: '20 December 2026',
    time: '6:30 PM',
    venueName: 'Engagement Venue',
    venueAddress: 'City, India',
    googleMapsUrl: 'https://maps.google.com',
  };

  afterEach(() => {
    restoreDocumentVisibility();
    vi.useRealTimers();
  });

  it('updates the countdown every second until the event time', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 11, 20, 18, 29, 58));

    const fixture = createComponent();

    expect(getUnitValue(fixture, 'Seconds')).toBe('02');

    vi.advanceTimersByTime(1000);
    fixture.detectChanges();

    expect(getUnitValue(fixture, 'Seconds')).toBe('01');

    vi.advanceTimersByTime(1000);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Our beautiful journey begins today.');
  });

  it('shows a completed message when the event date has passed', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 11, 20, 18, 30, 1));

    const fixture = createComponent();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Our beautiful journey begins today.');
    expect(compiled.querySelector('.countdown-grid')).toBeNull();
  });

  it('handles an invalid configured date without starting a timer', () => {
    vi.useFakeTimers();
    const setIntervalSpy = vi.spyOn(globalThis, 'setInterval');

    const fixture = createComponent({
      date: 'Someday soon',
      time: 'Evening',
    });
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain(invitationConfig.labels.countdownInvalidMessage);
    expect(setIntervalSpy).not.toHaveBeenCalled();
  });

  it('clears the interval when the component is destroyed', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 11, 19, 18, 30, 0));

    const fixture = createComponent();

    expect(vi.getTimerCount()).toBe(1);

    fixture.destroy();

    expect(vi.getTimerCount()).toBe(0);
  });

  it('does not run the countdown timer while the document is hidden', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 11, 19, 18, 30, 0));
    mockDocumentVisibility('hidden');

    const fixture = createComponent();

    expect(vi.getTimerCount()).toBe(0);

    mockDocumentVisibility('visible');
    document.dispatchEvent(new Event('visibilitychange'));
    fixture.detectChanges();

    expect(vi.getTimerCount()).toBe(1);

    fixture.destroy();

    expect(vi.getTimerCount()).toBe(0);
  });

  function createComponent(eventOverrides: Partial<InvitationEventConfig> = {}) {
    const fixture = TestBed.createComponent(CountdownComponent);
    fixture.componentRef.setInput('event', { ...event, ...eventOverrides });
    fixture.componentRef.setInput('messages', messages);
    fixture.componentRef.setInput('labels', invitationConfig.labels);
    fixture.detectChanges();

    return fixture;
  }

  function getUnitValue(fixture: ComponentFixture<CountdownComponent>, label: string): string {
    const compiled = fixture.nativeElement as HTMLElement;
    const unit = Array.from(compiled.querySelectorAll<HTMLElement>('.count-unit')).find(
      (element) => element.querySelector('span')?.textContent?.trim() === label,
    );

    return unit?.querySelector('strong')?.textContent?.trim() ?? '';
  }

  function mockDocumentVisibility(state: DocumentVisibilityState): void {
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => state,
    });
  }

  function restoreDocumentVisibility(): void {
    delete (document as unknown as { visibilityState?: DocumentVisibilityState }).visibilityState;
  }
});
