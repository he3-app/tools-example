<template>
  <VideoComponents @upload='upload' @remove="remove" :loading='loading'>
    <h-card-box :text="t('videoConverter.selectTitle')">
      <div class="itemOption">
        <div class="format-wrap">
          <span>{{ t('videoConverter.format') }}</span>
          <a-tooltip>
            <template #title>
              {{ t('videoConverter.formatPromptText') }}
            </template>
            <h-icon icon="ant-design:question-circle-outlined" :size="16" class="icon"/>
          </a-tooltip>
        </div>

        <a-select
            :options="formatObj"
            @change="handleChangeFormat"
            ref="select"
            v-model:value="format"
            style="width: 200px"
        ></a-select>
      </div>
      <div class="itemOption">
        <div class="format-wrap">
          <span>{{ t('videoConverter.videoEncoder') }}</span>
        </div>
        <a-select
            :options="videoEncoderObj"
            @change="handleChangeEncoder"
            ref="select"
            v-model:value="videoEncoder"
            style="width: 200px"
        ></a-select>
      </div>
      <div class="itemOption">
        <div class="format-wrap">
          <span>{{ t('videoConverter.frameRate') }}</span>
        </div>
        <a-select
            :options="frameRateObj"
            @change="handleChangeFrameRate"
            ref="select"
            v-model:value="frameRate"
            style="width: 200px"
        ></a-select>
      </div>
      <div class="itemOption">
        <div class="format-wrap">
          <span>{{ t('videoConverter.videoSpeed') }}</span>
          <a-tooltip>
            <template #title>
              {{ t('videoConverter.speedPrompt') }}
            </template>
          </a-tooltip>
        </div>
        <a-select
            :options="speedObj"
            @change="handleChangespeed"
            ref="select"
            v-model:value="speed"
            style="width: 200px"
        ></a-select>
      </div>
      <div class="itemOption">
        <div class="format-wrap">
          <span>{{ t('videoConverter.resolution') }}</span>
        </div>
        <a-select
            :options="resolutionObj"
            @change="handleChangeresolution"
            ref="select"
            v-model:value="resolution"
            style="width: 200px"
        ></a-select>
      </div>
    </h-card-box>
    <div class='options'>
      <div class='contentOption'>
        <a-button type="primary"  @click="handleFormatChange">
          <template #icon>
            <swap-outlined/>
          </template>
          {{ t('videoConverter.start') }}
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
<script setup>
import {onMounted, ref, reactive} from 'vue';
import VideoComponents from './UploadVideoComponents.vue';
import {createFFmpeg, fetchFile} from '@ffmpeg/ffmpeg';
import {useI18n} from 'vue-i18n';
import messages from './lang/lang.json';
import {SwapOutlined, DownloadOutlined} from '@ant-design/icons-vue';

