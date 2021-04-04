<template>
    <div class="shop_list_container">
        <ul  v-if="shopListArr.length" type="1">
            <router-link tag="li" to="/" class="shop_li" v-for="item in shopListArr" :key="item.id">
                <div class="shop_img">
                    <img :src="imgBaseUrl + item.image_path">
                </div>
                <div style="width: 100%">
                    <div class="shop_title">
                        <h4 :class="item.is_premium ? 'premium' : ''" class="shop_title ellipsis">{{item.name}}</h4>
                    </div>
                    <div class="shop_order_num">
                        <div class="shop_order_num_left">
                            <div class="rating_div">
                                <rating-star :rating='item.rating'></rating-star>
                                <span>{{item.rating}}</span>
                            </div>
                            <div class="order_div">
                                <span>月售{{item.recent_order_num}}单</span>
                            </div>
                        </div>
                        <div class="show_order_num_right">
                            <span class="delivery_style delivery_left" v-if="item.delivery_mode">{{item.delivery_mode.text}}</span>
                            <span class="delivery_style delivery_right" v-if="item.supports">准时达</span>
                        </div>
                    </div>
                    <div class="fee_distance">
                        <span class="fee">
                            ¥{{item.float_minimum_order_amount}}起送/{{item.piecewise_agent_fee.tips}}
                        </span>
                        <span class="distance">
                            {{item.distance}}/{{item.order_lead_time}}
                        </span>
                    </div>
                </div>
            </router-link>
        </ul>
        <p v-if="touchend" class="empty_data">没有更多了</p>
        <transition name="loading">
			<loading v-show="showLoading"></loading>
		</transition>
    </div>
</template>
<script>
import {shopList} from 'src/service/getData'
import {mapState} from 'vuex'
import {imgBaseUrl} from 'src/config/env'
import ratingStar from './ratingstar'
import {loadMore, getImgPath} from './mixin'
import loading from './loading'
import scroll from './scoll'
export default {
    data() {
        return {
            offset: 0,
            shopListArr: [],
            imgBaseUrl,
            preventRepeatReuqest: false,
            showLoading: false,
            touchend: false //没有更多数据
        }
    },
    props: ['restaurantCategoryId'],
    components: {
        ratingStar,
        loading,
        scroll,
    },
    computed: {
        ...mapState([
			'latitude','longitude'
		]),
    },
    mixins: [loadMore, getImgPath],
    mounted() {
        this.initData()
    },  
    methods: {
        async initData() {
            let res = await shopList(this.latitude, this.longitude, this.offset, this.restaurantCategoryId);
            this.shopListArr = [...res];
            if (res.length < 20) {
                this.touchend = true;
            }
        },
        // 到达底部加载更多数据
        async loaderMore() {
            if (this.touchend) {
                return;
            }
            // 防止发送多次请求
            if (this.preventRepeatReuqest) {
                return
            }
            this.showLoading = true
            this.preventRepeatReuqest = true
            this.offset += 20;
            let res = await shopList(this.latitude, this.longitude, this.offset, this.restaurantCategoryId);
            this.showLoading = false
            this.shopListArr = [...this.shopListArr, ...res];
            //当获取数据小于20，说明没有更多数据，不需要再次请求数据
			if (res.length < 20) {
				this.touchend = true
				return
			}
			this.preventRepeatReuqest = false
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style/mixin';
.shop_list_container {
    .shop_li {
        display: flex;
        border-bottom: 0.025rem solid #f1f1f1;
		padding: 0.7rem 0.4rem;
        .shop_img {
            img {
               @include wh(2.7rem, 2.7rem);
               margin-right: 0.4rem;
            }
        }
        .shop_title {
            width: 8.5rem;
            color: #333;
            @include font(0.65rem, 0.65rem, 'PingFangSC-Regular');
            font-weight: 700;
            .premium::before {
                content: '品牌';
                display: inline-block;
				font-size: 0.5rem;
				line-height: .6rem;
				color: #333;
				background-color: #ffd930;
				padding: 0 0.1rem;
				border-radius: 0.1rem;
				margin-right: 0.2rem;
            }
        }
        .shop_order_num {
            width: 100%;
            height: 0.6rem;
            margin-top: 0.52rem;
            @include fj(space-between);
            align-items: center;
            .shop_order_num_left {
                @include fj(flex-start);
                @include sc(0.4rem, #ff6000);
                .rating_div {
                    display: flex;
                }
            }
            .show_order_num_right {
                @include sc(0.4rem, #666);
                .delivery_style {
                    font-size: 0.1rem;
                    padding: 0.04rem;
                    border: 1px;
                    margin-left: 0.08rem;
                }
                .delivery_left{
					color: #fff;
					background-color: $blue;
					border: 0.025rem solid $blue;
				}
				.delivery_right{
					color: $blue;
					border: 0.025rem solid $blue;
				}
            }
        }
        .fee_distance {
            @include fj(space-between);
            align-items: center;
            margin-top: 0.52rem;
            @include sc(0.4rem, #666);
        }
    }
}
</style>