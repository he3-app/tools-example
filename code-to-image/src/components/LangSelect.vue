<template>
  <div class="lang-select-wrapper">
    <h-select :value="lang" :save-options="{autoSave: true, key: 'langSelectWrapper'}" class="lang-select" @change="changeHandler">
      <a-select-option v-for="(v, k, i) in CodeEditorLanguagesDisplayName" :key="i" :value="k">
        {{ v }}
      </a-select-option>
    </h-select>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { CodeEditorLanguagesDisplayName } from './constants';
import type { CodeEditorLanguagesUnion } from './constants';

const props = defineProps<{
  modelValue: CodeEditorLanguagesUnion;
}>();
const emit = defineEmits(['update:modelValue']);

const lang = ref(props.modelValue ?? `JAVASCRIPT`);
watch(
  () => props.modelValue,
  (value) => {
    lang.value = value ?? `JAVASCRIPT`;
  },
  { immediate: true }
);

const changeHandler = (value) => {
  lang.value = value as CodeEditorLanguagesUnion;
  emit('update:modelValue', value);
};
</script>
<style scoped lang="less">
.lang-select-wrapper {
  .lang-select {
    min-width: 140px;
  }
}
</style>
