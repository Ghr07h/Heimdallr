/*
当前指纹类规则103条, 蜜罐类规则151条

新增指纹规则如下
{
    rulename: "demorule",                     // 规则名命名规则： 规则种类序号_组织_实体_特征_该类型规则序号，内容全小写，如 fN/hN_apache_tomcat_page_1
    type: 1,                                // 1: 常规指纹规则；2：关键字规则；3：需要拦截的蜜罐本身的url特征，如js脚本路径；4：需要拦截的蜜罐进行敏感域名拦截的jsonp规则；5：蜜罐可能使用的js特征，仅作告警不拦截
    commandments:"Tomcat: default example page",    // 显示的告警或指纹信息，要求不可与已有规则的告警内容重复
    ruleposition: 1,                        // 1：请求url；2：请求头；3：请求体；4：响应头；5：响应体
    rulecontent:/rex1/im,         // 非heade类型的规则的正则表达式内容，按照js的rex规则编写，斜杠尾部自行添加flag参数（一般使用im，忽略大小写的多行匹配），斜杠内特殊字符需转义
    //蜜罐拦截类jsonp直接写域名即可，不可使用反斜杠等rex元字符
    //rulecontent: {"name":"Cookie","value":/deleteMe/im }          // ruleposition为2或4的指纹，即header name与header value
}
*/

'use strict'

