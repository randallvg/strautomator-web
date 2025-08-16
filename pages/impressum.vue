<template>
    <v-main fluid>
        <div class="stripe"></div>
        <div class="py-2"></div>

        <v-container class="text-center" fluid>
            <div class="home-wrapper">
                <h1 class="font-weight-light mt-1 mb-2" :class="$breakpoint.mdAndUp ? 'display-1' : 'headline'">AutoStrive</h1>
                <h2 class="display-2 font-weight-bold mb-4">Impressum</h2>

                <v-card color="black" class="mb-2 text-left">
                    <v-card-text>
                        <h4 class="mt-2 mb-6">Responsible according to §5 TMG</h4>
                        <p>
                            <strong>Figure4 Media</strong><br />
                        </p>
                        <p>
                            Meerkoet 31 3<br />
                            4617KN Bergen op Zoom<br />
                            The Netherlands
                        </p>

                        <p>
                            Website: https://figure4.nl<br />
                            Email: info@autostrive.nl
                        </p>

                        <div class="text-center mt-6">
                            <v-btn color="primary" @click="goBack" rounded>Back {{ backTarget }}</v-btn>
                        </div>
                    </v-card-text>
                </v-card>
            </div>
        </v-container>
    </v-main>
</template>

<script>
import _ from "lodash"
import FreeProTable from "~/components/FreeProTable.vue"

export default {
    authenticated: false,
    layout: "landing",
    components: {FreeProTable},
    head() {
        return {
            title: "Terms and Conditions"
        }
    },
    data() {
        return {
            backTarget: this.$store.state.user ? "to the Dashboard" : "home",
            releases: null
        }
    },
    methods: {
        goBack() {
            if (this.$store.state.user) {
                document.location.href = "/dashboard"
            } else {
                document.location.href = "/home"
            }
        }
    }
}
</script>
