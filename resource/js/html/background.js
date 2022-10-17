'use strict'

var HConfig = {"keyWordSniff" : true, "noPageCache" : true, "blockHoneypot" : false, "responseCheck" : false, "randomMachine" : false, "pluginStart" : true, "modifyUA": ""}
var HPrinter = {"position1" : [], "position2" : [], "position3" : [], "position4" : [], "position5" : []};
var HSniffResult = {shost: "localhost", sresult:[]}
var nowTabs = -999
var responseBodyHost = {}

// 清除配置缓存
//chrome.storage.local.set({HConfig: null}, function() {});







// 监听请求到达
// chrome.webRequest.onCompleted.addListener(details => {
//   //console.log(22222,details)
//   //getResponse()
// }, {urls: ["<all_urls>"]}, ["responseHeaders","extraHeaders"]);


// 删除 User-Agent 标头：

// chrome.webRequest.onBeforeSendHeaders.addListener(
//   function(details) {
//     for (var i = 0; i < details.requestHeaders.length; ++i) {
//       if (details.requestHeaders[i].name === 'User-Agent') {
//         details.requestHeaders.splice(i, 1);
//         break;
//       }
//     }
//     return {requestHeaders: details.requestHeaders};
//   },
//   {urls: ["<all_urls>"]},
//   ["blocking", "requestHeaders"]
// );
  


Init()



function Init() {
  initConfig()
  //initPrinter()
  initData()
  //initMonitor()
}

function initConfig(){
  chrome.browserAction.setBadgeBackgroundColor({color: "#107c10"})
  HConfig = {"keyWordSniff" : true, "noPageCache" : true, "blockHoneypot" : false, "responseCheck" : false, "randomMachine" : false,  "pluginStart" : true, "modifyUA": ""}
  chrome.storage.local.get(['HConfig'], function(webstorage) {
    if (webstorage.HConfig != null && webstorage.HConfig != {}){
        HConfig = webstorage.HConfig
    } else {
        chrome.storage.local.set({HConfig: HConfig}, function() {});
    }
    initPrinter()
    initMonitor()
  });
}

function initPrinter(){
  HPrinter = {"position1" : [], "position2" : [], "position3" : [], "position4" : [], "position5" : []};
  if (HConfig.keyWordSniff == false){
    for ( let i of printerData ) {
      if (i.type != 2){
        if (i.ruleposition == 1) {
          HPrinter.position1.push(i)
        } else if (i.ruleposition == 2){
          HPrinter.position2.push(i)
        } else if (i.ruleposition == 3){
          HPrinter.position3.push(i)
        } else if (i.ruleposition == 4){
          HPrinter.position4.push(i)
        } else if (i.ruleposition == 5){
          HPrinter.position5.push(i)
        }
      }
    }
  } else {
    for ( let i of printerData ) {
      if (i.ruleposition == 1) {
        HPrinter.position1.push(i)
      } else if (i.ruleposition == 2){
        HPrinter.position2.push(i)
      } else if (i.ruleposition == 3){
        HPrinter.position3.push(i)
      } else if (i.ruleposition == 4){
        HPrinter.position4.push(i)
      } else if (i.ruleposition == 5){
        HPrinter.position5.push(i)
      }
    }
  }
}
 
function initData(){
  // 初始化指纹识别结果
  refreshResult()
}

function initMonitor(){
  // 工具杂项
  initToolsMonitor()
  // tabs 变更逻辑
  initTabsMonitor()
  // position 1、2、3、4的监听器
  initCheckMonitor()
  // position5的监听器
  setResponseCheckListener()  
}

function initTabsMonitor(){
  chrome.tabs.onActiveChanged.addListener(tabsOnActiveChangedListener)
  chrome.tabs.onUpdated.addListener(tabsOnUpdatedListener)
}

function initToolsMonitor() {
  // storage监听器
  // 监听扫描结果变更事件和配置更改事件
  chrome.storage.onChanged.addListener(function(changes, areaname) {
    if (changes.HSniffResult !=null){
      if (changes.HSniffResult.newValue.sresult.length != 0){
        chrome.browserAction.setBadgeText({text: changes.HSniffResult.newValue.sresult.length.toString()});
      } else {
        chrome.browserAction.setBadgeText({text: ""});
      }
    } else if (changes.HConfig != null){
      console.log("modify config",changes.HConfig.newValue);
    }
  });
}



