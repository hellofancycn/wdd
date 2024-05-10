<template>
  <div class="app-container">
    <el-form :model="queryParam" ref="queryForm" :inline="true">
      <el-form-item label="用户名：">
        <el-input v-model="queryParam.userName" clearable></el-input>
      </el-form-item>
      <el-form-item label="真实姓名：">
        <el-input v-model="queryParam.realName" clearable></el-input>
      </el-form-item>
      <el-form-item label="人员类别：">
        <tree-select v-model="queryParam.departmentIdList" :data="departmentTree" :clearable="true"
          placeholder="人员类别" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm" v-has-perm="['user:employee:page']">查询</el-button>
        <el-button @click="clearForm">重置</el-button>
        <router-link :to="{ path: '/user/employee/edit' }" class="link-left">
          <el-button type="primary">添加</el-button>
        </router-link>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" border fit highlight-current-row style="width: 100%">
      <el-table-column width="60px" align="center">
        <template #default="{ row }">
          <el-avatar :size="35" :src="row.imagePath" class="user-image-avatar"></el-avatar>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="Id" width="90px" />
      <el-table-column prop="userName" label="用户名" />
      <el-table-column prop="realName" label="真实姓名" />
      <el-table-column prop="departmentLevel" label="人员类别" />
      <el-table-column prop="jobTitle" label="职位" />
      <el-table-column prop="workNo" label="工号" />
      <el-table-column prop="idCard" label="身份证号" />
      <!-- <el-table-column prop="createTime" label="创建时间" width="160px" /> -->
      <!-- <el-table-column prop="statusStr" label="状态" width="70px" /> -->
      <el-table-column width="160px" label="操作" align="center">
        <template #default="{ row }">
          <router-link :to="{ path: 'peopleshow', query:{id:row.id} }" class="link-left">
          <el-button >查看</el-button>
        </router-link>
          <el-button @click="exportForm(row)">导出</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" v-model:page="queryParam.pageIndex"
      v-model:limit="queryParam.pageSize" @pagination="search" />
  </div>
</template>

<script>

import { employeePage, employeeDelete, employeeExport } from '@/api/user'
import { exportUser } from '@/api/train'
import { tree } from '@/api/department'

export default {
  name: 'EmployeeList',
  data() {
    return {
      VITE_APP_RESOURCE_URL: import.meta.env.VITE_APP_RESOURCE_URL,
      queryParam: {
        userName: null,
        realName: null,
        departmentIdList: [],
        pageIndex: 1,
        pageSize: 10
      },
      tableData: [],
      departmentTree: [],
      total: 0,
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
        this.departmentTree = re.response
      })

      this.search()
    },
    search() {
      employeePage(this.queryParam).then(data => {
        const re = data.response
        this.tableData = re.list
        this.total = re.total
        this.queryParam.pageIndex = re.pageNum
      })
    },
    userDelete(row) {
      this.$confirm('此操作将永久删除该员工, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        employeeDelete(row.id).then(re => {
          if (re.code === 1) {
            this.search()
            this.$message.success(re.message)
          } else {
            this.$message.error(re.message)
          }
        })
      })
    },
    submitForm() {
      this.queryParam.pageIndex = 1
      this.search()
    },
    clearForm() {
      this.queryParam = {
        userName: null,
        realName: null,
        departmentIdList: [],
        pageIndex: 1,
        pageSize: 10
      }
      this.search()
    },
    userExport() {
      employeeExport(this.queryParam).then(data => {
        if (data.code === 1) {
          window.open(data.response, '_blank')
        } else {
          this.$message.error(data.message)
        }
      })
    },
    uploadProgress() {
      this.loading = this.$loading({
        lock: true,
        text: '文件上传中…',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.5)'
      })
    },
    uploadExcelSuccess(re, file) {
      this.loading.close()
      if (re.code === 1) {
        this.search()
        window.location.href = re.response
      } else {
        this.$message.error(re.message)
      }
    },
    uploadError() {
      this.loading.close()
      this.$message.error('文件上传失败，请检查文件大小或文件格式')
    },
    exportForm(row) {
      exportUser(row.id).then(res => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const day = currentDate.getDate().toString().padStart(2, '0');
        const time = year + '年' + month + '月' + day + '日';
        let blob = new Blob([res], { type: "application/zip" });
        // 创建 href 超链接，点击进行下载
        window.URL = window.URL || window.webkitURL;
        let href = URL.createObjectURL(blob);
        let downA = document.createElement("a");
        downA.href = href;
        downA.download = '一人一档' + '-' + row.realName + '-' + time;
        downA.click();
        // 销毁超连接
        window.URL.revokeObjectURL(href);
      })
    },
  }
}
</script>
