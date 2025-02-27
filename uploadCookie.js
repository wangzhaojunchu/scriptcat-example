// ==UserScript==
// @name         uploadCookie
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.1.0
// @description  try to take over the world!
// @author       You
// @match        https://fengchao.baidu.com/fc/*
// @grant        GM_xmlhttpRequest
// @grant        GM_cookie
// @grant        GM_notification 
// @connect      *.baidu.com
// @connect      baidu.com
// @connect      fengchao.baidu.com
// ==/UserScript==

(function () {
    'use strict';
    GM_cookie("list", { domain: "fengchao.baidu.com" }, (cookies) => {
        console.log("cookies",cookies)
        const cookie = cookies.map(cookie => `${cookie.name}=${cookie.value}`).join(";")
        const requestUri = "http://localhost:3000/api/baidu-pv"
        GM_xmlhttpRequest({
            method: "PUT",
            url: requestUri,
            headers: {
                "Content-Type": "application/json",
            },
            data: JSON.stringify({ cookie }),
            onload: function (response) {
                GM_notification(response.responseText,"请求成功")
                console.log("请求成功:", response.responseText);
            },
            onerror: function (error) {
                GM_notification(error,"请求失败")
                console.log("请求失败:", error);
            }
        });
    })




    // Your code here...
})();