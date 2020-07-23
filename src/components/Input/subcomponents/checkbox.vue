<template>
    <div class="hb-input" :id="id===''?this.uuid:id">
        <label :for="id===''?this.uuid:id" v-if="label">
            {{label}}
        </label>
        <div :class="'checkboxes '+(vertical?'vertical':'')">
            <label :for="'option'+item.value+index+uuid" @click.prevent="selectAction(item.key,item.value)"
                   class="selectItemsCheckbox"
                   v-for="(item, index) in source">

                <img v-if="type==='toggle'" class="toggle-image" :src="(item.selected?activeToggle:defaultToggle)" alt="">
                <template v-else>
                    <input  :checked="item.selected" :disabled="disabled" :id="'option'+item.key+index+uuid"
                           :name="type==='radio'?uuid:''"
                           :type="type">
                    <span :class="(type==='checkbox'?'checkbox-shadow':'radio-shadow')+(disabled?' disabled':'')"></span>
                </template>
                <div>
                    <span>{{item.value}}</span>
                    <span class="item-description" v-if="item.description">{{item.description}}</span>
                </div>
            </label>
        </div>

        <div :class="'errorList '+tooltipPosition" v-if="errorTexts.length">
            <ul>
                <li :class="errorText.state" :key="index" v-for="(errorText, index) in errorTexts">{{errorText.value}}</li>
            </ul>
        </div>
    </div>
</template>

<script>
    import activeToggle from "../icons/active.svg";
    import defaultToggle from "../icons/default.svg";
    let uuid = 0;
    export default {
        name: "Checkbox",
        created() {
            this.uuid = `input-${this.type}-${uuid.toString()}`;
            uuid += 1;
        },
        props: {
            downloadInput: {
                default: false,
            },
            removable: {
                default: false,
            },
            mask: {
                default: undefined
            },
            showClearIcon: {
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
                default: "checkbox"
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
            maskEscapeChars: {
                type: Array,
                default: () => [/\s/g],
            },
            vertical: {
                type: Boolean,
                default: false
            },
            selectionLimit: {
                type: Number,
                default: 10000
            },
            maxCharLimit:{
                type:Number,
                default:255
            },

        },
        data() {
            return {
                activeToggle,
                defaultToggle,
                source: this.allowMutation ? JSON.parse(JSON.stringify(this.externalSource)) : this.externalSource,
                values: this.allowMutation ? JSON.parse(JSON.stringify(this.externalSource)) : this.externalSource,
                value: this.defaultValue || this.externalSource.filter(x => x.selected).map(x => x.key).join(", "),
                oldValue:this.defaultValue || this.externalSource.filter(x => x.selected).map(x => x.key).join(", "),
                selectedValues: this.externalSource.filter(x => x.selected).map(x => x.value).join(", "),
            };
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
        },
        computed: {
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
                return classNames;
            }
        },
        methods:{
            selectAction: function (key, value = "") {
                if (this.disabled) {
                    return;
                }
                let index = this.source.findIndex(x => x.key === key);
                if (!this.multiple || this.source[index].noneSelector) {
                    let that = this;
                    // this.closeSelect();
                    this.source.map(function (item, i) {
                        if (item.selected) {
                            that.$set(that.source[i], "selected", false);
                        }
                    })
                }
                if (index > -1) {
                    if(this.source.filter(x => x.selected === true).length<this.selectionLimit || this.source[index].selected)
                        this.$set(this.source[index], "selected", !this.source[index].selected);
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
        }
    }
</script>

<style scoped>
    .toggle-image{
        height: 32px;
        margin-right: 16px;
        width: 56px;
        cursor: pointer;
    }
</style>
