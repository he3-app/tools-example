<template>
  <div class="box">
    <div class="title">{{ itemObj.title }}</div>
    <div class="content">
      <div class="list">
        <a-list item-layout="horizontal" :data-source="listDate">
          <template #renderItem="{ item, index }">
            <a-list-item
              class="normal"
              :class="{ bgColor: item.key == selListItem }"
              @click="selListItemObj(item.key)"
            >
              <span
                ><desktop-outlined
                  v-if="index == 0"
                  style="margin-right: 5px"
                /><file-text-outlined v-else style="margin-right: 5px" />{{
                  item.title
                }}
              </span>
              <div class="delete" v-if="index != 0">
                <delete-outlined @click.stop="deleteAll(item.key)" />
              </div>
            </a-list-item>
          </template>
          <div class="add">
            <a-button
              type="primary"
              @click="addFile"
              block
              :icon="h(PlusOutlined)"
              >{{ t("addMsg") }}</a-button
            >
          </div>
        </a-list>
      </div>
      <div class="hosts-editor">
        <div class="btns">
          <a-button
            type="primary"
            :loading="saveLoading"
            @click="applyHost"
            style="margin-left: 30px"
          >
            {{ t("apply") }}
          </a-button>
          <a-button
            type="primary"
            :loading="saveLoading"
            @click="saveHost"
            style="margin-left: 30px"
          >
            {{ t("save") }}
          </a-button>
        </div>
          <div class="code-editor">
              <h-code-editor v-model="itemObj.content" :lang="'SHELL'" />
          </div>
      </div>
    </div>
    <a-modal
      v-model:visible="visible"
      :title="t('addFileText')"
      @ok="confirm"
      :ok-text="t('confirm')"
      :cancel-text="t('cancel')"
      @cancel="handleCancel"
    >
      <div>
        <span>{{ t("modelMsg") }}</span>
        <h-input v-model:value="nameMsg" autoSelect />
      </div>
    </a-modal>
  </div>
</template>
<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { h } from "vue";
import messages from "./lang.json";
import {
  DeleteOutlined,
  PlusOutlined,
  DesktopOutlined,
  FileTextOutlined,
} from "@ant-design/icons-vue";
const { t } = useI18n({
  locale: window.$he3.lang,
  messages,
});
const selListItem = ref(0);
const visible = ref(false);
const hosts = ref("");
let nameMsg = ref("");
let saveDate = ref([]);
let maxKey = ref(0);
const getSystemHosts = async function () {
  const {
    content,
    readonly: fileReadonly,
    path,
  } = await window.$he3.getSystemHosts();
  hosts.value = content;
  listDate.value[0].content = content;
  hostsReadonly.value = fileReadonly;
  hostsPath.value = path;
};
const hostsReadonly = ref(false);
const hostsPath = ref("");
const listDate = ref([
  {
    key: 0,
    title: "系统Hosts",
    content: hosts.value,
  },
]);
function handleDate(date) {
  const uniqueMap = {};
  let arrDate = date.filter((item) => {
    const itemString = JSON.stringify(item);
    if (!uniqueMap[itemString]) {
      uniqueMap[itemString] = true;
      return true;
    }
    return false;
  });
  return arrDate;
}
onMounted(async () => {
  getSystemHosts();
  const previewerValue = JSON.parse(await $he3.getToolOptions());
  saveDate.value = [...JSON.parse(previewerValue.content)];
  // const uniqueMap = {};
  listDate.value = [...listDate.value, ...saveDate.value];
  // listDate.value = listDate.value.filter((item) => {
  //   const itemString = JSON.stringify(item);
  //   if (!uniqueMap[itemString]) {
  //     uniqueMap[itemString] = true;
  //     return true;
  //   }
  //   return false;
  // });
  listDate.value=handleDate(listDate.value)
  saveDate.value = listDate.value;
  listDate.value.forEach((item) => {
    console.log(item);
  });
  let arr = listDate.value.map((item) => {
    return item.key;
  });
  maxKey.value = arr.reduce((a, b) => Math.max(a, b), -Infinity);
});

