import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { InvitationThemeConfig } from '../../models/invitation.model';

@Component({
  selector: 'app-decorative-background',
  imports: [],
  templateUrl: './decorative-background.html',
  styleUrl: './decorative-background.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DecorativeBackgroundComponent {
  readonly theme = input.required<InvitationThemeConfig>();
}
