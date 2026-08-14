import { Injectable } from '@angular/core';

import { invitationConfig } from '../config/invitation.config';
import { InvitationConfig } from '../models/invitation.model';
import { INVITATION_STAGES, InvitationStageKey } from '../models/invitation-stage.model';

@Injectable({
  providedIn: 'root',
})
export class InvitationService {
  getInvitation(): InvitationConfig {
    return this.withSelectedTheme(invitationConfig);
  }

  getStages(): InvitationStageKey[] {
    return [...INVITATION_STAGES];
  }

  getStageAt(stages: InvitationStageKey[], index: number): InvitationStageKey {
    return stages[Math.max(0, Math.min(index, stages.length - 1))];
  }

  private withSelectedTheme(config: InvitationConfig): InvitationConfig {
    const selectedTheme = config.theme.activeThemeId
      ? config.theme.presets?.[config.theme.activeThemeId]
      : undefined;

    if (!selectedTheme) {
      return config;
    }

    return {
      ...config,
      theme: {
        ...config.theme,
        ...selectedTheme,
      },
    };
  }
}
