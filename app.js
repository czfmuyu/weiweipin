//var push = require("shuotupu");

App({
    onLaunch: function() {},
    onShow: function() {},
    onHide: function() {
        console.log(getCurrentPages());
    },
    onError: function(e) {
        console.log(e);
    },
    getUser: function(s) {
        var c = this;
        wx.login({
            success: function(e) {
                var t = e.code;
                wx.setStorageSync("code", t), wx.getUserInfo({
                    success: function(e) {
                        console.log(e), wx.setStorageSync("user_info", e.userInfo);
                        var n = e.userInfo.nickName, o = e.userInfo.avatarUrl;
                        c.util.request({
                            url: "entry/wxapp/openid",
                            cachetime: "0",
                            data: {
                                code: t
                            },
                            success: function(e) {
                                console.log(e), wx.setStorageSync("key", e.data.session_key), wx.setStorageSync("openid", e.data.openid);
                                var t = e.data.openid;
                                c.util.request({
                                    url: "entry/wxapp/Login",
                                    cachetime: "0",
                                    data: {
                                        openid: t,
                                        img: o,
                                        name: n
                                    },
                                    success: function(e) {
                                        console.log(e), wx.setStorageSync("users", e.data), wx.setStorageSync("uniacid", e.data.uniacid), 
                                        s(e.data);
                                    }
                                });
                            }
                        });
                    },
                    fail: function(e) {
                        wx.getSetting({
                            success: function(e) {
                                0 == e.authSetting["scope.userInfo"] && wx.openSetting({
                                    success: function(e) {
                                        e.authSetting["scope.userInfo"], c.getUser(s);
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    },
    ormatDate: function(e) {
        var t = new Date(1e3 * e);
        return t.getFullYear() + "-" + n(t.getMonth() + 1, 2) + "-" + n(t.getDate(), 2) + " " + n(t.getHours(), 2) + ":" + n(t.getMinutes(), 2) + ":" + n(t.getSeconds(), 2);
        function n(e, t) {
            for (var n = "" + e, o = n.length, s = "", c = t; c-- > o; ) s += "0";
            return s + n;
        }
    },
    ab: function(e) {},
    util: require("we7/resource/js/util.js"),
    siteInfo: require("siteinfo.js"),
    tabBar: {
        color: "#123",
        selectedColor: "#1ba9ba",
        borderStyle: "#1ba9ba",
        backgroundColor: "#fff",
        list: [ {
            pagePath: "/we7/pages/index/index",
            iconPath: "/we7/resource/icon/home.png",
            selectedIconPath: "/we7/resource/icon/homeselect.png",
            text: "首页"
        }, {
            pagePath: "/we7/pages/user/index/index",
            iconPath: "/we7/resource/icon/user.png",
            selectedIconPath: "/we7/resource/icon/userselect.png",
            text: "微擎我的"
        } ]
    },
    globalData: {
        userInfo: null
    }
});