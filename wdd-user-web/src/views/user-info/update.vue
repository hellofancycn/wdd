<template>
  <div class="app-item-contain">
    <el-card class="user-index-info-contain user-update-info" shadow="never">
      <info-menu url="/user/update" />
      <!-- <div class="center">
        <el-upload class="upload" action="/api/upload/folder/file" accept=".jpg,.png" :data="{ folder: 'profile' }"
          :show-file-list="false" :on-progress="uploadProgress" :on-success="uploadSuccess" :on-error="uploadError">
          <el-avatar :size="100" :src="form.imagePath" shape="circle" fit="scale-down" class="user-image">暂无头像
          </el-avatar>
        </el-upload>
      </div> -->
      <div class="right">
        <div style="margin:0 0 20px 140px;">
          <span style="margin:0 20px 0 0;">头像:</span>
          <el-upload class="upload" style="display:inline;" action="/api/upload/folder/file" accept=".jpg,.png"
            :data="{ folder: 'profile' }" :show-file-list="false" :on-progress="uploadProgress"
            :on-success="uploadSuccess" :on-error="uploadError">
            <el-avatar :size="100" :src="form.imagePath" shape="circle" fit="scale-down" class="user-image">暂无头像
            </el-avatar>
          </el-upload>
        </div>
        <el-form :model="form" ref="form" label-width="200px" v-loading="formLoading" :rules="rules">
          <el-form-item label="姓名：" prop="realName" required>
            <el-input v-model="form.realName" :disabled="disable.realName"></el-input>
          </el-form-item>
          <el-form-item label="性别：" required>
            <el-select v-model="form.sex" placeholder="性别" clearable>
              <el-option v-for="item in EnumMap.user.sexEnum" :key="item.key" :value="item.key"
                :label="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="民族：" required>
            <el-input v-model="form.form1.nation"></el-input>
          </el-form-item>
          <el-form-item label="出生年月：" required>
            <el-date-picker v-model="form.birthDay" type="date" placeholder="选择日期" value-format="YYYY-MM-DD" />
          </el-form-item>
          <el-form-item label="籍贯：" required>
            <el-input v-model="form.form1.nativePlace"></el-input>
          </el-form-item>
          <el-form-item label="健康状况：" required>
            <el-input v-model="form.form1.health"></el-input>
          </el-form-item>
          <el-form-item label="政治面貌：" required>
            <el-input v-model="form.form1.politic"></el-input>
          </el-form-item>
          <el-form-item label="入党时间：">
            <el-date-picker v-model="form.form1.partyTime" type="date" placeholder="选择日期" value-format="YYYY-MM-DD" />
          </el-form-item>
          <el-form-item label="参加工作时间：" required>
            <el-date-picker v-model="form.form1.workTime" type="date" placeholder="选择日期" value-format="YYYY-MM-DD" />
          </el-form-item>
          <title>学历学位</title>
          <el-form-item label="全日制教育：" prop="schoolEducation">
            <el-input v-model="form.form1.schoolEducation"></el-input>
          </el-form-item>
          <el-form-item label="全日制教育毕业院校及专业：" prop="schoolEducationMajor">
            <el-input v-model="form.form1.schoolEducationMajor"></el-input>
          </el-form-item>
          <el-form-item label="在职教育：" prop="jobEducation">
            <el-input v-model="form.form1.jobEducation"></el-input>
          </el-form-item>
          <el-form-item label="在职教育毕业院校及专业：" prop="jobEducationMajor">
            <el-input v-model="form.form1.jobEducationMajor"></el-input>
          </el-form-item>
          <el-form-item label="工作单位及职务/工种：" required>
            <el-input v-model="form.form1.workUnitType"></el-input>
          </el-form-item>
          <el-form-item label="通信地址及邮编：" prop="mailAddressCode">
            <el-input v-model="form.form1.mailAddressCode"></el-input>
          </el-form-item>
          <el-form-item label="身份证号：" prop="idCard" required>
            <el-input v-model="form.idCard" :disabled="disable.idCard"></el-input>
          </el-form-item>
          <el-form-item label="联系电话：" prop="phone" required>
            <el-input v-model="form.phone"></el-input>
          </el-form-item>
          <el-form-item label="电子邮箱：" prop="email" required>
            <el-input v-model="form.email"></el-input>
          </el-form-item>
          <el-form-item label="工作简介：" prop="jobResume">
            <el-input v-model="form.form1.jobResume" type="textarea"></el-input>
          </el-form-item>
          <!-- <div style="margin:0 0 20px 140px;">
            <span style="margin:0 20px 0 0;">证书:</span>
            <el-upload class="upload" style="display:inline;" action="/api/upload/folder/file" accept=".jpg,.png"
              :data="{ folder: 'profile' }" :show-file-list="false" :on-progress="uploadProgress"
              :on-success="uploadSuccess" :on-error="uploadError">
              <el-avatar :size="100" :src="form.imagePath" shape="square" fit="scale-down" class="user-image">暂无证书
              </el-avatar>
            </el-upload>
          </div>
          <el-form-item label="证书到期日期：">
            <el-date-picker v-model="form.form1.partyTime" type="date" placeholder="选择日期" value-format="YYYY-MM-DD" />
          </el-form-item> -->
          <el-form-item>
            <el-button type="primary" @click="submitForm" size="large" class="wdd-primary-button-color">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import InfoMenu from './components/info-menu.vue'
