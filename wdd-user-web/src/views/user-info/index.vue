<template>
  <div class="app-item-contain">
    <el-card class="user-index-info-contain user-index-info" shadow="never">

      <info-menu url="/user/index" />

      <div class="center">
        <div>
          <span>用户名：</span><span>{{ userInfo.userName }}</span>
        </div>
        <div>
          <span>姓名：</span><span>{{ userInfo.realName }}</span>
        </div>
        <div>
          <span>性别：</span><span>{{ sexFormatter(userInfo.sex) }}</span>
        </div>
        <div>
          <span>民族：</span><span>{{ userExtend.nation }}</span>
        </div>
        <div>
          <span>出生年月：</span><span>{{ userInfo.birthDay }}</span>
        </div>
        <div>
          <span>籍贯：</span><span>{{ userExtend.nativePlace }}</span>
        </div>
        <div>
          <span>健康状况：</span><span>{{ userExtend.health }}</span>
        </div>
        <div>
          <span>政治面貌：</span><span>{{ userExtend.politic }}</span>
        </div>
        <div>
          <span>入党时间：</span><span>{{ userExtend.partyTime }}</span>
        </div>
        <div>
          <span>参加工作时间：</span><span>{{ userExtend.workTime }}</span>
        </div>
        <div>
          <span>全日制教育：</span><span>{{ userExtend.schoolEducation }}</span>
        </div>
        <div>
          <span>毕业院校及专业：</span><span>{{ userExtend.schoolEducationMajor }}</span>
        </div>
        <div>
          <span>在职教育：</span><span>{{ userExtend.jobEducation }}</span>
        </div>
        <div>
          <span>毕业院校及专业：</span><span>{{ userExtend.jobEducationMajor }}</span>
        </div>
        <div>
          <span>工作单位及职务/工种：</span><span>{{ userExtend.workUnitType }}</span>
        </div>
        <div>
          <span>身份证号：</span><span>{{ userInfo.idCard }}</span>
        </div>
        <div>
          <span>通信地址及邮编：</span><span>{{ userExtend.mailAddressCode }}</span>
        </div>
        <div>
          <span>手机号：</span><span>{{ userInfo.phone }}</span>
        </div>
        <div>
          <span>电子邮箱：</span><span>{{ userInfo.email }}</span>
        </div>
        <div>
          <span>工作简介：</span><span>{{ userExtend.jobResume }}</span>
        </div>
        <!-- <div>
          <div>证书：</div>
          <el-avatar :src="userInfo.imagePath" shape="shape" fit="scale-down" :size="200" class="user-image">暂无证书
          </el-avatar>
        </div>
        <div>
          <span>证书到期时间：</span><span>{{ userExtend.jobResume }}</span>
        </div> -->
        <!-- <div>
          <span>参加培训考核情况：</span><span>{{ userExtend.trainAttendance }}</span>
        </div>
        <div>
          <span>学员所在单位意见：</span><span>{{ userExtend.unitOpinion }}</span>
        </div>
        <div>
          <span>培训意见：</span><span>{{ userExtend.trainOpinion }}</span>
        </div> -->
        <!-- <div>
          <span>工号：</span><span>{{ userInfo.workNo }}</span>
        </div> -->
        <!-- <div>
          <span>年龄：</span><span>{{ userInfo.age }}</span>
        </div> -->
        <div>
          <span>注册时间：</span><span>{{ userInfo.createTime }}</span>
        </div>
      </div>
      <div class="right">
        <!-- <div>
          <span>人员类别：</span><span>{{ userInfo.departmentStr }}</span>
        </div> -->
        <!-- <div>
          <span>职位：</span><span>{{ userInfo.jobTitle }}</span>
        </div> -->
        <el-avatar :src="userInfo.imagePath" shape="circle" fit="scale-down" :size="100" class="user-image">暂无头像
        </el-avatar>
        <el-button class="export" type="primary" @click="exportYryd">一人一档导出</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { EnumMap, Format } from '@/api/EnumMap'
import InfoMenu from './components/info-menu.vue'
import { getCurrentUser, exportYryd } from '@/api/user'

export default {
  components: { InfoMenu },
  data() {
    return {
      userInfo: {},
      userExtend: {}
    }
  },
  created() {
    this.infoLoad()
  },
  methods: {
    infoLoad() {
      getCurrentUser().then(re => {
        this.userInfo = re.response
        if (re.response.userExtend == null) {
          this.userExtend = {}
        } else {
          this.userExtend = re.response.userExtend
        }
        console.log(re)
      })
    },
    sexFormatter(value) {
      return Format(EnumMap.user.sexEnum, value)
    },
    exportYryd() {
      exportYryd(this.userInfo.id).then(res => {
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
        downA.download = '一人一档' + '-' + this.userInfo.realName + '-' + time;
        downA.click();
        // 销毁超连接
        window.URL.revokeObjectURL(href);
      })
    }
  }
}
</script>import { useAttrs } from 'element-plus'
