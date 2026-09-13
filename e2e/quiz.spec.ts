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
  await expect(page.getByRole("heading", { name: "Get Your Visibility Score Free" })).toBeVisible();
  await page.getByRole("link", { name: /get your free score/i }).click();
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
