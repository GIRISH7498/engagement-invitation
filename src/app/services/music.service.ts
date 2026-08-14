import { Injectable, computed, signal } from '@angular/core';

import { InvitationMusicConfig } from '../models/invitation.model';

@Injectable({
  providedIn: 'root',
})
export class MusicService {
  private readonly filePath = signal('');
  private readonly isConfigured = signal(false);
  private readonly hasUserActivated = signal(false);
  private audio: HTMLAudioElement | null = null;
  private audioFilePath = '';

  readonly isPlaying = signal(false);
  readonly isMuted = signal(false);
  readonly isControlVisible = computed(() => this.isConfigured() && this.hasUserActivated());
  readonly isAudible = computed(() => this.isPlaying() && !this.isMuted());

  configure(config: InvitationMusicConfig, featureEnabled: boolean): void {
    const nextFilePath = config.filePath.trim();
    const nextIsConfigured = featureEnabled && config.enabled && nextFilePath.length > 0;

    if (this.filePath() !== nextFilePath) {
      this.stopAudio();
    }

    this.filePath.set(nextFilePath);
    this.isConfigured.set(nextIsConfigured);

    if (!nextIsConfigured) {
      this.hasUserActivated.set(false);
      this.stopAudio();
    }
  }

  startFromUserGesture(config: InvitationMusicConfig, featureEnabled: boolean): void {
    this.configure(config, featureEnabled);

    if (!this.isConfigured()) {
      return;
    }

    this.hasUserActivated.set(true);
    this.playCurrentAudio();
  }

  toggleMute(): void {
    if (!this.isControlVisible()) {
      return;
    }

    const shouldMute = this.isAudible();
    this.isMuted.set(shouldMute);

    if (this.audio) {
      this.audio.muted = shouldMute;
    }

    if (!shouldMute) {
      this.playCurrentAudio();
    }
  }

  private playCurrentAudio(): void {
    const audio = this.ensureAudio();

    if (!audio) {
      this.isPlaying.set(false);
      return;
    }

    audio.muted = this.isMuted();

    try {
      const playResult = audio.play();

      if (typeof playResult?.then === 'function') {
        playResult
          .then(() => this.isPlaying.set(true))
          .catch(() => this.isPlaying.set(false));
        return;
      }

      this.isPlaying.set(true);
    } catch {
      this.isPlaying.set(false);
    }
  }

  private ensureAudio(): HTMLAudioElement | null {
    const nextFilePath = this.filePath();

    if (!nextFilePath || typeof Audio === 'undefined') {
      return null;
    }

    if (this.audio && this.audioFilePath === nextFilePath) {
      return this.audio;
    }

    this.stopAudio();

    this.audio = new Audio(nextFilePath);
    this.audioFilePath = nextFilePath;
    this.audio.loop = true;
    this.audio.preload = 'auto';
    this.audio.volume = 0.38;
    this.audio.addEventListener('pause', () => this.isPlaying.set(false));
    this.audio.addEventListener('error', () => this.isPlaying.set(false));

    return this.audio;
  }

  private stopAudio(): void {
    if (!this.audio) {
      this.isPlaying.set(false);
      return;
    }

    try {
      this.audio.pause();
      this.audio.currentTime = 0;
    } catch {
      // Missing or blocked media should never interrupt the invitation.
    }

    this.audio = null;
    this.audioFilePath = '';
    this.isPlaying.set(false);
  }
}
