<template>
  <el-container>
      <el-header>
        <el-row justify="space-between" align="middle">
            <el-col :span="12">
                <el-link href="https://github.com/graynjo/Heimdallr" target="_blank"><h1 style="font-family:'Courier New'"><b>Heimdallr</b></h1></el-link>
            </el-col>
            <el-col :span="10"> 
                <div align="right">
                    <el-tooltip class="box-item" effect="dark" content="暂停插件"  placement="bottom-end" v-if="pluginSwitch">
                      <el-button type="default" circle @click="changePluginSwitch">
                          <el-icon style="vertical-align: middle;">
                              <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-78e17ca8=""><path fill="currentColor" d="M352 159.872V230.4a352 352 0 1 0 320 0v-70.528A416.128 416.128 0 0 1 512 960a416 416 0 0 1-160-800.128z"></path><path fill="currentColor" d="M512 64q32 0 32 32v320q0 32-32 32t-32-32V96q0-32 32-32z"></path></svg>
                          </el-icon>
                      </el-button>
                  </el-tooltip>
                  <el-tooltip class="box-item" effect="dark" content="启用插件"  placement="bottom-end" v-else>
                      <el-button type="default" circle  @click="changePluginSwitch">
                          <el-icon style="vertical-align: middle;">
                              <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-78e17ca8=""><path fill="currentColor" d="M384 192v640l384-320.064z"></path></svg>
                          </el-icon>
                      </el-button>
                  </el-tooltip>
                  <el-tooltip class="box-item" effect="dark" content="清除所有缓存"  placement="bottom-end">
                      <el-button type="default" circle @click="removePopupResult">
                          <el-icon style="vertical-align: middle;">
                              <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-78e17ca8=""><path fill="currentColor" d="M784.512 230.272v-50.56a32 32 0 1 1 64 0v149.056a32 32 0 0 1-32 32H667.52a32 32 0 1 1 0-64h92.992A320 320 0 1 0 524.8 833.152a320 320 0 0 0 320-320h64a384 384 0 0 1-384 384 384 384 0 0 1-384-384 384 384 0 0 1 643.712-282.88z"></path></svg>
                          </el-icon>
                      </el-button>
                  </el-tooltip>
                  <el-tooltip class="box-item" effect="dark" content="设置"  placement="bottom-end">
                      <el-button type="default" circle @click="openSetting"> 
                          <el-icon style="vertical-align: middle;">
                              <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-78e17ca8=""><path fill="currentColor" d="M600.704 64a32 32 0 0 1 30.464 22.208l35.2 109.376c14.784 7.232 28.928 15.36 42.432 24.512l112.384-24.192a32 32 0 0 1 34.432 15.36L944.32 364.8a32 32 0 0 1-4.032 37.504l-77.12 85.12a357.12 357.12 0 0 1 0 49.024l77.12 85.248a32 32 0 0 1 4.032 37.504l-88.704 153.6a32 32 0 0 1-34.432 15.296L708.8 803.904c-13.44 9.088-27.648 17.28-42.368 24.512l-35.264 109.376A32 32 0 0 1 600.704 960H423.296a32 32 0 0 1-30.464-22.208L357.696 828.48a351.616 351.616 0 0 1-42.56-24.64l-112.32 24.256a32 32 0 0 1-34.432-15.36L79.68 659.2a32 32 0 0 1 4.032-37.504l77.12-85.248a357.12 357.12 0 0 1 0-48.896l-77.12-85.248A32 32 0 0 1 79.68 364.8l88.704-153.6a32 32 0 0 1 34.432-15.296l112.32 24.256c13.568-9.152 27.776-17.408 42.56-24.64l35.2-109.312A32 32 0 0 1 423.232 64H600.64zm-23.424 64H446.72l-36.352 113.088-24.512 11.968a294.113 294.113 0 0 0-34.816 20.096l-22.656 15.36-116.224-25.088-65.28 113.152 79.68 88.192-1.92 27.136a293.12 293.12 0 0 0 0 40.192l1.92 27.136-79.808 88.192 65.344 113.152 116.224-25.024 22.656 15.296a294.113 294.113 0 0 0 34.816 20.096l24.512 11.968L446.72 896h130.688l36.48-113.152 24.448-11.904a288.282 288.282 0 0 0 34.752-20.096l22.592-15.296 116.288 25.024 65.28-113.152-79.744-88.192 1.92-27.136a293.12 293.12 0 0 0 0-40.256l-1.92-27.136 79.808-88.128-65.344-113.152-116.288 24.96-22.592-15.232a287.616 287.616 0 0 0-34.752-20.096l-24.448-11.904L577.344 128zM512 320a192 192 0 1 1 0 384 192 192 0 0 1 0-384zm0 64a128 128 0 1 0 0 256 128 128 0 0 0 0-256z"></path></svg>                                </el-icon>
                      </el-button>
                  </el-tooltip>
                </div>
            </el-col>
        </el-row> 
      </el-header>
      <el-main>
          <el-tabs type="border-card" v-model="tabPosition" stretch>

              <!-- 指纹嗅探结果显示 -->
              <el-tab-pane label="指纹嗅探" name="1">
                  <h2 class="plugin-header">嗅探结果</h2>
                  
                  <el-scrollbar height="320px">
                      <div v-if="printerLable !==undefined && printerLable != null  && printerLable.length > 0">
                          <!-- 绿色标签：指纹特征嗅探结果；蓝色标签：关键词嗅探结果; -->
                          <span v-for="(item, index) in printerLable">
                              <el-tag class="tag-block" hit type="success" v-if="item.sid === 1">{{item.scontent}}</el-tag>
                              <el-tag class="tag-block" hit v-else-if="item.sid === 2">{{item.scontent}}</el-tag>
                          </span>
                      </div>
                      <div v-else>
                          <el-empty description="暂无已识别指纹" />
                      </div>
                  </el-scrollbar>
              </el-tab-pane>
              

              <!-- 蜜罐告警结果显示 -->
              <el-tab-pane label="蜜罐告警" name="2">
                  <h2 class="plugin-header">蜜罐告警</h2>

                  <el-scrollbar height="320px">
                      <div v-if="honeypotLable !==undefined && honeypotLable != null  && honeypotLable.length > 0">
                          <!-- 红色标签：jsonp请求；橙色标签：js混淆等可疑特征 -->
                          <span v-for="(item, index) in honeypotLable">
                              <el-tag class="tag-block" hit type="danger" v-if="item.sid === 3">{{item.scontent}}</el-tag>
                              <el-tag class="tag-block" hit type="danger" v-else-if="item.sid === 4">{{item.scontent}}</el-tag>
                              <el-tag class="tag-block" hit type="warning" v-else-if="item.sid === 5">{{item.scontent}}</el-tag>
                          </span>
                      </div>
                      <div v-else>
                          <el-empty description="暂未发现蜜罐特征" />

                      </div>
                  </el-scrollbar>
              </el-tab-pane>



              

              <!-- 设置项之控制栏 -->
              <el-tab-pane label="策略配置" name="3">
                  <h2 class="plugin-header">嗅探策略配置</h2>
                  <el-scrollbar height="320px">

                      <h3 class="plugin-header">被动识别配置</h3>
                      <el-row justify="space-between">
                        <el-col :span="14">
                          <span class="plugin-text">启用响应体规则匹配</span>
                        </el-col>
                        <el-col :span="5"> 
                          <div align="right">
                              <el-switch v-model="responseCheckSwitch" @change="changeResponseCheckSwitch" class="mb-2" inline-prompt active-text="是" inactive-text="否" />
                          </div>
                        </el-col>
                        <el-col :span="1"></el-col>
                      </el-row> 

                      <el-row justify="space-between">
                        <el-col :span="16">
                          <span class="plugin-text">关闭浏览器页面缓存（强制刷新）</span>
                        </el-col>
                        <el-col :span="3"> 
                          <div align="right">
                              <el-switch v-model="noPageCacheSwitch" @change="changeNoPageCacheSwitch" class="mb-2" inline-prompt active-text="是" inactive-text="否" />
                          </div>
                        </el-col>
                        <el-col :span="1"></el-col>
                      </el-row> 

                      <h3 class="plugin-header">蜜罐拦截配置</h3>
                      <el-row justify="space-between">
                        <el-col :span="14">
                          <span class="plugin-text">符合蜜罐特征请求自动拦截</span>
                        </el-col>
                        <el-col :span="5"> 
                          <div align="right">
                              <el-switch v-model="blockHoneypotSwitch" @change="changeBlockHoneypotSwitch" class="mb-2" inline-prompt active-text="是" inactive-text="否"  />
                          </div>
                        </el-col>
                        <el-col :span="1"></el-col>
                      </el-row> 

                      <h3 class="plugin-header">特征对抗配置</h3>
                      <el-row justify="space-between">
                        <el-col :span="14">
                          <span class="plugin-text">WebRTC 防IP泄漏严格策略</span>
                        </el-col>
                        <el-col :span="5"> 
                          <div align="right">
                              <el-switch v-model="webRtcSettingModifySwitch" @change="changeWebRtcSettingModifySwitch" class="mb-2" inline-prompt active-text="是" inactive-text="否"  />
                          </div>
                        </el-col>
                        <el-col :span="1"></el-col>
                      </el-row> 

                      <el-row justify="space-between">
                        <el-col :span="14">
                          <span class="plugin-text">Canvas噪点干扰脚本注入</span>
                        </el-col>
                        <el-col :span="5"> 
                          <div align="right">
                              <el-switch v-model="canvasInjectSwitch" @change="changeCanvasInjectSwitch" class="mb-2" inline-prompt active-text="是" inactive-text="否"  />
                          </div>
                        </el-col>
                        <el-col :span="1"></el-col>
                      </el-row> 
                  </el-scrollbar>
              </el-tab-pane>


              <!-- 相关UA等浏览器特征控制工具 -->
              <el-tab-pane label="特征对抗" name="4">
                  <h2 class="plugin-header">浏览器及系统特征对抗</h2>
                  <el-scrollbar height="320px">

                    <h3 class="plugin-header">浏览器持久化项追踪对抗</h3>
                    <el-row justify="space-between">
                        <el-col :span="14">
                            <el-tooltip class="box-item" effect="dark" content="清除的浏览器持久化项包括：网站应用缓存（appcache）、网站资源缓存、网站缓存存储、Cookie、网络文件系统、表单数据记录、索引数据库（indexDB）、localStorage、密码记录、网络SQL数据（webSQL）" placement="bottom" >
                                <span class="plugin-text">清除所有浏览器持久化项数据</span>
                            </el-tooltip>
                        </el-col>
                        <el-col :span="5"> 
                            <div align="right">
                                <el-button @click="cleanBrowserData">
                                    <el-icon style="vertical-align: middle;">
                                        <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-029747aa=""><path fill="currentColor" d="M352 192V95.936a32 32 0 0 1 32-32h256a32 32 0 0 1 32 32V192h256a32 32 0 1 1 0 64H96a32 32 0 0 1 0-64h256zm64 0h192v-64H416v64zM192 960a32 32 0 0 1-32-32V256h704v672a32 32 0 0 1-32 32H192zm224-192a32 32 0 0 0 32-32V416a32 32 0 0 0-64 0v320a32 32 0 0 0 32 32zm192 0a32 32 0 0 0 32-32V416a32 32 0 0 0-64 0v320a32 32 0 0 0 32 32z"></path></svg>
                                    </el-icon>
                                </el-button>
                            </div>
                        </el-col>
                        <el-col :span="1"></el-col>
                    </el-row> 

                    <h3 class="plugin-header">WebRTC信息泄露对抗</h3>
                    <el-row justify="space-between">
                        <el-col :span="10">
                            <span class="plugin-text">WebRTC策略级别</span>
                        </el-col>
                        <el-col :span="9">
                            <div align="right">
                                <span v-if="webRtcSettingModifySwitch"><el-tag type="success" effect="dark">防溯源严格策略</el-tag></span>
                                <span v-else><el-tag type="info" effect="dark">默认策略</el-tag></span>
                            </div>
                        </el-col>
                        <el-col :span="1"></el-col>
                    </el-row>

                    <h3 class="plugin-header">Canvas指纹特征追踪对抗</h3>
                    <el-row justify="space-between">
                        <el-col :span="9">
                            <span class="plugin-text">Canvas噪点干扰</span>
                        </el-col>
                        <el-col :span="10">
                            <div align="right">
                                <span v-if="canvasInjectSwitch"><el-tag type="success" effect="dark">已开启内容脚本注入</el-tag></span>
                                <span v-else><el-tag type="info" effect="dark">未开启内容脚本注入</el-tag></span>
                            </div>
                        </el-col>
                        <el-col :span="1"></el-col>
                    </el-row>
                  </el-scrollbar>
              </el-tab-pane>

          </el-tabs>
      </el-main>
  </el-container>
