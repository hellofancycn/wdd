<template>
  <div v-loading="qLoading" class="wdd-flex-row">
    <div class="wdd-question-flex-property-right">
      <div v-if="qType === 1">
        <div v-html="`${question.title} `"
             class="wdd-question-content wdd-question-title wdd-content-line-height"/>
        <div class="wdd-question-item-marin">
          <el-radio-group v-model="answer.contentKey" class="wdd-flex-column">
            <el-radio v-for="item in question.questionItemFrames" :key="item.key" :label="item.key"
                      class="wdd-flex-row wdd-question-choice-marin wdd-form-question-select">
              <span class="wdd-question-choice-prefix-marin">{{ item.prefix }}.</span>
              <span v-html="item.content" class="wdd-question-content"></span>
            </el-radio>
          </el-radio-group>
        </div>
      </div>
      <div v-else-if="qType === 2 || qType === 6">
        <div v-html="`${question.title}`"
             class="wdd-question-content wdd-question-title wdd-content-line-height"/>
        <div class="wdd-question-item-marin">
          <el-checkbox-group v-model="answer.contentArrayKey" class="wdd-flex-column">
            <el-checkbox v-for="item in question.questionItemFrames" :label="item.key" :key="item.key"
                         class="wdd-flex-row wdd-question-choice-marin">
              <span class="wdd-question-choice-prefix-marin">{{ item.prefix }}.</span>
              <span v-html="item.content" class="wdd-question-content"></span>
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div v-else-if="qType === 3" class="wdd-content-line-height">
        <span v-html="`${question.title} `"
              class="wdd-question-content wdd-question-title"/><br/>
        <span></span>
        <el-radio-group v-model="answer.contentKey">
          <el-radio v-for="item in question.questionItemFrames" :key="item.key" :label="item.key"
                    class="wdd-question-choice-prefix-marin">
            <span v-html="item.content" class="wdd-question-content"></span>
          </el-radio>
        </el-radio-group>
        <span></span>
      </div>
      <div v-else-if="qType === 4">
        <div v-html="`${question.title} `"
             class="wdd-question-content wdd-question-title wdd-content-line-height"/>
        <div v-if="answer.contentArray !== null" class="wdd-question-item-marin2">
          <div v-for="(item,index) in question.questionItemFrames" :key="item.prefix"
               class="wdd-flex-row wdd-gap-filling-items-content">
            <div class="wdd-question-flex-property-left">
              {{ item.prefix }}
            </div>
            <div v-html="answer.contentArray[index]"
                 class="wdd-question-flex-property-right wdd-question-content"></div>
          </div>
        </div>
      </div>
      <div v-else-if="qType === 5">
        <div v-html="`${question.title} `"
             class="wdd-question-content wdd-question-title wdd-content-line-height"/>
        <div v-html="answer.content"
             class="wdd-question-content wdd-question-content-marin wdd-question-item-marin2"/>
      </div>

      <div class="wdd-line-height"></div>
      <div class="wdd-flex-row wdd-question-property-marin">
        <span class="wdd-question-flex-property-left">标答：</span>
        <span v-if="qType === 1 || qType === 2 || qType === 6" v-html="answer.correctPrefix"
              class="wdd-question-flex-property-right"/>
        <span v-if="qType === 3" v-html="answer.correctContent" class="wdd-question-flex-property-right"/>
        <span v-if="qType === 4" class="wdd-question-flex-property-right">
           <div v-for="item in question.questionItemFrames" :key="item.prefix"
                v-html="`${item.prefix}. ${item.content}`" class="wdd-question-gap-answer"/>
      </span>
        <span v-if="qType === 5" v-html="question.correct"
              class="wdd-question-flex-property-right wdd-question-content"/>
      </div>

      <div class="wdd-flex-row wdd-question-property-marin wdd-flex-align">
        <span class="wdd-question-flex-property-left">结果：</span>
        <span class="wdd-question-flex-property-right">
          <el-tag :type="doRightTagFormatter(answer.doRight)">
          {{ doRightTextFormatter(answer.doRight) }}
          </el-tag>
        </span>
      </div>
      <div class="wdd-flex-row wdd-question-property-marin">
        <span class="wdd-question-flex-property-left">得分：</span>
        <span class="wdd-question-flex-property-right">{{ answer.judgeScoreVM }}</span>
      </div>
      <div class="wdd-flex-row wdd-question-property-marin wdd-flex-align">
        <span class="wdd-question-flex-property-left">难度：</span>
        <el-rate disabled v-model="question.difficult" show-text :max="3" :texts="['简单','较难','困难']"
                 class="wdd-question-flex-property-right"></el-rate>
      </div>
      <div class="wdd-flex-row wdd-question-property-marin">
        <span class="wdd-question-flex-property-left">解析：</span>
        <span v-html="question.analyze" class="wdd-question-flex-property-right wdd-question-content"/>
      </div>
    </div>
  </div>

</template>


<script setup lang="ts">
import {computed} from 'vue';
import {EnumMap, Format} from '@/api/EnumMap'

const props = defineProps({
  question: {
    type: Object,
    default: function () {
      return {}
    }
  },
  answer: {
    type: Object,
    default: function () {
      return {id: null, content: '', contentArray: [], doRight: false}
    }
  },
  qLoading: {
    type: Boolean,
    default: false
  },
  qType: {
    type: Number,
    default: 0
  }
});

const question = computed<object | undefined>({
  get() {
    return props.question;
  },
  set(val) {
  }
});


const qLoading = computed<boolean | undefined>({
  get() {
    return props.qLoading;
  },
  set(val) {
  }
});

const answer = computed<object | undefined>({
  get() {
    return props.answer;
  },
  set(val) {
  }
});


const qType = computed<number | undefined>({
  get() {
    return props.qType;
  },
  set(val) {
  }
});

const doRightTagFormatter = function (status) {
  return Format(EnumMap.exam.question.answer.doRightTag, status)
}

const doRightTextFormatter = function (status) {
  return Format(EnumMap.exam.question.answer.doRightEnum, status)
}
</script>
