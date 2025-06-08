import { test, expect, Page } from '@fixtures/baseTest';
import BasicVideoCallPage from '@pages/basicVideoCall.page';
import Env from '@helpers/env';
import joinedSuccessfullyHandler from '@helpers/joinedSuccessfullyHandler';

test.describe('Join Call', () => {
  test.beforeEach(async ({ basicVideoCallPage }) => {
    await basicVideoCallPage.goto();
  });

  test('As a user, I want to join a video call successfully', { tag: ['@high', '@smoke'] }, async ({ basicVideoCallPage }) => {
    await basicVideoCallPage.joinCall(Env.APP_ID, Env.APP_TOKEN, Env.CHANNEL_NAME);

    await expect(basicVideoCallPage.localPlayer()).toBeVisible();
  });

  test('As a user, I should see join call button disabled after joining', { tag: ['@medium', '@smoke'] }, async ({ basicVideoCallPage }) => {
    await basicVideoCallPage.joinCall(Env.APP_ID, Env.APP_TOKEN, Env.CHANNEL_NAME);

    await expect(basicVideoCallPage.joinCallButton()).toBeDisabled();
  });

  test('As a user, I should see success message after joining', { tag: ['@medium', '@smoke'] }, async ({ basicVideoCallPage }) => {
    await basicVideoCallPage.joinCall(Env.APP_ID, Env.APP_TOKEN, Env.CHANNEL_NAME);

    await expect(basicVideoCallPage.joinedSuccessfullyMessage()).toBeVisible();
  });

  test('As a user, I should see leave call button enabled after joining', { tag: ['@medium', '@smoke'] }, async ({ basicVideoCallPage }) => {
    await basicVideoCallPage.joinCall(Env.APP_ID, Env.APP_TOKEN, Env.CHANNEL_NAME);

    await expect(basicVideoCallPage.leaveCallButton()).toBeEnabled();
  });

  test('As a user, I want to join a video call with user ID', { tag: ['@high', '@smoke'] }, async ({ basicVideoCallPage }) => {
    await basicVideoCallPage.joinCall(Env.APP_ID, Env.APP_TOKEN, Env.CHANNEL_NAME, Env.USER_ID);

    await expect(basicVideoCallPage.localPlayerName(Env.USER_ID)).toBeVisible();
  });

  test('As a user, I want to verify the video call matches the expected design', { tag: ['@visual'] }, async ({ basicVideoCallPage }) => {
    await basicVideoCallPage.joinCall(Env.APP_ID, Env.APP_TOKEN, Env.CHANNEL_NAME, Env.USER_ID);
    await basicVideoCallPage.localPlayer().waitFor({ state: 'visible' });

    await expect(basicVideoCallPage.page).toHaveScreenshot({
      mask: [basicVideoCallPage.remotePlayersSection()], // Mask the remote players section to avoid dynamic content affecting the screenshot
      maskColor: '#fff', // Use white color for masking so it blends with the background
    });
  });

  test('As a user, I want to leave a video call successfully', { tag: ['@high', '@smoke'] }, async ({ basicVideoCallPage }) => {
    await basicVideoCallPage.joinCall(Env.APP_ID, Env.APP_TOKEN, Env.CHANNEL_NAME);
    await basicVideoCallPage.leaveCallButton().click();
    await expect(basicVideoCallPage.localPlayer()).toBeHidden();
    await expect(basicVideoCallPage.joinCallButton()).toBeEnabled();
  });

  test('As a user, I want to see remote player after joining a channel', { tag: ['@high', '@smoke'] }, async ({ basicVideoCallPage, context }) => {
    // Set Handlers for the joined successfully message
    await joinedSuccessfullyHandler(basicVideoCallPage.page);

    // Create a new page for the remote user
    const remoteUserId = '786443';
    const remoteUserPage = new BasicVideoCallPage(await context.newPage());
    await remoteUserPage.goto();
    await remoteUserPage.joinCall(Env.APP_ID, Env.APP_TOKEN, Env.CHANNEL_NAME, remoteUserId);
    await joinedSuccessfullyHandler(remoteUserPage.page);
    await remoteUserPage.localPlayer().waitFor({ state: 'visible' });

    // Join the main user to the call
    await basicVideoCallPage.joinCall(Env.APP_ID, Env.APP_TOKEN, Env.CHANNEL_NAME, Env.USER_ID);
    await basicVideoCallPage.localPlayer().waitFor({ state: 'visible' });

    // Verify that the remote player is visible and the count is correct
    await expect(basicVideoCallPage.remotePlayerName(remoteUserId)).toBeVisible();
    expect(await basicVideoCallPage.remotePlayersList()).toHaveLength(1);

  });

  test.fixme('As a user, I should see appropriate error messages for invalid inputs', {
    tag: ['@low', '@regression', '@validation'],
    annotation: {
      type: 'bug',
      description: 'This test is currently failing due no error messages being displayed for invalid inputs or empty fields.'
    }
  }, async ({ basicVideoCallPage }) => {
    // Empty fields validation
    await basicVideoCallPage.joinCallButton().click();
    await expect(basicVideoCallPage.page.getByText('App ID is required')).toBeVisible();

    // Invalid App ID format
    await basicVideoCallPage.joinCall('invalid-app-id', Env.APP_TOKEN, Env.CHANNEL_NAME);
    await expect(basicVideoCallPage.page.getByText('Invalid App ID')).toBeVisible();

    // Invalid token
    await basicVideoCallPage.joinCall(Env.APP_ID, 'invalid-token', Env.CHANNEL_NAME);
    await expect(basicVideoCallPage.page.getByText('Invalid token')).toBeVisible();
  });

  test.fixme('As a user, I Should Not be able to join a call with the same user ID in the same channel', {
    tag: ['@medium', '@regression', '@validation'],
    annotation: {
      type: 'bug',
      description: 'This test is currently failing due to the application allowing multiple users with the same ID to join.'
    }
  }, async ({ basicVideoCallPage, context }) => {
    const userId = '12345678'
    await basicVideoCallPage.joinCall(Env.APP_ID, Env.APP_TOKEN, Env.CHANNEL_NAME, userId);
    await joinedSuccessfullyHandler(basicVideoCallPage.page);
    await expect(basicVideoCallPage.localPlayerName(userId)).toBeVisible();

    // Create a new page for the second user with the same ID
    const secondUserPage = new BasicVideoCallPage(await context.newPage());
    await secondUserPage.goto();
    await secondUserPage.joinCall(Env.APP_ID, Env.APP_TOKEN, Env.CHANNEL_NAME, Env.USER_ID);
    await joinedSuccessfullyHandler(secondUserPage.page);

    // Verify that the second user cannot join
    await expect(secondUserPage.page.getByText('User ID already exists in the channel')).toBeVisible();
  });

  test('As a user, I want to see multiple remote users in a channel', { tag: ['@high', '@smoke'] }, async ({ basicVideoCallPage, context }) => {
    // Set up remote users
    const remoteUsers = [
      { id: '786443', page: null },
      { id: '786444', page: null },
      { id: '786445', page: null }
    ];

    // Create and join with remote users
    for (const user of remoteUsers) {
      user.page = new BasicVideoCallPage(await context.newPage());
      await user.page.goto();
      await user.page.joinCall(Env.APP_ID, Env.APP_TOKEN, Env.CHANNEL_NAME, user.id);
      await joinedSuccessfullyHandler(user.page.page);
    }

    // Join with main user
    await basicVideoCallPage.joinCall(Env.APP_ID, Env.APP_TOKEN, Env.CHANNEL_NAME, Env.USER_ID);

    // Verify all remote users are visible
    for (const user of remoteUsers) {
      await expect(basicVideoCallPage.remotePlayerName(user.id)).toBeVisible();
    }
    expect(await basicVideoCallPage.remotePlayersList()).toHaveLength(remoteUsers.length);
  });

  test('As a user, I want to see remote users leave and join without affecting others', { tag: ['@high', '@regression'] }, async ({ basicVideoCallPage, context }) => {
    // Set up remote users
    const remoteUsers = [
      { id: '1111111', page: null },
      { id: '2222222', page: null }
    ];

    // Create and join with remote users
    for (const user of remoteUsers) {
      user.page = new BasicVideoCallPage(await context.newPage());
      await user.page.goto();
      await user.page.joinCall(Env.APP_ID, Env.APP_TOKEN, Env.CHANNEL_NAME, user.id);
      await joinedSuccessfullyHandler(user.page.page);
    }

    // Join with main user
    await basicVideoCallPage.joinCall(Env.APP_ID, Env.APP_TOKEN, Env.CHANNEL_NAME, Env.USER_ID);

    // Verify all remote users are visible
    await basicVideoCallPage.localPlayer().waitFor({ state: 'visible' });
    for (const user of remoteUsers) {
      await expect(basicVideoCallPage.remotePlayerName(user.id)).toBeVisible();
    }
    expect(await basicVideoCallPage.remotePlayersList()).toHaveLength(remoteUsers.length);

    // First remote user leaves
    await remoteUsers[0].page.leaveCallButton().click();
    await remoteUsers[0].page.localPlayer().waitFor({ state: 'hidden' });
    expect(await basicVideoCallPage.remotePlayersList()).toHaveLength(1);

    // First remote user rejoins
    await remoteUsers[0].page.joinCall(Env.APP_ID, Env.APP_TOKEN, Env.CHANNEL_NAME, remoteUsers[0].id);

    // Verify all users are visible again
    for (const user of remoteUsers) {
      await expect(basicVideoCallPage.remotePlayerName(user.id)).toBeVisible();
    }
    expect(await basicVideoCallPage.remotePlayersList()).toHaveLength(remoteUsers.length);
  });
});

