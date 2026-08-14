import { Injectable } from '@angular/core';

import { invitationConfig } from '../config/invitation.config';
import { InvitationConfig } from '../models/invitation.model';
import { INVITATION_STAGES, InvitationStageKey } from '../models/invitation-stage.model';

@Injectable({
  providedIn: 'root',
})
export class InvitationService {
  getInvitation(): InvitationConfig {
    return invitationConfig;
  }

  getStages(): InvitationStageKey[] {
    return [...INVITATION_STAGES];
  }

  getStageAt(stages: InvitationStageKey[], index: number): InvitationStageKey {
    return stages[Math.max(0, Math.min(index, stages.length - 1))];
  }
}
