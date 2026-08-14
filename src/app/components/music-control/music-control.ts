import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

import { InvitationLabelsConfig } from '../../models/invitation.model';
import { MusicService } from '../../services/music.service';

@Component({
  selector: 'app-music-control',
  imports: [],
  templateUrl: './music-control.html',
  styleUrl: './music-control.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MusicControlComponent {
  readonly music = inject(MusicService);
  readonly labels = input.required<InvitationLabelsConfig>();

  toggleMusic(): void {
    this.music.toggleMute();
  }
}
