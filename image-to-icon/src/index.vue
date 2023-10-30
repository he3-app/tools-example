<template>
    <h-single-layout :width="800">
      <h-horizontal-layout mode="right" :width="250">
        <template #left>
          <h-image-picker @pick="beforeUpload" />
        </template>
        <template #right>
          <div>
            <a-tree v-model:checkedKeys="IconMap.iPhone" checkable :tree-data="iPhoneIconSize" />
            <a-tree v-model:checkedKeys="IconMap.iPad" checkable :tree-data="iPadIconSize" />
            <a-tree v-model:checkedKeys="IconMap.macOS" checkable :tree-data="macOSIconSize" />
            <a-tree v-model:checkedKeys="IconMap.watchOS" checkable :tree-data="watchOSIconSize" />
            <a-tree v-model:checkedKeys="IconMap.Android" checkable :tree-data="androidIconSize" />
            <br />
            <a-input v-model:value="fileName" :placeholder="t('inputFileName')" />
            <a-button type="primary" style="margin-top: 20px" :loading="loading" @click="handleDownload">
              {{ t('transform') }}
            </a-button>
          </div>
        </template>
      </h-horizontal-layout>
    </h-single-layout>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import JSZip from 'jszip';
import { useI18n } from 'vue-i18n';
import { imgTool } from './imageToIcon';
import {
  androidIconSize,
  iPadIconSize,
  iPhoneIconSize,
  macOSIconSize,
  watchOSIconSize,
} from './IconData';
import messages from './lang.json';
import type { Shape } from './imageToIcon';
import type { ImageFile } from './type';
const { t } = useI18n({
  locale: window.$he3.lang,
  messages,
});
const isElectron = navigator.userAgent.toLowerCase().includes('electron');
// #region 图片列表
const fileName = ref('');
const imageUrl = ref('');
const loading = ref(false);
enum ImageModel {
  iPhone,
  iPad,
  macOS,
  watchOS,
  Android,
}
const IconMap = reactive<Record<keyof typeof ImageModel, number[]>>({
  iPhone: [],
  iPad: [],
  macOS: [],
  watchOS: [],
  Android: [],
});

const beforeUpload = (file: ImageFile) => {
  if (isElectron) {
    imageUrl.value = `file://${file.path}`;
  } else {
    const urlPath = URL.createObjectURL(file)
    imageUrl.value = urlPath;
  }
  return false;
};

const handleDownload = async () => {
  if (!imageUrl.value) {
    window.$he3.message.warn(t('imageChoose'));
    return;
  }
  const isNullMap = Object.values(IconMap).some((item) => item.length);
  if (!isNullMap) {
    window.$he3.message.warn(t('chooseDevice'));
    return;
  }
  loading.value = true;
  const zip = new JSZip();
  for (const key in IconMap) {
    if (!IconMap[key].length) continue;
    zip.folder(key);
    for (const size of IconMap[key]) {
      if (typeof size === 'string') continue;
      const param = {
        source: imageUrl.value,
        size,
        shape: 'square' as Shape,
        bleed: false,
      };
      const blob = await imgTool.convert(param);
      zip
        .folder(key)
        ?.file(`${fileName.value ? fileName.value : 'icon'}-${size}x${size}.png`, blob);
    }
  }
  zip
    .generateAsync({
      type: 'blob',
    })
    .then((content) => {
      const url = URL.createObjectURL(content);
      window.$he3.downloadByUrl(url);
    });
  loading.value = false;
};
</script>

<style lang="less" scoped>
.item {
  margin: 10px 0;
}
</style>