const {t} = useI18n({
  locale: window.$he3.lang,
  messages,
});
let formatObj = ref([
  {
    value: 'mp4',
    label: 'MP4',
  },
  {
    value: 'avi',
    label: 'AVI',
  },
  {
    value: 'mov',
    label: 'MOV',
  },
  {
    value: 'mpg',
    label: 'MPG',
  },
  {
    value: 'webm',
    label: 'WEBM',
  },
  {
    value: 'ts',
    label: 'Ts',
  },
  {
    value: '3g2',
    label: '3G2',
  },
  {
    value: '3gp',
    label: '3GP',
  },
  {
    value: 'asf',
    label: 'ASF',
  },
  {
    value: 'f4v',
    label: 'F4V',
  },
  {
    value: 'flv',
    label: 'FLV',
  },
  {
    value: 'm2ts',
    label: 'M2Ts',
  },
  {
    value: 'm2v',
    label: 'M2V',
  },
  {
    value: 'm4v',
    label: 'M4V',
  },
  {
    value: 'mkv',
    label: 'MKV',
  },
  {
    value: 'wmv',
    label: 'WMV',
  },
  {
    value: 'mts',
    label: 'MTS',
  },
  {
    value: 'mxf',
    label: 'MXF',
  },
  {
    value: 'ogv',
    label: 'OGV',
  },
  {
    value: 'rm',
    label: 'RM',
  },
  {
    value: 'rmvb',
    label: 'RMVB',
  },
  {
    value: 'vob',
    label: 'VOB',
  },
]);
let videoEncoderObj = ref([
  {
    value: 'libx264',
    label: 'AVC',
  },
  {
    value: 'mpeg4',
    label: 'DivX',
  }
]);
let frameRateObj = ref([
  {
    value: '23.976',
    label: '23.976',
  },
  {
    value: '24',
    label: '24',
  },
  {
    value: '25',
    label: '25',
  },
  {
    value: '30',
    label: '30',
  },
  {
    value: '48',
    label: '48',
  },
  {
    value: '50',
    label: '50',
  },
  {
    value: '59.94',
    label: '59.94',
  },
  {
    value: '60',
    label: '60',
  },
]);
let speedObj = ref([
  {
    value: '0.1',
    label: '10%',
  },
  {
    value: '0.25',
    label: '25%',
  },
  {
    value: '0.5',
    label: '50%',
  },
  {
    value: '0.75',
    label: '75%',
  },
  {
    value: '1',
    label: '100%',
  },
  {
    value: '1.5',
    label: '150%',
  },
  {
    value: '2',
    label: '200%',
  },
  {
    value: '2.5',
    label: '250%',
  },
  {
    value: '3',
    label: '300%',
  },
  {
    value: '5',
    label: '500%',
  },
]);
let resolutionObj = ref([
  {
    value: '640x360',
    label: '640x360',
  },
  {
    value: '640x480',
    label: '640x480',
  },
  {
    value: '720x480',
    label: '720x480',
  },
  {
    value: '854x480',
    label: '854x480',
  },
  {
    value: '720x570',
    label: '720x570',
  },
  {
    value: '1280x720',
    label: '1280x720',
  },
  {
    value: '1920x1080',
    label: '1920x1080',
  },
  {
    value: '2560x1440',
    label: '2560x1440',
  },
  {
    value: '3840x2160',
    label: '3840x2160',
  },
]);
const format = ref('mp4');
const videoEncoder = ref('libx264');
const frameRate = ref('23.976');
const speed = ref('1');
const resolution = ref('1920x1080');
const ffmpeg = createFFmpeg({log: true});
const loading = ref(false);
const video = ref(null);
const saveFlag = ref(false);//是否显示保存按钮
const videoFlag = ref(false)
const handleChangeFormat = (value) => {
  format.value = value;
  console.log(value);
};
const handleChangeEncoder = (value) => {
  videoEncoder.value = value;
  console.log(value);
};
const handleChangeFrameRate = (value) => {
  console.log(value, typeof value);
  frameRate.value = value;
};
const handleChangespeed = (value) => {
  console.log(value, typeof value);
  speed.value = value;
};
const handleChangeresolution = (value) => {
  resolution.value = value;
  console.log(value);
};
onMounted(async () => {
  await ffmpeg.load();
});
const upload = (file) => {
  video.value = file;
};
const remove = () => {
  saveFlag.value = false;
  loading.value = false;
  videoFlag.value=false
}
const handleDownload = () => {
  const link = document.createElement('a');
  link.href = result.url;
  link.download = `output.${format.value}`;
  // 触发下载
  link.click();
};
const result = reactive({
  url: '',
  type: 'video',
});

//gif to video
const handleFormatChange = async () => {
  loading.value = true;
  const {name} = video.value;
  ffmpeg.FS('writeFile', name, await fetchFile(video.value));

  // Run the FFMpeg command
  await ffmpeg.run(
      '-i',
      name,
      '-c:v',
      videoEncoder.value,
      '-r',
      frameRate.value,
      '-vf',
      `setpts=${speed.value}*PTS`,
      `output.${format.value}`
  );
  // Read the result
  const data = ffmpeg.FS('readFile', `output.${format.value}`);
  // Create a URL
  const url = URL.createObjectURL(new Blob([data.buffer], {type: 'image/mp4'}));
  result.url = url;
  loading.value = false;
  saveFlag.value = true;
  videoFlag.value = true;
  window.$he3.message.success(t('success'));
};
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
  