module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
  extends: [
    '@nuxtjs',
    'plugin:prettier/recommended',
    'plugin:nuxt/recommended',
    "eslint:recommended",
    "plugin:vue/recommended"    
  ],
  plugins: [],
  // add your custom rules here
  rules: {
    "vue/html-self-closing": "off" // Fix v-for/template/key bug    
  },
}
