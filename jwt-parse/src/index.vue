<template>
  <h-single-layout mode="middle" :width="1280">
    <div class="jwt-parse">
      <h-multiline-input
        v-show="!$he3.renderOnSearch"
        id="jwt-parse-textarea"
        v-model="inputValue"
        :title="t('input_tip')"
        class="input"
        auto-select
        :save-options="{ autoSave: true, key: 'jwt-parse-h-multiline-input' }"
        @change="parse"
      />
      <div class="result">
        <div class="result-son">
          {{ `Header:` }}
          <h-kv :value="outputHeader" mode="json" disable-mode-switch />
        </div>
        <div class="result-son">
          {{ `Payload:` }}
          <h-kv :value="outputValue" mode="json" disable-mode-switch />
        </div>
      </div>
    </div>
  </h-single-layout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import jwtDecode from 'jwt-decode';

import { useI18n } from 'vue-i18n';
import { isJWT } from './util';

import messages from './lang.json';
const $he3 = window.$he3;
const { t } = useI18n({
  locale: window.$he3.lang,
  messages,
});

const inputValue = ref(
  'eyJhbGciOiJIUzM4NCJ9.ewogICAgImFkbWluIjogInRydWUiLAogICAgInVzZXIiOiAiSGUzIiwKICAgICJleHAiOiAiMTY2Njg2NTY4MyIKfQ.pEH9dvF7Z96OwQeIrfrCNxZCuluX1G6WDXXFLdTUZURVg-7Mdg7iZG0QzadxBqiM'
);

const outputHeader = ref({});
const outputValue = ref({});
const alg = ref('HS256');

onMounted(async () => {
  parse();
  const previewerValue = await $he3.getPreviewerValue();
  if (isJWT(previewerValue)) {
    inputValue.value = previewerValue;
    parse();
  } else {
    const clipboardValue = await $he3.getLastClipboard();
    if (isJWT(clipboardValue)) {
      inputValue.value = clipboardValue;
      parse();
      $he3.onUseClipboardValue();
    }
  }
});
let timeoutId: number | null = null;
function debounce<T extends (...args: any[]) => void>(func: T, delay: number) {
  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    const context = this;
    clearTimeout(timeoutId as number);
    timeoutId = setTimeout(() => func.apply(context, args), delay);
  };
}

const parse = () => {
  try {
    outputHeader.value = {
      ...jwtDecode(inputValue.value, { header: true }),
    };
    outputValue.value = {
      ...jwtDecode(inputValue.value),
    };
  } catch (error) {
    const showErrorMessage = debounce(() => {
      window.$he3.message.warn((error as any).toString());
    }, 500);
    showErrorMessage();
  }
};
</script>
<style scoped lang="less">
.jwt-parse {
  .input {
    margin-bottom: 30px;
  }

  .result {
    display: flex;
    width: 100%;
    height: auto;
    justify-content: space-between;

    .result-son {
      width: 49%;
      height: 100%;
    }
  }
}
</style>
