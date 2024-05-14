<template>
    <div class="app-item-contain">
        <el-card class="user-index-info-contain user-index-info" shadow="never">

            <info-menu url="/user/examine" />

            <div>
                <el-form :model="queryParam" ref="queryForm" :inline="true" style="margin-top: 20px;">
                    <el-form-item label="培训班（内容）：">
                        <el-input v-model="queryParam.trainClassname" clearable></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="searchForm">查询</el-button>
                        <el-button @click="clearForm">重置</el-button>
                        <el-button type="primary" @click="addshowdialog">添加</el-button>
                    </el-form-item>
                </el-form>
                <el-table :data="tableData" border fit highlight-current-row style="width: 100%">
                    <el-table-column label="培训时间" width="250px" align="center">
                        <template #default="{ row }">
                            <span>{{ row.trainBeginTime }}</span>-
                            <span>{{ row.trainEndTime }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="trainClassname" label="培训班（内容）" width="150px" align="center" />
                    <el-table-column prop="trainUnit" label="培训单位" width="100px" align="center" />
                    <el-table-column prop="classHour" label="学时" width="80px" align="center" rules />
                    <el-table-column prop="checkResult" label="考核结果" width="100px" align="center" />
                    <el-table-column prop="note" label="备注" width="120px" align="center" />
                    <el-table-column width="170px" label="操作" align="center">
                        <template #default="{ row }">
                            <el-button @click="examinePageUpdate(row, 0)" size="small">
                                编辑
                            </el-button>
                            <el-button type="danger" @click="examinePageDelete(row)" size="small">删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <pagination v-show="total > 0" :total="total" v-model:page="queryParam.pageIndex"
                    v-model:limit="queryParam.pageSize" @pagination="search" />
            </div>
        </el-card>
        <!-- 添加 -->
        <el-dialog v-model="examinePage.showDialog" width="30%" class="question-select-dialog">
            <el-form :model="examinePage.queryParam" :inline="true" label-width="150px" size="mini" :rules="rules">
                <el-form-item label="培训开始时间">
                    <el-date-picker style="margin-bottom: 10px;" placeholder="选择开始时间"
                        v-model="examinePage.queryParam.trainBeginTime" value-format="YYYY年MM月DD日" type="date">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="培训结束时间">
                    <el-date-picker v-model="examinePage.queryParam.trainEndTime" placeholder="选择结束时间"
                        value-format="YYYY年MM月DD日" type="date">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="培训班（内容）名称">
                    <el-input v-model="examinePage.queryParam.trainClassname" placeholder="请输入培训班（内容）名称"
                        clearable></el-input>
                </el-form-item>
                <el-form-item label="培训单位">
                    <el-input v-model="examinePage.queryParam.trainUnit" placeholder="请输入培训单位" clearable></el-input>
                </el-form-item>
                <el-form-item label="学时">
                    <el-input v-model="examinePage.queryParam.classHour" placeholder="请输入培训学时" clearable></el-input>
                </el-form-item>
                <el-form-item label="考核结果">
                    <el-input v-model="examinePage.queryParam.checkResult" placeholder="请输入考核结果" clearable></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="examinePage.queryParam.note" placeholder="请输入备注" clearable></el-input>
                </el-form-item>
            </el-form>
            <el-button type="primary" @click="submitForm">提交</el-button>
            <el-button @click="resetForm">重置</el-button>
        </el-dialog>
        <!-- 编辑 -->
        <el-dialog v-model="updatePage.showDialog" width="30%" class="question-select-dialog" :rules="rules">
            <el-form :model="updatePage.queryParam" :inline="true" label-width="150px">
                <el-form-item label="培训开始时间" prop="trainBeginTime">
                    <el-date-picker style="margin-bottom: 10px;" placeholder="选择开始时间"
                        v-model="examinePage.queryParam.trainBeginTime" value-format="YYYY年MM月DD日" type="date">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="培训结束时间" prop="trainEndTime">
                    <el-date-picker v-model="examinePage.queryParam.trainEndTime" placeholder="选择结束时间"
                        value-format="YYYY年MM月DD日" type="date">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="培训班（内容）名称" prop="trainClassnam">
                    <el-input v-model="updatePage.queryParam.trainClassname" placeholder="请输入培训班（内容）名称"
                        clearable></el-input>
                </el-form-item>
                <el-form-item label="培训单位" prop="trainUnit">
                    <el-input v-model="updatePage.queryParam.trainUnit" placeholder="请输入培训单位" clearable></el-input>
                </el-form-item>
                <el-form-item label="学时" prop="classHour">
                    <el-input v-model="updatePage.queryParam.classHour" placeholder="请输入培训学时" clearable></el-input>
                </el-form-item>
                <el-form-item label="考核结果" prop="checkResult">
                    <el-input v-model="updatePage.queryParam.checkResult" placeholder="请输入考核结果" clearable></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="note">
                    <el-input v-model="updatePage.queryParam.note" placeholder="请输入备注" clearable></el-input>
                </el-form-item>
            </el-form>
            <el-button type="primary" @click="updateForm">提交</el-button>
        </el-dialog>
    </div>
</template>

<script>
import { EnumMap, Format } from '@/api/EnumMap'
import InfoMenu from './components/info-menu.vue'
import { extenInsert, extenUpdate, extenDelete, extenList } from '@/api/user'

export default {
    components: { InfoMenu },
    data() {
        return {
            queryParam: {
                pageIndex: 1,
                pageSize: 10,
                // trainClassname: null
            },
            tableData: [],
            total: 0,
            examinePage: {
                showDialog: false,
                queryParam: {
                    trainBeginTime: null,
                    trainEndTime: null,
                    trainClassname: null,
                    trainUnit: null,
                    classHour: null,
                    checkResult: null,
                    note: null
                }
            },
            updatePage: {
                showDialog: false,
                queryParam: {
                    trainBeginTime: null,
                    trainEndTime: null,
                    trainClassname: null,
                    trainUnit: null,
                    classHour: null,
                    checkResult: null,
                    note: null
                }
            },
            rules: {
                classHour: [{ required: true, type: Number, message: '请输入时长' }],
            },
        }
    },
    created() {
        this.search()
    },
    methods: {
        search() {
            extenList(this.queryParam).then(res => {
                console.log(res, '424234')
                this.tableData = res.response.list
                this.total = res.response.total
                this.queryParam.pageIndex = res.response.pageIndex
            })
        },
        sexFormatter(value) {
            return Format(EnumMap.user.sexEnum, value)
        },
        addshowdialog() {
            this.examinePage.showDialog = true
        },
        submitForm() {
            extenInsert(this.examinePage.queryParam).then(res => {
                console.log(res)
                if (res.code = '1') {
                    this.search()
                    this.examinePage.showDialog = false
                    this.$message.success('res.message')
                } else {
                    this.$message.error('re.message')
                }
            })
        },
        resetForm() {
            this.examinePage.queryParam = {
                trainBeginTime: null,
                trainEndTime: null,
                trainClassname: null,
                trainUnit: null,
                classHour: null,
                checkResult: null,
                note: null
            }
            this.$refs['examinePage.queryParam'].resetFields()
        },
        examinePageUpdate(row) {
            const a = this.tableData.filter(item => item.id == row.id)
            this.updatePage.queryParam = a[0]
            this.updatePage.showDialog = true
            console.log(this.updatePage.queryParam, 'ty78767')
        },
        examinePageDelete(row) {
            console.log(row)
            this.$confirm('此操作将永久删除该培训, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                extenDelete(row.id).then(re => {
                    console.log(re)
                    if (re.code = '1') {
                        this.search()
                        this.$message.success('re.message')
                    } else {
                        this.$message.error('re.message')
                    }
                })
            })
        },
        updateForm() {
            extenUpdate(this.updatePage.queryParam).then(res => {
                if (res.code = '1') {
                    this.$message.success('res.message')
                    this.search()
                } else {
                    this.$message.success('res.message')
                }
                this.updatePage.showDialog = false
            })
        },
        submitform() {
            this.queryParam.pageIndex = 1
            this.search()
        },
        clearForm() {
            this.queryParam = {
                trainClassname: null,
                pageIndex: 1,
                pageSize: 10
            }
            this.search()
        },
        searchForm() {
            this.queryParam.pageIndex = 1
            this.search()
        },
        clearForm() {
            this.queryParam = {
                pageIndex: 1,
                pageSize: 10,
                trainClassname: null
            }
            this.search()
        },
    }
}
</script>
