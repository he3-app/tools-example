<template>
  <h-single-layout mode="middle" :width="1280" style="overflow-x: hidden">
    <a-row>
      <a-col :span="24" :offset="0">
        <div>
          <div>
            <div class="base64file-input">
              <a-row>
                <a-col :span="12" :offset="6">
                  <a-upload :before-upload="fileSelected" :max-count="1">
                    <a-button type="primary">
                      <UploadOutlined />
                      {{ t('encode.chooseFile') }}
                    </a-button>
                  </a-upload>
                </a-col>
              </a-row>
            </div>
          </div>
          <div>
            <a-row>
              <a-col :span="12" :offset="6" style='margin-top: 10px'>
                <span>{{ t('encode.resultTitleString') }}</span>
                <h-code :code="resultTitleString" />
              </a-col>
            </a-row>
          </div>
          <div v-if="!isDisabled">
            <a-row>
              <a-col :span="12" :offset="6" style='margin-top: 10px'>
                <span>{{ t('encode.resultTitleHTML') }}</span>
                <h-code :code="outputTextHTML" lang="CSS" />
              </a-col>
            </a-row>
          </div>

          <div v-if="!isDisabled">
            <a-row>
              <a-col :span="12" :offset="6" style='margin-top: 10px'>
                <span>{{ t('encode.resultTitleCSS') }}</span>
                <h-code :code="outputTextCSS" lang="CSS" />
              </a-col>
            </a-row>
          </div>
        </div>
      </a-col>
    </a-row>
  </h-single-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { UploadOutlined } from '@ant-design/icons-vue';
import base64 from 'base-64';
import { dataURLtoFile } from './util';
import { useI18n } from 'vue-i18n';
import messages from './lang.json';
const { t } = useI18n({
  locale: window.$he3.lang,
  messages,
});
const resultTitleString = ref('');
const outputTextHTML = ref('');
const outputTextCSS = ref('');
const isDisabled = ref(true);
onMounted(() => {
  if ($he3.getPreviewerValue()) {
    $he3.getPreviewerValue().then((value) => {
      if (value) {
        try {
          const file = dataURLtoFile(value, 'example');
          fileSelected(file);
        } catch (e) {
          console.log(e);
        }
      }
    });
  }
});

const fileSelected = async (file) => {
  if (/^image\/(jpeg|png|gif|bmp|webp|avif|tiff|svg|xml|webp|icon)$/.test(file.type)) {
    const type = file.type;
    isDisabled.value = false;
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (e) => {
      if (e.target) {
        const contents = e.target.result;
        if (typeof contents === 'string') {
          const bContents = base64.encode(contents);
          resultTitleString.value = bContents;
          outputTextHTML.value = `data:${type};base64,${resultTitleString.value}`;
          outputTextCSS.value = `background-image:url('data:${type};base64,${resultTitleString.value}')`;
        }
      }
    };
  } else {
    isDisabled.value = true;
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (e) => {
      if (e.target) {
        const contents = e.target.result;
        if (typeof contents === 'string') {
          const bContents = base64.encode(contents);
          resultTitleString.value = bContents;
        }
      }
    };
  }
  return false;
};
</script>

<style scoped lang="less">
.base64file-output {
  margin-top: 8px;
}
@media (max-width: 767px) {
  .base64file-output span {
    font-size: 16px;
  }
  .base64file-output pre {
    font-size: 12px;
  }
}
</style>
