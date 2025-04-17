<template>
  <section class="employees-all">
    <template v-if="userRole !== 'ADMIN'">
      <h1 class="employees-all__title">Сотрудники</h1>
      <EmployeesList/>
    </template>

    <template v-else>
      <div class="tabs">
        <button
            @click="setActiveTab('employees')"
            class="tab-button hover-underline"
            :class="{ 'active': activeTab === 'employees' }"
        >
          Сотрудники
        </button>
        <button
            @click="setActiveTab('personal-plan')"
            class="tab-button hover-underline"
            :class="{ 'active': activeTab === 'personal-plan' }"
        >
          Индивидуальный план
        </button>
      </div>

      <EmployeesList v-if="activeTab === 'employees'"/>
      <OtherList v-else-if="activeTab === 'personal-plan'"/>
    </template>
  </section>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import EmployeesList from '@/views/EmployeesList.vue';
import OtherList from '@/views/PersonalPlanList.vue';
import { userAuth } from '@/store/userAuth';
import router from '@/router';

const store = userAuth()
const route = useRoute();
const activeTab = ref('employees');
const userRole = ref('USER');

const setActiveTab = (tab) => {
  activeTab.value = tab;
  if (userRole.value === 'ADMIN') {
    router.push({
      query: { ...route.query, tab }
    });
  }
};

const initializeTab = () => {
  if (route.query.tab && ['employees', 'personal-plan'].includes(route.query.tab)) {
    setActiveTab(route.query.tab);
  } else {
    setActiveTab('employees');
  }
};

onMounted(initializeTab);

watch(() => userRole.value, (newRole) => {
  if (newRole !== 'ADMIN') {
    const query = { ...route.query };
    delete query.tab;
    router.replace({ query });
  }
})

watch(() => route.query.tab, (newTab) => {
  if (newTab && ['employees', 'personal-plan'].includes(newTab)) {
    activeTab.value = newTab;
  }
});

const getUserRole = () => {
  userRole.value = store.getRole
}

getUserRole()
</script>

<style lang="scss" scoped>
@import "@/assets/styles/_variables.scss";

.employees-all {
  max-width: 1440px;
  margin: 0 auto;

  &__title {
    margin-bottom: 40px;
  }

  @media (max-width: 1480px) {
    max-width: calc(100% - 40px);
  }
}

.tabs {
  display: flex;
  margin-bottom: 40px;
}

.tab-button {
  padding: 10px 20px;
  background: none;
  //border: none;
  cursor: pointer;
  font-size: 18px;
  position: relative;
  color: $pr1;

  &::after {
    background: $pr1;
  }
}
</style>
