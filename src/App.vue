<template>
  <Header />
  <Wrapper>
    <router-view/>
  </Wrapper>
  <Footer />
</template>

<style lang="scss">
  @import "assets/styles/styles.scss";
</style>
<script>
import Header from "@/components/includes/Header";
import Footer from "@/components/includes/Footer";
import Wrapper from "@/components/includes/Wrapper";
export default {
  components: {Wrapper, Footer, Header}
}
</script>