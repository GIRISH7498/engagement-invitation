export interface InvitationCoupleConfig {
  groomName: string;
  brideName: string;
  coupleDisplayName: string;
  couplePhoto: string;
  secondaryPhoto: string;
}

export interface InvitationEventConfig {
  title: string;
  date: string;
  time: string;
  venueName: string;
  venueAddress: string;
  googleMapsUrl: string;
}

export interface InvitationMessagesConfig {
  welcomeMessage: string;
  coupleMessage: string;
  invitationMessage: string;
  countdownMessage: string;
  eventStartedMessage: string;
  closingMessage: string;
  closingSupportingMessage: string;
}

export interface InvitationLabelsConfig {
  coverFamilyLine: string;
  coverTitle: string;
  coverSealFallback: string;
  openInvitation: string;
  openingInvitation: string;
  openInvitationAriaLabel: string;
  openingInvitationAriaLabel: string;
  coupleEyebrow: string;
  viewInvitation: string;
  viewInvitationAriaLabel: string;
  date: string;
  time: string;
  venue: string;
  continue: string;
  countdownEyebrow: string;
  countdownInvalidMessage: string;
  countdownAriaPrefix: string;
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  venueEyebrow: string;
  venueHeading: string;
  getDirections: string;
  getDirectionsAriaPrefix: string;
  getDirectionsAriaSuffix: string;
  addToCalendar: string;
  addToCalendarAriaPrefix: string;
  familyBlessingsAriaLabel: string;
  familyBlessingsIntro: string;
  familySeparator: string;
  closingEyebrow: string;
  closingSignoff: string;
  replayInvitation: string;
  replayInvitationAriaLabel: string;
  musicOn: string;
  musicOff: string;
  muteMusicAriaLabel: string;
  playMusicAriaLabel: string;
  invitationProgressAriaLabel: string;
  storyRegionAriaLabel: string;
  back: string;
  backAriaLabel: string;
  progressSeparator: string;
}

export interface InvitationFamiliesConfig {
  groomFamily: string;
  brideFamily: string;
}

export interface InvitationThemePaletteConfig {
  name: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  accentColor: string;
}

export interface InvitationThemeConfig extends InvitationThemePaletteConfig {
  activeThemeId?: string;
  presets?: Record<string, InvitationThemePaletteConfig>;
}

export interface InvitationMusicConfig {
  enabled: boolean;
  filePath: string;
}

export interface InvitationShareConfig {
  siteUrl: string;
  siteName: string;
  browserTitleTemplate: string;
  titleTemplate: string;
  descriptionTemplate: string;
  image: string;
  imageAltTemplate: string;
}

export interface InvitationFeaturesConfig {
  showCountdown: boolean;
  showVenue: boolean;
  showFamilies: boolean;
  showMusic: boolean;
  showGallery: boolean;
  showCalendar: boolean;
}

export interface InvitationConfig {
  couple: InvitationCoupleConfig;
  event: InvitationEventConfig;
  messages: InvitationMessagesConfig;
  labels: InvitationLabelsConfig;
  families: InvitationFamiliesConfig;
  theme: InvitationThemeConfig;
  music: InvitationMusicConfig;
  share: InvitationShareConfig;
  features: InvitationFeaturesConfig;
}
