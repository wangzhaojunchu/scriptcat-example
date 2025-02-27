// ==UserScript==
// @name         query more than 1000 on fengchao
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.1.0
// @description  try to take over the world!
// @author       You
// @match        https://fengchao.baidu.com/*
// @require      https://cdn.jsdelivr.net/npm/js-cookie@3.0.1/dist/js.cookie.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.0/papaparse.min.js
// @require      https://cdn.jsdelivr.net/npm/nprogress@0.2.0/nprogress.min.js
// @resource     customCSS https://cdn.jsdelivr.net/npm/nprogress@0.2.0/nprogress.min.css
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @connect      *
// ==/UserScript==

(async function() {
    'use strict';

    // 开启进度条
    const progressbar = true
    const css = GM_getResourceText("customCSS");
    GM_addStyle(css);
 
    // // 注入CSS

    //每隔一秒检测节点

    await new Promise(resolve => {
        const si = setInterval(_=>{
            if(document.querySelector(".one-ui-pro-textline-main")){
                resolve()
                clearInterval(si)
            }
        }, 1*1000)
    })        

    //将cookie值存入
    

       
    const btn = document.createElement("button")
    btn.classList = ["one-button"," one-main "," one-button-primary","  one-button-medium"]
    btn.addEventListener("click",async (e)=>{
        
        let records = []

        const requests = []
        const fileRange = await getfile();
        progressbar && NProgress.start();
        for(const [index,lines] of fileRange.entries()){
            const params = {"logid":-1,"entry":"kr_station_bidestimate_tab","bidWordSource":"wordList","regions":[1000,2000,3000,4000,5000,200000,8000,9000,10000,11000,12000,13000,14000,15000,16000,17000,18000,19000,20000,21000,22000,23000,24000,25000,26000,27000,28000,29000,30000,31000,32000,33000,34000,35000,36000,300000],"device":0,"limit":[0,10000],"orderBy":"","order":"desc","campaignId":null,"adgroupId":null,"keywordList":[]}
            const lineobjs = lines.map(word => {
                return {"keywordName":word,"price":null,"matchType":null,"phraseType":null}
            })

            params.keywordList = lineobjs
            const token =  Cookies.get("CPTK_3")
            const userid = Cookies.get("CPID_3")
            const body = new FormData()
            
            body.append("params",encodeURI(JSON.stringify(params)))
            body.append("token",token)
            body.append("userid",userid)
            body.append("reqid","4b534c48-d512-4b4c-2a7b-173632890121")

            requests.push((async()=>{
                const response = await fetch("https://fengchao.baidu.com/hairuo/request.ajax?path=puppet%2FGET%2FPvSearchFunction%2FgetPvSearch&reqid=4b534c48-d512-4b4c-2a7b-173632890121", {
                    method:"post",
                    body:[...body.entries()].map(([k,v])=>{
                        return `${k}=${v}`
                    }).join("&"),
                    headers:{
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                });
                const respbody = await response.json()
                records.push(...(respbody.data?.data ?? []))
                progressbar && NProgress.inc(1/fileRange.length)
            })())

            // records.push(...respbody.data.data)
            //发送请求//全部结束后添加按钮，下载CSV
        }

        await Promise.all(requests)
        progressbar && NProgress.done()
        
        const csv = Papa.unparse(records);
        const blob = new Blob([csv], { type: 'text/csv' });
        const downloadA = document.createElement("a")
        downloadA.href = URL.createObjectURL(blob)
        downloadA.download = '流量查询'+new Date().toLocaleTimeString()+'.csv';
        downloadA.click()
    })
    const sp = document.createElement("span")
    sp.textContent = "导入关键词"

    btn.appendChild(sp)
    document.querySelector(".one-ui-pro-textline-main").appendChild(btn)
       

    //新建按钮
    
    //返回一个promise，其中包含一个数组，每个数组由1000行组成
    const getfile = ()=>{
        const input = document.createElement("input");
        input.type = "file"
        

        const data = new Promise(resolve => {
            input.onchange = async (e)=> {
                const text = await input.files[0].text()
                const lines = text.split("\n").reduce((pre,next,index)=>{
                    const i = Math.floor(index/1000)
                    if(!pre[i]) pre[i] = []
                    pre[i].push(next.trim())
                    return pre;
                },[])
                resolve(lines)
            }
        })

        input.click()

        return data;
        
    }
    //为按钮添加监听事件

})();