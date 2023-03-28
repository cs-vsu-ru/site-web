<template>
  <Header />
  <Wrapper>
    <router-view/>
  </Wrapper>
  <Footer />
</template>

<style lang="scss">

</style>
<script>
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Wrapper from "@/components/Wrapper/Wrapper";
export default {
  components: {Wrapper, Footer, Header}
}
</script>