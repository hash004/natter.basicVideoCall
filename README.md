# Getting Started
## Installation
1. Clone the repository
2. Install dependencies
   ```bash
   npm install
   ```
3. Run the tests using Playwright
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
- Audio is not working in a call when one user but works when two users are in a call
- Unable to mock the microphone and camera permissions in Safari
- Not sure how to test for different codec settings
  - Check for network payload and/or console logs for codec information
- Not sure how to test for video resolution settings
  - Check for video element dimensions or network payload for resolution information
- Having mutliple input video sources is not possible with the --use-file-for-fake-video-capture flag in Playwright
  - To test multiple video sources, we need to use a different approach e.g. OBS?

## References
[WebRTC Testing Documentation](https://webrtc.org/getting-started/testing)
[BigBlueButton - Example of Playwright Testing for video calls](https://github.com/bigbluebutton/bigbluebutton)