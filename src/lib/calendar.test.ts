import { describe, expect, it } from "vitest";
import { buildIcs, googleCalendarUrl, type AllDayEvent } from "./calendar";

const event: AllDayEvent = {
  uid: "doors-open@thevisibilitycodes.com",
  title: "The Visibility Codes Masterclass: Doors Open",
  date: "2026-10-17",
  description: "4 days, live online; starts 28 October, 2026",
  url: "https://thevisibilitycodes.com",
};

describe("googleCalendarUrl", () => {
  it("builds an all-day template link ending the next day", () => {
    const url = new URL(googleCalendarUrl(event));
    expect(url.origin + url.pathname).toBe("https://calendar.google.com/calendar/render");
    expect(url.searchParams.get("action")).toBe("TEMPLATE");
    expect(url.searchParams.get("text")).toBe(event.title);
    expect(url.searchParams.get("dates")).toBe("20261017/20261018");
  });

  it("rolls over month ends", () => {
    const url = new URL(googleCalendarUrl({ ...event, date: "2026-10-31" }));
    expect(url.searchParams.get("dates")).toBe("20261031/20261101");
  });
});

describe("buildIcs", () => {
  const ics = buildIcs(event, new Date("2026-09-14T10:00:00Z"));

  it("is a CRLF VCALENDAR with an all-day VEVENT", () => {
    expect(ics.startsWith("BEGIN:VCALENDAR\r\n")).toBe(true);
    expect(ics.trimEnd().endsWith("END:VCALENDAR")).toBe(true);
    expect(ics).toContain("\r\nDTSTART;VALUE=DATE:20261017\r\n");
    expect(ics).toContain("\r\nDTEND;VALUE=DATE:20261018\r\n");
    expect(ics).toContain("\r\nDTSTAMP:20260914T100000Z\r\n");
    expect(ics).toContain("\r\nUID:doors-open@thevisibilitycodes.com\r\n");
  });

  it("escapes commas and semicolons", () => {
    expect(ics).toContain("DESCRIPTION:4 days\\, live online\\; starts 28 October\\, 2026");
  });
});
