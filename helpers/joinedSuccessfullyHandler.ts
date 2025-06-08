import { Page } from "@fixtures/baseTest";

export default async function joinedSuccessfullyHandler(page: Page) {
  await page.addLocatorHandler(
    page
      .getByRole('alert')
      .getByText('Congratulations! Joined room successfully.'),
    async () => {
      await
        page
          .getByRole('alert')
          .getByText('Congratulations! Joined room successfully.')
          .getByRole('button', { name: 'Close' })
          .click();
    }
  );
}