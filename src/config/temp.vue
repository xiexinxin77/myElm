<template>
    <div class="V0206-company-connman">
        <div class="V0206-company-connman-title">
            <div class="V0206-company-connman-title-name">上市公司关联人</div>
            <div class="V0206-connect-acct-addItem" v-if="!isExistObj.show || isExistObj.value=='1'">
                <el-button @click="addItemButton()" class="V0206-connect-acct-add-module" round>添加 </el-button>
            </div>
        </div>
        <div id="isExist" class="V0206-isExist" v-if="isExistObj.show">
            <el-form-item label="是否存在上市关联人信息:" >
                <el-select v-model="isExistObj.value" @change="onSelectExist">
                    <el-option label="是" value="1"></el-option>
                    <el-option label="否" value="0"></el-option>
                </el-select>
            </el-form-item>
        </div>

        <div class="V0206-company-connman-for-class">
            <div v-for="(formObj,index) in companyConncomList" :key="'restrict-'+ index">
                <div align="right" class="V0206-company-connman-deleteItem" v-if="formObj.OP_TYPE === '0'">
                    <el-button class="V0206-company-connman-delete-module" @click="connectedAcctDelete(index)" round>删除 </el-button>
                </div>

                <el-form :inline="true" :ref="'company-conncom-'+index" type="info" :model="formObj" :rules="restrictedRules" class="V0206-company-connman-form-class" label-position="right">

                    <el-form-item label="交易市场：" prop="STKEX" :class="{'self-normalInput-required': formObj.stkexRequired =='1'}">
                        <el-select :disabled="formObj.disabled" v-model="formObj.STKEX" clearable placeholder @change="()=>commonChange(formObj,index,'STKEX')">
                            <el-option v-for="(stkexObj ,stkexIndex) in stkexDicts" :key="stkexIndex" :label="stkexObj.DICT_ITEM +'-'+stkexObj.DICT_ITEM_NAME" :value.sync="stkexObj.DICT_ITEM"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="证券代码：" prop="STK_CODE" :class="{'self-normalInput-required': formObj.stkcodeRequired =='1'}">
                        <el-input :disabled="formObj.disabled" v-model="formObj.STK_CODE" @input.native.stop='()=>commonChange(formObj,index,"STK_CODE")' placeholder style="width:484px;"></el-input>
                    </el-form-item>

                    <el-form-item label="证券名称：" prop="STK_NAME" :class="{'self-normalInput-required':  formObj.stknameRequired =='1'}">
                        <el-input v-model="formObj.STK_NAME" placeholder style="width:484px;" @input.native.stop='()=>commonChange(formObj,index,"STK_NAME")'></el-input>
                    </el-form-item>

                    <el-form-item v-if="!isChange" label="证券账户：" prop="TRDACCT" :class="{'self-normalInput-required': formObj.trdacctRequired =='1'}">
                        <el-input v-model="formObj.TRDACCT" @input.native.stop='()=>commonChange(formObj,index,"TRDACCT")' placeholder style="width:484px;"></el-input>
                    </el-form-item>

                    <el-form-item v-if="isChange" label="信用证券账户" prop="TRDACCT" :class="{'self-normalInput-required': formObj.trdacctRequired =='1'}">
                        <el-select @change="commonChange(formObj,index,'TRDACCT')" :disabled="formObj.disabled" v-model="formObj.TRDACCT" style="width: 484px;">
                            <el-option v-for="(creditTrdacctObj) in formObj.creditTrdacctDicts" :label="creditTrdacctObj.TRDACCT" :value="creditTrdacctObj.TRDACCT" :key="creditTrdacctObj.TRDACCT"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="账户名称：" prop="TRDACCT_NAME" :class="{'self-normalInput-required': formObj.trdacctnameRequired =='1'}">
                        <el-input v-model="formObj.TRDACCT_NAME" :disabled="formObj.relaNameDisabled =='1'" @input.native.stop='()=>commonChange(formObj,index,"TRDACCT_NAME")' placeholder style="width:484px;"></el-input>
                    </el-form-item>

                    <el-form-item label="关联关系：" prop="RELAKIND_PUBCOM" :class="{'self-normalInput-required': formObj.relakindpubcomRequired =='1'}">
                        <el-select :disabled="formObj.disabled" v-model="formObj.RELAKIND_PUBCOM" filterable clearable placeholder @change="()=>commonChange(formObj,index,'RELAKIND_PUBCOM')">
                            <el-option v-for="(relakindPubCommObj ,relakindPubCommIndex) in relakindpubcomDicts" :key="relakindPubCommIndex" :label="relakindPubCommObj.DICT_ITEM +'-'+relakindPubCommObj.DICT_ITEM_NAME" :value.sync="relakindPubCommObj.DICT_ITEM"> </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
        </div>

        <loading :loadingText="loadingText" :showLoading="loading" ownClass="movi"></loading>
        <message-box :messageBoxProps="messageBoxProps"></message-box>
    </div>
