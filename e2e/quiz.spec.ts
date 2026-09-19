import { expect, test, type Page } from "@playwright/test";
import { QUESTIONS } from "../src/lib/quiz/questions";

/**
 * The way into the quiz from the landing page: a call to action opens the opt-in
 * pop-up, that hands off to the quiz cover page, and the cover starts the
 * questions. Buttons used to link straight to /quiz, skipping both steps.
 */
async function startQuizFromLanding(page: Page, cta: RegExp = /start assessment/i) {
  await page.getByRole("button", { name: cta }).click();
  await page.getByPlaceholder("Name").fill("Sam Tester");
  await page.getByPlaceholder("Email").fill("sam@example.com");
  await page.getByPlaceholder("Phone").fill("0400000000");
  await page.getByRole("button", { name: /get my visibility score now/i }).click();
  await expect(page).toHaveURL(/\/quiz-cover$/);
  await page.getByRole("link", { name: /start quiz/i }).click();
  await expect(page).toHaveURL(/\/quiz$/);
}

function trackConsoleErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(err.message));
  return errors;
}

test("completes the quiz, unlocks the report and reopens it from the report link", async ({ page, browser }) => {
  const errors = trackConsoleErrors(page);

  await page.goto("/?ref=sam-ab12c");
  await expect(
    page.getByRole("heading", { level: 1, name: "Why Aren’t You Getting The Opportunities You Know You Deserve?" }),
  ).toBeVisible();
  await startQuizFromLanding(page);
  await expect(page).toHaveURL(/\/quiz$/);

  for (let i = 1; i <= 28; i++) {
    await expect(page.getByText(`Question ${i} of 28`)).toBeVisible();
    const next = page.getByRole("button", { name: "Next" });
    if (i === 28) {
      await expect(next).toBeDisabled();
      await page.getByRole("textbox", { name: "Your answer" }).fill("I overthink everything.");
      await next.click();
    } else if (i === 26) {
      // Multi-select waits for Next.
      await expect(next).toBeDisabled();
      await page.locator("label").filter({ has: page.getByRole("checkbox") }).first().click();
      await page.waitForTimeout(700);
      await expect(page.getByText("Question 26 of 28")).toBeVisible();
      await next.click();
    } else {
      // Single choice advances on its own. Last option is the highest score on every scored question.
      await page.locator("label").filter({ has: page.getByRole("radio") }).last().click();
    }
  }

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText("You scored 100/100.")).toBeVisible();
  await expect(dialog.getByRole("heading", { name: "You're a Chosen Expert." })).toBeVisible();

  // The opt-in taken before the quiz pre-fills these, so clear them to check the
  // validation still fires on an empty field.
  await expect(dialog.getByPlaceholder("First name")).toHaveValue("Sam");
  await expect(dialog.getByPlaceholder("Email")).toHaveValue("sam@example.com");
  await dialog.getByPlaceholder("First name").fill("");
  await dialog.getByRole("button", { name: /unlock my full report/i }).click();
  await expect(dialog.getByRole("alert")).toHaveText("Please enter your first name.");

  await dialog.getByPlaceholder("First name").fill("Emma");
  await dialog.getByPlaceholder("Email").fill("emma@example.com");
  await dialog.getByRole("button", { name: /unlock my full report/i }).click();

  await expect(page).toHaveURL(/\/results\?r=v1[A-G]{19}&c=emma-[a-z0-9]{5}$/);
  await expect(page.getByRole("heading", { name: "Emma, here are your results." })).toBeVisible();
  await expect(page.getByTestId("score")).toHaveText("100");
  await expect(page.getByTestId("level")).toHaveText("Chosen Expert");

  // Same link on another device: no stored name, same report.
  const reportUrl = page.url();
  const other = await browser.newContext();
  const otherPage = await other.newPage();
  await otherPage.goto(reportUrl);
  await expect(otherPage.getByRole("heading", { name: "Here are your results." })).toBeVisible();
  await expect(otherPage.getByTestId("score")).toHaveText("100");
  await other.close();

  expect(errors).toEqual([]);
});

