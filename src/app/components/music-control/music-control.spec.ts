import { TestBed } from '@angular/core/testing';

import { invitationConfig } from '../../config/invitation.config';
import { MusicService } from '../../services/music.service';
import { MusicControlComponent } from './music-control';

describe('MusicControlComponent', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('renders only after music has been activated and toggles the service', async () => {
    const toggleSpy = vi.spyOn(MusicService.prototype, 'toggleMute');
    vi.stubGlobal(
      'Audio',
      vi.fn(function () {
        return {
          loop: false,
          muted: false,
          preload: '',
          volume: 1,
          currentTime: 0,
          play: vi.fn(() => Promise.resolve()),
          pause: vi.fn(),
          addEventListener: vi.fn(),
        };
      }),
    );

    const fixture = TestBed.createComponent(MusicControlComponent);
    fixture.componentRef.setInput('labels', invitationConfig.labels);
    const service = TestBed.inject(MusicService);

    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('button')).toBeNull();

    service.startFromUserGesture(
      {
        enabled: true,
        filePath: 'assets/engagement/music/background-music.mp3',
      },
      true,
    );
    await Promise.resolve();
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;

    expect(button.textContent).toContain('Music On');
    expect(button.getAttribute('aria-label')).toBe(invitationConfig.labels.muteMusicAriaLabel);
    expect(button.getAttribute('aria-pressed')).toBe('true');

    button.click();
    fixture.detectChanges();

    expect(toggleSpy).toHaveBeenCalledOnce();
    expect(button.textContent).toContain(invitationConfig.labels.musicOff);
    expect(button.getAttribute('aria-label')).toBe(invitationConfig.labels.playMusicAriaLabel);
    expect(button.getAttribute('aria-pressed')).toBe('false');
  });
});
