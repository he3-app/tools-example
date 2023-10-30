<template>
  <VideoComponents @upload='upload' @remove="remove" :loading='loading'>
    <h-card-box text='Setting'>
      <div class='itemOption'>
        <span class="title">{{ t('videoConverter.videoSpeed') }}</span>
        <a-select ref="select" v-model:value="speed" style="width: 200px;margin-top: 10px;">
          <a-select-option value="0.25">0.25x</a-select-option>
          <a-select-option value="0.5">0.5x</a-select-option>
          <a-select-option value="0.75">0.75x</a-select-option>
          <a-select-option value="1.25">1.25x</a-select-option>
          <a-select-option value="1.5">1.5x</a-select-option>
          <a-select-option value="2">2x</a-select-option>
          <a-select-option value="2.25">2.25x</a-select-option>
          <a-select-option value="2.5">2.5x</a-select-option>
          <a-select-option value="2.75">2.75x</a-select-option>
          <a-select-option value="3">3x</a-select-option>
          <a-select-option value="3.25">3.25x</a-select-option>
          <a-select-option value="3.5">3.5x</a-select-option>
          <a-select-option value="3.75">3.75x</a-select-option>
          <a-select-option value="4">4x</a-select-option>
        </a-select>
      </div>
    </h-card-box>
    <div class='options'>
      <div class='contentOption'>
        <a-button type="primary" @click="startFunction">
          <template #icon>
            <swap-outlined/>
          </template>
          {{ t('changeVideoSpeed.start') }}
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
import {onMounted, ref, reactive, watch} from "vue";
import VideoComponents from './UploadVideoComponents.vue';
import {createFFmpeg, fetchFile} from '@ffmpeg/ffmpeg';
import {useI18n} from 'vue-i18n';
import messages from './lang/lang.json';
import {DownloadOutlined, SwapOutlined} from "@ant-design/icons-vue";

const {t} = useI18n({
  locale: window.$he3.lang,
  messages,
});
const ffmpeg = createFFmpeg({log: true})
const video = ref(null)
const saveFlag = ref(false);//是否显示保存按钮
const videoFlag = ref(false)
onMounted(async () => {
  await ffmpeg.load();
});
const upload = (file) => {
  video.value = file;
};
const remove = () => {
  saveFlag.value = false;
  loading.value = false;
  videoFlag.value = false
}
const handleDownload = () => {
  const link = document.createElement("a");
  link.href = result.url
  link.download = "output.mp4";
  // 触发下载
  link.click();
}
const result = reactive({
  url: '',
  type: 'video',
})

const speed = ref('1.25')
const loading = ref(false)
const startFunction = async () => {
  loading.value = true
  const {name} = video.value;
  ffmpeg.FS('writeFile', name, await fetchFile(video.value));
  // Run the FFMpeg command
  await ffmpeg.run('-i', name, '-filter:v', `setpts=${1 / speed.value}*PTS`, 'output.mp4');
  // Read the result
  const data = ffmpeg.FS('readFile', 'output.mp4');
  // Create a URL
  const url = URL.createObjectURL(new Blob([data.buffer], {type: 'image/mp4'}));
  window.$he3.message.success(t('success'));
  result.url = url
  loading.value = false
  saveFlag.value = true;
  videoFlag.value = true;
}
</script>
<style scoped lang="less">
.itemOption {
  margin: 15px 0 23px;
  min-height: 54px;
  min-width: 250px;
  width: 35%;

  .title {
    display: block;
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
  