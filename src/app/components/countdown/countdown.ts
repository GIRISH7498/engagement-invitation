import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Injector,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';

import {
  InvitationEventConfig,
  InvitationLabelsConfig,
  InvitationMessagesConfig,
} from '../../models/invitation.model';

interface CountdownValue {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
}

interface DateParts {
  year: number;
  month: number;
  day: number;
}

interface TimeParts {
  hours: number;
  minutes: number;
}

@Component({
  selector: 'app-countdown',
  imports: [],
  templateUrl: './countdown.html',
  styleUrl: './countdown.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountdownComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly injector = inject(Injector);
  private readonly monthIndexes = new Map(
    [
      'january',
      'february',
      'march',
      'april',
      'may',
      'june',
      'july',
      'august',
      'september',
      'october',
      'november',
      'december',
    ].map((month, index) => [month, index]),
  );
  private intervalId: ReturnType<typeof setInterval> | null = null;

  readonly event = input.required<InvitationEventConfig>();
  readonly messages = input.required<InvitationMessagesConfig>();
  readonly labels = input.required<InvitationLabelsConfig>();
  readonly now = signal(Date.now());
  readonly isDocumentVisible = signal(this.getDocumentVisibility());

  readonly targetDate = computed(() => this.parseTargetDate(this.event().date, this.event().time));
  readonly countdown = computed(() => {
    const targetDate = this.targetDate();

    if (!targetDate) {
      return null;
    }

    return this.calculateCountdown(targetDate.getTime() - this.now());
  });
  readonly countdownItems = computed(() => {
    const countdown = this.countdown();

    if (!countdown) {
      return [];
    }

    return [
      { label: this.labels().days, value: String(countdown.days) },
      { label: this.labels().hours, value: this.padTime(countdown.hours) },
      { label: this.labels().minutes, value: this.padTime(countdown.minutes) },
      { label: this.labels().seconds, value: this.padTime(countdown.seconds) },
    ];
  });
  readonly targetDateLabel = computed(() => `${this.event().date}, ${this.event().time}`);
  readonly hasInvalidDate = computed(() => this.targetDate() === null);
  readonly hasStarted = computed(() => {
    const countdown = this.countdown();

    return countdown !== null && countdown.totalMs === 0;
  });

  constructor() {
    const removeVisibilityListener = this.listenForVisibilityChanges();

    this.destroyRef.onDestroy(() => {
      this.clearTimer();
      removeVisibilityListener?.();
    });
  }

  ngOnInit(): void {
    effect(
      () => {
        const targetDate = this.targetDate();
        const needsTimer =
          this.isDocumentVisible() && targetDate !== null && targetDate.getTime() > this.now();

        if (needsTimer) {
          this.startTimer();
          return;
        }

        this.clearTimer();
      },
      { injector: this.injector },
    );
  }

  private startTimer(): void {
    if (this.intervalId !== null) {
      return;
    }

    this.intervalId = setInterval(() => {
      this.now.set(Date.now());
    }, 1000);
  }

  private clearTimer(): void {
    if (this.intervalId === null) {
      return;
    }

    clearInterval(this.intervalId);
    this.intervalId = null;
  }

  private listenForVisibilityChanges(): (() => void) | undefined {
    if (typeof document === 'undefined') {
      return undefined;
    }

    const updateVisibility = () => {
      const isVisible = this.getDocumentVisibility();

      this.isDocumentVisible.set(isVisible);

      if (isVisible) {
        this.now.set(Date.now());
      }
    };

    document.addEventListener('visibilitychange', updateVisibility);

    return () => document.removeEventListener('visibilitychange', updateVisibility);
  }

  private getDocumentVisibility(): boolean {
    return typeof document === 'undefined' || document.visibilityState !== 'hidden';
  }

  private calculateCountdown(remainingMs: number): CountdownValue {
    const totalMs = Math.max(remainingMs, 0);
    const totalSeconds = Math.floor(totalMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return { days, hours, minutes, seconds, totalMs };
  }

  private parseTargetDate(dateValue: string, timeValue: string): Date | null {
    const dateParts = this.parseConfiguredDate(dateValue.trim());
    const timeParts = this.parseConfiguredTime(timeValue.trim());

    if (!dateParts || !timeParts) {
      return null;
    }

    return new Date(
      dateParts.year,
      dateParts.month,
      dateParts.day,
      timeParts.hours,
      timeParts.minutes,
    );
  }

  private parseConfiguredDate(value: string): DateParts | null {
    const indianDate = /^(\d{1,2})\s+([a-zA-Z]+)\s+(\d{4})$/.exec(value);

    if (indianDate) {
      const month = this.monthIndexes.get(indianDate[2].toLowerCase());

      return month === undefined
        ? null
        : this.createValidatedDateParts(Number(indianDate[3]), month, Number(indianDate[1]));
    }

    const isoDate = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

    if (isoDate) {
      return this.createValidatedDateParts(
        Number(isoDate[1]),
        Number(isoDate[2]) - 1,
        Number(isoDate[3]),
      );
    }

    return null;
  }

  private parseConfiguredTime(value: string): TimeParts | null {
    const cleanValue = value
      .toLowerCase()
      .replace(/\bonwards\b|\bsharp\b/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    const match = /^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/.exec(cleanValue);

    if (!match) {
      return null;
    }

    const hour = Number(match[1]);
    const minutes = match[2] ? Number(match[2]) : 0;
    const meridiem = match[3];

    if (minutes > 59 || (meridiem && (hour < 1 || hour > 12)) || (!meridiem && hour > 23)) {
      return null;
    }

    return {
      hours: meridiem ? this.to24HourTime(hour, meridiem) : hour,
      minutes,
    };
  }

  private createValidatedDateParts(year: number, month: number, day: number): DateParts | null {
    const date = new Date(year, month, day);

    if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
      return null;
    }

    return { year, month, day };
  }

  private to24HourTime(hour: number, meridiem: string): number {
    if (meridiem === 'am') {
      return hour === 12 ? 0 : hour;
    }

    return hour === 12 ? 12 : hour + 12;
  }

  private padTime(value: number): string {
    return value.toString().padStart(2, '0');
  }
}
