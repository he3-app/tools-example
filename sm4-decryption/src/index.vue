<template>
  <h-text-transform
    ref="cryptRef"
    enable-file
    :file-output-alert="t('dec')"
    :sample-data="sample"
    :transform="decrypt"
    :file-output-name="fileName"
  >
    <template #option>
      <a-space style="margin-top: 16px">
        <!-- <div style="width: 197px">
          <h-radio v-model:value="passwordType" option-type="button" :options="formatOptions" @change="SynchronizeInput"
            :save-options="{ autoSave: true, key: 'passwordType' }" />
        </div> -->
        <span>{{ t('key') }}</span>
        <a-input-group size="small" s compact>
          <a-select
            size="small"
            v-model:value="passwordType"
            @change="SynchronizeInput(passwordType)"
          >
            <a-select-option :value="OutputType.Hex">Hex</a-select-option>
            <a-select-option :value="OutputType.Base64">Base64</a-select-option>
            <a-select-option :value="OutputType.Utf8">Utf8</a-select-option>
          </a-select>
          <a-input
            size="small"
            style="width: auto"
            @change="callCryptMethod"
            v-model:value="keyString"
          />
        </a-input-group>
        <!-- <a-input-password v-model:value="keyString" @change="callCryptMethod" /> -->
        <span>{{ t('mode') }}</span>
        <span>
          <h-select
            v-model:value="cipherType"
            @change="callCryptMethod"
            :save-options="{ autoSave: true, key: 'cipherType' }"
          >
            <a-select-option :value="SM4Type.CBC">
              {{ SM4Type.CBC }}
            </a-select-option>
            <a-select-option :value="SM4Type.ECB">
              {{ SM4Type.ECB }}
            </a-select-option>
          </h-select>
        </span>
        <a-tooltip placement="topLeft" :title="t('toolTip')">
          <span>{{ t('padding') }}</span>
        </a-tooltip>
        <a-switch v-model:checked="isPadding" />
        <span>{{ t('inputType') }}</span>
        <span>
          <h-select
            v-model:value="inputType"
            @change="callCryptMethod"
            :save-options="{ autoSave: true, key: 'inputType' }"
          >
            <a-select-option :value="OutputType.Base64">
              {{ OutputType.Base64 }}
            </a-select-option>
            <a-select-option :value="OutputType.Hex">
              {{ OutputType.Hex }}
            </a-select-option>
          </h-select>
        </span>
      </a-space>
    </template>
  </h-text-transform>
</template>

<script setup lang="ts">
import { Buffer } from 'buffer';
import { ref, watch } from 'vue';
import { SM4 } from 'gm-crypto';
import utf8 from 'utf8';
import { useI18n } from 'vue-i18n';
import messages from './lang.json';

const { t } = useI18n({
  locale: window.$he3.lang,
  messages,
});

enum SM4Type {
  ECB = 'ECB',
  CBC = 'CBC',
}
enum OutputType {
  Utf8 = 'utf8',
  Base64 = 'base64',
  Hex = 'hex',
}
const formatOptions = [
  { label: 'Hex', value: 'hex' },
  { label: 'Base64', value: 'base64' },
  { label: 'Utf8', value: 'utf8' },
];
const inputType = ref(OutputType.Base64);
const outputType = ref(OutputType.Utf8);
const passwordType = ref(OutputType.Hex);
const sample = ref('ChYToJet2n4njlFdUnewRnPkjOVzIgoth0oUpJ+I9RZuCxyVrnX8KEUZU/IPhkfN');
const keyString = ref('0123456789abcdeffedcba9876543210');
const realKey = ref('0123456789abcdeffedcba9876543210'); //用于SM4.decrypt解密的key
const cipherType = ref(SM4Type.ECB);
const isPadding = ref<boolean>(false);
const cryptRef = ref();

let timeoutId: number | null = null;
function debounce<T extends (...args: any[]) => void>(func: T, delay: number) {
  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    const context = this;
    clearTimeout(timeoutId as number);
    timeoutId = setTimeout(() => func.apply(context, args), delay);
  };
}
const callCryptMethod = debounce(() => {
  cryptRef.value.handleChange();
}, 500);
//base64转hex
function convert(str: string): string {
  const buf = Buffer.from(str, 'base64');
  return buf.toString('hex');
}
//string转hex
const stringToHex = (str: string) => {
  const result = utf8.encode(str);
  let ret = '';
  for (const element of result) {
    const t = element.charCodeAt(0).toString(16).toUpperCase();
    ret += t;
  }
  return ret;
};

//切换密钥类型的change函数
const SynchronizeInput = () => {
  switch (passwordType.value) {
    case OutputType.Hex:
      keyString.value = '0123456789abcdeffedcba9876543210';
      cryptRef.value.raw = 'ChYToJet2n4njlFdUnewRnPkjOVzIgoth0oUpJ+I9RZuCxyVrnX8KEUZU/IPhkfN';
      break;
    case OutputType.Base64:
      keyString.value = 'ASNFZ4mrze/+3LqYdlQyEA==';
      cryptRef.value.raw = 'ChYToJet2n4njlFdUnewRnPkjOVzIgoth0oUpJ+I9RZuCxyVrnX8KEUZU/IPhkfN';
      break;
    case OutputType.Utf8:
      cryptRef.value.raw = 'Bf9oW/1XLAwJZTCPRVrMtRlZgNVmEqZ0LXkJONwgAOqRdhm1JExMfFByleg5TTu0';
      keyString.value = '示例字符串A';
      break;
  }
  callCryptMethod();
};

watch(isPadding, () => {
  callCryptMethod();
});

//补零
function padKeyString(keyString: string): string {
  if (keyString.length >= 32) {
    return keyString;
  } else {
    const paddingLength = 32 - keyString.length;
    const padding = '0'.repeat(paddingLength);
    return keyString + padding;
  }
}

const decrypt = (rawValue: string) => {
  judgeLength(rawValue, keyString);
  const cipherOps = {
    mode: SM4.constants.CBC,
  };

  switch (cipherType.value) {
    case SM4Type.ECB:
      cipherOps.mode = SM4.constants.ECB;
      break;
    case SM4Type.CBC:
      cipherOps.mode = SM4.constants.CBC;
      break;
  }
  switch (passwordType.value) {
    case OutputType.Hex:
      realKey.value = keyString.value;
      break;
    case OutputType.Base64:
      realKey.value = convert(keyString.value);
      break;
    case OutputType.Utf8:
      realKey.value = stringToHex(keyString.value);
      break;
  }
  try {
    if (isPadding.value) {
      realKey.value = padKeyString(realKey.value);
    }
    const ripeValue = SM4.decrypt(rawValue, realKey.value, {
      iv: realKey.value,
      mode: cipherOps.mode,
      inputEncoding: inputType.value,
      outputEncoding: outputType.value,
    });
    return ripeValue;
  } catch (error) {
    window.$he3.message.error(error.message);
    return '';
  }
};
/** 返回函数名，加密文件添加enc后缀 */
const fileName = (fileName: string) => {
  const fileArr = fileName.split('.');
  if (fileArr.at(-1) === 'enc') fileArr.pop();
  fileArr.splice(-1, 0, 'dec');
  return fileArr.join('.');
};

const judgeLength = (rawVal: string, keyVal: any) => {
  if (rawVal.length <= 0) {
    window.$he3.message.warn('Please enter the plain text');
    return '';
  }

  if (keyVal.value.length <= 0) {
    window.$he3.message.warn('Please enter the key');
    return '';
  }
};
</script>
