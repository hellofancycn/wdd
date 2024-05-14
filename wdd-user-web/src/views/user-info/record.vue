<template>
  <div class="app-item-contain">
    <el-card class="user-index-info-contain user-index-info" shadow="never">

      <info-menu url="/user/record" />

      <div>
        <el-form :model="queryParam" ref="queryForm" :inline="true" style="margin-top: 20px;">
          <el-form-item label="时间：">
            <el-input v-model="queryParam.violationTime" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitform">查询</el-button>
            <el-button @click="clearForm">重置</el-button>
            <el-button type="primary" @click="addshowdialog">添加</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="tableData" border fit highlight-current-row style="width: 100%">
          <el-table-column prop="violationTime" label="时间" width="180px" align="center" />
          <el-table-column prop="violation" label="违规违章行为" width="200px" align="center" />
          <el-table-column prop="violationLeveliolation" label="级别" width="140px" align="center" />
          <el-table-column prop="violationResult" label="追责处理结果" width="180px" align="center" />
          <el-table-column prop="note" label="备注" width="150px" align="center" />
          <el-table-column width="170px" label="操作" align="center">
            <template #default="{ row }">
              <el-button @click="examinePageUpdate(row, 0)" size="small">
                编辑
              </el-button>
              <el-button type="danger" @click="examinePageDelete(row)" size="small">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" v-model:page="queryParam.pageIndex"
          v-model:limit="queryParam.pageSize" @pagination="search" />
      </div>
    </el-card>
    <!-- 添加 -->
    <el-dialog v-model="examinePage.showDialog" width="30%" class="question-select-dialog">
      <el-form :model="examinePage.queryParam" :inline="true" label-width="150px" size="mini" :rules="rules">
        <el-form-item label="时间">
          <el-input v-model="examinePage.queryParam.violationTime" placeholder="请输入xxxx年xx月xx日"></el-input>
        </el-form-item>
        <el-form-item label="违规违章行为">
          <el-input v-model="examinePage.queryParam.violation" placeholder="请输入违规违章行为" clearable></el-input>
        </el-form-item>
        <el-form-item label="级别">
          <el-input v-model="examinePage.queryParam.violationLeveliolation" placeholder="请输入级别" clearable></el-input>
        </el-form-item>
        <el-form-item label="追责处理结果">
          <el-input v-model="examinePage.queryParam.violationResult" placeholder="请输入追责处理结果" clearable></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="examinePage.queryParam.note" placeholder="请输入备注" clearable></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="submitForm">提交</el-button>
      <el-button @click="resetForm">重置</el-button>
    </el-dialog>
    <!-- 编辑 -->
    <el-dialog v-model="updatePage.showDialog" width="30%" class="question-select-dialog" :rules="rules">
      <el-form :model="updatePage.queryParam" :inline="true" label-width="150px">
        <el-form-item label="时间">
          <el-input v-model="updatePage.queryParam.violationTime" placeholder="请输入xxxx年xx月xx日"></el-input>
        </el-form-item>
        <el-form-item label="违规违章行为">
          <el-input v-model="updatePage.queryParam.violation" placeholder="请输入违规违章行为" clearable></el-input>
        </el-form-item>
        <el-form-item label="级别">
          <el-input v-model="updatePage.queryParam.violationLeveliolation" placeholder="请输入级别" clearable></el-input>
        </el-form-item>
        <el-form-item label="追责处理结果">
          <el-input v-model="updatePage.queryParam.violationResult" placeholder="请输入追责处理结果" clearable></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="updatePage.queryParam.note" placeholder="请输入备注" clearable></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="updateForm">提交</el-button>
    </el-dialog>
  </div>
</template>

<script>
import { EnumMap, Format } from '@/api/EnumMap'
import InfoMenu from './components/info-menu.vue'
import { violationInsert, violationUpdate, violationDelete, violationList } from '@/api/user'
export default {
  components: { InfoMenu },
  data() {
    return {
      queryParam: {
        pageIndex: 1,
        pageSize: 10,
        violationTime: null
      },
      tableData: [],
      total: 0,
      examinePage: {
        showDialog: false,
        queryParam: {
          violationTime: null,
          violation: null,
          violationLeveliolation: null,
          violationResult: null,
          note: null,
        }
      },
      updatePage: {
        showDialog: false,
        queryParam: {
          violationTime: null,
          violation: null,
          violationLeveliolation: null,
          violationResult: null,
          note: null,
        }
      },
    }
  },
  created() {
    this.search()
  },
  methods: {
    search() {
      violationList(this.queryParam).then(res => {
        console.log(res, '424234')
        this.tableData = res.response.list
        this.total = res.response.total
        this.queryParam.pageIndex = res.response.pageIndex
      })
    },
    sexFormatter(value) {
      return Format(EnumMap.user.sexEnum, value)
    },
    addshowdialog() {
      this.examinePage.showDialog = true
    },
    submitForm() {
      violationInsert(this.examinePage.queryParam).then(res => {
        console.log(res)
        if (res.code = '1') {
          this.search()
          this.examinePage.showDialog = false
          this.$message.success('res.message')
        } else {
          this.$message.error('re.message')
        }
      })
    },
    resetForm() {
      this.examinePage.queryParam = {
        trainBeginTime: null,
        trainEndTime: null,
        trainClassname: null,
        trainUnit: null,
        classHour: null,
        checkResult: null,
        note: null
      }
      this.$refs['examinePage.queryParam'].resetFields()
    },
    examinePageUpdate(row) {
      console.log(row, 'id')
      const a = this.tableData.filter(item => item.id == row.id)
      this.updatePage.queryParam = a[0]
      this.updatePage.showDialog = true
      console.log(this.updatePage.queryParam, 'ty78767')
    },
    examPaperBuildDelete(row) {
      console.log(row)
      this.$confirm('此操作将永久删除该培训, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        violationDelete(row.id).then(re => {
          console.log(re)
          if (re.code = '1') {
            this.search()
            this.$message.success('re.message')
          } else {
            this.$message.error('re.message')
          }
        })
      })
    },
    updateForm() {
      violationUpdate(this.updatePage.queryParam).then(res => {
        if (res.code = '1') {
          this.$message.success('res.message')
          this.search()
        } else {
          this.$message.success('res.message')
        }
        this.updatePage.showDialog = false
      })
    },
    submitform() {
      this.queryParam.pageIndex = 1
      this.search()
    },
    clearForm() {
      this.queryParam = {
        violationTime: null,
        pageIndex: 1,
        pageSize: 10
      }
      this.search()
    }
  }
}
</script>