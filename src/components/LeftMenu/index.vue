<template>
    <div class="menuContainer">
        <div :class="[largeMenu ? 'largeMenuBack' : 'miniMenuBack']"></div>
        <div v-if="largeMenu" class="largeMenu">
            <div class="largeMenuHead">
                <img :src="iconData.colorfullBarMax" alt="" class="largeMenuHeadColorfull">
                <div class="largeMenuHeadIcon">
                    <img :src="iconData.hbIconMax" alt="" class="largeMenuHeadIconSvg">
                </div>
            </div>
            <div class="largeMenuTopLine"></div>
            <div class="largeMenuBody">
                <div  class="largeMenuBodyContentContainer1">
                    <div :key="data.id" v-for="data in parentPage" v-if="!data.parentId" :class="[(data.id===dataId) ? 'largeMenuBodyContentContainerActive' : 'largeMenuBodyContentContainer']" @click="getParentDataId(data.id)">
                        <div class="largeMenuBodyContent">
                            <div class="largeMenuBodyContentLeftBorder"></div>
                            <img :src="data.img" alt="" class="largeMenuBodyContentSvg">
                            <div class="largeMenuBodyContentText" v-text="data.name"/>
                            <img :src="data.imgW" alt="" class="largeMenuBodyContentSvga">
                            <div class="largeMenuBodyContentRight">
                                <img :src="iconData.downButton" alt="" class="largeMenuBodyContentRightSvg">
                            </div>
                        </div>
                    </div>
                    <ul class="largeMenuBodyContentUl">
                        <li v-for="_data in childPage" :key="_data.id" v-if="_data.parentId && (_data.parentId === parentDataId)" class="largeMenuBodyContentLi" @click="getDataId(_data.parentId)">{{_data.name}}</li>
                    </ul>
                </div>
            </div>
            <div class="largeMenuBottomLine"></div>
            <div class="largeMenuFoot">
                <div class="largeMenuFootAvatarContainer">
                    <img :src="iconData.avatar" alt="" class="largeMenuFootAvatar">
                    {{userName}}
                </div>
                <div class="largeMenuFootLogoutContainer">
                    <div class="largeMenuFootLogout" @click="logout">
                        <img :src="iconData.logout" alt="" class="largeMenuFootLogoutSvg">
                        <img :src="iconData.logoutW" alt="" class="largeMenuFootLogoutSvgW">
                    </div>
                    Çıkış Yap
                </div>
            </div>
            <div class="largeMenuBottomLine"></div>
            <div class="largeMenuSize">
                <div class="largeMenuSizeSvgContainer" @click="changeMenuSize">
                    <img :src="iconData.sizeButtonLarge" alt="" class="largeMenuSizeSvg">
                </div>
                Menüyü daralt
            </div>
        </div>
        <div v-else-if="!largeMenu" class="miniMenu">
            <div class="miniMenuHead">
                <img :src="iconData.colorfullBar" alt="" class="miniMenuHeadColorfull">
                <div class="miniMenuHeadIcon">
                    <img :src="iconData.hbIcon" alt="" class="miniMenuHeadIconSvg">
                </div>
            </div>
            <div class="miniMenuBottomLine"></div>
            <div ref="miniMenuBody" class="miniMenuBody" @scroll="getScrollTop">
                <div v-if="!data.parentId" :key="data_index" v-for="(data,data_index) in parentPage" :class="[(dataId===data.id) ? 'miniMenuBodyContentContainerActive' : 'miniMenuBodyContentContainer']">
                    <ul :style="{'top':''+(91+(data_index*64)-scrollTop)+'px'}" class="miniMenuBodyContentUl">
                        <div class="miniMenuBodyContentUlHead">{{data.name}}{{data_index}}</div>
                        <li v-if="_data.parentId" :key="_data.id" v-for="_data in childPage" class="miniMenuBodyContentLi" @click="getDataId(_data.parentId)">{{_data.name}}</li>
                    </ul>
                    <div class="miniMenuBodyContent">
                        <div class="miniMenuBodyContentLeftBorder"></div>
                        <img :src="data.img" alt="" class="miniMenuBodyContentSvg">
                        <img :src="data.imgW" alt="" class="miniMenuBodyContentSvga">
                    </div>
                </div>
            </div>
            <div class="miniMenuBottomLine"></div>
            <div class="miniMenuFoot">
                <img :src="iconData.avatar" alt="" class="miniMenuFootAvatar">
                <div class="miniMenuFootLogout">
                    <div class="miniMenuFootLogout" @click="logout">
                        <img :src="iconData.logout" alt="" class="miniMenuFootLogoutSvg">
                        <img :src="iconData.logoutW" alt="" class="miniMenuFootLogoutSvgW">
                    </div>
                </div>
            </div>
            <div class="miniMenuBottomLine"></div>
            <div class="miniMenuSize">
                <div class="miniMenuSizeSvgContainer" @click="changeMenuSize">
                    <img :src="iconData.sizeButton" alt="" class="miniMenuSizeSvg">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import iconData from "../../helpers/iconData";
    export default {
        name: "LeftMenu",
        mounted() {
            console.log(this.pages)
        },
        data(){return{
            iconData:iconData,
            // menuData:[
            //     {img:iconData.stores, imgW:iconData.storesW, title:"Mağaza", content:[{title:"Başvuru yöntemi"},{title:"Tüm mağazalar"}]},
            //     {img:iconData.combined, imgW:iconData.combinedW, title:"Listeleme", content:[{title:"Listleme işlemleri"},{title:"Satış izni tanımla"},{title:"Toplu listeleme işlemleri"}]},
            //     {img:iconData.commission, imgW:iconData.commissionW, title:"Komisyon", content:[{title:"Manuel komisyon tanımlama"},{title:"Toplu komisyon tanımlama"},{title:"Komisyon güncelle"}]},
            //     {img:iconData.discount, imgW:iconData.discountW, title:"İndirim", content:[{title:"İndirim listesi"},{title:"İndirim ekle"},{title:"Toplu indirim ekle"}]},
            //     {img:iconData.buybox, imgW:iconData.buyboxW, title:"Buybox", content:[{title:"Buybox kural listesi"},{title:"Yeni kural ekle"}]},
            //     {img:iconData.integration, imgW:iconData.integrationW, title:"Entegrasyon", content:[{title:"Entegratör listesi"},{title:"Yeni entegratör tanımla"}]},
            //     {img:iconData.report, imgW:iconData.reportW, title:"Raporlar", content:[{title:"Satıcı oturum açma"},{title:"Satıcı son oturum açma"},{title:"Buyboxı alan satıcılar"},{title:"Satıcı teslimat kapasitesi"}]}
            // ],
            largeMenu:false,
            scrollTop:0,
            dataId:undefined,
            parentDataId:undefined,
        }},
        props:{
            userName:{type:String, default:"User"},
            pages:{type:Array},
            parentPage:{type:Array},
            childPage:{type:Array}
        },
        methods:{
            changeMenuSize(){
                this.largeMenu=!this.largeMenu
            },
            getScrollTop(){
                let scrollTop=this.$refs.miniMenuBody.scrollTop;
                this.scrollTop=scrollTop;
                console.log(scrollTop)
            },
            getDataId(dataId){
                this.dataId = dataId
            },
            getParentDataId(dataId){
                this.parentDataId = dataId
            },
            logout(){
                this.$emit("logout")
            }
        }
    }