test("keeps progress after a reload and allows going back", async ({ page }) => {
  await page.goto("/quiz");
  await page.locator("label").filter({ has: page.getByRole("radio") }).first().click();
  await expect(page.getByText("Question 2 of 28")).toBeVisible();

  await page.reload();
  await expect(page.getByText("Question 2 of 28")).toBeVisible();

  await page.getByRole("button", { name: "Back" }).click();
  await expect(page.getByText("Question 1 of 28")).toBeVisible();
  await expect(page.getByRole("radio").first()).toBeChecked();

  // Clicking the answer that is already selected moves on again.
  await page.locator("label").filter({ has: page.getByRole("radio") }).first().click();
  await expect(page.getByText("Question 2 of 28")).toBeVisible();
});

/* The opt-in used to save the lead to localStorage and nothing else, so anyone
   who opted in and then abandoned the quiz never reached the CRM at all. The
   pop-up must hand the lead straight to /api/optin — and must not wait for it,
   because a slow or broken CRM cannot be allowed to strand the visitor. */
test("the opt-in sends the lead to the CRM before the quiz starts", async ({ page }) => {
  await page.goto("/");

  // Hold the request open: the visitor should reach the cover page regardless.
  let optin: { name?: string; email?: string; phone?: string } | undefined;
  await page.route("**/api/optin", async (route) => {
    optin = route.request().postDataJSON();
    await new Promise((r) => setTimeout(r, 2000));
    await route.fulfill({ status: 200, body: JSON.stringify({ ok: true, synced: true }) });
  });

  await page.getByRole("button", { name: /start assessment/i }).click();
  await page.getByPlaceholder("Name").fill("Sam Tester");
  await page.getByPlaceholder("Email").fill("sam@example.com");
  await page.getByPlaceholder("Phone").fill("0400000000");
  await page.getByRole("button", { name: /get my visibility score now/i }).click();

  await expect(page).toHaveURL(/\/quiz-cover$/, { timeout: 1500 });
  await expect.poll(() => optin).toEqual({
    name: "Sam Tester",
    email: "sam@example.com",
    phone: "0400000000",
  });
});

test("the quiz cover page sits behind the opt-in", async ({ page }) => {
  // Reaching it without filling the pop-up sends you back to the landing page,
  // so the opt-in cannot be skipped by typing the URL.
  await page.goto("/quiz-cover");
  await expect(page).toHaveURL(/\/$/);

  // Coming through the pop-up, it opens as normal.
  await startQuizFromLanding(page);
  await expect(page.getByText("Question 1 of 28")).toBeVisible();
});

test("starting the quiz from the landing page begins a fresh run", async ({ page }) => {
  // Get part-way through, then leave.
  await page.goto("/quiz");
  await page.locator("label").filter({ has: page.getByRole("radio") }).first().click();
  await expect(page.getByText("Question 2 of 28")).toBeVisible();

  // Coming back through a "start quiz" button is a deliberate restart, so it
  // drops the earlier answers instead of dropping the visitor mid-assessment.
  await page.goto("/");
  await startQuizFromLanding(page);
  await expect(page.getByText("Question 1 of 28")).toBeVisible();
  await expect(page.getByRole("radio").first()).not.toBeChecked();

  // The cleared answers are gone for good, not just hidden by the fresh index.
  await page.reload();
  await expect(page.getByText("Question 1 of 28")).toBeVisible();
  await expect(page.getByRole("radio").first()).not.toBeChecked();
});

test("keyboard selection does not auto-advance; Enter moves on", async ({ page }) => {
  await page.goto("/quiz");
  await page.getByRole("radio").first().focus();
  await page.keyboard.press("Space");
  await expect(page.getByRole("radio").first()).toBeChecked();
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("radio").nth(1)).toBeChecked();
  await page.waitForTimeout(700);
  await expect(page.getByText("Question 1 of 28")).toBeVisible();

  await page.keyboard.press("Enter");
  await expect(page.getByText("Question 2 of 28")).toBeVisible();
});

