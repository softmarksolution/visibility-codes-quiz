import { expect, test, type Page } from "@playwright/test";
import { QUESTIONS } from "../src/lib/quiz/questions";

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

  // This is the only place the visitor is asked for anything, so the fields start
  // empty and each one is required before the report is unlocked.
  await expect(dialog.getByPlaceholder("First name")).toHaveValue("");
  await expect(dialog.getByPlaceholder("Email")).toHaveValue("");
  await expect(dialog.getByPlaceholder("Phone number")).toHaveValue("");

  await dialog.getByRole("button", { name: /unlock my full report/i }).click();
  await expect(dialog.getByRole("alert")).toHaveText("Please enter your first name.");

  await dialog.getByPlaceholder("First name").fill("Emma");
  await dialog.getByPlaceholder("Email").fill("emma@example.com");
  await dialog.getByRole("button", { name: /unlock my full report/i }).click();
  await expect(dialog.getByRole("alert")).toHaveText("Please enter your phone number.");

  await dialog.getByPlaceholder("Phone number").fill("0400000000");
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
  await page.goto("/");
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
test("keyboard selection does not auto-advance; Enter moves on", async ({ page }) => {
  await page.goto("/");
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
  await page.goto("/");
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
  await page.goto("/");
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
  await page.goto("/");
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
  await expect(page.getByRole("link", { name: "Take the quiz" })).toHaveAttribute("href", "/");
});

/* The paid Action Plan is bought on the client's own site, one checkout page per
   edition. Which page a visitor is sent to is decided by their primary gap, so a
   wrong link here sells somebody the wrong edition. */
test("the results CTA links to the action-plan page for the visitor's own gap", async ({ page }) => {
  // All-lowest answers put every pillar level; ties go to the earlier pillar,
  // which makes Direction the primary gap for this report code.
  await page.goto("/results?r=v1AAAAAAAAAAAAAAAAAAA");
  await expect(page.getByTestId("level")).toBeVisible();

  const cta = page.getByRole("link", { name: /unlock my personalised action plan/i });
  await expect(cta).toHaveAttribute("href", "https://thevisibilitycodes.com/action-plan-direction");

  // Nothing on this site sells the plan any more: the old checkout URL forwards
  // to the same page rather than showing a payment form.
  const forwarded = await page.request.get("/checkout?r=v1AAAAAAAAAAAAAAAAAAA", { maxRedirects: 0 });
  expect(forwarded.status()).toBe(307);
  expect(forwarded.headers()["location"]).toBe("https://thevisibilitycodes.com/action-plan-direction");

  // Without a readable result there is no gap, so no edition is the right one.
  const noResult = await page.request.get("/checkout", { maxRedirects: 0 });
  expect(noResult.status()).toBe(307);
  expect(new URL(noResult.headers()["location"]!, "http://localhost").pathname).toBe("/");
});

/* The quiz used to live at /quiz behind a landing page and a cover page. Both
   pages are gone and the quiz is the site now, but ads, emails and bookmarks
   still point at the old paths, so they must land on the questions rather than
   a 404. */
test("the old quiz and cover URLs redirect to the quiz at the root", async ({ page }) => {
  for (const old of ["/quiz", "/quiz-cover"]) {
    const res = await page.request.get(old, { maxRedirects: 0 });
    expect(res.status(), old).toBe(308);
    expect(new URL(res.headers()["location"]!, "http://localhost").pathname, old).toBe("/");
  }

  await page.goto("/quiz");
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByText("Question 1 of 28")).toBeVisible();
});
