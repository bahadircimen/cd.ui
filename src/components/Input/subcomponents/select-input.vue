<template>
    <div :id="id===''?this.uuid:id">
        <div class="hb-input">
            <label v-if="label">
                {{label}}
            </label>
        </div>
        <div :class="'select-input-wrapper '+generateClasses" tabindex="1">
            <SelectBase v-bind="selectProps" :error="error && inputValue != ''" :default-value="defaultSelected" @input="selectinput" />
            <InputBase v-bind="inputProps" :error="error" :default-value="defaultValue" @input="input" />
        </div>
    </div>

</template>

<script>
    import InputBase from "./input.vue";
    import SelectBase from "./select.vue"
    let uuid = 0;
    export default {
        name: "select-input",
        components: {InputBase,SelectBase},
        created() {
            this.uuid = `input-${this.type}-${uuid.toString()}`;
            uuid += 1;
        },
        props: {
            submitOnEnter: {
                type: Boolean,
                default: false
            },
            mask: {
                default: undefined
            },
            clearOnSelect: {
                type: Boolean,
                default: false
            },
            id: {
                type: String,
                default: ""
            },
            label: {
                type: String,
                default: ""
            },
            disabled: {
                type: Boolean,
                default: false
            },
            error: {
                type: Boolean,
                default: false
            },
            forceError:{
                type: Boolean,
                default: false
            },
            valid: {
                type: Boolean,
                default: false
            },
            errorTexts: {
                type: Array,
                default: () => []
            },
            placeholder: {
                type: String,
                default: ""
            },
            allowExternalSource: {
                type: Boolean,
                default: false
            },
            externalSource: {
                type: Array,
                default: () => []
            },
            defaultValue: {
                default: ""
            },
            icons: {
                type: Array,
                default: () => []
            },
            tooltipPosition: {
                type: String,
                default: "bottom"
            },
            maskEscapeChars: {
                type: Array,
                default: () => [/\s/g],
            },
            showClearIcon: {
                type: Boolean,
                default: false
            }

        },
        computed:{
            generateClasses() {
                let classNames = " ";
                if((this.inputValue != this.defaultValue || this.defaultSelected != this.selectValue) && !this.disabled && !this.error){
                    classNames+="w-text";
                }
                return classNames;
            },
            inputProps(){
                return (({defaultValue, showClearIcon, submitOnEnter, errorTexts,placeholder,mask,disabled,forceError,tooltipPosition,maskEscapeChars,value,icons }) =>
                    ({defaultValue, showClearIcon, submitOnEnter, errorTexts,placeholder,mask,disabled,forceError,tooltipPosition,maskEscapeChars,value,icons }))(this.$props);
            },
            selectProps(){
                return (({externalSource,disabled,forceError }) =>
                    ({externalSource,disabled,forceError }))(this.$props);
            }
        },
        data(){
          return {
              uuid:0,
              defaultSelected: this.externalSource.filter(x=>x.selected).map(x=>x.key).join(","),
              inputValue: this.defaultValue,
              selectValue:this.externalSource.filter(x=>x.selected).map(x=>x.key).join(","),
          }
        },
        methods:{
            selectinput: function(value, entered=false){
                this.selectValue = value;
                if (this.clearOnSelect) this.inputValue = '';
                this.$emit("input",this.inputValue,this.selectValue, entered);
            },
            input: function(value, entered=false){
                this.inputValue = value;
                this.selectValue = this.externalSource.filter(x=>x.selected).map(x=>x.key).join(",");
                this.$emit("input",this.inputValue,this.selectValue, entered);
            }
        }
    }
</script>

<style lang="scss">
    .select-input-wrapper{
        display: flex;
        width: 538px;
        &:focus{
            outline: none;
        }
        & :focus{
            outline: none;
        }
        & .selectables{
            width: -webkit-max-content !important;
            width: max-content !important;
            top: 60px !important;
        }
        &.w-text{
            & .input-container{
                background-color: white !important;
                border: solid 2px #dddddd !important;
            }
        }
        &:hover{
            & .input-container{
                  border: solid 2px #7b7b7b;
                  background-color: #ffffff;
                  cursor: text;
              }
        }
        &:focus-within{
            & .input-container{
                border: solid 2px var(--orange) !important;
                background-color: #ffffff !important;
                border-right: 0;
            }
        }
        & .hb-input{
            &:first-of-type{
                 width: 27.88%;
            & .input-container{
                  border-right: 0 !important;
                  border-bottom-right-radius: 0;
                  border-top-right-radius: 0;
                &::after{
                    content: " ";
                    height: 24px;
                    width: 1px;
                    background-color: #dddddd;
                    position: relative;
                    right: -16px;
                }
              }
            }
            &:last-of-type{
                 width: 72.12%;
            & .input-container{
                  border-left: 0 !important;
                  border-bottom-left-radius: 0;
                  border-top-left-radius: 0;
                  height: 100%;
              }
            }

        }
    }
</style>
