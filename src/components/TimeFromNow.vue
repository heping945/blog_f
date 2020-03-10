<template>
    <span>
        {{moment(time).fromNow()}}
    </span>
</template>

<script>
    export default {
        name: "TimeFromNow",
        props:['time'],
        methods:{
            moment
        }
    }
</script>

<style scoped>

</style>