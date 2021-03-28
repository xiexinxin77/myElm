<template>
    <div class="alert_container">
        <div class="tip_text_container">
            <div class="tip_icon">
                <span></span>
                <span></span>
            </div>
            <p class="tip_text">{{alertText}}</p>
            <div class="confirm">确认</div>
        </div>
    </div>
</template>
<script>
export default {
    props: ['alertText']
}
</script>
<style lang="scss" scoped>
@import '../../style/mixin.scss';
@keyframes tipMove {
    0% {transform: scale(1);}
    35% {transform: scale(.8);}
    70% {transform: scale(1.1);}
    100% {transform: scale(1);}
}
.alert_container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 200;
}
.tip_text_container {
    
}
</style>