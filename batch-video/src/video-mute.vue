<template>
 <!--  <div class="text-center">
    <h3>{{ t('videoMute.title') }}</h3>
  </div> -->
  <VideoComponents @upload="upload" :result="result" :clear-data="clearData" :load="loading">
    <div class="tab">
      <a-button type="primary" :disabled="disable" @click="handleDownload" class="download" size="large">
        {{ t('download') }}
      </a-button>
      <a-button type="primary" :loading="loading" @click="startFunction" class="download" size="large">
        <swap-outlined/>
        <span>
          {{ loading == true ? t('videoMute.processing') : t('videoMute.start') }}
        </span>
      </a-button>
    </div>
    <a-progress :percent="progress" v-if="loading" :stroke-color="'#6c00b4'" style="margin-top: 20px;"></a-progress>
  </VideoComponents>
</template>

<script setup lang="ts">
import { SwapOutlined } from '@ant-design/icons-vue';
import { onMounted, ref, reactive, watch } from 'vue';
import VideoComponents from './UploadVideoComponents.vue';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import { useI18n } from 'vue-i18n';
import messages from './lang/lang.json';
const { t } = useI18n({
  locale: window.$he3.lang,
  messages,
});
const disable = ref(true)
const ffmpeg = createFFmpeg({ log: true });
const clearData = () => {
  video.value = null
  result.url = null
}
const video = ref(null);
const upload = (file) => {
  video.value = file;
};
const progress = ref(0)
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

const loading = ref(false);

//gif to video
const startFunction = async () => {
  loading.value = true;
  disable.value = true
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
  await ffmpeg.run('-i', name, '-c:v', 'copy', '-an', 'output.mp4');
  // Read the result
  const data = ffmpeg.FS('readFile', 'output.mp4');

  // Create a URL
  const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
  result.url = url;
  loading.value = false;
  window.$he3.message.success(t('success'));
  disable.value = false
};
</script>
<style scoped lang="less">
.tab{
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  .download{
    margin-right: 20px;
  }
}
//.tab {
//  padding-top: 20px;
//  display: flex;
//  flex-direction: column;
//}
//
//.download {
//  margin-top: 20px;
//}
//
//.text-center {
//  display: flex;
//  margin-top: 10px;
//  justify-content: center;
//}
</style>
