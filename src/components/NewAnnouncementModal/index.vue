<template>
    <div class="new-announcement-modal-container">
        <div class="new-announcement-modal-back"  @click="closeModal"></div>
        <div class="new-announcement-modal">
            <div class="header">
                <div class="header-item">
                    <span class="ntf-spn">Başlangıç/Bitiş Tarihi</span>
                    <div class="input">
                        <Input type="datetime"/>
                    </div>
                    <img :src="closeIcon" alt="" class="close-modal" @click="closeModal">
                </div>
                <div class="header-item">
                    <span class="ntf-spn">Kanal</span>
                    <div class="checkbox">
                        <Input type="checkbox" :multiple="true" :allow-mutation="true" :external-source="[{key:'b',value:'whatsapp',selected:false},{key:'c',value:'webchat',selected:false},{key:'d',value:'çağrı merkezi',selected:false},{key:'y',value:'bau',selected:false},{key:'x',value:'outbound',selected:false}]" :vertical="true"/>
                    </div>
                </div>
            </div>
            <div class="body">
                <div class="input">
                    <Input placeholder="Duyuru için başlık giriniz.."/>
                </div>
                <div class="input">
                    <Input type="textarea" placeholder="Duyuru için içerik giriniz.."/>
                </div>
            </div>
            <div class="footer">
                <Button :type="'secondary'" :size="'default'" :text="'Vazgeç'" :disabled="false" style="margin: 0 12px 0 0"  @onClick="closeModal"/>
                <Button :type="'primary'" :size="'default'" :text="'Yayınla'" :disabled="false"/>
            </div>
        </div>
    </div>
</template>

<script>
    import Input from "../../components/Input"
    import Button from "../Button/index";
    import closeIcon from "./icons/close.svg"
    export default {
        name: "NewAnnouncementModal",
        components:{
            Button,
            Input
        },
        data(){return{
            closeIcon,
        }},
        methods:{
            closeModal(){
                this.$emit("closeModal")
            }
        }
    }
</script>

<style scoped lang="scss">
    .new-announcement-modal-container {
        display: flex;
        flex-direction: column;
        position: fixed;
        align-items: center;
        top: 0;
        z-index: 5;
        width: 100vw;
        min-height: 100vh;
        justify-content: center;
        background-color: rgba(59, 62, 62, 0.63);

        & .new-announcement-modal-back{
            position: fixed;
            top: 0;
            z-index: 4;
            min-width: 100vw;
            min-height: 100vh;
        }

        & .new-announcement-modal{
            box-sizing: border-box;
            display: flex;
            padding: 12px;
            flex-direction: column;
            align-items: center;
            position: absolute;
            width: 600px;
            height: 528px;
            border-radius: 8px;
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.16);
            border: solid 1px rgba(0, 0, 0, 0.08);
            background-color: #ffffff;
            list-style: none;
            z-index: 9999;

            & .header {
                display: flex;
                flex-direction: column;
                width: 100%;
                height: max-content;
                justify-content: center;

                & .header-item {
                    display: flex;
                    align-items: center;
                    width: 100%;
                    height: max-content;

                    & .input{
                        width: 288px;
                    }

                    & .close-modal {
                        margin: 0 0 0 72px;
                        cursor: pointer;
                    }

                    &:nth-child(2){
                        align-items: flex-start;
                        margin: 12px 0;
                    }
                }
            }

            & .body {
                display: flex;
                flex-direction: column;

                & .input{
                    width: 576px;
                    margin: 12px 0;
                }
            }

            & .footer {
                display: flex;
                height: 100%;
                width: 100%;
                justify-content: flex-end;
                align-items: flex-end;
            }
        }
    }

    .ntf-spn{
        width: 168px;
        margin: 0 8px 0 0;
    }
</style>