<template>
  <MainSlider />
  <EventList />
  <MainNews />
  <MainTeachers />
</template>

<script setup>

import MainSlider from "@/components/mainpage/MainSlider";
import EventList from "@/components/mainpage/EventList";
import MainNews from "@/components/mainpage/MainNews";
import MainTeachers from "@/components/mainpage/MainTeachers.vue";
import {onMounted} from "vue";
import axios from "axios";

</script>

<style lang="scss" scoped>

</style>