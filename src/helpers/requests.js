import http from "../utils/httpHelper";
import config from "../utils/appConfig"
import {isMobileApp} from "./helper";

const errorMessageBuilder = (response) => {
    return (response?.errorData && response?.errorData?.code) || '0';
};


// let baseURL = (config.API_URL ||  "http://172.26.82.24" ) + ":" + (config.PORT || "8376");
let baseURL = config.API_URL + (config.PORT ? (':' + config.PORT) :'');
let user = {
    debug: true,
    state: {
        config: config,
        features: {},
        isLoading: false,
        isLoadingText: '',
        hasError: false,
        candidateMerchantData: {}
    },

    async userPage(id){
        let res = await http.makeGetRequest(`/roles/${id}/pages`,baseURL,"",errorMessageBuilder,false);
        return res
    },

    async role(){
        let res = await http.makeGetRequest('/roles',baseURL,"",errorMessageBuilder,false);
        return res
    },

    async userDetail(userName){
      let res = await http.makeGetRequest(`/applicationuser/${userName}`,baseURL,"",errorMessageBuilder,false);
      return res
    },

    async health() {
        let res = await http.makeGetRequest('/health', baseURL,"", errorMessageBuilder, false);
        return res.status === 200;
    },

    async postSendMessage(files = [], text, faq = "1", productData, recaptchaToken) {
        let formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('Attachments', files[i], files[i].name);
        }
        formData.append('Description', text);
        formData.append('FaqId', faq);
        formData.append('OrderNumber', productData.orderNumber || "");
        formData.append('LineNumber', productData.index || "");
        formData.append('recaptchaToken', recaptchaToken || "");

        let res = await http.makePostRequest('/sendMessage', baseURL, '', formData, '', true);

        return (res.status === 200 || res.status === 201) && res.data['isSuccess'] === true;
    },

    // send CallMeBack request
    async callMeBack(option, reCaptchaToken) {
        let postBody = {
            "orderId": "",
            "lineItemNumber": "",
            "phoneNumber": "",
            faqId: "",
        };
        postBody = {...postBody, ...option};
        let res = await http.makePostRequest('/callMeBack', baseURL, '', postBody);
        if (res.status !== 201) {
            return {};
        }
        return res;
    },

    // get phone numbers
    async getPhones(orderNumber) {
        let path ="";
        if(typeof orderNumber === 'string' && orderNumber.length>0)
            path = `/callmeback/phones?orderNumber=${orderNumber}`;
        else
            path = `/callmeback/phones`;

        let res = await http.makeGetRequest(path, baseURL);
        if (res.status !== 200 || res.data === false) {
            return [];
        } else if (res.status === 401) {
            return [];
        } else {
            return res.data;
        }
    },

    async getOrders(offset, limit) {
        let path = `/orders?offset=${offset}&limit=${limit}`;
        let res = await http.makeGetRequest(path, baseURL);
        let paymentTypes = {
            CreditCard: "Kredi Kartı",
            WireTransfer: "Havale",
            PayAtDoor: "Kapıda Ödeme",
            GiftCertification: "Hediye Çeki",
            Corporate: "Kurumsal Ödeme",
            Assigned: "Temlik",
            Avon: "Avon",
            ShoppingLoan: "Alışveriş Kredisi",
            Evkur: "Evkur",
            Payflex: "Alışveriş Kredisi",
            DebitCard: "Banka Kartı"
        };
        if (res.status !== 200 || res.data.status === 404) {
            return [];
        }
        let returnedData = res.data.orders.map((ele) => {
            let payment;
            if (ele.paymentTypes.length === 1) {
                payment = paymentTypes[ele.paymentTypes[0]]
            } else {
                payment = paymentTypes[ele.paymentTypes[0]] + " + " + paymentTypes[ele.paymentTypes[1]]
            }
            return {...ele, ...{paymentTypes: payment}};
        });
        return {...returnedData, ...{orders: returnedData}, ...{total: res.data.total}, ...{status:res.status}};
    },
    async getProducts(orderNumber) {
        let path = `/orders/${orderNumber}`;
        let res = await http.makeGetRequest(path, baseURL);
        if (res.status !== 200) {
            return {};
        }
        return res.data;
    },

    async getTimeClaim(orderNumber, lineIndex) {
        let path = `/orders/${orderNumber}/timeclaim?lineIndex=${lineIndex}`;
        let res = await http.makeGetRequest(path, baseURL);
        if (res.status !== 200) {
            return {};
        }
        return res.data;
    },

    async getFaqParentCategoriesAskPage(timeClaims) {
        let queryString = "";
        if (!!timeClaims.claims) {
            if (timeClaims.claims.length > 0 && Array.isArray(timeClaims.claims) ){
                timeClaims.claims.forEach(element => {
                    queryString += `claimIds=${element.claimId}&`;
                });
            }
            else
                queryString = "claimIds=" + timeClaims.claims.claimId + '&';
        }

        if(queryString)
            queryString = '&' + queryString;

        let path = `/faqcategories/parentcategories/askpage?timeId=${timeClaims.timeId || '1'}` + queryString;
        let res = await http.makeGetRequest(path, baseURL);
        if (res.status !== 200 || res.data.status === 404 || res.hasError) {
            return [];
        }
        let returnedData = [];
        res.data.map(
            (element) => {
                returnedData.push({parentCategoryId: element.id, text: element.askPageName});
            }
        );
        return returnedData;
    },
    async getFaqParentCategoriesHelpPage() {
        let path = `/faqcategories/parentcategories/helppage`;
        let res = await http.makeGetRequest(path, baseURL,"", errorMessageBuilder,false);
        if (res.status !== 200 || res.data.status === 404 || res.hasError) {
            return [];
        }
        return res.data;
    },
    async getTopFaqs(limit = 5) {
        let path = `/faqs/top?limit=` + limit;
        let res = await http.makeGetRequest(path, baseURL, "", errorMessageBuilder, false);
        if (res.status !== 200 || res.data.status === 404 || res.hasError) {
            return [];
        }
        return res.data;
    },

    async getFaqsSearch(searchString = '') {
        function serialize(obj, prefix) {
            let str = [],
                p;
            for (p in obj) {
                if (obj.hasOwnProperty(p)) {
                    let k = prefix ? prefix + "[" + p + "]" : p,
                        v = obj[p];
                    str.push((v !== null && typeof v === "object") ?
                        serialize(v, k) :
                        encodeURIComponent(k) + "=" + encodeURIComponent(v));
                }
            }
            return str.join("&");
        }

        let searchText = serialize({
            term: searchString
        });

        let path = `/faqs/search?` + searchText;
        let res = await http.makeGetRequest(path, baseURL);
        if (res.status !== 200 || res.data.status === 404 || res.hasError) {
            return [];
        }
        return res.data;
    },

    async getAllFaqs() {
        let path = `/faqs/faq-page-directory`;
        let res = await http.makeGetRequest(path, baseURL,"", errorMessageBuilder,false);
        if (res.status !== 200 || res.data.status === 404 || res.hasError) {
            return [];
        }
        return res.data;
    },

    async getAllFaqsDesktopHelpPage() {
        let path = `/faqs/directory`;
        let res = await http.makeGetRequest(path, baseURL,"", errorMessageBuilder,false);
        if (res.status !== 200 || res.data.status === 404 || res.hasError) {
            return [];
        }
        return res.data;
    },

    async getFaq(id) {
        let path = `/faqs/detail/${id}`;
        let res = await http.makeGetRequest(path, baseURL,"", errorMessageBuilder, false);
        if (res.status !== 200 || res.data.status === 404 || res.hasError) {
            return [];
        }
        return {
            id: res.data.id,
            faqParentCategoryId: res.data.faqParentCategoryId,
            text: res.data.name,
            hasRuleEngineWorkFlow: res.data.hasRuleEngineWorkFlow
        };
    },


    async getFaqWithTimes(timeClaims, extraOptions) {
        let queryString = "";
        if (!!timeClaims.claims) {
            if (timeClaims.claims.length > 0 && Array.isArray(timeClaims.claims) ){
                timeClaims.claims.forEach(element => {
                    queryString += `claimIds=${element.claimId}&`;
                });
            }
            else
                queryString = "claimIds=" + timeClaims.claims.claimId + '&';
        }

        for(let [key, value] of Object.entries(extraOptions)){
            if(Array.isArray(value) && value.length){
                value.forEach(el=>{
                    queryString += `${key}=${el}&`
                })
            }else if(value){
                queryString += `${key}=${value}&`
            }
        }
        let searchQueryText = "?";
        searchQueryText += queryString
        searchQueryText =  searchQueryText === "?" ? "" : searchQueryText;

        let timeClaim = timeClaims.timeId || "";

        let path = `/faqs/times/${timeClaim}` + searchQueryText;
        let res = await http.makeGetRequest(path, baseURL);
        if (res.status !== 200 || res.data.status === 404) {
            return [];
        }
        return res.data;
    },

    async getRelatedFaqs(faqId) {
        let path = `/faq/${faqId}/relatedFaqs`;
        let res = await http.makeGetRequest(path, baseURL);

        if (res.status !== 200 || res.data.status === 404) {
            return [];
        }
        return res.data.map((el) => {
            return {text: el.name, id: el.id}
        });
        // this.faqData = res.data.map((row) => {return JSON.parse(row)})
        // return res.data;
    },

    async getFaqTemplates(faqId, jwt = "", AppKey="") {
        let isApp = "";
        if(isMobileApp(jwt, AppKey)){
            isApp = "?isMobileApp=true"
        }
        let path = `/faq/${faqId}/templates` + isApp;
        let res = await http.makeGetRequest(path, baseURL);
        if (res.status !== 200) {
            return {};
        }
        // this.faqData = res.data.map((row) => {return JSON.parse(row)})
        return res.data;
    },
    async getVoltran(dest) {
        let path = `/voltran?type=` + dest;
        let res = await http.makeGetRequest(path, baseURL, "", errorMessageBuilder, false);
        if (res.status !== 200) {
            return {};
        }
        return res.data;
    },

    async getRuleEngine(option,jwt = "", AppKey="") {
        let postBody = {
            "orderRelationTypeByCustomer": 1,
            "selectedExtraOptionId": 0,
            "isMobileApp": isMobileApp( jwt || "", AppKey)
        };
        postBody = {...postBody, ...option};
        let res = await http.makePostRequest('/FaqRuleEngine/RunFaqRule', baseURL, '', postBody);
        if (res.status !== 200) {
            return {};
        }
        return res.data;
    },

    // async sendScore(conversationId,typeId = 1, score = 5, comment = "", keyType={}) {
    async sendScore(scoreData) {
        let res = await http.makePostRequest('/Score', baseURL, '', scoreData);
        return res.status === 201;
    },

    async getChannels() {
        let path = `/getChannels`;

        let res = await http.makeGetRequest(path, baseURL, "", errorMessageBuilder, false);
        if (res.status !== 200) {
            return {};
        }
        return JSON.parse(Buffer.from(res?.data[0]['Value'] || "", 'base64').toString());
    },
};

export default user