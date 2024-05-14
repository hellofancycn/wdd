<template>
  <div class="app-container">
    <el-form :model="queryParam" ref="queryForm" :inline="true">
      <el-form-item label="字典类型：">
        <el-input v-model="queryParam.dictType" clearable />
      </el-form-item>
      <el-form-item label="字典名称：">
        <el-input v-model="queryParam.dictName" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm" v-has-perm="['base:dict:page']">查询</el-button>
        <el-button @click="clearForm">重置</el-button>
        <router-link :to="{path:'/base/dataDict/edit'}" class="link-left">
          <el-button type="primary" v-has-perm="['base:dict:create']">添加</el-button>
        </router-link>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" border fit highlight-current-row style="width: 100%">
      <el-table-column prop="dictId" label="dictId" width="100px"/>
      <el-table-column prop="dictType" label="字典类型" show-overflow-tooltip />
      <el-table-column prop="dictName" label="字典名称" show-overflow-tooltip />
      <el-table-column prop="remark" label="字典说明" show-overflow-tooltip />
      <el-table-column width="250px" label="操作" align="center">
        <template #default="{row}">
          <router-link :to="{path:'/base/dataDict/edit', query:{dictId:row.dictId}}" class="link-left">
            <el-button v-has-perm="['base:dict:update']" class="wdd-button-mini" size="small">编辑
            </el-button>
          </router-link>
          <el-button type="danger" @click="examPaperDelete(row)" class="link-left wdd-button-mini"
                     size="small"
                     v-has-perm="['base:dict:delete']">删除
          </el-button>
          <router-link :to="{path:'/base/dataDict/dataList', query:{dictType:row.dictType, dictName: row.dictName}}" class="link-left">
            <el-button type="primary" class="link-left wdd-button-mini"
                       size="small"
                       v-has-perm="['base:dict:data']">字典值集
            </el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
<!--    <pagination v-show="total>0" :total="total" v-model:page="queryParam.pageIndex"-->
<!--                v-model:limit="queryParam.pageSize"-->
<!--                @pagination="search"/>-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      background
      style="margin-top: 15px"
      :current-page="queryParam.pageIndex"
      :page-sizes="[10, 20, 30, 100]"
      :page-size="queryParam.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
import {page, deleteDictApi} from '@/api/dictManagement'
export default {
  name: 'DictManagementList',
  data() {
    return {
      queryParam: {
        dictType: '',
        dictName: '',
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

      this.search()
    },
    search() {
      page(this.queryParam).then(data => {
        const re = data.response
        this.tableData = re.list
        this.total = re.total
        // this.queryParam.pageIndex = re.pageNum
      })
    },
    handleSizeChange(val) {
      this.queryParam.pageSize = val
      this.search()
    },
    handleCurrentChange(val) {
      this.queryParam.pageIndex = val
      this.search()
    },
    submitForm() {
      this.queryParam.pageIndex = 1
      this.search()
    },
    clearForm() {
      this.queryParam = {
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
        deleteDictApi({id: row.id}).then(re => {
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
