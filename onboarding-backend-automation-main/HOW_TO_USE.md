## To Setup

Ensure to have installed node.js in the device
https://nodejs.org/en/download/package-manager

Run `npm install` on the root directory of this repository


## To update number of times the user onboarding automation is triggered

In `user-onboarding-creator.script.js` edit runCompleteTest(10) to runCompleteTest(<number of times>)

Keep in mind of the rate limiting of burnermail so in most cases some of the triggers fail.
Example: Triggered 10 times but only 8 were successfully made

## To run the script
```
npm run user-onboarding
```