
// window.jQuery = jquery
// Vue.prototype.jQuery = jquery
// import $ from 'jquery'
// import jQuery from 'jquery'
// import 'jquery-ui'

// import 'expose?$!expose?jQuery!jquery'
export default {
  data() {
    return {
    }
  },
  updated() {
  },
  mounted() {
    $( "#sortable" ).sortable({
      containment: "parent"
    });
    $( "#sortable" ).disableSelection();
  },
  methods: {
    
  },
}
