<template>
  <div class="app-container">
    <el-form :model="form" ref="form" label-width="200px" v-loading="formLoading"  :rules="rules" >
      <el-form-item label="手机号：" prop="user.userName" required>
        <el-input v-model="form.user.userName" ></el-input>
      </el-form-item>
      <el-form-item label="密码：">
        <el-input v-model="form.user.password" type="password"></el-input>
      </el-form-item>
      <el-form-item label="姓名：" prop="user.realName"  required>
        <el-input v-model="form.user.realName"></el-input>
      </el-form-item>
      <el-form-item label="职称：" prop="departmentId" >
        <el-tree-select v-model="form.user.departmentId" :data="departmentTree" check-strictly :render-after-expand="true"
          default-expand-all placeholder="职称" />
      </el-form-item>
      <!-- <el-form-item label="职位：" prop="jobTitle">
        <el-input v-model="form.user.jobTitle"></el-input>
      </el-form-item>
      <el-form-item label="工号：" prop="workNo">
        <el-input v-model="form.user.workNo"></el-input>
      </el-form-item>
      <el-form-item label="身份证号：" prop="user.idCard" >
        <el-input v-model="form.user.idCard"></el-input>
      </el-form-item>
      <el-form-item label="年龄：" prop="user.age">
        <el-input v-model.number="form.user.age"></el-input>
      </el-form-item> -->
      <!-- <el-form-item label="性别：">
        <el-select v-model="form.user.sex" placeholder="性别" clearable>
          <el-option v-for="item in EnumMap.user.sexEnum" :key="item.key" :value="item.key"
                     :label="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="出生日期：">
        <el-date-picker v-model="form.user.birthDay" value-format="YYYY-MM-DD" type="date" placeholder="选择日期"/>
      </el-form-item> -->
      <!-- <el-form-item label="手机：" prop="phone">
        <el-input v-model="form.user.phone"></el-input>
      </el-form-item> -->
      <el-form-item label="邮箱：" prop="user.email" required>
        <el-input v-model="form.user.email"></el-input>
      </el-form-item>
      <!-- <el-form-item label="民族：" prop="userExtend.nation">
        <el-input v-model="form.userExtend.nation"></el-input>
      </el-form-item>
      <el-form-item label="籍贯：" prop="nativePlace">
        <el-input v-model="form.userExtend.nativePlace"></el-input>
      </el-form-item>
      <el-form-item label="健康状况：" prop="health">
        <el-input v-model="form.userExtend.health"></el-input>
      </el-form-item>
      <el-form-item label="政治面貌：" prop="politic">
        <el-input v-model="form.userExtend.politic"></el-input>
      </el-form-item>
      <el-form-item label="入党时间：">
        <el-date-picker v-model="form.userExtend.partyTime" type="date" placeholder="选择日期" value-format="YYYY-MM-DD" />
      </el-form-item>
      <el-form-item label="参加工作时间：">
        <el-date-picker v-model="form.userExtend.workTime" type="date" placeholder="选择日期" value-format="YYYY-MM-DD" />
      </el-form-item>
      <el-form-item label="全日制教育：" prop="schoolEducation">
        <el-input v-model="form.userExtend.schoolEducation"></el-input>
      </el-form-item>
      <el-form-item label="全日制教育毕业院校及专业：" prop="schoolEducationMajor">
        <el-input v-model="form.userExtend.schoolEducationMajor"></el-input>
      </el-form-item>
      <el-form-item label="在职教育：" prop="jobEducation">
        <el-input v-model="form.userExtend.jobEducation"></el-input>
      </el-form-item>
      <el-form-item label="在职教育毕业院校及专业：" prop="jobEducationMajor">
        <el-input v-model="form.userExtend.jobEducationMajor"></el-input>
      </el-form-item>
      <el-form-item label="工作单位及职务/工种：" prop="workUnitType">
        <el-input v-model="form.userExtend.workUnitType"></el-input>
      </el-form-item>
      <el-form-item label="通信地址及邮编：" prop="mailAddressCode">
        <el-input v-model="form.userExtend.mailAddressCode"></el-input>
      </el-form-item> -->
      <el-form-item label="状态：" prop="status" >
        <el-select v-model="form.user.status" placeholder="状态">
          <el-option v-for="item in EnumMap.user.statusEnum" :key="item.key" :value="item.key"
            :label="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { EnumMap } from '@/api/EnumMap'
import { employeeSelect, employeeEdit } from '@/api/user'
import { tree } from '@/api/department'
import useStore from '@/store'

const { tagsView } = useStore()

export default {
  name: 'EmployeeEdit',
  data() {
    return {
      EnumMap: EnumMap,
      form: {
        user:{
          id: null,
          userName: null,
          password: null,
          realName: null,
          idCard: null,
          workNo: null,
          imagePath: null,
          jobTitle: null,
          systemRole: 1,
          status: 1,
          age: null,
          sex: null,
          birthDay: null,
          phone: null,
          email: null,
          departmentId: null
        },
        userExtend:{
          health:null,
          jobEducation:null,
          jobEducationMajor:null,
          jobResume:null,
          mailAddressCode:null,
          nation:null,
          nativePlace:null,
          partyTime:null,
          politic:null,
          schoolEducation:null,
          schoolEducationMajor:null,
          trainAttendance:null,
          trainOpinion:null,
          unitOpinion:null,
          workTime:null,
          workUnitType:null
        }
      },
      departmentTree: [],
      formLoading: false,
      userNameDisable: false,
      rules: {
        "user.userName": [{ required: true, message: '请输入手机号' }],
        "user.idCard": [{ required: true, message: '请输入身份证号' }],
        "user.realName": [{ required: true, message: '请输入真实姓名' }, {
          max: 255,
          message: '长度小于255个字符'
        }],
        "user.age": [{ type: 'number', message: '年龄必须为数字值' }],
        "user.email": [{ required: true, message: '请输入邮箱' }],
      }
    }
  },
  created() {
    let id = this.$route.query.id

    if (id && parseInt(id) !== 0) {
      this.formLoading = true
      employeeSelect(id).then(re => {
        console.log(re)
        this.form = re.response
        this.userNameDisable = true
      }).finally(() => {
        this.formLoading = false
      })
    }

    tree().then(re => {
      this.departmentTree = re.response
    })
  },
  methods: {
    submitForm() {
      console.log('23123')
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.formLoading = true
          employeeEdit(this.form).then(re => {
            if (re.code === 1) {
              this.$message.success(re.message)
              tagsView.delCurrentView(this).then(() => {
                this.$router.push('/user/employee/list')
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
    uploadProgress() {
      this.loading = this.$loading({
        lock: true,
        text: '文件上传中…',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.5)'
      })
    },
    uploadSuccess(re, file) {
      console.log(re,'图片')
      this.loading.close()
      if (re.code === 1) {
        this.form.user.imagePath = re.response.path
      } else {
        this.$message.error(re.message)
      }
    },
    uploadError() {
      this.loading.close()
      this.$message.error('文件上传失败，请检查文件大小或文件格式')
    },
    resetForm() {
      this.form = {
        id: null,
        userName: null,
        password: null,
        realName: null,
        idCard: null,
        workNo: null,
        imagePath: null,
        jobTitle: null,
        systemRole: 1,
        status: 1,
        age: null,
        sex: null,
        birthDay: null,
        phone: null,
        email: null,
        departmentId: null
      }
      this.$refs['form'].resetFields()
    }
  }
}
</script>
