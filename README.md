# ogame-tracker

Operation System:
any that can run Node.js

Tools necessary:
Node.js 20.19+ or 22.12+

How to build:
1. npm install

2. then one of
    - npm run dev:firefox (development build for Firefox)
    - npm run dev:chrome (development build for Chromium)
    - npm run build:firefox (production build for Firefox, creates zip-archive)
    - npm run build:chrome (production build for Chromium, creates zip-archive)

3. output is in `dist` directory
    - created zip-archive will be there as well

Alternatively run `npm run publish` which will create zipped production builds for both Chrome and Firefox ready to upload.

The extension build includes the Vue 3 Notifications workspace. Run
`npm run typecheck --workspace ogame-tracker-notifications` to check its Vue and TypeScript files.