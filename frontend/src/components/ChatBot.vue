<template>
    <div class=" min-h-screen bg-gray-100 flex flex-col items-center justify-center py-10 px-4">
        <!-- Container for the chatbot UI -->
        <div class="bg-white shadow-lg rounded-lg p-8 w-full max-w-xl max-h-screen">
            <!-- Title -->
            <h1 class="text-2xl font-bold text-gray-800 mb-6 text-center">Wise AI</h1>

            <!-- Input field -->
            <input v-model="question" placeholder="Ask a travel question"
                class="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500 transition-colors" />

            <!-- Button -->
            <button @click="askChatbot"
                class="w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition-all font-semibold">
                Ask Chatbot
            </button>

            <!-- Chatbot response section -->
            <div v-if="chatbotResponse" class="mt-6 bg-gray-50 p-4 rounded-lg shadow-inner">
                <!-- <h3 class="text-lg font-medium text-gray-700 mb-2">Response:</h3> -->
                <p class="text-gray-600">{{ chatbotResponse }}</p>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            question: '', // User input question
            chatbotResponse: '' // Chatbot response
        };
    },
    methods: {
        async askChatbot() {
            try {
                const response = await axios.post('http://127.0.0.1:5000/ask', {
                    question: this.question // Send the question to Flask API
                });
                this.chatbotResponse = response.data.response; // Display the response
            } catch (error) {
                console.error("Error querying the chatbot:", error);
            }
        }
    }
};
</script>