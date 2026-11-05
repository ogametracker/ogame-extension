import { computed, getCurrentInstance } from 'vue';

export function useLegacyComponentListeners() {
    const instance = getCurrentInstance()?.proxy;

    // Vue 2 keeps component listeners on the instance. Vue 3 forwards them as root attributes.
    return computed(() =>
        instance && '$listeners' in instance ? instance.$listeners as Record<string, unknown> : {},
    );
}
