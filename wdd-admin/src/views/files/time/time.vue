<template>
  <div class="app-container">
    <el-form :model="queryParam" ref="queryForm" :inline="true">
      <el-form-item label="分类：">
        <tree-select v-model="queryParam.trainArchiveIdList" :data="trainArchiveTree" :clearable="true"
          placeholder="培训分类" />
      </el-form-item>
      <el-form-item label="名称：">
        <el-input v-model="queryParam.name" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm" v-has-perm="['train:course:page']">查询</el-button>
        <el-button @click="clearForm">重置</el-button>
        <router-link :to="{ path: 'timeedit'}" class="link-left">
            <el-button class="wdd-button-mini" type="primary">新增线下培训档案
            </el-button>
          </router-link>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" border fit highlight-current-row style="width: 100%">
      <el-table-column prop="id" label="Id" width="90px" />
      <el-table-column prop="level" label="培训分类" width="120px" />
      <el-table-column prop="name" label="培训名称" />
      <el-table-column prop="studyTimeStr" label="培训方式" width="130px" />
      <el-table-column prop="startTime" label="开始时间" width="160px" />
      <el-table-column prop="endTime" label="结束时间" width="160px" />
      <el-table-column width="210px" label="操作" align="center">
        <template #default="{ row }">
          <router-link :to="{ path: 'timeshow', query: { id: row.id } }" class="link-left">
            <el-button class="wdd-button-mini" >查看
            </el-button>
          </router-link>
          <el-button @click="exportForm(row)" >导出</el-button>
        </template>
      </el-table-column>pei
    </el-table>
    <pagination v-show="total > 0" :total="total" v-model:page="queryParam.pageIndex"
      v-model:limit="queryParam.pageSize" @pagination="search" />
  </div>
</template>

<script>

import { EnumMap } from '@/api/EnumMap'
import { page, deleteTrain, exportPlan } from '@/api/train'
import { tree } from '@/api/trainArchive'

export default {
  name: 'TrainCourseList',
  data() {
    return {
      EnumMap: EnumMap,
      tabPosition: 'top',
      queryParam: {
        name: null,
        trainArchiveIdList: [],
        pageIndex: 1,
        pageSize: 10
      },
      tableData: [],
      total: 0,
      trainArchiveTree: [],
      canLoad: true
    }
  },
  mounted() {
    this.init()
    this.canLoad = false
  },
  activated() {
    this.init()
  },
  deactivated() {
    this.canLoad = true
  },
  methods: {
    init() {
      if (!this.canLoad) {
        return
      }

      tree().then(re => {
        this.trainArchiveTree = re.response
      })

      this.search()
    },
    search() {
      page(this.queryParam).then(data => {
        const re = data.response
        this.tableData = re.list
        this.total = re.total
        this.queryParam.pageIndex = re.pageNum
      })
    },
    exportForm(row) {
      console.log(row.id)
      exportPlan(row.id).then(res => {
        console.log(res)
        // const year = row.createTime.getFullYear();
        // const month = (row.createTime.getMonth() + 1).toString().padStart(2, '0');
        // const day = row.createTime.getDate().toString().padStart(2, '0');
        // const time = year + '年' + month + '月' + day + '日';
        let blob = new Blob([res], { type: "application/zip" });
        // 创建 href 超链接，点击进行下载
        window.URL = window.URL || window.webkitURL;
        let href = URL.createObjectURL(blob);
        let downA = document.createElement("a");
        downA.href = href;
        downA.download = row.name + '-' + row.createTime + '-' + '培训档案';
        downA.click();
        // 销毁超连接
        window.URL.revokeObjectURL(href);
      })
    },
  }
}
</script>import { userExport } from '@/api/examPaperAnswer'
