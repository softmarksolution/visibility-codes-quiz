import { masterclass } from "@/content/site";
import { buildIcs } from "@/lib/calendar";

export function GET() {
  return new Response(buildIcs(masterclass.calendarEvent), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="visibility-codes-doors-open.ics"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
