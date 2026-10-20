import { TestBed } from '@angular/core/testing';

import { MusicService } from './music.service';

describe('MusicService', () => {
  const musicConfig = {
    enabled: true,
    filePath: 'assets/engagement/music/background-music.mp3',
  };

  let audioInstances: MockAudio[];
  let shouldRejectPlayback: boolean;

  class MockAudio {
    currentTime = 0;
    loop = false;
    muted = false;
    preload = '';
    volume = 1;
    play = vi.fn(() =>
      shouldRejectPlayback ? Promise.reject(new Error('blocked')) : Promise.resolve(),
    );
    pause = vi.fn();
    addEventListener = vi.fn();

    constructor(readonly src: string) {}
  }

  beforeEach(() => {
    audioInstances = [];
    shouldRejectPlayback = false;
    vi.stubGlobal(
      'Audio',
      vi.fn(function (_src: string) {
        const src = _src;
        const audio = new MockAudio(src);
        audioInstances.push(audio);
        return audio;
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('does not create audio on load when autoplay is disabled', () => {
    const service = TestBed.inject(MusicService);

    service.startOnLoad(musicConfig, true);

    expect(audioInstances).toHaveLength(0);
    expect(service.isControlVisible()).toBe(false);
  });

  it('starts looping audio on load when autoplay is enabled', async () => {
    const service = TestBed.inject(MusicService);
    service.startOnLoad({ ...musicConfig, autoplay: true }, true);
    await Promise.resolve();
    expect(audioInstances).toHaveLength(1);
    expect(audioInstances[0].loop).toBe(true);
    expect(service.isAudible()).toBe(true);
  });

  it('retries blocked autoplay on a tap without replacing or restarting the track', async () => {
    const service = TestBed.inject(MusicService);
    shouldRejectPlayback = true;
    service.startOnLoad({ ...musicConfig, autoplay: true }, true);
    await Promise.resolve();
    await Promise.resolve();
    expect(service.isPlaying()).toBe(false);
    expect(service.isControlVisible()).toBe(true);
    shouldRejectPlayback = false;
    audioInstances[0].currentTime = 12;
    service.startFromUserGesture(musicConfig, true);
    await Promise.resolve();
    expect(audioInstances).toHaveLength(1);
    expect(audioInstances[0].currentTime).toBe(12);
    expect(service.isAudible()).toBe(true);
  });

  it('starts music after a user gesture and toggles mute state', async () => {
    const service = TestBed.inject(MusicService);

    service.startFromUserGesture(musicConfig, true);
    await Promise.resolve();

    expect(audioInstances).toHaveLength(1);
    expect(audioInstances[0].loop).toBe(true);
    expect(audioInstances[0].play).toHaveBeenCalledOnce();
    expect(service.isControlVisible()).toBe(true);
    expect(service.isAudible()).toBe(true);

    service.toggleMute();

    expect(service.isMuted()).toBe(true);
    expect(audioInstances[0].muted).toBe(true);

    service.toggleMute();
    await Promise.resolve();

    expect(service.isMuted()).toBe(false);
    expect(audioInstances[0].muted).toBe(false);
  });

  it('stays quiet when playback fails', async () => {
    const service = TestBed.inject(MusicService);
    shouldRejectPlayback = true;

    service.startFromUserGesture(musicConfig, true);
    await Promise.resolve();
    await Promise.resolve();

    expect(service.isControlVisible()).toBe(true);
    expect(service.isPlaying()).toBe(false);
  });
});
