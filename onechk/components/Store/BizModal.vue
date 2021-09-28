<template>
  <transition>
    <div class='vmodal'>
      <div class='vmodal-wrapper'>
        <div class='vmodal-container'>
          <h3 class='vmodal-header'>{{ headerText }}</h3>
          <span class='vmodal-body'>
            <VInput
              type='text'
              style='width:340px'
              :value='bizInfo.INPUT'
              @input='SET_INPUT'
              placeholder='사업자등록번호'
              :disabled='false'
            />
          </span>
          <div class='vmodal-buttons'>
            <Button class='vmodal-cancelbtn' @click='onCancel'
            >취소
            </Button>
            <Button class='vmodal-confirmbtn' @click='onConfirm'>등록</Button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'

export default {
  computed: {
    headerText() {
      if (this.isConfirm) return '확인'
      else return '사업자 등록'
    },

    ...mapState('biz/biz', ['bizInfo']),
    ...mapState('user/user', ['userInfo'])
  },
  data() {
    return {}
  },
  props: {
    text: {
      type: String,
      default: '사업자 등록번호'
    },
    isConfirm: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    ...mapActions('biz/biz', [
      'CREATE_BIZ',
      'DELETE_BIZ'
    ]),
    ...mapMutations('biz/biz', [
      'SET_DEFAULT_BIZ_INFO',
      'SET_BIZ_INFO',
      'SET_BIZ_NUM_INFO',
      'SET_S_LOCATION_INFO',
      'SET_M_LOCATION_INFO',
      'SET_TRADE_NM_INFO',
      'SET_TRADE_BIZ_TEL_INFO',
      'SET_TRADE_ATTACH_ID_INFO',
      'SET_INPUT'
    ]),
    async onConfirm() {
      //이곳에서 api 호출
      if (this.bizInfo.INPUT.length != 10) {
        alert('사업자등록번호형식(10자리)가 아닙니다.')
      } else {
         await this.CREATE_BIZ(this.userInfo.USER_NO)
      }

      await this.$emit('onConfirm')
      this.SET_INPUT('')
    },
    async onCancel() {
      await this.$emit('onCancel')
      this.SET_INPUT('')
    }
  }
}
</script>
