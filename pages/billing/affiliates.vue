<template>
    <v-layout column>
        <v-container fluid>
            <h1>1 year of PRO</h1>
            <v-alert border="top" color="accent" class="pb-0" v-if="user.isPro && !['github', 'paypal'].includes(subscriptionSource)" colored-border>
                <p>You have a PRO account already! But of course I won't mind if you keep it active and still use the links below.</p>
            </v-alert>

            <p>
                Yes! Want to try AutoStrive's PRO features, but not really convinced you should spend money on a yearly subscription yet? You can get the first year for free.
            </p>
        </v-container>
    </v-layout>
</template>

<script>
import _ from "lodash"
import subscriptionMixin from "~/mixins/subscriptionMixin.js"
import userMixin from "~/mixins/userMixin.js"

export default {
    authenticated: true,
    mixins: [subscriptionMixin, userMixin],
    head() {
        return {
            subscriptionSource: "...",
            title: "Subscription via affiliates"
        }
    },
    data() {
        const country = this.$store.state.country

        return {
            revolut: true,
            n26: ["AT", "BE", "DE", "ES", "FI", "FR", "GR", "IE", "IT", "IS", "LI", "LV", "LT", "NL", "NO", "PL", "PT", "SE", "SI", "SK"].includes(country),
            tradeRepublic: ["AT", "BE", "DE", "ES", "FR", "IT", "PT"].includes(country),
            amex: ["DE"].includes(country)
        }
    },
    methods: {
        startCase(value) {
            return _.startCase(value)
        }
    },
    async fetch() {
        try {
            if (this.user.isPro) {
                const subscription = await this.$axios.$get(`/api/users/${this.user.id}/subscription`)
                this.subscriptionSource = this.getSubscriptionSource(subscription)
            }
        } catch (ex) {
            this.$webError(this, "Billing.fetch", ex)
        }

        this.loading = false
    }
}
</script>
