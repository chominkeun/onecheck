const os = require('os')
const os_name = os.hostname()
const { resolve } = require('path');
var baseurl = ''
var ip = '';
//onecheck-aws => AWS ec2
//onecheck1-210717 => onecheck-cloud
//else => localhost
var port = 0;
var target = ''
if(os_name === 'onecheck-aws'){
    target = 'server'
    port = 3000
    ip = 'http://15.165.197.229'
} else if(os_name === 'onecheck1-210717'){
    target = 'server'
    port = 80
    ip = 'http://121.0.123.232'
} else {
    target = 'static'
    port = 3000
    ip = 'http://localhost'
}

baseurl = `${ip}:${port}`

export default {
  // Target: https://go.nuxtjs.dev/config-target
  target,
  env: {
    BASEURL : baseurl
  },
  server: {
    // port: 3200,
    host: '0.0.0.0',
    port
    // host: process.env.HOST || '0.0.0.0'
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'onecheck',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [
      {
        src: '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
      }
      //TODO: apikey를 원체크 공식계정으로 바꾸거나, 지오코딩 업체를 바꾸기(현재 카카오)
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [{ src: '~/assets/style/style.scss', lang: 'scss' },
        { src: '~/assets/style/customInterior.scss', lang: 'scss'}],

  styleResources: {
    scss: [
      '~/assets/style/share/_variation.scss',
      '~/assets/style/share/_mixin.scss',
      '~/assets/style/share/_font.scss',
      '~/assets/style/share/_base.scss'
    ]
  },
  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~plugins/v-calendar.js', ssr: false },
    { src: '~plugins/filters.js' },
    { src: '~/plugins/google-maps.js', ssr: false },
    { src: '~/plugins/vuelidate.js', mode: 'both' },
    { src: '~/plugins/v-moment.js', mode: 'both' },
    { src: '~/plugins/v-kakao.js', ssr: false },
    // "@babel/plugin-proposal-private-methods",
    // "@babel/plugin-proposal-private-property-in-object"
    // { "loose": true }
  ],
  serverMiddleware: [{ path: '/api', handler: '~/server/index.js' }],
  // Auto import components: https://go.nuxtjs.dev/config-components
  // components: true,
  components: {
    dirs: ['~/components', '~/components/common']
  },
  loading: '~/components/common/LoadingBar.vue',

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    // '@nuxtjs/eslint-module',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ['@nuxtjs/style-resources', '@nuxtjs/axios', '@nuxtjs/dotenv'],

  axios: {
    proxy: false
    // baseURL: 'http://localhost:3000'
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    splitChunks: {
      layouts: true
    },
    babel: {
      plugins: [
        ['@babel/plugin-proposal-private-methods', { loose: true }]
      ]
    },
    // vendor: ['jquery'],
    plugins: [
      // '~/plugins/axios.js'
      // new webpack.ProvidePlugin({
      //   "$": "jquery",
      //   "jQuery": "jquery",
      //   jQuery: 'jquery',
      //   "window.jQuery": "jquery",
      //   'global.jQuery': 'jquery'
      // }),
    ],
    //2021.08.19 추가
    watch: ['./server/api'],
    // postcss:  {
    //   plugins:  {
    //     'postcss-preset-env': {
    //       autoprefixer: {
    //         grid: false
    //       }
    //     }
    //   }
    // },
    extend(config, ctx) {
      // Run ESLint on save
      // if (ctx.isDev && ctx.isClient) {
      //   // 이 부분을 주석 처리하고 코드는 나중에 정리하자
      //   config.module.rules.push({
      //     enforce: 'pre',
      //     test: /\.(js|vue)$/,
      //     loader: 'eslint-loader',
      //     exclude: /(node_modules)/
      //   })
      // }
    }
  },
  //  resolve: {
  // //   alias: {
  // //     'jquery-ui': '~node_modules/jquery-ui/ui/widgets',
  // //     'jquery-ui-css': '~node_modules/jquery-ui/../../themes/base',
  // //   },
  // // },

  // extensions: ['.js', '.json', '.vue', '.ts'],
  // alias: {
  //     '~': resolve(__dirname),
  //     '@': resolve(__dirname)
  //   }
  //  }
  
}