</template>

<style scoped>
  /* ::-webkit-scrollbar {
    display: none;
  } */

  .plugin-header {
      color: #6b778c;
  }

  .plugin-text {
      font-size: var(--el-form-label-font-size);
      color: var(--el-text-color-regular);
      --el-form-label-font-size: var(--el-font-size-base);
  }

  .tag-block {
      margin: 4px 12px 4px 0;
  }
</style>



<script lang="ts">
  import { defineComponent } from "vue";
  import { ElMessage } from 'element-plus'

  export default defineComponent ({
    data() {
        return {
            printerLable: [],
            honeypotLable: [],
            
            pluginSwitch: null,
            tabPosition: "1",
            currentTabsName: "",
            initFlag: false,
            
            responseCheckSwitch: null,
            blockHoneypotSwitch: null,
            noPageCacheSwitch: null,
            webRtcSettingModifySwitch: null,
            canvasInjectSwitch: null
        };
    },
    methods: {
        // paga init
        initTabsMouseenter(){
            var _this = this;
            var selectedTab = document.getElementById("tab-1");
            selectedTab.onmouseover = function () { _this.tabPosition = "1" };
            selectedTab = document.getElementById("tab-2");
            selectedTab.onmouseover = function () { _this.tabPosition = "2" };
            selectedTab = document.getElementById("tab-3");
            selectedTab.onmouseover = function () { _this.tabPosition = "3" };
            selectedTab = document.getElementById("tab-4");
            selectedTab.onmouseover = function () { _this.tabPosition = "4" };
        },
        initTabsSettinJumper(){
            if (window.location.hash != null && window.location.hash != "" && window.location.hash =="#setting"){
                this.tabPosition = "3"
            }
        },

        // data init
        initPopupConfig(){
            var _this = this
            chrome.tabs.query({currentWindow: true, active: true}, function(tabArray) {                
                if (tabArray[0].id != null){
                    _this.currentTabsName = "H" + tabArray[0].id
                    chrome.storage.local.get(['HConfig'], function(webstorage) {                        
                        if (webstorage.HConfig != null && webstorage.HConfig != null ){
                            
                            _this.pluginSwitch = webstorage.HConfig.pluginStart
                            _this.responseCheckSwitch = webstorage.HConfig.responseCheck
                            _this.blockHoneypotSwitch = webstorage.HConfig.blockHoneypot
                            _this.noPageCacheSwitch = webstorage.HConfig.noPageCache
                            _this.webRtcSettingModifySwitch = webstorage.HConfig.webRtcSettingModify
                            _this.canvasInjectSwitch = webstorage.HConfig.canvasInject

                            _this.initFlag = true
                        }
                        // 初始化数据后根据数据初始化监听器
                        _this.initPopupMonitor()
                    })
                }
            })
        },

        // monitor init
        initPopupMonitor(){
            var _this = this
            chrome.storage.onChanged.addListener(function(changes, areaname) {
                if (changes.HSniffList !=null && changes.HSniffList.newValue[_this.currentTabsName] !=null && changes.HSniffList.newValue[_this.currentTabsName].sresult.length != 0){
                    // popup结果动态变更
                    _this.refreshPopupResult()
                } else if (changes.HConfig != null){
                    // 配置设置变更
                }
              })
        },

        // html function init
        changePluginSwitch(){
            this.pluginSwitch = !this.pluginSwitch
            var _this = this
            chrome.storage.local.get(['HConfig'], function(webstorage) {                        
                let currentConfig = webstorage.HConfig 
                currentConfig.pluginStart =  _this.pluginSwitch
                chrome.storage.local.set({HConfig: currentConfig}, function() {})
            })
        },

        removePopupResult(event){
            var _this = this;
            chrome.storage.local.set({HSniffList: {}}, function() {
                _this.printerLable = [];
                _this.honeypotLable = [];
                chrome.action.setBadgeText({text: ""});
                // 令按钮失焦
                let target = event.target;
                if(target.nodeName == "i" || target.nodeName == "span"  || target.nodeName == "svg"  || target.nodeName == "path"  || target.nodeName == "button"){
                    target = event.target.parentNode.parentNode.parentNode;
                }
                target.blur();
            });
        },
        openSetting(){
            chrome.runtime.openOptionsPage()
        },
        changeNoPageCacheSwitch(val){
            if (this.initFlag == true){
                this.noPageCacheSwitch = val
                var _this = this
                chrome.storage.local.get(['HConfig'], function(webstorage) {                        
                    let currentConfig = webstorage.HConfig 
                    currentConfig.noPageCache =  _this.noPageCacheSwitch
                    chrome.storage.local.set({HConfig: currentConfig}, function() {})
                })
            }
        },
        changeBlockHoneypotSwitch(val){
            if (this.initFlag == true){
                this.blockHoneypotSwitch = val
                var _this = this
                chrome.storage.local.get(['HConfig'], function(webstorage) {                        
                    let currentConfig = webstorage.HConfig 
                    currentConfig.blockHoneypot =  _this.blockHoneypotSwitch
                    chrome.storage.local.set({HConfig: currentConfig}, function() {})
                })
            }
        },
        changeResponseCheckSwitch(val){
            if (this.initFlag == true){
                this.responseCheckSwitch = val
                var _this = this
                chrome.storage.local.get(['HConfig'], function(webstorage) {                        
                    let currentConfig = webstorage.HConfig 
                    currentConfig.responseCheck =  _this.responseCheckSwitch
                    chrome.storage.local.set({HConfig: currentConfig}, function() {})

                    if(_this.responseCheckSwitch == true){
                        ElMessage({message: '开启响应体检查', type: 'success',})
                        ElMessage({message: '窗口上方将出现提示条', type: 'success',})
                    } else if (_this.responseCheckSwitch == false){
                        ElMessage({message: '响应体检查关闭中', type: 'success',})
                        ElMessage({message: '提示条将在稍延迟后消失', type: 'success',})
                    }
                })
            }
        },
        cleanBrowserData(){
            console.log("clearBrowserData");
            ElMessage('开始清除')
            // 令按钮失焦
            let target = event.target;
            if(target.nodeName == "i" || target.nodeName == "span"  || target.nodeName == "svg"  || target.nodeName == "path"  || target.nodeName == "button"){
                target = event.target.parentNode.parentNode.parentNode;
            }
            target.blur();
            // 清除内容: 网站应用缓存（appcache）、网站资源缓存、网站缓存存储、Cookie、文件系统、表单数据记录、索引数据库（indexDB）、localStorage、密码记录、网页SQL数据（webSQL）
            chrome.browsingData.remove({}, {"appcache": true,"cache": true,"cacheStorage": true,"cookies": true,"fileSystems": true,"formData": true,"indexedDB": true,"localStorage": true,"passwords": true,"webSQL": true}, function(){
                ElMessage({message: '清除完成', type: 'success',})
            })
        },
        changeWebRtcSettingModifySwitch(val){
            if (this.initFlag == true){
                this.webRtcSettingModifySwitch = val
                var _this = this
                chrome.storage.local.get(['HConfig'], function(webstorage) {                        
                    let currentConfig = webstorage.HConfig 
                    currentConfig.webRtcSettingModify =  _this.webRtcSettingModifySwitch
                    chrome.storage.local.set({HConfig: currentConfig}, function() {})
                })
            }
        },
        changeCanvasInjectSwitch(val){
            if (this.initFlag == true){
                this.canvasInjectSwitch = val
                var _this = this
                chrome.storage.local.get(['HConfig'], function(webstorage) {                        
                    let currentConfig = webstorage.HConfig 
                    currentConfig.canvasInject =  _this.canvasInjectSwitch
                    chrome.storage.local.set({HConfig: currentConfig}, function() {})
                })
            }
        },

        // tools function init
        refreshPopupResult(){
            var _this = this;
            chrome.storage.local.get(['HSniffList'], function(webstorage) {
                if (webstorage.HSniffList != null && webstorage.HSniffList[_this.currentTabsName] != null && webstorage.HSniffList[_this.currentTabsName].sresult.length != 0){
                    _this.printerLable = []
                    _this.honeypotLable = []

                    for ( let i of webstorage.HSniffList[_this.currentTabsName].sresult ) {
                        if (i.sid == 1 || i.sid == 2) {
                            _this.printerLable.push(i);
                        } else if (i.sid == 3 || i.sid == 4 || i.sid == 5){
                            _this.honeypotLable.push(i);
                        }
                    }
                    // 存在蜜罐类结果时优先显示蜜罐结果页
                    if (_this.honeypotLable.length != 0){
                        _this.tabPosition = "2"
                    }
                }
            })
        },
        test () {
            // chrome.notifications.create("Heimdallr", {buttons: [{title: "确定"}], contextMessage: "test"+(new Date()).getSeconds(), iconUrl: "chrome-extension://"+ chrome.runtime.id+"/resource/img/icon/ico.png", message: "蜜罐告警数量超过10个，该站点有较大可能为蜜罐", requireInteraction: true, silent: false, title: "Heimdallr", type: "basic"})
        }
    },
    mounted:function(){
        this.$nextTick(function(){
            let _this = this
            // 获取打开popup时当前的结果
            _this.refreshPopupResult()
            // 初始化标签随鼠标移动自动切换
            _this.initTabsMouseenter()
        })      
        
    },
    created: function(){
        // 初始化配置设置
        this.initPopupConfig()
        // 初始化判断是否是setting页面跳转
        this.initTabsSettinJumper()
        // 新功能测试
        //this.test()
    }
  })
</script>