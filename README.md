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

The repository uses npm workspaces. Stats and Notifications use Vue 3, Pinia, and Vite. Vite
bundles the service worker and builds each content script as its own entry. Browser modules import TypeScript from
`@ogame-tracker/shared`. The two views also use `@ogame-tracker/view-shared` for common icons and
styles.

Run `npm run build --workspace @ogame-tracker/stats` (or use the name of another buildable
workspace) to build just that package into its own `dist` directory. Standalone builds default
to Chrome. Set the `BROWSER` environment variable to `firefox` for Firefox. The root build commands
assemble these outputs, static assets, and the manifest into the extension's root `dist` directory.

Run `npm run typecheck --workspace @ogame-tracker/stats` or substitute the Notifications workspace to check either Vue app. Run
`npm run typecheck --workspace @ogame-tracker/shared` to check the shared library.

Run `npm run lint`, `npm run format`, or `npm run format:check` from the repository root to lint, format, or
check formatting across all workspaces. Add `--workspace @ogame-tracker/stats` (or another workspace name)
to run the corresponding command for one module. All workspaces use the Oxlint and Oxfmt configs at the
repository root.