test.describe('Advanced Settings', () => {
  test.beforeEach(async ({ basicVideoCallPage }) => {
    await basicVideoCallPage.goto();
  });

  test('As a user, I want to open advanced settings', { tag: ['@low', '@smoke'] }, async ({ basicVideoCallPage }) => {
    await basicVideoCallPage.advancedSettingsButton().click();
    await expect(basicVideoCallPage.advancedSettingsCard()).toBeVisible();
  });

  test('As a user, I can change my microphone settings during a call', { tag: ['@low', '@smoke'] }, async ({ basicVideoCallPage }) => {
    const microphoneName = 'Fake Audio Input 1';

    await basicVideoCallPage.joinCall(Env.APP_ID, Env.APP_TOKEN, Env.CHANNEL_NAME);
    await basicVideoCallPage.localPlayer().waitFor({ state: 'visible' });

    await basicVideoCallPage.advancedSettingsButton().click();
    await basicVideoCallPage.microphoneButton().click();
    await basicVideoCallPage.microphoneOptions(microphoneName).click();

    await expect(basicVideoCallPage.microphoneInput()).toHaveValue(microphoneName);
  });

  test.skip('As a user, I can change my camera settings during a call', { tag: ['@low', '@smoke'] }, async ({ basicVideoCallPage }) => {
    const cameraName = 'Fake Video Input 1';

    await basicVideoCallPage.joinCall(Env.APP_ID, Env.APP_TOKEN, Env.CHANNEL_NAME);
    await basicVideoCallPage.localPlayer().waitFor({ state: 'visible' });

    await basicVideoCallPage.advancedSettingsButton().click();
    await basicVideoCallPage.cameraButton().click();
    await basicVideoCallPage.cameraOptions(cameraName).click();

    await expect(basicVideoCallPage.cameraInput()).toHaveValue(cameraName);
  });
});

test.describe('Permissions', () => {
  test.fixme('As a user, I want to see permission denied messages when permissions are not granted', {
    tag: ['@low', '@smoke'],
    annotation: {
      type: 'bug',
      description: 'This test is currently failing due to the application not displaying permission denied messages when permissions are not granted.'
    }
  }, async ({ basicVideoCallPage }) => {
  });
});