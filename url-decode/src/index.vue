<template>
  <h-single-layout mode="middle" :width="1280">
    <div class="url-decode">
      <div class="input">
        <p>
          <span class="option">
            <h-radio
              v-model:value="option"
              size="small"
              :save-options="{ autoSave: true, key: 'option' }"
              @change="decode"
            >
              <a-radio-button value="uri">URI</a-radio-button>
              <a-radio-button value="uriComponent">URI Component</a-radio-button>
            </h-radio>
          </span>
        </p>
        <h-multiline-input
          v-model:modelValue="inputValue"
          auto-select
          :title="t('input_tip')"
          @change="decode"
        />
      </div>
      <h-multiline-input
        v-model:modelValue="outputValue"
        :title="t('result_tip')"
        :autofocus="false"
        @change="encode"
      />
    </div>
  </h-single-layout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { isUrl } from './util';
import messages from './lang.json';
const { t } = useI18n({
  locale: window.$he3.lang,
  messages,
});
const $he3 = window.$he3
const inputValue = ref('https://he3.app?name=He3%20Application&platform=%22apple,windows%22');
const outputValue = ref('');
const option = ref('uriComponent');

const decode = () => {
  try {
    if (option.value === 'uriComponent') {
      outputValue.value = decodeURIComponent(inputValue.value);
    } else {
      outputValue.value = decodeURI(inputValue.value);
    }
  } catch (error) {
    $he3.message.warn((error as any).toString());
  }
};
const encode = () => {
  try {
    if (option.value === 'uriComponent') {
      inputValue.value = encodeURIComponent(outputValue.value);
    } else {
      inputValue.value = encodeURI(outputValue.value);
    }
  } catch (error) {
    $he3.message.warn((error as any).toString());
  }
};
onMounted(async () => {
  decode();
  const processValue = async (value) => {
    if (isUrl(value)) {
      inputValue.value = value;
      decode();
    }
  };

  const previewerValue = await $he3.getPreviewerValue();
  await processValue(previewerValue);

  const clipboardValue = await $he3.getLastClipboard();
  await processValue(clipboardValue);

  if(isUrl(clipboardValue)) $he3.onUseClipboardValue();
});

</script>
<style scoped lang="less">
.url-decode {
  .option {
    float: right;
  }

  .input {
    margin-bottom: 10px;
  }
}
</style>
