<template>
  <VideoComponents @upload='upload' :result='result' :clear-data='clearData' :load='loading'>
    <div class='tab'>
      <a-button type='primary' @click='handleDownload' class='download' v-if='!disable' size='large'>
        {{ t('download') }}
      </a-button>
      <a-button type='primary' :loading='loading' @click='startFunction' class='download' size='large'>
        <template #icon>
          <swap-outlined />
        </template>
        {{ loading ? t('videoToGifConvert.convert') : t('videoToGifConvert.start') }}
      </a-button>
    </div>
    <a-progress
      :percent='progress'
      v-if='loading'
      :stroke-color="'#6c00b4'"
      style='margin-top: 20px'
    ></a-progress>
  </VideoComponents>
</template>
<script setup lang='ts'>
import { SwapOutlined } from '@ant-design/icons-vue';
import { onMounted, ref, reactive } from 'vue';
import VideoComponents from './UploadVideoComponents.vue';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import { useI18n } from 'vue-i18n';

const disable = ref(true);
import messages from './lang/lang.json';

const { t } = useI18n({
  locale: window.$he3.lang,
  messages,
});
const progress = ref(0);
const ffmpeg = createFFmpeg({ log: true });
const video = ref(null);
const upload = (file) => {
  video.value = file;
};
const clearData = () => {
  video.value = null;
  result.url = null;
};
onMounted(async () => {
  await ffmpeg.load();
});

const handleDownload = () => {
  const link = document.createElement('a');
  link.href = result.url;
  link.download = 'output.gif';
  // 触发下载
  link.click();
};
const result = reactive({
  url: '',
  type: 'img',
});

const loading = ref(false);
const startFunction = async () => {
  loading.value = true;
  disable.value = true;
  ffmpeg.setProgress(({ ratio }) => {
    // 计算当前进度百分比
    const currentProgress = Math.round(ratio * 100);
    // 更新进度条
    console.log(currentProgress);
    progress.value = currentProgress;
  });
  ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(video.value));
  // Run the FFMpeg command
  await ffmpeg.run('-i', 'test.mp4', '-f', 'gif', '-qscale', '0', 'out.gif');
  // Read the result
  const data = ffmpeg.FS('readFile', 'out.gif');
  // Create a URL
  const url = URL.createObjectURL(new Blob([data.buffer], { type: 'image/gif' }));
  result.url = url;
  window.$he3.message.success(t('success'));
  loading.value = false;
  disable.value = false;
};
</script>
<style scoped lang='less'>

.tab {
  width: 100%;
  padding-top: 20px;
  display: flex;
  justify-content: flex-end;
  .download {
    margin-left: 20px;
  }
}

</style>