function checkRule(checkContent, checkRule){
  if (checkContent.search(checkRule) == -1){
    return false
  } else {
    return true
  }
}



function refreshResult(){
  chrome.storage.local.set({HSniffResult: HSniffResult}, function() {
    console.log('Result is ' + JSON.stringify(HSniffResult));
  });
}



function tabsOnActiveChangedListener(tabId, selectInfo) {
  chrome.tabs.query({currentWindow: true, active: true}, function(tabArray) {
    if (tabArray[0].id != null && tabArray[0].id == tabId){
      if (tabArray[0].url != null && tabArray[0].url != ""){
        let hhost = tabArray[0].url.split('/')[2]
        if (HSniffResult.shost != hhost){
          HSniffResult.shost = hhost
          HSniffResult.sresult = []
          refreshResult()
        }
        if (HConfig.noPageCache == true){
          chrome.browsingData.removeCache({"since": ((new Date()).getTime() - 3600000)},function(){})
        }
      }
    }
  })
}

function tabsOnUpdatedListener(tabId, changeInfo, tab) {
  if(changeInfo.status == "complete" && tab.url != null){
    chrome.tabs.query({currentWindow: true, active: true}, function(tabArray) {
      if (tabArray[0].id != null && tabArray[0].id == tab.id){
        let hhost = tab.url.split('/')[2]
        if (HSniffResult.shost != hhost){
          let tmpResult = []
          for ( let i of HSniffResult.sresult ) {
            if (i.sshost == hhost) {
              tmpResult.push(i)
            }
          }
          HSniffResult.shost = hhost
          HSniffResult.sresult = tmpResult
          refreshResult()
        }
      }
      if (HConfig.noPageCache == true){
        chrome.browsingData.removeCache({"since": ((new Date()).getTime() - 3600000)},function(){})
      }
    })
  }
}



function initCheckMonitor(){
  chrome.webRequest.onBeforeRequest.addListener(webRequestOnbeforeRequestListener, {urls: ["http://*/*","https://*/*"]}, ["requestBody","extraHeaders", "blocking"]);
  chrome.webRequest.onBeforeSendHeaders.addListener(webRequestOnBeforeSendHeadersListener, {urls: ["http://*/*","https://*/*"]}, ["requestHeaders","extraHeaders"]);
  chrome.webRequest.onResponseStarted.addListener(webRequestOnResponseStartedListener, {urls: ["<all_urls>"]}, ["responseHeaders","extraHeaders"]);
}

function deleteCheckMonitor(){
  chrome.webRequest.onBeforeRequest.removeListener(webRequestOnbeforeRequestListener);
  chrome.webRequest.onBeforeSendHeaders.removeListener(webRequestOnBeforeSendHeadersListener);
  chrome.webRequest.onResponseStarted.removeListener(webRequestOnResponseStartedListener);
  console.log("存在监听器",chrome.webRequest.onResponseStarted.hasListener(webRequestOnResponseStartedListener))
  if (chrome.tabs.onActivated.hasListener(responseBodyCheckListener)){
    chrome.tabs.onActivated.removeListener(responseBodyCheckListener)
    if (nowTabs != -999) {
      chrome.debugger.detach({tabId: nowTabs})
    }
  }
  if (chrome.debugger.onEvent.hasListener(allNetworkEventHandler)) {
    chrome.debugger.onEvent.removeListener(allNetworkEventHandler)
  }
}

function setResponseCheckListener(){
  if (chrome.tabs.onActivated.hasListener(responseBodyCheckListener)){
    chrome.tabs.onActivated.removeListener(responseBodyCheckListener)
    if (nowTabs != -999) {
      chrome.debugger.detach({tabId: nowTabs})
    }
  }
  if (chrome.debugger.onEvent.hasListener(allNetworkEventHandler)) {
    chrome.debugger.onEvent.removeListener(allNetworkEventHandler)
  }
  if (HConfig.responseCheck == null || HConfig.responseCheck == false) {
    // 设置为关闭时无操作
  } else {
    chrome.tabs.onActivated.addListener(responseBodyCheckListener)
    responseBodyCheckListener()
  }

}

