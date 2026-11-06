<template>
    <div class="help">
        <tabs :tabs="tabs">
            <template #tab-content-faq>
                <grid-table v-for="(item, i) in itemsFaq" :key="i" :columns="getColumnsFaq(item)" :items="[item]" class="faq-table" />
            </template>

            <template #tab-content-tips>
                <div class="tip" v-text="translations().extension.about.faqHelp.tips.rightClickDefaultRoute" />
                <div class="tip" v-text="translations().extension.about.faqHelp.tips.numbersKeyboardNavigation" />
                <div class="tip">
                    <span v-text="translations().extension.about.faqHelp.tips.amortizationTable.part1" />
                    <router-link :to="{ name: 'empire/amortization' }" v-text="translations().extension.about.faqHelp.tips.amortizationTable.name" />
                    <span v-text="translations().extension.about.faqHelp.tips.amortizationTable.part2" />
                </div>
                <div class="tip" v-text="translations().extension.about.faqHelp.tips.inlineSettings" />
                <div class="tip" v-html="translations().extension.about.faqHelp.tips.switchAccountHtml" />
            </template>
        </tabs>

        <div class="discord-message">
            <span v-text="translations().extension.about.faqHelp.messageDiscord.part1" />
            <a :href="discordInviteLink" v-text="translations().extension.about.faqHelp.messageDiscord.discordServer" />
            <span v-text="translations().extension.about.faqHelp.messageDiscord.part2" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { translations } from '@stats/i18n';
import type { GridTableColumn } from '../../components/common/GridTable.vue';
import type { Tab } from '../../components/common/Tabs.vue';
import { _constants } from '../../_constants';

interface FaqItem {
    header: string;
    text: string;
}

const discordInviteLink = _constants.discordInviteLink;

function getColumnsFaq(item: FaqItem): GridTableColumn<keyof FaqItem>[] {
    return [{
        key: 'text',
        label: item.header,
    }];
}

const itemsFaq = computed<FaqItem[]>(() => {
    return [
        {
            header: translations().extension.about.faqHelp.faq.fleetLostOnExpedition.header,
            text: translations().extension.about.faqHelp.faq.fleetLostOnExpedition.text,
        },
        {
            header: translations().extension.about.faqHelp.faq.syncBetweenDevices.header,
            text: translations().extension.about.faqHelp.faq.syncBetweenDevices.text,
        },
        {
            header: translations().extension.about.faqHelp.faq.productionInResourceBalance.header,
            text: translations().extension.about.faqHelp.faq.productionInResourceBalance.text,
        },
        {
            header: translations().extension.about.faqHelp.faq.whatAreAverages.header,
            text: translations().extension.about.faqHelp.faq.whatAreAverages.text,
        },
    ];
});

const tabs = computed<Tab[]>(() => {
    return [
        {
            key: 'faq',
            label: translations().extension.about.faqHelp.faq.header,
        },
        {
            key: 'tips',
            label: translations().extension.about.faqHelp.tips.header,
        },
    ];
});
</script>

<style lang="scss" scoped>
    .faq-table {
        width: 450px;

        :deep(.grid-table-cell) {
            text-align: left;
            justify-content: flex-start;
        }

        + .faq-table {
            margin-top: 4px;
        }
    }

    .tip {
        margin-top: 4px;
        width: 450px;
        border: 1px solid rgba(var(--color), 0.5);
        border-radius: 4px;
        box-shadow: 0 0 6px 0 rgba(black, 0.333);
        background: rgba(var(--color), 0.1);
        padding: 8px 16px;
    }

    .discord-message {
        font-weight: bold;
        width: 450px;
        background-color: black;
        background-image: linear-gradient(0deg, rgba(var(--color), 0.5), rgba(var(--color), 0.7));
        border: 1px solid rgba(var(--color), 0.5);
        border-radius: 4px;
        box-shadow: 0 0 6px 0 rgba(black, 0.333);
        padding: 8px 16px;
    }

    .help {
        display: grid;
        height: 100%;
        max-height: 100%;
        grid-template-rows: 1fr auto;
        gap: 8px;
    }
</style>
