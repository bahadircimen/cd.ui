<template>
    <div>
        <div class="month-name">
            <span :class="'prev-next ' +(next?'next':'prev')" @click="changeMonth"><img :src="prevNext" alt=""></span>
            <span class="name">{{getMonthName()}} {{year}}</span>
        </div>
        <div class="calendar-container week-names">
            <div class="number wn" v-for="name in weekNames">
                <span>{{name}}</span>
            </div>
        </div>
        <div class="calendar-container">
            <div :class="renderDayClasses(index)" @click="selectDate(index-getFirstWeekDayInMonth()+2)" v-for="index in range(getDaysInMonth()+getFirstWeekDayInMonth()-1)">
                <span v-if="index+1>=getFirstWeekDayInMonth()">{{index-getFirstWeekDayInMonth()+2}}</span>
            </div>
        </div>
    </div>

</template>

<script>
    import prevNext from "../icons/chevron-left.svg";
    const today = new Date();
    export default {
        name: "Calendar",
        props: {
            next:{
                type: Boolean,
                default: false,
            },
            date:{
                type: Date,
                required: true
            },
            from:{
                type: Date,
                default: new Date()
            },
            to:{
                type: Date,
                default: new Date()
            },
        },
        watch: {
            date: function (newVal, oldVal) {
                this.month= newVal.getMonth();
                this.year= newVal.getFullYear();
                this.day = newVal.getDate();
            },
        },
        data() {
            return {
                prevNext,
                weekNames: ["Pzt","Sal","Çar","Per","Cum","Cmt","Paz"],
                sampleDate: undefined,
                month: this.date.getMonth(),
                year: this.date.getFullYear(),
                day: this.date.getDate(),
            };
        },
        computed:{

        },
        methods: {
            renderDayClasses: function(index){
                let className = "number ";
                if(this.isToday(index)){
                    className += "today ";
                }
                if(index-this.getFirstWeekDayInMonth()+2 === 1){
                    className += "from-radius ";
                }
                if(this.getDaysInMonth()+this.getFirstWeekDayInMonth()-1 === index+1){
                    className += "to-radius ";
                }
                if(this.isRange(index) && index+1>=this.getFirstWeekDayInMonth() && this.from.getTime() != this.to.getTime()){
                    className += "range ";
                }
                if(this.isSelected(index)){
                    className += "selected ";
                }
                className += this.fromOrTo(index);
                return className;
            },
            fromOrTo: function(index){
                let day = index - this.getFirstWeekDayInMonth()+2;
                if(this.isSelected(index) && this.isRange(index)){
                    if(this.to.getTime() == (new Date(this.year, this.month-1, day)).getTime()){
                        return "to";
                    } else if((new Date(this.year, this.month-1, day)).getTime() == this.from.getTime()){
                        return "from";
                    }
                }
                return "";
            },
            isSelected: function(index){
                let day = index - this.getFirstWeekDayInMonth()+2;
                if(this.from!=0 && this.to!=0) {
                    return this.to.getTime() == (new Date(this.year, this.month-1, day)).getTime() || (new Date(this.year, this.month-1, day)).getTime() == this.from.getTime();
                    // return this.to >= (new Date(this.year, this.month+1, day)) && (new Date(this.year, this.month+1, day)) >= this.from;
                }
            },
            isRange: function(index){
                let day = index - this.getFirstWeekDayInMonth()+2;
                if(this.from!=0 && this.to!=0) {
                    // return this.to == (new Date(this.year, this.month-1, day)) || (new Date(this.year, this.month-1, day)) == this.from;
                    return this.to >= (new Date(this.year, this.month-1, day)) && (new Date(this.year, this.month-1, day)) >= this.from;
                }
            },
            isToday: function (index) {
                let inThisMonth = today.getMonth()+1 == this.date.getMonth() && today.getFullYear() == this.date.getFullYear();
                return inThisMonth && this.day==(index-this.getFirstWeekDayInMonth()+2);
            },
            getDaysInMonth: function() {
                return (new Date(this.year, this.month, 0)).getDate();
            },
            getFirstWeekDayInMonth: function() {
                let day = (new Date(this.year, this.month-1, 1)).getDay();
                if(day===0){
                    return 7;
                }
                return day;
            },
            getMonthName(){
                return (new Date(this.year, this.month, 0)).toLocaleString('tr-TR', { month: 'long' })
            },
            range(number){
                return [...Array(number).keys()];
            },
            changeMonth(){
                this.$emit("changeMonth");
            },
            selectDate(day){
                this.$emit("changeDate",new Date(this.year,this.month-1, day));
            }
        }
    };
</script>
<style lang="scss" scoped>

    * {
        box-sizing: border-box;
        &:not(input){
            user-select: none;
            -webkit-user-select: none;
        }
    }
    .calendar-container{
        display: flex;
        flex-wrap: wrap;
        width: 238px;
        &.week-names{
            border-bottom: solid 1px #e5e5e5;
        }
        & .number{
            width: 34px;
            justify-content: center;
            display: flex;
            font-size: 12px;
            line-height: 1.5;
            letter-spacing: -0.24px;
            text-align: center;
            color: #484848;
            height: 24px;
            align-items: center;
            margin: 2px 0;

            & span{
                width: 24px;
                height: 24px;
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                /*padding: 0 5px;*/
            }
            &:not(.wn):hover,&.selected{
                & span{
                    background-color: #ff6000;
                    color: white;
                }
                color: white;
                cursor: pointer;
            }

            &.range{
                background-color: rgba(255, 96, 0, 0.12);
                &:nth-of-type(7n+1){
                    border-radius: 4px 0 0 4px;
                }
                &:nth-of-type(7n){
                    border-radius: 0 4px 4px 0;
                }
                &.today>span{
                    border: solid 2px rgba(255, 96, 0, 0.12);
                }
            }
            &.from-radius {
                border-radius: 4px 0 0 4px;
            }
            &.from{
                border-radius: 12px 0 0 12px;
                width: 24px;
                margin-left: 10px;
                & span {
                    position: relative;
                    left: -5px;
                }
            }
            &.to-radius {
                border-radius: 0 4px 4px 0;
            }
            &.to{
                border-radius: 0 12px 12px 0;
                width: 24px;
                margin-right: 10px;
                & span {
                    position: relative;
                    right: -5px;
                }
            }
            &.today{
                &:not(.range) span{
                    border: solid 2px #ff6000;
                }
                & span{
                    background-color: white;
                    color: #ff6000;
                }

            }
            &.wn{
                cursor: default;
            }
        }
    }
    .month-name{
        display: flex;
        & > .name{
            display: flex;
            flex-grow: 1;
            justify-content: center;
            cursor: default;
        }
        & > .prev-next {
            display: flex;
            height: 28px;
            width: 28px;
            justify-content: center;
            align-items: center;
            background-color: #f5f5f5;
            border-radius: 4.7px;
            cursor: pointer;
            &:hover{
                background-color: #e5e5e5;
            }
            &.prev{
                order: 0;
            }
            &.next{
                order: 1;
                & img{
                    transform: rotate(180deg);
                }
            }
        }

    }
</style>

