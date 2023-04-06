<template>
  <h-text-transform
    ref="transformRef"
    :sample-data="sampleData"
    :transform="decode"
    :reverse-transform="encode"
    :enable-reverse="true"
  >
    <template #option>
      <span>{{ t('IMAPMode') }}</span>
      <a-switch v-model:checked="checked" @change="handleChange" />
    </template>
  </h-text-transform>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { utf7Decode, utf7Encode, imapDecode, imapEncode } from './utf7.js';
import messages from './utf7Lang.json';
const { t } = useI18n({
  locale: window.$he3.lang,
  messages,
});
const checked = ref<boolean>(false);
const sampleData = 'A+ACA-Free,+ACA-Modern+ACA-Toolbox+ACA-Built+ACA-for+ACA-Developers';

const encode = (str: string): string => {
  if (checked.value) {
    return imapEncode(str);
  } else {
    return utf7Encode(str);
  }
};
const decode = (str: string): string => {
  if (checked.value) {
    return imapDecode(str);
  } else {
    return utf7Decode(str);
  }
};
const transformRef = ref();
const handleChange = () => {
  transformRef.value.handleChange();
};
</script>

<style scoped lang="less">
span {
  margin-right: 10px;
}
</style>
