import Vue from 'vue'
import * as VueGoogleMaps from 'vue2-google-maps'

Vue.use(VueGoogleMaps, {
  load: {
    //TODO: api키 onecheck 공식계정으로 옮기기
    // key: 'AIzaSyBsSCiC3WAK08eYltZyih_bLoee66-QZoE',

    key: 'AIzaSyCzzgPOqNP29w6q8-U_K_opLKMXDr8sqQE',
    libraries: 'places'
  }
})
