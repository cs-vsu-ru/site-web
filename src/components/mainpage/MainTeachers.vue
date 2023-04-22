<template>
    <section class="teachers">
        <div class="section-header">
            <h1 class="section-header__title">Преподаватели</h1>
            <router-link class="section-header__link" to="/teachers">
                Читать далее
                <svg width="40" height="9" viewBox="0 0 40 9" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.00908 5.30969H36.3673L33.2593 7.67647C32.8557 7.98789 32.8557 8.48616 33.2593 8.76644C33.663 9.07786 34.3088 9.07786 34.6721 8.76644L39.8789 4.71799C40.0404 4.59343 40.0404 4.40657 39.8789 4.28201L34.6721 0.233564C34.2684 -0.0778547 33.6226 -0.0778547 33.2593 0.233564C32.8557 0.544983 32.8557 1.04325 33.2593 1.32353L36.3673 3.69031H1.00908C0.443996 3.69031 0 4.03287 0 4.46886C0 4.96713 0.443996 5.30969 1.00908 5.30969Z"/>
                </svg>
            </router-link>
        </div>
        <div class="teachers__field">
            <router-link :to="'/profile/' + teacher.user.id" v-for="teacher in teachersArr.slice(0, 5)" class="teacher">
                <img :src="teacher.user.imageUrl" alt="" class="teacher__photo">
                <div class="teacher__data">
                    <p class="teacher__data-name">{{ teacher.user.firstName + ' ' + teacher.user.lastName + ' ' + teacher.patronymic}}</p>
                    <p class="teacher__data-status">{{ teacher.post }}</p>
                </div>
            </router-link>
        </div>
    </section>
</template>

<script setup>
import {onMounted, ref} from "vue";
import axios from "axios";

let teachersArr = ref([])

onMounted(() => {
    teacherList()
})

const teacherList = async () => {
    await axios.get('employees')
        .then((req) => {
            teachersArr.value = req.data
        })
}
</script>

<style lang="scss">
@import "@/assets/styles/_variables.scss";

.teachers{
    max-width: 1440px;
    margin: 80px auto;
    display: flex;
    flex-direction: column;
    gap: 40px;

    &__field{
        display: flex;
        align-items: stretch;
        justify-content: space-between;
        gap: 10px;

        .teacher{
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 15px;
            max-width: 221px;

            &__photo{
                width: 221px;
                height: 221px;
                object-fit: contain;
                border-radius: 10px;
            }

            &__data{
                display: flex;
                flex-direction: column;
                gap: 30px;
                background: $pr3;
                padding: 15px;
                border-radius: 10px;
                position: relative;

                &-name{
                    font-size: 24px;
                    line-height: 28px;
                    color: $pr1;
                    text-align: center;
                    max-width: 150px;
                    align-self: center;
                }

                &-status{
                    font-size: 18px;
                    line-height: 21px;
                    text-align: center;
                }

                &:after{
                    content: '';
                    position: absolute;
                    background: $pr2;
                    height: 2px;
                    width: 100%;
                    left: 0;
                    top: 70%;
                }
            }
        }
    }
}
</style>