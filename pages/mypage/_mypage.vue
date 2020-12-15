<template>
    <v-container>
        <v-row>
            <h1>mypage</h1>
            <p>{{ userId }}</p>
        </v-row>
    </v-container>
</template>

<script>
export default {
    data(){
        return{
            userId: this.$route.params.id
        }
    },
    created() {
        this.$store.dispath('user/setTodo')
    }
}
</script>
