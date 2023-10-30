<template>
  <h-single-layout mode="middle" :width="700" class="timer">
    <a-list :data-source="timerControllers">
      <template #header>
        <a-form-item>
          <a-button :disabled="addTimerBtnDisabled" type="primary" ghost @click="addTimer">
            {{ t('addTimer') }}
          </a-button>
        </a-form-item>
        <a-form-item :label="t('controlType')">
          <h-radio
            v-model:value="controlType"
            :disabled="controlTypeDisabled"
            button-style="solid"
            @change="controlTypeChange"
            :save-options="{key:'controlType', autoSave: true}"
          >
            <a-radio-button value="manual">
              {{ t('manualControl') }}
            </a-radio-button>
            <a-radio-button value="allControl">
              {{ t('allControl') }}
            </a-radio-button>
          </h-radio>
        </a-form-item>
        <a-form-item v-if="controlType === 'allControl'">
          <a-space>
            <a-button v-if="allStartBtnShow" type="primary" size="large" @click="allStart">
              {{ t('allStart') }}
            </a-button>
            <a-button v-if="allPauseBtnShow" type="primary" size="large" ghost @click="allPause">
              {{ t('allPause') }}
            </a-button>
            <a-button v-if="allResumeBtnShow" type="primary" size="large" ghost @click="allResume">
              {{ t('allResume') }}
            </a-button>
            <a-button
              v-if="allResetBtnShow"
              type="primary"
              size="large"
              ghost
              danger
              @click="allReset"
            >
              {{ t('allReset') }}
            </a-button>
          </a-space>
        </a-form-item>
      </template>
      <template #renderItem="{ item, index }">
        <a-list-item>
          <a-list-item-meta>
            <template #title>
              <a-typography-title>
                {{ item.current }}
              </a-typography-title>
            </template>
            <template #description>
              <NotificationOutlined v-if="item.notify" />
              {{ `${item.name} (${item.userTime.toString()})` }}
              <a-button type="text" @click="editTimerController(item, index)">
                <template #icon><FormOutlined /></template>
              </a-button>
            </template>
          </a-list-item-meta>
          <template #actions>
            <a-button v-if="startBtnShow(item)" type="primary" size="large" @click="item.start()">
              {{ t('start') }}
            </a-button>
            <a-button
              v-if="pauseBtnShow(item)"
              type="primary"
              size="large"
              ghost
              @click="item.pause()"
            >
              {{ t('pause') }}
            </a-button>
            <a-button
              v-if="resetBtnShow(item)"
              type="primary"
              size="large"
              ghost
              danger
              @click="item.reset()"
            >
              {{ t('reset') }}
            </a-button>
            <a-button
              v-if="resumeBtnShow(item)"
              type="primary"
              size="large"
              ghost
              @click="item.resume()"
            >
              {{ t('resume') }}
            </a-button>
            <a-button
              v-if="removeBtnShow"
              type="primary"
              size="large"
              danger
              @click="removeTimerController(item)"
            >
              {{ t('remove') }}
            </a-button>
          </template>
        </a-list-item>
      </template>
    </a-list>

    <a-modal
      v-model:visible="modalVisible"
      :title="t('editTimer')"
      :ok-text="t('editOk')"
      :cancel-text="t('editCancel')"
      @ok="modelOnOk"
    >
      <a-form ref="editFormRef" :model="editFormModel">
        <a-form-item :label="t('timerName')" name="name" :rules="editNameRules">
          <a-input v-model:value="editFormModel.name" />
        </a-form-item>
        <a-form-item :label="t('timerDuration')">
          <a-space>
            <h-number-input v-model:value="editFormModel.hours" addon-after="Hrs" :min="0" :save-options="{autoSave:true,key:'hours'}"/>
            :
            <h-number-input
              v-model:value="editFormModel.minutes"
              addon-after="Min"
              :min="0"
              :max="59"
              :save-options="{autoSave:true,key:'minutes'}"
            />
            :
            <h-number-input
              v-model:value="editFormModel.seconds"
              addon-after="Secs"
              :min="0"
              :max="59"
              :save-options="{autoSave:true,key:'seconds'}"
            />
          </a-space>
        </a-form-item>
        <a-form-item :label="t('notifySwitch')">
          <a-switch v-model:checked="editFormModel.notify" />
        </a-form-item>
      </a-form>
    </a-modal>
  </h-single-layout>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { FormOutlined, NotificationOutlined } from '@ant-design/icons-vue';
import dayjs from 'dayjs';
import Timer from 'tiny-timer';
import duration from 'dayjs/plugin/duration';
import { useI18n } from 'vue-i18n';
import messages from './lang.json';
dayjs.extend(duration);
const { t } = useI18n({
  locale: window.$he3.lang,
  messages,
});

const durationFormat = 'HH:mm:ss.SSS';

class UserTime {
  hours: number;
  minutes: number;
  seconds: number;
  duration() {
    return dayjs.duration({
      hours: this.hours,
      minutes: this.minutes,
      seconds: this.seconds,
      milliseconds: 0,
    });
  }

  constructor(hours: number, minutes: number, seconds: number) {
    this.hours = hours;
    this.minutes = minutes;
    this.seconds = seconds;
  }

  toString() {
    return this.duration().format(durationFormat);
  }
}

const defaultUserTime = new UserTime(0, 0, 10);
class TimerController {
  name: string;
  timer?: Timer;
  userTime: UserTime;
  status: 'running' | 'paused' | 'stopped';
  current: string;
  notify?: boolean;
  doneNotify() {
    const NOTIFICATION_TITLE = t('timer.timerDoneNotifyTitle');
    const NOTIFICATION_BODY = t('timer.timerDoneNotifyBody') + this.name;

    notification.success({
      message: NOTIFICATION_TITLE,
      description: NOTIFICATION_BODY,
    });
  }

