<template>
  <div class="app-container">
    <el-form :model="form" ref="form" label-width="100px" v-loading="formLoading" :rules="rules">
      <el-form-item label="姓名：" prop="name" required>
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="职位：" prop="title" required>
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item label="电话：" prop="linkPhone" required>
        <el-input v-model="form.linkPhone" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {edit} from '@/api/trainTeacher'
import useStore from '@/store'

const {tagsView} = useStore()

export default {
  name: 'TrainExamPaperEdit',
  data() {
    return {
      form: {
        id: null,
        name: '',
        linkPhone: '',
        title: ''
      },
      formLoading: false,
      rules: {
        name: [
          {required: true, message: '请输入班主任名称', trigger: 'blur'}
        ],
        title: [
          {required: true, message: '请输入班主任职位', trigger: 'blur'}
        ],
        linkPhone: [
          {required: true, message: '请输入班主任电话', trigger: 'blur'},
          { pattern: /^1\d{10}$/, message: '电话格式不正确', trigger: 'blur' }
        ],
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
                this.$router.push('/train/exam/paper/list')
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
        id: null,
        title: null,
        name: '',
        linkPhone: ''
      }
      this.$refs['form'].resetFields()
    }
  }
}
</script>
