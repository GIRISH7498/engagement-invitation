import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  computed,
  input,
  output,
  signal,
} from '@angular/core';

import {
  InvitationCoupleConfig,
  InvitationLabelsConfig,
  InvitationMessagesConfig,
} from '../../models/invitation.model';

@Component({
  selector: 'app-invitation-cover',
  imports: [],
  templateUrl: './invitation-cover.html',
  styleUrl: './invitation-cover.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvitationCoverComponent implements OnDestroy {
  private readonly openingDurationMs = 1700;
  private readonly reducedMotionDurationMs = 320;
  private openingTimer: ReturnType<typeof setTimeout> | undefined;

  readonly couple = input.required<InvitationCoupleConfig>();
  readonly messages = input.required<InvitationMessagesConfig>();
  readonly labels = input.required<InvitationLabelsConfig>();
  readonly openRequested = output<void>();
  readonly openInvitation = output<void>();
  readonly isOpening = signal(false);

  readonly sealText = computed(() => {
    const groomInitial = this.couple().groomName.trim().charAt(0).toUpperCase();
    const brideInitial = this.couple().brideName.trim().charAt(0).toUpperCase();
    const initials = [groomInitial, brideInitial].filter(Boolean);

    return initials.length ? initials.join(' & ') : this.labels().coverSealFallback;
  });

  open(): void {
    if (this.isOpening()) {
      return;
    }

    this.openRequested.emit();
    this.isOpening.set(true);
    this.openingTimer = setTimeout(() => {
      this.openInvitation.emit();
    }, this.getAnimationDuration());
  }

  ngOnDestroy(): void {
    if (this.openingTimer) {
      clearTimeout(this.openingTimer);
    }
  }

  private getAnimationDuration(): number {
    const prefersReducedMotion =
      typeof globalThis.matchMedia === 'function' &&
      globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches;

    return prefersReducedMotion ? this.reducedMotionDurationMs : this.openingDurationMs;
  }
}