  constructor(name?: string) {
    this.name = name || 'Timer';
    this.userTime = defaultUserTime;
    this.status = 'stopped';
    this.current = this.userTime.duration().format(durationFormat);
  }

  start() {
    this.timer = new Timer({ interval: 10 });
    this.timer.on('tick', (ms: number) => {
      this.current = dayjs.duration(ms).format(durationFormat);
    });
    this.timer.on('statusChanged', (status: 'running' | 'paused' | 'stopped') => {
      this.status = status;
    });
    this.timer.on('done', () => {
      if (this.notify) {
        this.doneNotify();
      }
    });
    const duration = this.userTime.duration().asMilliseconds();
    this.timer.start(duration);
  }

  pause() {
    this.timer?.pause();
  }

  resume() {
    this.timer?.resume();
  }

  stop() {
    this.timer?.stop();
  }

  reset() {
    this.timer?.stop();
    this.current = this.userTime.duration().format(durationFormat);
  }
}

const timerControllers = ref<TimerController[]>([]);
function generatorTimerName() {
  return `Timer ${timerControllers.value.length + 1}`;
}

const controlType = ref<'manual' | 'allControl'>('manual');
const controlTypeDisabled = computed(() => {
  return (
    timerControllers.value.length <= 1 ||
    timerControllers.value.some((item) => item.status === 'running')
  );
});
const controlTypeChange = function () {
  timerControllers.value.forEach((item) => {
    item.reset();
  });
};
const removeBtnShow = computed(() => timerControllers.value.length > 1);
const resetBtnShow = computed(() => {
  return (item: TimerController) => controlType.value !== 'allControl' && item.status === 'paused';
});
const resumeBtnShow = computed(() => {
  return (item: TimerController) => controlType.value !== 'allControl' && item.status === 'paused';
});
const pauseBtnShow = computed(() => {
  return (item: TimerController) => controlType.value !== 'allControl' && item.status === 'running';
});
const startBtnShow = computed(() => {
  return (item: TimerController) => controlType.value !== 'allControl' && item.status === 'stopped';
});

onMounted(() => {
  timerControllers.value.push(new TimerController(generatorTimerName()));
});
onUnmounted(() => {
  timerControllers.value.forEach((timerController) => {
    timerController.stop();
  });
});

const addTimerBtnDisabled = computed(() => {
  return timerControllers.value.some((item) => item.status === 'running');
});
function addTimer() {
  timerControllers.value.push(new TimerController(generatorTimerName()));
}

const allStartBtnShow = computed(() => {
  return (
    controlType.value === 'allControl' &&
    !timerControllers.value.some((timerController) => {
      return timerController.status !== 'stopped';
    })
  );
});
const allPauseBtnShow = computed(() => {
  return (
    controlType.value === 'allControl' &&
    timerControllers.value.some((timerController) => {
      return timerController.status === 'running';
    })
  );
});
const allResumeBtnShow = computed(() => {
  return (
    controlType.value === 'allControl' &&
    timerControllers.value.some((timerController) => {
      return timerController.status === 'paused';
    })
  );
});
const allResetBtnShow = computed(() => {
  return (
    controlType.value === 'allControl' &&
    timerControllers.value.some((timerController) => {
      return timerController.status === 'paused';
    })
  );
});
function allStart() {
  timerControllers.value.forEach((timerController) => {
    timerController.start();
  });
}
function allPause() {
  timerControllers.value.forEach((timerController) => {
    timerController.pause();
  });
}
function allResume() {
  timerControllers.value.forEach((timerController) => {
    timerController.resume();
  });
}
function allReset() {
  timerControllers.value.forEach((timerController) => {
    timerController.reset();
  });
}

function removeTimerController(item: TimerController) {
  item.stop();
  timerControllers.value = timerControllers.value.filter(
    (timerController) => timerController !== item
  );
  if (timerControllers.value.length <= 1) {
    controlType.value = 'manual';
  }
}

const modalVisible = ref(false);
const editFormRef = ref<FormInstance>();
const editNameRules = ref<{
  required: true;
  message: 'Please input timer name';
  trigger: 'blur';
}>;
const editFormModel = ref<{
  name: string;
  hours: number;
  minutes: number;
  seconds: number;
  notify: boolean;
  index: number;
}>({
  name: '',
  hours: 0,
  minutes: 0,
  seconds: 0,
  notify: false,
  index: -1,
});
function editTimerController(item: TimerController, index: number) {
  editFormModel.value.name = item.name;
  editFormModel.value.hours = item.userTime.hours;
  editFormModel.value.minutes = item.userTime.minutes;
  editFormModel.value.seconds = item.userTime.seconds;
  editFormModel.value.notify = item.notify || false;
  editFormModel.value.index = index; // 存储当前计时器的索引
  modalVisible.value = true;
}

function modelOnOk(e: MouseEvent) {
  editFormRef.value?.validateFields().then(() => {
    const timerController = timerControllers.value[editFormModel.value.index];
    timerController.name = editFormModel.value.name;
    timerController.userTime = new UserTime(
      editFormModel.value.hours,
      editFormModel.value.minutes,
      editFormModel.value.seconds
    );
    timerController.notify = editFormModel.value.notify;
    timerController.reset(); // 重置计时器
    // 更新对应的计时器的显示时间
    timerController.current = timerController.userTime.duration().format(durationFormat);
    modalVisible.value = false;
    editFormRef.value?.resetFields();
  });
}
</script>

<style scoped lang="less"></style>
