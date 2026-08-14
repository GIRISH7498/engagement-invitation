export const INVITATION_STAGES = [
  'cover',
  'coupleReveal',
  'invitationStory',
] as const;

export type InvitationStageKey = (typeof INVITATION_STAGES)[number];
