import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { InvitationFamiliesConfig, InvitationLabelsConfig } from '../../models/invitation.model';

@Component({
  selector: 'app-family-details',
  imports: [],
  templateUrl: './family-details.html',
  styleUrl: './family-details.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FamilyDetailsComponent {
  readonly families = input.required<InvitationFamiliesConfig>();
  readonly labels = input.required<InvitationLabelsConfig>();
}
