import { ChangeDetectionStrategy, Component } from '@angular/core';

import { EngagementInvitationComponent } from './engagement-invitation/engagement-invitation';

@Component({
  selector: 'app-root',
  imports: [EngagementInvitationComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
