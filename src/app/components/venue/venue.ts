import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';

import { InvitationEventConfig, InvitationLabelsConfig } from '../../models/invitation.model';
import { CalendarService } from '../../services/calendar.service';

@Component({
  selector: 'app-venue',
  imports: [],
  templateUrl: './venue.html',
  styleUrl: './venue.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VenueComponent {
  private readonly calendarService = inject(CalendarService);

  readonly event = input.required<InvitationEventConfig>();
  readonly labels = input.required<InvitationLabelsConfig>();
  readonly actionLabel = input('');
  readonly showCalendarAction = input(true);
  readonly showContinueAction = input(true);
  readonly addToCalendar = output<void>();
  readonly continueFlow = output<void>();

  readonly resolvedActionLabel = computed(
    () => this.actionLabel().trim() || this.labels().continue,
  );
  readonly calendarUrl = computed(() => this.calendarService.createGoogleCalendarUrl(this.event()));
}
