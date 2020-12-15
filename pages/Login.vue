<template>
    <div>
        <p class="title is-1 is-spaced">user: {{ userName }}</p>
        <v-btn class="button is-primary is-rounded" @click="login">
        ログイン
        </v-btn>
        <v-btn @click="test">
            テスト
        </v-btn>
        <nuxt-link :to="mypageURL">マイページ</nuxt-link>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    methods: {
        login(){
            this.$store.dispatch('auth/login')
        },
        test(){
            console.log(this.userName)
        }
    },
    computed:{
    ...mapGetters({
        userName: 'auth/userName',
        mypageURL: 'auth/userURL'
    })
    },
}
</script>