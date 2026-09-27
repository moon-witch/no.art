<script setup lang="ts">
const isOpen = useStudioLogin()
const { t } = useI18n()
const email = ref('')
const password = ref('')
const error = ref('')
const isSubmitting = ref(false)

const close = () => {
  if (isSubmitting.value) {
    return
  }

  isOpen.value = false
  error.value = ''
  password.value = ''
}

const login = async () => {
  error.value = ''
  isSubmitting.value = true

  try {
    await $fetch('/api/auth/login', { method: 'POST', body: { email: email.value, password: password.value } })
    isOpen.value = false
    password.value = ''
    await navigateTo('/studio')
  }
  catch {
    error.value = t('studio.loginError')
  }
  finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="studio-login">
      <div v-if="isOpen" class="studio-login" @keydown.esc="close">
        <button class="studio-login__backdrop" :aria-label="t('studio.close')" @click="close" />
        <form class="studio-login__panel" @submit.prevent="login">
          <button class="studio-login__close" type="button" :aria-label="t('studio.close')" @click="close">×</button>
          <p class="studio-login__eyebrow font-moon-flower">{{ t('studio.eyebrow') }}</p>
          <label>
            <span class="font-simple-handmade">{{ t('studio.email') }}</span>
            <input v-model="email" type="email" autocomplete="email" required>
          </label>
          <label>
            <span class="font-simple-handmade">{{ t('studio.password') }}</span>
            <input v-model="password" type="password" autocomplete="current-password" required>
          </label>
          <p v-if="error" class="studio-login__error" role="alert">{{ error }}</p>
          <button class="studio-login__submit font-moon-flower" type="submit" :disabled="isSubmitting">
            {{ isSubmitting ? t('studio.loggingIn') : t('studio.login') }}
          </button>
        </form>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.studio-login {
  position: fixed;
  z-index: 100;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 1.5rem;
}

.studio-login__backdrop {
  position: absolute;
  inset: 0;
  border: 0;
  background: rgb(4 3 10 / 68%);
  backdrop-filter: blur(12px);
}

.studio-login__panel {
  position: relative;
  width: min(100%, 25rem);
  display: grid;
  gap: 1rem;
  padding: 2.4rem;
  border: 1px solid rgb(255 255 255 / 44%);
  border-radius: 47% 53% 51% 49% / 51% 46% 54% 49%;
  background: rgb(16 13 29 / 88%);
  box-shadow: 0 0 3rem rgb(182 148 255 / 18%), inset 0 0 2rem rgb(255 255 255 / 8%);
}

.studio-login__eyebrow,
.studio-login h2,
.studio-login p {
  margin: 0;
  text-align: center;
}

.studio-login__eyebrow { opacity: .72; font-size: 1.35rem; }
.studio-login h2 { font-size: clamp(2rem, 6vw, 3rem); font-weight: 400; }

.studio-login label { display: grid; gap: .38rem; font-size: .9rem; }

.studio-login input {
  width: 100%;
  box-sizing: border-box;
  padding: .7rem .8rem;
  border: 1px solid rgb(255 255 255 / 34%);
  border-radius: .6rem;
  background: rgb(255 255 255 / 7%);
  color: inherit;
  font: inherit;
}

.studio-login input:focus-visible,
.studio-login__submit:focus-visible,
.studio-login__close:focus-visible { outline: 2px solid rgb(222 203 255); outline-offset: 3px; }
.studio-login__error { color: rgb(255 176 195); font-size: .9rem; }

.studio-login__submit {
  justify-self: center;
  padding: .5rem 1.1rem;
  border: 1px solid rgb(255 255 255 / 42%);
  border-radius: 999px;
  background: rgb(255 255 255 / 10%);
  color: inherit;
  font-size: 1.4rem;
  cursor: pointer;
}

.studio-login__submit:disabled { cursor: wait; opacity: .6; }
.studio-login__close { position: absolute; top: 1rem; right: 1rem; border: 0; background: none; color: inherit; font-size: 1.5rem; cursor: pointer; }

.studio-login-enter-active, .studio-login-leave-active { transition: opacity 280ms ease; }
.studio-login-enter-active .studio-login__panel, .studio-login-leave-active .studio-login__panel { transition: transform 420ms cubic-bezier(.16, 1, .3, 1), opacity 280ms ease; }
.studio-login-enter-from, .studio-login-leave-to { opacity: 0; }
.studio-login-enter-from .studio-login__panel, .studio-login-leave-to .studio-login__panel { opacity: 0; transform: scale(.92) translateY(1rem); }
</style>
