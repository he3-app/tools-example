<template>
  <h-text-transform
    ref="cryptRef"
    enable-file
    :file-output-alert="t('dec')"
    :sample-data="sample"
    :transform="decrypt"
    :file-output-name="fileName"
    :auto-fill-input-condition="isRabbitDecryption"
  >
    <template #option>
      <p>
        <span>{{ t('key') }}</span>
        <h-input-password
          v-model:value="keyString"
          @change="callCryptMethod"
          :save-options="{ autoSave: true, key: 'password' }"
        />
      </p>
    </template>
  </h-text-transform>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CryptoJS from 'crypto-js';
import { useI18n } from 'vue-i18n';
import messages from './lang.json';

const { t } = useI18n({
  locale: window.$he3.lang,
  messages,
});
const sample =
  'U2FsdGVkX1/jAhs83PdWG00ZLbD4xMg1lJ7n49P7ISDjmJtsVVq+MqfFYpehrmjbaNbyVJDSOjw+K0GCFg==';
const cryptRef = ref();
const keyString = ref('key');

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

const isRabbitDecryption = (text: string) => {
  return text.startsWith('U2FsdGVkX1');
};

const decrypt = (rawValue: string) => {
  if (rawValue.length <= 0) {
    window.$he3.message.warn('Please enter the plain text');
    return '';
  }

  if (keyString.value.length <= 0) {
    window.$he3.message.warn('Please enter the key');
    return '';
  }

  try {
    const ripeValue = CryptoJS.Rabbit.decrypt(rawValue, keyString.value).toString(
      CryptoJS.enc.Utf8
    );
    return ripeValue;
  } catch (err) {
    window.$he3.message.warn('Decryption Key Is Fixed');
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
</script>