</template>

<script>
import loading from '../../../../components/common/loading';
import date from '../../../../tools/date';
import messageBox from '../../../../components/common/messageBox';
import validateRules from '../../../../components/preEntry/validateRules';
export default {
    data() {
        let commRequiredValid = (that, value, key, callback) => {
            let formObj = that.companyConncomList[that.companyConncomList.length - 1]
            if (!value) {
                if (that.addFlag) {
                    callback(new Error('请填写完已有记录再添加'))
                } else {
                    if (formObj[key] == '1') {
                        callback(new Error('该项为必填项'))
                    }
                }
            }
        }
        
        let stkexValid = (rule, value, callback) => {
            let that = this;
            commRequiredValid(that, value, 'stkexRequired', callback)
            callback();
        };

        let stkcodeValid = (rule, value, callback) => {
            let that = this;
            commRequiredValid(that, value, 'stkcodeRequired', callback)
            if (!_.isEmpty(value) && that.stkCodeFlag) {
                that.getStkcodeStorck(value);
                callback(new Error("证券代码信息查询中。。。"));
                return;
            }
            callback();
        };

        let stkNameValid = (rule, value, callback) => {
            let that = this;
            commRequiredValid(that, value, 'stknameRequired', callback)
            callback();
        };

        let trdacctValid = (rule, value, callback) => {
            let that = this;
            commRequiredValid(that, value, 'trdacctRequired', callback)
            let trdacctFlag = validateRules["numchar"].valid(value, [10]);
            if (!_.isEmpty(value) && !trdacctFlag) {
                callback(new Error("输入长度必须等于10个字符"));
                return;
            }
            callback();
        };


        let trdacctNameValid = (rule, value, callback) => {
            let that = this;
            commRequiredValid(that, value, 'trdacctnameRequired', callback)
            let valVaild = validateRules['val'].valid(value, [1, 32]);
            if (!_.isEmpty(value) && !valVaild) {
                callback(new Error("请输入1到32个字符，且不能输入特殊字符(中文算两个字符)!"));
                return;
            }
            callback();
        };


        let relakindpubcomValid = (rule, value, callback) => {
            let that = this;
            commRequiredValid(that, value, 'relakindpubcomRequired', callback)
            callback();
        };

        return {
            loadingText: "",
            loading: false,
            messageBoxProps: {},
            vaildRowIndex: "",
            removeDataShow: false,

            relakindpubcomDicts: [],//关联关系 
            stkexDicts: [],//交易市场
            creditTrdacctDicts: [], // 信用证券账户

            trdacctList: [],//证券账户

            nextIdCodeValid: false, //证券代码,下一步时校验标识 
            addFlag: false,//添加标识

            companyConncomList: [],
            restrictedRules: {
                STKEX: [{
                    validator: stkexValid,
                    trigger: 'change,blur'
                }],

                STK_CODE: [{
                    validator: stkcodeValid,
                    trigger: 'blur'
                }],

                STK_NAME: [{
                    validator: stkNameValid,
                    trigger: 'blur'
                }],

                TRDACCT: [{
                    validator: trdacctValid,
                    trigger: 'blur'
                }],

                TRDACCT_NAME: [{
                    validator: trdacctNameValid,
                    trigger: 'blur'
                }],

                RELAKIND_PUBCOM: [{
                    validator: relakindpubcomValid,
                    trigger: 'blur'
                }],
            },
            COMPANY_CONNMAN_INFO: [],
            orgList: [],
            custTrdAcct: [],
            isExistObj: {
                value: '0',
                show: false
            },
            isChange: false // 是否为资料变更
        };
    },
    components: {
        loading,
        messageBox
    },
    props: ['bizData', 'historyData', 'oppBusiData', 'groupDatas', 'busiCode'],
    created() {
        let that = this;
        that.custInfo = that.$storage.getJsonSession(that.$definecfg.CUSTOMER_INFO) || {};
        let custInfo = that.custInfo;
        // 客户已开通两融,则是资料变更
        if (custInfo && !_.isEmpty(custInfo.CUST_EXT_ATTR) && _.indexOf(custInfo.CUST_EXT_ATTR, "1") != -1) {
            that.isChange = true;
        }
        that.relakindpubcomDicts = that.oppBusiData.relakindpubcomDicts;//类型 
        that.stkexDicts = that.oppBusiData.stkexDicts;//交易市场  
        that.creditTrdacctDicts = _.filter(that.oppBusiData.STKACCT_INFO, obj => ["2","3","8"].includes(obj.TRDACCT_EXCLS));// 信用证券账户
        that.transExistInfo(that.oppBusiData.COMPANY_CONNMAN_INFO)
        let companyConncomArr;
        if(that.historyData.QUOTA_INFO && that.historyData.QUOTA_INFO.COMPANY_CONNMAN_INFO != undefined) {
            let tempInfo = _.filter(that.historyData.QUOTA_INFO && that.historyData.QUOTA_INFO.COMPANY_CONNMAN_INFO, obj => obj.OPER_TYPE != "2")
            companyConncomArr = _.cloneDeep(tempInfo)
        } else {
            companyConncomArr = _.cloneDeep(that.oppBusiData.COMPANY_CONNMAN_INFO) || []
        }
        that.COMPANY_CONNMAN_INFO = companyConncomArr || [];
        //①	若系统中无上市关联人信息，默认显示“是否存在关联人信息”字段
        if (_.isEmpty(that.oppBusiData.COMPANY_CONNMAN_INFO)) {
            that.isExistObj.show = true;
            _.isEmpty(that.COMPANY_CONNMAN_INFO) ? that.isExistObj.value = '0' : that.isExistObj.value = '1'
        } else {
            that.isExistObj.show = false;
            if (_.isEmpty(that.COMPANY_CONNMAN_INFO)) {
                that.COMPANY_CONNMAN_INFO.push(_.extend({}, that.companyConnmanFormData(), {OP_TYPE: '0'}))
            }
        }
    },
    computed: {},
    watch: {},
    mounted() {
        let that = this;
        that.$nextTick(function () {
            that.setData();
        });
    },
    methods: {
        setData() {
            let that = this;
            if (that.COMPANY_CONNMAN_INFO.length) {
                that.companyConncomList = that.COMPANY_CONNMAN_INFO;
            }
        },
        onSelectExist(val) {
            let that = this;
            if (val == '1') {
                that.companyConncomList.push(_.extend({}, that.companyConnmanFormData(), {OP_TYPE: '0'}))
            } else {
                that.companyConncomList = [];
            }
        },
        transExistInfo(infoArr) {
            let that = this;
            if (!_.isEmpty(infoArr)) {
                _.each(infoArr, (obj, index) => {
                    if (obj && obj.STKEX) {
                        obj.creditTrdacctDicts = _.filter(that.creditTrdacctDicts, v => v.STKEX == obj.STKEX)
                    }
                    obj.disabled = true
                    if (index == 0) {
                        obj.OP_TYPE = '';
                        obj.showAddBtn = '1'
                    } else {
                        obj.OP_TYPE = '0';
                        obj.showAddBtn = '0';
                    }
                })
            }
        },
        companyConnmanFormData() {
            return {
                OP_TYPE: "", //0为新增
                showAddBtn: "1", //是否显示按钮：0不显示，1显示

                STKEX: "",//交易市场 
                STK_CODE: "",//证券代码
                STK_NAME: "",//证券名称
                TRDACCT: "",//证券账户
                TRDACCT_NAME: "",//账户名称 
                RELAKIND_PUBCOM: "",//关联关系 
                stkexRequired: "0",//0不必填 1必填
                stkcodeRequired: "0", //0不必填 1必填
                stknameRequired: "0",//0不必填 1必填
                trdacctRequired: "0",//0不必填 1必填
                trdacctnameRequired: "0",//0不必填 1必填
                relakindpubcomRequired: "0",//0不必填 1必填   
            }
        },
        stkexSelect(formObj) {
            let that = this;
            formObj.STK_CODE = "";
            formObj.STK_NAME = "";
            if (that.isChange) {
                formObj.TRDACCT = ""
            }
            formObj.creditTrdacctDicts = _.filter(that.creditTrdacctDicts, trdacct => trdacct.STKEX == formObj.STKEX && trdacct.TRDACCT_STATUS != '9')
        },
        commonChange(formObj, index, fieldName) {
            let that = this;
            that.vaildRowIndex = index;

            !_.isEmpty(fieldName) && !_.isEmpty(formObj[fieldName]) && that.$refs['company-conncom-' + index][0].clearValidate([fieldName]);

            fieldName == "STKEX" && that.stkexSelect(formObj);
            if (fieldName == "STK_CODE" && !_.isEmpty(formObj.STK_CODE)) {
                that.stkCodeFlag = true;
            } else if (fieldName == "STK_CODE" && _.isEmpty(formObj.STK_CODE)) {
                that.stkCodeFlag = false;
            }
            that.setRequired(formObj, index);
        },
        setRequired(formObj, index) {
            let that = this;
            if (formObj.STKEX ||
                formObj.STK_CODE ||
                formObj.STK_NAME ||

                formObj.TRDACCT ||
                formObj.TRDACCT_NAME ||
                formObj.RELAKIND_PUBCOM
            ) {
                formObj.stkexRequired = "1";
                formObj.stkcodeRequired = "1";
                formObj.stknameRequired = "1";
                formObj.trdacctRequired = "1";
                formObj.trdacctnameRequired = "1";
                formObj.relakindpubcomRequired = "1";
            } else {
                formObj.stkexRequired = "0";
                formObj.stkcodeRequired = "0";
                formObj.stknameRequired = "0";
                formObj.trdacctRequired = "0";
                formObj.trdacctnameRequired = "0";
                formObj.relakindpubcomRequired = "0";
                that.$refs['company-conncom-' + index][0].clearValidate();
            }
        },

        getStkcodeStorck(value) {
            let that = this;

            that.loading = true;
            that.loadingText = '证券代码信息查询中...';
            let market = !_.isEmpty(that.vaildRowIndex + "") && that.companyConncomList[that.vaildRowIndex].STKEX || "";
            return new Promise((resolve, reject) => {
                Promise.all([
                    that.$syscfg.K_Request('Y2001051', {
                        MARKET: market,
                        SECU_CODE: value,
                        STKCODE: value,
                        FISL: "1" //查询融资融券
                    }) || []
                ]).then(res => {
                    that.loading = false;
                    let stkcodeData = res[0].Data || [];
                    if (stkcodeData.length) {
                        that.companyConncomList[that.vaildRowIndex].STKEX = stkcodeData[0].MARKET;
                        that.companyConncomList[that.vaildRowIndex].STK_NAME = stkcodeData[0].STKNAME;
                        that.$refs['company-conncom-' + that.vaildRowIndex][0].clearValidate(["STK_CODE"]);
                        that.$refs['company-conncom-' + that.vaildRowIndex][0].clearValidate(["STK_NAME"]);
                        that.$refs['company-conncom-' + that.vaildRowIndex][0].clearValidate(["STKEX"]);

                        that.stkCodeFlag = false;
                    } else {
                        let marketObj = _.find(that.stkexDicts, (v) => {
                            return v.DICT_ITEM == market;
                        });
                        that.messageBoxProps = {
                            hasMask: true,
                            messageText: "证券代码[" + value + "]在交易市场【" + (marketObj && marketObj.DICT_ITEM_NAME || "") + "】不存在,请重新输入！",
                            confirmButtonText: '确认',
                            typeMessage: 'error',
                            showMsgBox: true,
                            confirmedAction: function () {
                                that.$refs['company-conncom-' + that.vaildRowIndex][0].clearValidate(["STK_CODE"]);
                                that.stkCodeFlag = true;
                                // that.companyConncomList[that.vaildRowIndex].STKEX = "";
                                that.companyConncomList[that.vaildRowIndex].STK_NAME = "";
                                that.companyConncomList[that.vaildRowIndex].STK_CODE = "";
                            }
                        };
                        resolve(false);
                    }
                    resolve(true);
                }).catch(err => {
                    that.loading = false;
                    resolve(false);
                });
            });
        },


        //判断是否有未填写完整的记录
        validBankRow() {
            let that = this, arr = [];
            return new Promise((resolve, reject) => {
                that.companyConncomList.forEach(function (item, index) {
                    that.vaildRowIndex = index;
                    arr.push(that.$refs['company-conncom-' + index][0].validate());
                    that.vaildRowIndex = "";
                });

                return Promise.all(arr).then(function (res) { //都通过了 
                    resolve(true);
                }).catch(function (err) {

                    resolve(false)
                });
            });
        },
        addItemButton(index) {
            let that = this;
            if (that.companyConncomList.length >= that.oppBusiData.MAX_COMPANY_CONNMAN * 1) {
                that.messageBoxProps = {
                    hasMask: true,
                    messageText: "最多只能添加 " + that.oppBusiData.MAX_COMPANY_CONNMAN + " 个上市公司关联人信息",
                    confirmButtonText: '确认',
                    typeMessage: 'error',
                    showMsgBox: true
                };
                return;
            }

            //添加标识
            that.addFlag = true;
            //判断是否有未填写完整的记录
            that.validBankRow().then(function (flag) {
                that.addFlag = false;
                if (!flag) {
                    return false;
                }

                //添加限售股信息申报 
                that.companyConncomList.push(_.extend({}, that.companyConnmanFormData(), {
                    OP_TYPE: "0", //0为新增
                    showAddBtn: "0", //是否显示按钮：0不显示，1显示
                    creditTrdacctDicts: that.creditTrdacctDicts
                }));
            });
        },
        //删除限售股信息申报
        connectedAcctDelete(index) {
            let that = this;

            that.messageBoxProps = {
                hasMask: true,
                messageText: "是否删除此条信息？",
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                typeMessage: 'error',
                showMsgBox: true,
                canceledAction: function () {
                    console.log('取消删除');
                },
                confirmedAction: function () {
                    that.companyConncomList.splice(index, 1);
                    if (that.companyConncomList.length == 0) {
                        that.isExistObj.value = '0'
                    }
                }
            };
        },
        checkEqual: function (newObjce, oldObject) {
            var keys = _.keys(newObjce),
                flag = true;
            for (var key in keys) {
                if (!_.isObject(newObjce[keys[key]]) && "OPER_TYPE" != keys[key] && newObjce[keys[key]] != oldObject[keys[key]]) {
                    flag = false;
                }
            }
            return flag;
        },
        getCompanyConnmnData: function (newData, oldData) {
            var that = this;
            for (var key in newData) {
                var oldObj = _.find(oldData, function (obj) { return obj.STK_CODE == newData[key].STK_CODE && obj.TRDACCT == newData[key].TRDACCT && obj.RELAKIND_PUBCOM == newData[key].RELAKIND_PUBCOM; });
                if (oldObj) {
                    newData[key].OPER_TYPE = "1";
                    if (that.checkEqual(newData[key], oldObj)) {
                        newData[key].OPER_TYPE = "3"; //无修改
                    }
                } else {
                    newData[key].OPER_TYPE = "0";
                }
            }
            for (var key in oldData) {
                if (!_.find(newData, function (obj) { return obj.STK_CODE == oldData[key].STK_CODE && obj.TRDACCT == oldData[key].TRDACCT && obj.RELAKIND_PUBCOM == oldData[key].RELAKIND_PUBCOM; })) {
                    newData.push(_.extend({}, oldData[key], { OPER_TYPE: "2" }));
                }
            }
            return newData;
        },
        getData() {
            let that = this, companyConnmanInfo = [];
            _.each(that.companyConncomList, (v) => {
                if (v.STK_CODE) {
                    companyConnmanInfo.push(_.extend({}, v, { OPER_TYPE: "0" }));
                }
            });

            if (companyConnmanInfo.length == 1 && !companyConnmanInfo[0].STKEX) {
                companyConnmanInfo = [];
            }

            let sysCommParamsObjs = that.$storage.getJsonSession(that.$definecfg.SYS_COMM_PARAM_OBJS) || {};
            let isWin = (sysCommParamsObjs.TRD_SYS_VERSION == "W" ? true : false); //是否是windows

            companyConnmanInfo = that.getCompanyConnmnData(isWin ? companyConnmanInfo : [], that.oppBusiData.COMPANY_CONNMAN_INFO);

            return companyConnmanInfo;
        },
        //下一步时，校验
        validate(_this) {
            let that = _this.$refs.V0206_companyConnman_page;
            let validFlag = true, formDataArr = [], formLength = 0, uniqValidData = [];
            return Promise.all([
                that.validBankRow()
            ]).then(data => {
                if (_.indexOf(data, false) != -1) {
                    return false;
                }

                let companyConnmanFlag = true;
                if (that.companyConncomList.length == 1 && !that.companyConncomList[0].STKEX) {
                    companyConnmanFlag = false;
                }
                companyConnmanFlag && _.each(that.companyConncomList, (obj) => {
                    obj.STK_CODE && formLength++;
                    if (obj.STKEX && obj.STK_CODE && obj.STK_NAME &&
                        (obj.TRDACCT || obj.CREDIT_TRDACCT) && obj.TRDACCT_NAME && obj.RELAKIND_PUBCOM) {
                        formDataArr.push(obj.STKEX + "-" +
                            obj.STK_CODE + "-" +
                            obj.STK_NAME + "-" +
                            (obj.TRDACCT || obj.CREDIT_TRDACCT) + "-" +
                            obj.TRDACCT_NAME + "-" +
                            obj.RELAKIND_PUBCOM);
                    }
                    if (obj.STK_CODE && (obj.TRDACCT || obj.CREDIT_TRDACCT) && obj.RELAKIND_PUBCOM) {
                        uniqValidData.push(obj.STK_CODE + "-" + (obj.CREDIT_TRDACCT || obj.TRDACCT) + "-" + obj.RELAKIND_PUBCOM);
                    }
                });


                if (validFlag && (formDataArr.length && _.uniq(formDataArr).length < formLength) ||
                    (uniqValidData.length && _.uniq(uniqValidData).length < formLength)) {
                    that.messageBoxProps = {
                        hasMask: true,
                        messageText: "上市公司关联人信息有重复记录，请删掉重复记录！",
                        confirmButtonText: '确认',
                        typeMessage: 'error',
                        showMsgBox: true,
                        canceledAction: function () {
                            console.log('取消删除');
                        },
                        confirmedAction: function () {

                        }
                    };
                    validFlag = false;
                }

                if (!validFlag) {
                    return false;
                }
                return true
            }).catch(err => {
                return false;
            });
        },
        //下一步时，保存数据.
        async beforeSave(_this, params, baseData) {
            let that = _this.$refs.V0206_companyConnman_page;

            let companyConnman = that.getData();

            let quotaInfo = {};
            _.extend(quotaInfo, { COMPANY_CONNMAN_INFO: companyConnman });

            if (params.QUOTA_INFO) {
                Object.assign(params.QUOTA_INFO, quotaInfo);
            } else {
                Object.assign(params, { QUOTA_INFO: quotaInfo });
            }
        }

    }
}
</script>

