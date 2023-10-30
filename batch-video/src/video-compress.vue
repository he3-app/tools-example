<template>
  <!-- <div class="text-center">
    <h3>{{ t('videoCompress.title') }}</h3>
  </div> -->
  <VideoComponents @upload="upload" :result="result" :clear-data="clearData" :load="loading">
    <div>
      <div class="text-center">
        <h3>{{ t('videoInformation') }}</h3>
      </div>
      <div style="padding: 10px">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-card :title="t('video.name')" :bordered="false">
              <p>{{ result.videoName }}</p>
            </a-card>
          </a-col>
          <a-col :span="12">
            <a-card :title="t('video.size')" :bordered="false">
              <p>{{ result.originalFileSize }}</p>
            </a-card>
          </a-col>
        </a-row>
      </div>
      <div class="text-center">
        <h3>{{ t('videoCompress.compressionSettings') }}</h3>
      </div>
      <div class="select-container">
        <span class="select-label">{{ t('videoCompress.compressedQuality') }}:</span>
        <a-select v-model:value="compressedQuality" @change="">
          <a-select-option value="100">(100%) Original Quality</a-select-option>
          <a-select-option value="80">(80%) Extremely High</a-select-option>
          <a-select-option value="70">(70%) High</a-select-option>
          <a-select-option value="50">(50%) Medium</a-select-option>
          <a-select-option value="40">(40%) Medium-low</a-select-option>
          <a-select-option value="30">(30%) Low</a-select-option>
          <a-select-option value="10">(10%) Extremely Low</a-select-option>
        </a-select>
      </div>

      <div class="select-container">
        <span class="select-label">{{ t('videoCompress.resolution') }}:</span>
        <a-select v-model:value="resolution" @change="">
          <a-select-option value="Original Resolution">Original Resolution</a-select-option>
          <a-select-option value="360p">360p</a-select-option>
          <a-select-option value="480p">480p</a-select-option>
          <a-select-option value="720p">720p</a-select-option>
          <a-select-option value="1080p">1080p</a-select-option>
        </a-select>
      </div>
      <div class="select-container">
        <span class="select-label">{{ t('videoCompress.bitrate') }}:</span>
        <a-tag color="default" style="padding: 5px;font-size: 16px;">{{ bitrateMapping[compressedQuality] + 'Mbit/s' }}
        </a-tag>
      </div>

    </div>
    <div class="tab">
      <div v-if="result">
        <div class="text-center">
          <h3><span>{{ t('videoCompress.compressedinformation') }}</span></h3>
        </div>
        <div style="padding: 10px">
          <a-row :gutter="16">
            <a-col :span="12">
              <a-card :title="t('video.size')" :bordered="false">
                <p>{{ result.compressedFileSize }}</p>
              </a-card>
            </a-col>
            <a-col :span="12">
              <a-card :title="t('videoCompress.ratio')" :bordered="false">
                <p>{{ result.compressionRatio }}</p>
              </a-card>
            </a-col>
          </a-row>
        </div>
      </div>
      <a-button type="primary" :loading="loading" @click="startCompression">
        <span>{{ loading ? t('videoCompress.compression') : t('videoCompress.startCompression') }}</span>
      </a-button>
      <a-progress :percent="progress" v-if="loading" :stroke-color="'#6c00b4'" style="margin-top: 20px;"></a-progress>
      <a-button type="primary" @click="handleDownload" :disabled="disable" class="download">
        {{ t('download') }}
      </a-button>
    </div>
  </VideoComponents>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue';
