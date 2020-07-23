<template>
    <div>
        <InputBase class="img-selector" readonly type="text" :placeholder="'Tarih seçiniz'" :icons="icons" :default-value="dates || defaultValue" :label="label" @input="input" @click="togglePicker" @remove="clearInput" :removable="dates || defaultValue"/>
        <div class="picker" v-if="showPicker" >
            <DateTimePicker :s-date="startDate" :e-date="endDate" @dateChange="dateChange" v-closable="{ exclude: ['select_itself'], handler: 'togglePicker'}" />
        </div>
    </div>
</template>
<script>
    import InputBase from "./input.vue";
    import DateTimePicker from "./DateTimePicker/index.vue";
    import closable from "../directives/closable.js";
    import dateIcon from "./DateTimePicker/icons/date-time.svg";
    export default {
        name: "datetime",
        components:{
            InputBase,DateTimePicker
        },
        directives: {closable},
        props:{
            type:{
                default: "datetime",
            },
            label:{
                default: "",
            },
            defaultValue:{
                type: String,
                default: ""
            },

        },
        beforeMount() {
            let [start, end] = this.defaultValue.split("-");
            this.startDate = this.dateConverter(start,"start");
            this.endDate = this.dateConverter(end,"end");
        },
        data(){
            return {
                showPicker:false,
                dates: false,
                startDate: false,
                endDate: false,
                icons: [{reference: dateIcon, position: 'left'}]
            }
        },
        watch:{
            defaultValue: function (newVal, oldVal) {
                let [start, end] = newVal.split("-");
                this.startDate = this.dateConverter(start,"start");
                this.endDate = this.dateConverter(end,"end");
                this.dates = newVal;
            }
        },
        methods:{
            clearInput(){
                this.defaultValue = "";
                this.dates = "";
                this.startDate = this.dateConverter("","start");
                this.endDate = this.dateConverter("","end");
                this.$emit("input","");
            },
            dateConverter(str,type){
                try{
                    let [date, time] = str.trim().split(" ");
                    let [day, month, year] = date.split(".");
                    let [hours,minutes] = time.split(":");
                    return new Date(year,month-1,day,hours,minutes);
                } catch (e) {
                    let date = new Date();
                    if(type==="start")
                        date.setHours(0,0,0,0);
                    else
                        date.setHours(23,59,0,0);
                    return date;
                }

            },
            togglePicker(){
                this.showPicker = !this.showPicker;
            },
            input(){

            },
            dateChange(start, end){
                const options = { year: 'numeric', month: 'numeric', day: 'numeric',hour: '2-digit', minute:'2-digit' };
                let dateFrom = new Date(Date.parse(start));
                let dateTo = new Date(Date.parse(end));
                this.startDate = dateFrom;
                this.endDate = dateTo;
                this.dates = `${dateFrom.toLocaleString('tr-TR', options)} - ${dateTo.toLocaleString('tr-TR', options)}`;
                this.$emit("input",this.dates);
            }
        }
    }
</script>

<style scoped lang="scss">
    .picker{
        position: fixed;
        /*left: 50%;*/
        /*top: 50%;*/
        /*transform: translate(-50%, -50%);*/
        width: 100%;
        height: 100%;
        justify-content: center;
        align-items: center;
        display: flex;
        z-index: 999999999;
        top:0;
        left: 0;
    }
    .img-selector{
        & img.left {
          margin-right: 8px;
        }
    }

</style>
