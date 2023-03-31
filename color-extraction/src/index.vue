<template>
  <div class="color-extraction-wrapper">
    <h-horizontal-layout mode="right" :width="300">
      <template #left>
        <h-image-picker :pick="beforeUpload" :reset="reset" @load="onLoad" />
      </template>
      <template #right>
        <a-spin :spinning="colorExtractionSpin">
          <div v-if="!dominantColor && !palette" class="palette-wrap">
            <a-card>RGB</a-card>
            <a-card>RGB</a-card>
            <a-card>RGB</a-card>
            <a-card>RGB</a-card>
            <a-card>RGB</a-card>
          </div>
          <div v-else class="palette-wrap">
            <a-card v-if="dominantColor" hoverable size="small" :title="t('dominantColor')">
              <template #cover>
                <div
                  :style="{
                    backgroundColor: `rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`,
                    height: '100px',
                  }"
                />
              </template>
              <a-typography-text copyable style="display: inline-block">
                {{ `rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})` }}
              </a-typography-text>
            </a-card>

            <a-card
              v-if="palette && palette.length > 0"
              :title="t('palette')"
              size="small"
              class="palette"
            >
              <a-card v-for="(color, index) in palette" :key="index + uniqueId()" size="small">
                <template #cover>
                  <div
                    :style="{
                      backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
                      height: '100px',
                    }"
                  />
                </template>
                <a-typography-text copyable style="display: inline-block">
                  {{ `rgb(${color[0]}, ${color[1]}, ${color[2]})` }}
                </a-typography-text>
              </a-card>
            </a-card>
          </div>
        </a-spin>
      </template>
    </h-horizontal-layout>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import ColorThief from '@neutrixs/colorthief/dist/color-thief.mjs';
import { uniqueId } from 'lodash';
import messages from './lang.json';
const { t } = useI18n({
  locale: window.$he3.lang,
  messages,
});
const beforeUpload = async (file: File) => {
  colorExtractionSpin.value = true;
};

const colorThief = new ColorThief();
const dominantColor = ref<[number, number, number]>();
const palette = ref<[number, number, number][]>();
const colorExtractionSpin = ref(false);

const onLoad = (imgEle: HTMLImageElement) => {
  dominantColor.value = colorThief.getColor(imgEle);
  palette.value = colorThief.getPalette(imgEle, 8);
  colorExtractionSpin.value = false;
};

const reset = () => {
  dominantColor.value = undefined;
  palette.value = undefined;
  colorExtractionSpin.value = false;
};
</script>

<style scoped lang="less">
.color-extraction-wrapper {
  height: 100%;
  .palette-wrap {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-height: 100%;
    overflow-y: scroll;
  }

  .palette {
    & > :deep(.ant-card-body) {
      &::before {
        display: none;
      }
      padding: 6px;
      display: grid;
      gap: 5px;
      grid-template-columns: 1fr 1fr;

      .ant-card-body {
        padding: 6px;
      }
    }
  }
}
</style>
