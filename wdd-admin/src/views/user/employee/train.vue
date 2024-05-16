<template>
  <div class="app-container">
    <el-form :model="queryParam" ref="queryForm" :inline="true">
      <el-form-item label="violation：">
        <el-input v-model="queryParam.violation" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">查询</el-button>
        <el-button @click="clearForm">重置</el-button>
        <el-button type="primary" @click="showDialog = true;dialogTitle = '新增'">添加</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" border fit highlight-current-row style="width: 100%">
      <el-table-column width="60px" align="center">
        <template #default="{row}">
          <el-avatar :size="35" :src="row.imagePath" class="user-image-avatar"></el-avatar>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="Id" width="90px"/>
      <el-table-column prop="trainClassname" label="trainClassname"/>
      <el-table-column prop="trainUnit" label="trainUnit"/>
      <el-table-column prop="classHour" label="classHour"/>
      <el-table-column prop="checkResult" label="checkResult"/>
      <el-table-column prop="note" label="note"/>
      <el-table-column prop="userRealName" label="userRealName"/>
      <el-table-column prop="phone" label="phone"/>
      <el-table-column prop="trainBeginTime" label="培训开始时间"/>
      <el-table-column prop="trainEndTime" label="培训结束时间"/>
      <el-table-column width="160px" label="操作" align="center">
        <template #default="{ row }">
          <el-button size="small" class="wdd-button-mini" @click="editItem(row)">编辑</el-button>
          <el-button type="danger" @click="userDelete(row)" size="small" class="wdd-button-mini link-left">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
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
    <el-dialog v-model="showDialog" :title="dialogTitle" width="800px">
      <el-form :model="form" ref="form" label-width="140px" :rules="rules">
        <el-form-item label="violation：" prop="violation" required>
          <el-input v-model="form.violation" placeholder="请输入字典值编码" clearable />
        </el-form-item>
        <el-form-item label="violationLevel：" prop="violationLevel" required>
          <el-input v-model="form.violationLevel" placeholder="请输入字典值名称" clearable />
        </el-form-item>
        <el-form-item label="violationResult：" prop="violationResult" required>
          <el-input v-model="form.violationResult" placeholder="请输入字典值名称" clearable />
        </el-form-item>
        <el-form-item label="note：" prop="note" required>
          <el-input v-model="form.note" placeholder="请输入字典值名称" clearable />
        </el-form-item>
        <el-form-item label="violationTime：" prop="violationTime" required>
          <el-date-picker
            v-model="form.violationTime"
            type="date"
            style="width: 100%"
            value-format="YYYY-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary" @click="sureAdd">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { userExtendTrainPage, userExtendTrainInsert, userExtendTrainDelete, userExtendTrainUpdate } from '@/api/user'

export default {
  name: 'EmployeeTrain',
  data() {
    return {
      queryParam: {
        pageIndex: 1,
        pageSize: 10,
        userId: '',
        violation: ''
      },
      tableData: [],
      total: 0,
      canLoad: true,
      showDialog: false,
      form: {
        id: '',
        violation: '',
        violationLevel: '',
        violationResult: '',
        note: '',
        violationTime: '',
        userId: ''
      },
      rules: {
        dictValue: [
          {required: true, message: '请输入字典值编码', trigger: 'blur'}
        ],
        dictLabel: [
          {required: true, message: '请输入字典值名称', trigger: 'blur'}
        ],
        dictSort: [
          {required: true, message: '请输入序号', trigger: 'blur'}
        ],
        status: [
          {required: true, message: '请选择是否启用', trigger: 'change'}
        ]
      },
      dialogTitle: '新增'
    }
  },
  mounted() {
    this.queryParam.userId = this.$route.query.userId
    this.form.userId = this.$route.query.userId
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
      userExtendTrainPage(this.queryParam).then(data => {
        const re = data.response
        this.tableData = re.list
        this.total = re.total
        this.queryParam.pageIndex = re.pageNum
      })
    },
    userDelete(row) {
      this.$confirm('将执行删除操作, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        userExtendTrainDelete(row.id).then(re => {
          if (re.code === 1) {
            this.search()
            this.$message.success(re.message)
          } else {
            this.$message.error(re.message)
          }
        })
      })
    },
    editItem(row) {
      for(const i in this.form) {
        this.form[i] = row[i]
      }
      this.showDialog = true
      this.dialogTitle = '编辑'
    },
    submitForm() {
      this.queryParam.pageIndex = 1
      this.search()
    },
    clearForm() {
      this.queryParam.pageIndex = 1
      this.queryParam.violation = ''
      this.search()
    },
    handleSizeChange(val) {
      this.queryParam.pageSize = val
      this.search()
    },
    handleCurrentChange(val) {
      this.queryParam.pageIndex = val
      this.search()
    },
    sureAdd() {
      if (this.form.id) {
        userExtendTrainUpdate(this.form).then(res => {
          if (res.code === 1) {
            this.$message.success(res.message)
            this.showDialog = false
            this.search()
          } else {
            this.$message.error(res.message)
          }
        })
      } else {
        userExtendTrainInsert(this.form).then(res => {
          if (res.code === 1) {
            this.$message.success(res.message)
            this.showDialog = false
            this.search()
          } else {
            this.$message.error(res.message)
          }
        })
      }
    },
  }
}
</script>
