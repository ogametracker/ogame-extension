# ogame-tracker

Operation System:
any that can run Node.js

Tools necessary:
Node.js 20.19+ or 22.12+

How to build:
1. npm ci

2. then one of
    - npm run dev:firefox (development build for Firefox)
    - npm run dev:chrome (development build for Chromium)
    - npm run build:firefox (production build for Firefox, creates zip-archive)
    - npm run build:chrome (production build for Chromium, creates zip-archive)

3. output is in `dist` directory
    - created zip-archive will be there as well

Alternatively run `npm run publish` which will create zipped production builds for both Chrome and Firefox ready to upload.

The repository uses npm workspaces. Stats owns its Vue 2 toolchain, and Notifications owns its
Vue 3 toolchain. The service worker has its own package, and the content scripts are built as
separate Vite entries in `@ogame-tracker/content-scripts`. Browser modules import TypeScript from
`@ogame-tracker/shared`. The two views also use `@ogame-tracker/view-shared` for common icons and
styles.

Run `npm run build --workspace @ogame-tracker/stats` (or use the name of another buildable
workspace) to build just that package into its own `dist` directory. Standalone builds default
to Chrome. Set the `BROWSER` environment variable to `firefox` for Firefox. The root build commands
assemble these outputs, static assets, and the manifest into the extension's root `dist` directory.

Run `npm run typecheck --workspace @ogame-tracker/notifications` to check the Vue 3 app, or
`npm run typecheck --workspace @ogame-tracker/shared` to check the shared library.
