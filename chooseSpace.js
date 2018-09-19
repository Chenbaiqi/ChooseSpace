//功能:选择空间
//用法示例:<choose-space v-model='value'></choose-space>
//cyn

const chooseSpace =  {
    template:   `<Cascader :data="spaceData" 
                           :load-data="loadElevation" 
                           :value="currentValue"
                           placeholder="选择空间" 
                           :change-on-select="changeOnSelect"
                           @on-change="choose"
                           ></Cascader>`,
    props: {
     	changeOnSelect: {
            type: Boolean,
            default: true
        },
        value: {
     	    type: Array
        }
    },
    data () {
        return {
            spaceData: [],
            currentValue: this.value
        }
    },
    methods: {
        loadUnitProject() {
            var that = this;
            $.ajax({
                url: "/task/unitprojects/",
                type: "get",
                data: {
                    "page": 1,
                    "perPage": 9999
                },
                dataType: "json",
                error: function() {
                    console.log("请求列表失败");
                },
                success: function(res) {
                    let unitfilters = [];
                    for(let each in res.results) {
                        let tmp = {};
                        tmp.label = res.results[each].name;
                        tmp.value = res.results[each].id;
                        tmp.children = [];
                        tmp.loading = false;

                        that.loadElevation(tmp);

                        unitfilters.push(tmp);
                    }
                    that.spaceData = unitfilters;
                }
            });
        },
        loadElevation(item) {
            item.loading = true;
            $.ajax({
                url: "/task/elevations/",
                type: "get",
                data: {
                    "page": 1,
                    "perPage": 9999,
                    "unitproject": item.value
                },
                dataType: "json",
                error: function() {
                    console.log('请求列表失败');
                    item.loading = false;
                },
                success: function(res) {
                    let filters = [];
                    for(let each in res.results) {
                        let tmp = {};
                        tmp.label = res.results[each].name;
                        tmp.value = res.results[each].id;
                        filters.push(tmp);
                    }
                    item.children = filters;
                    item.loading = false;
                }
            });
        },
        choose (val) {
            this.$emit('input',val);
        }
    },
    mounted () {
        this.loadUnitProject();
    },
    watch: {
        value (val) {
            this.currentValue = val
        }
    }
};