test("single-choice answers show a round radio indicator; multi-select keeps checkboxes", async ({ page }) => {
  await page.goto("/quiz");
  const indicators = page.locator('label [data-indicator="radio"]');
  await expect(indicators).toHaveCount(6); // Q1 has 6 options
  await expect(page.locator('label [data-indicator="checkbox"]')).toHaveCount(0);

  const style = (i: number) =>
    indicators.nth(i).evaluate((el) => {
      const box = getComputedStyle(el);
      const dot = getComputedStyle(el, "::after");
      return { radius: box.borderRadius, width: box.width, height: box.height, dot: dot.backgroundColor };
    });

  const before = await style(1);
  expect(before.radius).toBe("50%");
  expect(before.width).toBe(before.height);
  expect(before.dot).toBe("rgba(0, 0, 0, 0)");

  // Keyboard selection so the quiz stays on this question.
  await page.getByRole("radio").nth(1).focus();
  await page.keyboard.press("Space");
  await expect(page.getByRole("radio").nth(1)).toBeChecked();
  expect((await style(1)).dot).toBe("rgb(201, 163, 74)");
  expect((await style(0)).dot).toBe("rgba(0, 0, 0, 0)");

  // Q26 (select all that apply) uses square checkboxes, not radios.
  await page.evaluate(() =>
    localStorage.setItem("vc_quiz_progress_v1", JSON.stringify({ answers: {}, index: 25 })),
  );
  await page.reload();
  await expect(page.getByText("Question 26 of 28")).toBeVisible();
  await expect(page.locator('label [data-indicator="radio"]')).toHaveCount(0);
  await expect(page.locator('label [data-indicator="checkbox"]')).toHaveCount(12);
});

test("quiz page uses an 800px header on black and a compact survey card", async ({ page }) => {
  await page.goto("/quiz");
  await expect(page.getByText("Question 1 of 28")).toBeVisible();
  const m = await page.evaluate(() => {
    const header = document.querySelector("header")!;
    const img = header.querySelector("img")!;
    const card = document.querySelector("form")!;
    const q = document.querySelector("form h1")!;
    const opt = document.querySelector("form label")!;
    return {
      viewport: window.innerWidth,
      imgWidth: img.getBoundingClientRect().width,
      headerBg: getComputedStyle(header).backgroundColor,
      pageBg: getComputedStyle(header.parentElement!).backgroundColor,
      cardWidth: card.getBoundingClientRect().width,
      question: getComputedStyle(q).fontSize,
      option: getComputedStyle(opt).fontSize,
      overflow: document.documentElement.scrollWidth - window.innerWidth,
    };
  });
  expect(m.imgWidth).toBe(Math.min(800, m.viewport));
  expect(m.headerBg).toBe("rgb(0, 0, 0)");
  expect(m.pageBg).toBe("rgb(0, 0, 0)");
  expect(m.overflow).toBeLessThanOrEqual(0);
  if (m.viewport >= 800) {
    expect(m.cardWidth).toBe(720);
    expect(m.question).toBe("26px");
    expect(m.option).toBe("16px");
  } else {
    expect(m.question).toBe("22px");
    expect(m.option).toBe("15px");
  }
});

