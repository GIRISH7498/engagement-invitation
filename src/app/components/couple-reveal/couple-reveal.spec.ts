import { TestBed } from '@angular/core/testing';

import { invitationConfig } from '../../config/invitation.config';
import { CoupleRevealComponent } from './couple-reveal';

describe('CoupleRevealComponent', () => {
  it('renders configured couple details and emits when continuing', () => {
    const fixture = TestBed.createComponent(CoupleRevealComponent);
    fixture.componentRef.setInput('couple', {
      groomName: 'Groom Name',
      brideName: 'Bride Name',
      coupleDisplayName: 'Groom Name & Bride Name',
      couplePhoto: 'assets/engagement/images/couple-main.webp',
      secondaryPhoto: '',
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

    const emitSpy = vi.fn();
    fixture.componentInstance.viewInvitation.subscribe(emitSpy);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const image = compiled.querySelector<HTMLImageElement>('img');
    const heading = compiled.querySelector<HTMLHeadingElement>('h1.names');
    const button = compiled.querySelector<HTMLButtonElement>('button');

    expect(compiled.textContent).toContain('Groom Name');
    expect(compiled.textContent).toContain('Bride Name');
    expect(compiled.textContent).toContain('Two hearts, one beautiful beginning.');
    expect(image?.alt).toBe('Groom Name & Bride Name portrait');
    expect(image?.getAttribute('decoding')).toBe('async');
    expect(heading).toBeTruthy();
    expect(button?.getAttribute('aria-label')).toBe(
      invitationConfig.labels.viewInvitationAriaLabel,
    );

    button?.click();

    expect(emitSpy).toHaveBeenCalledOnce();
  });
});
