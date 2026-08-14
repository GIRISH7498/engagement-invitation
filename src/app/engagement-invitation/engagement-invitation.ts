import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  computed,
  inject,
  signal,
} from '@angular/core';

import { ClosingSectionComponent } from '../components/closing-section/closing-section';
import { CountdownComponent } from '../components/countdown/countdown';
import { CoupleRevealComponent } from '../components/couple-reveal/couple-reveal';
import { DecorativeBackgroundComponent } from '../components/decorative-background/decorative-background';
import { EventDetailsComponent } from '../components/event-details/event-details';
import { FamilyDetailsComponent } from '../components/family-details/family-details';
import { InvitationCoverComponent } from '../components/invitation-cover/invitation-cover';
import { MusicControlComponent } from '../components/music-control/music-control';
import { VenueComponent } from '../components/venue/venue';
import { InvitationService } from '../services/invitation.service';
import { MusicService } from '../services/music.service';

type StageTransitionPhase = 'settled' | 'leaving' | 'entering';
type StageTransitionDirection = 'forward' | 'backward';

@Component({
  selector: 'app-engagement-invitation',
  imports: [
    ClosingSectionComponent,
    CountdownComponent,
    CoupleRevealComponent,
    DecorativeBackgroundComponent,
    EventDetailsComponent,
    FamilyDetailsComponent,
    InvitationCoverComponent,
    MusicControlComponent,
    VenueComponent,
  ],
  templateUrl: './engagement-invitation.html',
  styleUrl: './engagement-invitation.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EngagementInvitationComponent implements OnDestroy {
  private readonly leaveDurationMs = 240;
  private readonly enterDurationMs = 460;
  private readonly invitationService = inject(InvitationService);
  private readonly musicService = inject(MusicService);
  private stageSwapTimer: ReturnType<typeof setTimeout> | undefined;
  private stageSettleTimer: ReturnType<typeof setTimeout> | undefined;

  readonly invitation = this.invitationService.getInvitation();
  readonly stages = this.invitationService.getStages();
  readonly stageIndex = signal(0);
  readonly transitionPhase = signal<StageTransitionPhase>('settled');
  readonly transitionDirection = signal<StageTransitionDirection>('forward');
  readonly currentStage = computed(() =>
    this.invitationService.getStageAt(this.stages, this.stageIndex()),
  );
  readonly isTransitioning = computed(() => this.transitionPhase() !== 'settled');
  readonly isStoryStage = computed(() => this.currentStage() === 'invitationStory');

  constructor() {
    this.musicService.configure(this.invitation.music, this.invitation.features.showMusic);
  }

  startMusic(): void {
    this.musicService.startFromUserGesture(
      this.invitation.music,
      this.invitation.features.showMusic,
    );
  }

  goNext(): void {
    this.transitionTo(Math.min(this.stageIndex() + 1, this.stages.length - 1), 'forward');
  }

  goBack(): void {
    this.transitionTo(Math.max(this.stageIndex() - 1, 0), 'backward');
  }

  restart(): void {
    this.resetScrollPosition();
    this.transitionTo(0, 'backward');
  }

  ngOnDestroy(): void {
    this.clearTransitionTimers();
  }

  private transitionTo(nextIndex: number, direction: StageTransitionDirection): void {
    if (nextIndex === this.stageIndex() || this.isTransitioning()) {
      return;
    }

    this.transitionDirection.set(direction);

    if (this.prefersReducedMotion()) {
      this.stageIndex.set(nextIndex);
      this.transitionPhase.set('settled');
      return;
    }

    this.clearTransitionTimers();
    this.transitionPhase.set('leaving');
    this.stageSwapTimer = setTimeout(() => {
      this.stageIndex.set(nextIndex);
      this.transitionPhase.set('entering');
      this.stageSettleTimer = setTimeout(() => {
        this.transitionPhase.set('settled');
      }, this.enterDurationMs);
    }, this.leaveDurationMs);
  }

  private clearTransitionTimers(): void {
    if (this.stageSwapTimer) {
      clearTimeout(this.stageSwapTimer);
      this.stageSwapTimer = undefined;
    }

    if (this.stageSettleTimer) {
      clearTimeout(this.stageSettleTimer);
      this.stageSettleTimer = undefined;
    }
  }

  private prefersReducedMotion(): boolean {
    return (
      typeof globalThis.matchMedia === 'function' &&
      globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  private resetScrollPosition(): void {
    if (typeof document === 'undefined') {
      return;
    }

    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }
}