function webRequestOnbeforeRequestListener(details) {
  if(details.type == 'main_frame' || details.type == 'sub_frame' || details.type == 'script' || details.type == 'xmlhttprequest' || details.type == 'other' || details.type == 'object'){
    // url check
    // 用于添加规则时获取jsonp域名
    // console.log(99999999,details.url)
    for ( let i of HPrinter.position1 ) {
      let checkResult = checkRule(details.url,i.rulecontent)
      if (checkResult == true){
        let nowResult
        nowResult = {sid: i.type, scontent: i.commandments, sshost: getRealHost(details)}
        if (!HSniffResult.sresult.some(item => { if (item.scontent == i.commandments) return true })){
          HSniffResult.sresult.push(nowResult)
          refreshResult()
        }
        if (i.type == 4 && HConfig.blockHoneypot == true){
          return {cancel: true}; 
        }
      }
    }
    // body request check
    let requestBodyContent = null
    if (details.requestBody != null){
      if (details.requestBody.formData != null){
        //formdata
        requestBodyContent = JSON.stringify(details.requestBody.formData).replace(/^{(.*)}$/,"$1")
      } else if (details.requestBody.raw != null){
        if (details.requestBody.raw.length == 1 && details.requestBody.raw[0].bytes != null){
          //json
          requestBodyContent = decodeURIComponent(encodeURIComponent(String.fromCharCode.apply(null, new Uint8Array(details.requestBody.raw[0].bytes))))
        } else {
          //other
          for (let i of details.requestBody.raw) {
            if (i.bytes != null){
              requestBodyContent = requestBodyContent + decodeURIComponent(encodeURIComponent(String.fromCharCode.apply(null, new Uint8Array(details.requestBody.raw[0].bytes))))
            } else {
              requestBodyContent = requestBodyContent + JSON.stringify(i).replace(/^{(.*)}$/,"$1")
            }
          }
        }
      } else {
        return
      }
      for ( let i of HPrinter.position3 ) {
        let checkResult = checkRule(requestBodyContent,i.rulecontent)
        if (checkResult == true){
          let nowResult = {sid: i.type, scontent: i.commandments, sshost: getRealHost(details)}
          if (!HSniffResult.sresult.some(item => { if (item.scontent == i.commandments) return true })){
            HSniffResult.sresult.push(nowResult)
            refreshResult()
          }
        }
      }
    }
  } else if (details.type == 'websocket' || details.type == 'stylesheet' || details.type == 'image' || details.type == 'media' || details.type == 'font'  || details.type == 'csp_report' || details.type == 'ping'){}
    //其他类型的请求，暂不处理
}

function webRequestOnBeforeSendHeadersListener(details) {
  if(details.type == 'main_frame' || details.type == 'sub_frame' || details.type == 'script' || details.type == 'xmlhttprequest' || details.type == 'other' || details.type == 'object'){
    let nowlist = []
    for ( let i of details.requestHeaders ) {
      nowlist.push(i.name)
    }
    for ( let i of HPrinter.position2 ) {
      if (nowlist.indexOf(i.rulecontent.name) != -1){
        for (let j=0; j<nowlist.length; j++){
          if (nowlist[j] == i.rulecontent.name){
            let checkResult = checkRule(details.requestHeaders[j].value,i.rulecontent.value)
            if (checkResult == true){
              let nowResult = {sid: i.type, scontent: i.commandments, sshost: getRealHost(details)}
              if (!HSniffResult.sresult.some(item => { if (item.scontent == i.commandments) return true })){
                HSniffResult.sresult.push(nowResult)
                refreshResult()
              }
              break
            }
          }
        }
      }
    } 
  } else if (details.type == 'websocket' || details.type == 'stylesheet' || details.type == 'image' || details.type == 'media' || details.type == 'font'  || details.type == 'csp_report' || details.type == 'ping'){}
    //其他类型的请求，暂不处理
}

