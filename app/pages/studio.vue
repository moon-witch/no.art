<script setup lang="ts">
type StudioQuote = {
  id: string
  status: 'draft' | 'published'
  displayOrder: number
  imageAssetId: string | null
  imageAlt: string
  quoteText: string
  attribution: string
  reflection: { en?: string, de?: string }
  imageKey?: string | null
}

const { t } = useI18n()
const quotes = ref<StudioQuote[]>([])
const isLoading = ref(true)
const isSaving = ref(false)
const error = ref('')
const notice = ref('')
const imageInput = ref<HTMLInputElement>()
const selectedId = ref<string | null>(null)

const blankQuote = (): StudioQuote => ({
  id: '', status: 'draft', displayOrder: quotes.value.length, imageAssetId: null,
  imageAlt: '', quoteText: '', attribution: '', reflection: { en: '', de: '' }, imageKey: null,
})

const draft = ref<StudioQuote>(blankQuote())
const selectedQuote = computed(() => quotes.value.find(quote => quote.id === selectedId.value))

const startNew = () => {
  selectedId.value = null
  draft.value = blankQuote()
  error.value = ''
  notice.value = ''
}

const selectQuote = (quote: StudioQuote) => {
  selectedId.value = quote.id
  draft.value = { ...quote, reflection: { ...quote.reflection } }
  error.value = ''
  notice.value = ''
}

const loadQuotes = async () => {
  try {
    quotes.value = await $fetch<StudioQuote[]>('/api/studio/quotes')
  }
  catch (fetchError: any) {
    if (fetchError?.statusCode === 401 || fetchError?.status === 401) {
      await navigateTo('/')
      return
    }

    error.value = t('studio.saveError')
  }
  finally {
    isLoading.value = false
  }
}

const uploadImage = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  error.value = ''
  const formData = new FormData()
  formData.append('file', file)

  try {
    const asset = await $fetch<{ id: string }>('/api/studio/assets', { method: 'POST', body: formData })
    draft.value.imageAssetId = asset.id
  }
  catch {
    error.value = t('studio.uploadError')
  }
}

const save = async () => {
  isSaving.value = true
  error.value = ''
  notice.value = ''
  const body = {
    status: draft.value.status,
    displayOrder: Number(draft.value.displayOrder),
    imageAssetId: draft.value.imageAssetId,
    imageAlt: draft.value.imageAlt,
    quoteText: draft.value.quoteText,
    attribution: draft.value.attribution,
    reflection: draft.value.reflection,
  }

  try {
    const quote = draft.value.id
      ? await $fetch<StudioQuote>(`/api/studio/quotes/${draft.value.id}`, { method: 'PATCH', body })
      : await $fetch<StudioQuote>('/api/studio/quotes', { method: 'POST', body })
    await loadQuotes()
    selectQuote({ ...quote, imageKey: quotes.value.find(item => item.id === quote.id)?.imageKey })
    notice.value = t('studio.saved')
  }
  catch {
    error.value = t('studio.saveError')
  }
  finally {
    isSaving.value = false
  }
}

const remove = async () => {
  if (!draft.value.id || !confirm(`${t('studio.delete')}?`)) return

  try {
    await $fetch(`/api/studio/quotes/${draft.value.id}`, { method: 'DELETE' })
    await loadQuotes()
    startNew()
  }
  catch {
    error.value = t('studio.saveError')
  }
}

const signOut = async () => {
  await $fetch('/api/auth/logout', { method: 'POST' })
  await navigateTo('/')
}

onMounted(loadQuotes)
</script>

