<template>
  <div class="loader loader--style3">
    <svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
         width="40px" height="40px" viewBox="0 0 50 50" xml:space="preserve">
  <path d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z">
    <animateTransform attributeType="xml"
                      attributeName="transform"
                      type="rotate"
                      from="0 25 25"
                      to="360 25 25"
                      dur="0.6s"
                      repeatCount="indefinite"/>
    </path>
  </svg>
  </div>
</template>

<script setup>

</script>

<style lang="scss">
@import "@/assets/styles/_variables.scss";

.loader{
  z-index: 100;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  &:before{
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: #2B3134;
    opacity: 0.7;
    z-index: 99;
  }

  svg{
    width: 250px;
    height: 250px;
    fill: $pr1;
    z-index: 100;
  }
}
</style>