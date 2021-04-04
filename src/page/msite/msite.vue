<template>
    <div>
        <head-top signinUp="msite">
            <router-link :to="'/search/geohash'" class="link_search" slot="search">
	    		<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" version="1.1">
	    			<circle cx="8" cy="8" r="7" stroke="rgb(255,255,255)" stroke-width="1" fill="none"/>
	    			<line x1="14" y1="14" x2="20" y2="20" style="stroke:rgb(255,255,255);stroke-width:2"/>
	    		</svg>
    		</router-link>
			<router-link to="/home" slot="msite-title" class="msite_title">
				<span class="title_text ellipsis">{{msiteTitle}}</span>
			</router-link>
        </head-top>
        <nav class="msite_nav">
            <div class="swiper-container" v-if="foodTypes.length">
                <div class="swiper-wrapper">
                    <div class="swiper-slide food_types_container" v-for="(item, index) in foodTypes" :key="index">
                        <div class="food_types_li" v-for="foodItem in item" :key="foodItem.id">
                            <img :src="imgBaseUrl + foodItem.image_url">
                            <span>{{foodItem.title}}</span>
                        </div>
                    </div>
                </div>
                <div class="swiper-pagination"></div>
            </div>
            <img src="../../images/fl.svg" class="fl_back animation_opactiy" v-else>
        </nav>
        <div class="shop_list_container">
            <header class="shop_header">
	    		<svg class="shop_icon">
	    			<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#shop"></use>
	    		</svg>
	    		<span class="shop_header_title">附近商家</span>
	    	</header>
	    	<shop-list v-if="hasGetData" :geohash="geohash"></shop-list>
        </div>
        <foot-guide></foot-guide>
    </div>
</template>
<script>
import {mapMutations} from 'vuex'
import headTop from 'src/components/header/head'
import footGuide from 'src/components/footGuide/footGuide'
import shopList from 'src/components/common/shoplist'
import {msiteAddress, msiteFoodTypes, cityGuess} from 'src/service/getData'
import 'src/plugins/swiper.min.js'
import 'src/style/swiper.min.css'
export default {
    components: {
    	headTop,
    	shopList,
    	footGuide
    },
    data() {
        return {
            geohash: '',
            msiteTitle: '请选择地址...',
            foodTypes: [], // 分类
            hasGetData: false,
            imgBaseUrl: 'https://fuss10.elemecdn.com', //图片域名地址
        }
    },
    async beforeMount() {
        if (!this.$route.query.geohash) {
            let address = await cityGuess();
            this.geohash = address.latitude + ',' + address.longitude;
        } else {
            this.geohash = this.$route.query.geohash;
        }
        this.SAVE_GEOHASH(this.geohash);
        //获取位置信息
    	let res = await msiteAddress(this.geohash);
    	this.msiteTitle = res.name;
    	// 记录当前经度纬度
    	this.RECORD_ADDRESS(res);

    	this.hasGetData = true;
    },
    mounted() {
        msiteFoodTypes(this.geohash).then(res => {
            let resLength = res.length;
            let resArr = [...res];
            let foodArr = [];
            for (let i = 0, j = 0; i < resLength; i += 8, j++) {
    			foodArr[j] = resArr.splice(0, 8);
    		}
    		this.foodTypes = foodArr;
        }).then(() => {
            //初始化swiper
        	new Swiper('.swiper-container', {
		        pagination: '.swiper-pagination',
		        loop: true
		    });
        })
    },
    methods: {
        ...mapMutations([
    		'RECORD_ADDRESS', 'SAVE_GEOHASH'
    	]),
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style/mixin';
.link_search {
    left: .8rem;
	@include wh(.9rem, .9rem);
	@include ct;
}
.msite_title {
    @include center;
    width: 50%;
    color: #fff;
    text-align: center;
    .title_text {
        @include sc(0.8rem, #fff);
        text-align: center;
        font-weight: bold;
    }
}
.msite_nav {
    padding-top: 2.1rem;
    background-color: #fff;
	border-bottom: 0.025rem solid $bc;
    .swiper-container{
		@include wh(100%, auto);
		padding-bottom: 0.6rem;
		.swiper-pagination{
			bottom: 0.2rem;
		}
	}
    .food_types_container {
        display: flex;
        flex-wrap: wrap;
        .food_types_li {
            width: 25%;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 0.3rem 0;
            img {
                margin-bottom: .3rem;
                @include wh(1.8rem, 1.8rem);
            }
            span {
                text-align: center;
				@include sc(0.55rem, #666);
            }
        }
    }
}
.shop_list_container {
    background-color: #fff;
    .shop_header {
        .shop_icon {
            vertical-align: middle;
            @include wh(0.6rem, 0.6rem);
            fill: #666;
        }
        .shop_header_title{
			color: #999;
			@include font(0.55rem, 1.6rem);
		}
    }
}
</style>