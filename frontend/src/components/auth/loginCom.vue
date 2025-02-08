<template>
    <div>
        <h2>Login</h2>
        <form @submit.prevent="login">
            <div>
                <input v-model="email" placeholder="Email" required />
            </div>
            <div>
                <input v-model="password" type="password" placeholder="Password" required />
            </div>
            <button type="submit">Login</button>
        </form>
        <p v-if="error">{{ error }}</p>
        <p>Don't have an account? <router-link to="/register">Register here</router-link></p>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            email: '',
            password: '',
            error: null,
        };
    },
    methods: {
        async login() {
            try {
                const res = await axios.post('http://localhost:5000/api/auth/login', {
                    email: this.email,
                    password: this.password,
                });
                const token = res.data.token;
                localStorage.setItem('token', token); // Save JWT token
                this.$router.push('/dashboard'); // Redirect to dashboard after login
            } catch (err) {
                this.error = err.response.data.msg || 'Login failed';
            }
        },
    },
};
</script>