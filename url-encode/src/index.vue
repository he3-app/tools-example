<template>
  <h-single-layout mode="middle" :width="1280">
    <div class="url-encode">
      <div class="input">
        <p>
          <span class="option">
            <h-radio
              v-model:value="option"
              size="small"
              :save-options="{ autoSave: true, key: 'option' }"
              @change="encode"
            >
              <a-radio-button value="uri">URI</a-radio-button>
              <a-radio-button value="uriComponent"
                >URI Component</a-radio-button
              >
            </h-radio>
          </span>
        </p>
        <h-multiline-input
          v-model:modelValue="inputValue"
          auto-select
          :title="t('input_tip')"
          @change="encode"
        />
      </div>
      <h-multiline-input
        v-model:modelValue="outputValue"
        :title="t('result_tip_no_colon')"
        :autofocus="false"
        @change="decode"
      />
    </div>
  </h-single-layout>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { isUrl } from "./util";
import messages from "./lang.json";
const $he3 = window.$he3;
const { t } = useI18n({
  locale: window.$he3.lang,
  messages,
});
const inputValue = ref(
  'https://he3.app?name=He3 Application&platform="apple,windows"'
);
const outputValue = ref("");
const option = ref("uriComponent");

const encode = () => {
  try {
    if (option.value === "uriComponent") {
      outputValue.value = encodeURIComponent(inputValue.value);
    } else {
      outputValue.value = encodeURI(inputValue.value);
    }
  } catch (error) {
    $he3.message.warn((error as any).toString());
  }
};

const decode = () => {
  try {
    if (option.value === "uriComponent") {
      inputValue.value = decodeURIComponent(outputValue.value);
    } else {
      inputValue.value = decodeURI(outputValue.value);
    }
  } catch (error) {
    $he3.message.warn((error as any).toString());
  }
};

onMounted(async () => {
  encode();
  const processValue = async (value) => {
    if (isUrl(value)) {
      inputValue.value = value;
      encode();
    }
  };
  const previewerValue = await $he3.getPreviewerValue();
  await processValue(previewerValue);

  const clipboardValue = await $he3.getLastClipboard();
  await processValue(clipboardValue);

  if (isUrl(clipboardValue))  $he3.onUseClipboardValue();
  
});
</script>
<style scoped lang="less">
.url-encode {
  .option {
    float: right;
  }

  .input {
    margin-bottom: 10px;
  }
}
</style>
