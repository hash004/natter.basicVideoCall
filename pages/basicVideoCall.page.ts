import { Page } from '@fixtures/baseTest';
import { test } from '@fixtures/baseTest';

export default class BasicVideoCallPage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Page Selectors

  // Form Fields
  appIdField = () => this.page.getByRole('textbox', { name: 'Enter the appid' });

  tokenField = () => this.page.getByRole('textbox', { name: 'Enter the app token' });

  channelNameField = () => this.page.getByRole('textbox', { name: 'Enter the channel name' });

  userIdField = () => this.page.getByRole('textbox', { name: 'Enter the user ID' });

  // Call Buttons

  joinCallButton = () => this.page.getByRole('button', { name: 'Join' });

  leaveCallButton = () => this.page.getByRole('button', { name: 'Leave' });

  advancedSettingsButton = () => this.page.getByRole('button', { name: 'Advanced Settings' });

  // Advanced Settings

  advancedSettingsCard = () => this.page.locator('div').filter({ has: this.advancedSettingsButton() }).locator('div[id=agora-collapse]');

  microphoneButton = () => this.advancedSettingsCard().getByRole('button', { name: 'Mics' });

  microphoneInput = () => this.page.locator('input[class*=mic-input]');

  microphoneOptions = (microphone: string) => this.advancedSettingsCard().locator('div[class*=mic-list]').getByText(microphone);

  cameraButton = () => this.advancedSettingsCard().getByRole('button', { name: 'Cams' });

  cameraInput = () => this.page.locator('input[class*=cam-input]');

  cameraOptions = (camera: string) => this.advancedSettingsCard().locator('div[class*=cam-list]').getByText(camera);


  // Messages
  joinedSuccessfullyMessage = () => this.page.getByRole('alert').getByText('Congratulations! Joined room successfully.');

  joinedSuccessfullyCloseButton = () => this.joinedSuccessfullyMessage().getByRole('button', { name: 'Close' });

  // Video Players

  localPlayerName = (userId: string) => this.page.locator('p[id=local-player-name]').getByText(`localVideo(${userId})`);

  localPlayer = () => this.page.locator('div[id=local-player] video');

  remotePlayersSection = () => this.page.locator('div[id=remote-playerlist]');

  remotePlayersList = () => this.page.locator('div[id=remote-playerlist] video').all();

  remotePlayerName = (userId: string) =>
    this.remotePlayersSection().getByText(`remoteUser(${userId})`);

  // Actions
  public async goto() {
    await this.page.goto('/basicVideoCall', { waitUntil: 'domcontentloaded' });
  }

  public async joinCall(appId: string, token: string, channelName: string, userId?: string) {
    test.step('Join call', async () => {
      await this.appIdField().fill(appId);
      await this.tokenField().fill(token);
      await this.channelNameField().fill(channelName);
      if (userId !== undefined && userId !== '') {
        await this.userIdField().fill(userId);
      }
      await this.joinCallButton().click();
    });
  }

}