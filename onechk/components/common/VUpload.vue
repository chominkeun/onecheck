<template>
  <div class='add-photo'>
    <input ref='imgFile' type='file' class='offscreen' @change='changeFile' />
    <VBtn v-if="imgSrc!==''&&childMode" class='btn-file-delete' type='button' @click='fileDelete()'
    ><i class='ico i-del'></i></VBtn>
    <div class='img'>
      <i v-if="imgSrc === ''" class='ico i-camera'></i>
      <img v-else :src='imgSrc' alt='첨부사진' />
    </div>
    <VBtn v-if='childMode' class='btn' @click='fileOpen'>사진
      <template v-if="imgSrc!==''">변경</template>
      <template v-else>추가</template>
    </VBtn>
  </div>
</template>

<script>
export default {
  props: ['imgSrc', 'childMode'],
  data() {
    return {
    }
  },

  created() {

  },
  methods: {
    changeFile(e, type) {
      const file = this.$refs.imgFile
      // const list = this.imgList
      // const overNum = 7
      const overSize = 10000
      const overTxt = '용량초과 이미지가 있습니다. 파일당 10MB미만의 jpg, gif, png파일만 첨부하실 수 있습니다.'
      let files = e.target.files || e.dataTransfer.files
      if (files.length === 0) return
      this.fileVal = files[0].name
      this.addPhotoFile(file, (src, size) => {
        if (parseInt(this.formatSizeUnits(size)) > overSize) {
          alert(overTxt)
        } else {
          this.imgSrc = src
        }
      })
      this.$emit('input', e.target.value)
    },
    fileDelete(index, type) {
      this.imgSrc = ''
      this.$emit('input', '')
    },
    fileOpen(type) {
      this.$refs.imgFile.click()
    },
    addPhotoFile(obj, callback) {
      let src, size
      if (obj.files && obj.files[0]) {
        let reader = new FileReader()
        reader.readAsDataURL(obj.files[0])
        reader.onload = function(e) {
          size = obj.files[0].size
          src = e.target.result
          callback && callback(src, size)
        }
      }
    },
    formatSizeUnits(bytes) {
      if (bytes >= 1000000000) {
        bytes = (bytes / 1000000000).toFixed(2) + ' GB'
      } else if (bytes >= 1000000) {
        bytes = (bytes / 1000000).toFixed(2) + ' MB'
      } else if (bytes >= 1000) {
        bytes = (bytes / 1000).toFixed(2) + ' KB'
      } else if (bytes > 1) {
        bytes = bytes + ' bytes'
      } else if (bytes == 1) {
        bytes = bytes + ' byte'
      } else {
        bytes = '0 byte'
      }
      return bytes
    },
    getUpLoadFiles(){
      return this.$refs.imgFile
    },
  }

}
</script>
