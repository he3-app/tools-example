<template>
  <h-text-transform
    ref="cryptRef"
    enable-file
    :file-output-alert="t('enc')"
    :sample-data="sample"
    :transform="encrypt"
    :file-output-name="fileName"
  >
    <template #option>
      <div style="margin-top: 16px">
        <a-space>
          {{ t('key') }}
          <h-input-password
            v-model:value="keyString"
            class="passphrase opt"
            :save-options="{ key: 'keyString', autoSave: true }"
            @change="callCryptMethod"
          />
          <span>{{ t('streamDrop') }}</span>
          <span>
            <h-select
              v-model:value="DropOpts"
              class="opt"
              :save-options="{ autoSave: true, key: 'DropOpts' }"
              @change="callCryptMethod"
            >
              <a-select-option :value="CipherType.Drop">
                {{ CipherType.Drop }}
              </a-select-option>
              <a-select-option :value="CipherType.NoDrop">
                {{ CipherType.NoDrop }}
              </a-select-option>
            </h-select>
          </span>
          <span>{{ t('dropWord') }}</span>
          <span>
            <a-input v-model:value="dropWords" class="passphrase opt" @change="callCryptMethod" />
          </span>
        </a-space>
      </div>
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
enum CipherType {
  Drop = 'Drop',
  NoDrop = 'NoDrop',
}

const sample = 'A Free, Modern Toolbox, Built for Developers.';
const keyString = ref('key');
const DropOpts = ref(CipherType.Drop);
const dropWords = ref(0);
const cryptRef = ref();
const callCryptMethod = () => {
  cryptRef.value.handleChange();
};

const encrypt = (rawValue: string) => {
  if (rawValue.length <= 0) {
    window.$he3.message.warn('Please enter the plain text');
    return '';
  }

  if (keyString.value.length <= 0) {
    window.$he3.message.warn('Please enter the key');
    return '';
  }

  const cipherOps = {
    drop: dropWords.value,
  };

  try {
    let ripeValue = '';
    switch (DropOpts.value) {
      case CipherType.NoDrop:
        ripeValue = CryptoJS.RC4.encrypt(rawValue, keyString.value).toString();
        break;
      case CipherType.Drop:
        ripeValue = CryptoJS.RC4Drop.encrypt(rawValue, keyString.value, cipherOps).toString();
        break;
    }
    return ripeValue;
  } catch (err) {
    window.$he3.message.error({
      key: 'rc4-error',
      content: err.message,
    });
    return '';
  }
};
/** 返回函数名，加密文件添加enc后缀 */
const fileName = (fileName: string) => {
  return `${fileName}.enc`;
};
</script>
