<template>
    <div class="app-container">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-form ref="form" :model="form" label-width="170px" :rules="rules">
                <el-tab-pane label="培训计划" name="first">
                    <el-form-item label="培训分类：">
                        <el-tree-select v-model="form.plan.train.trainArchiveId" :data="trainArchiveTree" check-strictly
                            :render-after-expand="true" default-expand-all placeholder="分类" disabled />
                    </el-form-item>

                    <el-form-item label="培训单位：" prop="plan.train.trainingUnit" required>
                        <el-input v-model="form.plan.train.trainingUnit" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="培训班名称：" prop="plan.train.name" required>
                        <el-input v-model="form.plan.train.name" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="培训对象：" required>
                        <div class="paper-user">
                            <el-tag v-for="user in form.trainUserList" :key="user.id" @close="removeUser(user)"
                                >{{
            user.realName }} - {{ user.userName }}
                            </el-tag>
                        </div>
                    </el-form-item>
                    <el-form-item label="培训方式：" prop="plan.train.trainingFangshi" required>
                        <el-input v-model="form.plan.train.trainingFangshi" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="培训类型：" prop="plan.train.trainingType" required>
                        <el-input v-model="form.plan.train.trainingType" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="培训日期：" required>
                        <el-date-picker v-model="form.plan.train.startTime" placeholder="选择开始时间"
                            value-format="YYYY-MM-DD HH:mm:ss" type="datetime" disabled>
                        </el-date-picker>
                        <el-date-picker v-model="form.plan.train.endTime" placeholder="选择结束时间"
                            value-format="YYYY-MM-DD HH:mm:ss" type="datetime" disabled>
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="培训地点：" prop="plan.train.trainingAdress">
                        <el-input v-model="form.plan.train.trainingAdress" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="封面：" prop="coverPath" required>
                        <el-upload accept=".jpg,.png" name="file" :data="{ folder: 'train/course' }"
                            action="/api/upload/folder/file" :show-file-list="false" :on-progress="uploadProgress"
                            :on-success="uploadImageSuccess" :on-error="uploadError">
                            <el-image style="width: 350px; height: 200px" :src="form.plan.train.coverPath"
                                fit="fill"></el-image>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="培训描述：" prop="plan.traindescription">
                        <el-input v-model="form.plan.train.description" type="textarea" rows="8" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="课程列表：" required>
                        <el-tabs type="border-card" class="train-tab">
                            <el-tab-pane label="课程">
                                <div>
                                    <draggable class="train-course-ware-content" item-key="index"
                                        group="courseWareItemList" handle=".drag"
                                        v-model="form.plan.courseWareItemList">
                                        <template #item="{ index, element }">
                                            <div class="train-course-ware">
                                                <div class="train-course-ware-action">
                                                    <el-button size="small" circle
                                                        @click="courseWarePreview(element.previewPath)">
                                                        <el-icon>
                                                            <icon-view />
                                                        </el-icon>
                                                    </el-button>
                                                </div>
                                                <div class="train-course-ware-content drag">{{ element.name }}</div>
                                                <div class="train-course-ware-time">
                                                    <div>合格时长：</div>
                                                    <el-input class="train-course-ware-input" placeholder="00:00:00"
                                                        :formatter="(value) => `${value}`.replace(/[^\d|:]/g, '')"
                                                        v-model.trim="element.passNumberStr" required />
                                                    <div class="max-number-time">总时长：{{ element.maxNumberStr }}</div>
                                                </div>
                                                <!-- <div class="train-course-ware-action">
                                                    <el-button type="danger" circle @click="courseWareRemove(index)">
                                                        <el-icon>
                                                            <icon-delete />
                                                        </el-icon>
                                                    </el-button>
                                                </div> -->
                                            </div>
                                        </template>
                                    </draggable>
                                </div>
                                <!-- <div>
                                    <el-button type="primary" @click="addCourseWare">添加课程</el-button>
                                </div> -->
                            </el-tab-pane>
                            <el-tab-pane label="试卷">
                                <div class="train-course-ware" v-if="form.plan.examPaperItem.targetId">
                                    <div class="train-course-ware-action">
                                        <el-button size="small" circle
                                            @click="examPaperPreview(form.plan.examPaperItem.targetId)">
                                            <el-icon>
                                                <icon-view />
                                            </el-icon>
                                        </el-button>
                                    </div>
                                    <div class="train-course-ware-content">{{ form.plan.examPaperItem.name }}</div>
                                    <div class="train-course-ware-time">
                                        <div class="train-exam-paper-limit">
                                            <div class="train-exam-paper-limit-item">
                                                <div class="train-exam-paper-limit-item-label">合格分：</div>
                                                <el-input-number v-model="form.plan.examPaperItem.passNumberStr"
                                                    :precision="1" :step="1" :max="maxPassScore" :min="0.1"
                                                    required></el-input-number>
                                            </div>
                                            <div class="train-exam-paper-limit-item" style="margin-top: 5px">
                                                <div class="train-exam-paper-limit-item-label">考试次数：</div>
                                                <el-input-number v-model="form.plan.examPaperItem.allowCount" :step="1"
                                                    :max="100" :min="0" required></el-input-number>
                                            </div>
                                        </div>
                                        <div class="max-number-time">试卷总分：{{ form.plan.examPaperItem.maxNumberStr }}
                                        </div>
                                    </div>
                                </div>
                            </el-tab-pane>
                            <el-tab-pane label="证书">
                                <div class="train-course-ware" v-if="form.plan.credentialItem.targetId">
                                    <div class="train-course-ware-action">
                                        <el-button size="small" circle
                                            @click="credentialShow(form.plan.credentialItem.targetId)">
                                            <el-icon>
                                                <icon-view />
                                            </el-icon>
                                        </el-button>
                                    </div>
                                    <div class="train-credential-content">
                                        <el-image style="width: 50px; height: 50px"
                                            :src="form.plan.credentialItem.templateImagePath" fit="fill" />
                                        <div class="train-credential-content-company">{{ form.plan.credentialItem.name
                                            }}</div>
                                    </div>
                                </div>
                            </el-tab-pane>
                        </el-tabs>
                    </el-form-item>
                    <el-form-item label="排序：" prop="train.itemOrder">
                        <el-input-number v-model="form.plan.train.itemOrder" :precision="0" :step="1" :min="0"
                            :max="9999999"></el-input-number> </el-form-item>
                    <h4>班主任：</h4>
                    <el-form-item label="姓名：" prop="plan.train.trainingTeacher" required>
                        <el-input v-model="form.plan.train.trainingTeacher" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="电话：" prop="plan.train.trainingTeacherPhone" required>
                        <el-input v-model="form.plan.train.trainingTeacherPhone" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱或微信：" prop="plan.train.trainingTeacherWechat">
                        <el-input v-model="form.plan.train.trainingTeacherWechat" disabled></el-input>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="培训班课程安排" name="second">
                    <div v-for="(item, index) in form.course" :key="index" class="question">
                        <el-form-item label="课程内容：" prop="courseContent">
                            <el-input v-model="form.course[index].courseContent" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="课时：" prop="courseTime">
                            <el-input v-model="form.course[index].courseTime" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="授课教师：" prop="courseTeacher">
                            <el-input v-model="form.course[index].courseTeacher" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="职位职称：" prop="courseTeacherTitle">
                            <el-input v-model="form.course[index].courseTeacherTitle" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="备注：" prop="remark">
                            <el-input v-model="form.course[index].remark" type="textarea" disabled></el-input>
                        </el-form-item>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="老师签到" name="three">
                    <el-table :data="form.teacherSign" width="1000px">
                        <el-table-column prop="docUrl" label="文件" width="800px">
                        </el-table-column>
                        <el-table-column width="300px" label="操作" align="center">
                            <template #default="{ row }">
                                <el-button type="success" @click="teacherSignShow(row)"
                                    class="link-left wdd-button-mini" size="small">查看
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="综合考评报告" name="fourth">
                    <el-form-item label="基本情况：" prop="report.part1" required>
                        <el-input v-model="form.report.part1" type="textarea"></el-input>
                    </el-form-item>
                    <el-form-item label="学业落实：" prop="report.part2" required>
                        <el-input v-model="form.report.part2" type="textarea"></el-input>
                    </el-form-item>
                    <el-form-item label="课程的落实：" prop="report.part3" required>
                        <el-input v-model="form.report.part3" type="textarea"></el-input>
                    </el-form-item>
                    <el-form-item label="培训成效：" prop="report.part4" required>
                        <el-input v-model="form.report.part4" type="textarea"></el-input>
                    </el-form-item>
                    <el-form-item label="存在问题：" prop="report.part5" required>
                        <el-input v-model="form.report.part5" type="textarea"></el-input>
                    </el-form-item>
                    <el-form-item label="建议和措施：" prop="report.part6" required>
                        <el-input v-model="form.report.part6" type="textarea"></el-input>
                    </el-form-item>
                    <el-form-item label="培训机构负责人人员类别：" prop="report.createUserDept" required>
                        <el-input v-model="form.report.createUserDept"></el-input>
                    </el-form-item>
                </el-tab-pane>
            </el-form>
        </el-tabs>
    </div>
