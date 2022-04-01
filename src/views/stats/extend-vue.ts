import Vue from 'vue';

// augment Vue type with localization stuff
declare module 'vue/types/vue' {
    interface Vue {
        $forceCompute(name: string): void;
    }
}

Vue.prototype.$forceCompute = function(name: string) {
     this._computedWatchers[name]?.run();
};