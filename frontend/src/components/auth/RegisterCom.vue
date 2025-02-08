<template>
    <div>
        <h2>Register</h2>
        <form @submit.prevent="register">
            <div>
                <input v-model="email" placeholder="Email" required />
            </div>
            <div>
                <input v-model="password" type="password" placeholder="Password" required />
            </div>
            <button type="submit">Register</button>
        </form>
        <p v-if="error">{{ error }}</p>
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
        async register() {
            try {
                const res = await axios.post('http://localhost:5000/api/auth/register', {
                    email: this.email,
                    password: this.password,
                });
                const token = res.data.token;
                localStorage.setItem('token', token);  // Save JWT token
                this.$router.push('/dashboard');  // Redirect user to dashboard after registration
            } catch (err) {
                this.error = err.response.data.msg || 'Registration failed';
            }
        },
    },
};
</script>