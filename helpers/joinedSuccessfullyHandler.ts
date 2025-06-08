import { Page } from "@fixtures/baseTest";

/**
 * Sets up a handler for the "Joined room successfully" alert message.
 * When the success alert appears, this handler automatically clicks the close button.
 *
 * @param page - The Playwright Page object to attach the handler to
 * @returns A Promise that resolves when the handler is set up
 */
export default async function joinedSuccessfullyHandler(page: Page) {
  const SUCCESS_MESSAGE = 'Congratulations! Joined room successfully.';
  const alertLocator = page.getByRole('alert').getByText(SUCCESS_MESSAGE);

  await page.addLocatorHandler(alertLocator, async () => {
    await alertLocator.getByRole('button', { name: 'Close' }).click();
  });
}