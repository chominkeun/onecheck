<template>
  <!-- wrapper -->
  <div class='wrapper'>
    <div class='header'>
      <div class='inner-wrap'>
        <h1 class='logo'>
          <NuxtLink to='/'
          ><img src='~assets/images/logo.png' alt=''
          /></NuxtLink>
        </h1>
        <div class='right'>
          <ul class='gnb'>
            <li>
              <NuxtLink to='/ockDemo'>Demo</NuxtLink>
            </li>
            <li v-if='isLogin'>
              <NuxtLink to='/pos'>POS</NuxtLink>
            </li>
            <li v-if='isLogin'>
              <NuxtLink to='/building'>건물</NuxtLink>
            </li>
            <li v-if='isLogin'>
              <NuxtLink to='/store'>가게</NuxtLink>
            </li>
            <li v-if='isLogin'>
              <NuxtLink to='/product'>상품</NuxtLink>
            </li>
            <li v-if='isLogin'>
              <NuxtLink to='/order'>주문</NuxtLink>
            </li>
          </ul>
          <div class='login-menu'>
            <div v-if='isLogin'>
              <VBtn @click='FETCH_USER_LOGOUT()'>LOGOUT</VBtn>
            </div>
            <div v-else>
              <NuxtLink to='/login'>LOGIN</NuxtLink>
              <NuxtLink to='/join2'>SIGN UP</NuxtLink>
            </div>
          </div>
          <div v-if='isLogin' class='mypagen-menu'>
            <NuxtLink to='/join2'>MY page</NuxtLink>
          </div>
        </div>
      </div>
    </div>
    <Nuxt />
    <div class='footer'>
      <div class='inner-wrap'>
        <ul class='footer-menu'>
          <li>
            <NuxtLink to='/outdoor'>회사소개</NuxtLink>
          </li>
          <li><a href='javascript:void(0);'>개인정보취급방침</a></li>
          <li><a href='javascript:void(0);'>이용약관</a></li>
          <li>
            <NuxtLink to='/testpage'>서비스이용약관</NuxtLink>
          </li>
        </ul>
        <div class='address'>
          <span class='name'>원체크사장님광장</span>
          <span class='addr'>주소. 주소부분입니다. 1600 (가전리 307)</span>
          <span class='tel'>Tel. 02-123-4567</span>
        </div>
        <div class='copyright'>
          COPYRIGHT ⓒ <b>2021 ONE CHECK.</b> ALL RIGHTS RESERVED.
        </div>
      </div>
    </div>
  </div>
  <!-- // wrapper -->
</template>

<script>

import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState('user/user', ['isLogin'])
  },
  methods: {
    ...mapActions('user/user', ['FETCH_USER_LOGOUT'])
  }
}
</script>

