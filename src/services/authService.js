import http from "../utils/httpHelper";

export default {
    async verifyToken(token) {
        let body={"token": token};
        let res= await http.makePostRequest('/verifyToken','http://mpadmin.qa.hepsiburada.com','',body);
        if(res.status === 200){
            return res.data
        }
        else {
            return console.log("NOT OK")
        }
    }
}

