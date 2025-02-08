<template>
    <button @click="logout">Logout</button>
</template>

<script>
export default {
    methods: {
        logout() {
            localStorage.removeItem('token');  // Remove the token
            this.$router.push('/login');  // Redirect to login page
        },
    },
};
</script>