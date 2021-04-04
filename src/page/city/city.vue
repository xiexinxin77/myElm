<template>
    <div class="city_container">
        <head-top :head-title="cityName" goBack="true">
            <router-link to="/home" slot="changeCity" class="change_city">切换城市</router-link>
        </head-top>
        <form class="city_form" v-on:submit.prevent>
            <div>
                <input type="search" name="city" placeholder="输入学校、商务楼、地址" class="city_input input_style" required v-model="inputValue">
            </div>
            <div>
                <input type="submit" @click="getPois" name="submit" class="city_submit input_style" value="提交">
            </div>
        </form>
        <div class="pois_search_history" v-if="historyTitleShow">搜索历史</div>
        <ul class="getpois_ul">
            <li v-for="(item, index) in poisList" :key="index" @click="nextPage(index, item)">
                <h4 class="pois_name">{{item.name}}</h4>
                <p class="pois_address">{{item.address}}</p>
            </li>
        </ul>
        <footer v-if="historyTitleShow&&poisList.length" class="clear_all_history" @click="clearAll">清空所有</footer>
        <div class="search_none_place" v-if="placeNone">很抱歉！无搜索结果</div>
    </div>
</template>
<script>
import headTop from 'src/components/header/head'
import {currentcity, searchplace} from 'src/service/getData'
import {getStore, setStore, removeStore} from 'src/config/mUtils'
export default {
    components: {
        headTop
    },
    data() {
        return {
            cityId: '',
            cityName: '',
            inputValue: '',
            poisList: [],
            placeNone: false,
            historyTitleShow: true // 默认显示搜索历史标题,点击搜索后隐藏
        }
    },
    mounted() {
        this.cityId = this.$route.params.cityId;
        currentcity(this.cityId).then(res => {
            this.cityName = res.name;
            this.initData();
        })
    },
    methods: {
        initData() {
            if (getStore('placeHistory')) {
                this.poisList = JSON.parse(getStore('placeHistory'))
            } else {
                this.poisList = [];
            }
        },
        getPois() {
            if (this.inputValue) {
                searchplace(this.cityId, this.inputValue).then(res => {
                    this.poisList = res;
                    this.placeNone = res.length ? false : true;
                    this.historyTitleShow =false;
                })
            }
        },
         /**
            * 点击搜索结果进入下一页面时进行判断是否已经有一样的历史记录
            * 如果没有则新增，如果有则不做重复储存，判断完成后进入下一页
        */
        nextPage(index, placeObj) {
            let historyPlace = getStore('placeHistory');
            if (historyPlace) {
                historyPlace = JSON.parse(historyPlace);
                let repeatFlag = false;
                historyPlace.forEach(item => {
                    if (item.geohash == placeObj.geohash) {
                        repeatFlag = true;
                        return false;
                    }
                })
                if (!repeatFlag) {
                    historyPlace.push(placeObj)
                }
            } else {
                historyPlace = [placeObj];
            }
            setStore('placeHistory', historyPlace);
            this.$router.push({path:'/msite', query:{geohash: placeObj.geohash}})
        },
        clearAll() {
            removeStore('placeHistory');
            this.poisList = [];
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../../style/mixin';
.city_container {
    padding-top: 2.35rem;
}
.change_city {
    right: 0.4rem;
    @include sc(0.6rem, #fff);
    @include ct;
}
.city_form {
    background-color: #fff;
    border-top: 1px solid $bc;
    border-bottom: 1px solid $bc;
    padding-top: 0.4rem;
    div {
        width: 90%;
        margin: 0 auto;
        text-align: center;
        .input_style {
            border-radius: 0.1rem;
            margin-bottom: 0.4rem;
            @include wh(100%, 1.4rem);
        }
        .city_input {
            border: 1px solid $bc;
            padding: 0 0.3rem;
            @include sc(0.65rem, #333);
        }
        .city_submit {
            background-color: $blue;
            color: #fff;
        }
    }
}
.pois_search_history {
    border-top: 1px solid $bc;
    padding-left: 0.5rem;
    @include font(0.475rem, 0.8rem);
}
.getpois_ul {
    border-top: 1px solid $bc;
    li {
        padding-top: 0.5rem;
        border-bottom: 1px solid $bc;
        .pois_name {
            width: 90%;
            margin: 0 auto 0.35rem;
            @include sc(0.65rem, #333);
        }
        .pois_address {
            width: 90%;
            margin: 0 auto 0.55rem;
            @include sc(0.45rem, #666);
        }
    }
}
.clear_all_history{
    @include sc(0.7rem, #666);
    text-align: center;
    line-height: 2rem;
    background-color: #fff;
}
.search_none_place{
    margin: 0 auto;
    @include font(0.65rem, 1.75rem);
    color: #333;
    background-color: #fff;
    text-indent: 0.5rem;
}
</style>