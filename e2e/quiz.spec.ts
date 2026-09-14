import { expect, test, type Page } from "@playwright/test";

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
    page.getByRole("heading", { name: "What’s actually standing between you and the opportunities you know you’re capable of?" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Start quiz" }).click();
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

  await dialog.getByRole("button", { name: /unlock my full report/i }).click();
  await expect(dialog.getByRole("alert")).toHaveText("Please enter your first name.");

  await dialog.getByPlaceholder("First name").fill("Emma");
  await dialog.getByPlaceholder("Email").fill("emma@example.com");
  await dialog.getByRole("button", { name: /unlock my full report/i }).click();

  await expect(page).toHaveURL(/\/results\?r=v1[A-G]{19}&c=emma-[a-z0-9]{5}$/);
  await expect(page.getByRole("heading", { name: "Emma, here are your results." })).toBeVisible();
  await expect(page.getByTestId("score")).toHaveText("100");
  await expect(page.getByTestId("level")).toHaveText("Chosen Expert");
  await expect(page.getByRole("textbox", { name: "Your referral link" })).toHaveValue(
    /https:\/\/www\.truevisibility\.com\/waitlist\?ref=emma-[a-z0-9]{5}/,
  );

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

test("cover page shows the client's copy", async ({ page }) => {
  const errors = trackConsoleErrors(page);
  await page.goto("/");
  await expect(page.getByText("For entrepreneurs, coaches, speakers, authors, personal brands")).toBeVisible();
  for (const pill of ["28 questions", "Personalised visibility score", "3 minute quiz"]) {
    await expect(page.getByRole("listitem").filter({ hasText: new RegExp(`^${pill}$`, "i") })).toBeVisible();
  }
  await expect(page.getByText(/^You know you are good at what you do\./)).toBeVisible();
  await expect(page.getByText(/hosting the AACTA Awards red carpet/)).toBeVisible();
  await expect(page.getByText(/^It is time to stop wondering what is wrong with you/)).toBeVisible();
  await expect(page.getByText("Remember to answer based on where you are right now, not where you want to be.")).toBeVisible();
  await expect(page.getByText("The more honest your answers, the more useful your result.")).toBeVisible();
  await expect(page.getByRole("link", { name: "Start quiz" })).toHaveAttribute("href", "/quiz");

  // Body text, reminder and button use the Futura-style font (Jost); headline stays serif.
  await page.evaluate(() => document.fonts.ready);
  const fonts = await page.evaluate(() => {
    const family = (el: Element | null) => (el ? getComputedStyle(el).fontFamily : "");
    return {
      paragraph: family(document.querySelector("main p:nth-of-type(1) ~ div p")),
      reminder: family([...document.querySelectorAll("main p")].at(-1) ?? null),
      button: family(document.querySelector('main a[href="/quiz"]')),
      heading: family(document.querySelector("main h1")),
      jostLoaded: [...document.fonts].some((f) => /jost/i.test(f.family) && f.status === "loaded"),
    };
  });
  expect(fonts.paragraph).toMatch(/jost/i);
  expect(fonts.reminder).toMatch(/jost/i);
  expect(fonts.button).toMatch(/jost/i);
  expect(fonts.heading).not.toMatch(/jost/i);
  expect(fonts.jostLoaded).toBe(true);

  // Nothing on the page may be wider than the viewport.
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
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
