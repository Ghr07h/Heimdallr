'use strict'

importScripts("resource/data/data.js")

var HConfig = null
// 默认配置 {currentTabs: -999, "noPageCache" : true, "blockHoneypot" : false, "responseCheck" : false, "pluginStart" : true, "webRtcSettingModify" : false,  "canvasInject": false}}

var HSniffList = null
// element结构  tabId : {shost:"www.baidu.com", sresult:[{sid: 1, scontent: "test123"},{sid: 2, scontent: "test123"}}]}

var debuggerAttach = null
// {attachingTab: -999, attachingContent: {}}

var oldConfig = null
// 通过旧config变量控制popup修改配置后的行为

var lastUpdate = null
// 补充当前页面为chrome相关页面时的行为操作

// 清除配置缓存
// chrome.storage.local.set({HConfig: null}, function() {})

try {

// 首次安装时弹出设置
if (!chrome.runtime.onInstalled.hasListener(runtimeOnInstallListener)){
  chrome.runtime.onInstalled.addListener(runtimeOnInstallListener)
} else {
  console.log("runtimeOnInstallListener is Listening")
}

function runtimeOnInstallListener(details){
  if (details.reason=="install") {
    chrome.runtime.openOptionsPage()
  }
}





keepServiceRunning()
Init()





function keepServiceRunning() {
  setTimeout(function () {console.log(HSniffList)}, 300000)
}

function Init() {
  initConfig()
  // 顺序执行 initMonitor()、checkSelectFunction()
  initData()
}





function initConfig(){
  chrome.action.setBadgeBackgroundColor({color: "#107c10"})

  debuggerAttach = {attachingTab: -999, attachingContent: {}}
  lastUpdate = {url: "", tab: -999, chrome: false}

  chrome.storage.local.get(['HConfig'], function(webstorage) {
    chrome.tabs.query({currentWindow: true, active: true}, function(tabArray) {
      if (webstorage.HConfig != null){
        HConfig = webstorage.HConfig
      } else {
        HConfig = {currentTabs: -999, "noPageCache" : true, "blockHoneypot" : false, "responseCheck" : false, "pluginStart" : true, "webRtcSettingModify" : false, "canvasInject": false}
      }
      if (tabArray[0] != null && tabArray[0].id != null ){
        HConfig.currentTabs = tabArray[0].id
      }
      oldConfig = Object.assign({}, HConfig)
      chrome.storage.local.set({HConfig: HConfig}, function() {})
      
      
      console.log("初始化配置数据");
      console.log(HConfig);
      console.log(webstorage);


      initMonitor()
      // 选项类功能检查是否启用
      // checkSelectFunction()
    })
  })
}
 
function initData(){
  chrome.storage.local.get(['HSniffList'], function(webstorage) {
    if (webstorage.HSniffList != null){
      HSniffList = webstorage.HSniffList
    } else {
      HSniffList = {}
      chrome.storage.local.set({HSniffList: HSniffList}, function() {})
    }
  })
}

function checkSelectFunction(){
  // 用于判断选项功能是否生效并进行整理
  // 插件正常使用时根据设置检查是否预期执行
  // 插件关闭时，webRTC功能不变，页面无缓存（其他函数实现）、响应体拦截（其他函数实现）、蜜罐拦截、canvas脚本注入均暂停执行
  if (HConfig.pluginStart == true){
    if (HConfig.blockHoneypot == true) {
      chrome.declarativeNetRequest.getDynamicRules(function(currentRules){
        if (currentRules.length == 0) {
          chrome.declarativeNetRequest.updateDynamicRules( {"addRules" : HBlockingDomainRules, "removeRuleIds" : [] }, function(){console.log("动态添加Blocking规则")})
        } else {
          console.log("添加失败，Blocking规则已存在")
        }
      }) 
    } else {
      chrome.declarativeNetRequest.getDynamicRules(function(currentRules){
        if (currentRules.length == HBlockingDomainRulesIds.length) {
          chrome.declarativeNetRequest.updateDynamicRules( {"addRules" : [], "removeRuleIds" : HBlockingDomainRulesIds }, function(){console.log("动态删除Blocking规则")})
        } else {
          console.log("无需删除，Blocking规则不存在")
        }
      })
    }
    if (HConfig.webRTCIPHandlingPolicy == true){
      chrome.privacy.network.webRTCIPHandlingPolicy.get({},function(details){
        if (details.value != "disable_non_proxied_udp") {
          chrome.privacy.network.webRTCIPHandlingPolicy.set({
            value: 'disable_non_proxied_udp'
          })
        }
      })
    } else {
      chrome.privacy.network.webRTCIPHandlingPolicy.get({},function(details){
        if (details.value == "disable_non_proxied_udp") {
          chrome.privacy.network.webRTCIPHandlingPolicy.set({
            value: 'default'
          })
        }
      })
    }
    if (HConfig.canvasInject == true){
      chrome.scripting.getRegisteredContentScripts(function(injectContentScript){
        if (injectContentScript != null && injectContentScript.length == 0){
          chrome.scripting.registerContentScripts([{"allFrames":true, "id":"HInject", "js":["resource/inject/inject.js"], "runAt":"document_start", "matches":["http://*/*","https://*/*","file://*/*"]}], function(){
              console.log("注册Content Script: Canvas interference")
            })
        }
      })
    } else {
      chrome.scripting.getRegisteredContentScripts(function(injectContentScript){
        if (injectContentScript != null && injectContentScript.length != 0){
          chrome.scripting.unregisterContentScripts({"ids":["HInject"]},function(){
            console.log("卸载Content Script: Canvas interference")
          })
        }
      })
    }
  } else {
    // 插件关闭，蜜罐拦截功能随之关闭，但配置仍然为true
    if (HConfig.blockHoneypot == true) {
      chrome.declarativeNetRequest.getDynamicRules(function(currentRules){
        if (currentRules.length == HBlockingDomainRulesIds.length) {
          chrome.declarativeNetRequest.updateDynamicRules( {"addRules" : [], "removeRuleIds" : HBlockingDomainRulesIds }, function(){console.log("动态删除Blocking规则")})
        } else {
          console.log("无需删除，Blocking规则不存在")
        }
      }) 
    } 
    // 插件关闭，webRTC功能不变
    // 插件关闭，canvas脚本注入随之关闭，但配置仍然为true
    if (HConfig.canvasInject == true){
      chrome.scripting.getRegisteredContentScripts(function(injectContentScript){
        if (injectContentScript != null && injectContentScript.length != 0){
          chrome.scripting.unregisterContentScripts({"ids":["HInject"]},function(){
            console.log("卸载Content Script: Canvas interference")
          })
        }
      })
    }
  }
}

function initMonitor(){
  // 工具杂项-安装插件时弹出设置、存储监听器
  initToolsMonitor()
  // tabs 变更逻辑
  initTabsMonitor()
  // position 监听器
  if (HConfig.pluginStart == true){
    initCheckMonitor()
  }
}

function initToolsMonitor() {
  // storage监听器
  // 监听扫描结果变更事件和配置更改事件
  if (!chrome.storage.onChanged.hasListener(storageOnChangedListener)){
    chrome.storage.onChanged.addListener(storageOnChangedListener)
  } else {
    console.log("storageOnChangedListener is Listening")
  }

  //关闭时删除历史结果
  chrome.windows.onRemoved.addListener(function (lastWindowId) {
    chrome.windows.getAll(function (windowsList) {
      if (windowsList != null && windowsList.length == 0) {
        HSniffList = {}
        chrome.storage.local.set({HSniffList: HSniffList}, function() {})
      }
    })
  })
}

function storageOnChangedListener(changes, areaname) {
  console.log("storage 变更");
  console.log(changes);

  if (changes.HSniffList !=null){
    // 当前页面结果变更后更新序号
    if (changes.HSniffList.newValue["H"+HConfig.currentTabs] != null && changes.HSniffList.newValue["H"+HConfig.currentTabs].sresult.length != 0){
      chrome.action.setBadgeText({text: changes.HSniffList.newValue["H"+HConfig.currentTabs].sresult.length.toString()})
    } else {
      chrome.action.setBadgeText({text: ""})
    }
    HSniffList = changes.HSniffList.newValue
  } else if (changes.HConfig != null){
    // 设置变更
    if (JSON.stringify(changes.HConfig.newValue) != JSON.stringify(oldConfig)) {
      // 前端引起的设置变更(currentTabs除外)
      if (changes.HConfig.newValue.currentTabs != null && changes.HConfig.newValue.currentTabs != oldConfig.currentTabs){
        // 当前页面变更
        if (HSniffList["H"+changes.HConfig.newValue.currentTabs] != null && HSniffList["H"+changes.HConfig.newValue.currentTabs].sresult.length != 0){
          chrome.action.setBadgeText({text: HSniffList["H"+changes.HConfig.newValue.currentTabs].sresult.length.toString()})
        } else {
          chrome.action.setBadgeText({text: ""})
        }
        HConfig = changes.HConfig.newValue
        oldConfig = Object.assign({}, HConfig)
      } else if (changes.HConfig.newValue.pluginStart != oldConfig.pluginStart){
        // 插件开关
        // 先修改设置供函数调用
        HConfig = changes.HConfig.newValue
        oldConfig = Object.assign({}, HConfig)
        if (changes.HConfig.newValue.pluginStart == true){
          // 开启插件
          initCheckMonitor()
        } else {
          // 暂停插件
          deleteCheckMonitor()
        }
      } else if (changes.HConfig.newValue.responseCheck != oldConfig.responseCheck){
        // body匹配
        HConfig = changes.HConfig.newValue
        oldConfig = Object.assign({}, HConfig)
        setResponseCheckListener()
      } else if (changes.HConfig.newValue.noPageCache != oldConfig.noPageCache){
        // 缓存设置
        // 仅同步全局变量供tabsOnUpdatedListener和tabsOnActiveChangeListener使用
        if (changes.HConfig.newValue.noPageCache == true){
          chrome.browsingData.removeCache({"since": ((new Date()).getTime() - 3600000)},function(){})
        }
        HConfig = changes.HConfig.newValue
        oldConfig = Object.assign({}, HConfig)
      } else if (changes.HConfig.newValue.blockHoneypot != oldConfig.blockHoneypot){
        // 蜜罐拦截开关
        if (changes.HConfig.newValue.blockHoneypot == true){
          // 开启拦截
          chrome.declarativeNetRequest.getDynamicRules(function(currentRules){
            if (currentRules.length == 0) {
              chrome.declarativeNetRequest.updateDynamicRules( {"addRules" : HBlockingDomainRules, "removeRuleIds" : [] }, function(){console.log("动态添加Blocking规则")})
            } else {
              console.log("添加失败，Blocking规则已存在")
            }
          })        
        } else {
          // 暂停拦截
          chrome.declarativeNetRequest.getDynamicRules(function(currentRules){
            if (currentRules.length == HBlockingDomainRulesIds.length) {
              chrome.declarativeNetRequest.updateDynamicRules( {"addRules" : [], "removeRuleIds" : HBlockingDomainRulesIds }, function(){console.log("动态删除Blocking规则")})
            } else {
              console.log("无需删除，Blocking规则不存在")
            }
          })
        }
        HConfig = changes.HConfig.newValue
        oldConfig = Object.assign({}, HConfig)
      } else if (changes.HConfig.newValue.webRtcSettingModify != oldConfig.webRtcSettingModify){
        // WebRTC设置开关
        if (changes.HConfig.newValue.webRtcSettingModify == true){
          // 开启严格策略
          chrome.privacy.network.webRTCIPHandlingPolicy.get({},function(details){
            if (details.value == "default") {
              chrome.privacy.network.webRTCIPHandlingPolicy.set({
                value: 'disable_non_proxied_udp'
              })
            }
          })
        } else {
          // 关闭严格策略
          chrome.privacy.network.webRTCIPHandlingPolicy.get({},function(details){
            if (details.value == "disable_non_proxied_udp") {
              chrome.privacy.network.webRTCIPHandlingPolicy.set({
                value: 'default'
              })
            }
          })
        }
        HConfig = changes.HConfig.newValue
        oldConfig = Object.assign({}, HConfig)
      } else if (changes.HConfig.newValue.canvasInject != oldConfig.canvasInject){
        // canvas干扰开关
        if (changes.HConfig.newValue.canvasInject == true){
          // 开启脚本注入
          chrome.scripting.registerContentScripts([{"allFrames":true, "id":"HInject", "js":["resource/inject/inject.js"], "runAt":"document_start", "matches":["http://*/*","https://*/*","file://*/*"]}], function(){
            console.log("注册Content Script: Canvas interference")
          })
        } else {
          // 关闭脚本注入
          chrome.scripting.getRegisteredContentScripts(function(injectContentScript){
            if (injectContentScript != null && injectContentScript.length == 1 && injectContentScript[0].id != null && injectContentScript[0].id == "HInject"){
              chrome.scripting.unregisterContentScripts({"ids":["HInject"]},function(){
                console.log("卸载Content Script: Canvas interference")
              })
            }
          })
        }
        HConfig = changes.HConfig.newValue
        oldConfig = Object.assign({}, HConfig)
      }
    }
  }
}

// 状态                OnActive    OnUpdated   onReplaced  onRemoved   onHighlighted  windows.onFocusChanged
// 打开浏览器               1           2                                   1                   2
// 新建窗口                 1           2                                   1                   1                 
// 新建标签页               1           2                                   1
// 更换标签                 1                                               1
// 更换窗口                                                                                     1
// 新标签页打开某页面                    4                        
// 某页面新建某页面          1           4                                   1
// 某页面跳转本域名某页面                 4                       
// 某页面跳转其他域名某页面               4 
// 刷新页面                             3
// 在当前页面关闭当前页面     1                                   1           1
// 在当前页面关闭其他页面                                         1           1

function initTabsMonitor(){
  if (!chrome.tabs.onActivated.hasListener(tabsOnActiveChangedOrWindowsOnFocusChangedListener)){
    chrome.tabs.onActivated.addListener(tabsOnActiveChangedOrWindowsOnFocusChangedListener)
  } else {
    console.log("tabsOnActiveChangedListener is Listening")
  }
  if (!chrome.windows.onFocusChanged.hasListener(tabsOnActiveChangedOrWindowsOnFocusChangedListener)){
    chrome.windows.onFocusChanged.addListener(tabsOnActiveChangedOrWindowsOnFocusChangedListener)
  } else {
    console.log("windowsOnFocusChangedListener is Listening")
  }
  if (!chrome.tabs.onUpdated.hasListener(tabsOnUpdatedListener)){
    chrome.tabs.onUpdated.addListener(tabsOnUpdatedListener)
  } else {
    console.log("tabsOnUpdatedListener is Listening")
  }
  if (!chrome.tabs.onRemoved.hasListener(tabsOnRemoveListener)){
    chrome.tabs.onRemoved.addListener(tabsOnRemoveListener)
  } else {
    console.log("tabsOnRemoveListener is Listening")
  }
}

function tabsOnActiveChangedOrWindowsOnFocusChangedListener(tabId, selectInfo) {
  // 当前页面变量变更
  chrome.tabs.query({currentWindow: true, active: true}, function(tabArray) {
      if (tabArray[0] != null && tabArray[0].id != null && HConfig.currentTabs != tabArray[0].id){
        HConfig.currentTabs = tabArray[0].id
        chrome.storage.local.set({HConfig: HConfig}, function() {})
      }
    })
}

function tabsOnUpdatedListener(tabId, changeInfo, tab) {
  // 清理缓存功能
  if (HConfig.noPageCache == true  && HConfig.pluginStart == true){
    chrome.browsingData.removeCache({"since": ((new Date()).getTime() - 3600000)},function(){})
  }

  // 补充chrome页面跳转为新页面时执行更新响应体检测的tabsOnHighlightedResponseBodyCheckListener
  if (HConfig.responseCheck == true && HConfig.pluginStart == true){
    if (changeInfo.status == "loading"){
      if (changeInfo.url != null && changeInfo.url.search(/^chrome:\/\//i)  == 0){
        lastUpdate.chrome = true
      } else {
        if (lastUpdate.chrome == true){
          tabsOnHighlightedResponseBodyCheckListener({"tabIds":[tabId]})
        }
        lastUpdate.chrome = false
      }
    }
  }

  // 补充同标签页的url变更时icon和result不变的问题
  if (changeInfo.status == "loading"){
    if (lastUpdate.tab == tabId){
      // 同一标签页
      if (changeInfo.url != null){
        if (changeInfo.url.split('/')[2] != lastUpdate.url){
          // 出现同标签页url变更
          if (HSniffList["H"+tabId] != null && HSniffList["H"+HConfig.currentTabs].sresult.length != 0){
            HSniffList["H"+tabId].sresult = []
            HSniffList["H"+tabId].shost = changeInfo.url.split('/')[2]
            refreshResult()
            chrome.action.setBadgeText({text: ""})
          } else {
            chrome.action.setBadgeText({text: ""})
          }
          lastUpdate.url = changeInfo.url.split('/')[2]
        }
      }
    } else {
      // 跳转加载中的其他标签页
      lastUpdate.tab = tabId
      if (changeInfo.url != null){
        lastUpdate.url = changeInfo.url.split('/')[2]
      }
    }
  }
}

function tabsOnRemoveListener(tabId, removeInfo){
  // 删除关闭标签页的结果
  if (HSniffList["H"+tabId] != null){
    delete HSniffList["H"+tabId]
    refreshResult()
  }
}

function checkRule(checkContent, checkRule){
  if (checkContent.search(checkRule) == -1){
    return false
  } else {
    return true
  }
}

function refreshResult(){
  chrome.storage.local.set({HSniffList: HSniffList}, function() {
    console.log('Result is ')
    console.log(HSniffList)
  })
}

function initCheckMonitor(){
  if (!chrome.webRequest.onBeforeRequest.hasListener(webRequestOnbeforeRequestListener)){
    chrome.webRequest.onBeforeRequest.addListener(webRequestOnbeforeRequestListener, {urls: ["http://*/*","https://*/*"]}, ["requestBody","extraHeaders"])
  } else {
    console.log("webRequestOnbeforeRequestListener is Listening")
  }
  if (!chrome.webRequest.onBeforeSendHeaders.hasListener(webRequestOnBeforeSendHeadersListener)){
    chrome.webRequest.onBeforeSendHeaders.addListener(webRequestOnBeforeSendHeadersListener, {urls: ["http://*/*","https://*/*"]}, ["requestHeaders","extraHeaders"])
  } else {
    console.log("webRequestOnBeforeSendHeadersListener is Listening")
  }
  if (!chrome.webRequest.onResponseStarted.hasListener(webRequestOnResponseStartedListener)){
    chrome.webRequest.onResponseStarted.addListener(webRequestOnResponseStartedListener, {urls: ["<all_urls>"]}, ["responseHeaders","extraHeaders"])
  } else {
    console.log("webRequestOnResponseStartedListener is Listening")
  }

  setResponseCheckListener() 

  if (HConfig.blockHoneypot == true) {
    chrome.declarativeNetRequest.getDynamicRules(function(currentRules){
      if (currentRules.length == 0) {
        chrome.declarativeNetRequest.updateDynamicRules( {"addRules" : HBlockingDomainRules, "removeRuleIds" : [] }, function(){console.log("动态添加Blocking规则")})
      } else {
        console.log("添加失败，Blocking规则已存在")
      }
    })  
  }

  checkSelectFunction()
}

function deleteCheckMonitor(){
  if (chrome.webRequest.onBeforeRequest.hasListener(webRequestOnbeforeRequestListener)){
    chrome.webRequest.onBeforeRequest.removeListener(webRequestOnbeforeRequestListener)
  } else {
    console.log("webRequestOnbeforeRequestListener is not Listening")
  }
  if (chrome.webRequest.onBeforeSendHeaders.hasListener(webRequestOnBeforeSendHeadersListener)){
    chrome.webRequest.onBeforeSendHeaders.removeListener(webRequestOnBeforeSendHeadersListener)
  } else {
    console.log("webRequestOnBeforeSendHeadersListener is not Listening")
  }
  if (chrome.webRequest.onResponseStarted.hasListener(webRequestOnResponseStartedListener)){
    chrome.webRequest.onResponseStarted.removeListener(webRequestOnResponseStartedListener)
  } else {
    console.log("webRequestOnResponseStartedListener is not Listening")
  }
  chrome.storage.local.set({HSniffList: {}}, function() {})

  setResponseCheckListener() 

  if (HConfig.blockHoneypot == true) {
    chrome.declarativeNetRequest.getDynamicRules(function(currentRules){
      if (currentRules.length == HBlockingDomainRulesIds.length) {
        chrome.declarativeNetRequest.updateDynamicRules( {"addRules" : [], "removeRuleIds" : HBlockingDomainRulesIds }, function(){console.log("动态删除Blocking规则")})
      } else {
        console.log("无需删除，Blocking规则不存在")
      }
    })
  }

  checkSelectFunction()
}

function setResponseCheckListener(){
  if (HConfig.responseCheck == null || HConfig.responseCheck == false) {
    // 设置为关闭时
    if (chrome.tabs.onHighlighted.hasListener(tabsOnHighlightedResponseBodyCheckListener)){
      chrome.tabs.onHighlighted.removeListener(tabsOnHighlightedResponseBodyCheckListener)
      if (debuggerAttach.attachingTab != -999) {
        chrome.debugger.getTargets(function(tabsArray){
          for (let i of tabsArray) {
            if (i.attached == true && i.tabId != null) {
              chrome.debugger.detach({tabId: i.tabId})
            }
          }
          debuggerAttach.attachingTab = -999
          debuggerAttach.attachingContent = {}
        })
      }
    } else {
      console.log("tabsOnHighlightedResponseBodyCheckListener is not Listening")
    }
    if (chrome.debugger.onEvent.hasListener(networkHandlerOnAttachTabsListener)) {
      chrome.debugger.onEvent.removeListener(networkHandlerOnAttachTabsListener)
    } else {
      console.log("networkHandlerOnAttachTabsListener is not Listening")
    }
    if (chrome.debugger.onDetach.hasListener(debuggerOnDetachListener)) {
      chrome.debugger.onDetach.removeListener(debuggerOnDetachListener)
    } else {
      console.log("debuggerOnDetachListener is not Listening")
    }
  } else {
    // 设置为启动时
    debuggerAttach.attachingTab = -999
    debuggerAttach.attachingContent = {}
    // 切换标签时处理逻辑
    chrome.tabs.onHighlighted.addListener(tabsOnHighlightedResponseBodyCheckListener)
    tabsOnHighlightedResponseBodyCheckListener({"tabIds":[HConfig.currentTabs]})
  }
}

function addSniffList(i, details) {
  let newResult
  newResult = {sid: i.type, scontent: i.commandments}
  if (HSniffList["H"+details.tabId.toString()] == null){
    // 新的tabs结果
    HSniffList["H"+details.tabId.toString()] = {shost: "", sresult: []}
    HSniffList["H"+details.tabId.toString()].sresult.push(newResult)
    if (details.type == "main_frame" && details.initiator == null){
      HSniffList["H"+details.tabId.toString()].shost = details.url.split('/')[2]
    } else {
      HSniffList["H"+details.tabId.toString()].shost = details.initiator.split('/')[2]
    }
    refreshResult()
  } else {
    // 在已有tabs结果中修改
    if ((details.type == "main_frame" && details.url.split('/')[2] == HSniffList["H"+details.tabId.toString()].shost) || (details.initiator != null && HSniffList["H"+details.tabId.toString()].shost == details.initiator.split('/')[2]) ){
      // host相同，直接添加
      if (!HSniffList["H"+details.tabId.toString()].sresult.some(item => { if (item.scontent == i.commandments) return true })){
        HSniffList["H"+details.tabId.toString()].sresult.push(newResult)
        refreshResult()
      }
    } else {
      // host不同，判断是否是标签页变更host
      if (details.parentFrameId!=-1){
        // 子框架，可能与主框架不同host，结果继承,子框架不干涉host更改
        if (!HSniffList["H"+details.tabId.toString()].sresult.some(item => { if (item.scontent == i.commandments) return true })){
          HSniffList["H"+details.tabId.toString()].sresult.push(newResult)
          refreshResult()
        }
      } else {
        // 主框架，此时为该标签页host变更
        if (details.type == "main_frame" && details.initiator == null){
          HSniffList["H"+details.tabId.toString()].shost = details.url.split('/')[2]
        } else {
          HSniffList["H"+details.tabId.toString()].shost = details.initiator.split('/')[2]
        }
        HSniffList["H"+details.tabId.toString()].sresult = []
        HSniffList["H"+details.tabId.toString()].sresult.push(newResult)
        refreshResult()
      }
    }

    // 所有页面筛选超过告警10个jsonp的页面
    if (HSniffList["H"+details.tabId.toString()].sresult.length > 5 && HSniffList["H"+details.tabId.toString()].snotification == null) {
      let jsonpNumber = 0
      for ( let i of HSniffList["H"+details.tabId.toString()].sresult ) {
        if (i.sid == 4){
          jsonpNumber++
        }
      }
      if (jsonpNumber > 10){
        HSniffList["H"+details.tabId.toString()].snotification = jsonpNumber
        chrome.tabs.get(details.tabId, function(honeypotTab){
          if (honeypotTab != null) {
            chrome.notifications.create(details.tabId.toString(), {buttons: [{title: "确定"}], contextMessage: honeypotTab.title + "\n"+ honeypotTab.url, iconUrl: 'chrome-extension://'+ chrome.runtime.id+'/resource/img/icon/ico.png', message: "蜜罐jsonp类告警数量超过10个，该站点有较大可能为蜜罐", title: "Heimdallr", type: "basic"})
          }
        })
        refreshResult()
      }
    }
  }
}



// 对request url和request body进行识别
function webRequestOnbeforeRequestListener(details) {
  if(details.type == 'main_frame' || details.type == 'sub_frame' || details.type == 'script' || details.type == 'xmlhttprequest' || details.type == 'image' || details.type == 'stylesheet' || details.type == 'other' || details.type == 'object'){
    // url check
    // 其中类型为image的请求将只进行url识别（用于特定框架特征）而不进行body识别
    // console.log(11111,details)
    for ( let i of HPrinter.position1 ) {
      let checkResult = checkRule(details.url,i.rulecontent)
      if (checkResult == true){
        addSniffList(i, details)
      }
    }
    // body request check
    // 获取body内容
    if (details.type != 'image' && details.type != 'stylesheet'){
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
        // 与规则进行比较
        for ( let i of HPrinter.position3 ) {
          let checkResult = checkRule(requestBodyContent,i.rulecontent)
          if (checkResult == true){
            addSniffList(i, details)
          }
        }
      }
    }
  } else if (details.type == 'websocket' || details.type == 'media' || details.type == 'font'  || details.type == 'csp_report' || details.type == 'ping'){}
    //其他类型的请求，暂不处理
}

function webRequestOnBeforeSendHeadersListener(details) {
  if(details.type == 'main_frame' || details.type == 'sub_frame' || details.type == 'script' || details.type == 'xmlhttprequest' || details.type == 'other' || details.type == 'object'){
    //console.log(22222,details)

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
              addSniffList(i, details)
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
    //console.log(33333,details)
    let nowlist = []
    for ( let i of details.responseHeaders ) {
      nowlist.push(i.name)
    }
    for ( let i of HPrinter.position4 ) {
      if (nowlist.indexOf(i.rulecontent.name) != -1 || nowlist.indexOf(i.rulecontent.name.toLowerCase()) != -1){
        for (let j=0; j<nowlist.length; j++){
          if (nowlist[j].toLowerCase() == i.rulecontent.name.toLowerCase()){
            let checkResult = checkRule(details.responseHeaders[j].value,i.rulecontent.value)
            if (checkResult == true){
              addSniffList(i, details)
              break
            }
          }
        }
      }
    } 
  } else if (details.type == 'websocket' || details.type == 'stylesheet' || details.type == 'image' || details.type == 'media' || details.type == 'font'  || details.type == 'csp_report' || details.type == 'ping'){}
    //其他类型的请求，暂不处理 
}



function tabsOnHighlightedResponseBodyCheckListener(highlightInfo){
  if (HConfig.responseCheck == true && highlightInfo.tabIds != null && highlightInfo.tabIds[0] != null){
    chrome.tabs.get(highlightInfo.tabIds[0], function(thisTabs){
      if ((thisTabs.url != null && thisTabs.url.search(/^[http:\/\/|https:\/\/|file:\/\/]/i) == 0) || ( thisTabs.pendingUrl != null && thisTabs.pendingUrl.search(/^[http:\/\/|https:\/\/|file:\/\/]/i) == 0 )){
        // 正常页面
        if (debuggerAttach.attachingTab == -999 ){
          // 未发起调试则开启调试连接
          debuggerAttach.attachingTab = highlightInfo.tabIds[0]
          debuggerAttach.attachingContent = {}
          chrome.debugger.getTargets(function(tabsArray){
            for (let i of tabsArray) {
              if (i.attached == false && i.tabId != null && i.tabId == debuggerAttach.attachingTab) {
                chrome.debugger.attach({tabId: debuggerAttach.attachingTab}, "1.0", tabsOnAttachForResponseCheck.bind(null, debuggerAttach.attachingTab))
                break
              }
            }
          })
        } else {
          // 已发起调试逻辑
          if (highlightInfo.tabIds[0] != null && debuggerAttach.attachingTab == highlightInfo.tabIds[0]){
            // 已对本页面进行调试，无需额外处理
            
          } else {
            // 调试页面变更
            chrome.debugger.getTargets(function(tabsArray){
              for (let i of tabsArray) {
                if (i.attached == true && i.tabId != null && i.tabId == debuggerAttach.attachingTab) {
                  chrome.debugger.detach({tabId: debuggerAttach.attachingTab},function(){
                    chrome.debugger.onEvent.removeListener(networkHandlerOnAttachTabsListener)
                    // chrome.debugger.onDetach.removeListener(debuggerOnDetachListener)
                    for (let i of tabsArray) {
                      if (i.tabId != null  && i.tabId == highlightInfo.tabIds[0] && i.attached == false) {
                        chrome.debugger.attach({tabId: highlightInfo.tabIds[0]}, "1.0", tabsOnAttachForResponseCheck.bind(null, highlightInfo.tabIds[0]))
                        debuggerAttach.attachingTab = highlightInfo.tabIds[0]
                        debuggerAttach.attachingContent = {}
                        break
                      }
                    }
                  })
                  break
                }
              }
              // if (debuggerAttach.attachingTab != HConfig.currentTabs ){
              //   debuggerAttach.attachingTab = -999
              //   debuggerAttach.attachingContent = {}
              // }
            })
          }
        }
      } else {
        // 扩展等chrome页面，仅解除原调试标签页连接，不建立新的连接
        chrome.debugger.getTargets(function(tabsArray){
          for (let i of tabsArray) {
            if (i.attached == true && i.tabId != null && i.tabId == debuggerAttach.attachingTab) {
              chrome.debugger.detach({tabId: debuggerAttach.attachingTab},function(){
                chrome.debugger.onEvent.removeListener(networkHandlerOnAttachTabsListener)
                // chrome.debugger.onDetach.removeListener(debuggerOnDetachListener)
                debuggerAttach.attachingTab = -999
                debuggerAttach.attachingContent = {}
              })
              break
            }
          }
        })
      }
    })






  }
}

function tabsOnAttachForResponseCheck(id) {
  chrome.debugger.sendCommand({tabId: id}, "Network.enable")
  chrome.debugger.onEvent.addListener(networkHandlerOnAttachTabsListener)
  chrome.debugger.onDetach.addListener(debuggerOnDetachListener)
}

function networkHandlerOnAttachTabsListener(debuggerId, message, params) {
  if (debuggerAttach.attachingTab != debuggerId.tabId) {
    return
  }  

  if (message == "Network.dataReceived") {
    if (debuggerAttach.attachingContent[params.requestId] != null) {
      try {
      chrome.debugger.sendCommand({tabId: debuggerId.tabId}, "Network.getResponseBody", {"requestId": params.requestId}, function(response) {
        // response Body 处理
        let responseBodyContent = null
        if (response != null && response.base64Encoded != null){
          if (response.base64Encoded == true){
            responseBodyContent = atob(response.body, 'base64')
          } else {
            responseBodyContent = response.body
          }
        } else {
          return
        }
        // response Body 规则匹配
        for ( let i of HPrinter.position5 ) {
          let checkResult = checkRule(responseBodyContent,i.rulecontent)
          if (checkResult == true){
            addSniffList(i,{"initiator": debuggerAttach.attachingContent[params.requestId], "tabId" : debuggerId.tabId})
          }
        }
        delete debuggerAttach.attachingContent[params.requestId]
      })
      } catch(e){
        console.log("获取响应体时失败，请求编号" + params.requestId)
        console.log(e)
        delete debuggerAttach.attachingContent[params.requestId]
      } 
    }
  } else if (message == "Network.requestWillBeSent") {
    if (params.documentURL != null && params.requestId!= null){
      if (params.documentURL.search(/^[http://|https://|file://]/i) == 0) {
        if (params.type != null && (params.type == "Document" | params.type == "Script" |params.type == "XHR" |params.type == "Other" |params.type == "Fetch")){
          // pass "Image" "Media" "Stylesheet" "Font"
          debuggerAttach.attachingContent[params.requestId] = params.documentURL
        }
      }
    }
  } else if (message == "Network.loadingFailed") {
    if (params.requestId!= null){
      if (debuggerAttach.attachingContent[params.requestId] != null) {
        delete debuggerAttach.attachingContent[params.requestId]
      }
    }
  }
}

function debuggerOnDetachListener(Debuggee, DetachReason){
  console.log("断开调试")
  console.log(Debuggee)
  console.log(DetachReason)
  debuggerAttach = {attachingTab: -999, attachingContent: {}}
}




}
catch(e){
  console.log(999999999999,e);
}