import { TestBed } from '@angular/core/testing';

import { invitationConfig } from '../../config/invitation.config';
import { FamilyDetailsComponent } from './family-details';

describe('FamilyDetailsComponent', () => {
  it('renders an understated bride-first family blessing', () => {
    const fixture = TestBed.createComponent(FamilyDetailsComponent);
    fixture.componentRef.setInput('families', {
      brideFamily: 'Bride Family',
      groomFamily: 'Groom Family',
    });
    fixture.componentRef.setInput('labels', invitationConfig.labels);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent?.replace(/\s+/g, ' ').trim() ?? '';

    expect(text).toContain('With blessings from');
    expect(text.indexOf('Bride Family')).toBeLessThan(text.indexOf('Groom Family'));
  });
});
