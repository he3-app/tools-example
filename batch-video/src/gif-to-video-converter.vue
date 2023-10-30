<template>
  <VideoComponents @upload='upload' @remove='remove' :loading='loading'>
    <div class='options'>
      <div class='contentOption'>
        <a-button type="primary"  @click='startFunction'>
          <template #icon>
            <swap-outlined/>
          </template>
          {{ t('gifToVideoConvert.start') }}
        </a-button>
      </div>
    </div>
    <div class="video" v-if="videoFlag">
      <video :src='result.url' controls></video>
      <a-button type="primary" @click="handleDownload" v-if="saveFlag">
        <template #icon>
          <download-outlined/>
        </template>
        {{ t('download') }}
      </a-button>
    </div>
  </VideoComponents>
</template>

<script setup lang='ts'>
import { onMounted, ref, reactive, toRef } from 'vue';
import VideoComponents from './UploadVideoComponents.vue';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import { useI18n } from 'vue-i18n';
import messages from './lang/lang.json';
import { DownloadOutlined, SwapOutlined } from '@ant-design/icons-vue';
const saveFlag = ref(false);//是否显示保存按钮
const videoFlag = ref(false)
const { t } = useI18n({
  locale: window.$he3.lang,
  messages,
});
const ffmpeg = createFFmpeg({ log: true });
const video = ref(null);
onMounted(async () => {
  await ffmpeg.load();
});
const upload = (file) => {
  video.value = file;
};
const remove = () => {
  saveFlag.value = false;
  loading.value = false;
  videoFlag.value = false;
};
const handleDownload = () => {
  const link = document.createElement('a');
  link.href = result.url;
  link.download = 'output.mp4';

  // 触发下载
  link.click();
};
const result = reactive({
  url: '',
  type: 'gif',
});


const loading = ref(false);

//gif to video
const startFunction = async () => {
  loading.value = true;
  ffmpeg.FS('writeFile', 'randGif.gif', await fetchFile(video.value));

  // Run the FFMpeg command
  await ffmpeg.run('-i', 'randGif.gif', '-c:v', 'libx264', '-crf', '25', '-pix_fmt', 'yuv420p', 'output.mp4');

  const data = ffmpeg.FS('readFile', 'output.mp4');

  const url = URL.createObjectURL(new Blob([data.buffer], { type: 'image/mp4' }));
  result.url = url;
  loading.value = false;
  saveFlag.value = true;
  videoFlag.value = true;
  window.$he3.message.success(t('success'));
};


</script>
<style scoped lang='less'>
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
