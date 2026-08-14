import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import {
  InvitationCoupleConfig,
  InvitationFamiliesConfig,
  InvitationLabelsConfig,
  InvitationMessagesConfig,
} from '../../models/invitation.model';

@Component({
  selector: 'app-closing-section',
  imports: [],
  templateUrl: './closing-section.html',
  styleUrl: './closing-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClosingSectionComponent {
  readonly couple = input.required<InvitationCoupleConfig>();
  readonly families = input.required<InvitationFamiliesConfig>();
  readonly messages = input.required<InvitationMessagesConfig>();
  readonly labels = input.required<InvitationLabelsConfig>();
  readonly showFamilies = input(true);
  readonly showRestartAction = input(true);
  readonly restartInvitation = output<void>();
}
