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
        <span>{{ t('key') }}</span>
        <h-input-password
          v-model:value="privateKey"
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

const sample =
  'ad77dcdc82d308df38a978620c28405e574b33b5e8ea665368561b1e051b5de5e69d28b26897bd1887f979e558eb68c3dec3db79b238b1530ceac39ba089a88ad0aa023516d6917f097b02da211c99259886a0c89ae1b127e82e9419ea2172c2d1b81e01ac57d1c547be7afa8a6ed9cf07f8f4577e642d9b40b86a8825b531dde87012057038cc3c4316f0ab1f';
const cipherType = ref(SM2Type.C1C3C2);
const cryptRef = ref();
const callCryptMethod = () => {
  cryptRef.value.handleChange();
};

const privateKey = ref(
  localStorage.getItem('private') ||
    'ed77d1a243901ec7171598df7ac57e0582625ec125f51fbc0a68b58cc370d7dd'
); // 私钥
const decrypt = (rawValue: string) => {
  judgeLength(rawValue, privateKey);
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
    const decryptData = sm2.doDecrypt(rawValue, privateKey.value, cipherOps.mode);
    localStorage.removeItem('private');
    return decryptData;
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
