<template>
  <div>
    <div>
      <img src="@/assets/banner.jpg" class="carousel-img">
    </div>

    <div class="app-item-contain">
      <el-card class="index-paper-show" shadow="never">
        <div class="announcement-index-card-contain" v-loading="announcementListLoading">
          <none-show customer-style="no-data-layout-index" v-if="announcementNoneShow"/>
          <div v-for="(item, index) in announcementTableData" :key="index">
            <span class="index-title-h3" style="background-color: #d9a287">{{item.name}}</span>
            <div class="announcement-index-contain">
              <!-- <img :src="item.imageSrc" class="announcement-image"> -->
              <div class="announcement-title-contain">
                <div class="announcement-title">
                  <router-link :to="{path:'/announcement/detail',query:{id:item.id}}"
                               class="announcement-link">
                    <el-tag effect="dark" type="" class="announcement-tag" v-if="item.overhead">顶置
                    </el-tag>
                    <el-tag effect="dark" type="danger" class="announcement-tag"
                            v-if="item.importanted">
                      重要
                    </el-tag>
                    {{ item.title }}
                  </router-link>
                </div>
                <div class="announcement-time">发布时间：{{ item.createTime }}</div>
              </div>
            </div>
            <div class="line" v-if="index !== announcementTableData.length-1"></div>
          </div>
        </div>
      </el-card>
      <!-- <el-card> -->
        <!-- <span class="index-title-h3" style="background-color: #d9a287">培训</span> -->
        <!-- <div class="course-index-content"> -->
      <!-- <div class="course-card-contain" v-loading="listLoading">
        <none-show v-if="trainNoneShow"/>
        <router-link v-for="item in tableData" :key="item.id" :to="{path:'/train/detail', query:{id:item.id}}"
                     class="urlLink">
          <el-card class="course-card" shadow="hover">
            <img class="course-image" :src="item.coverPath"/>
            <div class="course-name">
              {{ item.name }}
            </div>
            <div class="course-child-item">
              共{{ item.itemCount }}节 | {{ item.studyTimeStr }}
            </div>
          </el-card>
        </router-link>
      </div> -->
    <!-- </div> -->
      <!-- </el-card> -->
    </div>

  </div>
  <div class="account-foot-copyright">
      <span>{{ VITE_APP_COPYRIGHT }}</span>
    </div>
</template>

<script>

import {page as announcementPage} from '@/api/announcement'
// import {page} from '@/api/train'

export default {
  data() {
    return {
      announcementListLoading: true,
      announcementTableData: [],
      announcementNoneShow: false,
      tableData: []
    }
  },
  created() {
    this.announcementLoad()
    // page(this.queryParam).then(data => {
    //     const re = data.response
    //     this.tableData = re.list
    //     this.queryParam.pageIndex = re.pageNum
    //   })
  },
  methods: {
    announcementLoad() {
      this.announcementListLoading = true
      announcementPage({pageIndex: 1, pageSize: 5}).then(data => {
        const re = data.response
        this.announcementTableData = re.list
        this.announcementNoneShow = re.total === 0
      }).finally(() => {
        this.announcementListLoading = false
      })
    }
  }
}
</script>
