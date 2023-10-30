<template>
  <VideoComponents @upload="upload" :result="result" :load="loading">
    <h-card-box text='Setting'>
      <div class='itemOption'>
        <span class="title">{{ t('changeVideoVolume.title') }}</span>
      <a-slider v-model:value="volume" :min="0" :max="100" :step="1" :tooltipVisible="true" />
      </div>
    </h-card-box>
    <div class='options'>
      <div class='contentOption'>
      <a-button type="primary" @click="convertFunction">
        <template #icon>
          <swap-outlined/>
        </template>
        {{  t('changeVideoVolume.start') }}
      </a-button>
      </div>
    </div>
      <div class="video" v-if="videoFlag">
        <video :src="result.url" controls class="videoFile"></video>
        <a-button type="primary" @click="handleDownload" v-if="saveFlag">
          <template #icon>
            <download-outlined/>
          </template>
          {{ t('download') }}
        </a-button>
      </div>
  </VideoComponents>
</template>


<script setup lang="ts">
import { onMounted, ref, reactive, watch } from 'vue';
import debounce from 'lodash/debounce';
import VideoComponents from './UploadVideoComponents.vue';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import { useI18n } from 'vue-i18n';
import messages from './lang/lang.json';
import {DownloadOutlined, SwapOutlined} from "@ant-design/icons-vue";
const { t } = useI18n({
  locale: window.$he3.lang,
  messages,
});
const ffmpeg = createFFmpeg({ log: true });
const volume = ref(100);
const video = ref(null);
const saveFlag = ref(false);//是否显示保存按钮
const videoFlag = ref(false)
const upload = (file) => {
  video.value = file;
};
const remove = () => {
  saveFlag.value = false;
  loading.value = false;
  videoFlag.value = false
}
onMounted(async () => {
  await ffmpeg.load();
  console.log('done');
});

const handleDownload = () => {
  const link = document.createElement('a');
  link.href = result.url;
  link.download = 'output.mp4';

  // 触发下载
  link.click();
};
const result = reactive({
  url: '',
  type: 'video',
});
// eslint-disable-next-line @typescript-eslint/no-unused-vars

const loading = ref(false);

//gif to video
const convertFunction = async () => {
  loading.value = true;
  const { name } = video.value;
  ffmpeg.FS('writeFile', name, await fetchFile(video.value));
  // Run the FFMpeg command
  await ffmpeg.run(
    '-i',
    name,
    '-af',
    `volume = ${(volume.value / 100) * 2}`,
    '-c:v',
    'copy',
    '-c:a',
    'aac',
    '-b:a',
    '192k',
    'output.mp4'
  );
  // Read the result
  const data = ffmpeg.FS('readFile', 'output.mp4');
  // Create a URL
  const url = URL.createObjectURL(new Blob([data.buffer], { type: 'image/mp4' }));
  window.$he3.message.success(t('success'));
  result.url = url;
  loading.value = false;
  saveFlag.value = true;
  videoFlag.value = true;
};
// 防抖函数，延迟500毫秒后执行函数
</script>
<style scoped lang="less">
.itemOption {
  margin: 15px 0 23px;
  min-height: 54px;
  min-width: 250px;
  width: 35%;

  .title {
    margin-bottom: 6px;
  }
}

.itemOption:nth-last-child(2) {
  margin-bottom: 35px;
}

.options {
  width: 100%;

  .contentOption {
    display: flex;
    justify-content: flex-end;
    flex-wrap: wrap;
  }

  :deep(.ant-btn) {
    margin-left: 2%;
    padding: 12px 24px 35px;
    font-size: 16px;
    line-height: 150%;
    letter-spacing: 0.2px;
  }
}

.video {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 696px;
  width: 100%;
  margin-top: 60px;
  padding-bottom: 10px;

  .videoFile {
    width: 100%; /* 设置宽度为100%，占据父容器的宽度 */
    height: auto; /* 根据宽度自适应高度 */
    max-height: 464px;
    border-radius: 12px;
    background: linear-gradient(357deg, #000 -21.67%, rgba(0, 0, 0, 0.00) 22.11%);
  }

  :deep(.ant-btn) {
    padding: 12px 24px 35px;
    font-size: 16px;
    line-height: 150%;
    letter-spacing: 0.2px;
    margin-top: 32px;
  }
}
</style>
