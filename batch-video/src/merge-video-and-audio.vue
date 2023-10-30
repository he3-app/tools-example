<template>
  <VideoComponents @upload='uploadFile' @remove='remove' :loading='loading'>
    <h3>{{ t('mergeVideoAndAudio.button') }}</h3>
    <h-card-box :text="t('mergeVideoAndAudio.button')">
      <div class='itemOption'>
      <span>{{ t('mergeVideoAndAudio.upload') }}</span>
      <a-upload v-if="audioList.length === 0" v-model:file-list="audioList" list-type="picture-card" 
      accept=".mp3,.acc,.wav,.flac,.ogg,.wma,.m4a,.dts,.amr,.aifc,.caf,.gsm,.kar,.m3u,.mid,.midi,.mp2,.mpa,.pls,.ra,.rm,.s3m,.sid,.snd,.tta,.voc,.wv,.xm"
        :multiple="false" :maxCount="1"
        :before-upload="handleAudioUpload" >
        <div v-if="audioList.length === 0">
          <div style="margin-top: 4px">Upload</div>
        </div>
      </a-upload>
      <div v-else style="display: flex; align-items: center; justify-content: center">
        <audio :src="audioUrl" controls style="width: 240px; height: 40px" />
        <svg t="1685940701350" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
          p-id="3996" width="30" height="30" :style="{ fill: isSvgHovered ? 'red' : '#000000' }" @click="toggleSvgClicked"
          @mouseenter="handleSvgMouseEnter" @mouseleave="handleSvgMouseLeave">
          <path
            d="M202.666667 256h-42.666667a32 32 0 0 1 0-64h704a32 32 0 0 1 0 64H266.666667v565.333333a53.333333 53.333333 0 0 0 53.333333 53.333334h384a53.333333 53.333333 0 0 0 53.333333-53.333334V352a32 32 0 0 1 64 0v469.333333c0 64.8-52.533333 117.333333-117.333333 117.333334H320c-64.8 0-117.333333-52.533333-117.333333-117.333334V256z m224-106.666667a32 32 0 0 1 0-64h170.666666a32 32 0 0 1 0 64H426.666667z m-32 288a32 32 0 0 1 64 0v256a32 32 0 0 1-64 0V437.333333z m170.666666 0a32 32 0 0 1 64 0v256a32 32 0 0 1-64 0V437.333333z"
            fill="#000000" p-id="3997" />
        </svg>
      </div>

      <h3>{{ t('mergeVideoAndAudio.cut') }}</h3>
      <span>{{ t('mergeVideoAndAudio.startTime') }}</span>
      <a-form>
        <a-form-item>
          <a-space>
            <h-input v-model:value="startVolumeTime" :save-options="{ autoSave: true, key: 'duration' }" auto-select
              autofocus placeholder="HH:MM:SS eg: 00:00:00" addon-after="HH:MM:SS" style="width: 200px"
              :style="{ color: startVolumeTime.charAt(0) === '-' ? 'red' : '' }" @change="handleInputChange" />
          </a-space>
        </a-form-item>
      </a-form>
      <span>{{ t('mergeVideoAndAudio.endStart') }}</span>
      <a-form>
        <a-form-item>
          <a-space>
            <h-input v-model:value="endVolumeTime" auto-select autofocus placeholder="HH:MM:SS eg: 00:00:00"
              addon-after="HH:MM:SS" style="width: 200px" @change="handleInputChange" />
          </a-space>
        </a-form-item>
      </a-form>
      <span>{{ t('mergeVideoAndAudio.trackVolume') }}</span>
      <a-slider v-model:value="volume" :min="1" :max="100" :step="1" :tooltip-visible="true" />
      <div v-if="audioProcessing" class="processing-container">
        <span class="processing-text">{{ t('mergeVideoAndAudio.processing') }}</span>
        <a-button type="primary" shape="circle" loading class="processing-button" />
      </div>
      </div>
    </h-card-box>
    <div class='options'>
      <div class='contentOption'>
        <a-button type='primary' @click="mergeVideoAndAudio">
          <template #icon>
            <swap-outlined />
          </template>
          {{ t('mergeVideoAndAudio.title') }}
        </a-button>
      </div>
    </div>
    <div class='video' v-if='videoFlag'>
      <video :src='result.url' controls class='videoFile'></video>
      <a-button type='primary' @click='handleDownload' v-if='saveFlag'>
        <template #icon>
          <download-outlined />
        </template>
        {{ t('download') }}
      </a-button>
    </div>
  </VideoComponents>
