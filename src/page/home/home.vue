<template>
    <div>
        <head-top>
            <span slot="logo" class="head_logo">xiezx</span>
        </head-top>
        <div class="city_nav">
            <div class="city_tip">
                <span>当前定位城市</span>
                <span>定位不准时,请在城市列表中选择</span>
            </div>
            <router-link :to="'/city/' + guessCityId" class="guess_city">
                <span>{{guessCity}}</span>
                <svg class="arrow_right">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                </svg>
            </router-link>
        </div>
        <div class="hot_city_container">
            <h4 class="city_title">热门城市</h4>
            <ul class="citylistul clear">
                <router-link to="/" tag="li" v-for="item in hotCity" :key="item.id">
                    {{item.name}}
                </router-link>
            </ul>
        </div>
        <div class="group_city_container">
            <ul class="letter_classify">
                <li v-for="(value, key, index) in sortedGroupCity" :key="key" class="letter_classify_li">
                    <h4 class="city_title">
                        {{key}}
                        <span v-if="index==0">(按字母排序)</span>
                    </h4> 
                    <ul class="group_city_name_container citylistul clear">
                        <router-link  tag="li" v-for="item in value" :to="'/city/' + item.id" :key="item.id" class="ellipsis">
                            {{item.name}}
                        </router-link>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import headTop from '../../components/header/head'
import {cityGuess, hotcity, groupcity} from '../../service/getData'
export default {
    components: {
        headTop
    },
    data() {
        return {
            guessCity: '', //当前城市
            guessCityId: '', //当前城市id
            hotCity: [], //热门城市
            groupCity: {}
        }
    },
    computed: {
        sortedGroupCity() {
            let sortedObj = {};
            for (let i = 65; i <= 90; i++) {
                if (this.groupCity[String.fromCharCode(i)]) {
                    sortedObj[String.fromCharCode(i)] = this.groupCity[String.fromCharCode(i)];
                }
            }
            return sortedObj;
        }
    },
    mounted() {
        cityGuess().then(res => {
            this.guessCity = res.name;
            this.guessCityId = res.id;
        })

        //获取热门城市
        hotcity().then(res => {
            this.hotCity = res;
        })

        //获取所有城市
        groupcity().then(res => {
            this.groupCity = res;
        })
    }
}
</script>
<style lang="scss" scoped>
@import '../../style/mixin';
.head_logo {
    left: 0.4rem;
    font-weight: 400;
    @include sc(0.7rem, #fff);
    @include ct;
}
.city_nav {
    margin-top: 2.05rem;
    margin-bottom: 0.4rem;
    border-top: 1px solid $bc;
    background-color: #fff;
    .city_tip {
        @include fj;
        padding: 0 0.45rem;
        line-height: 1.45rem;
        border-bottom: 1px solid $bc;
        span:nth-of-type(1){
                @include sc(0.55rem, #666);
        }
        span:nth-of-type(2){
            font-weight: 900;
            @include sc(0.475rem, #9f9f9f);
        }
    }
    .guess_city {
        @include fj;
        align-items: center;
        height: 1.8rem;
        padding: 0.1rem 0.45rem;
        border-bottom: 2px solid $bc;
        span:nth-of-type(1){
            color: $blue;
        }
        .arrow_right{
            @include wh(.6rem, .6rem);
            fill: #999;
        }
    }
}
.hot_city_container {
    background-color: #fff;
}
.citylistul {
    li {
        float: left;
        color: $blue;
        text-align: center;
        border-bottom: 0.025rem solid $bc;
        border-right: 0.025rem solid $bc;
        @include wh(25%, 1.71rem);
        @include font(0.6rem, 1.71rem);
    }
    li:nth-of-type(4n) {
        border-right: none;
    }
}
.city_title{
    color: #666;
    font-weight: 400;
    text-indent: 0.45rem;
    border-top: 2px solid $bc;
    border-bottom: 1px solid $bc;
    @include font(0.55rem, 1.45rem, "Helvetica Neue");
    span{
        @include sc(0.475rem, #999);
    }
}
.letter_classify_li{
    margin-bottom: 0.4rem;
    background-color: #fff;
    border-bottom: 1px solid $bc;
    .group_city_name_container{
        li{
            color: #666;
        }
    }
}
</style>