<template>
  <div class="app-container">
    <el-form :model="queryParam" ref="queryForm" :inline="true">
      <el-form-item label="姓名：">
        <el-input v-model="queryParam.name" clearable />
      </el-form-item>
      <el-form-item label="电话：">
        <el-input v-model="queryParam.linkPhone" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm" v-has-perm="['train:teacher:page']">查询</el-button>
        <el-button @click="clearForm">重置</el-button>
        <router-link :to="{path:'/train/teacher/edit'}" class="link-left">
          <el-button type="primary" v-has-perm="['train:teacher:create']">添加</el-button>
        </router-link>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" border fit highlight-current-row style="width: 100%">
      <el-table-column prop="id" label="Id" width="100px"/>
      <el-table-column prop="level" label="姓名" show-overflow-tooltip />
      <el-table-column prop="title" label="职务" show-overflow-tooltip />
      <el-table-column prop="linkPhone" label="电话" show-overflow-tooltip />
      <el-table-column width="150px" label="操作" align="center">
        <template #default="{row}">
          <router-link :to="{path:'/train/teacher/edit', query:{id:row.id}}" class="link-left">
            <el-button v-has-perm="['train:teacher:update']" class="wdd-button-mini" size="small">编辑
            </el-button>
          </router-link>
          <el-button type="danger" @click="examPaperDelete(row)" class="link-left wdd-button-mini"
                     size="small"
                     v-has-perm="['train:teacher:delete']">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" v-model:page="queryParam.pageIndex"
                v-model:limit="queryParam.pageSize"
                @pagination="search"/>
  </div>
</template>

<script>

import {EnumMap} from '@/api/EnumMap'
import {page, deleteTeacherApi} from '@/api/trainTeacher'
import {tree} from '@/api/examPaperArchive'

export default {
  name: 'TrainExamPaperList',
  data() {
    return {
      EnumMap: EnumMap,
      queryParam: {
        name: null,
        examPaperArchiveIdList: [],
        pageIndex: 1,
        pageSize: 10
      },
      tableData: [],
      total: 0,
      examPaperArchiveTree: [],
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
        this.examPaperArchiveTree = re.response
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
    submitForm() {
      this.queryParam.pageIndex = 1
      this.search()
    },
    clearForm() {
      this.queryParam = {
        name: null,
        examPaperArchiveIdList: [],
        pageIndex: 1,
        pageSize: 10
      }
      this.search()
    },
    examPaperDelete(row) {
      this.$confirm('将执行删除操作, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteTeacherApi({id: row.id}).then(re => {
          if (re.code === 1) {
            this.search()
            this.$message.success(re.message)
          } else {
            this.$message.error(re.message)
          }
        })
      })
    }
  }
}
</script>
