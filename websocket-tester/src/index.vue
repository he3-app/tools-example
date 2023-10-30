<template>
  <splitpanes horizontal style="height: 100%" class="all">
    <pane min-size="10">
      <div class="connect-input">
        <h-input
          :disabled="isConnected === true"
          v-model:value="websocketUrl"
          placeholder="Enter WebSocket URL"
          allow-clear
          :save-options="{ autoSave: true, key: 'websocketUrl' }"
        />
        <a-button
          style="margin-left: 20px"
          type="primary"
          @click="connectWebSocket"
          v-if="isConnected === false"
        >
          {{ t('Connect') }}
        </a-button>
        <a-button style="margin-left: 20px" type="danger" @click="disconnectWebSocket" v-else>
          {{ t('Disconnect') }}
        </a-button>
      </div>
      <div class="send-message">
        <div style="min-height: 200px;">
        <h-code-editor
          v-model="messageToSend"
          :lang="selectedKeys === 'Text' ? 'SHELL' : selectedKeys"
          class="editor"
          :style="{ height: '100%' }"
        />
      </div>
        <a-space>
          <a-dropdown>
          <template #overlay>
            <a-menu @click="(e) => (selectedKeys = e.key)">
              <a-menu-item v-for="item in allKeys" :key="item">{{ item }}</a-menu-item>
            </a-menu>
          </template>
          <a-button>
            {{ selectedKeys }}
            <DownOutlined />
          </a-button>
        </a-dropdown>
        <a-button
          @click="sendMessage"
          :disabled="false"
          type="primary"
        >
          {{ t('Send') }}
        </a-button>
      </a-space>
      </div>
      <!-- <a-tabs v-model:activeKey="activeKey" style="margin-top: 20px">
        <a-tab-pane key="1" tab="Message">
          <div class="send-message">
            <a-dropdown>
              <template #overlay>
                <a-menu @click="(e) => (selectedKeys = e.key)">
                  <a-menu-item v-for="item in allKeys" :key="item">{{ item }}</a-menu-item>
                </a-menu>
              </template>
              <a-button>
                {{ selectedKeys }}
                <DownOutlined />
              </a-button>
            </a-dropdown>
            <h-code-editor v-model="messageToSend" :lang="'SHELL'" class="editor" />
            <a-button
              @click="sendMessage"
              :disabled="false"
              style="width: 100%; margin-top: 20px"
              type="primary"
            >
              send
            </a-button>
          </div>
        </a-tab-pane>
        <a-tab-pane key="2" tab="Params" :disabled="isConnected === true">
          <h-kv-input
            v-model="paramsStr"
            mode="list"
            :default-value="request.params"
            @change="onParamsChange"
          />
        </a-tab-pane>
        <a-tab-pane key="3" tab="Headers" :disabled="true">
          <h-kv-input
            v-model="headersStr"
            mode="list"
            :default-value="request.headers"
            @change="onHeadersChange"
          />
        </a-tab-pane>
      </a-tabs> -->
    </pane>
    <pane min-size="10">
      <div class="response">
        <div class="response-header">
          <div class="response-title">{{ t('Response') }}</div>
          <div class="response-badge">
            <a-badge
              :status="connectionStatus === 'Connected' ? 'success' : 'error'"
              :text="t(connectionStatus)"
            />
          </div>
        </div>
        <a-collapse
          expandIconPosition="right"
          v-model:activeKey="collapseActiveKey"
          :bordered="false"
        >
          <a-collapse-panel
            class="collapse-panel"
            v-for="(panelItem, paneIndex) in receivedMessagesCpt"
            :key="paneIndex"
            @click="handleMessageItem(panelItem, paneIndex)"
            @mouseenter="handleMouseEvent(panelItem, paneIndex)"
            @mouseleave="handleMouseEvent(-1)"
          >
            <a-dropdown v-if="panelItem.selectedKeys">
              <template #overlay>
                <a-menu @click="(e) => (panelItem.selectedKeys = e.key)">
                  <a-menu-item v-for="item in allKeys" :key="item">{{ item }}</a-menu-item>
                </a-menu>
              </template>
              <a-button>
                {{ panelItem.selectedKeys }}
                <DownOutlined />
              </a-button>
            </a-dropdown>
            <h-code-editor
              :isWrap="true"
              style="margin-top: 8px"
              disabled
              :modelValue="
                panelItem?.messageDetails ? panelItem.messageDetails : panelItem.messageData
              "
              :lang="panelItem.selectedKeys === 'Text' ? 'SHELL' : panelItem.selectedKeys"
              class="editor"
            />
            <template #header>
              <div class="collapse-header">
                <UpCircleTwoTone v-if="panelItem.fromType === 'client'" two-tone-color="#AE8C31" />
                <DownCircleTwoTone
                  v-else-if="panelItem.fromType === 'server'"
                  two-tone-color="#1351B6"
                />
                <check-circle-two-tone
                  v-else-if="panelItem.fromType === 'Connected'"
                  two-tone-color="#52c41a"
                />
                <close-circle-two-tone
                  v-else-if="panelItem.fromType === 'Disconnected'"
                  two-tone-color="red"
                />
                <div
                  class="message-data"
                  style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap"
                >
                  {{ panelItem.messageData }}
                </div>
                <div class="collapse-header-right">
                  <div v-show="hoverActiveIndex === paneIndex" class="hoverIcon">
                    <a-popover trigger="hover" placement="bottom">
                      <template #content>
                        <div>{{ t('copyMessage') }}</div>
                      </template>
                      <CopyOutlined @click.stop="handleIcon(panelItem, paneIndex, 'copy')" />
                    </a-popover>
                    <!-- <a-popover trigger="hover" placement="bottom">
                      <template #content>
                        <p>Save</p>
                      </template>
                      <DownloadOutlined @click.stop="handleIcon(panelItem, paneIndex, 'save')" />
                    </a-popover>
                    <a-popover trigger="hover" placement="bottom">
                      <template #content>
                        <div>Size:</div>
                        <div>Time:</div>
                        <div>MIME Type:</div>
                      </template>
                      <InfoCircleOutlined @click.stop="handleIcon(panelItem, paneIndex, 'info')" />
                    </a-popover> -->
                  </div>
                  <div class="time">{{panelItem.time}}</div>
                </div>
              </div>
            </template>
          </a-collapse-panel>
        </a-collapse>
      </div>
    </pane>
  </splitpanes>
