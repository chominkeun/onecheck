<template>
  <div class="inp-addr">
    <VInput type="text" :disabled="true" :placeholder="placeholder" />
    <VBtn class="btn-type6 st6" @click="findAddress">주소찾기</VBtn>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  computed: {
    placeholder() {
      if (this.address == '') {
        return '주소찾기 버튼을 눌러 주소를 입력해주세요.'
      } else {
        return this.address
      }
    }
  },
  props: {
    address: {
      type: String,
      default: ''
    }
  },
  methods: {
    findAddress() {
      new daum.Postcode({
        oncomplete: data => {
          let newAddress = ''
          if (data.userSelectedType === 'R') {
            newAddress = data.roadAddress
          } else {
            newAddress = data.jibunAddress
          }
          this.updateLatLot(newAddress)
          this.$emit('updateAddress', newAddress)
        }
      }).open()
    },
    async updateLatLot(address) {
      let response = await this.geoCoding(address)
      let location = response.data.results[0].geometry.location
      this.$emit('updateLatLot', { lat: location.lat, lot: location.lng })
    },
    async geoCoding(address) {
      //TODO: 지오코딩하는 함수를 따로빼서 관리할지 고민해보기.
      let response = await axios.get(
        // `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyBsSCiC3WAK08eYltZyih_bLoee66-QZoE`

        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyCzzgPOqNP29w6q8-U_K_opLKMXDr8sqQE`
      )
      return response
    }
  }
}
</script>

<style></style>
