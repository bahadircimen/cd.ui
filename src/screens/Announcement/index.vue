<template>
    <div class="announcement-container">
        <div class="announcement-head">
            <div class="announcement-input-container">
                <Input @input="a" placeholder="Bildirimler içinde ara" :show-clear-icon="true" :icons="[{reference:'../../icons/integration.svg',position:'left'}]"/>
            </div>
            <Button :type="'primary'" :size="'default'" :text="'Yeni Duyuru'" :disabled="false" @onClick="showNewAnnouncementModal"/>
        </div>
        <AnnouncementCard/>
    </div>
</template>

<script>
    import AnnouncementCard from "../../components/AnnouncementCard"
    import Input from "../../components/Input"
    import Button from "../../components/Button/index";
    export default {
        name: "Announcement",
        components:{
            Button,
            AnnouncementCard,
            Input
        },
        methods:{
            a(value){
                console.log(value)
            },
            showNewAnnouncementModal(){
                this.$emit("openShowNewAnnouncementModal")
            }
        }
    }
</script>

<style scoped lang="scss">
.announcement-container{
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    margin: 38px;

    & .announcement-head {
        display: flex;
        width: 100%;
        height: 60px;
        justify-content: space-between;

        & .announcement-input-container {
            box-sizing: border-box;
            padding: 0 24px 0 0;
            min-width: calc(100% - 132px);
            height: max-content;
        }
    }
}
</style>