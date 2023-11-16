<template>
  <h-text-transform ref="cryptRef" enable-file :file-output-alert="t('enc')" :sample-data="sample" :transform="encrypt"
    :file-output-name="fileName">
    <template #option>
      <div style="margin-top: 16px">
        <a-space>
          <span>{{ t('key') }}</span>
          <h-input :type="!passphraseShow ? 'password' : 'text'" v-model:value="keyString" class="passphrase"
            @change="callCryptMethod" :save-options="{ autoSave: true, key: 'Passphrase' }">
            <template #suffix>
              <h-icon icon="ant-design:eye-outlined" @click="handlePassphraseShow" style="cursor: pointer;"
                v-if="passphraseShow" />
              <h-icon icon="ant-design:eye-invisible-outlined" @click="handlePassphraseShow" style="cursor: pointer;"
                v-else />
            </template>
          </h-input>
          <a-tooltip :title="t('IV')">
            <span>{{ 'IV:' }}</span>
          </a-tooltip>
          <h-input :type="!offsetShow ? 'password' : 'text'" v-model:value="iv" placeholder="ECB模式不需要"
            @change="callCryptMethod" :save-options="{ autoSave: true, key: 'Offset' }">
            <template #suffix>
              <h-icon icon="ant-design:eye-outlined" @click="handleOffsetShow" style="cursor: pointer;"
                v-if="offsetShow" />
              <h-icon icon="ant-design:eye-invisible-outlined" @click="handleOffsetShow" style="cursor: pointer;"
                v-else />
            </template>
          </h-input>
          <span>{{ t('mode') }}</span>
          <span>
            <h-select v-model:value="cipherType" class="opt" @change="callCryptMethod"
              :save-options="{ key: 'cipherType', autoSave: true }">
              <a-select-option :value="CipherType.CBC">
                {{ CipherType.CBC }}
              </a-select-option>
              <a-select-option :value="CipherType.ECB">
                {{ CipherType.ECB }}
              </a-select-option>
              <a-select-option :value="CipherType.CFB">
                {{ CipherType.CFB }}
              </a-select-option>
              <a-select-option :value="CipherType.CTR">
                {{ CipherType.CTR }}
              </a-select-option>
              <a-select-option :value="CipherType.OFB">
                {{ CipherType.OFB }}
              </a-select-option>
            </h-select>
          </span>
          <span>{{ t('padding') }}</span>
          <span>
            <h-select v-model:value="paddingType" @change="callCryptMethod"
              :save-options="{ key: 'paddingType', autoSave: true }">
              <a-select-option :value="CipherType.Pkcs7">
                {{ CipherType.Pkcs7 }}
              </a-select-option>
              <a-select-option :value="CipherType.Zero">
                {{ CipherType.Zero }}
              </a-select-option>
              <a-select-option :value="CipherType.Iso10126">
                {{ CipherType.Iso10126 }}
              </a-select-option>
              <a-select-option :value="CipherType.None">
                {{ CipherType.None }}
              </a-select-option>
              <a-select-option :value="CipherType.Ansix923">
                {{ CipherType.Ansix923 }}
              </a-select-option>
            </h-select>
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
  ECB = 'ECB',
  CBC = 'CBC',
  CFB = 'CFB',
  CTR = 'CTR',
  OFB = 'OFB',
  // padding
  Pkcs7 = 'Pkcs7',
  Zero = 'Zero',
  Iso10126 = 'Iso10126',
  None = 'None',
  Ansix923 = 'Ansix923',
  // keysize
  // Bits128 = '128bits',
  // Bits192 = '192bits',
  // Bits256 = '256bits',
}

const keyString = ref('key0000000000000');
const iv = ref('1234567890000000');
const cipherType = ref(CipherType.CBC);
const paddingType = ref(CipherType.Pkcs7);
// const keyType = ref(CipherType.Bits256);
const cryptRef = ref();
const sample = 'A Free, Modern Toolbox, Built for Developers.';
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

  // let salt = CryptoJS.lib.WordArray.create()
  // let keyBit = 8
  // switch (keyType.value) {
  //   case CipherType.Bits256:
  //     keyBit = 8
  //     break
  //   case CipherType.Bits192:
  //     keyBit = 6
  //     break
  //   case CipherType.Bits128:
  //     keyBit = 4
  //     break
  // }
  // let cipherKey = CryptoJS.PBKDF2(keyString.value, salt, { keySize: keyBit })
  const cipherOps = {
    iv: CryptoJS.enc.Utf8.parse(iv.value),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  };

  switch (cipherType.value) {
    case CipherType.ECB:
      cipherOps.mode = CryptoJS.mode.ECB;
      break;
    case CipherType.CFB:
      cipherOps.mode = CryptoJS.mode.CFB;
      break;
    case CipherType.CTR:
      cipherOps.mode = CryptoJS.mode.CTR;
      break;
    case CipherType.OFB:
      cipherOps.mode = CryptoJS.mode.OFB;
      break;
  }

  switch (paddingType.value) {
    case CipherType.Zero:
      cipherOps.padding = CryptoJS.pad.ZeroPadding;
      break;
    case CipherType.Iso10126:
      cipherOps.padding = CryptoJS.pad.Iso10126;
      break;
    case CipherType.None:
      cipherOps.padding = CryptoJS.pad.NoPadding;
      break;
    case CipherType.Ansix923:
      cipherOps.padding = CryptoJS.pad.AnsiX923;
      break;
  }
  try {
    const ripeValue = CryptoJS.AES.encrypt(
      CryptoJS.enc.Utf8.parse(rawValue),
      CryptoJS.enc.Utf8.parse(keyString.value),
      cipherOps
    ).toString();
    return ripeValue;
  } catch (error) {
    window.$he3.message.error(error.message);
    return '';
  }
};
/** 返回函数名，加密文件添加enc后缀 */
const fileName = (fileName: string) => {
  return `${fileName}.enc`;
};

const passphraseShow = ref(false)
const offsetShow = ref(false)
const handlePassphraseShow = () => {
  passphraseShow.value = !passphraseShow.value
}
const handleOffsetShow = () => {
  offsetShow.value = !offsetShow.value
}
</script>