test("pop-up and results page follow the compact quiz style", async ({ page }) => {
  // Pop-up: white card on a dark overlay, smaller card and title.
  const full: Record<number, string | string[]> = {};
  for (const q of QUESTIONS) full[q.id] = q.type === "multi" ? ["A"] : q.type === "text" ? "Test" : "A";
  await page.goto("/quiz");
  await page.evaluate((a) => localStorage.setItem("vc_quiz_progress_v1", JSON.stringify({ answers: a, index: 27 })), full);
  await page.reload();
  await page.getByRole("button", { name: "Next" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  const pop = await page.evaluate(() => {
    const d = document.querySelector('[role="dialog"]')!;
    return {
      vw: window.innerWidth,
      overlay: getComputedStyle(d.parentElement!).backgroundColor,
      card: getComputedStyle(d).backgroundColor,
      width: d.getBoundingClientRect().width,
      title: getComputedStyle(d.querySelector("h2")!).fontSize,
    };
  });
  expect(pop.overlay).toBe("rgba(0, 0, 0, 0.8)");
  expect(pop.card).toBe("rgb(255, 255, 255)");
  expect(pop.width).toBe(Math.min(460, pop.vw - 40));
  expect(pop.title).toBe(pop.vw >= 640 ? "32px" : "26px");

  // Results: full-bleed header on black, cream body kept, and the column and type
  // sizes the client's results PDF asks for — the column since widened from the
  // PDF's 980 to the 1200 --shell, which the client asked for to close the dead
  // cream margins either side of the report.
  await page.goto("/results?r=v1BBABACCCDCCBCBBCBBC&c=emma-ab12c");
  await expect(page.getByTestId("score")).toBeVisible();
  const r = await page.evaluate(() => {
    const header = document.querySelector("header")!;
    const score = document.querySelector('[data-testid="score"]')!;
    return {
      vw: window.innerWidth,
      pageW: document.documentElement.clientWidth,
      img: header.querySelector("img")!.getBoundingClientRect().width,
      headerBg: getComputedStyle(header).backgroundColor,
      mainBg: getComputedStyle(document.querySelector("main")!).backgroundColor,
      card: score.closest("section")!.getBoundingClientRect().width,
      h1: getComputedStyle(document.querySelector("main h1")!).fontSize,
      score: getComputedStyle(score).fontSize,
      overflow: document.documentElement.scrollWidth - window.innerWidth,
    };
  });
  expect(r.img).toBe(r.pageW);
  expect(r.headerBg).toBe("rgb(0, 0, 0)");
  expect(r.mainBg).toBe("rgb(247, 245, 237)");
  expect(r.overflow).toBeLessThanOrEqual(0);
  if (r.vw >= 1000) {
    expect(r.card).toBe(1200); // the --shell width on .main
    expect(r.h1).toBe("44px");
    expect(r.score).toBe("145px");
  } else {
    expect(r.h1).toBe("30px");
    expect(r.score).toBe("88px");
  }
});

test("landing page matches the client's desktop and mobile layout", async ({ page }) => {
  const errors = trackConsoleErrors(page);
  await page.goto("/");
  await expect(
    page.getByRole("heading", { level: 1, name: "Why Aren’t You Getting The Opportunities You Know You Deserve?" }),
  ).toBeVisible();
  for (const name of [
    "Get Your Visibility Score Free",
    "Who this is for",
    "What’s Your Visibility Gap?",
    "Meet Katrina",
    "You were never meant to be overlooked.",
  ]) {
    await expect(page.getByRole("heading", { level: 2, name })).toBeVisible();
  }
  await expect(page.getByRole("heading", { level: 3 })).toHaveCount(5);
  // The score dial is the client's own artwork, so its wording lives in the alt text.
  await expect(
    page.getByRole("img", { name: /example score of 88 out of 100.*score. gap. next steps./i }),
  ).toBeVisible();

  // Every call to action opens the opt-in pop-up rather than jumping to the quiz.
  for (const name of [/start assessment/i, /get your free score/i, /start free quiz/i, /get your visibility score free/i]) {
    await expect(page.getByRole("button", { name })).toBeVisible();
  }
  await page.getByRole("button", { name: /start assessment/i }).click();
  await expect(page.getByRole("dialog", { name: /discover your/i })).toBeVisible();
  await page.keyboard.press("Escape");

  // One press strip per layout (after the hero on desktop, after Meet Katrina on mobile), ten logos.
  const press = page.getByRole("region", { name: "As featured in" });
  await expect(press).toHaveCount(1);
  await expect(press.getByRole("img")).toHaveCount(10);

  // Scroll through so lazy images load, then every visible image must have rendered.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
  });
  await page.waitForFunction(
    () => {
      const visible = [...document.images].filter((img) => img.getBoundingClientRect().width > 0);
      return visible.length >= 21 && visible.every((img) => img.complete && img.naturalWidth > 0);
    },
    null,
    { timeout: 15_000 },
  );

  await page.evaluate(() => document.fonts.ready);
  const m = await page.evaluate(() => {
    const hero = document.querySelector("main picture img")!.getBoundingClientRect();
    const card = document.querySelector("main h1")!.parentElement!.getBoundingClientRect();
    const meet = [...document.querySelectorAll("h2")].find((h) => h.textContent === "Meet Katrina")!;
    return {
      vw: window.innerWidth,
      heroLeft: hero.left,
      heroRight: hero.right,
      heroWidth: hero.width,
      heroBottom: hero.bottom,
      cardLeft: card.left,
      cardRight: card.right,
      cardTop: card.top,
      capsFont: getComputedStyle(meet).fontFamily,
      capsLoaded: [...document.fonts].some((f) => /playfair/i.test(f.family) && f.status === "loaded"),
      overflow: document.documentElement.scrollWidth - window.innerWidth,
    };
  });
  // The master "SIMPLE TYPOGRAPHY BRAND CARD" allows only Playfair Display for
  // headings and Montserrat for body. This previously asserted Cinzel, which is
  // on neither card.
  expect(m.capsFont).toMatch(/playfair/i);
  expect(m.capsLoaded).toBe(true);
  if (m.vw > 760) {
    // Desktop: "LAYOUT - FINAL WEB DESIGN - 18.9.26.pdf" puts the card on the RIGHT
    // with Katrina on the left (it supersedes the 14/15 Sep PDFs, which had it left).
    // Percentages are the card frame's own pixels in that layout's 1920-wide page
    // image: x 1236..1817 of 1920, so left 64.38% and width 30.26%.
    // The journey pill is mobile only.
    const left = ((m.cardLeft - m.heroLeft) / m.heroWidth) * 100;
    const width = ((m.cardRight - m.cardLeft) / m.heroWidth) * 100;
    expect(left).toBeGreaterThan(63.5);
    expect(left).toBeLessThan(65.3);
    expect(width).toBeGreaterThan(29.5);
    expect(width).toBeLessThan(31.0);
    expect(m.cardLeft).toBeGreaterThan(m.heroLeft + m.heroWidth * 0.5);
    await expect(page.getByText("Recognised", { exact: true })).toBeHidden();
  } else {
    // Mobile: photo on top, headline card below it, journey pill visible.
    expect(m.cardTop).toBeGreaterThanOrEqual(m.heroBottom - 24);
    await expect(page.getByText("Recognised", { exact: true })).toBeVisible();
  }
  expect(m.overflow).toBeLessThanOrEqual(0);
  expect(errors).toEqual([]);
});