</template>


<script setup lang="ts">
import { onMounted, ref, reactive, watch } from 'vue';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import debounce from 'lodash/debounce';
import VideoComponents from './UploadVideoComponents.vue';
import { useI18n } from 'vue-i18n';
const saveFlag = ref(false);//是否显示保存按钮
const videoFlag = ref(false);
import messages from './lang/lang.json';
import { DownloadOutlined, SwapOutlined } from '@ant-design/icons-vue';
const { t } = useI18n({
  locale: window.$he3.lang,
  messages,
});
const progress = ref(0)
const mergeStatus = ref(true);
const videoDuration = ref(0);
const ffmpeg = createFFmpeg({ log: true });
const isSvgHovered = ref(false);
const startVolumeTime = ref('00:00:00');
const downloadStatus = ref(true);
const endVolumeTime = ref('00:00:00');
const audio = ref(null);
const audioUrl = ref(null);
const audioList = ref([]);
const volume = ref(50);
const video = ref(null);
const audioDuration = ref(0);
const uploadFile = (file) => {
  video.value = file;
};
const remove = () => {
  saveFlag.value = false;
  loading.value = false;
  videoFlag.value = false;
  toggleSvgClicked();
};
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
const MAX_VIDEO_SIZE = 100 * 1024 * 1024;
const isSvgClicked = ref(false);
const loading = ref(false);
const audioProcessing = ref(false);
const processedAudio = ref(null);
//处理音频
const processAudio = async (file) => {
  mergeStatus.value = true;
  audioProcessing.value = true;
  const { name } = file;
  ffmpeg.FS('writeFile', name, await fetchFile(file));
  await ffmpeg.run(
    '-i',
    name,
    '-ss',
    `${startVolumeTime.value}`, // 起始时间（例如：从第10秒开始）
    '-t',
    `${endVolumeTime.value}`,
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
  audioProcessing.value = false;
  mergeStatus.value = false;
  processedAudio.value = ffmpeg.FS('readFile', 'output.mp4');
};

// 合并音频和视频
const mergeVideoAndAudio = async () => {
  if(audioList.value.length === 0)  return window.$he3.message.warn(t('extractAudioFromVideo.warnings'));
  loading.value = true;
  const { name } = video.value;
  ffmpeg.FS('writeFile', 'input_audio.mp3', processedAudio.value);
  ffmpeg.FS('writeFile', name, await fetchFile(video.value));
  await ffmpeg.run(
    '-i',
    name,
    '-i',
    'input_audio.mp3',
    '-c:v',
    'copy',
    '-c:a',
    'aac',
    '-map',
    '0:v:0',
    '-map',
    '1:a:0',
    '-shortest',
    'output.mp4'
  );

  // 读取输出文件
  const data = ffmpeg.FS('readFile', 'output.mp4');
  // 创建 URL
  const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
  window.$he3.message.success(t('success'))
  result.url = url;
  loading.value = false;
  mergeStatus.value = true;
  downloadStatus.value = false;
  saveFlag.value = true;
  videoFlag.value = true;
};
const upload = (file) => {
  audio.value = file
  audioUrl.value = URL.createObjectURL(file)
}

const handleSvgMouseEnter = () => {
  isSvgHovered.value = true;
};

const handleSvgMouseLeave = () => {
  isSvgHovered.value = false;
};
const toggleSvgClicked = () => {
  isSvgClicked.value = !isSvgClicked.value;
  audioProcessing.value = false;
  mergeStatus.value = true;
  downloadStatus.value = true;
  startVolumeTime.value = '00:00:00';
  endVolumeTime.value = '00:00:00';
  if (isSvgClicked.value) {
    // 清空音频信息
    audio.value = null;
    audioUrl.value = null;
    audioList.value = [];
  }
};
const handleInputChange = (value) => { };
const handleVideoDuration = (duration) => {
  // 在这里获取到视频时长的值
  videoDuration.value = Math.floor(duration);
};

const handleAudioUpload = (file) => {
  if (file.size > MAX_VIDEO_SIZE) {
    window.$he3.message.error('The video size exceeds the maximum allowed size.');
    return false; // 阻止上传
  }

  // 创建一个新的 Audio 对象
  const audioElement = new Audio();

  // 监听音频加载完成事件
  audioElement.addEventListener('loadedmetadata', () => {
    // 获取音频时长

    const duration = audioElement.duration;
    audioDuration.value = duration;
    const seconds = Math.floor(duration);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    // 将小时、分钟和秒钟转换为两位数形式
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    // 拼接成最终的时间格式
    endVolumeTime.value = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    // 上传文件
    upload(file)
  });

  // 设置音频源
  audioElement.src = URL.createObjectURL(file);
};

function timeToSeconds(timeString) {
  const [hours, minutes, seconds] = timeString.split(':');
  const totalSeconds =
    Number.parseInt(hours, 10) * 3600 +
    Number.parseInt(minutes, 10) * 60 +
    Number.parseInt(seconds, 10);
  return totalSeconds;
}
function validateTimeFormat(time) {
  const regex = /^([0-9]{2}):([0-9]{2}):([0-9]{2})$/;
  return regex.test(time);
}

// 监听音量变化
watch([startVolumeTime, endVolumeTime, volume], ([start, end, vol]) => {
  downloadStatus.value = true;
  // 执行相应的处理逻辑
  if ((start && start.charAt(0) === '-') || (end && end.charAt(0) === '-')) {
    window.$he3.message.warn(t('symbolSpecification'));
    downloadStatus.value = true;
    return false;
  }
  if (!validateTimeFormat(start) || !validateTimeFormat(end)) {
    window.$he3.message.warn(t('specification'));
    downloadStatus.value = true;
    return false;
  }

  const startTime = timeToSeconds(start);
  const endTime = timeToSeconds(end);

  if (startTime > endTime) {
    window.$he3.message.warn(t('start'));
    downloadStatus.value = true;
    return false;
  }
  if (endTime > audioDuration.value) {
    window.$he3.message.warn(t('maximumLimit'));
    downloadStatus.value = true;
    return false;
  }
  if (audio.value) {
    debouncedConvertFunction(audio.value);
  } else {
    window.$he3.message.warn(t('mergeVideoAndAudio.upload'));
    return false;
  }
  if (Number.parseInt(start) - Number.parseInt(end) > videoDuration.value) {
    downloadStatus.value = true;
    window.$he3.message.warn(t('cutOff'));
  }

  if (Number.parseInt(endTime) - Number.parseInt(startTime) < videoDuration.value) {
    downloadStatus.value = true;
    window.$he3.message.warn(t('AudioLengthLessThanVideo'));
  }
});

// 防抖函数，延迟500毫秒后执行函数
const debouncedConvertFunction = debounce(processAudio, 500);
</script>
<style scoped lang="less">
.itemOption {
  margin: 15px 0 23px;
  min-height: 54px;
  min-width: 250px;
  width: 30%;

  .format-wrap {
    display: flex;
    align-items: center;
    margin-bottom: 6px;

    .icon {
      padding-left: 6px;
    }
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
    margin-bottom: 10px;
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
