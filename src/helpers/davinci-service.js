import axios from 'axios';

export default{
    sendEvent(davinciServiceUrl,eventData) {
        let postUrl=`${davinciServiceUrl}/api/track`;
        axios.defaults.headers.post['Access-Control-Allow-Origin'] = davinciServiceUrl;
        return axios.post(postUrl,eventData);
    }
}
