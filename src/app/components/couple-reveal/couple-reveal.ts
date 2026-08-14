import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import {
  InvitationCoupleConfig,
  InvitationLabelsConfig,
  InvitationMessagesConfig,
} from '../../models/invitation.model';

@Component({
  selector: 'app-couple-reveal',
  imports: [],
  templateUrl: './couple-reveal.html',
  styleUrl: './couple-reveal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoupleRevealComponent {
  readonly couple = input.required<InvitationCoupleConfig>();
  readonly messages = input.required<InvitationMessagesConfig>();
  readonly labels = input.required<InvitationLabelsConfig>();
  readonly viewInvitation = output<void>();

  readonly monogram = computed(() => {
    const groomInitial = this.couple().groomName.trim().charAt(0);
    const brideInitial = this.couple().brideName.trim().charAt(0);

    return `${groomInitial} & ${brideInitial}`;
  });

  readonly photoAlt = computed(() => `${this.couple().coupleDisplayName} portrait`);
}
