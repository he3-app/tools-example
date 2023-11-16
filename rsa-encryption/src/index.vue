<template>
  <h-text-transform ref="cryptRef" enable-file :file-output-alert="t('enc')" :sample-data="sample" :transform="encrypt"
    :file-output-name="fileName">
    <template #option>
      <div>
        <a-radio-group @change="callCryptMethod" v-model:value="keyType">
          <a-radio value="public">{{ t('publicKey') }}</a-radio>
          <a-radio value="private">{{ t('privateKey') }}</a-radio>
        </a-radio-group>
        <h-multiline-input v-model="keyString" class="input" :title="t('inputKey')" autofocus @change="callCryptMethod"
          :save-options="{ key: 'rsa-encryption-key', autoSave: true }" />
      </div>
    </template>
  </h-text-transform>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import forge from 'node-forge';
import { useI18n } from 'vue-i18n';
import messages from './lang.json';

const { t } = useI18n({
  locale: window.$he3.lang,
  messages,
});
const sample = 'A Free, Modern Toolbox, Built for Developers.';
const publicKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCZyxkpCOkAp9oqL78CZskZ07Nn
6D38m2D2Tr57aCG6vQHT0IO1sKa4zHz2dPohcpuOdRS0NtjCu4TZMI/knwQy+i1a
ypAspXLTp3WiT73b+ogAGnClpvLkJgdhBhwn8VjarHYXTE31149yAIpfQARhRuq/
gryZ0FwMjILUzyjJ3QIDAQAB
-----END PUBLIC KEY-----`;
const privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIICXAIBAAKBgQCZyxkpCOkAp9oqL78CZskZ07Nn6D38m2D2Tr57aCG6vQHT0IO1
sKa4zHz2dPohcpuOdRS0NtjCu4TZMI/knwQy+i1aypAspXLTp3WiT73b+ogAGnCl
pvLkJgdhBhwn8VjarHYXTE31149yAIpfQARhRuq/gryZ0FwMjILUzyjJ3QIDAQAB
AoGBAIBl0uSyfq1AdeEAqczceYrpdwAKIi5Sntokld076+UWxX7MuBmpmRfyCWZN
9UKVh4+g6h8nJ0M1AU2+wHOT2xFUeNKJLYjlRPVm0JvIk3SkXSHxnS7hkditkRnv
wQmBMIwO9Bv0JPOwN/8tPAxCuRzianXoFCTr9bQ0NdQfO/rBAkEA0gTqa1gNYlGK
Ath9GVTw2f9u2Ipujil8chKzcBE1es1qb+47MW/FdsOait4mzmV2dHB5iht+MvgW
4kkATItIMQJBALt22v4B9vvCrLoQ6OzrQSb0LZrk2fPfUvW+ykNZlkabBbZLoVHH
VXiDt1t+bUXrS7GtfZN7pkP9afAeFVWlnW0CQEwLf54SqfX5tFFHdjSf7v3gYZCC
v3k2SFs9rj9b29N1YZ7Z0hEaeZOBTAoQWljNoFCVEU0Sm2V1M0QITtVocWECQDFU
BCoEoFX9EvBfFLuK5/j1Fa8FeyiF4lGR4603PKjVj/o5Cnj3Z9Evb6cerGhSkvds
/Hc7eTO40hCCCgEgdD0CQHDYpcpupiT43TPV+kORU4pOCqOXMcr9GD8t7ExLVk1I
LWVDkO6VMDoZF8+mumJ8GSUwA3ruXw+xTvl6GdYuYmI=
-----END RSA PRIVATE KEY-----`;
const keyString = ref(publicKey)
const cryptRef = ref();
const keyType = ref('public')
//防抖处理
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
const encrypt = (rawValue: string) => {
  if (rawValue.length <= 0) {
    window.$he3.message.warn('Please enter the plain text');
    return '';
  }

  if (keyString.value.length <= 0) {
    window.$he3.message.warn('Please enter the key');
    return '';
  }

  try {
    switch (keyType.value) {
      case "public":
        try {
          const publicKeyObj = forge.pki.publicKeyFromPem(keyString.value);
          const publicValue = forge.util.encode64(publicKeyObj.encrypt(rawValue));
          return publicValue;
        } catch (error) {
          window.$he3.message.error(error);
        }
        break;
      case "private":
        try {
          const privateKeyObj = forge.pki.privateKeyFromPem(keyString.value);
          const md = forge.md.sha256.create();
          md.update(sample);
          const signature = privateKeyObj.sign(md);
          const base64Signature = forge.util.encode64(signature);
          return base64Signature;
        } catch (error) {
          window.$he3.message.error(error);
        }
        break;
    }
  } catch (err) {
    window.$he3.message.error(err);
    return '';
  }
};
/** 返回函数名，加密文件添加enc后缀 */
const fileName = (fileName: string) => {
  return `${fileName}.enc`;
};
</script>
