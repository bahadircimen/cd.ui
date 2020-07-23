import Vue from 'vue';
import MainContainer from './containers/MainContainer.vue';
import Vue2TouchEvents from "vue2-touch-events";
import VueCookies from 'vue-cookies';
// import config from './utils/appConfig.js';
// import {init as initApm} from '@elastic/apm-rum';


Vue.prototype.$isObjectEmpty = function (obj) {
    return !(Object.keys(obj).length === 0 && obj.constructor === Object);
};

Vue.directive('scroll', {
    inserted: function (el, binding) {
        let f = function (evt) {
            if (binding.value(evt, el)) {
                window.removeEventListener('scroll', f)
            }
        };
        window.addEventListener('scroll', f)
    }
});

Vue.use(Vue2TouchEvents,{swipeTolerance: 36});
Vue.use(VueCookies);

import { VueReCaptcha } from 'vue-recaptcha-v3'
Vue.use(VueReCaptcha, {
    siteKey: '6Ld3W6UZAAAAANP62yh_hkhAcLUNn79joHtFl7Db',
    loaderOptions:{
        autoHideBadge: true,
    }
})


// if (config.NODE_ENV !== 'development') {
//     const apm = initApm({
//         serviceName: "SolutionCenter_UI",
//         serverUrl: "https://cst-apm.hepsiburada.com/",
//         environment: config.env === 'prod' ? 'Production': 'Development',
//         distributedTracingOrigins: [config.BASE_URL]
//     });
// }


new Vue({render: h => h(MainContainer)}).$mount('#root');
