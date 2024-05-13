<template>
  <div class="app-item-contain train-contain">
    <none-show v-if="trainNoneShow"/>
    <div v-else>
      <el-card shadow="never">
        <div class="train-head">
          <div>
            <div class="train-name">{{ train.name }}</div>
            <div class="train-item-label">课程数量：{{ train.itemCount }}</div>
            <div class="train-item-label">课程时长：{{ train.studyTimeStr }}</div>
            <div class="train-item-label">开始时间：{{ train.startTime }}</div>
            <div class="train-item-label">结束时间：{{ train.endTime }}</div>
            <div class="train-description train-tab-content" v-html="train.description"></div>
          </div>
          <div>
            <img :src="train.coverPath" style="width: 240px;height: 135px"/>
          </div>
        </div>
      </el-card>
       <!-- <el-tab-pane label="描述" name="description"> -->
        <!-- <div class="train-description train-tab-content" v-html="train.description"></div> -->
        <!-- </el-tab-pane> -->
      <el-tabs v-model="activeName" type="border-card" class="train-content-tab">
        <el-tab-pane label="课程" name="course">
          <div class="train-tab-content">
            <div v-for="item in train.courseWareList" :key="item.itemOrder" @click="courseWatch(item)">
              <div class="train-course-item">
                <div class="train-course-item-left">
                  <el-icon>
                    <video-play v-if="item.fileType === 1"/>
                    <document v-else-if="item.fileType === 2"/>
                  </el-icon>
                </div>
                <div class="train-course-item-content">{{ item.itemOrder }}. {{ item.name }}</div>
                <div class="train-course-item-right" v-if="item.trainUserItemId !== null">
                  <el-progress :text-inside="true" :stroke-width="20" :status="item.status === 2 ? 'success':''" :percentage="item.percentage">
                    <div class="progress-content">{{ item.currentNumberStr }} / {{ item.passNumberStr }}</div>
                  </el-progress>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="试卷" name="examPaper">
          <none-show v-if="paperNoneShow"/>
          <div class="train-tab-content train-exam-paper-tab" v-else>
            <div class="train-paper-card" @click="paperDo(train.examPaper)">
              <div>{{ train.examPaper.name }}</div>
              <div class="paper-item-des" style="margin-top: 10px">合格分：{{ train.examPaper.passNumber }}</div>
              <div class="paper-item-des">总分：{{ train.examPaper.maxNumber }}</div>
              <div class="paper-item-des">考试次数：{{ train.examPaper.allowCount }}</div>
            </div>

            <div class="train-paper-record">
              <el-table :data="train.examPaper.answerList" style="width: 100%" row-class-name="">
                <el-table-column prop="paperName" label="名称"/>
                <el-table-column label="正确题数" width="100">
                  <template #default="{row}">{{ row.questionCorrect }} / {{ row.questionCount }}</template>
                </el-table-column>
                <el-table-column label="得分" width="100" sortable :sort-by="['userScore']">
                  <template #default="{row}">{{ row.userScore }} / {{ row.paperScore }}</template>
                </el-table-column>
                <el-table-column prop="doTime" label="耗时" width="100"/>
                <el-table-column prop="statusStr" label="状态" width="80"/>
                <el-table-column prop="passedStr" label="合格" width="80"/>
                <el-table-column prop="createTime" label="创建时间" width="180"/>
              </el-table>
              <div class="train-paper-table-foot">
                <span class="foot-item">考试结果：
                  <el-tag v-if="train.examPaper.status === 1" effect="dark">{{ train.examPaper.statusStr }}</el-tag>
                  <el-tag v-if="train.examPaper.status === 2" type="success" effect="dark">{{ train.examPaper.statusStr }}</el-tag>
                  <el-tag v-if="train.examPaper.status === 3" type="danger" effect="dark">{{ train.examPaper.statusStr }}</el-tag>
                </span>
                <span class="foot-item">完成时间：{{ train.examPaper.completeTime }}</span>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="证书" name="credential">
          <none-show v-if="credentialNoneShow"/>
          <div class="train-tab-content tab-credential-tab" v-else>
            <el-image style="height: 400px" :src="train.credential.credentialImagePath"
                      :preview-src-list="[train.credential.credentialImagePath]" :preview-teleported="true"
                      :hide-on-click-modal="true"></el-image>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>

</template>

<script>

import {VideoPlay, Document} from '@element-plus/icons-vue'
import {select, start} from '@/api/train'

export default {
  components: {VideoPlay, Document},
  data() {
    return {
      activeName: 'course',
      trainNoneShow: false,
      paperNoneShow: false,
      credentialNoneShow: false,
      train: {
        examPaper: {},
        credential: {
          credentialImagePath: null
        }
      },
      trainId: null
    }
  },
  created() {
    let id = this.$route.query.id
    if (id && parseInt(id) !== 0) {
      this.trainId = id
      select(id).then(re => {
        if (re.code === 1) {
          let response = re.response
          this.paperNoneShow = response.examPaper === null
          this.credentialNoneShow = response.credential === null
          response.description = response.description.replaceAll('\n', '<br/>')
          this.train = response
        } else {
          this.$message.error(re.message)
        }
      }).finally(() => {

      })
    }
  },
  methods: {
    async courseWatch(item) {
      await this.checkStart(item, 1)
      if (item.fileType === 1) {
        window.open(`#/course/ware/video?uId=${item.trainUserItemId}&cId=${item.targetId}`, '_blank')
      } else if (item.fileType === 2) {
        window.open(`#/course/ware/pdf?uId=${item.trainUserItemId}&cId=${item.targetId}`, '_blank')
      }
    },
    async paperDo(item) {
      await this.checkStart(item, 2)
      window.open(`#/train/paper/do?uId=${item.trainUserItemId}&pId=${item.targetId}`, '_blank')
    },
    async checkStart(trainItem, type) {
      if (null == trainItem.trainUserItemId) {
        let res = await start(this.trainId)
        this.train = res.response
        if (type === 1) {
          this.train.courseWareList.forEach(item => {
            if (item.targetId === trainItem.targetId) {
              trainItem.trainUserItemId = item.trainUserItemId
            }
          })
        } else if (type === 2) {
          trainItem.trainUserItemId = this.train.examPaper.trainUserItemId
        }
      }
    }
  }
}
</script>
