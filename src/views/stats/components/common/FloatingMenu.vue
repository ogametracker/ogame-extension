<template>
    <span
        class="floating-menu-wrapper"
        :class="{ 'floating-menu-wrapper--active': show }"
    >
        <slot name="activator" />

        <div
            class="floating-menu"
            :class="{ 'floating-menu--left': left }"
            v-show="show"
        >
            <slot />
        </div>
    </span>
</template>

<script lang="ts">
    import { Component, Prop, Vue, VModel } from 'vue-property-decorator';

    @Component({})
    export default class FloatingMenu extends Vue {
        @VModel({ required: true, type: Boolean })
        private show!: boolean;

        @Prop({ required: false, type: Boolean })
        private left!: boolean;

        private mounted() {
            window.addEventListener('click', e => {
                const path = e.composedPath();

                if (!path.includes(this.$el)) {
                    this.show = false;
                }
            });
        }
    }
</script>
<style lang="scss" scoped>
    .floating-menu {
        position: absolute;
        top: 100%;
        z-index: -1;
        box-shadow: 0 0 16px rgb(0 0 0), 0 0 32px rgb(0 0 0 / 90%),
            0 0 48px rgb(0 0 0 / 80%), 0 0 64px rgb(0 0 0 / 70%);
        background: black
            linear-gradient(
                135deg,
                rgba(var(--color), 0.1),
                rgba(var(--color), 0.2)
            );
        width: max-content;
        padding: 8px;
        border-radius: 8px;

        &.floating-menu--left {
            right: 0;
        }
        &:not(.floating-menu--left) {
            left: 0;
        }

        &-wrapper {
            position: relative;
            display: inline-block;

            &--active {
                z-index: 1;
            }
        }
    }
</style>