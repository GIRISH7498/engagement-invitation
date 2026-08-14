import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import {
  InvitationCoupleConfig,
  InvitationEventConfig,
  InvitationFamiliesConfig,
  InvitationLabelsConfig,
  InvitationMessagesConfig,
} from '../../models/invitation.model';
import { FamilyDetailsComponent } from '../family-details/family-details';

interface EventDateHighlight {
  month: string;
  day: string;
  year: string;
  weekday: string;
  fullLabel: string;
  isoDate: string | null;
  isStructured: boolean;
}

@Component({
  selector: 'app-event-details',
  imports: [FamilyDetailsComponent],
  templateUrl: './event-details.html',
  styleUrl: './event-details.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventDetailsComponent {
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
  private readonly dateFormatter = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

  readonly couple = input.required<InvitationCoupleConfig>();
  readonly event = input.required<InvitationEventConfig>();
  readonly families = input.required<InvitationFamiliesConfig>();
  readonly messages = input.required<InvitationMessagesConfig>();
  readonly labels = input.required<InvitationLabelsConfig>();
  readonly actionLabel = input('');
  readonly showVenueDetails = input(true);
  readonly showFamilies = input(true);
  readonly showAction = input(true);
  readonly continueFlow = output<void>();

  readonly eventDateHighlight = computed(() => this.createDateHighlight(this.event().date));
  readonly eventDateLabel = computed(() => this.eventDateHighlight().fullLabel);
  readonly eventTimeLabel = computed(() => this.event().time.trim());
  readonly resolvedActionLabel = computed(
    () => this.actionLabel().trim() || this.labels().continue,
  );

  private createDateHighlight(value: string): EventDateHighlight {
    const parsedDate = this.parseConfiguredDate(value.trim());

    if (!parsedDate) {
      return {
        month: '',
        day: value,
        year: '',
        weekday: '',
        fullLabel: value,
        isoDate: null,
        isStructured: false,
      };
    }

    const parts = this.dateFormatter.formatToParts(parsedDate);

    return {
      month: this.getDatePart(parts, 'month').toUpperCase(),
      day: this.getDatePart(parts, 'day'),
      year: this.getDatePart(parts, 'year'),
      weekday: this.getDatePart(parts, 'weekday').toUpperCase(),
      fullLabel: this.dateFormatter.format(parsedDate),
      isoDate: parsedDate.toISOString().slice(0, 10),
      isStructured: true,
    };
  }

  private parseConfiguredDate(value: string): Date | null {
    const indianDate = /^(\d{1,2})\s+([a-zA-Z]+)\s+(\d{4})$/.exec(value);

    if (!indianDate) {
      return this.parseIsoDate(value);
    }

    const day = Number(indianDate[1]);
    const month = this.monthIndexes.get(indianDate[2].toLowerCase());
    const year = Number(indianDate[3]);

    if (month === undefined) {
      return null;
    }

    return this.createValidatedDate(year, month, day);
  }

  private parseIsoDate(value: string): Date | null {
    const isoDate = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

    if (!isoDate) {
      return null;
    }

    return this.createValidatedDate(Number(isoDate[1]), Number(isoDate[2]) - 1, Number(isoDate[3]));
  }

  private createValidatedDate(year: number, month: number, day: number): Date | null {
    const date = new Date(Date.UTC(year, month, day));

    if (
      date.getUTCFullYear() !== year ||
      date.getUTCMonth() !== month ||
      date.getUTCDate() !== day
    ) {
      return null;
    }

    return date;
  }

  private getDatePart(
    parts: Intl.DateTimeFormatPart[],
    type: Intl.DateTimeFormatPart['type'],
  ): string {
    return parts.find((part) => part.type === type)?.value ?? '';
  }
}
