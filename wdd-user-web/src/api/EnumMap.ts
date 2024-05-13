const EnumMap = {
    user: {
        sexEnum: [{key: 1, value: '男'}, {key: 2, value: '女'}]
    },
    exam: {
        paperTypeEnum: [{key: 1, value: '考试'}, {key: 3, value: '练习'}],
        // paperTypeAllEnum: [{key: 1, value: '正考'}, {key: 2, value: '补考'}, {key: 3, value: '练习'},{key: 4, value: '逢查必考'}],
        paperTypeAllEnum: [{key: 1, value: '考试'}, {key: 3, value: '练习'},{key: 4, value: '逢查必考'}],
        question: {
            answer: {
                doRightTag: [{key: true, value: 'success'}, {key: false, value: 'danger'}, {
                    key: null,
                    value: 'warning'
                }],
                doRightEnum: [{key: true, value: '正确'}, {key: false, value: '错误'}, {
                    key: null,
                    value: '待批改'
                }, {key: undefined, value: '已批改'}],
                doCompletedTag: [{key: false, value: 'info'}, {key: true, value: 'success'}]
            }
        },
        passed: [{key: true, value: '合格'}, {key: false, value: '不合格'}]
    },
    course: {
        ware: {
            fileTypeTag: [{key: 1, value: '视频'}, {key: 2, value: '文档'}]
        }
    }
}

const Format = function (array, key) {
    for (const item of array) {
        if (item.key === key) {
            return item.value
        }
    }
    return null
}
export {EnumMap, Format} ;
