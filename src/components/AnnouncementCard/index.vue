<template>
    <div class="announcement-card-container" :style="smallCardSize ? 'height:120px':'height:max-content'">
        <div class="card-head">
            <div class="card-title">dsadsadsadsadsa</div>
            <div class="card-date">dsaddsad</div>
        </div>
        <div class="card-body">
            <div class="card-content">sadsadsasadddd saddddddddddddddddddd sad     sadsadsadsa        sadsadsasadsadsasadddd saddddddddddddddddddd sad     sadsadsadsa        sadsadsasadsadsasadddd saddddddddddddddddddd sad     sadsadsadsa        sadsadsasadsadsasadddd saddddddddddddddddddd sad     sadsadsadsa        sadsadsasadsadsasadddd saddddddddddddddddddd sad     sadsadsadsa        sadsadsasadsadsasadddd saddddddddddddddddddd sad     sadsadsadsa        sadsadsasadsadsasadddd saddddddddddddddddddd sad     sadsadsadsa        sadsadsasadsadsasadddd saddddddddddddddddddd sad     sadsadsadsa        sadsadsa</div>
            <div class="card-icons">
                <img class="card-icon" :src="trash" alt="">
                <img class="card-icon" :src="collapse" alt="" @click="changeCardSize">
            </div>
        </div>
    </div>
</template>

<script>
    import trash from "./icons/icon-solid-trash.svg"
    import collapse from "./icons/icon-solid-collapse (1).svg"
    export default {
        name: "AnnouncementCard",
        data(){return{
            trash,
            collapse,
            smallCardSize:true
        }},
        methods:{
            changeCardSize(){
                this.smallCardSize = !this.smallCardSize
            }
        }
    }
</script>

<style scoped lang="scss">
.announcement-card-container{
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding: 12px;
    width: 100%;
    height: 120px;
    border-radius: 6px;
    border: 2px solid #484848;

    & .card-head{
        display: flex;
        justify-content: space-between;

        & .card-title{
            width: max-content;
            height: 22px;
        }
        & .card-date{
            width: max-content;
            height: 22px;
        }
    }

    & .card-body {
        display: flex;
        justify-content: space-between;
        margin: 24px 0 0 0;
        height: 100%;
        width: 100%;
        overflow: hidden;

        & .card-content{
            width: calc(100% - 84px);
        }
        & .card-icons{
            display: flex;
            justify-content: flex-end;
            align-items: flex-end;
            width: 84px;
            min-height: 100%;

            & .card-icon{
                cursor: pointer;
                width: 24px;
                height: 24px;
                object-fit: contain;
                margin: 0 6px 0 0;

                &:last-child{
                    width: 26px;
                    height: 26px;
                    transform: rotate(45deg);
                    margin: 0 0 0 0;
                }
            }
        }
    }
}
</style>