import { EnumMap } from '@/api/EnumMap'
import useStore from '@/store'
import { getCurrentUser, update } from '@/api/user'

const { user } = useStore()

export default {
  components: { InfoMenu },
  data() {
    return {
      EnumMap: EnumMap,
      form: {
        realName: null,
        sex: null,
        idCard: null,
        phone: null,
        email: null,
        age: null,
        createTime: null,
        imagePath: null,
        workNo: null,
        jobTitle: null,
        form1: {
          nation: null,
          birthDay: null,
          nativePlace: null,
          health: null,
          politic: null,
          partyTime: null,
          workTime: null,
          mailAddressCode: null,
          schoolEducation: null,
          schoolEducationMajor: null,
          jobEducation: null,
          jobEducationMajor: null,
          workUnitType: null,
          jobResume: null,
          trainAttendance: null,
          unitOpinion: null,
          trainOpinion: null,
        }
      },
      formLoading: false,
      rules: {
        realName: [{ required: true, message: '请输入真实姓名' }],
        sex: [{ required: true, message: '请选择性别' }],
        nation: [{ required: true, message: '请输入民族' }],
        health: [{ required: true, message: '请输入健康状况' }],
        nativePlace: [{ required: true, message: '请输入籍贯' }],
        politic: [{ required: true, message: '请输入政治面貌' }],
        phone: [{ required: true, message: '请输入手机号' }],
        idCard: [{ required: true, message: '请输入身份证号' }],
        workNo: [{ required: true, message: '请输入工号' }],
        workUnitType: [{ required: true, message: '请输入工作单位及职务/工种' }],
        email: [
          { required: true, message: '请输入邮箱' },
          { type: 'email', message: '请输入正确的邮箱地址' }
        ],
        age: [{ type: 'number', message: '年龄必须为数字值' }],
      },
      disable: {
        realName: false,
        idCard: false,
        workNo: false,
        jobTitle: false
      }
    }
  },
  created() {
    getCurrentUser().then(re => {
      this.form = re.response
      this.form.form1 = re.response.userExtend
      this.disableForm()
      console.log(re.response)
    })
  },
  methods: {
    disableForm() {
      if (this.form.realName !== null && this.form.realName.length > 0) {
        this.disable.realName = true
      }
      if (this.form.idCard !== null && this.form.idCard.length > 0) {
        this.disable.idCard = true
      }
      if (this.form.workNo !== null && this.form.workNo.length > 0) {
        this.disable.workNo = true
      }
      if (this.form.jobTitle !== null && this.form.jobTitle.length > 0) {
        this.disable.jobTitle = true
      }
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
      this.loading.close()
      if (re.code === 1) {
        this.form.imagePath = re.response
      } else {
        this.$message.error(re.message)
      }
    },
    uploadError() {
      this.loading.close()
      this.$message.error('文件上传失败，请检查文件大小或文件格式')
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.formLoading = true
          update(this.form).then(data => {
            console.log(data)
            if (data.code === 1) {
              user.updateRealName(this.form.realName)
              this.disableForm()
              this.$message.success(data.message)
            } else {
              this.$message.error(data.message)
            }
          }).finally(() => {
            this.formLoading = false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
