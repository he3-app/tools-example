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
      <div style="margin-top: 16px">
        <a-space>
          <span>{{ t('key') }}</span>
          <h-input :type="!pwdShow?'password':'text'" v-model:value="keyString" @change="callCryptMethod" :save-options="{key:'keyString',autoSave:true}">
            <template #suffix>
              <h-icon icon="ant-design:eye-outlined"  @click="handlePwdShow" style="cursor: pointer;" v-if="pwdShow" />
              <h-icon icon="ant-design:eye-invisible-outlined" @click="handlePwdShow"  style="cursor: pointer;" v-else/>
            </template>
            </h-input>
          <span>{{ t('mode') }}</span>
          <span>
            <h-select v-model:value="cipherType" class="opt" @change="callCryptMethod" :save-options="{autoSave:true,key:'cipherType'}">
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
            <h-select v-model:value="paddingType" class="padding-select" @change="callCryptMethod" :save-options="{autoSave:true,key:'paddingType'}">
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

const sample =
  'U2FsdGVkX19sysc/bKpeMT6xXQlRqe7Rc640TmoKpIQG5AAnAqovJz+nd1JBuYi5EWKhftCcU0/D5ZKIoyrNaw==';
const keyString = ref('key');
const cipherType = ref(CipherType.CBC);
const paddingType = ref(CipherType.Pkcs7);
const cryptRef = ref();
const callCryptMethod = () => {
  cryptRef.value.handleChange();
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
  const cipherOps = {
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
    const ripeValue = CryptoJS.DES.decrypt(rawValue, keyString.value, cipherOps).toString(
      CryptoJS.enc.Utf8
    );
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

const pwdShow =  ref(false)
const handlePwdShow  = () =>{
  pwdShow.value = !pwdShow.value
}
</script>
