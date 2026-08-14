import { TestBed } from '@angular/core/testing';

import { EngagementInvitationComponent } from './engagement-invitation';

describe('EngagementInvitationComponent', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('transitions calmly from cover to couple reveal to the scrolling story', () => {
    vi.useFakeTimers();
    const fixture = TestBed.createComponent(EngagementInvitationComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.currentStage()).toBe('cover');

    component.goNext();

    expect(component.transitionPhase()).toBe('leaving');
    expect(component.currentStage()).toBe('cover');

    vi.advanceTimersByTime(260);
    fixture.detectChanges();

    expect(component.currentStage()).toBe('coupleReveal');
    expect(component.transitionPhase()).toBe('entering');

    vi.advanceTimersByTime(520);
    fixture.detectChanges();

    expect(component.transitionPhase()).toBe('settled');

    component.goNext();
    vi.advanceTimersByTime(780);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(component.currentStage()).toBe('invitationStory');
    expect(compiled.querySelector('.story-scroll')).toBeTruthy();
    expect(compiled.querySelector('app-event-details')).toBeTruthy();
    expect(compiled.querySelector('app-countdown')).toBeTruthy();
    expect(compiled.querySelector('app-venue')).toBeTruthy();
    expect(compiled.querySelector('app-family-details')).toBeTruthy();
    expect(compiled.querySelector('app-closing-section')).toBeTruthy();
    expect(compiled.querySelector('.flow-controls')).toBeNull();
    expect(compiled.textContent).not.toContain('Continue');
    expect(compiled.textContent).toContain('Replay Invitation');

    fixture.destroy();
  });

  it('prevents repeated navigation while a transition is in progress', () => {
    vi.useFakeTimers();
    const fixture = TestBed.createComponent(EngagementInvitationComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.goNext();
    component.goNext();
    vi.advanceTimersByTime(780);
    fixture.detectChanges();

    expect(component.currentStage()).toBe('coupleReveal');

    fixture.destroy();
  });

  it('replays the invitation by returning from the story to the cover', () => {
    vi.useFakeTimers();
    const fixture = TestBed.createComponent(EngagementInvitationComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.stageIndex.set(2);
    document.documentElement.scrollTop = 320;
    document.body.scrollTop = 320;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const replayButton = Array.from(compiled.querySelectorAll<HTMLButtonElement>('button')).find(
      (button) => button.textContent?.includes('Replay Invitation'),
    );

    replayButton?.click();

    expect(document.documentElement.scrollTop).toBe(0);
    expect(document.body.scrollTop).toBe(0);

    vi.advanceTimersByTime(780);
    fixture.detectChanges();

    expect(component.currentStage()).toBe('cover');
    expect(fixture.nativeElement.querySelector('app-invitation-cover')).toBeTruthy();

    fixture.destroy();
  });

  it('switches stages immediately when reduced motion is preferred', () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({ matches: true })),
    );
    const fixture = TestBed.createComponent(EngagementInvitationComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.goNext();

    expect(component.currentStage()).toBe('coupleReveal');
    expect(component.transitionPhase()).toBe('settled');

    fixture.destroy();
  });
});