</template>

<script lang="ts" setup>
import { ref, reactive, onUnmounted, computed, watch } from 'vue';
import { DownOutlined } from '@ant-design/icons-vue';
import { Pane, Splitpanes } from 'splitpanes'; // https://antoniandre.github.io/splitpanes/
import 'splitpanes/dist/splitpanes.css';
import {
  UpCircleTwoTone,
  DownCircleTwoTone,
  CopyOutlined,
  DownloadOutlined,
  InfoCircleOutlined,
  CheckCircleTwoTone,
  CloseCircleTwoTone,
} from '@ant-design/icons-vue';
import { useI18n } from 'vue-i18n';
import messages from './lang.json';

const { t } = useI18n({
  locale: window.$he3.lang,
  messages,
});
const websocketUrl = ref('ws://124.222.224.186:8800');
const isConnected = ref(false);
const activeKey = ref('1');

const selectedKeys = ref('Text');
const allKeys = ref(['Text', 'JSON', 'XML', 'HTML']);

const paramsStr = ref('');
const headersStr = ref('');
const request = reactive({
  params: {},
  headers: {},
});
interface KVRow {
  key: string;
  value: string;
  index: number;
}

const onParamsChange = (KV: KVRow[]) => {
  const obj = KV.reduce((total, cur) => {
    if (cur.key === '') return total;
    return Object.assign(total, { [cur.key]: cur.value });
  }, {});
  request.params = obj;
};

function objectToQueryString(obj) {
  const keyValuePairs = [];

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      const encodedKey = encodeURIComponent(key);
      const encodedValue = encodeURIComponent(value);
      keyValuePairs.push(`${encodedKey}=${encodedValue}`);
    }
  }

  return keyValuePairs.join('&');
}

function appendParamsToUrl(url, params) {
  const queryString = objectToQueryString(params);
  const separator = url.includes('?') ? '&' : '?';
  const urlWithParams = `${url}${separator}${queryString}`;
  return urlWithParams;
}

const onHeadersChange = (KV: KVRow[]) => {
  const obj = KV.reduce((total, cur) => {
    if (cur.key === '') return total;
    return Object.assign(total, { [cur.key]: cur.value });
  }, {});
  request.headers = obj;
};
const messageToSend = ref('Hello, He3');

const collapseActiveKey = ref('');
const receivedMessages = ref([]);
const receivedMessagesCpt = computed(() => {
  let cloneDataReverse = JSON.parse(JSON.stringify(receivedMessages.value));
  return cloneDataReverse.reverse();
});

const connectionStatus = ref('Disconnected');

let websocket;

