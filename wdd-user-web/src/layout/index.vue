<template>
  <el-container style="height:100%;">
    <el-header class="user-header">
      <el-menu class="el-menu-title" :ellipsis="false" mode="horizontal" :default-active="defaultUrl"
               :router="true"
               background-color="#fff" text-color="#606266" active-text-color="#68bfd6">
        <el-menu-item index="/index">首 页</el-menu-item>
        <el-menu-item index="/announcement/index">通知公告</el-menu-item>
        <el-menu-item index="/paper/index">考试</el-menu-item>
        <el-menu-item index="/train/index">培训</el-menu-item>
        <el-menu-item index="/record/index">考试记录</el-menu-item>
        <el-menu-item index="/errorRecord/index">错题记录</el-menu-item>
        <el-menu-item index="/forum/index">交流互动</el-menu-item>
      </el-menu>
      <div class="user-info">
        <el-dropdown placement="bottom">
          <div class="user-info-name">
            <el-icon>
              <User/>
            </el-icon>
            <span class="user-name">{{ userName }}</span>
            <span v-if="realName !== null && realName !== 'null' && realName !== ''"> - {{
                realName
              }}</span>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="$router.push({path:'/user/index'})">个人信息</el-dropdown-item>
              <el-dropdown-item @click="$router.push({path:'/user/update'})">更新信息</el-dropdown-item>
              <el-dropdown-item @click="$router.push({path:'/user/passwordChange'})">修改密码
              </el-dropdown-item>
              <!-- <el-dropdown-item @click="$router.push({path:'/user/apply'})">我的报名</el-dropdown-item> -->
              <el-dropdown-item @click="$router.push({path:'/user/comment'})">我的评论</el-dropdown-item>
              <el-dropdown-item @click="$router.push({path:'/user/train'})">我的培训</el-dropdown-item>
              <el-dropdown-item @click="$router.push({path:'/user/credential'})">我的证书
              </el-dropdown-item>
              <el-dropdown-item @click="$router.push({path:'/user/event'})">个人动态</el-dropdown-item>
              <el-dropdown-item @click="logout" divided>退出</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>

    <el-main class="user-main">
      <router-view/>
    </el-main>
    
    <!-- <div class="foot-copyright">
      <span>{{ copyright }}</span>
    </div> -->
    <back-to-top :visibility-height="100" :back-position="0" transition-name="fade" ref="backTop"/>
  </el-container>
</template>


<script setup lang="ts">
import {watch, reactive, ref, toRefs} from 'vue';
import {ElDialog, ElMessage, ElMessageBox} from 'element-plus';
import {User} from '@element-plus/icons-vue';
import BackToTop from '@/components/BackToTop/index.vue'
import {useRouter} from 'vue-router';
import useStore from '@/store';
import {feedback} from '@/api/user'

const {user} = useStore();
const router = useRouter();

const userName = user.userName;
const realName = user.realName;
const copyright = import.meta.env.VITE_APP_COPYRIGHT;

const feedbackFormRef = ref(ElDialog);

const state = reactive({
  defaultUrl: '/index',
  feedbackVisible: false,
  feedbackForm: {
    contact: null,
    content: null
  },
  feedbackFormRules: {
    contact: [
      {required: true, message: '请输入联系方式'},
      {max: 255, message: '长度小于255个字符'}
    ],
    content: [
      {required: true, message: '请输入意见内容'},
      {max: 500, message: '长度小于500个字符'}
    ]
  }
});

const {
  defaultUrl, feedbackVisible, feedbackForm, feedbackFormRules
} = toRefs(state);

state.defaultUrl = routeSelect(router.currentRoute.value.path) as any

function routeSelect(path) {
  const pathTree = [{root: '/', child: []},
    {root: '/index', child: []},
    {root: '/announcement/index', child: ['/announcement/detail']},
    {root: '/forum/index', child: ['/forum/add', '/forum/select']},
    {root: '/apply/index', child: []},
    {root: '/paper/index', child: []},
    {root: '/train/index', child: ['/train/detail']},
    {root: '/record/index', child: []},
    {root: '/errorRecord/index', child: []},
    {root: '/credential/index', child: []}
  ]

  for (let i = 0; i < pathTree.length; i++) {
    let item = pathTree[i]
    if (item.root === path) {
      return item.root
    }
    if (item.child.indexOf(path) !== -1) {
      return item.root
    }
  }

  return null
}


function logout() {
  ElMessageBox.confirm('确定注销并退出系统吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    user
        .logout()
        .then(() => {
          router.push(`/login`);
        });
  });
}

function feedbackClick() {
  state.feedbackForm = {
    contact: null,
    content: null
  }
  state.feedbackVisible = true
}

function confirmFeedBack() {
  feedbackFormRef.value.validate((valid) => {
    if (valid) {
      feedback(state.feedbackForm).then(data => {
        if (data.code === 1) {
          state.feedbackVisible = false
          ElMessage.success('意见反馈提交成功')
        } else {
          ElMessage.error(data.message)
        }
      })
    }
  })
}


watch(() => router.currentRoute.value.path, (toPath) => {
  state.defaultUrl = routeSelect(toPath) as any
})
</script>
