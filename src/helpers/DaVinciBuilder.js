import daVinciService from './davinci-service';
import user from "./requests.js"

export function getSiteType(app_key = "") {
    switch (app_key) {
        case "BF448871-DB72-4CD7-A0E0-1F82BF410370":
            return "Ios";
        case "8093F525-1BAC-49C0-8FB7-C9F7B2DA04CF":
            return "Android";
        case "AF7F2A37-CC4B-4F1C-87FD-FF3642F67ECB":
            return "Web";
        case "D5BABFEB-AEE3-420B-9857-0697C8716A7E":
            return "MobilSite";
        case "8B497575-C938-4807-8060-130380F67F7C":
            return "MobileIpad";
        case "DACEEFC8-68BC-40FB-B693-BC7198F42474":
            return "BackOffice";
        case "A0A16B0C-9FCE-48BB-8881-4AC263A938F3":
            return "LegacyMobileApp";
        case "71C6ED59-AA28-4852-8C7B-3FE28480E7EC":
            return "KanalD";
        default:
            return "";
    }
}

export function pageLoadEvent({pageName, pageLanguage = 'tr-TR', pageSiteRegion = 'tr', ready = 0, domLoaded = 0, messageId = "",
                                  app_key = "", userId = "", anonymousId = "", SessionId = "", eventName = "PageLoad"}) {
    let load = {
        "context": {
            "source": "customer_services",
            "channel": getSiteType(app_key),
            page: {
                path: window.location.pathname + window.location.hash,
                referrer: window.document.referrer,
                search: window.location.search,
                title: document.title,
                url: window.location.href,
                language: pageLanguage,
                siteRegion: pageSiteRegion
            },
            "userAgent": navigator.userAgent,
        },
        "integrations": {},
        "properties": {
            "experiments": [],
            "page": pageName,
            "domLoaded": domLoaded,
            "ready": ready,
            "site_type": getSiteType(app_key)
        },
        "event": eventName,
        "anonymousId": anonymousId,
        "timestamp": new Date().toISOString(),
        "type": "track",
        "writeKey": "",
        "userId": userId,
        "sentAt": new Date().toISOString(),
        "messageId": messageId,
        "sessionId": SessionId
    };
    daVinciService.sendEvent(user.state.config.DAVINCI_SERVICE_URL, load);
}

export function clickEvent({app_key = "", pageLanguage = 'tr-TR', pageSiteRegion = 'tr', eventName, userId = "", anonymousId, messageId, SessionId, properties = {},}) {

    let load = {
        "context": {
            "source": "customer_services",
            "channel": getSiteType(app_key),
            page: {
                path: window.location.pathname + window.location.hash,
                referrer: window.document.referrer,
                search: window.location.search,
                title: document.title,
                url: window.location.href,
                language: pageLanguage,
                siteRegion: pageSiteRegion
            },
            "userAgent": navigator.userAgent,
        },
        "integrations": {},
        "properties": properties,
        "event": eventName,
        "anonymousId": anonymousId,
        "timestamp": new Date().toISOString(),
        "type": "track",
        "writeKey": "",
        "userId": userId,
        "sentAt": new Date().toISOString(),
        "messageId": messageId,
        "sessionId": SessionId
    };
    daVinciService.sendEvent(user.state.config.DAVINCI_SERVICE_URL, load);
}

export function messageEvent({app_key = "",page="SolutionCenter_WelcomeMessage", pageLanguage = 'tr-TR', pageSiteRegion = 'tr', eventName, userId = "", anonymousId, messageId, SessionId, properties = {},}) {

    let load = {
        "context": {
            "source": "customer_services",
            "channel": getSiteType(app_key),
            page: {
                path: window.location.pathname + window.location.hash,
                referrer: window.document.referrer,
                search: window.location.search,
                title: document.title,
                url: window.location.href,
                language: pageLanguage,
                siteRegion: pageSiteRegion
            },
            "userAgent": navigator.userAgent,
        },
        "integrations": {},
        "properties": {
            ...{
                "experiments": [],
                "page": page,
                "site_type": getSiteType(app_key)
            }, ...properties
        },
        "event": eventName,
        "anonymousId": anonymousId,
        "timestamp": new Date().toISOString(),
        "type": "track",
        "writeKey": "",
        "userId": userId,
        "sentAt": new Date().toISOString(),
        "messageId": messageId,
        "sessionId": SessionId
    };

    daVinciService.sendEvent(user.state.config.DAVINCI_SERVICE_URL, load);
}

