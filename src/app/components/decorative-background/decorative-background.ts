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

  readonly fallingHearts = [
    {
      left: '6%',
      size: '0.38rem',
      duration: '14s',
      delay: '-7s',
      drift: '1.4rem',
      rotate: '32deg',
    },
    {
      left: '13%',
      size: '0.48rem',
      duration: '16s',
      delay: '-2s',
      drift: '-1rem',
      rotate: '-24deg',
    },
    {
      left: '21%',
      size: '0.34rem',
      duration: '12s',
      delay: '-10s',
      drift: '1.7rem',
      rotate: '42deg',
    },
    {
      left: '29%',
      size: '0.42rem',
      duration: '15s',
      delay: '-4s',
      drift: '-1.35rem',
      rotate: '-34deg',
    },
    {
      left: '37%',
      size: '0.3rem',
      duration: '13s',
      delay: '-12s',
      drift: '0.9rem',
      rotate: '22deg',
    },
    {
      left: '45%',
      size: '0.54rem',
      duration: '17s',
      delay: '-6s',
      drift: '-1.6rem',
      rotate: '-44deg',
    },
    {
      left: '53%',
      size: '0.36rem',
      duration: '14s',
      delay: '-1s',
      drift: '1.5rem',
      rotate: '36deg',
    },
    {
      left: '61%',
      size: '0.46rem',
      duration: '16s',
      delay: '-11s',
      drift: '-1.2rem',
      rotate: '-30deg',
    },
    {
      left: '69%',
      size: '0.32rem',
      duration: '12s',
      delay: '-5s',
      drift: '1.15rem',
      rotate: '28deg',
    },
    {
      left: '76%',
      size: '0.5rem',
      duration: '18s',
      delay: '-14s',
      drift: '-1.7rem',
      rotate: '-40deg',
    },
    { left: '83%', size: '0.4rem', duration: '15s', delay: '-8s', drift: '1rem', rotate: '26deg' },
    {
      left: '90%',
      size: '0.34rem',
      duration: '13s',
      delay: '-3s',
      drift: '-1.45rem',
      rotate: '-36deg',
    },
    {
      left: '96%',
      size: '0.44rem',
      duration: '17s',
      delay: '-13s',
      drift: '-2rem',
      rotate: '-52deg',
    },
  ] as const;
}
