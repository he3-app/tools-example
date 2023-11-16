<template>
  <h-single-layout mode='middle' :width='1280'>
    <div>
      <h-multiline-input v-model='inputText' :title="t('decode.title')" @change='handleDecode' />
      <div class='btn-container'>
        <a-button type='primary' :disabled='isDisabled' @click='handleDownload'>
          {{ t('decode.download') }}
        </a-button>
      </div>
      <div class='result-container'>
        <img v-if='showImg' :src='img' class='img-item' />
      </div>
    </div>
  </h-single-layout>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { base64EncodedLogoFile } from './util';
import messages from './lang.json';
import ShortUniqueId from 'short-unique-id';

const { t } = useI18n({
  locale: window.$he3.lang,
  messages,
});
const inputText = ref(base64EncodedLogoFile);
const downloadURL = ref('');
const fileName = ref('');
const isDisabled = ref(true);
const showImg = ref(false);
const img = ref('');
const target = ref('');

const uid = new ShortUniqueId({ length: 16 });

async function handleDecode() {
  if (inputText.value.length === 0) {
    img.value = '';
    isDisabled.value = true;
    return;
  }

  let data = inputText.value;

  if (data.includes(';base64,')) {
    const pieces = data.split(';base64,');
    if (pieces.length >= 2) {
      data = pieces[1];
    }
  }
  try {

    const res = await window.$he3.detectFileType(data);
    fileName.value = `${uid()}.${res?.ext}`;
  } catch (e) {
    fileName.value = uid();
  } finally {
    isDisabled.value = false;
    const result = `data:application/octet-stream;base64,${data}`;
    downloadURL.value = result;

    const imgValidator = new Image();

    imgValidator.onload = () => {
      img.value = result;
      showImg.value = true;
      console.log('===');
      window.$he3.message.success('Image decode success');
    };
    imgValidator.onerror = () => {
      img.value = '';
      showImg.value = false;
      window.$he3.message.success('File decode success');
    };
    imgValidator.src = `data:application/octet-stream;base64,${data}`;

  }
}

const handleDownload = () => {
  const link = document.createElement('a');
  link.href = downloadURL.value;
  link.download = fileName.value || uid();
  link.dispatchEvent(new MouseEvent('click'));
};
</script>

<style scoped lang='less'>
@small: 0.5rem;
@middle: 1rem;
@large: 2rem;

.result-container {
  display: inline-block;
  margin-top: @small;
  border: 2px solid transparent;
  border-radius: @small;
  overflow: hidden;


}

</style>