</template>

<script>

import { EnumMap } from '@/api/EnumMap'
import { employeePage } from '@/api/user'
import { numberConvert, disabledDate } from '@/utils'
import { Delete as IconDelete, View as IconView } from '@element-plus/icons-vue'
import { tree as archiveTree } from '@/api/trainArchive'
import { tree as courseWareTree } from '@/api/courseWareArchive'
import { tree as examPaperTree } from '@/api/examPaperArchive'
import { tree } from '@/api/department'
import { select, edit } from '@/api/train'
import { page as courseWarePage } from '@/api/courseWare'
import { page as examPaperPage } from '@/api/trainExamPaper'
import { page as credentialPage, select as credentialSelect, preview as credentialPreview } from '@/api/credential'
import useStore from '@/store'
import draggable from 'vuedraggable'
import courseAdd from '@/views/train/course-ware/edit.vue'
import examAdd from '@/views/train/exam-paper/edit.vue'


const { tagsView } = useStore()

export default {
    name: 'TimeShow',
    components: { IconDelete, IconView, draggable, courseAdd, examAdd },
    data() {
        return {
            EnumMap: EnumMap,
            disabledDate: disabledDate,
            tabPosition: 'top',
            courseList: [],
            dialogVisible: false,
            form: {
                plan: {
                    train: {
                        id: null,
                        trainArchiveId: null,
                        offline: null,
                        trainingUnit: null,
                        trainingUnitAdress: null,
                        name: null,
                        trainingFangshi: null,
                        trainingType: null,
                        trainingDateStart: null,
                        trainingDateEnd: null,
                        trainingAdress: null,
                        trainingTeacher: null,
                        trainingTeacherPhone: null,
                        trainingTeacherWechat: null,
                        coverPath: null,
                        description: null,
                        itemOrder: null,
                        startTime: null,
                        endTime: null
                    },
                    courseWareItemList: [],
                    examPaperItem: {},
                    credentialItem: {},
                },
                trainUserList: [],
                course: [],
                report: {
                    part1: null,
                    part2: null,
                    part3: null,
                    part4: null,
                    part5: null,
                    part6: null,
                    createUserDept: null,
                },
                teacherSign: []
            },
            rules: {
                "plan.train.trainingUnit": [
                    { required: true, message: '请输入培训单位', trigger: 'blur' }
                ],
                "plan.train.trainingType": [
                    { required: true, message: '请输入培训类型', trigger: 'blur' }
                ],
                "plan.train.trainingFangshi": [
                    { required: true, message: '请输入培训方式', trigger: 'blur' }
                ],
                "plan.train.trainingTeacher": [
                    { required: true, message: '请输入班主任姓名', trigger: 'blur' }
                ],
                "plan.train.trainingTeacherPhone": [
                    { required: true, message: '请输入班主任电话', trigger: 'blur' }
                ],
                "plan.train.name": [
                    { required: true, message: '请输入培训班名称', trigger: 'blur' }
                ],
                "report.part1": [
                    { required: true, message: '请输入基本情况', trigger: 'blur' }],
                "report.part2": [
                    { required: true, message: '请输入学业落实', trigger: 'blur' }],
                "report.part3": [
                    { required: true, message: '请输入课程的落实', trigger: 'blur' }],
                "report.part4": [
                    { required: true, message: '请输入培训成效', trigger: 'blur' }],
                "report.part5": [
                    { required: true, message: '请输入存在问题', trigger: 'blur' }],
                "report.part6": [
                    { required: true, message: '请输入建议和措施', trigger: 'blur' },
                ],
                "report.createUserDept": [
                    { required: true, message: '请输入培训机构负责人人员类别', trigger: 'blur' },
                ],
            },
            courseFrom: {
                courseContent: null,
                courseTime: null,
                courseTeacher: null,
                courseTeacherTitle: null,
                remark: null,
            },
            list: {
                docUrl: null
            },
            dialogImageUrl: '',
            activeName: 'first',
            userPageDialog: false,
            userPage: {
                queryParam: {
                    userName: null,
                    realName: null,
                    departmentIdList: [],
                    excludeDepartmentIdList: [],
                    status: 1,
                    pageIndex: 1,
                    pageSize: 10
                },
                listLoading: false,
                tableData: [],
                total: 0
            },
            courseWarePage: {
                showDialog: false,
                addCourse: false,
                queryParam: {
                    name: null,
                    fileType: null,
                    courseWareArchiveIdList: [],
                    selectIdList: [],
                    pageIndex: 1,
                    pageSize: 10
                },
                tableData: [],
                total: 0
            },
            examPaperPage: {
                showDialog: false,
                examAdd: false,
                queryParam: {
                    name: null,
                    examPaperArchiveIdList: [],
                    selectIdList: [],
                    pageIndex: 1,
                    pageSize: 10
                },
                tableData: [],
                total: 0
            },
            credentialPage: {
                showDialog: false,
                queryParam: {
                    name: null,
                    selectIdList: [],
                    pageIndex: 1,
                    pageSize: 10
                },
                tableData: [],
                total: 0
            },
            formLoading: false,
            departmentTree: [],
            trainArchiveTree: [],
            courseWareArchiveTree: [],
            examPaperArchiveTree: []
        }
    },
    computed: {
        maxPassScore: function () {
            let sumScore = this.form.plan.examPaperItem.maxNumberStr
            if (undefined !== sumScore && null !== sumScore && sumScore > 0) {
                return Number(sumScore)
            }
            return 100
        }
    },
    created() {
        let id = this.$route.query.id

        if (id && parseInt(id) !== 0) {
            this.formLoading = true
            select(id).then(re => {
                this.form = re.response
                console.log(re.response, '表单数据')
                if (this.form.plan.examPaperItem.passNumberStr) {
                    this.form.plan.examPaperItem.passNumberStr = numberConvert(this.form.plan.examPaperItem.passNumberStr)
                }
            }).finally(() => {
                this.formLoading = false
            })
        }

        tree().then(re => {
            console.log(re)
            this.departmentTree = re.response
        })

        archiveTree().then(re => {
            this.trainArchiveTree = re.response
        })

        courseWareTree().then(re => {
            this.courseWareArchiveTree = re.response
        })

        examPaperTree().then(re => {
            this.examPaperArchiveTree = re.response
        })
    },
    methods: {
        uploadProgress() {
            this.loading = this.$loading({
                lock: true,
                text: '文件上传中…',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.5)'
            })
        },
        uploadImageSuccess(re, file) {
            this.loading.close()
            this.form.plan.train.coverPath = re.response.path
        },
        upload(re, file) {
            this.loading.close()
            this.list.docUrl = re.response.path
            this.form.teacherSign.push(this.list)
            console.log(this.form.teacherSign)
        },
        uploadError() {
            this.loading.close()
            this.$message.error('文件上传失败，请检查文件大小或文件格式')
        },
        addCourseWare() {
            this.courseWareSearch()
            this.courseWarePage.showDialog = true
        },
        courseWareAdd() {
            this.courseWarePage.addCourse = true
        },
        courseWareSearch() {
            this.courseWarePage.queryParam.selectIdList = []
            for (const item of this.form.plan.courseWareItemList) {
                this.courseWarePage.queryParam.selectIdList.push(item.targetId)
            }
            courseWarePage(this.courseWarePage.queryParam).then(data => {
                const re = data.response
                this.courseWarePage.tableData = re.list
                this.courseWarePage.total = re.total
                this.courseWarePage.queryParam.pageIndex = re.pageNum
            })
        },
        courseWareClear() {
            this.courseWarePage.queryParam = {
                name: null,
                fileType: null,
                courseWareArchiveIdList: [],
                selectIdList: [],
                pageIndex: 1,
                pageSize: 10
            }
            this.courseWareSearch()
        },
        courseWareClick(row) {
            this.form.plan.courseWareItemList.push({
                targetType: 1,
                name: row.name,
                targetId: row.id,
                passNumber: null,
                passNumberStr: null,
                maxNumber: row.maxLength,
                maxNumberStr: row.maxLengthStr,
                previewPath: row.previewPath,
                fileType: row.fileType
            })
            this.courseWarePage.showDialog = false
        },
        courseWareRemove(index) {
            this.form.plan.courseWareItemList.splice(index, 1)
        },
        courseWarePreview(url) {
            window.open(url, '_blank')
        },
        addExamPaper() {
            this.examPaperSearch()
            this.examPaperPage.showDialog = true
        },
        examPaperSearch() {
            this.examPaperPage.queryParam.selectIdList = []
            if (null != this.form.plan.examPaperItem.targetId) {
                this.examPaperPage.queryParam.selectIdList.push(this.form.plan.examPaperItem.targetId)
            }
            examPaperPage(this.examPaperPage.queryParam).then(data => {
                const re = data.response
                this.examPaperPage.tableData = re.list
                this.examPaperPage.total = re.total
                this.examPaperPage.queryParam.pageIndex = re.pageNum
            })
        },
        examPaperClear() {
            this.examPaperPage.queryParam = {
                name: null,
                examPaperArchiveIdList: [],
                selectIdList: [],
                pageIndex: 1,
                pageSize: 10
            }
            this.examPaperSearch()
        },
        examAdd() {
            this.examPaperPage.examAdd = true
        },
        examPaperClick(row) {
            this.form.plan.examPaperItem = {
                targetType: 2,
                name: row.name,
                targetId: row.id,
                passNumber: null,
                passNumberStr: null,
                allowCount: null,
                maxNumberStr: row.score
            }
            this.examPaperPage.showDialog = false
        },
        examPaperRemove() {
            this.form.plan.examPaperItem = {}
        },
        examPaperPreview(id) {
            window.open(`/#/train/exam/paper/show?id=${id}`, '_blank')
        },
        addCredential() {
            this.credentialSearch()
            this.credentialPage.showDialog = true
        },
        credentialSearch() {
            this.credentialPage.queryParam.selectIdList = []
            if (null != this.form.plan.credentialItem.targetId) {
                this.credentialPage.queryParam.selectIdList.push(this.form.plan.credentialItem.targetId)
            }
            credentialPage(this.credentialPage.queryParam).then(data => {
                const re = data.response
                this.credentialPage.tableData = re.list
                this.credentialPage.total = re.total
                this.credentialPage.queryParam.pageIndex = re.pageNum
            })
        },
        credentialClear() {
            this.credentialPage.queryParam = {
                name: null,
                pageIndex: 1,
                pageSize: 10
            }
            this.credentialSearch()
        },
        credentialClick(row) {
            this.form.plan.credentialItem = {
                targetType: 3,
                name: row.name,
                targetId: row.id,
                templateImagePath: row.templateImagePath
            }
            this.credentialPage.showDialog = false
        },
        credentialRemove() {
            this.form.plan.credentialItem = {}
        },
        credentialShow(id) {
            credentialSelect(id).then(re => {
                credentialPreview(re.response).then(re => {
                    window.open(re.response, '_blank')
                })
            })
        },
        submitForm() {
            console.log(this.form, '原始数据')
            // this.$refs.form.validate((valid) => {
            // if (valid) {
            this.formLoading = true
            edit(this.form).then(data => {
                console.log(this.form, '数据')
                if (data.code === 1) {
                    this.$message.success(data.message)
                    tagsView.delCurrentView(this).then(() => {
                        this.$router.push('/train/course/list')
                    })
                } else {
                    this.$message.error(data.message)
                }
            }).finally(() => {
                this.formLoading = false
            })
            // }
            // })
        },
        resetForm() {
            this.form = {
                plan: {
                    train: {
                        id: null,
                        trainArchiveId: null,
                        trainingUnit: null,
                        trainingUnitAdress: null,
                        name: null,
                        trainingFangshi: null,
                        trainingType: null,
                        trainingDateStart: null,
                        trainingDateEnd: null,
                        trainingAdress: null,
                        trainingTeacher: null,
                        trainingTeacherPhone: null,
                        trainingTeacherWechat: null,
                        coverPath: null,
                        description: null,
                        itemOrder: null,
                        startTime: null,
                        endTime: null
                    },
                    courseWareItemList: [],
                    examPaperItem: {},
                    credentialItem: {},

                },
                trainUserList: [],
                course: [],
                report: {
                    part1: null,
                    part2: null,
                    part3: null,
                    part4: null,
                    part5: null,
                    part6: null,
                    createUserDept: null,
                },
                teacherSign: []
            }
            this.$refs['form'].resetFields()
        },
        // 选择员工
        userSelectClick() {
            this.userPageDialog = true
            this.userSearch()
            // console.log(this.userPage.showDialog)
        },
        userQueryForm() {
            this.userPage.queryParam.pageIndex = 1
            this.userSearch()
        },
        useSelectAll(selection) {
            console.log(selection, '9999')
            if (selection.length === 0) {
                this.userPage.tableData.forEach(item => {
                    this.useSelectArray(item, 3)
                })
            } else {
                selection.forEach(item => {
                    this.useSelectArray(item, 2)
                })
            }
            this.$message.success('操作成功')
        },
        useSelectArray(userItem, action) {
            console.log(userItem, '22222')
            let array = this.form.trainUserList
            console.log(this.form.trainUserList, '4234')
            let index = null
            for (let i = 0; i < array.length; i++) {
                if (userItem.id === array[i].id) {
                    index = i
                }
            }
            if (action === 1) { // revert
                if (index == null) {
                    this.form.trainUserList.push({
                        createUser: userItem.id,
                        userName: userItem.userName,
                        realName: userItem.realName,
                        departmentId: userItem.departmentId
                    })
                } else {
                    this.form.trainUserList.splice(index, 1)
                }
            } else if (action === 2) { // add
                if (index == null) {
                    this.form.trainUserList.push({
                        createUser: userItem.id,
                        userName: userItem.userName,
                        realName: userItem.realName,
                        departmentId: userItem.departmentId
                    })
                }
            } else if (action === 3) { // remove
                if (index != null) {
                    this.form.trainUserList.splice(index, 1)
                }
            }
        },
        useSelect(selection, row) {
            console.log(selection)
            this.useSelectArray(row, 1)
            this.$message.success('操作成功')
        },
        removeUser(user) {
            this.form.trainUserList.splice(this.form.trainUserList.indexOf(user), 1)
        },
        userSearch() {
            // this.userPage.queryParam.excludeDepartmentIdList = this.form.trainingUserDept
            this.userPage.listLoading = true
            employeePage(this.userPage.queryParam).then(data => {
                console.log(data, '42343')
                const re = data.response
                this.userPage.tableData = re.list
                this.userPage.total = re.total
                this.userPage.queryParam.pageIndex = re.pageNum
                this.$nextTick(() => {
                    let userSelectList = this.form.trainUserList
                    this.userPage.tableData.forEach(row => {
                        for (let i = 0; i < userSelectList.length; i++) {
                            if (userSelectList[i].id === row.id) {
                                this.$refs.userMultipleTable.toggleRowSelection(row, true)
                            }
                        }
                    })
                })
            }).finally(() => {
                this.userPage.listLoading = false
            })
        },
        handleClick(tab, event) {
        },
        beforeUpload(file) {
            const { name, size } = file;
            const index = name.lastIndexOf('.');
            // 判断文件名是否有后缀，没后缀文件错误
            if (index === -1) {
                this.$notify.error({
                    title: '错误',
                    message: `${name}文件错误，请重新上传！`,
                });
                return false;
            }
            const fileType = name.substr(index + 1);
            // const acceptFileTypes = ['txt', 'zip', 'rar'];
            // 判断文件类型
            if (!acceptFileTypes.includes(fileType)) {
                this.$notify.error({
                    title: '错误',
                    message: `${name}文件类型错误，请重新上传！`,
                });
                return false;
            }
            // 判断文件大小
            if (size > 10 * 1024 * 1024) {
                this.$notify.error({
                    title: '错误',
                    message: `${name}文件大小超过10M，请重新上传！`,
                });
                return false;
            }
            // 默认true
            return true;
        },

        // 上传接口调取成功status为200
        uploadSuccess(res, file) {
            if (res.code === 200) {  // 文件上传成功
                this.$notify.success({
                    title: '成功',
                    message: `${file.name}文件上传成功！`,
                });
            } else {
                this.uploadError();
            }
        },

        // 文件上传失败
        uploadError() {
            this.$notify.error({
                title: '错误',
                message: '文件上传失败！',
            });
        },

        // 文件个数超过限制
        uploadExceed(files, fileList) {
            this.$notify.warning({
                title: '提示',
                message: `当前限制一次可选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`,
            });
        },
        add() {
            this.form.course.push({
                courseContent: null,
                courseTime: null,
                courseTeacher: null,
                courseTeacherTitle: null,
                remark: null,
            })
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePictureCardPreview(file) {
            console.log(file)
            this.dialogImageUrl = file.url;
            console.log(this.dialogImageUrl)
            this.dialogVisible = true;
        },
        //删除上传文件
        teacherSignDelete(row) {
            console.log(row, '文件信息')
            this.form.teacherSign.splice(this.form.teacherSign.indexOf(row.id), 1)
            console.log(this.form.teacherSign)
        },
        //查看
        teacherSignShow(row) {
            window.open(row.docUrl, '_blank')
        },
        RemoveData(index) {
            console.log(index, "当前删除的下标");
            this.form.course.splice(index, 1);
        },
    }
}
</script>
<style>
.el-tabs__nav-scroll {
    margin-left: 120px;
}
</style>import { list } from '@/api/role'