<template>
  <h-text-transform ref="cryptRef" enable-file :file-output-alert="t('dec')" :sample-data="sample" :transform="decrypt"
    :file-output-name="fileName">
    <template #option>
      <div>
        <a-space>
          <a-radio-group @change="callCryptMethod" v-model:value="keyType">
            <a-radio value="public">{{ t('publicKey') }}</a-radio>
            <a-radio value="private">{{ t('privateKey') }}</a-radio>
          </a-radio-group>
          <span v-show="keyType === 'public'">{{ t('originalText') }}</span>
          <span v-show="keyType === 'public'"> <h-input @change="callCryptMethod" :allowClear="true"
              v-model:value="originalText" autoSelect
              :save-options="{ autoSave: true, key: 'rsa-original-text' }" /></span>
        </a-space>
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
const sample =
  ref('dGGOCMYqn6viJT1RAivVwLNrz2leLYUtpCaJnpUYxVbMPPRID8pq4bXG7A8d4+8A9H2ou46JZOxfBO849o+C4Z0CBcfdstWZC5fs+/v+ZDjRe4pI+tag6ZDPHpHD5U1S/0DkWZkBffIpQjV8OweItNHzItJAURuvOJ2JQxw7gVI=');
const keyType = ref('private');
const publicKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCZyxkpCOkAp9oqL78CZskZ07Nn
6D38m2D2Tr57aCG6vQHT0IO1sKa4zHz2dPohcpuOdRS0NtjCu4TZMI/knwQy+i1a
ypAspXLTp3WiT73b+ogAGnClpvLkJgdhBhwn8VjarHYXTE31149yAIpfQARhRuq/
gryZ0FwMjILUzyjJ3QIDAQAB
-----END PUBLIC KEY-----`;
const originalText = ref('A Free, Modern Toolbox, Built for Developers.');
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
const keyString = ref(privateKey);
const cryptRef = ref();
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
const decrypt = (rawValue: string) => {
  if (rawValue.length <= 0) {
    window.$he3.message.warn('Please enter the plain text');
    return '';
  }

  if (keyString.value.length <= 0) {
    window.$he3.message.warn('Please enter the key');
    return '';
  }
  switch (keyType.value) {
    case "public":
      if (originalText.value.length <= 0) {
        window.$he3.message.warn('Please enter the original text');
        return '';
      }
      try {
        const publicKeyObj = forge.pki.publicKeyFromPem(keyString.value);
        const md = forge.md.sha256.create();
        md.update(originalText.value);
        const hash = md.digest().bytes();
        const signatureBytes = forge.util.decode64(rawValue);
        const verified = publicKeyObj.verify(hash, signatureBytes);
        if (verified) {
          return t('verify_true');
        } else {
          return t('verify_false');
        }
      } catch (error) {
        window.$he3.message.error(error);
      }
      break;
    case "private":
      try {
        const privateKeyObj = forge.pki.privateKeyFromPem(keyString.value);
        const ripeValue = forge.util.decodeUtf8(privateKeyObj.decrypt(forge.util.decode64(rawValue)));
        return ripeValue;
      } catch (error) {
        window.$he3.message.warn(error);
      }
      break;
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