<template>
  <main class="studio-page">
    <header class="studio-page__header">
      <p class="font-moon-flower">{{ t('studio.eyebrow') }}</p>
      <h1 class="font-simple-handmade">{{ t('studio.title') }}</h1>
      <button class="studio-page__sign-out" type="button" @click="signOut">{{ t('studio.signOut') }}</button>
    </header>

    <div class="studio-page__layout">
      <aside class="studio-page__list">
        <button class="studio-page__new" type="button" @click="startNew">+ {{ t('studio.newQuote') }}</button>
        <p v-if="isLoading">…</p>
        <p v-else-if="!quotes.length" class="studio-page__empty">{{ t('studio.empty') }}</p>
        <button
          v-for="quote in quotes"
          :key="quote.id"
          class="studio-page__quote-row"
          :class="{ 'studio-page__quote-row--active': selectedId === quote.id }"
          type="button"
          @click="selectQuote(quote)"
        >
          <img v-if="quote.imageAssetId" :src="`/api/assets/${quote.imageAssetId}`" alt="">
          <span>{{ quote.quoteText }}</span>
          <small>{{ quote.status === 'published' ? t('studio.published') : t('studio.draft') }}</small>
        </button>
      </aside>

      <form class="studio-page__form" @submit.prevent="save">
        <h2 class="font-simple-handmade">{{ selectedQuote ? t('studio.editQuote') : t('studio.newQuote') }}</h2>
        <div class="studio-page__form-grid">
          <label class="studio-page__wide">
            <span>{{ t('studio.quote') }}</span>
            <textarea v-model="draft.quoteText" required rows="3" />
          </label>
          <label>
            <span>{{ t('studio.attribution') }}</span>
            <input v-model="draft.attribution" required>
          </label>
          <label>
            <span>{{ t('studio.displayOrder') }}</span>
            <input v-model.number="draft.displayOrder" type="number" required>
          </label>
          <label class="studio-page__wide">
            <span>{{ t('studio.imageAlt') }}</span>
            <input v-model="draft.imageAlt" required>
          </label>
          <label>
            <span>{{ t('studio.status') }}</span>
            <select v-model="draft.status">
              <option value="draft">{{ t('studio.draft') }}</option>
              <option value="published">{{ t('studio.published') }}</option>
            </select>
          </label>
          <label>
            <span>{{ t('studio.uploadImage') }}</span>
            <input ref="imageInput" type="file" accept="image/jpeg,image/png,image/webp,image/avif" @change="uploadImage">
          </label>
          <img v-if="draft.imageAssetId" class="studio-page__preview" :src="`/api/assets/${draft.imageAssetId}`" :alt="draft.imageAlt">
          <label class="studio-page__wide">
            <span>{{ t('studio.reflectionEnglish') }}</span>
            <textarea v-model="draft.reflection.en" required rows="6" />
          </label>
          <label class="studio-page__wide">
            <span>{{ t('studio.reflectionGerman') }}</span>
            <textarea v-model="draft.reflection.de" required rows="6" />
          </label>
        </div>
        <p v-if="error" class="studio-page__error" role="alert">{{ error }}</p>
        <p v-if="notice" class="studio-page__notice">{{ notice }}</p>
        <footer>
          <button class="studio-page__save" type="submit" :disabled="isSaving">{{ isSaving ? t('studio.saving') : t('studio.save') }}</button>
          <button v-if="draft.id" class="studio-page__delete" type="button" @click="remove">{{ t('studio.delete') }}</button>
        </footer>
      </form>
    </div>
  </main>
</template>

<style scoped>
.studio-page { min-height: 100dvh; box-sizing: border-box; padding: clamp(1.25rem, 4vw, 4rem); background: #0c0a15; color: rgb(255 255 255 / 86%); }
.studio-page__header { position: relative; margin-bottom: 2.5rem; }
.studio-page__header p, .studio-page__header h1 { margin: 0; }
.studio-page__header p { font-size: 1.4rem; opacity: .72; }
.studio-page__header h1 { font-size: clamp(2.8rem, 7vw, 5rem); font-weight: 400; }
.studio-page__sign-out { position: absolute; top: 0; right: 0; }
.studio-page__layout { display: grid; grid-template-columns: minmax(12rem, 18rem) minmax(0, 1fr); gap: clamp(1.5rem, 4vw, 4rem); align-items: start; }
.studio-page__list { display: grid; gap: .7rem; }
.studio-page__new, .studio-page__save, .studio-page__delete, .studio-page__sign-out { border: 1px solid rgb(255 255 255 / 38%); border-radius: .55rem; padding: .55rem .75rem; background: rgb(255 255 255 / 8%); color: inherit; font: inherit; cursor: pointer; }
.studio-page__quote-row { display: grid; grid-template-columns: 2.3rem minmax(0, 1fr); gap: .6rem; align-items: center; padding: .55rem; border: 1px solid transparent; border-radius: .55rem; background: none; color: inherit; text-align: left; cursor: pointer; }
.studio-page__quote-row:hover, .studio-page__quote-row--active { border-color: rgb(223 202 255 / 55%); background: rgb(255 255 255 / 7%); }
.studio-page__quote-row img { grid-row: span 2; width: 2.3rem; height: 2.3rem; object-fit: cover; border-radius: .3rem; }
.studio-page__quote-row span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.studio-page__quote-row small { opacity: .6; }
.studio-page__empty { opacity: .65; }
.studio-page__form { padding: clamp(1rem, 3vw, 2rem); border: 1px solid rgb(255 255 255 / 22%); border-radius: 1rem; background: rgb(255 255 255 / 4%); }
.studio-page__form h2 { margin: 0 0 1.25rem; font-size: 2.4rem; font-weight: 400; }
.studio-page__form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
.studio-page__form-grid label { display: grid; gap: .38rem; }
.studio-page__form-grid label > span { font-size: .85rem; opacity: .78; }
.studio-page__wide { grid-column: 1 / -1; }
.studio-page input, .studio-page textarea, .studio-page select { width: 100%; box-sizing: border-box; border: 1px solid rgb(255 255 255 / 25%); border-radius: .45rem; padding: .65rem; background: rgb(0 0 0 / 19%); color: inherit; font: inherit; }
.studio-page textarea { resize: vertical; }
.studio-page__preview { width: min(100%, 12rem); aspect-ratio: 1; object-fit: cover; border-radius: .7rem; }
.studio-page footer { display: flex; gap: .75rem; margin-top: 1.25rem; }
.studio-page__delete { border-color: rgb(255 164 179 / 45%); }
.studio-page__error { color: rgb(255 170 189); }.studio-page__notice { color: rgb(189 242 210); }
@media (max-width: 700px) { .studio-page__layout { grid-template-columns: 1fr; }.studio-page__list { grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr)); }.studio-page__form-grid { grid-template-columns: 1fr; }.studio-page__wide { grid-column: auto; } }
</style>
