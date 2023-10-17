<template>
    <div class="Icons">
        <PullRequestOutlined v-if="props.type === 'flowchart'"/>
        <PicCenterOutlined v-if="props.type === 'requirementDiagram'"/>
        <AlignCenterOutlined v-if="props.type === 'timeline'"/>
        <UnorderedListOutlined v-if="props.type === 'sankey'"/>
        <StockOutlined v-if="props.type === 'mindmap'"/>
        <BarChartOutlined v-if="props.type === 'C4Context'"/>
        <WindowsOutlined v-if="props.type === 'quadrantChart'"/>

        <BranchesOutlined v-if="props.type === 'git'"/>
        <PieChartOutlined v-if="props.type === 'pie'"/>
        <ColumnWidthOutlined v-if="props.type === 'sequence'"/>
        <DownCircleOutlined v-if="props.type === 'flow'"/>
        <ApartmentOutlined v-if="props.type === 'class'"/>
        <BuildOutlined v-if="props.type === 'er'"/>
        <BlockOutlined v-if="props.type === 'state'"/>
        <NodeIndexOutlined v-if="props.type === 'journey'"/>
        <AlignLeftOutlined v-if="props.type === 'gantt'"/>
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
    PullRequestOutlined,
    PicCenterOutlined,
    AlignCenterOutlined,
    UnorderedListOutlined,
    StockOutlined,
    BarChartOutlined,
    WindowsOutlined
} from '@ant-design/icons-vue';

const props = defineProps<{ type: string }>();
</script>

<style scoped lang="less"></style>
