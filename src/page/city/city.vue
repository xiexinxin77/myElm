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
        <div class="pois_search_history">搜索历史</div>
        <ul class="getpois_ul">
            <li v-for="(item, index) in poisList" :key="index">
                <h4 class="pois_name">{{item.name}}</h4>
                <p class="pois_address">{{item.address}}</p>
            </li>
        </ul>
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
        }
    },
    mounted() {
        this.cityId = this.$route.params.cityId;
        currentcity(this.cityId).then(res => {
            this.cityName = res.name;
        })
    },
    methods: {
        getPois() {
            if (this.inputValue) {
                searchplace(this.cityId, this.inputValue).then(res => {
                    this.poisList = res;
                })
            }
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
</style>