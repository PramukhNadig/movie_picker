<template>
    <div>
        <h1>Add a Movie</h1>
        <form @submit.prevent="addMovie">
            <div>
                <label for="title">Title:</label>
                <input type="text" v-model="title" id="title" required />
            </div>
            <div>
                <label for="imdbID">IMDB ID:</label>
                <input type="text" v-model="imdbID" id="imdbID" required />
            </div>
            <button type="submit">Add Movie</button>
        </form>
        <p v-if="message">{{ message }}</p>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            title: '',
            imdbID: '',
            message: ''
        };
    },
    methods: {
        async addMovie() {
            try {
                const response = await axios.post(`/movie/${this.imdbID}`, {}, {
                    withCredentials: true
                });
                this.message = 'Movie added successfully!';
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    this.message = 'You must be logged in to add a movie.';
                } else {
                    this.message = 'Error adding movie.';
                }
            }
        }
    }
};
</script>

<style scoped>
/* Add your styles here */
</style>