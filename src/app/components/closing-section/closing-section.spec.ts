import { TestBed } from '@angular/core/testing';

import { invitationConfig } from '../../config/invitation.config';
import { ClosingSectionComponent } from './closing-section';

describe('ClosingSectionComponent', () => {
  it('hides family names when family details are disabled', () => {
    const fixture = TestBed.createComponent(ClosingSectionComponent);
    fixture.componentRef.setInput('couple', {
      groomName: 'Groom Name',
      brideName: 'Bride Name',
      coupleDisplayName: 'Groom Name & Bride Name',
      couplePhoto: 'assets/engagement/images/couple-main.webp',
      secondaryPhoto: '',
    });
    fixture.componentRef.setInput('families', {
      brideFamily: 'Bride Family',
      groomFamily: 'Groom Family',
    });
    fixture.componentRef.setInput('messages', {
      welcomeMessage: 'Welcome',
      coupleMessage: 'Two hearts, one beautiful beginning.',
      invitationMessage: 'Please join us',
      countdownMessage: 'Counting down to our special day',
      eventStartedMessage: 'Our beautiful journey begins today.',
      closingMessage: 'Your presence will make\nour celebration even more special.',
      closingSupportingMessage: "We can't wait to celebrate with you.",
    });
    fixture.componentRef.setInput('labels', invitationConfig.labels);
    fixture.componentRef.setInput('showFamilies', false);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Your presence will make');
    expect(compiled.textContent).toContain("We can't wait to celebrate with you.");
    expect(compiled.textContent).toContain('With Love,');
    expect(compiled.textContent).toContain('Groom Name & Bride Name');
    expect(compiled.textContent).not.toContain('Bride Family');
    expect(compiled.textContent).not.toContain('Groom Family');
  });

  it('can hide the replay action when needed', () => {
    const fixture = TestBed.createComponent(ClosingSectionComponent);
    fixture.componentRef.setInput('couple', {
      groomName: 'Groom Name',
      brideName: 'Bride Name',
      coupleDisplayName: 'Groom Name & Bride Name',
      couplePhoto: 'assets/engagement/images/couple-main.webp',
      secondaryPhoto: '',
    });
    fixture.componentRef.setInput('families', {
      brideFamily: 'Bride Family',
      groomFamily: 'Groom Family',
    });
    fixture.componentRef.setInput('messages', {
      welcomeMessage: 'Welcome',
      coupleMessage: 'Two hearts, one beautiful beginning.',
      invitationMessage: 'Please join us',
      countdownMessage: 'Counting down to our special day',
      eventStartedMessage: 'Our beautiful journey begins today.',
      closingMessage: 'Thank you for joining us.',
      closingSupportingMessage: "We can't wait to celebrate with you.",
    });
    fixture.componentRef.setInput('labels', invitationConfig.labels);
    fixture.componentRef.setInput('showRestartAction', false);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).not.toContain('Replay Invitation');
    expect(fixture.nativeElement.querySelector('button')).toBeNull();
  });

  it('emits replay when the replay invitation button is clicked', () => {
    const fixture = TestBed.createComponent(ClosingSectionComponent);
    fixture.componentRef.setInput('couple', {
      groomName: 'Groom Name',
      brideName: 'Bride Name',
      coupleDisplayName: 'Groom Name & Bride Name',
      couplePhoto: 'assets/engagement/images/couple-main.webp',
      secondaryPhoto: '',
    });
    fixture.componentRef.setInput('families', {
      brideFamily: 'Bride Family',
      groomFamily: 'Groom Family',
    });
    fixture.componentRef.setInput('messages', {
      welcomeMessage: 'Welcome',
      coupleMessage: 'Two hearts, one beautiful beginning.',
      invitationMessage: 'Please join us',
      countdownMessage: 'Counting down to our special day',
      eventStartedMessage: 'Our beautiful journey begins today.',
      closingMessage: 'Thank you for joining us.',
      closingSupportingMessage: "We can't wait to celebrate with you.",
    });
    fixture.componentRef.setInput('labels', invitationConfig.labels);

    const emitSpy = vi.fn();
    fixture.componentInstance.restartInvitation.subscribe(emitSpy);
    fixture.detectChanges();

    fixture.nativeElement.querySelector('button')?.click();

    expect(emitSpy).toHaveBeenCalledOnce();
  });
});
