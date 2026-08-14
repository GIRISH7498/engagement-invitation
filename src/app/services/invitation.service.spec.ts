import { TestBed } from '@angular/core/testing';

import { InvitationService } from './invitation.service';

describe('InvitationService', () => {
  it('resolves the configured active theme preset', () => {
    const service = TestBed.inject(InvitationService);
    const invitation = service.getInvitation();
    const activeThemeId = invitation.theme.activeThemeId;

    expect(activeThemeId).toBeTruthy();
    expect(invitation.theme.name).toBe(invitation.theme.presets?.[activeThemeId!].name);
    expect(invitation.theme.primaryColor).toBe(
      invitation.theme.presets?.[activeThemeId!].primaryColor,
    );
  });
});
