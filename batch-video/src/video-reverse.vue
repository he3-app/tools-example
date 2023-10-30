<template>
  <VideoComponents @upload="upload" :result="result" :clear-data="clearData" :load="loading">
    <div class="tab">
      <a-button type="primary" :loading="loading" @click="convertFunction" class="download">
        {{ loading == true ? t('videoReverse.convert') : t('videoReverse.start') }}
      </a-button>
      <a-progress :percent="progress" v-if="loading" :stroke-color="'#6c00b4'" style="margin-top: 20px;"></a-progress>
      <a-button type="primary" @click="handleDownload" :disabled="disable" class="download">
        {{ t('download') }}
      </a-button>
    </div>
  </VideoComponents>
</template>
<script setup lang="ts">
import { onMounted, ref, reactive, watch } from 'vue';
import VideoComponents from './UploadVideoComponents.vue';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import { useI18n } from 'vue-i18n';
import messages from './lang/lang.json';
const { t } = useI18n({
  locale: window.$he3.lang,
  messages,
});
const progress = ref(null)
const ffmpeg = createFFmpeg({ log: true });
const disable = ref(true)
const video = ref(null);
const upload = (file) => {
  video.value = file;
};

onMounted(async () => {
  await ffmpeg.load();
  console.log('done');
});
const clearData = () => {
  video.value = null
  result.url = null
}
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

const loading = ref(false);

//gif to video
const convertFunction = async () => {
  disable.value = true
  loading.value = true;
  const { name } = video.value;
  ffmpeg.setProgress(({ ratio }) => {
    // 计算当前进度百分比
    const currentProgress = Math.round(ratio * 100)
    console.log(`Conversion progress: ${currentProgress}%`)
    // 更新进度条
    progress.value = currentProgress
  })
  ffmpeg.FS('writeFile', name, await fetchFile(video.value));
  // Run the FFMpeg command
  await ffmpeg.run(
    '-i',
    name,
    '-vf',
    'reverse',
    '-af',
    'areverse',
    '-preset',
    'fast',
    'output.mp4'
  );
  // Read the result
  const data = ffmpeg.FS('readFile', 'output.mp4');

  // Create a URL
  const url = URL.createObjectURL(new Blob([data.buffer], { type: 'image/mp4' }));
  result.url = url;
  loading.value = false;
  window.$he3.message.success(t('success'));
  disable.value = false
};
</script>
<style scoped lang="less">
.text-content {
  display: flex;
  margin-top: 10px;
  justify-content: center;
}

.tab {
  padding-top: 20px;
  display: flex;
  flex-direction: column;
}

.download {
  margin-top: 20px;
}
</style>
