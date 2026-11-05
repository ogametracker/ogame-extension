// Use the workspace's compiler even when npm hoists vue-tsc alongside the Vue 2 toolchain.
require('vue-tsc').run(require.resolve('typescript/lib/tsc'));