const connectWebSocket = () => {
  if (websocketUrl.value.trim() === '') {
    // alert('Please enter a WebSocket URL');
    window.$he3.message.warn('pleaseEnterWebSocketURL');
    return;
  }
  try {
    websocket = new WebSocket(websocketUrl.value);
  } catch (error) {
    window.$he3.message.error(t("connectedError"));
  }

  websocket.onopen = (e) => {
    console.log('onopen', e);
    isConnected.value = true;
    connectionStatus.value = 'Connected';
    receivedMessages.value = [];
    const date = new Date(); // 注意要将时间戳转换为毫秒
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    const formattedTime = `${hours}:${minutes}:${seconds}`;
    receivedMessages.value.push({
      fromType: 'Connected',
      messageData: `connected to ${websocketUrl.value}`,
      time:formattedTime
    });
    window.$he3.message.success(t('connectSuccess'));
  };

  websocket.onmessage = (event) => {
    console.log('onmessage', event);
    const date = new Date(); // 注意要将时间戳转换为毫秒
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    const formattedTime = `${hours}:${minutes}:${seconds}`;
    const msg = {
      fromType: 'server',
      messageData: event.data,
      time: formattedTime,
      selectedKeys: 'Text',
    };
    receivedMessages.value.push(msg);
    // messages.value += '\n' + msg.time.toLocaleString() + ': ' + msg.data;
  };

  websocket.onerror = (error) => {
    console.log('WebSocket Error: ' + error.message);

    window.$he3.message.error(error.message);
  };

  websocket.onclose = (e) => {
    console.log('onclose', e);
    isConnected.value = false;
    connectionStatus.value = 'Disconnected';
    const date = new Date(); // 注意要将时间戳转换为毫秒
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    const formattedTime = `${hours}:${minutes}:${seconds}`;
    receivedMessages.value.push({
      fromType: 'Disconnected',
      messageData: `Disconnected from ${websocketUrl.value}`,
      time:formattedTime
    });
    window.$he3.message.warn(t('Disconnected'));
  };
};

const disconnectWebSocket = () => {
  if (websocket) {
    collapseActiveKey.value = '';
    websocket.close();
  }
};

const sendMessage = () => {
  if (messageToSend.value.trim() === '') {
    // alert('Please enter a message to send');
    window.$he3.message.warn(t('messageToSendIsNotEmpty'));
    return;
  }
  const date = new Date(); // 注意要将时间戳转换为毫秒
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    const formattedTime = `${hours}:${minutes}:${seconds}`;
  if (isConnected.value) {
    collapseActiveKey.value = '';
    receivedMessages.value.push({
      fromType: 'client',
      messageType: 'Text',
      messageData: messageToSend.value,
      selectedKeys: 'Text',
      time:formattedTime
    });

    websocket.send(messageToSend.value);
    messageToSend.value = '';
  } else {
    // alert('WebSocket is not connected');
    window.$he3.message.warn(t('webSocketIsNotConnected'));
  }
};

const hoverActiveIndex = ref(-1);
const handleMessageItem = (panelItem, paneIndex) => {
  hoverActiveIndex.value = paneIndex;
};

const handleMouseEvent = (panelItem, paneIndex) => {
  hoverActiveIndex.value = paneIndex;
};

const handleIcon = (panelItem, paneIndex, actionType) => {
  switch (actionType) {
    case 'copy':
      window.$he3.copyText(panelItem.messageData);
      window.$he3.message.success(t('copySuccess'));
      break;
    case 'save':
      break;
    case 'info':
      break;
  }
};

onUnmounted(() => {
  disconnectWebSocket();
});
</script>

<style scoped lang="less">
[mode='dark'] .all {
  --bg: #292c38;
  --splitpanes-splitter-bg: rgba(135, 141, 146, 0.6);
  --ant-collapse-header-hover-bg: #353743;
  --message-data-color: #abb7c9;
  --time-color: rgba(171, 183, 201, 0.6);
  --ant-collapse-item-bottom-color: #4c4f5f;
}

.all {
  --bg: #fff;
  --splitpanes-splitter-bg: #d1dee8;
  --ant-collapse-header-hover-bg: #f5f8fb;
  --ant-collapse-item-bottom-color: rgba(227, 235, 241, 0.6);
  --message-data-color: rgba(8, 23, 53, 0.85);
  --time-color: rgba(8, 23, 53, 0.45);
  width: 100%;
  height: 100%;
  padding: 16px;
  background-color: var(--bg);
  :deep(.splitpanes__splitter) {
    min-height: 1px;
    background-color: var(--splitpanes-splitter-bg);
    &:hover {
      height: 8px;
    }
  }
  :deep(.splitpanes__pane) {
    overflow-y: scroll;
  }
  .connect-input {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .send-message {
    margin-top: 20px;
    .editor {
      margin-top: 12px;
    }
  }
  .response {
    width: 100%;
    .response-header {
      margin-top: 4px;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .collapse-panel {
      display: flex;
      flex-direction: column;
      justify-content: center;
      :deep(.ant-collapse-header) {
        &:hover {
          background-color: var(--ant-collapse-header-hover-bg);
        }
      }
      .collapse-header {
        width: 100%;
        display: flex;
        align-items: center;
        .message-data {
          margin-left: 8px;
          margin-right: 36px;
          flex: 1;
          color: var(--message-data-color);
          font-size: 14px;
          font-style: normal;
          font-weight: 400;
        }
        .collapse-header-right {
          margin-left: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .hoverIcon {
            // width: 80px;
            width: 20px;
            display: flex;
            justify-content: space-evenly;
            align-items: center;
            margin-right: 8px;
          }
          .time {
            width: 65px;
            color: var(--time-color);
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
          }
        }
      }
    }

    :deep(.ant-collapse) {
      background-color: var(--bg);
    }
    :deep(.ant-collapse-item) {
      border-bottom-color: var(--ant-collapse-item-bottom-color);
    }
  }
}
</style>
