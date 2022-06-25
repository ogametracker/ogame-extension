# ogame-tracker

Operation System:
any that can run Node.js

Tools necessary:
Node.js >= 15

How to build:
1. npm install

2. then one of
    "dev:firefox": "node scripts/build.js --dev --browser=firefox",
    "dev:chrome": "node scripts/build.js --dev --browser=chrome",
    "build:firefox": "node scripts/build.js --browser=firefox",
    "build:chrome": "node scripts/build.js --browser=chrome"
    - npm run dev:firefox (development build for Firefox)
    - npm run dev:chrome (development build for Chromium)
    - npm run build:firefox (production build for Firefox, creates zip-archive)
    - npm run build:chrome (production build for Chromium, creates zip-archive)

3. output is in `dist` directory
    - created zip-archive will be there as well