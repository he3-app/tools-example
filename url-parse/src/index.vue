<template>
  <h-single-layout mode="middle" :width="1280">
    <div class="url-parse">
      <div class="input">
        <p>
          {{ t('input_tip') }}
        </p>
        <h-input v-model:value="inputValue" autofocus class="input" @change="parseUrl()" :autoFillInputCondition="isUrl"/>
      </div>
      <p>
        {{ t('result_tip') }}
      </p>
      <h-kv :value="outputValue" :width="370" />
      <div v-if="JSON.stringify(outputValue.query) !== '{}'" class="query">
        <p>Query:</p>
        <h-kv :value="outputValue.query" :width="370" />
      </div>
    </div>
  </h-single-layout>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, ref,onMounted } from 'vue';
import parse from 'url-parse';
import { useI18n } from 'vue-i18n';
import { isUrl } from '@he3-kit/utils';
import messages from './lang.json';
const $he3 = window.$he3;
const props = defineProps<{
  clipboardValue?: any;
}>();
const emit = defineEmits(['acceptClipboardCb']);

const { t } = useI18n({
  locale: $he3.lang,
  messages,
});
const inputValue = ref('https://user:pass@he3.app/index.html#download');

const outputValue = ref({});

function parseUrl() {
  outputValue.value = new parse(inputValue.value, true);
  console.log(outputValue)
}


onMounted(() => {
  $he3.getLastClipboard().then((res) => {
    if (isUrl(res)) {
      inputValue.value = res;
      parseUrl()
      $he3.onUseClipboardValue();
    }
  });
  parseUrl()
});
</script>
<style scoped lang="less">
.url-parse {
  .input {
    margin-bottom: 10px;
  }
  .query {
    margin-top: 10px;
  }
}
</style>
