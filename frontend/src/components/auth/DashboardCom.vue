<template>
    <div>
        <h1>User Dashboard</h1>

        <!-- Create or Update User -->
        <form @submit.prevent="saveUser">
            <input v-model="form.email" placeholder="Email" />
            <input v-model="form.password" placeholder="Password" type="password" />
            <button type="submit">{{ isEditing ? "Update" : "Create" }} User</button>
        </form>

        <hr />

        <!-- User List -->
        <h2>User List</h2>
        <table>
            <thead>
                <tr>
                    <th>Email</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in users" :key="user._id">
                    <td>{{ user.email }}</td>
                    <td>
                        <button @click="editUser(user)">Edit</button>
                        <button @click="deleteUser(user._id)">Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import axios from "axios";

export default {
    data() {
        return {
            users: [],
            form: { email: "", password: "" },
            isEditing: false,
            editingUserId: null,
        };
    },
    methods: {
        async fetchUsers() {
            const token = localStorage.getItem("token");
            const res = await axios.get("/api/users", {
                headers: { Authorization: `Bearer ${token}` },
            });
            this.users = res.data;
        },
        async saveUser() {
            const token = localStorage.getItem("token");
            const user = { email: this.form.email, password: this.form.password };

            if (this.isEditing) {
                await axios.put(`/api/users/${this.editingUserId}`, user, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else {
                await axios.post("/api/register", user);
            }

            this.resetForm();
            this.fetchUsers();
        },
        editUser(user) {
            this.form.email = user.email;
            this.isEditing = true;
            this.editingUserId = user._id;
        },
        async deleteUser(userId) {
            const token = localStorage.getItem("token");
            await axios.delete(`/api/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            this.fetchUsers();
        },
        resetForm() {
            this.form.email = "";
            this.form.password = "";
            this.isEditing = false;
            this.editingUserId = null;
        },
    },
    mounted() {
        this.fetchUsers();
    },
};
</script>