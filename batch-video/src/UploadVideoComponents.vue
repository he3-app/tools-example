<template>
  <div class="video-componments">
    <h-file-upload @pick='beforeUpload' @remove='handleRemove' :text="t('component.videoResultText')"
                   :hint="t('component.resultTitle')"
                   :secondHint="t('component.loading')" :loading='props.loading'></h-file-upload>
    <div class="previewer-video" v-if='fileList.length!=0'>
      <slot/>
    </div>
  </div>
</template>
<script setup>
import {ref, watch} from 'vue';

import {useI18n} from 'vue-i18n';

import messages from './lang/lang.json';

const emit = defineEmits(['upload', 'duration']);

const {t} = useI18n({
  locale: window.$he3.lang,
  messages,
});
const currentColor = ref('#6c00b4');
const fileList = ref([]);
const theme = window.$he3.theme;
const file = ref(null);
const videoDuration = ref(0); // 保存视频时长的变量

/* ------------- 上传和操作的逻辑分界线-------------- */

const props = defineProps({
  loading: Boolean,
});

const videoUrl = ref('');
const beforeUpload = file => {
  fileList.value = file;
  emit('upload', fileList.value[0]);
};
// // 手动上传
const handleRemove = () => {
  fileList.value = [];
  emit('remove')
};
watch(fileList, async (newFile) => {
  if (newFile) {
    const u = URL.createObjectURL(newFile[0]);
    videoUrl.value = u;
    // 获取视频时长
    const video = document.createElement('video');
    video.addEventListener('loadedmetadata', () => {
      videoDuration.value = video.duration;
      emit('duration', video.duration); // 将视频时长传递出去
    });
    video.src = u;
  }
});
</script>
<style lang="less" scoped>
.video-componments {
  width: 100%;
  height: 100%;
  padding: 28px 28px;
  display: flex;
  flex-direction: column;

  .previewer-video {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 28px;
  }
}
</style>
