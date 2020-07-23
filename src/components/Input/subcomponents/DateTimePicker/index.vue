<template>
    <div>
        <div class="picker-container">
            <div class="date-container">
                <div class="date-range" v-if="showRanges">
                    <div :class="'single-range '+(range.selected?'selected':'')" v-for="range in ranges">{{range.text}}</div>
                </div>
                <div class="calendar">
                    <div class="cal-w-hour">
                        <Calendar
                                :date="addMonths(new Date(),currentOffset)"
                                @changeMonth="currentOffset-=1"
                                @changeDate="setDate"
                                :from="fromDate"
                                :to="endDate"
                                @hourChange="(val)=>hourChange(val,'from')"
                        />
                        <div class="hour-container">
                            <div>{{getFormattedDate(fromDate)}}</div> <input type="text" @input="dateEmitter" v-model="fromHour" v-mask='{regex:"^([01]\\d|2[0-3]):([0-5]\\d)$"}' placeholder="__:__">
                        </div>
                    </div>
                    <div class="cal-w-hour">
                        <Calendar
                                :date="addMonths(new Date(),currentOffset+1)"
                                next
                                @changeMonth="currentOffset+=1"
                                @changeDate="setDate"
                                :from="fromDate"
                                :to="endDate"
                                @hourChange="(val)=>hourChange(val,'to')"
                        />
                        <div class="hour-container">
                            <div>{{getFormattedDate(endDate)}}</div> <input type="text" @input="dateEmitter" v-model="toHour" v-mask='{regex:"^([01]\\d|2[0-3]):([0-5]\\d)$"}' placeholder="__:__">
                        </div>
                    </div>

                </div>
            </div>
            <div class="message-container"></div>
        </div>
    </div>

</template>

<script>
    import Calendar from "./subcomponents/calendar.vue";

    export default {
        name: "DateTimePicker",
        components:{Calendar},
        props: {
            showRanges:{
                default:false,
                type: Boolean
            },
            sDate:{
                type: Date,
                default: () => new Date()
            },
            eDate:{
                type: Date,
                default: () => new Date()
            }
        },
        beforeMount() {
            const options = {hour: '2-digit', minute:'2-digit' };
            this.fromHour = this.sDate.toLocaleString("tr-TR",options);
            this.toHour = this.eDate.toLocaleString("tr-TR",options);
            this.fromDate = this.sDate
            this.fromDate.setHours(0,0,0,0);
            this.endDate = this.eDate
            this.endDate.setHours(0,0,0,0);
        },
        data() {
            return {
                ranges: [
                    {text:"Bugün",selected:true},
                    {text:"Dün"},
                    {text:"Bu hafta"},
                    {text:"Geçen hafta"},
                    {text:"Bu ay"},
                    {text:"Tarih aralığı seç"},
                ],
                currentOffset:1,
                fromDate: new Date(),
                endDate: new Date(),
                newSet: true,
                fromHour: "00:00",
                toHour: "23:59",
            };
        },
        computed:{

        },
        methods: {
            dateEmitter(){
                // console.log(this.fromHour,this.toHour)
                if(this.fromHour.includes("_") || this.toHour.includes("_") || this.toHour === "" || this.fromHour === ""){return;}
                let fromParts = this.fromHour.split(":");
                let toParts = this.toHour.split(":");
                this.fromDate.setHours(fromParts[0],fromParts[1],0,0);
                this.endDate.setHours(toParts[0],toParts[1],0,0);
                this.$emit("dateChange",this.fromDate,this.endDate);
                this.fromDate.setHours(0,0,0,0);
                this.endDate.setHours(0,0,0,0);
            },
            hourChange(e,where){
                if(where==="from"){
                    this.fromHour = e.target.value;
                } else {
                    this.toHour = e.target.value;
                }
                this.dateEmitter();
            },
            getFormattedDate(date){
                const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                return date.toLocaleDateString("tr-TR", options);
            },
            addMonths(date, months) {
                let d = date.getDate();
                date.setMonth(date.getMonth() + +months);
                if (date.getDate() != d) {
                    date.setDate(0);
                }
                return date;
            },
            setDate(date){
                if(this.fromDate>date && !this.newSet) {
                     this.endDate = this.fromDate;
                     this.fromDate = date;
                     this.newSet = true;
                 } else
                 if(this.newSet) {
                    this.fromDate = date;
                    this.endDate = new Date(date.getTime());
                    this.newSet = false
                 } else {
                    this.endDate = date;
                    this.newSet = true;
                }
                this.dateEmitter();
            }
        }
    };
</script>
<style>
    body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    }
</style>
<style lang="scss" scoped>

    * {
       box-sizing: border-box;
    }
    .picker-container{
        border-radius: 8px;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.16);
        border: solid 1px rgba(0, 0, 0, 0.08);
        background-color: #ffffff;
        & .date-container{
            display: flex;
            & .date-range{
                padding: 16px;
                width: 212px;
                border-right: solid 1px #e5e5e5;
                & .single-range{
                    padding: 6px 40px 6px 12px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 600;
                    line-height: 1.5;
                    letter-spacing: -0.28px;
                    color: #484848;
                    width: 180px;
                    height: 32px;
                    border-radius: 8px;
                    background-color: #ffffff;
                    &:hover,&.selected{
                        background-color: rgba(#ff6000,0.08);
                        color: #ff6000;
                    }
                }
            }
            & .calendar{
                display: flex;
                justify-content: space-between;
                padding: 16px;
                width: 548px;
                min-height: 290px;
                & .cal-w-hour{
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }
                & .hour-container{
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    &>div{
                        width: max-content;
                        font-size: 14px;
                        color: #484848;
                    }
                    & input{
                        width: 60px;
                        border: none;
                        font-size: 18px;
                        line-height: 1.5;
                        letter-spacing: -0.24px;
                        text-align: center;
                        color: #484848;
                        font-weight: 600;
                        align-items: center;
                        margin: 2px 0;
                        &:focus{
                            outline: none;
                        }
                    }
                }
            }
        }

    }
</style>

