<template>
  <div class="app-container">
    <el-form :model="form" ref="form" label-width="100px" v-loading="formLoading" :rules="rules">
      <el-form-item label="字典类型：" prop="dictType" required>
        <el-input v-model="form.dictType" />
      </el-form-item>
      <el-form-item label="字典名称：" prop="dictName" required>
        <el-input v-model="form.dictName" />
      </el-form-item>
      <el-form-item label="字典说明：" prop="remark">
        <el-input v-model="form.remark" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {edit} from '@/api/dictManagement'
import useStore from '@/store'

const {tagsView} = useStore()

export default {
  name: 'DictManagementEdit',
  data() {
    return {
      form: {
        id: null,
        dictType: '',
        dictName: '',
        remark: ''
      },
      formLoading: false,
      rules: {
        dictType: [
          {required: true, message: '请输入字典类型', trigger: 'blur'}
        ],
        dictName: [
          {required: true, message: '请输入字典名称', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.formLoading = true
          edit(this.form).then(re => {
            if (re.code === 1) {
              this.$message.success(re.message)
              tagsView.delCurrentView(this).then(() => {
                this.$router.push('/base/dictData/list')
              })
            } else {
              this.$message.error(re.message)
            }
          }).finally(() => {
            this.formLoading = false
          })
        } else {
          return false
        }
      })
    },
    resetForm() {
      this.form = {
        dictId: null,
        dictType: '',
        dictName: '',
        remark: ''
      }
      this.$refs['form'].resetFields()
    }
  },
  mounted() {
    this.form.dictId = this.$route.query.dictId
  }
}
</script>
