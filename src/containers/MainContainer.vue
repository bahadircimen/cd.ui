<template>
<div id="app" class="main-container">
    <LeftMenu :pages="pages" :parentPage="parentPage" :childPage="childPage" :userName="userName" @logout="logout"/>
    <Announcement v-if="router==='Announcement'" @openShowNewAnnouncementModal="openShowNewAnnouncementModal"/>
    <NewAnnouncementModal v-if="showNewAnnouncementModal" @closeModal="closeNewAnnouncementModal"/>
    <UserDefinitions v-if="router==='UserDefinitions'"/>
</div>
</template>

<script>
    import authService from "../services/authService";
    import LeftMenu from "../components/LeftMenu"
    import Announcement from "../screens/Announcement/index";
    import NewAnnouncementModal from "../components/NewAnnouncementModal/index";
    import req from "../helpers/requests"
    import UserDefinitions from "../screens/UserDefinitions/index";

    export default {
        name: "MainContainer",
        components:{
            UserDefinitions,
            NewAnnouncementModal,
            Announcement,
            LeftMenu,
        },
        mounted() {
            this.verifyToken();
        },
        data(){return{
            authToken:"",
            userName:"",
            showNewAnnouncementModal:false,
            pages:[],
            router:"Announcement",
            userDetails:{},
            parentPage:[],
            childPage:[]
        }},
        methods:{
            async getPage(roleId){
                let pages = await req.userPage(roleId);
                this.pages=pages.data;
                this.parentPage=pages.data.filter(e=> !e.parentId);
                this.childPage=pages.data.filter(e=> e.parentId);
            },
            async getUserDetails(userName){
              let userDetails = await req.userDetail(userName);
                this.userDetails = userDetails.data;
                let roleId = userDetails.data.roleId;
                this.getPage(roleId)
            },
            getAuthToken() {
                this.authToken = window.$cookies.get('t_token_backoffice')
            },
            async verifyToken(){
                this.getAuthToken();
                let verifyToken= await authService.verifyToken(this.authToken);
                if (verifyToken.success) {
                    let userName=verifyToken.authUser.userName;
                    this.userName = userName;
                    console.log(verifyToken.authUser);
                    this.getUserDetails("huseyin.ozdemir")
                }
                else {
                    const returnUrl = window.location.href;
                    const encReturnUri = encodeURIComponent(returnUrl);
                    window.$cookies.remove('t_token_backoffice','','.hepsiburada.com');
                    window.location.replace('http://mpadmin.qa.hepsiburada.com/?returnUri='+encReturnUri);
                    this.authToken = "";
                }
            },
            openShowNewAnnouncementModal(){
                this.showNewAnnouncementModal=true;
            },

            closeNewAnnouncementModal(){
                this.showNewAnnouncementModal=false;
            },
            logout(){
                console.log("sad")
                window.$cookies.remove('t_token_backoffice','','.hepsiburada.com');
                this.verifyToken();
            }
        },
    }
</script>

<style scoped lang="scss">
    div#app {
        font-family: -apple-system, system-ui, Arial, Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif !important;
    }

    textarea, button, input {
        font-family: inherit;
    }
    .main-container{
      display: flex;
      width: 100%;
      height: 100%;
    }
</style>

<style lang="scss">
    html {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        scroll-behavior: smooth;
        background-color: white;
    }

    body {
        background-color: white;
        width: 100% !important;
    }

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        -webkit-overflow-scrolling: touch;

        ::-webkit-scrollbar {
            background-color: transparent !important;
            width: 16px
        }

        /* background of the scrollbar except button or resizer */
        ::-webkit-scrollbar-track {
            background-color: transparent !important;
        }

        /* scrollbar itself */
        ::-webkit-scrollbar-thumb {
            background-color: #babac0;
            border-radius: 16px;
            border: 4px solid #fff
        }

        ::-webkit-scrollbar * {
            background: transparent !important;
        }

        /* set button(top and bottom of the scrollbar) */
        ::-webkit-scrollbar-button {
            display: none
        }
    }

    textarea {
        font-family: -apple-system, system-ui, Arial, Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif !important;
    }

    textarea::placeholder, textarea::-webkit-input-placeholder {
        font-family: -apple-system, system-ui, Arial, Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif !important;
    }

    div#app {
        padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left) !important;
        font-family: -apple-system, system-ui, Arial, Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif !important;
    }
</style>