var printerData = [

    // =========================================================================
    // 指纹类特征
    // 数量 103
    // 可检测框架
    // ueditor、struts2、spring、weblogic、shiro、F5 BIG-IP、致远OA、用友NC、用友畅捷通、通达OA、心通达OA、新点OA、帆软报表、蓝凌OA、红帆OA、华天动力OA、万户OA、金蝶云、协众OA、金和OA、海昌OA、泛微多个产品(ecology、eoffice、ebridge、emobile)、拓尔思SSO、拓尔思内容管理系统、亿邮邮件、coremail邮件、Exchange邮件、若依后台管理系统、Wordpress、小鱼易连云视讯、tomcat、iis、jboss、jetty、ibm websphere、weblogic、thinkphp、showdoc、Laravel、kindeditor、fckeditor、ewebeditor、jeesite、海康威视多个产品（网络摄像头、安防管理平台、图像综合应用平台）、dedecms、jira、confluence、java web、博达站群、dubbo、向日葵客户端、宝塔waf、宝塔面板、米拓cms、teleport堡垒机、齐治堡垒机、帕拉迪堡垒机、H3C堡垒机、绿盟防火墙、安全狗Waf
    // 可检测敏感信息
    // Json格式数据、IP地址、手机号、邮箱地址、身份证号
    // =========================================================================

    {
        rulename: "f1_baidu_ueditor_url_1",
        type: 1,
        commandments:"Ueditor: 加载Ueditor资源文件ueditor.all.js",
        ruleposition: 1,
        rulecontent: /ueditor\.all\.js/im
    },
    {
        rulename: "f2_baidu_ueditor_url_2",
        type: 1,
        commandments:"Ueditor: 加载Ueditor资源文件ueditor.config.js",
        ruleposition: 1,
        rulecontent: /ueditor\.config\.js/im
    },
    {
        rulename: "f3_baidu_ueditor_keyword_3",
        type: 2,
        commandments:"Ueditor: 响应体检测到关键字[ueditor]",
        ruleposition: 5,
        rulecontent: /ueditor/im
    },
    {
        rulename: "f4_baidu_ueditor_url_4",
        type: 1,
        commandments:"Ueditor: 加载Ueditor资源文件ueditor.all.min.js",
        ruleposition: 1,
        rulecontent: /ueditor\.all\.min\.js/im
    },
    {
        rulename: "f5_baidu_ueditor_url_5",
        type: 1,
        commandments:"Ueditor: 加载Ueditor资源文件ueditor.config.min.js",
        ruleposition: 1,
        rulecontent: /ueditor\.config\.min\.js/im
    },
    {
        rulename: "f6_baidu_ueditor_keyword_6",
        type: 2,
        commandments:"Ueditor: Url检测到关键字[ueditor]",
        ruleposition: 1,
        rulecontent: /ueditor/im
    },
    {
        rulename: "f7_javaee_struts2_url_1",
        type: 1,
        commandments:"Struts2: 检测到请求目标后缀为.action/.do",
        ruleposition: 1,
        rulecontent: /\.action(\?.*)?$|\.do(\?.*)?$/im
    },
    {
        rulename: "f8_javaee_spring_responsebody_1",
        type: 1,
        commandments:"Spring: 存在Spring 404页面",
        ruleposition: 5,
        rulecontent: /\<h1\>Whitelabel Error Page\<\/h1\>/im
    },
    {
        rulename: "f9_oracle_weblogic_responsebody_1",
        type: 1,
        commandments:"Weblogic: 存在Weblogic 404页面",
        ruleposition: 5,
        rulecontent: /\<i\>Hypertext Transfer Protocol \-\- HTTP\/1\.1\<\/i\>/im
    },
    {
        rulename: "f10_apache_shiro_requestheader_1",
        type: 1,
        commandments:"Shiro: 请求头包含rememberme特征",
        ruleposition: 2,
        rulecontent: {"name":"Cookie","value":/rememberme\=/im }
    },
    {
        rulename: "f11_apache_shiro_requestheader_2",
        type: 1,
        commandments:"Shiro: 请求头包含deleteMe特征",
        ruleposition: 2,
        rulecontent: {"name":"Cookie","value":/\=deleteMe/im }
    },
    {
        rulename: "f12_apache_shiro_responseheader_3",
        type: 1,
        commandments:"Shiro: 响应头包含rememberme特征",
        ruleposition: 4,
        rulecontent: {"name":"Set-Cookie","value":/rememberme\=/im }
    },
    {
        rulename: "f13_apache_shiro_responseheader_4",
        type: 1,
        commandments:"Shiro: 响应头包含deleteMe特征",
        ruleposition: 4,
        rulecontent: {"name":"Set-Cookie","value":/\=deleteMe/im }
    },
    {
        rulename: "f14_f5_bigip_requestheader_1",
        type: 1,
        commandments:"F5 BIG-IP: 请求头Cookie泄露应用的内网IP和端口",
        ruleposition: 2,
        rulecontent: {"name":"Cookie","value":/BIGipServer/im }
    },
    {
        rulename: "f15_f5_bigip_requestheader_2",
        type: 1,
        commandments:"F5 BIG-IP: 响应头Set-Cookie泄露应用的内网IP和端口",
        ruleposition: 4,
        rulecontent: {"name":"Set-Cookie","value":/BIGipServer/im }
    },
    {
        rulename: "f16_ecma_json_requestbody_1",
        type: 1,
        commandments:"Json: 请求体数据为json格式",
        ruleposition: 3,
        rulecontent: /^\{.*\}$/im
    },
    {
        rulename: "f17_ecma_json_requestheader_2",
        type: 1,
        commandments:"Json: 请求头Content-Type为application/json",
        ruleposition: 2,
        rulecontent: {"name":"Content-Type","value":/application\/json/im }
    },
    {
        rulename: "f18_ecma_json_responsebody_3",
        type: 1,
        commandments:"Json: 响应体数据为json格式",
        ruleposition: 5,
        rulecontent:/^\{.*\}$/im
    },
    {
        rulename: "f19_infomation_ip_responsebody_1",
        type: 2,
        commandments:"敏感信息: 响应体存在IP地址",
        ruleposition: 5,
        rulecontent: /((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)/im
    },
    {
        rulename: "f20_infomation_phonenumber_responsebody_2",
        type: 2,
        commandments:"敏感信息: 响应体存在手机号码",
        ruleposition: 5,
        rulecontent: /1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}/im
    },
    {
        rulename: "f21_infomation_email_responsebody_3",
        type: 2,
        commandments:"敏感信息: 响应体中存在邮箱地址",
        ruleposition: 5,
        rulecontent: /\w+@[\da-z\.-]+\.([a-z]{2,6}|[\u2E80-\u9FFF]{2,3})/im
    },
    {
        rulename: "f22_infomation_identitynumber_responsebody_4",
        type: 2,
        commandments:"敏感信息: 响应体中存在身份证号",
        ruleposition: 5,
        rulecontent: /[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]/im
    },
    {
        rulename: "f23_seeyon_oa_url_1",
        type: 1,
        commandments:"致远OA: Url包含特征静态资源目录",
        ruleposition: 1,
        rulecontent: /\/seeyon\/common\//im
    },
    {
        rulename: "f24_seeyon_oa_url_2",
        type: 1,
        commandments:"致远OA: 加载特征图片资源",
        ruleposition: 1,
        rulecontent: /\/seeyon\/USER-DATA\/IMAGES\/LOGIN\/login\.gif/im
    },
    {
        rulename: "f25_ufida_nc_url_1",
        type: 1,
        commandments:"用友NC: 加载特征图片资源ufida_nc.png",
        ruleposition: 1,
        rulecontent: /logo\/images\/ufida_nc\.png/im
    },
    {
        rulename: "f26_ufida_nc_url_2",
        type: 1,
        commandments:"用友NC: 加载特征图片资源ufida.ico",
        ruleposition: 1,
        rulecontent: /logo\/images\/ufida\.ico/im
    },
    {
        rulename: "f27_ufida_nc_url_3",
        type: 1,
        commandments:"用友NC: 加载特征图片资源icon_uclient.png",
        ruleposition: 1,
        rulecontent: /img\/icon_uclient\.png/im
    },
    {
        rulename: "f28_ufida_nc_responsebody_4",
        type: 1,
        commandments:"用友软件: 响应体包含用友软件版权声明",
        ruleposition: 5,
        rulecontent: /UFIDA Software CO\.LTD all rights reserved/im
    },
    {
        rulename: "f29_ufida_nc_responsebody_5",
        type: 1,
        commandments:"用友NC: 响应体包含用友UClient客户端链接",
        ruleposition: 5,
        rulecontent: /uclient\.yonyou\.com/im
    },
    {
        rulename: "f30_ufida_tplus_url_1",
        type: 1,
        commandments:"用友畅捷通T+: 加载特征图片资源",
        ruleposition: 1,
        rulecontent: /\/tplus\/img\/portal\/tplus/im
    },
    {
        rulename: "f31_ufida_tplus_url_2",
        type: 1,
        commandments:"用友畅捷通T+: 发起特征ajax请求",
        ruleposition: 1,
        rulecontent: /\/tplus\/ajaxpro\/Ufida/im
    },
    {
        rulename: "f32_tongda_oa_url_1",
        type: 1,
        commandments:"通达OA: 加载特征图片资源",
        ruleposition: 1,
        rulecontent: /\/images\/tongda\.ico/im
    },
    {
        rulename: "f33_tongda_oa_responsebody_2",
        type: 1,
        commandments:"通达OA: 响应体包含通达banner声明",
        ruleposition: 5,
        rulecontent: /北京通达信科科技有限公司/im
    },
    {
        rulename: "f34_tongda_oa_responsebody_3",
        type: 1,
        commandments:"通达OA: 响应体包含通达信科官网链接",
        ruleposition: 5,
        rulecontent: /\/\/www\.tongda2000\.com/im
    },
    {
        rulename: "f35_tongda_oa_responsebody_4",
        type: 2,
        commandments:"通达OA: 响应体检测到关键词[Office Anywhere]",
        ruleposition: 5,
        rulecontent: /Office Anywhere/im
    },
    {
        rulename: "f36_tongda_oa_responsebody_5",
        type: 2,
        commandments:"通达OA: 响应体检测到关键词[通达OA移动版]",
        ruleposition: 5,
        rulecontent: /通达OA移动版/im
    },
    {
        rulename: "f37_xintongda_oa_url_1",
        type: 1,
        commandments:"心通达OA: 加载特征图片资源",
        ruleposition: 1,
        rulecontent: /\/img\/replaceImg\/theme\d{1,2}\/LOGO\.png/im
    },
    {
        rulename: "f38_xindian_oa_url_1",
        type: 1,
        commandments:"新点OA: 加载新点OA(V9.0)特征图片资源",
        ruleposition: 1,
        rulecontent: /\/login\/images\/ihpone\-dl\.png/im
    },
    {
        rulename: "f39_finereport_report_url_1",
        type: 1,
        commandments:"帆软报表: 发起特征ajax请求",
        ruleposition: 1,
        rulecontent: /\/WebReport\/ReportServer\?op/im
    },
    {
        rulename: "f40_landray_oa_url_1",
        type: 1,
        commandments:"蓝凌OA: 加载特征静态资源CSS文件",
        ruleposition: 1,
        rulecontent: /\/sys\/ui\/extend\/theme\/default\/style\/icon\.css/im
    },
    {
        rulename: "f41_ioffice_oa_url_1",
        type: 2,
        commandments:"红帆OA: Url检测到关键词[ioffice]",
        ruleposition: 1,
        rulecontent: /\/ioffice\//im
    },
    {
        rulename: "f42_ioffice_oa_url_2",
        type: 1,
        commandments:"红帆OA: Url包含特征请求路径",
        ruleposition: 1,
        rulecontent: /\/attachment\/file\/loginPreview\/\?objectId\=WebSite\_loginBackground\&/im
    },
    {
        rulename: "f43_cnpower_oa_url_1",
        type: 1,
        commandments:"华天动力OA: 访问特征登录接口",
        ruleposition: 1,
        rulecontent: /\/OAapp\/WebObjects\/OAapp\.woa/im
    },
    {
        rulename: "f44_ezoffice_oa_url_1",
        type: 1,
        commandments:"万户OA: 加载特征JS资源目录",
        ruleposition: 1,
        rulecontent: /\/defaultroot\/scripts\/main\/whir/im
    },
    {
        rulename: "f45_ezoffice_oa_url_2",
        type: 1,
        commandments:"万户OA: 加载特征CSS资源目录",
        ruleposition: 1,
        rulecontent: /\/defaultroot\/templates\/template_system\/common\//im
    },
    {
        rulename: "f46_kingdee_erp_url_1",
        type: 1,
        commandments:"金蝶云星空ERP: 加载特征CSS资源目录",
        ruleposition: 1,
        rulecontent: /\/HTML5\/content\/themes\/kdcss/im
    },
    {
        rulename: "f47_ncoa_oa_responseheader_1",
        type: 2,
        commandments:"协众OA: 响应头包含Cookie特征[CNOAOASESSID]",
        ruleposition: 4,
        rulecontent: {"name":"Set-Cookie","value":/CNOAOASESSID/im }
    },
    {
        rulename: "f48_jinher_oa_responseheader_1",
        type: 2,
        commandments:"金和OA: 响应头包含Cookie特征",
        ruleposition: 4,
        rulecontent: {"name":"Set-Cookie","value":/ASPSESSIONIDSSCDTDBS/im }
    },
    {
        rulename: "f49_cnhcit_oa_url_1",
        type: 1,
        commandments:"海昌OA: 加载特征JS资源",
        ruleposition: 1,
        rulecontent: /\/loginmain4\/js\/jquery\min\.js/im
    },
    {
        rulename: "f50_weaver_ecology_url_1",
        type: 1,
        commandments:"泛微OA E-Cology: 加载特征JS资源",
        ruleposition: 1,
        rulecontent: /\/wui\/theme\/ecology\d\//im
    },
    {
        rulename: "f51_weaver_ecology_url_2",
        type: 1,
        commandments:"泛微OA E-Cology: 加载特征CSS资源",
        ruleposition: 1,
        rulecontent: /\/spa\/portal\/public\/index\.css/im
    },
    {
        rulename: "f52_weaver_ecology_responseheader_3",
        type: 1,
        commandments:"泛微OA E-Cology: 响应头包含Cookie特征",
        ruleposition: 4,
        rulecontent: {"name":"Set-Cookie","value":/ecology\_JSessionId/im }
    },
    {
        rulename: "f53_weaver_ecology_url_4",
        type: 2,
        commandments:"泛微OA E-Cology运维管理平台: 响应体包含banner关键字",
        ruleposition: 5,
        rulecontent: /e\-cology运维管理平台\<\/title\>/im
    },
    {
        rulename: "f54_weaver_eoffice_url_1",
        type: 1,
        commandments:"泛微OA E-Office: 加载泛微E-office 9静态资源目录",
        ruleposition: 1,
        rulecontent: /\/newplugins\/js\/pnotify\/jquery\.pnotify/im
    },
    {
        rulename: "f55_weaver_eoffice_url_2",
        type: 1,
        commandments:"泛微OA E-Office: 加载泛微E-office 10静态资源目录",
        ruleposition: 1,
        rulecontent: /\/eoffice10\/client\/web\/polyfills/im
    },
    {
        rulename: "f56_weaver_ebridge_url_1",
        type: 1,
        commandments:"泛微云桥 E-Bridge: 加载特征图片资源",
        ruleposition: 1,
        rulecontent: /\/main\/login\/images\/loginlogo\.png$/im
    },
    {
        rulename: "f57_weaver_emobile_responseheader_1",
        type: 1,
        commandments:"泛微OA E-mobile: 响应头包含Server特征",
        ruleposition: 4,
        rulecontent: {"name":"Server","value":/^EMobileServer$/im }
    },
    {
        rulename: "f58_weaver_emobile_responsebody_1",
        type: 2,
        commandments:"泛微OA E-mobile移动管理平台: 响应体包含banner关键字",
        ruleposition: 5,
        rulecontent: /\<title\>移动管理平台((\-企业)|(消息服务 ))管理/im
    },
    {
        rulename: "f59_trsid_ids_responseheader_1",
        type: 2,
        commandments:"拓尔思SSO: 响应头包含Cookie特征",
        ruleposition: 4,
        rulecontent: {"name":"Set-Cookie","value":/trsidsssosessionid/im }
    },
    {
        rulename: "f60_trsid_wcm_responseheader_1",
        type: 2,
        commandments:"拓尔思内容管理系统: 响应头包含Cookie特征",
        ruleposition: 4,
        rulecontent: {"name":"Set-Cookie","value":/com\.trs\.idm\.coSessionId/im }
    },
    {
        rulename: "f61_eyou_mail_url_1",
        type: 1,
        commandments:"亿邮Eyou邮件系统: 加载特征图片资源",
        ruleposition: 1,
        rulecontent: /\/tpl\/login\/user\/images\/login\_logo\.png/im
    },
    {
        rulename: "f62_coremail_mail_url_1",
        type: 1,
        commandments:"论客coremail邮件系统: 加载特征静态资源目录",
        ruleposition: 1,
        rulecontent: /\/coremail\/common\/assets\//im
    },
    {
        rulename: "f63_microsoft_mail_url_1",
        type: 1,
        commandments:"Microsoft Exchange邮件系统: 访问Exchange登录接口",
        ruleposition: 1,
        rulecontent: /\/owa\/auth\/logon\.aspx/im
    },
    {
        rulename: "f64_ruoyi_cms_url_1",
        type: 1,
        commandments:"若依后台管理系统: 加载特征CSS资源",
        ruleposition: 1,
        rulecontent: /\/ruoyi\/css\/ry\-ui\.css/im
    },
    {
        rulename: "f65_wordpress_cms_url_1",
        type: 1,
        commandments:"Wordprees: 加载特征静态资源目录",
        ruleposition: 1,
        rulecontent: /\/wp-content\/themes\//im
    },
    {
        rulename: "f66_xylink_videoplatform_url_1",
        type: 1,
        commandments:"小鱼易连云视讯管理平台: 请求小鱼易连RSA公钥接口",
        ruleposition: 1,
        rulecontent: /\/console\/rsa\/publicKey\?securityKey\=$/im
    },
    {
        rulename: "f67_apache_tomcat_responseheader_1",
        type: 1,
        commandments:"Tomcat: 响应头Server字段带有Tomcat特征",
        ruleposition: 4,
        rulecontent: {"name":"Server","value":/^Apache\-Coyote/im }
    },
    {
        rulename: "f58_microsoft_iis_responseheader_1",
        type: 1,
        commandments:"IIS: 响应头Server字段带有IIS特征",
        ruleposition: 4,
        rulecontent: {"name":"Server","value":/^Microsoft\-IIS/im }
    },
    {
        rulename: "f59_wildfly_jboss_responseheader_1",
        type: 1,
        commandments:"Jboss: 响应头X-Powered-By字段带有Jboss特征",
        ruleposition: 4,
        rulecontent: {"name":"X-Powered-By","value":/JBossWeb\-/im }
    },
    {
        rulename: "f60_eclipse_jetty_responseheader_1",
        type: 1,
        commandments:"Jetty: 响应头Server字段带有Jetty特征",
        ruleposition: 4,
        rulecontent: {"name":"Server","value":/^Jetty/im }
    },
    {
        rulename: "f61_ibm_websphere_responseheader_1",
        type: 1,
        commandments:"IBM WebSphere: 响应头检测到Server特征",
        ruleposition: 4,
        rulecontent: {"name":"Server","value":/^WebSphere /im }
    },
    {
        rulename: "f62_oracle_weblogic_responseheader_1",
        type: 1,
        commandments:"Weblogic: 响应头Server字段带有Weblogic特征",
        ruleposition: 4,
        rulecontent: {"name":"Server","value":/^WebLogic/im }
    },
    {
        rulename: "f63_oracle_weblogic_responseheader_2",
        type: 1,
        commandments:"Weblogic: 响应头检测到X-Powered-By特征",
        ruleposition: 4,
        rulecontent: {"name":"X-Powered-By","value":/^Servlet\/\d\.\d JSP\/\d\.\d$/im }
    },
    {
        rulename: "f64_thinkphp_cms_responseheader_1",
        type: 1,
        commandments:"ThinkPHP: 响应头检测到X-Powered-By特征",
        ruleposition: 4,
        rulecontent: {"name":"X-Powered-By","value":/^ThinkPHP$/im }
    },
    {
        rulename: "f65_thinkphp_cms_responsebody_2",
        type: 2,
        commandments:"ThinkPHP: 响应体包含ThinkPHP v3报错banner特征",
        ruleposition: 5,
        rulecontent: /\{ Fast \& Simple OOP PHP Framework \} \-\- \[ WE CAN DO IT JUST THINK \]/im
    },
    {
        rulename: "f66_thinkphp_cms_responsebody_3",
        type: 2,
        commandments:"ThinkPHP: 响应体包含ThinkPHP v5报错banner特征",
        ruleposition: 5,
        rulecontent: /十年磨一剑 \- 为API开发设计的高性能框架/im
    },
    {
        rulename: "f67_showdoc_doc_url_1",
        type: 1,
        commandments:"ShowDoc协同文档: 加载特征JS资源",
        ruleposition: 1,
        rulecontent: /\/static\/editor.md\/lib\/sequence\-diagram\.min\.js/im
    },
    {
        rulename: "f68_laravel_cms_responsecookie_1",
        type: 1,
        commandments:"Laravel: 响应头包含Cookie特征",
        ruleposition: 4,
        rulecontent: {"name":"Set-Cookie","value":/laravel\_session/im }
    },
    {
        rulename: "f69_kindeditor_kindeditor_url_1",
        type: 2,
        commandments:"KindEditor: Url检测到关键字[kindeditor]",
        ruleposition: 1,
        rulecontent: /kindeditor/im
    },
    {
        rulename: "f70_kindeditor_kindeditor_url_2",
        type: 1,
        commandments:"KindEditor: 加载配置文件kindeditor-all-min.js",
        ruleposition: 1,
        rulecontent: /kindeditor\-all\-min\.js/im
    },
    {
        rulename: "f71_kindeditor_kindeditor_url_3",
        type: 1,
        commandments:"KindEditor: 加载配置文件kindeditor-min.js",
        ruleposition: 1,
        rulecontent: /kindeditor\-min\.js/im
    },
    {
        rulename: "f72_fckeditor_fckeditor_url_1",
        type: 2,
        commandments:"FCKeditor: Url检测到关键字[fckeditor]",
        ruleposition: 1,
        rulecontent: /fckeditor/im
    },
    {
        rulename: "f73_fckeditor_fckeditor_url_2",
        type: 1,
        commandments:"FCKeditor: 加载特征CSS资源",
        ruleposition: 1,
        rulecontent: /\/fckeditor\.css\?/im
    },
    {
        rulename: "f74_ewebeditor_ewebeditor_url_1",
        type: 2,
        commandments:"eWebeditor: Url检测到关键字[ewebeditor]",
        ruleposition: 1,
        rulecontent: /ewebeditor/im
    },
    {
        rulename: "f75_ewebeditor_ewebeditor_url_2",
        type: 1,
        commandments:"eWebeditor: 加载配置文件ewebeditor.js",
        ruleposition: 1,
        rulecontent: /ewebeditor\.js/im
    },
    {
        rulename: "f76_jeesite_cms_url_1",
        type: 1,
        commandments:"JeeSite快速开发平台: 加载特征JS资源",
        ruleposition: 1,
        rulecontent: /\/static\/tongji\/plugins\/UrlChangeTracker\.js/im
    },
    {
        rulename: "f77_hikvision_ipcamera_url_1",
        type: 1,
        commandments:"Hikvision网络摄像头: 加载firmware 5.0静态资源",
        ruleposition: 1,
        rulecontent: /\/doc\/script\/config\/system\/channelDigital\.js\?version\=/im
    },
    {
        rulename: "f78_hikvision_ipcamera_url_2",
        type: 1,
        commandments:"Hikvision网络摄像头: 加载firmware静态资源",
        ruleposition: 1,
        rulecontent: /\/doc\/script\/jquery\.cookie\.js/im
    },
    {
        rulename: "f79_hikvision_isecurecenter_url_1",
        type: 1,
        commandments:"Hikvision安防管理平台: 发起特征授权检查请求",
        ruleposition: 1,
        rulecontent: /\/portal\/login\/ajax\/licenseExpire\.do/im
    },
    {
        rulename: "f80_hikvision_isecurecenter_url_2",
        type: 1,
        commandments:"Hikvision安防管理平台: 加载特征国际化json文件",
        ruleposition: 1,
        rulecontent: /\/portal\/ui\/static\/i18n\/\w{5}\/index\.json/im
    },
    {
        rulename: "f81_hikvision_isecurecenter_url_3",
        type: 1,
        commandments:"Hikvision安防管理平台: 加载特征CSS资源",
        ruleposition: 1,
        rulecontent: /\/portal\/ui\/static\/skin\/redblack\/skin\.css/im
    },
    {
        rulename: "f82_hikvision_isecurecenter_url_4",
        type: 1,
        commandments:"Hikvision安防管理平台(国外版): 加载特征JSON文件",
        ruleposition: 1,
        rulecontent: /\/Common\/i18n\/en\/msg.json\?\d/im
    },
    {
        rulename: "f83_hikvision_videomanager_url_1",
        type: 1,
        commandments:"Hikvision图像综合应用平台: 加载特征国际化配置文件",
        ruleposition: 1,
        rulecontent: /\/cas\/static\/comp\/i18n\/package\.properties\?\_\=\d/im
    },
    {
        rulename: "f84_dedecms_cms_url_1",
        type: 1,
        commandments:"织梦DedeCMS: 加载特征静态资源目录",
        ruleposition: 1,
        rulecontent: /\/uploads\/allimg\//im
    },
    {
        rulename: "f85_dedecms_cms_url_2",
        type: 2,
        commandments:"织梦DedeCMS: Url检测到关键字[dedecms]",
        ruleposition: 1,
        rulecontent: /dedecms/im
    },
    {
        rulename: "f86_dedecms_cms_url_3",
        type: 1,
        commandments:"织梦DedeCMS: 加载特征JS资源",
        ruleposition: 1,
        rulecontent: /\/include\/dedeajax2\.js/im
    },
    {
        rulename: "f87_dedecms_cms_url_4",
        type: 1,
        commandments:"织梦DedeCMS: 加载特征图片目录（高检出规则可能误报）",
        ruleposition: 1,
        rulecontent: /\/templets\/\w+?\/images\/\w+?\.(jpg|png|ico)$/im
    },
    {
        rulename: "f88_atlassian_jira_url_1",
        type: 1,
        commandments:"Jira项目管理系统: 加载特征CSS资源",
        ruleposition: 1,
        rulecontent: /jira\.webresources/im
    },
    {
        rulename: "f89_atlassian_confluence_url_1",
        type: 2,
        commandments:"Confluence企业Wiki: URL检测到关键字[confluence]",
        ruleposition: 1,
        rulecontent: /confluence/im
    },
    {
        rulename: "f90_atlassian_confluence_url_2",
        type: 1,
        commandments:"Confluence企业Wiki: 加载特征静态资源目录",
        ruleposition: 1,
        rulecontent: /com\.atlassian\.confluence/im
    },
    {
        rulename: "f91_java_web_responsecookie_1",
        type: 2,
        commandments:"Java Web: 响应头包含Cookie特征[jsessionid]",
        ruleposition: 4,
        rulecontent: {"name":"Set-Cookie","value":/JSESSIONID/im }
    },
    {
        rulename: "f92_webber_boda_url_1",
        type: 1,
        commandments:"博达站群: 加载特征JS资源",
        ruleposition: 1,
        rulecontent: /\/\_sitegray\/\_sitegray\.js/im
    },
    {
        rulename: "f93_alibaba_dubbo_responseheader_1",
        type: 2,
        commandments:"Dubbo RPC框架: 响应头包含WWW-Authenticate特征",
        ruleposition: 4,
        rulecontent: {"name":"WWW-Authenticate","value":/Basic realm\=\"dubbo\"/im }
    },
    {
        rulename: "f94_oray_sunlogin_responsebody_1",
        type: 1,
        commandments:"向日葵客户端: 响应体为认证端口开启的回显特征",
        ruleposition: 5,
        rulecontent: /\{\"success\"\:false\,\"msg\"\:\"Verification failure\"\}/im
    },
    {
        rulename: "f95_baota_waf_url_1",
        type: 1,
        commandments:"宝塔面板Waf: 响应体包含特征响应内容",
        ruleposition: 5,
        rulecontent: /\<p class\=\"t1\"\>您的请求带有不合法参数，已被网站管理员设置拦截！\<\/p\>/im
    },
    {
        rulename: "f96_baota_login_url_1",
        type: 1,
        commandments:"宝塔面板: Url加载特征图片资源",
        ruleposition: 1,
        rulecontent: /app\.bt\.cn\/static\/app\.png/im
    },
    {
        rulename: "f97_metinfo_cms_url_1",
        type: 1,
        commandments:"米拓metinfo CMS: 加载特征CSS文件",
        ruleposition: 1,
        rulecontent: /\/metinfo\.css/im
    },
    {
        rulename: "f98_teleport_operationmanager_url_1",
        type: 1,
        commandments:"Teleport 堡垒机: 加载特征Logo资源",
        ruleposition: 1,
        rulecontent: /\/static\/img\/site\-logo\.png\?v\=/im
    },
    {
        rulename: "f99_qzsec_operationmanager_url_1",
        type: 1,
        commandments:"齐治堡垒机: 加载特征Logo资源",
        ruleposition: 1,
        rulecontent: /\/resources\/themes\/images\/logo\-login\.png$/im
    },
    {
        rulename: "f100_pldsec_operationmanager_url_1",
        type: 1,
        commandments:"帕拉迪堡垒机: 加载特征CSS资源",
        ruleposition: 1,
        rulecontent: /\/module\/image\/pldsec\.css$/im
    },
    {
        rulename: "f101_h3c_operationmanager_url_1",
        type: 1,
        commandments:"H3C堡垒机: 发起特征配置获取请求",
        ruleposition: 1,
        rulecontent: /\/webui\/resources\/sysManager$/im
    },
    {
        rulename: "f102_nsfocus_firewall_responseheader_1",
        type: 1,
        commandments:"绿盟防火墙: 响应头Server字段包含NsFocus特征",
        ruleposition: 4,
        rulecontent: {"name":"Server","value":/nsfocus/im }
    },
    {
        rulename: "f103_safedog_waf_responseheader_1",
        type: 1,
        commandments:"安全狗WAF: 响应头Server字段包含SafeDog特征",
        ruleposition: 4,
        rulecontent: {"name":"Server","value":/^safedog/im }
    },






















    // =========================================================================
    // 蜜罐类特征
    // 数量 151 
    // 可检测特征
    // 敏感域名请求(jsonp)、蜜罐资源特征、网站流量分析与跟踪请求、敏感关键词、敏感脚本调用
    // =========================================================================

    {
        rulename: "h1_cnrstar_domain_url_1",
        type: 4,
        commandments:"敏感域名请求: ITPUB技术论坛",
        ruleposition: 1,
        rulecontent: /itpub.net/im
    },
    {
        rulename: "h2_cnrstar_domain_url_2",
        type: 4,
        commandments:"敏感域名请求: 携程旅行",
        ruleposition: 1,
        rulecontent: /ctrip.com/im
    },
    {
        rulename: "h3_cnrstar_domain_url_3",
        type: 4,
        commandments:"敏感域名请求: 携程旅行接口",
        ruleposition: 1,
        rulecontent: /c-ctrip.com/im
    },
    {
        rulename: "h4_cnrstar_domain_url_4",
        type: 4,
        commandments:"敏感域名请求: 千图网",
        ruleposition: 1,
        rulecontent: /58pic.com/im
    },
    {
        rulename: "h5_cnrstar_domain_url_5",
        type: 4,
        commandments:"敏感域名请求: CSDN",
        ruleposition: 1,
        rulecontent: /csdn.net/im
    },
    {
        rulename: "h6_cnrstar_domain_url_6",
        type: 4,
        commandments:"敏感域名请求: IP.sb接口",
        ruleposition: 1,
        rulecontent: /api.ip.sb/im
    },
    {
        rulename: "h7_cnrstar_domain_url_7",
        type: 4,
        commandments:"敏感域名请求: 聚力PPTV网络电视",
        ruleposition: 1,
        rulecontent: /pptv.com/im
    },
    {
        rulename: "h8_cnrstar_domain_url_8",
        type: 4,
        commandments:"敏感域名请求: 直播吧",
        ruleposition: 1,
        rulecontent: /zhibo8.cc/im
    },
    {
        rulename: "h9_cnrstar_domain_url_9",
        type: 4,
        commandments:"敏感域名请求: bit.ly短链接服务",
        ruleposition: 1,
        rulecontent: /bit.ly/im
    },
    {
        rulename: "h10_cnrstar_domain_url_10",
        type: 4,
        commandments:"敏感域名请求: 腾讯NOW直播平台",
        ruleposition: 1,
        rulecontent: /now.qq.com/im
    },
    {
        rulename: "h11_cnrstar_domain_url_11",
        type: 4,
        commandments:"敏感域名请求: 腾讯QQ接口1-c.v.qq.com",
        ruleposition: 1,
        rulecontent: /c.v.qq.com/im
    },
    {
        rulename: "h12_cnrstar_domain_url_12",
        type: 4,
        commandments:"敏感域名请求: 腾讯QQ接口2-node.video.qq.com",
        ruleposition: 1,
        rulecontent: /node.video.qq.com/im
    },
    {
        rulename: "h13_cnrstar_domain_url_13",
        type: 4,
        commandments:"敏感域名请求: ChinaUnix IT技术博客",
        ruleposition: 1,
        rulecontent: /chinaunix.net/im
    },
    {
        rulename: "h14_cnrstar_domain_url_14",
        type: 4,
        commandments:"敏感域名请求: 优酷接口1-cmstool.youku.com",
        ruleposition: 1,
        rulecontent: /cmstool.youku.com/im
    },
    {
        rulename: "h15_cnrstar_domain_url_15",
        type: 4,
        commandments:"敏感域名请求: 优酷接口2-hudong.vip.youku.com",
        ruleposition: 1,
        rulecontent: /hudong.vip.youku.com/im
    },
    {
        rulename: "h16_cnrstar_domain_url_16",
        type: 4,
        commandments:"敏感域名请求: 网易跟帖",
        ruleposition: 1,
        rulecontent: /tie.163.com/im
    },
    {
        rulename: "h17_cnrstar_domain_url_17",
        type: 4,
        commandments:"敏感域名请求: 网易163接口1-comment.api.163.com",
        ruleposition: 1,
        rulecontent: /comment.api.163.com/im
    },
    {
        rulename: "h18_cnrstar_domain_url_18",
        type: 4,
        commandments:"敏感域名请求: 网易163接口2-comment.money.163.com",
        ruleposition: 1,
        rulecontent: /comment.money.163.com/im
    },
    {
        rulename: "h19_cnrstar_domain_url_19",
        type: 4,
        commandments:"敏感域名请求: 当当网",
        ruleposition: 1,
        rulecontent: /dangdang.com/im
    },
    {
        rulename: "h20_cnrstar_domain_url_20",
        type: 4,
        commandments:"敏感域名请求: UC浏览器",
        ruleposition: 1,
        rulecontent: /down2.uc.cn/im
    },
    {
        rulename: "h21_cnrstar_domain_url_21",
        type: 4,
        commandments:"敏感域名请求: Github",
        ruleposition: 1,
        rulecontent: /github.com/im
    },
    {
        rulename: "h22_cnrstar_domain_url_22",
        type: 4,
        commandments:"敏感域名请求: Github接口1-mozilla.github.io",
        ruleposition: 1,
        rulecontent: /mozilla.github.io/im
    },
    {
        rulename: "h23_cnrstar_domain_url_23",
        type: 4,
        commandments:"敏感域名请求: 虎牙直播",
        ruleposition: 1,
        rulecontent: /huya.com/im
    },
    {
        rulename: "h24_cnrstar_domain_url_24",
        type: 4,
        commandments:"敏感域名请求: 51CTO接口1-home.51cto.com",
        ruleposition: 1,
        rulecontent: /home.51cto.com/im
    },
    {
        rulename: "h25_cnrstar_domain_url_25",
        type: 4,
        commandments:"敏感域名请求: 51CTO接口2-ucenter.51cto.com",
        ruleposition: 1,
        rulecontent: /ucenter.51cto.com/im
    },
    {
        rulename: "h26_cnrstar_domain_url_26",
        type: 4,
        commandments:"敏感域名请求: 城通网盘",
        ruleposition: 1,
        rulecontent: /ctfile.com/im
    },
    {
        rulename: "h27_cnrstar_domain_url_27",
        type: 4,
        commandments:"敏感域名请求: 金融界财经金融门户",
        ruleposition: 1,
        rulecontent: /jrj.com.cn/im
    },
    {
        rulename: "h28_cnrstar_domain_url_28",
        type: 4,
        commandments:"敏感域名请求: 新浪爱问知识人问答平台",
        ruleposition: 1,
        rulecontent: /iask.sina.com.cn/im
    },
    {
        rulename: "h29_cnrstar_domain_url_29",
        type: 4,
        commandments:"敏感域名请求: 新浪接口1-ka.sina.com.cn",
        ruleposition: 1,
        rulecontent: /ka.sina.com.cn/im
    },
    {
        rulename: "h30_cnrstar_domain_url_30",
        type: 4,
        commandments:"敏感域名请求: 新浪接口2-新浪用户接口",
        ruleposition: 1,
        rulecontent: /login.sina.com.cn/im
    },
    {
        rulename: "h31_cnrstar_domain_url_31",
        type: 4,
        commandments:"敏感域名请求: 苹果itunes接口",
        ruleposition: 1,
        rulecontent: /itunes.apple.com/im
    },
    {
        rulename: "h32_cnrstar_domain_url_32",
        type: 4,
        commandments:"敏感域名请求: 新浪微博接口1-m.game.weibo.cn",
        ruleposition: 1,
        rulecontent: /m.game.weibo.cn/im
    },
    {
        rulename: "h33_cnrstar_domain_url_33",
        type: 4,
        commandments:"敏感域名请求: 新浪微博接口2-i.qr.weibo.cn",
        ruleposition: 1,
        rulecontent: /i.qr.weibo.cn/im
    },
    {
        rulename: "h34_cnrstar_domain_url_34",
        type: 4,
        commandments:"敏感域名请求: 新浪微博",
        ruleposition: 1,
        rulecontent: /weibo.com/im
    },
    {
        rulename: "h35_cnrstar_domain_url_35",
        type: 4,
        commandments:"敏感域名请求: ZOL中关村在线",
        ruleposition: 1,
        rulecontent: /my.zol.com.cn/im
    },
    {
        rulename: "h36_cnrstar_domain_url_36",
        type: 4,
        commandments:"敏感域名请求: 人人网",
        ruleposition: 1,
        rulecontent: /renren.com/im
    },
    {
        rulename: "h37_cnrstar_domain_url_37",
        type: 4,
        commandments:"敏感域名请求: 爱奇艺",
        ruleposition: 1,
        rulecontent: /iqiyi.com/im
    },
    {
        rulename: "h38_cnrstar_domain_url_38",
        type: 4,
        commandments:"敏感域名请求: 爱奇艺接口1-stc.iqiyipic.com",
        ruleposition: 1,
        rulecontent: /stc.iqiyipic.com/im
    },
    {
        rulename: "h39_cnrstar_domain_url_39",
        type: 4,
        commandments:"敏感域名请求: 芒果TV",
        ruleposition: 1,
        rulecontent: /playbill.api.mgtv.com/im
    },
    {
        rulename: "h40_cnrstar_domain_url_40",
        type: 4,
        commandments:"敏感域名请求: skylink即时通讯和视频聊天",
        ruleposition: 1,
        rulecontent: /skylink.io/im
    },
    {
        rulename: "h41_cnrstar_domain_url_41",
        type: 4,
        commandments:"敏感域名请求: 飞卢小说接口1-s.faloo.com",
        ruleposition: 1,
        rulecontent: /s.faloo.com/im
    },
    {
        rulename: "h42_cnrstar_domain_url_42",
        type: 4,
        commandments:"敏感域名请求: 飞卢小说接口2-u.faloo.com",
        ruleposition: 1,
        rulecontent: /u.faloo.com/im
    },
    {
        rulename: "h43_cnrstar_domain_url_43",
        type: 4,
        commandments:"敏感域名请求: 搜狐网",
        ruleposition: 1,
        rulecontent: /v2.sohu.com/im
    },
    {
        rulename: "h44_cnrstar_domain_url_44",
        type: 4,
        commandments:"敏感域名请求: 搜狐号",
        ruleposition: 1,
        rulecontent: /uis.i.sohu.com/im
    },
    {
        rulename: "h45_cnrstar_domain_url_45",
        type: 4,
        commandments:"敏感域名请求: 搜狗搜索",
        ruleposition: 1,
        rulecontent: /wap.sogou.com/im
    },
    {
        rulename: "h46_cnrstar_domain_url_46",
        type: 4,
        commandments:"敏感域名请求: ITeye软件开发交流社区",
        ruleposition: 1,
        rulecontent: /www.iteye.com/im
    },
    {
        rulename: "h47_cnrstar_domain_url_47",
        type: 4,
        commandments:"敏感域名请求: 猪八戒网外包平台",
        ruleposition: 1,
        rulecontent: /www.zbj.com/im
    },
    {
        rulename: "h48_cnrstar_domain_url_48",
        type: 4,
        commandments:"敏感域名请求: 美橙互联：域名注册、VPS、企业网站服务",
        ruleposition: 1,
        rulecontent: /cndns.com/im
    },
    {
        rulename: "h49_cnrstar_domain_url_49",
        type: 4,
        commandments:"敏感域名请求: 美橙互联：建站之星",
        ruleposition: 1,
        rulecontent: /sitestar.cn/im
    },
    {
        rulename: "h50_cnrstar_domain_url_50",
        type: 4,
        commandments:"敏感域名请求: FastAdmin后台开发框架官网接口",
        ruleposition: 1,
        rulecontent: /api.fastadmin.net/im
    },
    {
        rulename: "h51_cnrstar_domain_url_51",
        type: 4,
        commandments:"敏感域名请求: 百度接口1-m.site.baidu.com",
        ruleposition: 1,
        rulecontent: /m.site.baidu.com/im
    },
    {
        rulename: "h52_cnrstar_domain_url_52",
        type: 4,
        commandments:"敏感域名请求: 百度接口2-账号接口",
        ruleposition: 1,
        rulecontent: /passport.baidu.com/im
    },
    {
        rulename: "h53_cnrstar_domain_url_53",
        type: 4,
        commandments:"敏感域名请求: 百度接口3-wappassalltest.baidu.com",
        ruleposition: 1,
        rulecontent: /wappassalltest.baidu.com/im
    },
    {
        rulename: "h54_cnrstar_domain_url_54",
        type: 4,
        commandments:"敏感域名请求: 百度百科",
        ruleposition: 1,
        rulecontent: /baike.baidu.com/im
    },
    {
        rulename: "h55_cnrstar_domain_url_55",
        type: 4,
        commandments:"敏感域名请求: 百度商桥企业营销及在线客服接口",
        ruleposition: 1,
        rulecontent: /p.qiao.baidu.com/im
    },
    {
        rulename: "h56_cnrstar_domain_url_56",
        type: 4,
        commandments:"敏感域名请求: 百度地图",
        ruleposition: 1,
        rulecontent: /map.baidu.com/im
    },
    {
        rulename: "h57_cnrstar_domain_url_57",
        type: 4,
        commandments:"敏感域名请求: 百度接口4-datax.baidu.com",
        ruleposition: 1,
        rulecontent: /datax.baidu.com/im
    },
    {
        rulename: "h58_cnrstar_domain_url_58",
        type: 4,
        commandments:"敏感域名请求: 百度贴吧",
        ruleposition: 1,
        rulecontent: /tieba.baidu.com/im
    },
    {
        rulename: "h59_cnrstar_domain_url_59",
        type: 4,
        commandments:"敏感域名请求: 百度支付：度小满钱包",
        ruleposition: 1,
        rulecontent: /zhifu.baidu.com/im
    },
    {
        rulename: "h60_cnrstar_domain_url_60",
        type: 4,
        commandments:"敏感域名请求: 高德地图RESTful接口",
        ruleposition: 1,
        rulecontent: /restapi.amap.com/im
    },
    {
        rulename: "h61_cnrstar_domain_url_61",
        type: 4,
        commandments:"敏感域名请求: 千千静听",
        ruleposition: 1,
        rulecontent: /musicapi.taihe.com/im
    },
    {
        rulename: "h62_cnrstar_domain_url_62",
        type: 4,
        commandments:"敏感域名请求: 京东商城",
        ruleposition: 1,
        rulecontent: /api.m.jd.com/im
    },
    {
        rulename: "h63_cnrstar_domain_url_63",
        type: 4,
        commandments:"敏感域名请求: 凤凰网接口1-so.v.ifeng.com",
        ruleposition: 1,
        rulecontent: /so.v.ifeng.com/im
    },
    {
        rulename: "h64_cnrstar_domain_url_64",
        type: 4,
        commandments:"敏感域名请求: 凤凰网接口2-stadig.ifeng.com",
        ruleposition: 1,
        rulecontent: /stadig.ifeng.com/im
    },
    {
        rulename: "h65_cnrstar_domain_url_65",
        type: 4,
        commandments:"敏感域名请求: 博客园接口1-wz.cnblogs.com",
        ruleposition: 1,
        rulecontent: /wz.cnblogs.com/im
    },
    {
        rulename: "h66_cnrstar_domain_url_66",
        type: 4,
        commandments:"敏感域名请求: 博客园接口2-passport.cnblogs.com",
        ruleposition: 1,
        rulecontent: /passport.cnblogs.com/im
    },
    {
        rulename: "h67_cnrstar_domain_url_67",
        type: 4,
        commandments:"敏感域名请求: 博客园接口3-account.cnblogs.com",
        ruleposition: 1,
        rulecontent: /account.cnblogs.com/im
    },
    {
        rulename: "h68_cnrstar_domain_url_68",
        type: 4,
        commandments:"敏感域名请求: 疑似开发人员博客-mths.be",
        ruleposition: 1,
        rulecontent: /mths.be/im
    },
    {
        rulename: "h69_cnrstar_domain_url_69",
        type: 5,
        commandments:"敏感域名请求: 疑似表单验证和密码加密框架",
        ruleposition: 1,
        rulecontent: /validity.thatscaptaintoyou.com/im
    },
    {
        rulename: "h70_cnrstar_domain_url_70",
        type: 4,
        commandments:"敏感域名请求: ScorecardResearch互联网行为分析",
        ruleposition: 1,
        rulecontent: /sb.scorecardresearch.com/im
    },
    {
        rulename: "h71_cnrstar_domain_url_71",
        type: 4,
        commandments:"敏感域名请求: Growing企业级数据接口(多个社交网站使用)",
        ruleposition: 1,
        rulecontent: /assets.growingio.com/im
    },
    {
        rulename: "h72_cnrstar_domain_url_72",
        type: 4,
        commandments:"敏感域名请求: GNU操作系统",
        ruleposition: 1,
        rulecontent: /gnu.org/im
    },
    {
        rulename: "h73_cnrstar_domain_url_73",
        type: 4,
        commandments:"敏感域名请求: 阿里短链接平台接口",
        ruleposition: 1,
        rulecontent: /g.alicdn.com/im
    },
    {
        rulename: "h74_cnrstar_domain_url_74",
        type: 4,
        commandments:"敏感域名请求: 爱奇艺接口2-msg.qy.net",
        ruleposition: 1,
        rulecontent: /msg.qy.net/im
    },
    {
        rulename: "h75_cnrstar_domain_url_75",
        type: 4,
        commandments:"敏感域名请求: 电动志趣享",
        ruleposition: 1,
        rulecontent: /github.comgithub.com/im
    },
    {
        rulename: "h76_cnrstar_domain_url_76",
        type: 4,
        commandments:"敏感域名请求: 天涯论坛",
        ruleposition: 1,
        rulecontent: /tianya.cn/im
    },
    {
        rulename: "h77_cnrstar_domain_url_77",
        type: 4,
        commandments:"敏感域名请求: 猫扑网",
        ruleposition: 1,
        rulecontent: /passport.mop.com/im
    },
    {
        rulename: "h78_cnrstar_domain_url_78",
        type: 4,
        commandments:"敏感域名请求: 1616上网导航",
        ruleposition: 1,
        rulecontent: /chaxun.1616.net/im
    },
    {
        rulename: "h79_cnrstar_domain_url_79",
        type: 4,
        commandments:"敏感域名请求: 虎扑论坛",
        ruleposition: 1,
        rulecontent: /remind.hupu.com/im
    },
    {
        rulename: "h80_cnrstar_domain_url_80",
        type: 4,
        commandments:"敏感域名请求: 哔哩哔哩动画",
        ruleposition: 1,
        rulecontent: /bilibili.com/im
    },
    {
        rulename: "h81_cnrstar_domain_url_81",
        type: 4,
        commandments:"敏感域名请求: 阿里接口极有家装修平台",
        ruleposition: 1,
        rulecontent: /jiyoujia.com/im
    },
    {
        rulename: "h82_monyer_domain_url_1",
        type: 4,
        commandments:"敏感域名请求: 360天御企业安全平台",
        ruleposition: 1,
        rulecontent: /appscan.360.cn/im
    },
    {
        rulename: "h83_monyer_domain_url_2",
        type: 4,
        commandments:"敏感域名请求: 小米手机服务",
        ruleposition: 1,
        rulecontent: /m.mi.com/im
    },
    {
        rulename: "h84_monyer_domain_url_3",
        type: 4,
        commandments:"敏感域名请求: 百度支付：度小满钱包2",
        ruleposition: 1,
        rulecontent: /zhifu.duxiaoman.com/im
    },
    {
        rulename: "h85_monyer_domain_url_4",
        type: 4,
        commandments:"敏感域名请求: 小米账户",
        ruleposition: 1,
        rulecontent: /account.xiaomi.com/im
    },
    {
        rulename: "h86_monyer_domain_url_5",
        type: 4,
        commandments:"敏感域名请求: 阿里淘宝网接口1-log.mmstat.com",
        ruleposition: 1,
        rulecontent: /log.mmstat.com/im
    },
    {
        rulename: "h87_monyer_domain_url_6",
        type: 4,
        commandments:"敏感域名请求: 小米接口1-s1.mi.com",
        ruleposition: 1,
        rulecontent: /s1.mi.com/im
    },
    {
        rulename: "h88_monyer_domain_url_7",
        type: 4,
        commandments:"敏感域名请求: 阿里淘宝网接口2-fourier.taobao.com",
        ruleposition: 1,
        rulecontent: /fourier.taobao.com/im
    },
    {
        rulename: "h89_monyer_domain_url_8",
        type: 4,
        commandments:"敏感域名请求: Fingerprints设备识别",
        ruleposition: 1,
        rulecontent: /api.fpjs.io/im
    },
    {
        rulename: "h90_monyer_domain_url_9",
        type: 4,
        commandments:"敏感域名请求: Fingerprints设备识别2",
        ruleposition: 1,
        rulecontent: /api.sjpf.io/im
    },
    {
        rulename: "h91_monyer_websitestatistical_10",
        type: 5,
        commandments:"网站流量分析与跟踪请求: 百度统计",
        ruleposition: 1,
        rulecontent: /hm\.baidu\.com/im
    },
    {
        rulename: "h92_monyer_websitestatistical_11",
        type: 5,
        commandments:"网站流量分析与跟踪请求: 友盟CNZZ网站流量统计",
        ruleposition: 1,
        rulecontent: /cnzz\.com/im
    },
    {
        rulename: "h93_monyer_websitestatistical_12",
        type: 5,
        commandments:"网站流量分析与跟踪请求: 51LA网站统计与数据分析",
        ruleposition: 1,
        rulecontent: /51\.la/im
    },
    {
        rulename: "h94_monyer_websitestatistical_13",
        type: 5,
        commandments:"网站流量分析与跟踪请求: 谷歌分析统计",
        ruleposition: 1,
        rulecontent: /google\-analytics\.com/im
    },
    {
        rulename: "h95_monyer_websitestatistical_14",
        type: 5,
        commandments:"网站流量分析与跟踪请求: 谷歌访问跟踪器",
        ruleposition: 1,
        rulecontent: /googletagservices\.com/im
    },
    {
        rulename: "h96_fuckjsonp_domain_url_1",
        type: 4,
        commandments:"敏感域名请求: 腾讯视频接口",
        ruleposition: 1,
        rulecontent: /access.video.qq.com/im
    },
    {
        rulename: "h97_fuckjsonp_domain_url_2",
        type: 4,
        commandments:"敏感域名请求: 腾讯视频支付接口",
        ruleposition: 1,
        rulecontent: /pay.video.qq.com/im
    },
    {
        rulename: "h98_fuckjsonp_domain_url_3",
        type: 4,
        commandments:"敏感域名请求: 苏宁易购接口",
        ruleposition: 1,
        rulecontent: /myjr.suning.com/im
    },
    {
        rulename: "h99_fuckjsonp_domain_url_4",
        type: 4,
        commandments:"敏感域名请求: 苏宁易购登录接口",
        ruleposition: 1,
        rulecontent: /loginst.suning.com/im
    },
    {
        rulename: "h100_fuckjsonp_domain_url_5",
        type: 4,
        commandments:"敏感域名请求: 凤凰游戏域名接口",
        ruleposition: 1,
        rulecontent: /www.fhyx.com/im
    },
    {
        rulename: "h101_fuckjsonp_domain_url_6",
        type: 4,
        commandments:"敏感域名请求: 有妖气原创漫画搜索接口",
        ruleposition: 1,
        rulecontent: /so.u17.com/im
    },
    {
        rulename: "h102_fuckjsonp_domain_url_7",
        type: 4,
        commandments:"敏感域名请求: 爱学术域名接口",
        ruleposition: 1,
        rulecontent: /www.ixueshu.com/im
    },
    {
        rulename: "h103_fuckjsonp_domain_url_8",
        type: 4,
        commandments:"敏感域名请求: 豆瓣网接口",
        ruleposition: 1,
        rulecontent: /www.douban.com/im
    },
    {
        rulename: "h104_fuckjsonp_domain_url_9",
        type: 4,
        commandments:"敏感域名请求: 迅雷下载接口",
        ruleposition: 1,
        rulecontent: /yuancheng.xunlei.com/im
    },
    {
        rulename: "h105_fuckjsonp_domain_url_10",
        type: 4,
        commandments:"敏感域名请求: 百度招商接口",
        ruleposition: 1,
        rulecontent: /istats.baidu.com/im
    },
    {
        rulename: "h106_fuckjsonp_domain_url_11",
        type: 4,
        commandments:"敏感域名请求: 运营商[联通]接口",
        ruleposition: 1,
        rulecontent: /10010.com/im
    },
    {
        rulename: "h107_fuckjsonp_domain_url_12",
        type: 4,
        commandments:"敏感域名请求: 运营商[移动]接口",
        ruleposition: 1,
        rulecontent: /10086.cn/im
    },
    {
        rulename: "h108_fuckjsonp_domain_url_13",
        type: 4,
        commandments:"敏感域名请求: 运营商[电信]接口1",
        ruleposition: 1,
        rulecontent: /189.cn/im
    },
    {
        rulename: "h109_fuckjsonp_domain_url_14",
        type: 4,
        commandments:"敏感域名请求: 运营商[电信]接口2",
        ruleposition: 1,
        rulecontent: /chinatelecom.com.cn/im
    },
    {
        rulename: "h110_heimdallr_js_url_1",
        type: 5,
        commandments:"敏感关键词: 请求URL参数中存在jsonp常用关键词callback",
        ruleposition: 1,
        rulecontent: /\?.+callback\=/im
    },
    {
        rulename: "h111_heimdallr_js_url_2",
        type: 5,
        commandments:"敏感关键词: 请求URL参数中存在jsonp常用关键词eval和atob",
        ruleposition: 1,
        rulecontent: /\?.+eval\(atob/im
    },
    {
        rulename: "h112_heimdallr_js_url_3",
        type: 5,
        commandments:"敏感关键词: 请求URL参数中存在jsonp常用关键词jsonp",
        ruleposition: 1,
        rulecontent: /\?.+jsonp/im
    },
    {
        rulename: "h113_heimdallr_domain_url_4",
        type: 4,
        commandments:"敏感域名请求: 超星用户接口",
        ruleposition: 1,
        rulecontent: /passport2.chaoxing.com/im
    },
    {
        rulename: "h114_heimdallr_domain_url_5",
        type: 4,
        commandments:"敏感域名请求: 百度接口5-百度账号及设备信息接口",
        ruleposition: 1,
        rulecontent: /sofire.baidu.com/im
    },
    {
        rulename: "h115_heimdallr_domain_url_6",
        type: 4,
        commandments:"敏感域名请求: 百度接口6-百度教育接口",
        ruleposition: 1,
        rulecontent: /easylearn.baidu.com/im
    },
    {
        rulename: "h116_heimdallr_domain_url_7",
        type: 4,
        commandments:"敏感域名请求: 百度接口7-百度读书接口",
        ruleposition: 1,
        rulecontent: /yuedu.baidu.com/im
    },
    {
        rulename: "h117_heimdallr_domain_url_8",
        type: 4,
        commandments:"敏感域名请求: 58同城账号接口",
        ruleposition: 1,
        rulecontent: /employer.58.com/im
    },
    {
        rulename: "h118_heimdallr_domain_url_9",
        type: 4,
        commandments:"敏感域名请求: 腾讯QQ接口3-u.y.qq.com",
        ruleposition: 1,
        rulecontent: /u.y.qq.com/im
    },
    {
        rulename: "h119_heimdallr_domain_url_10",
        type: 4,
        commandments:"敏感域名请求: 超星慕课接口",
        ruleposition: 1,
        rulecontent: /mooc1-1.chaoxing.com/im
    },
    {
        rulename: "h120_heimdallr_domain_url_11",
        type: 4,
        commandments:"敏感域名请求: 58同城账号接口2",
        ruleposition: 1,
        rulecontent: /passport.58.com/im
    },
    {
        rulename: "h121_heimdallr_domain_url_12",
        type: 4,
        commandments:"敏感域名请求: 优酷接口3-download.youku.com",
        ruleposition: 1,
        rulecontent: /download.youku.com/im
    },
    {
        rulename: "h122_heimdallr_domain_url_13",
        type: 4,
        commandments:"敏感域名请求: 新浪爱问知识人接口2",
        ruleposition: 1,
        rulecontent: /static.iask.cn/im
    },
    {
        rulename: "h123_heimdallr_domain_url_14",
        type: 4,
        commandments:"敏感域名请求: 苏宁易购账号接口",
        ruleposition: 1,
        rulecontent: /passport.suning.com/im
    },
    {
        rulename: "h124_heimdallr_domain_url_15",
        type: 4,
        commandments:"敏感域名请求: 百度接口8-百度资源服务器接口",
        ruleposition: 1,
        rulecontent: /sofire.bdstatic.com/im
    },
    {
        rulename: "h125_heimdallr_domain_url_16",
        type: 4,
        commandments:"敏感域名请求: 百度接口9-百度网盟推广接口",
        ruleposition: 1,
        rulecontent: /cbjs.baidu.com/im
    },
    {
        rulename: "h126_heimdallr_domain_url_17",
        type: 4,
        commandments:"敏感域名请求: 新浪爱问知识人接口3",
        ruleposition: 1,
        rulecontent: /static3.iask.cn/im
    },
    {
        rulename: "h127_heimdallr_domain_url_18",
        type: 4,
        commandments:"敏感域名请求: 百度接口10-百度系移动端接口",
        ruleposition: 1,
        rulecontent: /sfp.safe.baidu.com/im
    },
    {
        rulename: "h128_heimdallr_domain_url_19",
        type: 4,
        commandments:"敏感域名请求: 新浪爱问知识人接口4-IP及归属地信息接口",
        ruleposition: 1,
        rulecontent: /ipip.iask.cn/im
    },
    {
        rulename: "h129_heimdallr_js_url_20",
        type: 3,
        commandments:"蜜罐资源特征: 加载HFish特征资源[w-logo-blue.png]",
        ruleposition: 1,
        rulecontent: /w\-logo\-blue\.png\?ver/im
    },
    {
        rulename: "h130_heimdallr_domain_url_21",
        type: 4,
        commandments:"敏感域名请求: 百度接口11-百度hao123接口",
        ruleposition: 1,
        rulecontent: /wapsite.baidu.com/im
    },
    {
        rulename: "h131_heimdallr_js_url_22",
        type: 3,
        commandments:"敏感脚本调用: 加载特征识别脚本[fingerprint.js]",
        ruleposition: 1,
        rulecontent: /fingerprint2\.min\.js/im
    },
    {
        rulename: "h132_heimdallr_js_url_23",
        type: 5,
        commandments:"敏感脚本调用: Url检测到敏感脚本关键字[fingerprintjs]",
        ruleposition: 1,
        rulecontent: /fingerprintjs/im
    },
    {
        rulename: "h133_heimdallr_js_url_24",
        type: 3,
        commandments:"敏感脚本调用: 加载蜜罐热点溯源jsonp脚本",
        ruleposition: 1,
        rulecontent: /monitordevinfo\/common\.js/im
    },
    {
        rulename: "h134_heimdallr_domain_url_25",
        type: 4,
        commandments:"敏感域名请求: 访问蜜罐子框架请求域名hackit.me",
        ruleposition: 1,
        rulecontent: /hackit.me/im
    },
    {
        rulename: "h135_heimdallr_domain_url_26",
        type: 4,
        commandments:"敏感域名请求: 访问蜜罐JS脚本资源域名sloss.xyz",
        ruleposition: 1,
        rulecontent: /sloss.xyz/im
    },
    {
        rulename: "h136_heimdallr_domain_url_27",
        type: 3,
        commandments:"敏感域名请求: 网站请求Burpsuite自带浏览器静态资源特征",
        ruleposition: 1,
        rulecontent: /burp/im
    },
    {
        rulename: "h137_heimdallr_domain_url_28",
        type: 4,
        commandments:"敏感域名请求: 移动认证接口-可用于热点溯源手机号",
        ruleposition: 1,
        rulecontent: /cmpassport.com/im
    },
    {
        rulename: "h138_heimdallr_domain_url_29",
        type: 4,
        commandments:"敏感域名请求: 电信天翼认证接口-可用于热点溯源手机号",
        ruleposition: 1,
        rulecontent: /id6.me/im
    },
    {
        rulename: "h139_heimdallr_domain_url_30",
        type: 4,
        commandments:"敏感域名请求: 电信认证接口2-可用于热点溯源手机号",
        ruleposition: 1,
        rulecontent: /open.e.189.cn/im
    },
    {
        rulename: "h140_heimdallr_domain_url_31",
        type: 4,
        commandments:"敏感域名请求: 联通认证接口-可用于热点溯源手机号",
        ruleposition: 1,
        rulecontent: /wostore.cn/im
    },
    {
        rulename: "h141_heimdallr_domain_url_32",
        type: 4,
        commandments:"敏感域名请求: 联通开发者平台接口-可用于热点溯源手机号",
        ruleposition: 1,
        rulecontent: /mdn.open.wo.cn/im
    },
    {
        rulename: "h142_heimdallr_domain_url_33",
        type: 4,
        commandments:"敏感域名请求: 联通认证接口2-可用于热点溯源手机号",
        ruleposition: 1,
        rulecontent: /enrichgw.10010.com/im
    },
    {
        rulename: "h143_heimdallr_domain_url_34",
        type: 4,
        commandments:"敏感域名请求: 联通认证接口3-可用于热点溯源手机号",
        ruleposition: 1,
        rulecontent: /auth.wosms.cn/im
    },
    {
        rulename: "h144_heimdallr_domain_url_35",
        type: 4,
        commandments:"敏感域名请求: 联通认证接口4-可用于热点溯源手机号",
        ruleposition: 1,
        rulecontent: /id.mail.wo.cn/im
    },
    {
        rulename: "h145_heimdallr_domain_url_36",
        type: 4,
        commandments:"敏感域名请求: 联通认证接口5-可用于热点溯源手机号",
        ruleposition: 1,
        rulecontent: /hmrz.wo.cn/im
    },
    {
        rulename: "h146_heimdallr_domain_url_37",
        type: 4,
        commandments:"敏感域名请求: 联通认证接口6-可用于热点溯源手机号",
        ruleposition: 1,
        rulecontent: /nisportal.10010.com/im
    },
    {
        rulename: "h147_heimdallr_domain_url_38",
        type: 4,
        commandments:"敏感域名请求: 联通认证接口7-可用于热点溯源手机号",
        ruleposition: 1,
        rulecontent: /nishub1.10010.com/im
    },
    {
        rulename: "h148_heimdallr_domain_url_39",
        type: 4,
        commandments:"敏感域名请求: 中卓信移动认证接口-可用于热点溯源手机号",
        ruleposition: 1,
        rulecontent: /zzx9.cn/im
    },
    {
        rulename: "h149_heimdallr_domain_url_40",
        type: 4,
        commandments:"敏感域名请求: 阿里淘宝网接口3-淘宝官网接口",
        ruleposition: 1,
        rulecontent: /www.taobao.com/im
    },
    {
        rulename: "h150_heimdallr_domain_url_41",
        type: 4,
        commandments:"敏感域名请求: 起点中文网",
        ruleposition: 1,
        rulecontent: /qidian.com/im
    },
    {
        rulename: "h151_heimdallr_domain_url_42",
        type: 4,
        commandments:"敏感域名请求: YY直播",
        ruleposition: 1,
        rulecontent: /yy.com/im
    },
    {
        rulename: "h152_heimdallr_domain_url_43",
        type: 4,
        commandments:"敏感域名请求: 新浪接口3-mix.sina.com.cn",
        ruleposition: 1,
        rulecontent: /mix.sina.com.cn/im
    },











]






//=================================================================================================
//=================================================================================================
//=================================================================================================




// 插件读取的规则列表
var HPrinter = null

// 插件拦截的蜜罐jsonp类请求规则
var HBlockingDomainRules = null


function initPrinter(){
    HPrinter = {"position1" : [], "position2" : [], "position3" : [], "position4" : [], "position5" : []}

    HBlockingDomainRules = []

    let tmpIndex = 1

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

        if (i.type == 4) {
            let tmpDomain = ("" + i.rulecontent).split('/')[1]
            if (tmpDomain != null && tmpDomain.search(/\S*?\.\S*?/im) == 0) {
                let tmpBlockingRule = {}
                tmpBlockingRule.id = tmpIndex
                tmpBlockingRule.priority = 1
                tmpBlockingRule.action = { "type": "block" },
                tmpBlockingRule.condition = {"requestDomains" : [tmpDomain], "resourceTypes" : ["main_frame", "sub_frame", "stylesheet", "script", "image", "font", "object", "xmlhttprequest", "ping", "csp_report", "media", "websocket", "webtransport", "webbundle", "other"]}
                HBlockingDomainRules.push(tmpBlockingRule)
                tmpIndex++
            }
        } else if (i.type == 3) {
            let tmpDomain = ("" + i.rulecontent).split('/')[1].replace(/\\/g,"")
            if (tmpDomain != null && tmpDomain != "") {
                let tmpBlockingRule = {}
                tmpBlockingRule.id = tmpIndex
                tmpBlockingRule.priority = 1
                tmpBlockingRule.action = { "type": "block" },
                tmpBlockingRule.condition = {"urlFilter" : tmpDomain, "resourceTypes" : ["main_frame", "sub_frame", "stylesheet", "script", "image", "font", "object", "xmlhttprequest", "ping", "csp_report", "media", "websocket", "webtransport", "webbundle", "other"]}
                HBlockingDomainRules.push(tmpBlockingRule)
                tmpIndex++
            }
        }
    }
}

initPrinter()