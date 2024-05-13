<template>
  <div class="app-item-contain exam-paper-contain">
    <div class="paper-card-contain" v-loading="listLoading">
      <none-show v-if="paperNoneShow" />
      <el-card v-for="item in trainArchiveList" :key="item.id" style="width:100%;" shadow="hover">
        <div class="wdd-link" v-if="item.questionType == '1' || item.questionType == '3'">
          <div class="index-paper-title">{{ item.questionJson.title }}</div>
          <el-radio-group v-model="item.contentKey">
            <div>
              <el-radio v-for="item1 in item.questionJson.questionItemFrames" :key="item1.key" :label="item1.key">
                <span class="wdd-question-choice-prefix-marin">{{ item1.prefix }}.</span>
                <span v-html="item1.content" class="wdd-question-content"></span>
              </el-radio>
            </div>
          </el-radio-group>
          <div>标答：{{ item.questionJson.correctPrefix }}</div>
          <div>解析：{{ item.questionJson.analyze }}</div>
        </div>
        <div class="wdd-link" v-if="item.questionType == '2' || item.questionType == '6'">
          <div class="index-paper-title">{{ item.questionJson.title }}</div>
          <el-checkbox-group v-model="item.contentArrayKeyList" class="wdd-flex-column">
            <el-checkbox v-for="item1 in item.questionJson.questionItemFrames" :label="item1.key" :key="item1.key"
              class="wdd-flex-row wdd-question-choice-marin">
              <span class="wdd-question-choice-prefix-marin">{{ item1.prefix }}.</span>
              <span v-html="item1.content" class="wdd-question-content"></span>
            </el-checkbox>
          </el-checkbox-group>
          <div>标答：{{ item.questionJson.correctPrefix }}</div>
          <div>解析：{{ item.questionJson.analyze }}</div>
        </div>
        <div class="wdd-link" v-if="item.questionType == '4'">
          <div class="index-paper-title">{{ item.questionJson.title }}</div>
          <div v-html="item.contentArrayList" class="wdd-question-flex-property-right wdd-question-content">
          </div>
          <span>标答：</span><span v-for="(item1, index) in item.questionJson.questionItemFrames" :key="item1.prefix" style="margin-left: 20px;">{{ item1.content }}</span>
          <div>解析：{{ item.questionJson.analyze }}</div>
        </div>
        <div class="wdd-link" v-if="item.questionType == '5'">
          <div class="index-paper-title">{{ item.questionJson.title }}</div>
          <div class="wdd-flex-row wdd-gap-filling-items-content">
            <div>
              {{ item.questionJson.jianDacontent }}
            </div>
          </div>
          <div>标答：{{ item.questionJson.correct }}</div>
          <div>解析：{{ item.questionJson.analyze }}</div>
        </div>
      </el-card>
    </div>
    <pagination v-show="total > 0" :total="total" v-model:page="queryParam.pageIndex"
      v-model:limit="queryParam.pageSize" @pagination="search" />

  </div>
</template>

<script>

import { errorPage } from '@/api/practice'

export default {
  data() {
    return {
      queryParam: {
        pageIndex: 1,
        pageSize: 10
      },
      listLoading: true,
      total: 0,
      trainArchiveList: [],
      paperNoneShow: false,
      dialogFormVisible: false,
    }
  },
  created() {
    this.search()
  },
  methods: {
    search() {
      this.listLoading = true
      errorPage(this.queryParam).then(re => {
        console.log(re, 111)
        this.trainArchiveList = re.response.list
        this.total = re.response.total
        this.queryParam.pageIndex = re.response.pageNum
        this.paperNoneShow = this.total === 0
      }).finally(() => {
        this.listLoading = false
      })
    },


  }
}
</script>
<style>
.el-radio {
  display: block !important;
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
