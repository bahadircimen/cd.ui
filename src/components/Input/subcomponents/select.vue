<template >
    <div class="hb-input">
        <label :for="id===''?this.uuid:id" v-if="label">
            {{label}}
        </label>
        <div :class="generateClasses" ref="select" @click="openSelect" style="cursor: pointer">
            <div style="width: 100%;color:#9b9b9b;white-space: nowrap;overflow-x:hidden;letter-spacing: -0.32px;" :data-id="elementId">
                {{selectedValues || placeholder}}
            </div>
            <img :src="selectBoxClosed" v-if="selectOpened===false">
            <img :src="selectBoxOpened" v-else>
        </div>
        <div class="selectables"
             v-closable="{ exclude: ['select_itself','select_input_itself','select'], handler: 'closeSelect'}"
             v-if="selectOpened===true" :style="(withSearchBar?'':'top: 45px;')">
            <div v-if="withSearchBar" :class="'select-input '+(setShadow? 'scrolled':'')" ref="select_input_itself">
                <img :src="search" alt="">
                <input :id="'element'+elementId" @focus.stop="onSelectFocus" @focusin="input" @input="input" @keydown="input"
                       autofocus placeholder="Arayın veya seçim yapın"
                       type="text" v-model="searchText">
                <img :src="clearText"
                     @click.prevent.stop="removeText('element'+elementId)"
                     style="cursor: pointer"
                     v-if="!valid && icons.filter(x=>x.position==='right').length===0 && searchText.length>0 && type!=='password'"
                >
            </div>
            <ul :style="'overflow-y:scroll;max-height:'+(71+(maxShow+1)*20)+'px;'" @scroll="watchScroll"
                ref="select_itself">
                <li :class="selectInput(item)" @click="selectAction(item.key,item.value)" v-for="(item, index) in values"
                    v-if="!selectWithCheckbox && !item.hidden">
                    <div>
                        <span>{{item.value}}</span>
                        <span class="item-description" v-if="item.description">{{item.description}}</span>
                    </div>
                    <img :src="chevronRight" alt="" v-if="false">
                    <img class="hoverIcon" :src="item.hoverIcon" alt="" v-if="item.hoverIcon">
                    <img :src="selectedIcon" alt="" v-else-if="item.selected">
                </li>
                <li :class="selectInput(item)" @click="selectAction(item.key,item.value)" v-for="(item, index) in values"
                    v-if="selectWithCheckbox">
                    <label :for="'option'+item.value+index+uuid" @click.prevent class="selectItemsCheckbox">
                        <input :checked="item.selected" :id="'option'+item.value+index+uuid" type="checkbox">
                        <span class="checkbox-shadow"></span>
                        <div>
                            <span>{{item.value}}</span>
                            <span class="item-description" v-if="item.description">{{item.description}}</span>
                        </div>
                    </label>
                </li>
                <li v-if="values.length===0">Sonuç Bulunamadı</li>
                <span class="bottom-shadow"></span>
            </ul>
        </div>
        <div :class="'errorList '+tooltipPosition" v-if="errorTexts.length">
            <ul>
                <li :class="errorText.state" :key="index" v-for="(errorText, index) in errorTexts">{{errorText.value}}</li>
            </ul>
        </div>
        <div v-if="invalidText && error" class="invalid-text">{{invalidText}}</div>
    </div>
</template>

