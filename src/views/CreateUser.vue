<script setup>

</script>

<template>
  <section class="user-create">
      <h1 class="user-create__title">Создание пользователя</h1>
      <div class="user-create__field">
          <div class="user-create__field-left">
              <div class="create-box">
                  <img src="" alt="" class="create-box__image">
              </div>
              <input type="file" style="display: none" id="create_image">
              <label for="create_image" class="create-box__label">Загрузить</label>
          </div>
          <div class="user-create__field-right">
              <div class="user-data">
                  <div class="user-data__item">
                      <p class="user-data__item-name"></p>
                      <input type="text" class="user-data__item-input">
                  </div>
              </div>
              <div class="user-extension">

              </div>
          </div>
      </div>
  </section>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/_variables.scss";

.user-create{
    max-width: 1440px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 40px;

    &__field{
        background: $pr3;
        border-radius: 10px;

        &-left{
            border-right: 3px solid $pr2;
            padding: 50px 40px;
            max-width: 446px;
            display: flex;
            flex-direction: column;
            gap: 30px;

            .create-box{
                border-radius: 10px;
                background: $sc3;
                width: 364px;
                height: 364px;

                &__label{
                    font-size: 24px;
                    line-height: 28px;
                    background: $sc3;
                    border-radius: 10px;
                    padding: 6px 0;
                    transition: 0.2s;
                    text-align: center;
                    cursor: pointer;

                    &:hover{
                        background: $pr1;
                        color: white;
                    }
                }
            }
        }
    }
}
</style>