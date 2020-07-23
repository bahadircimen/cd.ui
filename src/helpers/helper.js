const jwtDecode = require('jwt-decode');

function capitalizeFirstLetter(string) {
    if (typeof string !== 'string')
        return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function decodeJWT(jwt) {
    try {
        return jwtDecode(jwt);
    } catch (e) {
        return {}
    }
}

export function isIOS(jwt = "", AppKey = "") {
    try {
        let decoded = {}
        if (AppKey || "") {
            decoded['AppKey'] = AppKey
        } else {
            decoded = decodeJWT(jwt || "");
        }

        switch (decoded['AppKey']) {
            case "BF448871-DB72-4CD7-A0E0-1F82BF410370":
                return true;
            default :
                return false
        }
    } catch (e) {
        return false
    }
}

export function isMobileApp(jwt = "", AppKey = "") {
    try {
        let decoded = {}
        if (AppKey || "") {
            decoded['AppKey'] = AppKey
        } else {
            decoded = decodeJWT(jwt || "");
        }

        switch (decoded['AppKey']) {
            case "BF448871-DB72-4CD7-A0E0-1F82BF410370":
                return true;
            case "8093F525-1BAC-49C0-8FB7-C9F7B2DA04CF":
                return true;
            case "A0A16B0C-9FCE-48BB-8881-4AC263A938F3":
                return true;
            default :
                return false
        }
    } catch (e) {
        return false
    }
}

export function isLogin(jwt) {
    try {
        let isLogin = false;
        let decoded = decodeJWT(jwt) || {};
        if (decoded['IsAuthenticated'] === 'True')
            isLogin = true;
        return isLogin;
    } catch (e) {
        return false
    }
}

export function entranceMessage(jwt) {
    let nameSurname = '';
    if (!isLogin(jwt)) {
        nameSurname = '';
    } else {
        let decoded = decodeJWT(jwt);
        if (decoded.hasOwnProperty('Title')) {
            let nameSurnameLower = decoded['Title'].replace(/\s+/g, " ").split(" ")
            let name = "";
            nameSurnameLower.forEach((el) => {
                name += ' ' + capitalizeFirstLetter(el)
            })
            nameSurname = 'Merhaba ' + name + ', size nasıl yardımcı olabilirim?';
        } else if (decoded.hasOwnProperty('FirstName')) {
            nameSurname = 'Merhaba ' + capitalizeFirstLetter(decoded['FirstName']) + ' '
                + capitalizeFirstLetter(decoded['LastName'] + ', size nasıl yardımcı olabilirim?');
        }
    }
    return nameSurname
}

export function nameSurname(jwt) {
    let nameSurname = "Merhaba,";
    if (!isLogin(jwt)) {
        nameSurname = 'Merhaba,';
    } else {
        let decoded = decodeJWT(jwt);
        if (decoded.hasOwnProperty('Title')) {
            let nameSurnameLower = decoded['Title'].replace(/\s+/g, " ").split(" ")
            let name = "";
            nameSurnameLower.forEach((el) => {
                name += ' ' + capitalizeFirstLetter(el)
            })
            nameSurname = 'Merhaba ' + name + ',';
        } else if (decoded.hasOwnProperty('FirstName')) {
            nameSurname = 'Merhaba ' + capitalizeFirstLetter(decoded['FirstName']) + ' ' + capitalizeFirstLetter(decoded['LastName'] + ',');
        }
    }
    return nameSurname;
}