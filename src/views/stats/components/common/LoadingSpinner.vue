<template>
    <div class="loading" />
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';

    @Component({})
    export default class LoadingSpinner extends Vue {
    }
</script>
<style lang="scss" scoped>
    .loading {
        display: inline-block;
        width: 40px;
        height: 40px;
        border: 2px solid rgb(var(--color));
        border-radius: 100%;
        clip-path: polygon(
            0 0,
            40% 0,
            50% 50%,
            60% 0,
            100% 0,
            100% 67%,
            50% 50%,
            93% 100%,
            7% 100%,
            50% 50%,
            0 67%
        );
        position: relative;
        box-sizing: border-box;

        animation: loading-animation-data-v-06b0dc5c 1.5s infinite linear;

        &::before {
            content: "";
            position: absolute;
            top: 50%;
            left: 50%;
            width: 8px;
            height: 8px;
            background: rgb(var(--color));
            border-radius: 100%;
            transform: translate(-50%, -50%);
        }
    }

    @keyframes loading-animation {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
</style>