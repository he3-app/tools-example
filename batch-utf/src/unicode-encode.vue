<template>
  <h-text-transform
    ref="transformRef"
    :sample-data="sampleData"
    :transform="encode"
    :reverse-transform="decode"
    :enable-reverse="true"
  >
    <template #option>
      <a-checkbox v-model:checked="donTConvertAll" style="margin: 0 0 15px" @change="handleChange" :save-options="{key:'donTConvertAll',autoSave:true}">
        {{ t('donTConvertAll') }}
      </a-checkbox>
    </template>
  </h-text-transform>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { decode } from './unicode';
import messages from './unicodeLang.json';
const { t } = useI18n({
  locale: window.$he3.lang,
  messages,
});
const donTConvertAll = ref(true);

const sampleData = '氦三科技';

const encode = (str: string): string => {
  let result = '';
  for (const char of str) {
    const code = char.charCodeAt(0);
    if (donTConvertAll.value) {
      if (code < 128) {
        result += char;
        continue;
      }
    }
    result += `\\u${String(code.toString(16)).padStart(4, '0')}`;
  }
  return result;
};

const transformRef = ref();
const handleChange = () => {
  transformRef.value.handleChange();
};
</script>

<style scoped lang="less"></style>