<script>
    import closable from "../directives/closable.js";
    import selectedIcon from "../icons/check-2.svg";
    import chevronRight from "../icons/chevron-right.svg";
    import selectBoxClosed from "../icons/selectbox-closed.svg";
    import selectBoxOpened from "../icons/selectbox-opened.svg";
    import checkDark from "../icons/checkDark.svg";
    import selectOpen from "../icons/selectbox.svg";
    import search from "../icons/search.svg";
    let uuid = 0;
    export default {
        name: "Select",
        created() {
            this.uuid = `input-${this.type}-${uuid.toString()}`;
            uuid += 1;
        },
        directives: {closable},
        props: {
            downloadInput: {
                default: false,
            },
            removable: {
                default: false,
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
            withSearchBar: {
                type: Boolean,
                default: true
            },
            error: {
                type: Boolean,
                default: false
            },
            forceError:{
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
            valid: {
                type: Boolean,
                default: false
            },
            type: {
                type: String,
                default: "select"
            },
            allowExternalSource: {
                type: Boolean,
                default: false
            },
            externalSource: {
                type: Array,
                default: () => []
            },
            icons: {
                type: Array,
                default: () => []
            },
            maxShow: {
                type: Number,
                default: 4
            },
            multiple: {
                type: Boolean,
                default: false
            },
            selectRightIcon: {
                type: Boolean,
                default: true
            },
            selectWithCheckbox: {
                type: Boolean,
                default: false
            },
            defaultValue: {
                default: ""
            },
            allowMutation: {
                type: Boolean,
                default: true
            },
            submitOnEnter: {
                type: Boolean,
                default: false
            },
            validations: {
                type: Array,
                default: () => [] //[{function:fcn,params:{},text:'Input Validations'}]
            },
            tooltipPosition: {
                type: String,
                default: "bottom"
            },
            // vertical: {
            //     type: Boolean,
            //     default: false
            // },
            selectionLimit: {
                type: Number,
                default: 10000
            },
            invalidText: {
                type: String,
                default:""
            },
            deselectableSingle: {
                type: Boolean,
                default: false
            }

        },
        data(){
            return{
                selectedIcon,
                chevronRight,
                selectBoxClosed,
                selectBoxOpened,
                checkDark,
                selectOpen,
                search,
                searchText: "",
                selectOpened: false,
                sliceCount: 1,
                setShadow: false,
                oldValue: this.defaultValue || this.externalSource.filter(x => x.selected).map(x => x.key).join(", "),
                source: this.allowMutation ? JSON.parse(JSON.stringify(this.externalSource)) : this.externalSource,
                values: this.allowMutation ? JSON.parse(JSON.stringify(this.externalSource)) : this.externalSource,
                value: this.defaultValue || this.externalSource.filter(x => x.selected).map(x => x.key).join(", "),
                selectedValues: this.externalSource.filter(x => x.selected).map(x => x.value).join(", "),
            }
        },
        watch: {
            defaultValue: function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    this.value = newVal;
                }
            },
            externalSource: function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    this.source = newVal;
                    this.value = newVal.filter(x => x.selected).map(x => x.key).join(", ");
                    this.selectedValues = newVal.filter(x => x.selected).map(x => x.value).join(", ");
                    this.sliceCount = 0;
                }
            },
            selectOpened: function (newVal, oldVal) {
                if (newVal === true) {
                    this.values = this.source;
                    document.getElementById("content")?.classList.add("input-no-scroll");
                } else {
                    document.getElementById("content")?.classList.remove("input-no-scroll");
                }
            },
        },
        computed:{
            elementId() {
                return this.id === '' ? this.uuid : this.id;
            },
            generateClasses() {
                let classNames = "input-container";
                if (this.disabled) {
                    classNames += " disabled";
                }
                if ((this.error && !this.valid && this.value != '') || this.forceError) {
                    classNames += " error";
                }
                if (this.masklessValue(this.value) != this.defaultValue && (this.multiple && this.defaultValue ? this.defaultValue.map(x => x.value).join(", ") !== this.value : true)) {
                    classNames += " w-text";
                }
                if (this.type === "select" && this.selectOpened === true) {
                    classNames += " s-focused";
                }
                if (this.type === "textarea") {
                    classNames += " hasTextarea";
                }
                return classNames;
            }
        },
        methods:{
            masklessValue(value) {
                let plainValue = value.toString();
                if (this.mask) {
                    this.maskEscapeChars.map(function (value, index) {
                        plainValue = plainValue.replace(value, "");
                    });
                }
                return plainValue;
            },
            selectInput(item) {
                let classNames = item.selected ? 'selected' : '';
                classNames += item.description ? ' with-description' : '';
                return classNames
            },
            watchScroll: function (e) {
                if (parseFloat(e.target.scrollTop) > (this.maxShow * (this.sliceCount - .73)) * 20) {
                    this.sliceCount += 1;
                }
                this.setShadow = parseFloat(e.target.scrollTop)>0;
            },
            closeSelect: function () {
                this.selectOpened = false;
            },
            openSelect: function () {
                if(!this.disabled)
                    this.selectOpened = !this.selectOpened;
            },
            onSelectFocus: function () {
               //TODO: nothing here
            },
            removeText: function (el = "") {
                this.searchText = '';
                if (el === "") {
                    document.getElementById(this.elementId).focus();
                } else {
                    this.values = this.source;
                }
            },
            selectAction: function (key, value = "") {
                if (this.disabled) {
                    return;
                }
                let singleSelectedItem = false;
                let index = this.source.findIndex(x => x.key === key);
                if (!this.multiple || this.source[index].noneSelector) {
                    let that = this;
                    this.closeSelect();
                    this.source.map(function (item, i) {
                        if (item.selected) {
                            singleSelectedItem = i;
                            that.$set(that.source[i], "selected", false);
                        }
                    })
                }
                if (index > -1) {
                    if(this.source.filter(x => x.selected === true).length<this.selectionLimit || this.source[index].selected){
                        if(!this.deselectableSingle || singleSelectedItem !== index) {
                            this.$set(this.source[index], "selected", !this.source[index].selected);
                        }
                    }

                }
                if (!this.source[index].noneSelector) {
                    this.source.filter(x => x.noneSelector).map((value, i) => {
                        value.selected = false;
                    });
                }
                let selectedValues = this.source.filter(x => x.selected === true);
                this.selectedValues = selectedValues.map(x => x.value).join(", ");
                this.value = selectedValues.map(x => x.key).join(", ");
                this.$emit("select", this.source, selectedValues, this.selectedValues);
                if (this.multiple) {
                    this.$emit("input", selectedValues.map(x => x.key));
                } else {
                    this.$emit("input", this.value);
                }
                if (this.downloadInput) {
                    this.source.map((value, i) => {
                        value.selected = false;
                    });
                    this.value = "";
                    this.selectedValues = "";
                }
            },
            input: function (event) {
                if(this.value.length>this.maxCharLimit || (event.metaKey || event.ctrlKey)){this.value = this.oldValue; return;}
                if (this.type === "select") {
                    if (event.target.value === "") {
                        this.values = this.source;
                    } else {
                        this.values = this.source.filter(x => x.value.toString().toLocaleLowerCase('tr-TR')
                            .indexOf(event.target.value.toString().toLocaleLowerCase('tr-TR')) > -1);
                    }
                }
                else {
                    if (this.submitOnEnter) {
                        if (event.keyCode === 13) {
                            this.$emit("input", event.target.value);
                            this.$refs.input.blur();
                        }
                    } else {
                        this.$emit("input", event.target.value, this.masklessValue(event.target.value));
                    }
                }
                this.oldValue = this.value;
            },
        }
    }
</script>
<style lang="scss">
    .input-no-scroll{
        overflow: hidden !important;
        height: 100% !important;
    }
</style>
<style scoped>
    .invalid-text{
        font-size: 12px;
        line-height: 1.5;
        letter-spacing: -0.24px;
        color: #fa3f3f;
        margin-left: 8px;
        position: absolute;
        z-index: 2;
        top: calc(100% + 8px);
    }
</style>