test("serves the favicon and app icons", async ({ page, request }) => {
  await page.goto("/");
  await expect(page.locator('head link[rel="icon"]').first()).toHaveAttribute("href", /\/(favicon\.ico|icon)/);
  await expect(page.locator('head link[rel="apple-touch-icon"]')).toHaveAttribute("href", /apple-icon/);

  for (const path of ["/favicon.ico"]) {
    const res = await request.get(path);
    expect(res.status(), path).toBe(200);
  }
  const iconHref = await page.locator('head link[rel="icon"][type="image/png"]').getAttribute("href");
  expect((await request.get(iconHref!)).headers()["content-type"]).toBe("image/png");
});

test("shows a friendly message for an invalid report link", async ({ page }) => {
  await page.goto("/results?r=v1BROKEN");
  await expect(page.getByRole("heading", { name: "This report link isn't valid" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Take the quiz" })).toHaveAttribute("href", "/quiz");
});

test("the opt-in pop-up never pulls focus out of a field you have already reached", async ({ page }) => {
  // The pop-up puts the cursor in the first field as a convenience. It used to do
  // that on a 60ms timer, which landed *after* anyone who had gone straight for a
  // later field: focus jumped back to the name box mid-word, the rest of what
  // they typed went in there, and the form then refused to submit because the
  // field they thought they had filled was empty.
  await page.goto("/");
  await page.getByRole("button", { name: /start assessment/i }).click();

  // A visitor who goes straight for the phone box and types at a human pace.
  await page.getByPlaceholder("Phone").pressSequentially("0400000000", { delay: 20 });
  await expect(page.getByPlaceholder("Phone")).toHaveValue("0400000000");
  await expect(page.getByPlaceholder("Phone")).toBeFocused();
  await expect(page.getByPlaceholder("Name")).toHaveValue("");
});
