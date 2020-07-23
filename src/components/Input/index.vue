<template>
	<div class="hb-input-wrapper">
		<InputBase v-if="['text','password','number','textarea','modal'].includes(type)" v-bind="this.$props" @input="input" @remove="remove"/>
		<SelectBase v-else-if="type==='select'" v-bind="this.$props" @select="select" @input="input" />
		<CheckboxBase v-else-if="type==='checkbox' || type==='radio'|| type==='toggle'" v-bind="this.$props" @select="select" @input="input" />
		<SelectInput v-else-if="type==='select-input'" v-bind="this.$props" @select="select" @input="input"/>
		<DateTime v-else-if="type==='datetime'" v-bind="this.$props" @input="input"/>
	</div>
</template>

<script>
	import InputBase from "./subcomponents/input.vue";
	import SelectBase from "./subcomponents/select.vue";
	import CheckboxBase from "./subcomponents/checkbox.vue";
	import SelectInput from "./subcomponents/select-input.vue";
	import DateTime from "./subcomponents/datetime.vue";
	import "./hb-input.scss";

	export default {
		name: "Input",
		components:{
			SelectInput,
			InputBase,SelectBase,CheckboxBase,DateTime
		},
		props: {
			downloadInput: {
				default: false,
			},
			removable: {
				default: false,
			},
			clearOnSelect: {
				type: Boolean,
				default: false
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
				default: "text"
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
			invalidText: {
				type: String,
				default: "",
			},
			deselectableSingle: {
				type: Boolean,
				default: false
			}

		},
		data() {
			return {};
		},
		watch:{},
		methods: {
			input(){
				this.$emit("input",...arguments);
			},
			select(){
				this.$emit("select",...arguments);
			},
			remove() {
				this.$emit('remove');
			},
		}
	};
</script>

<style lang="scss" scoped>

</style>

