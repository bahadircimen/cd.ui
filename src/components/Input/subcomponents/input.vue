<template>
    <div class="hb-input">
        <label :for="id===''?this.uuid:id" v-if="label">
            {{label}}
        </label>
        <div :class="generateClasses"  @click="focusElement">
            <img class="left" v-for="icon in icons.filter(x=>x.position==='left')" :alt="has('alt',icon)"
                 :src="has('reference',icon)">
            <textarea v-if="type==='textarea'" :default-value="defaultValue" :disabled="disabled"
                      :id="id===''?this.uuid:id" :placeholder="placeholder" :type="type"
                      @input="input" @keydown="input" v-model="value" ref="input"></textarea>
            <input
                    v-else-if="mask"
                    :default-value="defaultValue"
                    :data-value="value"
                    :data-position="position"
                    ref="input"
                    class="input"
                    v-model="value"
                    v-mask="masker"
                    :disabled="disabled"
                    :id="id===''?this.uuid:id"
                    :placeholder="placeholder"
                    :type="(type==='password'&&visibility)?'text':type"
                    @input="input"
                    @keydown="input"
                    :readonly="readonly"
                    :key="(id===''?this.uuid:id)+'-masky'"
            >

            <input
                    v-else
                    :default-value="defaultValue"
                    :data-value="value"
                    :data-position="position"
                    ref="input"
                    class="input"
                    v-model="value"
                    :disabled="disabled"
                    :id="id===''?this.uuid:id"
                    :placeholder="placeholder"
                    :type="(type==='password'&&visibility)?'text':type"
                    @input="input"
                    @keydown="input"
                    :readonly="readonly"
                    :key="(id===''?this.uuid:id)+'-maskless'"
            >

            <img class="right" :alt="has('alt',icon)" :src="has('reference',icon)"
                 v-for="icon in icons.filter(x=>x.position==='right')">
            <img :src="validIcon" alt="valid" v-if="valid">
            <img :src="clearText"
                 @click="clearTextFunction"
                 style="cursor: pointer"
                 v-if="!valid && icons.filter(x=>x.position==='right').length===0 && value.length>0 && type!=='password' && !disabled && showClearIcon">
            <img :src="errorInfo"
                 v-if="value != '' && error && icons.filter(x=>x.position==='right').length===0 && type!=='password'">
            <img :src="passwordShow" v-if="type==='password' && visibility" @click="visibility=false">
            <img :src="passwordHide" v-if="type==='password' && !visibility" @click="visibility=true">
            <img :src="removableIcon" v-if="removable" @click="triggerRemovable">
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
    import clearText from "../icons/clear-text.svg";
    import passwordHide from "../icons/password-hide.svg";
    import passwordShow from "../icons/password-show.svg";
    import removableIcon from '../icons/delete.svg';
    import validIcon from "../icons/check.svg";
    import errorInfo from "../icons/info.svg";
    let uuid = 0;
    export default {
        name: "InputBase",
        created() {
            this.uuid = `input-${this.type}-${uuid.toString()}`;
            uuid += 1;
        },
        props:{
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
            invalidText: {
                type: String,
                default: "",
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
                default: "text"
            },
            defaultValue: {
                type: [Number,String],
                default: ""
            },
            icons: {
                type: Array,
                default: () => []
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
            maxCharLimit:{
                type:Number,
                default:255
            },
            forceFilled:{
                type:Boolean,
                default:false
            },
            readonly:{
                type:Boolean,
                default:false
            }
        },
        data(){
            return {
                clearText,
                passwordHide,
                passwordShow,
                removableIcon,
                validIcon,
                errorInfo,
                visibility: false,
                value: this.defaultValue || "",
                position: 0,
                oldValue:this.defaultValue,
            };
        },
        computed:{
            masker(){
                let mask = this.mask;
                if(typeof mask  === "string" || Array.isArray(mask)){
                    return {mask,placeholder:"_"}
                }
                else{
                    if(!mask.placeholder){
                        mask.placeholder = "_";
                    }
                }
                return mask
            },
            generateClasses() {
                let classNames = "input-container";
                if (this.disabled) {
                    classNames += " disabled";
                }
                if ((this.error && !this.valid && this.value != '') || this.forceError) {
                    classNames += " error";
                }
                if ((this.masklessValue(this.value) != this.defaultValue && (this.multiple && this.defaultValue ? this.defaultValue.map(x => x.value).join(", ") !== this.value : true))) {
                    classNames += " w-text";
                }
                if (this.type === "select" && this.selectOpened === true) {
                    classNames += " s-focused";
                }
                if (this.type === "textarea") {
                    classNames += " hasTextarea";
                }
                return classNames;
            },
            elementId() {
                return this.id === '' ? this.uuid : this.id;
            },
        },
        watch: {
            defaultValue: function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    this.value = newVal;
                    this.oldValue = newVal;
                }
            },
        },
        methods: {
            focusElement(){
                this.$refs.input.focus();
                this.$emit("click",this.value);
            },
            triggerRemovable() {
                this.$emit('remove');
            },
            clearTextFunction: function () {
                this.value = "";
                this.$emit("input", this.value);
            },
            masklessValue(value) {
                let plainValue = value? value.toString(): "";
                if (this.mask) {
                    this.maskEscapeChars.map(function (value, index) {
                        plainValue = plainValue.replace(value, "");
                    });
                }
                return plainValue;
            },
            has(param, object) {
                if (param in object) {
                    return object[param];
                } else {
                    return "";
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
                            this.$emit("input", event.target.value, true);
                            this.$refs.input.blur();
                        } else {
                            this.$emit("input", event.target.value, false);
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