</script>

<style scoped lang="scss">
    .menuContainer {
        display: flex;
        width: max-content;
        height: 100%;
        justify-content: space-between;
        z-index: 1;

        & .miniMenuBack {
            height: 100%;
            width: 80px;
        }

        & .largeMenuBack {
            height: 100%;
            width: 248px;
        }

        & .miniMenu {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 80px;
            height: 100vh;
            background-color: #2e3448;
            position: fixed;
            top: 0;
            left: 0;

            & .miniMenuHead {
                display: flex;
                flex-direction: column;
                width: 80px;
                height: 90px;

                & .miniMenuHeadColorfull {
                    width: 80px;
                    height: 4px;
                    object-fit: contain;
                }

                & .miniMenuHeadIcon {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 80px;
                    height: 86px;

                    & .miniMenuHeadIconSvg {
                        width: 56px;
                        height: 28px;
                        object-fit: contain;
                        cursor: pointer;
                    }
                }
            }

            & .miniMenuBottomLine {
                min-width: 80px;
                min-height: 1px;
                background-color: #3d4257;
            }

            & .miniMenuBody {
                display: flex;
                flex-direction: column;
                align-items: center;
                height: 100%;
                width: 80px;
                overflow-y: scroll;

                &::-webkit-scrollbar {
                    display: none;
                }

                & .miniMenuBodyContentContainer, .miniMenuBodyContentContainerActive {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-width: 80px;
                    min-height: 64px;
                    cursor: pointer;

                    & .miniMenuBodyContentUl {
                        display: none;
                        flex-direction: column;
                        position: absolute;
                        justify-content: center;
                        align-items: center;
                        height: max-content;
                        width: 234px;
                        border-bottom-right-radius: 4px;
                        border-top-right-radius: 4px;
                        background-color: #3d4357;
                        left: 80px;
                        margin-top: 0;
                        list-style: none;

                        & .miniMenuBodyContentUlHead {
                            display: flex;
                            justify-content: flex-start;
                            align-items: center;
                            height: 64px;
                            width: 186px;
                            padding: 0 24px;
                            font-size: 16px;
                            font-weight: 600;
                            font-stretch: normal;
                            font-style: normal;
                            line-height: 1.5;
                            letter-spacing: -0.14px;
                            color: #ffffff;
                            cursor: default;
                        }

                        & .miniMenuBodyContentLi {
                            display: flex;
                            justify-content: flex-start;
                            align-items: center;
                            min-height: 24px;
                            width: 178px;
                            border-radius: 8px;
                            font-size: 14px;
                            font-weight: 600;
                            font-stretch: normal;
                            font-style: normal;
                            line-height: 1.71;
                            letter-spacing: -0.12px;
                            color: #ffffff;
                            padding: 8px 12px 8px 20px;

                            &:first-child{
                                margin-top: 8px;
                            }

                            &:last-child{
                                margin-bottom: 8px;
                            }

                            &:hover {
                                background-color: #2e3448;
                            }
                        }
                    }

                    & .miniMenuBodyContent {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        position: relative;
                        min-width: 80px;
                        min-height: 64px;

                        & .miniMenuBodyContentSvg {
                            min-width: 24px;
                            min-height: 24px;
                            object-fit: contain;
                        }

                        & .miniMenuBodyContentSvga {
                            display: none;
                            position: absolute;
                            min-width: 24px;
                            min-height: 24px;
                            object-fit: contain;
                        }

                        & .miniMenuBodyContentLeftBorder {
                            display: none;
                            position: absolute;
                            left: 0;
                            width: 4px;
                            height: 44px;
                            border-top-right-radius: 4px;
                            border-bottom-right-radius: 4px;
                            background-color: #90a2fb;
                        }
                    }

                    &:hover {
                        background-color: #3d4357;
                        & .miniMenuBody {
                            display: none;
                        }
                        & .miniMenuBodyContentLeftBorder {
                            display: flex;
                        }
                        & .miniMenuBodyContentSvga {
                            display: flex;
                        }
                        & .miniMenuBodyContentUl {
                            display: flex;
                        }
                    }
                }

                & .miniMenuBodyContentContainerActive {
                    background-color: #3d4357 !important;
                    & .miniMenuBody {
                        display: none !important;
                    }
                    & .miniMenuBodyContentLeftBorder {
                        display: flex !important;
                    }
                    & .miniMenuBodyContentSvga {
                        display: flex !important;
                    }
                }
            }

            & .miniMenuFoot {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                position: relative;
                width: 80px;
                min-height: 101px;

                & .miniMenuFootAvatar {
                    width: 32px;
                    height: 32px;
                    object-fit: contain;
                    margin-bottom: 19px;
                    cursor: pointer;
                }

                & .miniMenuFootLogout {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-width: 18px;
                    min-height: 18px;

                    & .miniMenuFootLogoutSvg {
                        width: 18px;
                        height: 18px;
                        object-fit: contain;
                        cursor: pointer;
                    }

                    & .miniMenuFootLogoutSvgW {
                        display: none;
                        position: absolute;
                        width: 18px;
                        height: 18px;
                        object-fit: contain;
                        cursor: pointer;
                    }

                    &:hover {
                        & .miniMenuFootLogoutSvgW {
                            display: flex;
                        }
                    }
                }
            }

            & .miniMenuSize {
                display: flex;
                justify-content: center;
                align-items: center;
                position: relative;
                width: 80px;
                min-height: 64px;
                margin-bottom: 16px;

                & .miniMenuSizeSvgContainer {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 32px;
                    height: 32px;
                    border-radius: 4px;
                    background-color: #6c84fa;
                    cursor: pointer;

                    & .miniMenuSizeSvg {
                        width: 18px;
                        height: 18px;
                        object-fit: contain;
                    }

                    &:hover {
                        background-color: #5163bb;
                    }
                }
            }
        }

        & .largeMenu {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 248px;
            height: 100vh;
            position: fixed;
            top: 0;
            left: 0;
            background-color: #2e3448;

            & .largeMenuHead {
                display: flex;
                flex-direction: column;
                width: 248px;
                height: 90px;

                & .largeMenuHeadColorfull {
                    width: 248px;
                    height: 4px;
                    object-fit: contain;
                }

                & .largeMenuHeadIcon {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 248px;
                    height: 86px;

                    & .largeMenuHeadIconSvg {
                        width: 165px;
                        height: 28px;
                        object-fit: contain;
                        cursor: pointer;
                    }
                }
            }

            & .largeMenuTopLine {
                min-width: 248px;
                min-height: 1px;
                background-color: #3d4257;
            }

            & .largeMenuBottomLine {
                min-width: 200px;
                min-height: 1px;
                background-color: #3d4257;
            }

            & .largeMenuBody {
                display: flex;
                flex-direction: column;
                align-items: center;
                height: 100%;
                width: 248px;
                overflow-y: scroll;

                &::-webkit-scrollbar {
                    display: none;
                }

                & .largeMenuBodyContentContainer1 {
                    display: flex;
                    flex-direction: column;
                    width: max-content;
                    height: max-content;

                    & .largeMenuBodyContentContainer, .largeMenuBodyContentContainerActive {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-width: 248px;
                        min-height: 64px;
                        cursor: pointer;
                        background-color: #2e3448;
                        border: none;
                        outline: none;
                        padding: 0;
                        margin: 0;

                        & .largeMenuBodyContent {
                            display: flex;
                            justify-content: flex-start;
                            align-items: center;
                            position: relative;
                            min-width: 248px;
                            min-height: 64px;

                            & .largeMenuBodyContentText {
                                display: flex;
                                align-items: center;
                                justify-content: flex-start;
                                width: 132px;
                                font-size: 16px;
                                font-weight: 600;
                                font-stretch: normal;
                                font-style: normal;
                                line-height: 1.5;
                                letter-spacing: -0.14px;
                                color: #adaeb6;
                            }

                            & .largeMenuBodyContentSvg {
                                min-width: 24px;
                                min-height: 24px;
                                object-fit: contain;
                                margin: 0 20px 0 28px;
                            }

                            & .largeMenuBodyContentSvga {
                                display: none;
                                position: absolute;
                                min-width: 24px;
                                min-height: 24px;
                                object-fit: contain;
                                margin: 0 20px 0 28px;
                            }

                            & .largeMenuBodyContentRight {
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                width: 24px;
                                height: 24px;
                                background-color: rgba(255, 255, 255, 0.1);
                                border-radius: 50%;
                                margin: 0 16px 0 4px;

                                & .largeMenuBodyContentRightSvg {
                                    width: 12px;
                                    height: 12px;
                                    object-fit: contain;
                                }
                            }

                            & .largeMenuBodyContentLeftBorder {
                                display: none;
                                position: absolute;
                                left: 0;
                                width: 4px;
                                height: 44px;
                                border-top-right-radius: 4px;
                                border-bottom-right-radius: 4px;
                                background-color: #90a2fb;
                            }
                        }

                        &:hover {
                            background-color: #3d4357;
                            & .largeMenuBodyContentLeftBorder {
                                display: flex;
                            }
                            & .largeMenuBodyContentSvga {
                                display: flex;
                            }
                            & .largeMenuBodyContentText {
                                color: #ffffff;
                            }
                        }
                    }

                    & .largeMenuBodyContentContainerActive{
                        background-color: #3d4357;
                        & .largeMenuBodyContentLeftBorder {
                            display: flex !important;
                        }
                        & .largeMenuBodyContentSvga {
                            display: flex !important;
                        }
                        & .largeMenuBodyContentText {
                            color: #ffffff !important;
                        }
                    }

                    & .largeMenuBodyContentUl {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        position: relative;
                        align-items: center;
                        height: max-content;
                        width: 248px;
                        background-color: #3d4357;
                        list-style: none;
                        cursor: pointer;
                        margin: 0;
                        padding: 0;

                        & .largeMenuBodyContentLi {
                            display: flex;
                            justify-content: flex-start;
                            align-items: center;
                            min-height: 24px;
                            width: 149px;
                            border-radius: 8px;
                            font-size: 14px;
                            font-weight: 600;
                            font-stretch: normal;
                            font-style: normal;
                            line-height: 1.71;
                            letter-spacing: -0.12px;
                            color: #ffffff;
                            padding: 8px 10px;
                            margin-left: 61px;

                            &:first-child{
                                margin-top: 8px;
                            }

                            &:last-child{
                                margin-bottom: 8px;
                            }

                            &:hover {
                                background-color: #ffffff;
                                color: #2e3448;
                            }
                        }
                    }
                }


            }

            & .largeMenuFoot {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                position: relative;
                width: 248px;
                min-height: 104px;

                & .largeMenuFootAvatarContainer {
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    width: 200px;
                    height: 32px;
                    cursor: pointer;
                    margin-bottom: 19px;
                    font-size: 14px;
                    font-weight: 600;
                    font-stretch: normal;
                    font-style: normal;
                    line-height: normal;
                    letter-spacing: -0.12px;
                    color: #91939d;
                    text-align: center;

                    & .largeMenuFootAvatar {
                        width: 32px;
                        height: 32px;
                        object-fit: contain;
                        margin-right: 17px;
                    }

                    &:hover{
                        color:#ffffff;
                    }
                }

                & .largeMenuFootLogoutContainer {
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    width: 200px;
                    height: 18px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                    font-stretch: normal;
                    font-style: normal;
                    line-height: 1.71;
                    letter-spacing: -0.12px;
                    color: #9c9ea7;

                    & .largeMenuFootLogout {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-width: 32px;
                        min-height: 32px;
                        margin-right: 17px;

                        & .largeMenuFootLogoutSvg {
                            width: 18px;
                            height: 18px;
                            object-fit: contain;
                        }

                        & .largeMenuFootLogoutSvgW {
                            display: none;
                            position: absolute;
                            width: 18px;
                            height: 18px;
                            object-fit: contain;
                        }
                    }

                    &:hover{
                        color:#ffffff;
                        & .largeMenuFootLogoutSvgW {
                            display: flex;
                        }
                    }
                }


            }

            & .largeMenuSize {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                position: relative;
                width: 200px;
                min-height: 64px;
                margin-bottom: 16px;
                font-size: 14px;
                font-weight: 600;
                font-stretch: normal;
                font-style: normal;
                line-height: normal;
                letter-spacing: -0.12px;
                color: #91939d;

                & .largeMenuSizeSvgContainer {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 32px;
                    height: 32px;
                    border-radius: 4px;
                    background-color: #6c84fa;
                    cursor: pointer;
                    margin-right: 14px;

                    & .largeMenuSizeSvg {
                        width: 18px;
                        height: 18px;
                        object-fit: contain;
                    }

                    &:hover {
                        background-color: #5163bb;
                    }
                }
            }
        }
    }
</style>