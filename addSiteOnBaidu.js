// ==UserScript==
// @name         add site onBaidu
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.1.0
// @description  try to take over the world!
// @author       You
// @match        https://ziyuan.baidu.com/*
// ==/UserScript==

(function () {
    'use strict';
    if (window.location.pathname.includes("siteadd")) {
        document.querySelector(".add-site-input").addEventListener("change", ev => {
            document.querySelector(".add-site-input").value = `www.${ev.target.value}`
            document.querySelector(".add-select>input").value = "https://"
            document.querySelector("#site-add").click()
        })
    }
    if (window.location.pathname.includes("sitespherepage")) {
        setTimeout(() => {
            document.querySelector("#check0").checked = true
            document.querySelector("#sub-attr").click()
        }, 1000)

    }
    if (window.location.pathname.includes("siteverify")) {
        const uploadFile = async () => {
            const response = await fetch(document.querySelector("#file>p:nth-child(2)>a").href)
            const filename = response.headers.get("content-disposition").split(";")[1].split("=")[1].replaceAll("\"", "")
            const text = await response.text()
            //这里是针对侠客镜像站群
            const verifyUrl = document.querySelector("#file>p:nth-child(4)>a").href
            await fetch(`https://${new URL(verifyUrl).host}/create?content=${text}&type=html&name=${filename.split(".")[0]}`, {
                mode: "no-cors"
            })

            setInterval(()=>{
                document.querySelector("#dialog-foot>button")?.click()
            },500)

            //上传文件
            document.querySelector("#verifySubmit").click()
        }
        uploadFile()
    }
    if (window.location.pathname.includes("/site/index")) {
        window.location.href = new URL("siteadd", window.location).href
    }
    if (window.location.pathname.includes("/property/index")) {
        window.location.href = new URL("/site/siteadd", window.location).href
    }
    // Your code here...
})();