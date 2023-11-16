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
      <a-space style="margin-top: 16px">
        <span>{{ t('key') }}</span>
        <h-input-password
          v-model:value="publicKey"
          @change="callCryptMethod"
          :save-options="{ autoSave: true, key: 'password' }"
        />
        <span>{{ t('mode') }}</span>
        <span>
          <h-select
            v-model:value="cipherType"
            @change="callCryptMethod"
            :save-options="{ key: 'cipherType', autoSave: true }"
          >
            <a-select-option :value="SM2Type.C1C2C3">
              {{ SM2Type.C1C2C3 }}
            </a-select-option>
            <a-select-option :value="SM2Type.C1C3C2">
              {{ SM2Type.C1C3C2 }}
            </a-select-option>
          </h-select>
        </span>
      </a-space>
    </template>
  </h-text-transform>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { SM2 } from 'gm-crypto';
import { sm2 } from 'sm-crypto';
import { useI18n } from 'vue-i18n';
import messages from './lang.json';

const { t } = useI18n({
  locale: window.$he3.lang,
  messages,
});

const enum SM2Type {
  C1C2C3 = 'C1C2C3',
  C1C3C2 = 'C1C3C2',
}

const sample = 'A Free, Modern Toolbox, Built for Developers.';
const cipherType = ref(SM2Type.C1C3C2);
const cryptRef = ref();
const callCryptMethod = () => {
  cryptRef.value.handleChange();
};

const keyPair = sm2.generateKeyPairHex();
const publicKey = ref(keyPair.publicKey);
const privateKey = ref(keyPair.privateKey); // 私钥
localStorage.setItem('private', privateKey.value);
const encrypt = (rawValue: string) => {
  judgeLength(rawValue, publicKey);
  const cipherOps = {
    mode: SM2.constants.C1C3C2,
  };

  switch (cipherType.value) {
    case SM2Type.C1C3C2:
      cipherOps.mode = SM2.constants.C1C3C2;
      break;
    case SM2Type.C1C2C3:
      cipherOps.mode = SM2.constants.C1C2C3;
      break;
  }

  try {
    const encryptData = sm2.doEncrypt(rawValue, publicKey.value, cipherOps.mode);
    return encryptData;
  } catch (error) {
    window.$he3.message.error(error.message);
    return '';
  }
};
/** 返回函数名，加密文件添加enc后缀 */
const fileName = (fileName: string) => {
  return `${fileName}.enc`;
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
