'use strict'

const App = {
    data() {
        return {
            printerLable: [],
            honeypotLable: [],
            
            pluginSwitch: false,
            tabPosition: "1",
            
            responseCheckSwitch: null,
            blockHoneypotSwitch: null,
            keyWordSniffSwitch: null,
            noPageCacheSwitch: null,


            //未使用变量
            activeScanning: false,
            percentage: 100,
        };
    },
    methods: {
        initPopupConfig(nowConf){
            this.pluginSwitch = nowConf.pluginStart
            
            this.responseCheckSwitch = nowConf.responseCheck
            this.blockHoneypotSwitch = nowConf.blockHoneypot
            this.keyWordSniffSwitch = nowConf.keyWordSniff
            this.noPageCacheSwitch = nowConf.noPageCache

            this.initPopupMonitor()
        },
        initPopupMonitor(){
            var _this = this;
            chrome.storage.onChanged.addListener(function(changes, areaname) {
                if (changes.HSniffResult !=null){
                    _this.refreshPopupResult()
                } else if (changes.HConfig != null){
                }
              });
        },
        changePlugin(){
            if (this.pluginSwitch == true){
                chrome.extension.getBackgroundPage().deleteCheckMonitor()

            } else if (this.pluginSwitch == false){
                chrome.extension.getBackgroundPage().initMonitor()
            }
            this.pluginSwitch =! this.pluginSwitch
            chrome.extension.getBackgroundPage().HConfig.pluginStart = this.pluginSwitch
            chrome.storage.local.set({HConfig: chrome.extension.getBackgroundPage().HConfig}, function() {})
        },
        removePopupResult(event){
            var _this = this;
            chrome.storage.local.get(['HSniffResult'], function(webstorage) {
                let changeresult = webstorage.HSniffResult
                changeresult.sresult = []
                chrome.storage.local.set({HSniffResult: changeresult}, function() {
                    chrome.extension.getBackgroundPage().HSniffResult.sresult = []
                    _this.printerLable = [];
                    _this.honeypotLable = [];
                    // 令按钮失焦
                    let target = event.target;
                    if(target.nodeName == "i" || target.nodeName == "span"  || target.nodeName == "svg"  || target.nodeName == "path"  || target.nodeName == "button"){
                        target = event.target.parentNode.parentNode.parentNode;
                    }
                    target.blur();
                  });
            })
        },
        refreshPopupResult(){
            var _this = this;
            chrome.storage.local.get(['HSniffResult'], function(webstorage) {
                if (webstorage.HSniffResult != null && webstorage.HSniffResult.sresult != null && webstorage.HSniffResult.sresult.length != 0){
                    
                    _this.printerLable = []
                    _this.honeypotLable = []

                    for ( let i of webstorage.HSniffResult.sresult ) {
                        if (i.sid == 1 || i.sid == 2 || i.sid == 3) {
                            _this.printerLable.push(i);
                        } else if (i.sid == 4 || i.sid == 5){
                            _this.honeypotLable.push(i);
                        }
                    }

                    if (_this.honeypotLable.length != 0){
                        _this.tabPosition = "2"
                    }
                    
                }
            });
        },
        openSetting(){
            chrome.tabs.create({
                url: 'chrome://extensions/?id=jnfomnhfgmdgojoffbjenhablmamkibc'
              });
        },
        keyWordSniffSwitchChange(val){
            if (this.keyWordSniffSwitch != null){
                chrome.extension.getBackgroundPage().HConfig.keyWordSniff = val
                chrome.extension.getBackgroundPage().initPrinter()
                chrome.storage.local.set({HConfig: chrome.extension.getBackgroundPage().HConfig}, function() {})
            }
        },
        noPageCacheSwitchChange(val){
            if (this.noPageCacheSwitch != null){
                chrome.extension.getBackgroundPage().HConfig.noPageCache = val
                chrome.storage.local.set({HConfig: chrome.extension.getBackgroundPage().HConfig}, function() {console.log(chrome.extension.getBackgroundPage().HConfig.noPageCache);});
            }
        },
        blockHoneypotSwitchChange(val){
            if (this.blockHoneypotSwitch != null){
                chrome.extension.getBackgroundPage().HConfig.blockHoneypot = val;
                chrome.storage.local.set({HConfig: chrome.extension.getBackgroundPage().HConfig}, function() {});
            }
        },
        responseCheckSwitchChange(val){
            if (this.responseCheckSwitch != null){
                chrome.extension.getBackgroundPage().HConfig.responseCheck = val
                chrome.extension.getBackgroundPage().setResponseCheckListener()
                chrome.storage.local.set({HConfig: chrome.extension.getBackgroundPage().HConfig}, function() {})
            }
        },

        test () {
            //pop访问background
                // function test()
                // {
                //     alert('我是background！');
                // }

                // var bg = chrome.extension.getBackgroundPage();
                // bg.test(); // 访问bg的函数
                // alert(bg.document.body.innerHTML); 
        }
    },
    mounted:function(){
        this.$nextTick(function(){
            let _this = this;
            _this.refreshPopupResult()
        })      
    },
    created: function(){
        this.initPopupConfig(chrome.extension.getBackgroundPage().HConfig)
    }
};


const app = Vue.createApp(App);
app.use(ElementPlus);
app.mount("#app");