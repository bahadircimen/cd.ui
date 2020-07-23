<template>
    <div class="user-definitions-container">
        <div class="input">
            <Input label="Kullanıcı Adı" placeholder="Rol tanımlayacağınız kullanıcı adını giriniz.."/>
            <Input style="margin: 24px 0 0 0" label="Roller" type="checkbox" :multiple="true" :allow-mutation="true" :external-source="externalSource" :vertical="true"/>
        </div>
    </div>
</template>

<script>
    import Input from "../../components/Input"
    import req from "../../helpers/requests"
    export default {
        name: "UserDefinitions",
        components:{
            Input
        },
        mounted() {
          this.getRoles()
        },
        data(){return{
            externalSource:[]
        }},
        methods:{
            async getRoles(){
                let roles = await req.role();
                let externalSource = roles.data.map(a=>{return {key:a.id, value:a.name, selected:false}});
                this.externalSource = externalSource
            }
        }
    }
</script>

<style scoped lang="scss">
    .user-definitions-container{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .input {
            width: 480px;
            height: max-content;
            margin: 120px 0 0 0;
        }
    }
</style>