<style lang="less">
.V0206-company-connman {
    .V0206-company-connman-title {
        width: 1000px;
        height: 100px;
        .V0206-connect-acct-addItem {
            float: right;
            margin-top:30px;
            margin-right: 10px;
            .V0206-connect-acct-add-module {
                font-size: 20px;
                padding: 8px 30px;
                font-weight: bold;
                color: #c52727;
                border-color: #c52727;
                border-width: 2px;
            }
        }
        .V0206-company-connman-title-name {
            float: left;
            color: #3e191d;
            margin: 36px 0 22px 3px;
            height: 20px;
            line-height: 20px;
            padding-left: 30px;
            font-size: 21px;
            font-weight: normal;
            position: relative;
            &::before {
                content: "";
                width: 6px;
                height: 20px;
                background: #c52727;
                position: absolute;
                top: 50%;
                margin-top: -10px;
                left: 10px;
                border-radius: 10px;
            }
        }
    }
    #isExist {
        .el-form-item {
            .el-form-item__label {
                width: 220px;
            }
        }
    }

    .V0206-company-connman-for-class {
        .V0206-company-connman-addItem {
            padding-right: 10px;
            padding-top: 10px;
            position: relative;
            top: -55px;
        }

        .V0206-company-connman-deleteItem {
            padding-right: 10px;
            padding-top: 10px;
            position: relative;
        }

        .V0206-company-connman-add-module {
            font-size: 20px;
            padding: 8px 30px;
            font-weight: bold;
            color: #c52727;
            border-color: #c52727;
            border-width: 2px;
        }

        .V0206-company-connman-delete-module {
            font-size: 20px;
            padding: 8px 30px;
            font-weight: bold;
            color: #c52727;
            border-color: #c52727;
            border-width: 2px;
        }

        .V0206-company-connman-form-class {
            .intOrg-class {
                width: 100%;
                .el-form-item__content .el-select {
                    width: 668px;
                }
            }
            .el-form-item {
                padding-bottom: 12px;
            }

            .self-normalInput-required {
                .el-form-item__label:before {
                    content: "*";
                    color: #f56c6c;
                    margin-right: 4px;
                }
            }
        }
    }
}
</style>