import VideoComponents from './UploadVideoComponents.vue';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import { useI18n } from 'vue-i18n';
import messages from './lang/lang.json';
const { t } = useI18n({
  locale: window.$he3.lang,
  messages,
});
const progress = ref(0)
const disable = ref(true)
const compressedQualitymapping = {
  100: 18.41112,
  80: 20,
  70: 23,
  50: 28,
  40: 30,
  30: 32,
  10: 50,
}
const resolutionmapping = {
  'Original Resolution': 'iw:ih',
  '360p': '640x360',
  '480p': '854x480',
  '720p': '1280x720',
  '1080p': '1920x1080'
}
const result = reactive({
  url: '',
  type: 'video',
  originalFileSize: 0,
  compressedFileSize: 0,
  compressionRatio: 0,
  videoName: ''
});
const conversionFunction = (disvalue: any) => {
  let result = disvalue
  if (disvalue >= 1024 * 1024 * 1024) {
    result = `${(disvalue / (1024 * 1024 * 1024)).toFixed(2)}GB`;
  } else if (disvalue >= 1024 * 1024) {
    result = `${(disvalue / (1024 * 1024)).toFixed(2)}MB`;
  } else {
    result = `${(disvalue / 1024).toFixed(2)}KB`;
  }
  return result
}
const ffmpeg = createFFmpeg({ log: true });
const resolution = ref('Original Resolution')
const compressedQuality = ref('70')
const video = ref(null);
const upload = (file) => {
  video.value = file;
  const originalFileSize = file.size;
  let originalFileSizeString = conversionFunction(originalFileSize);
  result.originalFileSize = originalFileSizeString;
  const { name } = file;
  result.videoName = name
};
const clearData = () => {
  video.value = null
  result.url = ''
  disable.value = true
  result.originalFileSize = 0
  result.compressionRatio = 0
  result.compressedFileSize = 0
  result.videoName = ''
}
onMounted(async () => {
  await ffmpeg.load();
  console.log('done');
});
const bitrateMapping = {
  100: 4.61,
  80: 3.69,
  70: 3.23,
  50: 2.31,
  40: 1.84,
  30: 1.38,
  10: 0.461,
};
const handleDownload = () => {
  if (loading.value) {
    window.$he3.message.warn(t('videoCompress.wait'))
  }
  const link = document.createElement('a');
  link.href = result.url;
  link.download = 'output.mp4';

  // 触发下载
  link.click();
};
const loading = ref(false);
const startCompression = async () => {
  result.compressedFileSize = 0
  result.compressionRatio = 0
  disable.value = true
  loading.value = true;
  const originalFileSize = video.value.size;
  // 获取原始文件大小
  const { name } = video.value
  ffmpeg.setProgress(({ ratio }) => {
    // 计算当前进度百分比
    const currentProgress = Math.round(ratio * 100)
    console.log(`Conversion progress: ${currentProgress}%`)
    // 更新进度条
    progress.value = currentProgress
  })
  ffmpeg.FS('writeFile', name, await fetchFile(video.value));
  const crfValue = compressedQualitymapping[compressedQuality.value];
  const resolutionValue = resolutionmapping[resolution.value];
  const bitrateValue = bitrateMapping[compressedQuality.value];
  // Run the FFMpeg command for video compression
  await ffmpeg.run(
    '-i',
    name,
    '-vf',
    `scale=${resolutionValue}`,
    '-c:v',
    'libx264',
    '-b:v',
    `${bitrateValue}M`,
    '-maxrate',
    `${bitrateValue}M`,
    '-bufsize',
    `${Math.floor(bitrateValue / 2)}M`,
    '-crf',
    `${crfValue}`,
    '-preset',
    'fast',
    'output.mp4'
  );


  // 获取压缩后的文件大小
  const compressedData = ffmpeg.FS('readFile', 'output.mp4');
  const compressedFileSize = compressedData.buffer.byteLength;
  let compressedFileSizeString = conversionFunction(compressedFileSize)
  result.compressedFileSize = compressedFileSizeString;

  // 计算压缩比率
  const compressionRatio = Math.round((compressedFileSize / originalFileSize) * 100) + '%';
  result.compressionRatio = compressionRatio;

  // Read the result
  const data = ffmpeg.FS('readFile', 'output.mp4');

  // Create a URL
  const url = URL.createObjectURL(new Blob([data.buffer], { type: 'image/mp4' }));
  window.$he3.message.success(t('success'));
  result.url = url
  loading.value = false;
  disable.value = false
}

</script>

<style scoped lang="less">
.text-center {
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

.select-container {
  margin-top: 10px;
}

.select-label {
  margin-right: 10px;
}

a-select {
  width: 200px;
}
</style>
