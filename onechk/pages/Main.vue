<template>
<div class="main-content">
    <VueSlickCarousel :arrows="false" :dots="true" class="visual-main">
        <div class="visual"  :style="{ backgroundImage: `url(${backgroundUrl})` }">
            <div class="inner">
                <div class="text">
                    <span class="label-txt">원체크 사장님 광장</span>
                    <p class="tit">
                        <b>서비스 홍보</b>하는 <b>컨텐츠</b> <br>
                        들어가는 부분
                    </p>
                    <p class="txt">원체크 사장님 광장, 해당 부분은 임시 문구 입니다. </p>
                    <div class="btn">
                        <a href="javascript:void(0);">자세히보기</a>
                    </div>
                </div>
            </div>
        </div>        
        <div class="visual"  :style="{ backgroundImage: `url(${backgroundUrl})` }">
            <div class="inner">
                <div class="text">
                    <span class="label-txt">원체크 사장님 광장</span>
                    <p class="tit">
                        <b>서비스 홍보</b>하는 <b>컨텐츠</b> <br>
                        들어가는 부분
                    </p>
                    <p class="txt">원체크 사장님 광장, 해당 부분은 임시 문구 입니다. </p>
                    <div class="btn">
                        <a href="javascript:void(0);">자세히보기</a>
                    </div>
                </div>
            </div>
        </div>        
    </VueSlickCarousel>


    <!-- main-menu -->
    <div class="main-menu">
        <div class="notice-wrap">
            <div class="wrap-top">
                <strong class="tit">NOTICE</strong>
                <a href="javascript:void(0);" class="more"></a>
            </div>
            <div class="notice-list">
                <ul>
                    <li v-for="(item, index) in notiList" :key="index">
                        <a href="javascript:void(0);">
                            <div class="date">
                                <em>{{ item.date }}</em>
                                <span>{{ item.year }}-{{ item.month }}</span>
                            </div>
                            <div class="text">
                                <p class="tit">{{ item.title }}</p>
                                <p class="txt">{{ item.txt }}</p>
                            </div>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
        <div class="event-wrap">
            <div class="wrap-top">
                <strong class="tit">EVENT</strong>
                <a href="javascript:void(0);" class="more"></a>
            </div>
            <div class="event-list">
                <ul>
                    <li>
                        <a href="javascript:void(0);" class="box">
                            <div class="img"><img src="~/assets/images/temp/temp_event_1.png" alt=""></div>
                            <div class="text">
                                <p class="tit">이벤트 게시물 제목부분입니다.</p>
                                <p class="txt">해당 페이지로 이동합니다.</p>
                            </div>
                        </a>
                    </li>
                    <li>
                        <a href="javascript:void(0);" class="box">
                            <div class="img"><img src="~/assets/images/temp/temp_event_2.png" alt=""></div>
                            <div class="text">
                                <p class="tit">이벤트 게시물 제목부분입니다.</p>
                                <p class="txt">해당 페이지로 이동합니다.</p>
                            </div>
                        </a>
                    </li>
                    <li>
                        <a href="javascript:void(0);" class="box">
                            <div class="img"><img src="~/assets/images/temp/temp_event_3.png" alt=""></div>
                            <div class="text">
                                <p class="tit">이벤트 게시물 제목부분입니다.</p>
                                <p class="txt">해당 페이지로 이동합니다.</p>
                            </div>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <!-- main-menu -->
  </div>
</template>
<script>

import VueSlickCarousel from 'vue-slick-carousel'
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
export default {
  components: { VueSlickCarousel },
  data() {
    return {
        backgroundUrl:require('~/assets/images/temp/visual_main_1.png'),
        notiList:[
            {date:'26', year:'2021', month:'12', title:'공지사항 제목입니다. 공지사항 제목입니다.', txt:'공지사항 제목입니다. 공지사항 제목입니다.공지사항 제목입니다. 공지사항 제목입니다.'},
            {date:'26', year:'2021', month:'12', title:'공지사항 제목입니다. 공지사항 제목입니다.', txt:'공지사항 제목입니다. 공지사항 제목입니다.공지사항 제목입니다. 공지사항 제목입니다.'},
            {date:'26', year:'2021', month:'12', title:'공지사항 제목입니다. 공지사항 제목입니다.', txt:'공지사항 제목입니다. 공지사항 제목입니다.공지사항 제목입니다. 공지사항 제목입니다.'},
        ]
    }
  },
  mounted(){
      
  },
  methods:{
  }
}
</script>
