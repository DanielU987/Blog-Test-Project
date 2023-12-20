<template>
    <div>
        <h2>Редактирование поста</h2>
        <form @submit.prevent="updatePost">
            <div>
                <label for="title">Заголовок:</label>
                <input type="text" id="title" v-model="post.title" required />
            </div>
            <div>
                <label for="content">Содержание:</label>
                <textarea id="content" v-model="post.content" required></textarea>
            </div>
            <div>
                <button type="submit">Сохранить</button>
            </div>
        </form>
    </div>
</template>

<script>
import axios from "axios";

export default {
    data() {
        return {
            post: null,
        };
    },
    mounted() {
        // Получение данных поста для редактирования
        const postId = this.$route.params.id;
        axios
            .get(`/api/posts/${postId}`)
            .then((response) => {
                this.post = response.data;
            })
            .catch((error) => {
                console.error(error);
            });
    },
    methods: {
        updatePost() {
            // Отправка данных на сервер для обновления поста
            const postId = this.$route.params.id;
            axios
                .put(`/api/posts/${postId}`, this.post)
                .then((response) => {
                    console.log(response.data);
                    this.$router.push(`/posts/${postId}`);
                })
                .catch((error) => {
                    console.error(error);
                });
        },
    },
};
</script>
