// ==UserScript==
// @name         open link at new page
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.1.0
// @description  try to take over the world!
// @author       You
// @match        https://m.baidu.com/*
// @require      https://unpkg.com/gridjs/dist/gridjs.umd.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js
// @require      https://cdn.jsdelivr.net/npm/tldjs@2.3.1/tld.min.js
// @grant        GM_addValueChangeListener
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_cookie
// @grant        GM_xmlhttpRequest
// @connect      m.baidu.com
// @connect      fengchao.baidu.com
// ==/UserScript==

(function() {
    'use strict';

    console.log(getTld(window.location.href))

    //移除百度热搜
    // document.querySelector(".c-container").remove()
    let showLink = ()=>{
        document.querySelectorAll(".c-result").forEach(item=>{
            try{

            
            let rel = JSON.parse( item.getAttribute("data-log")).mu

            let h = item.querySelector(".tts-b-hl")
            let old = h.textContent
            h.insertAdjacentHTML("beforeend",`<span style="">[${rel}]</span>`)
            // h.textContent = old+`<span style="background: red">[${rel}]</span>`
            }catch(ex){
                console.log(ex)
            }
            // item.querySelector(".tts-b-hl").textContents = "设置"
        })
    }

    let openLinkNewPage = ()=>{
            document.querySelectorAll("a").forEach(item => {
                item.setAttribute("target","_blank");
            })
    }
    // Your code here...
    //所有连接在新标签页中打开
    //添加依赖项
    let addDeps = async ()=>{
        let ele
        ele = document.createElement("div")
        ele.id = "headerTable"

        document.querySelector("body").insertAdjacentElement("afterBegin", ele)

        ele = document.createElement("div")
        ele.id = "wordTable"

        document.querySelector("body").insertAdjacentElement("afterBegin", ele)

    }
    
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            // script.async = true;
            script.onload = () => resolve(src);
            script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
            document.head.appendChild(script);
        });
    }
    function loadCss(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('link');
            script.rel = 'stylesheet'
            script.href = src;
            // script.async = true;
            script.onload = () => resolve(src);
            script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
            document.head.appendChild(script);
        });
    }
    function getTld(url){
        return tldjs.parse(url).domain
    }
    let addHeaderTable = async ()=>{
        await addDeps()
        await loadCss("https://unpkg.com/gridjs/dist/theme/mermaid.min.css")
        await loadCss("https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css")
        console.log('css加载完成')
        // await loadScript("https://unpkg.com/gridjs/dist/gridjs.umd.js")
        // console.log('js加载完成')
        // await new Promise(resolve => {
        //     setTimeout(resolve,9*1000)
        // })
        // await Promise.all([
        //     loadScript("https://unpkg.com/gridjs/dist/gridjs.umd.js"),
        //     // loadCss("https://unpkg.com/gridjs/dist/theme/mermaid.min.css")
        // ])
        
        let data = [...document.querySelectorAll(".c-result")].map((item,index) => {
            try{
            let word = document.querySelector("#kw,#index-kw").value
            let id = index+1
            let title = item.querySelector(".tts-b-hl").textContent
            let url = JSON.parse( item.getAttribute("data-log")).mu
            let isIndex = new URL(url).pathname == "/" ? "yes" : "no"
            let showName = item.querySelector(".cosc-source,.cos-text-body")?.textContent
            let domain = getTld(url)
            console.log([word,id,title,domain,url,showName,isIndex])
            return [word,id,title,domain,url,showName,isIndex]
            }catch(ex){
                return null
            }
        }).filter(item=>item)
        new window.gridjs.Grid({
            columns: ['关键词','排名', '标题','域名', '网址', '展示名称','是否首页'],
            data: data,
            pagination: true,
        }).render(document.getElementById('headerTable'));

                await new Promise(resolve => {
            setInterval(_=>{
                if(document.querySelectorAll("#headerTable th").length > 0)  resolve()
            },1*1000)
        })

        //在表头加个复制按钮
        document.querySelectorAll("#headerTable th").forEach((item,index) => {
            let th =  item.textContent
            item.textContent = item.textContent + "📋"
            // let btn = document.createElement("button")
            // btn.style.border = "1 solid"
            // btn.textContent= "📋"
            item.onclick = ()=>{
                let rows = [...document.querySelectorAll("#headerTable tr:not(:first-child)")].map(item => {
                    return item.querySelector(`td:nth-child(${index+1})`)?.textContent
                }).join("\n")
                
                if(navigator.clipboard.writeText(rows)){
                    toastr.success(th+"复制成功");
                }
                // if (Notification.permission === 'default') {
                //     Notification.requestPermission()
                // }
                // new Notification(th+"复制成功")
            }
            
            // item.appendChild(btn)
        })

        const word = document.querySelector("#kw,#index-kw").value

        let keywords = [...document.querySelectorAll(".sc-button")].map(item => {
            return [word,item.textContent,"相关",0]
        })

        //下拉
        const resp = await fetch("https://m.baidu.com/sugrec?prod=wise&wd="+encodeURIComponent(document.querySelector("#kw,#index-kw").value))
        const dropdownWords = (await resp.json()).g.map(item=> [word,item.q,"下拉",0])
        
        let wordsData = [...keywords,...dropdownWords]

        const cookies = await new Promise(resolve => {
            GM_cookie("list",{domain:"fengchao.baidu.com"}, resolve)
        })
        console.log("cookies",cookies)
        const averageMonthPvs = await new Promise(resolve => {
            const words = wordsData.map(item=>item[1])
            const lines  = words
            const params = {"logid":-1,"entry":"kr_station_bidestimate_tab","bidWordSource":"wordList","regions":[1000,2000,3000,4000,5000,200000,8000,9000,10000,11000,12000,13000,14000,15000,16000,17000,18000,19000,20000,21000,22000,23000,24000,25000,26000,27000,28000,29000,30000,31000,32000,33000,34000,35000,36000,300000],"device":0,"limit":[0,10000],"orderBy":"","order":"desc","campaignId":null,"adgroupId":null,"keywordList":[]}
            const lineobjs = lines.map(word => {
                return {"keywordName":word,"price":null,"matchType":null,"phraseType":null}
            })

            params.keywordList = lineobjs
            const token =  cookies.find(cookie => cookie.name == "CPTK_3")?.value
            const userid = cookies.find(cookie => cookie.name == "CPID_3")?.value
            const body = new FormData()
            
            body.append("params",encodeURI(JSON.stringify(params)))
            body.append("token",token)
            body.append("userid",userid)
            body.append("reqid","4b534c48-d512-4b4c-2a7b-173632890121")
            GM_xmlhttpRequest({
                method:"post",
                url:"https://fengchao.baidu.com/hairuo/request.ajax?path=puppet%2FGET%2FPvSearchFunction%2FgetPvSearch&reqid=4b534c48-d512-4b4c-2a7b-173632890121",
                headers:{
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                data: [...body.entries()].map(([k,v])=>{
                        return `${k}=${v}`
                }).join("&"),
                cookie: cookies.map(({name,value})=>{return `${name}=${value}`}).join("&"),
                onload: (ev)=>{
                    resolve(JSON.parse(ev.responseText).data.data.reduce((pre,item) => {
                        return {...pre, [item.keywordName]:item.averageMonthPv}
                    }),{})
                }
            })
        })
        // console.log(averageMonthPvs,"averageMonthPvs")

        wordsData = wordsData.map(item => {
            const word = item[1]
            console.log(word)
            item[3] = averageMonthPvs[word]
            return item
        })
        console.log("wordsData",wordsData)
        new window.gridjs.Grid({
            columns: ['开始词','拓展词', '来源类型',"搜索词流量"],
            data: wordsData,
            sort: true,
            pagination: true,
        }).render(document.getElementById('wordTable'));


        // navigator.clipboard.writeText(keywords.join("\n"))
        //复制到剪贴板
    }


    
    addHeaderTable()
})();