const itemObj = computed(() =>
  listDate.value.find((item) => {
    return item.key == selListItem.value;
  })
);
const saveLoading = ref(false);
function saveHost() {
  saveDate.value.push(itemObj.value);
  saveDate.value = handleDate(saveDate);
  window.$he3.uploadToolOptions({
    id: window.$he3.toolId,
    options: {
      test: "saveDate",
      content: JSON.stringify(saveDate.value),
    },
  });
  window.$he3.message.success(t("saveSuccess"));
}
const applyHost = function () {
  saveLoading.value = true;
  window.$he3
    .setSystemHosts(itemObj.value.content)
    .then((res) => {
      window.$he3.message.success(t("applySuccess"));
    })
    .catch((err) => {
      console.log("err", err);
      window.$he3.message.error(t("applyFailed"));
    })
    .finally(() => {
      saveLoading.value = false;
    });
};
// 对当前的对象进行标记绑定
function selListItemObj(key) {
  selListItem.value = key;
}
watch(selListItem, (newX) => {
  selListItem.value = newX;
});
function deleteAll(val) {
  let index = listDate.value.findIndex((item) => {
    return item.key == val;
  });
  listDate.value = listDate.value.filter((item) => {
    return item.key != val;
  });
  if (val <= selListItem.value) {
    selListItem.value = listDate.value[index - 1].key;
  }
  window.$he3.message.success(t("deleteMsg"));
  saveDate.value = saveDate.value.filter((item) => {
    return item.key != val;
  });
  window.$he3.uploadToolOptions({
    id: window.$he3.toolId,
    options: {
      test: "saveDate",
      content: JSON.stringify(saveDate.value),
    },
  });
}
function addFile() {
  visible.value = true;
}
function handleCancel() {
  visible.value = false;
  nameMsg.value = "";
}
function confirm() {
  if (nameMsg.value == "") {
    window.$he3.message.warning(t("warnMsg"));
  } else {
    let newDate = {
      // key: listDate.value[listDate.value.length - 1].key + 1,
      key: maxKey.value + 1,
      title: nameMsg.value,
      content: "",
    };
    maxKey.value += 1;
    listDate.value = [...listDate.value, newDate];
    selListItem.value = newDate.key;
    visible.value = false;
    nameMsg.value = "";
    window.$he3.message.success(t("addSuccessMsg"));
  }
}
</script>
<style lang="less" scoped>

[mode="dark"] .box{
  .title{
    background: #4d4f5f;
    border: 2px solid #4d4f5f;
  }
  .content{
    .list{
      background: #4d4f5f;
      .normal{
        border: 1px solid #292C38;
        &.bgColor{
          background: #292C38;
        }
      }
    }
  }
}

.box {
  height: calc(100% - 50px);
  max-width: 1226px;
  width: 100%;
  padding: 0 5%;
  margin-top: 10px;
  .title {
    text-align: center;
    height: 50px;
    line-height: 50px;
    width: 100%;
    border: 2px solid #E6EDF2;
    border-radius: 6px;
    margin-bottom: 10px;
    background: #F4F8FB;
  }
  .content {
    display: flex;
    height: calc(100% - 34px);
    .list {
      width: 300px;
      min-width: 250px;
      border-radius: 6px;
      font-weight: bolder;
      height: 100%;
      overflow: auto;
      background-color: #F4F8FB;
      :deep(.ant-list-items:nth-child(1)) {
        margin-top: 4%;
      }
      :deep(.ant-list-items) {
        padding: 0 10px;
        li {
          padding: 10px;
        }
      }
      .normal {
        //background-color: #D7DDE3;
        border: 1px solid #D7DDE3;
        border-radius: 5px;
        margin-bottom: 5px;
        cursor: pointer;
        &.bgColor {
          background-color: #e2ebf2;
        }
      }
      .add {
        width: 100%;
        padding: 0 10px;
        font-weight: bold;
      }
    }
    .hosts-editor {
      max-width: 700px;
      min-width: 650px;
      flex: 1;
      margin-left: 20px;
      .btns {
        margin-bottom: 1%;
      }
      .code-editor{
        height: calc(100% - 50px);
      }
    }
  }
}

</style>
