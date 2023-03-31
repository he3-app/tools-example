<template>
  <div class="Icons">
    <BranchesOutlined v-if="props.type === 'git'" />
    <PieChartOutlined v-if="props.type === 'pie'" />
    <ColumnWidthOutlined v-if="props.type === 'sequence'" />
    <DownCircleOutlined v-if="props.type === 'flow'" />
    <ApartmentOutlined v-if="props.type === 'class'" />
    <BuildOutlined v-if="props.type === 'er'" />
    <BlockOutlined v-if="props.type === 'state'" />
    <NodeIndexOutlined v-if="props.type === 'journey'" />
    <AlignLeftOutlined v-if="props.type === 'gantt'" />
  </div>
</template>

<script setup lang="ts">
import {
  AlignLeftOutlined,
  ApartmentOutlined,
  BlockOutlined,
  BranchesOutlined,
  BuildOutlined,
  ColumnWidthOutlined,
  DownCircleOutlined,
  NodeIndexOutlined,
  PieChartOutlined,
} from '@ant-design/icons-vue';

const props = defineProps<{ type: string }>();
</script>

<style scoped lang="less"></style>
