import "server-only";

/** Public-launch switches. Changing them on Vercel requires a redeploy. */
export const launch = {
  /** `/book` and `/api/book/*` respond 404 unless this is "true". */
  bookingEnabled: process.env.BOOKING_ENABLED === "true",
  /** `/legal` responds 404 and is hidden from the footer unless this is "true". */
  legalNoticePublished: process.env.LEGAL_NOTICE_PUBLISHED === "true",
} as const;