function webRequestOnResponseStartedListener(details) {
  if(details.type == 'main_frame' || details.type == 'sub_frame' || details.type == 'script' || details.type == 'xmlhttprequest' || details.type == 'other' || details.type == 'object'){
    let nowlist = []
    for ( let i of details.responseHeaders ) {
      nowlist.push(i.name)
    }
    for ( let i of HPrinter.position4 ) {
      if (nowlist.indexOf(i.rulecontent.name) != -1){
        for (let j=0; j<nowlist.length; j++){
          if (nowlist[j] == i.rulecontent.name){
            let checkResult = checkRule(details.responseHeaders[j].value,i.rulecontent.value)
            if (checkResult == true){
              let nowResult = {sid: i.type, scontent: i.commandments, sshost: getRealHost(details)}
              if (!HSniffResult.sresult.some(item => { if (item.scontent == i.commandments) return true })){
                HSniffResult.sresult.push(nowResult)
                refreshResult()
              }
              break
            }
          }
        }
      }
    } 
  } else if (details.type == 'websocket' || details.type == 'stylesheet' || details.type == 'image' || details.type == 'media' || details.type == 'font'  || details.type == 'csp_report' || details.type == 'ping'){}
    //其他类型的请求，暂不处理 
}



function responseBodyCheckListener(){
	chrome.tabs.query({currentWindow: true, active: true}, function(tabArray) {
      if (tabArray[0].url.search(/^[http://|https://|file://]/i) == 0){
        if (nowTabs == -999) {
          if (tabArray[0].id != null){
            nowTabs = tabArray[0].id
            responseBodyHost = {}
            chrome.debugger.attach({tabId: nowTabs}, "1.0", onTabsAttach.bind(null, nowTabs));
          }
        } else {
          chrome.debugger.detach({tabId: nowTabs},function(){
            chrome.debugger.onEvent.removeListener(allNetworkEventHandler);
            nowTabs = tabArray[0].id
            responseBodyHost = {}
            chrome.debugger.attach({tabId: nowTabs}, "1.0", onTabsAttach.bind(null, nowTabs));
          })
        } 
      }
  })
}

function onTabsAttach(id) {
  chrome.debugger.sendCommand({tabId: id}, "Network.enable");
  chrome.debugger.onEvent.addListener(allNetworkEventHandler);
}

function allNetworkEventHandler(debuggerId, message, params) {
  if (nowTabs != debuggerId.tabId) {
    return
  }  
  if (message == "Network.dataReceived") {
    if (responseBodyHost[params.requestId] != null) {
      chrome.debugger.sendCommand({tabId: debuggerId.tabId}, "Network.getResponseBody", {"requestId": params.requestId}, function(response) {
        let responseBodyContent = null
        if (response != null && response.base64Encoded != null){
          if (response.base64Encoded == true){
            responseBodyContent = atob(response.body)
          } else {
            responseBodyContent = response.body
          }
        } else {
          return
        }
        for ( let i of HPrinter.position5 ) {
          let checkResult = checkRule(responseBodyContent,i.rulecontent)
          if (checkResult == true){
            let nowResult = {sid: i.type, scontent: i.commandments, sshost: responseBodyHost[params.requestId] }
            if (!HSniffResult.sresult.some(item => { if (item.scontent == i.commandments) return true })){
              HSniffResult.sresult.push(nowResult)
              refreshResult()
            }
          }
        }
        delete responseBodyHost[params.requestId]
      })
    }
  } else if (message == "Network.requestWillBeSent") {
    if (params.documentURL != null && params.requestId!= null){
      if (params.documentURL.search(/^[http://|https://|file://]/i) == 0) {
        if (params.type != null && (params.type == "Document" | params.type == "Script" |params.type == "XHR" |params.type == "Other" |params.type == "Fetch")){
          // pass "Image" "Media" "Stylesheet" "Font"
          responseBodyHost[params.requestId] = params.documentURL.split('/')[2]
        }
      }
    }
  } else if (message == "Network.loadingFailed") {
    if (params.requestId!= null){
      if (responseBodyHost[params.requestId] != null) {
        delete responseBodyHost[params.requestId]
      }
    }
  }
}


function getRealHost(details){
  if (details.initiator != null) {
    return details.initiator.split('/')[2]
  } else if (details.url != null) {
    return details.url.split('/')[2]
  }
}