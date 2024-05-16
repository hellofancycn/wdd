<template>
  <div class="app-container">
    <div class="detail-title">
      {{ $route.query.dictName }}（{{ queryParam.dictType }}）
    </div>
    <el-form :model="queryParam" ref="queryForm" :inline="true">
      <el-form-item label="字典值名称：">
        <el-input v-model="queryParam.dictLabel" clearable />
      </el-form-item>
      <el-form-item label="字典值编码：">
        <el-input v-model="queryParam.dictValue" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">查询</el-button>
        <el-button @click="clearForm">重置</el-button>
        <el-button type="primary" @click="showDialog = true">添加</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column prop="dictType" label="dictId" />
      <el-table-column
        prop="dictValue"
        label="字典值编码"
        show-overflow-tooltip
      />
      <el-table-column
        prop="dictLabel"
        label="字典值名称"
        show-overflow-tooltip
      />
      <el-table-column prop="dictSort" label="序号" show-overflow-tooltip />
      <el-table-column prop="status" label="是否启用" show-overflow-tooltip>
        <template #default="{ row }">
          <el-tag
            :type="row.status === '0' ? 'danger' : 'success'"
            v-if="row.status === '0'"
            >禁用</el-tag
          >
          <el-tag
            :type="row.status === '1' ? 'success' : 'danger'"
            v-if="row.status === '1'"
            >启用</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="字典值说明" show-overflow-tooltip />
      <el-table-column width="150px" label="操作" align="center">
        <template #default="{ row }">
          <el-button
            v-has-perm="['base:dict:update']"
            class="wdd-button-mini"
            size="small"
            @click="eidt(row)"
            >编辑
          </el-button>

          <el-button
            type="danger"
            @click="examPaperDelete(row)"
            class="link-left wdd-button-mini"
            size="small"
            v-has-perm="['base:dict:delete']"
            >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParam.pageIndex"
      v-model:limit="queryParam.pageSize"
      @pagination="search"
    />
    <el-dialog v-model="showDialog" :title="dialogTitle" width="800px">
      <el-form :model="form" ref="form" label-width="140px" :rules="rules">
        <el-form-item label="字典值编码：" prop="dictValue" required>
          <el-input
            v-model="form.dictValue"
            placeholder="请输入字典值编码"
            clearable
          />
        </el-form-item>
        <el-form-item label="字典值名称：" prop="dictLabel" required>
          <el-input
            v-model="form.dictLabel"
            placeholder="请输入字典值名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="序号：" prop="dictSort" required>
          <el-input-number
            v-model="form.dictSort"
            :min="1"
            :controls="false"
            placeholder="请输入序号"
          />
        </el-form-item>
        <el-form-item label="是否启用：" prop="status" required>
          <el-checkbox v-model="form.status" true-label="1" false-label="0" />
        </el-form-item>
        <el-form-item label="字典值说明：">
          <el-input
            v-model="form.remark"
            placeholder="请输入字典值说明"
            clearable
          />
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
import {
  dataListPage,
  dataListAdd,
  deleteDataApi,
  editData
} from '@/api/dictManagement';
export default {
  name: 'DictDetail',
  data() {
    return {
      queryParam: {
        dictLabel: '',
        dictType: '',
        pageIndex: 1,
        pageSize: 10,
        status: ''
      },
      tableData: [],
      total: 0,
      examPaperArchiveTree: [],
      canLoad: true,
      showDialog: false,
      dialogTitle: '',
      form: {
        dictCode: '',
        dictType: '',
        dictLabel: '',
        dictValue: '',
        remark: '',
        dictSort: undefined,
        status: '1'
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
      }
    };
  },
  mounted() {
    this.queryParam.dictType = this.$route.query.dictType;
    this.form.dictType = this.$route.query.dictType;
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
      dataListPage(this.queryParam).then(data => {
        const re = data.response;
        this.tableData = re.list;
        this.total = re.total;
        this.queryParam.pageIndex = re.pageNum;
      });
    },
    submitForm() {
      this.queryParam.pageIndex = 1;
      this.search();
    },
    clearForm() {
      this.queryParam = {
        pageIndex: 1,
        pageSize: 10
      };
      this.search();
    },
    sureAdd() {
      editData(this.form).then(res => {
        if (res.code === 1) {
          this.$message.success(res.message);
          this.showDialog = false;
          this.search();
        } else {
          this.$message.error(res.message);
        }
      });
    },
    examPaperDelete(row) {
      this.$confirm('将执行删除操作, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDataApi({ dictCodes: [row.dictCode] }).then(re => {
          if (re.code === 1) {
            this.search();
            this.$message.success(re.message);
          } else {
            this.$message.error(re.message);
          }
        });
      });
    },
    eidt(row) {
      this.dialogTitle = '编辑字典值';
      this.showDialog = true;
      this.form = {
        dictCode: row.dictCode,
        dictType: row.dictType,
        dictLabel: row.dictLabel,
        dictValue: row.dictValue,
        remark: row.remark,
        dictSort: row.dictSort,
        status: row.status
      };
    }
  }
};
</script>
<style>
.detail-title {
  color: #409eff;
  font-size: 14px;
  line-height: 30px;
  margin-bottom: 15px;
}
</style>
