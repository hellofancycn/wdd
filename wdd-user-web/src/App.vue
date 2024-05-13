<template>
    <el-config-provider :locale="locale" size="default">
        <router-view/>
    </el-config-provider>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {ElConfigProvider} from 'element-plus';

// 导入 Element Plus 语言包
import zhCn from 'element-plus/es/locale/lang/zh-cn';

const locale = ref();
locale.value = zhCn;

</script>
