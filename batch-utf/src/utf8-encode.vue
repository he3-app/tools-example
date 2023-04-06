<template>
  <h-single-layout mode="middle" :width="1280">
    <div class="input">
      <h-multiline-input
        v-model="inputValue"
        :title="t('input_tip')"
        auto-select
        @change="encode"
        :save-options="{key:'inputValue', autoSave: true}"
      />
    </div>
    <h-radio
      v-model:value="format"
      style="margin-top: 10px"
      option-type="button"
      :options="formatOptions"
      @change="encode"
      :save-options="{key:'format', autoSave: true}"
    />
    <h-multiline :value="outputValue" :title="t('result_tip')" />
  </h-single-layout>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import utf8 from 'utf8';
import { useI18n } from 'vue-i18n';
import messages from './utf8Lang.json';
const { t } = useI18n({
  locale: window.$he3.lang,
  messages,
});
const format = ref('hex');
const formatOptions = [
  { label: 'HEX', value: 'hex' },
  { label: 'HTML', value: 'html' },
];
const inputValue = ref(`A Free, Modern Toolbox
Built for Developers.`);
const outputValue = ref('');

const encode = () => {
  const result = utf8.encode(inputValue.value);
  let ret = '';
  for (const element of result) {
    ret += formatSingle(element);
  }
  outputValue.value = ret;
};

function formatSingle(ch: string): string {
  switch (format.value) {
    case 'hex':
      let t = ch.charCodeAt(0).toString(16);
      return t.length === 1 && (t = `0${t}`), `\\x${t}`;
    case 'html':
      return `&#${ch.charCodeAt(0).toString()};`;
  }
  return ch;
}

setTimeout(() => {
  encode();
});
</script>

<style scoped lang="less"></style>
