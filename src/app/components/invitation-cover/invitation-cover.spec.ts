import { TestBed } from '@angular/core/testing';

import { invitationConfig } from '../../config/invitation.config';
import { InvitationCoverComponent } from './invitation-cover';

describe('InvitationCoverComponent', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('emits once after the opening animation delay', () => {
    vi.useFakeTimers();

    const fixture = TestBed.createComponent(InvitationCoverComponent);
    fixture.componentRef.setInput('couple', {
      groomName: 'Groom Name',
      brideName: 'Bride Name',
      coupleDisplayName: 'Groom Name & Bride Name',
      couplePhoto: '',
      secondaryPhoto: '',
    });
    fixture.componentRef.setInput('messages', {
      welcomeMessage: 'Welcome',
      coupleMessage: 'Together',
      invitationMessage: 'Please join us',
      countdownMessage: 'Counting down to our special day',
      eventStartedMessage: 'Our beautiful journey begins today.',
      closingMessage: 'Thank you',
      closingSupportingMessage: "We can't wait to celebrate with you.",
    });
    fixture.componentRef.setInput('labels', invitationConfig.labels);

    const emitSpy = vi.fn();
    const openRequestedSpy = vi.fn();
    fixture.componentInstance.openRequested.subscribe(openRequestedSpy);
    fixture.componentInstance.openInvitation.subscribe(emitSpy);
    fixture.detectChanges();

    fixture.componentInstance.open();
    fixture.componentInstance.open();

    expect(openRequestedSpy).toHaveBeenCalledOnce();
    expect(emitSpy).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1900);

    expect(emitSpy).toHaveBeenCalledOnce();
  });
});
