<template>
  <div class="app-item-contain exam-paper-contain">

    <div class="paper-index-header">
      <div class="item-contain">
        <span class="title">试卷类型：</span>
        <div class="item-radio">
          <el-radio-group v-model="queryParam.paperType">
            <el-radio v-for="item in EnumMap.exam.paperTypeAllEnum" :key="item.key" :label="item.key"
              @click.prevent="paperTypeChange(item.key)">{{ item.value }}
            </el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="item-contain">
        <span class="title">试卷分类：</span>
        <div class="item-radio">
          <el-radio-group v-model="queryParam.examPaperArchiveId">
            <el-radio v-for="item in examPaperArchiveList" :key="item.id" :label="item.id"
              @click.prevent="examPaperArchiveChange(item.id)">{{ item.name }}
            </el-radio>
          </el-radio-group>
        </div>
      </div>
    </div>

    <div class="paper-card-contain" v-loading="listLoading" v-if="this.queryParam.paperType == 1">
      <none-show v-if="paperNoneShow" />
      <el-card v-for="item in tableData" :key="item.id" class="paper-card" shadow="hover">
        <div @click="paperClick(item)" class="wdd-link">
          <div class="index-paper-title">{{ item.name }}</div>
          <div class="index-paper-item" style="margin-top: 20px">题目数量：{{ item.questionCount }}</div>
          <div class="index-paper-item">合格分：{{ item.passScore }}</div>
          <div class="index-paper-item">试卷总分：{{ item.score }}</div>
          <div class="index-paper-item">考试时长：{{ item.suggestTimeStr }}</div>
          <div class="index-paper-item limit-time-color">开始时间：{{ item.limitStartTime }}</div>
          <div class="index-paper-item limit-time-color">结束时间：{{ item.limitEndTime }}</div>
          <div class="index-paper-item paper-start-do-button">
          </div>
        </div>
      </el-card>
    </div>
    <div class="paper-card-contain" v-loading="listLoading" v-if="this.queryParam.paperType == 3">
      <none-show v-if="paperNoneShow" />
      <el-card v-for="item in tableData" :key="item.id" class="paper-card" shadow="hover">
        <div @click="paperClick(item)" class="wdd-link">
          <div class="index-paper-title">{{ item.name }}</div>
          <div class="index-paper-item" style="margin-top: 20px">题目数量：{{ item.questionCount }}</div>
          <div class="index-paper-item paper-start-do-button">
          </div>
        </div>
      </el-card>
    </div>
    <div class="paper-card-contain" v-loading="listLoading" v-if="this.queryParam.paperType == 4">
      <none-show v-if="paperNoneShow" />
      <el-card v-for="item in tableData" :key="item.id" class="paper-card" shadow="hover">
        <div @click="everyExamClick(item)" class="wdd-link">
          <div class="index-paper-title">{{ item.name }}</div>
          <div class="index-paper-item" style="margin-top: 20px">题目数量：{{ item.questionCount }}</div>
          <div class="index-paper-item">合格分：{{ item.passScore }}</div>
          <div class="index-paper-item">试卷总分：{{ item.score }}</div>
          <div class="index-paper-item">考试时长：{{ item.suggestTimeStr }}</div>
          <div class="index-paper-item limit-time-color">开始时间：{{ item.limitStartTime }}</div>
          <div class="index-paper-item limit-time-color">结束时间：{{ item.limitEndTime }}</div>
          <div class="index-paper-item paper-start-do-button">
          </div>
        </div>
      </el-card>
    </div>
    <el-dialog title="考试口令" v-model="dialogFormVisible" width = 40% center>
      <el-form :model="form">
        <el-form-item label="请输入考试口令">
          <el-input v-model="form.secret"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="large" type="primary" @click="submitorder" style="margin-left: 85%;" >确 定</el-button>
      </div>
    </el-dialog>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParam.pageIndex"
      v-model:limit="queryParam.pageSize" @pagination="search" />

  </div>
</template>

<script>

import { EnumMap } from '@/api/EnumMap'
import { list, page as paperPage } from '@/api/examPaper'
import { page as practicePage, random,checkorder} from '@/api/practice'

export default {
  data() {
    return {
      EnumMap: EnumMap,
      queryParam: {
        paperType: 1,
        examPaperArchiveId: null,
        pageIndex: 1,
        pageSize: 10
      },
      listLoading: true,
      tableData: [],
      total: 0,
      examPaperArchiveList: [],
      paperNoneShow: false,
      dialogFormVisible:false,
      form:{
        secret:'',
        id:''
      },
      strectItem:''
    }
  },
  created() {
    list().then(re => {
      this.examPaperArchiveList = re.response
    })

    this.search()
  },
  methods: {
    examPaperArchiveChange(id) {
      if (id === this.queryParam.examPaperArchiveId) {
        this.queryParam.examPaperArchiveId = null
      } else {
        this.queryParam.examPaperArchiveId = id
      }
      this.search()
    },
    paperTypeChange(id) {
      if (id !== this.queryParam.paperType) {
        this.queryParam.paperType = id
        this.search()
      }
    },
    treeCheck(data, checked) {
      this.queryParam.examPaperArchiveIdList = checked.checkedKeys
      this.queryParam.pageIndex = 1
      this.search()
    },
    search() {
      this.listLoading = true
      let page
      if (this.queryParam.paperType === 3) {
        page = practicePage
      } else {
        page = paperPage
      }
      page(this.queryParam).then(data => {
        const re = data.response
        this.tableData = re.list
        this.total = re.total
        this.queryParam.pageIndex = re.pageNum
        this.paperNoneShow = this.total === 0
      }).finally(() => {
        this.listLoading = false
      })
    },
    paperClick(item) {
      if (this.queryParam.paperType === 3) { //模拟训练
        if (item.buildType === 3) { //随机试卷，需要生成新试卷
          random(item.id).then(re => {
            if (re.code === 1) {
              window.open(`#/practice/paper/do?id=${re.response}`, '_blank')
            } else {
              this.$message.error(re.message)
            }
          })
        } else {
          window.open(`#/practice/paper/do?id=${item.practiceExamPaperId}`, '_blank')
        }
      } else {
        let path = null
        if (item.faceCheck !== null && item.faceCheck) { //人脸识别
          path = 'face'
        } else {
          path = 'do'
        }
        window.open(`#/${path}?id=${item.id}&type=${this.queryParam.paperType}`, '_blank')
      }
    },
    everyExamClick(item) {
      this.dialogFormVisible = true
      console.log(item)
      this.strectItem = item
      this.form.id = item.id
      console.log(this.strectItem,'43423')
    },
    submitorder(){
      if (this.queryParam.paperType === 3) { //模拟训练
        if (this.strectItem.buildType === 3) { //随机试卷，需要生成新试卷
          random(this.strectItem.id).then(re => {
            if (re.code === 1) {
              window.open(`#/practice/paper/do?id=${re.response}`, '_blank')
            } else {
              this.$message.error(re.message)
            }
          })
        } else {
          window.open(`#/practice/paper/do?id=${this.strectItem.practiceExamPaperId}`, '_blank')
        }
      } else {
        let path = null
        if (this.strectItem.faceCheck !== null && this.strectItem.faceCheck) { //人脸识别
          path = 'face'
        } else {
          path = 'do'
        }
        checkorder(this.form).then(res=>{
          console.log(res)
          if(res.code == 1){
            window.open(`#/${path}?id=${this.strectItem.id}&type=${this.queryParam.paperType}`, '_blank')
          }
        })
      }
    }
  }
}
</script>
