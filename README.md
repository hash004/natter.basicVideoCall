# Getting Started
## Installation
1. Clone the repository
1. Install dependencies
   ```bash
   npm install
   ```
1. Update .env file with your details
1. Unzip the video file, `test-video.7z` in the `assets` directory
1. Run the tests using Playwright
   ```bash
   npm run pw:e2e
   ```

## Questions
- What browsers are we supporting?
  - Assuming only Chromium based browsers for now
- What version of the browser are we supporting?
  - Assuming latest version of Chromium based browsers
- Are we supporting mobile browsers?
  - Assuming like desktop, only Chromium based browsers
- Are there different user roles in a channel?
  - Assuming all users have the same role in a channel
- Do we need to implement CI/CD for this project?
- How many users do we expect to be in a single channel?
- Should Advanced Settings be visible before joining a channel (there would be no mic or cam to select)?
- Anyway to kick users from a channel? 
  - (so we can test channel with confidence that it's empty)
  - Visual comparison tests will fail if there are other user(s) in the channel
- How to trigger 'You can invite others join this channel by click' message?
- Do we need to test different network conditions? Can probably use emulateNetworkConditions dev tool in Chrome.

## Further Improvements
- More visual tests
  - Local player reversed
  - remote player not reversed
  - Narrow scope of visual tests to only the video elements
- Test for sound
- Study Agora-SDK documentation for better understanding of the SDK
- Test for multiple users in a channel all using different browsers/devices
- Refactor the tests into different files for better organisation

## Potential Issues
- when joining a channel, Congratulations message does not disappear
- Congratulations message intermittently doesn't show up when joining a channel
- Video in a call is cropped from top and bottom
  - Likely from object-fit CSS property
- Audio is not working in a call when one user but works when two users are in a call (Likely expected behaviour)
- Unable to mock the microphone and camera permissions in Safari (Playwright limitation)
- Not sure how to test for different codec settings
  - Maybe check for network payload and/or console logs for codec information
- Not sure how to test for video resolution settings
  - Maybe check for video element dimensions or network payload for resolution information
- Having multiple input video sources is not possible with the `--use-file-for-fake-video-capture` flag in Playwright
  - To test multiple video sources, we need to use a different approach e.g. OBS or https://github.com/v4l2loopback/v4l2loopback

## References
[WebRTC Testing Documentation](https://webrtc.org/getting-started/testing)
[Playwright Visual Comparison Testing](https://playwright.dev/docs/test-snapshots)
[Example of Playwright Testing for video calls](https://github.com/bigbluebutton/bigbluebutton)