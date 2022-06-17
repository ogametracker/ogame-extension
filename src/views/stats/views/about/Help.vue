<template>
    <div>
        TODO: Help/FAQ here

        <hr />
        Y u no feature?
        TODO: Why is fleet lost on expeditions not tracked? => fleet tracking necessary + assignment fleet to expedition (almost) impossible = too complex
        TODO: Why no synchronization between multiple devices? => not possible with chrome API, external server may to sync come in the future
        TODO: Why mine production not in resource balance? => Value only approximated possible (based on current value) = bad values for the past if mines were built since then = more complex tracking necessary
        <hr />
        TODO: Tip: Right click on most tabs lets you set the selected tab/menu item as default if you open the interface again.
        TODO: Tip: Press the numbers shown in the tabs to go to the tab without clicking. Does not work when any input is focused.
        TODO: Tip: Want to know what to build next to improve your resource production? Try the <a link>interactive amortization table</a>
        TODO: Tip: Click the settings icon next to the charts and tables to change related settings without having to navigate to the settings page.
        TODO: Tip: Want to view data of another tracked account? Click the account icon in the top right corner to select the account, this will open a new tab.
        <hr />
        TODO: Need help, found a bug, or have a feature request? Join the Discord server and write a message in the related channel.
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';

    @Component({})
    export default class Help extends Vue {

    }
</script>