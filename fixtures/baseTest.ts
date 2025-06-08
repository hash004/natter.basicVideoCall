// Imports
import { test as base, request } from '@playwright/test';

// Exports
export { expect } from '@playwright/test';
export { Page } from '@playwright/test';


// Page Classes
import BasicVideoCallPage from '@pages/basicVideoCall.page';

// Custom fixtures to be used within the test context.
export type MyFixtures = {
  basicVideoCallPage: BasicVideoCallPage;
};

export const test = base.extend<MyFixtures>({
  basicVideoCallPage: async ({ page }, use) => {
    await use(new BasicVideoCallPage(page));
  },
});