<template>
  <div class="app-container">
    <el-form :model="queryParam" ref="queryForm" :inline="true">
      <el-form-item label="违规违章行为：">
        <el-input v-model="queryParam.violation" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">查询</el-button>
        <el-button @click="clearForm">重置</el-button>
        <el-button type="primary" @click="add">添加</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="tableData"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column prop="userRealName" label="姓名" />
      <el-table-column prop="trainBeginTime" label="违规时间" />
      <el-table-column prop="trainClassname" label="违规违章行为" />
      <el-table-column prop="trainUnit" label="违规违章级别" />
      <el-table-column prop="classHour" label="追责处理结果" />
      <el-table-column prop="checkResult" label="追责处理结果" />
      <el-table-column prop="phone" label="联系电话" />
      <el-table-column prop="trainUnit" label="追责处理结果" />
      <el-table-column prop="note" label="备注" />
      <el-table-column width="160px" label="操作" align="center">
        <template #default="{ row }">
          <el-button size="small" class="wdd-button-mini" @click="editItem(row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            @click="userDelete(row)"
            size="small"
            class="wdd-button-mini link-left"
            >删除
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
      :total="total"
    >
    </el-pagination>
    <el-dialog
      v-model="showDialog"
      :title="dialogTitle"
      width="800px"
      center="true"
    >
      <el-form :model="form" ref="form" label-width="140px" :rules="rules">
        <el-form-item label="违规违章行为：" prop="checkResult" required>
          <el-input
            v-model="form.checkResult"
            placeholder="请输入违规违章行为"
            clearable
          />
        </el-form-item>
        <el-form-item label="违规违章级别：" prop="classHour" required>
          <el-input
            v-model="form.classHour"
            placeholder="请输入违规违章级别"
            clearable
          />
        </el-form-item>
        <el-form-item label="追责处理结果：" prop="trainClassname" required>
          <el-input
            v-model="form.trainClassname"
            placeholder="请输入追责处理结果"
            clearable
          />
        </el-form-item>

        <el-form-item label="追责处理结果：" prop="trainUnit" required>
          <el-input
            v-model="form.trainUnit"
            placeholder="请输入追责处理结果"
            clearable
          />
        </el-form-item>
        <el-form-item label="备注：" prop="note" required>
          <el-input v-model="form.note" placeholder="请输入备注" clearable />
        </el-form-item>
        <el-form-item label="违规时间：" prop="trainBeginTime" required>
          <el-date-picker
            v-model="form.trainBeginTime"
            type="date"
            style="width: 100%"
            value-format="YYYY-MM-DD"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="违规时间：" prop="trainEndTime" required>
          <el-date-picker
            v-model="form.trainEndTime"
            type="date"
            style="width: 100%"
            value-format="YYYY-MM-DD"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: right">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary" @click="sureAdd">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  userExtendTrainPage,
  userExtendTrainInsert,
  userExtendTrainDelete,
  userExtendTrainUpdate
} from '@/api/user';

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
        checkResult: '',
        classHour: '',
        trainClassname: '',
        trainUnit: '',
        trainBeginTime: '',
        trainEndTime: '',
        userId: ''
      },
      rules: {
        dictValue: [
          { required: true, message: '请输入字典值编码', trigger: 'blur' }
        ],
        dictLabel: [
          { required: true, message: '请输入字典值名称', trigger: 'blur' }
        ],
        dictSort: [{ required: true, message: '请输入序号', trigger: 'blur' }],
        status: [
          { required: true, message: '请选择是否启用', trigger: 'change' }
        ]
      },
      dialogTitle: '新增'
    };
  },
  mounted() {
    this.queryParam.userId = this.$route.query.userId;
    this.form.userId = this.$route.query.userId;
    this.init();
    this.canLoad = false;
  },
  activated() {
    this.init();
  },
  deactivated() {
    this.canLoad = true;
  },
  methods: {
    init() {
      if (!this.canLoad) {
        return;
      }
      this.search();
    },
    search() {
      userExtendTrainPage(this.queryParam).then(re => {
        // const re = re.response;
        this.tableData = re.list;
        this.total = re.total;
        this.queryParam.pageIndex = re.pageNum;
      });
    },
    userDelete(row) {
      this.$confirm('将执行删除操作, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        userExtendTrainDelete({ id: row.id }).then(re => {
          if (re.code === 1) {
            this.search();
            this.$message.success(re.message);
          } else {
            this.$message.error(re.message);
          }
        });
      });
    },
    editItem(row) {
      for (const i in this.form) {
        this.form[i] = row[i];
      }
      this.showDialog = true;
      this.dialogTitle = '编辑';
    },
    submitForm() {
      this.queryParam.pageIndex = 1;
      this.search();
    },
    clearForm() {
      this.queryParam.pageIndex = 1;
      this.queryParam.violation = '';
      this.search();
    },
    handleSizeChange(val) {
      this.queryParam.pageSize = val;
      this.search();
    },
    handleCurrentChange(val) {
      this.queryParam.pageIndex = val;
      this.search();
    },
    add() {
      this.showDialog = true;
      this.dialogTitle = '新增';
      this.resetForm();
    },
    sureAdd() {
      if (this.form.id) {
        userExtendTrainUpdate(this.form).then(res => {
          if (res.code === 1) {
            this.$message.success(res.message);
            this.showDialog = false;
            this.search();
          } else {
            this.$message.error(res.message);
          }
        });
        this.resetForm();
      } else {
        userExtendTrainInsert(this.form).then(res => {
          if (res.code === 1) {
            this.$message.success(res.message);
            this.showDialog = false;
            this.search();
          } else {
            this.$message.error(res.message);
          }
          this.resetForm();
        });
      }
    },
    resetForm() {
      this.form.id = '';
      this.form.violation = '';
      this.form.violationLevel = '';
      this.form.violationResult = '';
      this.form.note = '';
      this.form.violationTime = '';
      this.$refs['form'].resetFields();
    }
  }
};
</script>
