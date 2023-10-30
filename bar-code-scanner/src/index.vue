<template>
  <h-single-layout mode="middle" :width="1280">
    <a-upload :before-upload="beforeUpload" :max-count="1">
      <a-button>{{ t('select') }}</a-button>
    </a-upload>

    <div v-show="false" id="bar-code-renderer" />

    <h-multiline :title="t('content')" :value="result" />
  </h-single-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Html5Qrcode } from 'html5-qrcode';
import messages from './lang.json';
import type { UploadProps } from 'ant-design-vue';
const { t } = useI18n({
  locale: window.$he3.lang,
  messages,
});

const result = ref('');

const beforeUpload: UploadProps['beforeUpload'] = async (file: File) => {
  const scanner = new Html5Qrcode('bar-code-renderer');
  result.value = await scanner.scanFile(file, false);
  return false;
};
</script>

<style scoped lang="less"></style>
