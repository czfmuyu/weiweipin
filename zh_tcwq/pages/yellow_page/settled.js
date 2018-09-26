var app = getApp(), util = require("../../utils/util.js"), imgArray = [], imgArray1 = [], lbimgArray = [], lbimgArray1 = [], imglogo = "";

Page({
    data: {
        index: 0,
        zsnum: 0,
        lbimages1: [],
        images1: [],
        logo: []
    },
    onLoad: function(e) {
        imgArray = [], imgArray1 = [], lbimgArray = [], lbimgArray1 = [];
        var o = wx.getStorageSync("System").is_tel, a = wx.getStorageSync("users").id;
        app.util.request({
            url: "entry/wxapp/GetUserInfo",
            cachetime: "0",
            data: {
                user_id: a
            },
            success: function(e) {
                2 == e.data.state && wx.showModal({
                    title: "提示",
                    content: "您的账号异常，请尽快联系管理员",
                    showCancel: !0,
                    cancelText: "取消",
                    confirmText: "确定",
                    success: function(e) {
                        wx.navigateBack({
                            delta: 1
                        });
                    },
                    fail: function(e) {},
                    complete: function(e) {}
                });
            }
        });
        var n = wx.getStorageSync("users"), l = this;
        console.log(n), console.log(getApp().imglink, getApp().getuniacid);
        var i = wx.getStorageSync("url");
        app.util.request({
            url: "entry/wxapp/StoreType",
            cachetime: "0",
            success: function(e) {
                console.log(e);
                var a = e.data, t = [];
                a.map(function(e) {
                    var a;
                    a = e.type_name, t.push(a);
                }), console.log(t), l.setData({
                    nav: t,
                    store: a,
                    link: i,
                    is_tel: o,
                    user_info: n
                });
            }
        }), app.util.request({
            url: "entry/wxapp/YellowSet",
            cachetime: "0",
            success: function(e) {
                console.log(e);
                var t = [];
                for (var a in e.data) {
                    var o = e.data;
                    0 == e.data[a].money ? e.data[a].money1 = "免费" : e.data[a].money1 = e.data[a].money + "元", 
                    e.data[a].text = e.data[a].days + "天 " + e.data[a].money1;
                }
                e.data.map(function(e) {
                    var a = {};
                    a.value = e.text, a.name = e.id, t.push(a);
                }), console.log(t), t[0].checked = !0, l.setData({
                    items: t,
                    yellow_set: o,
                    rz_type: t[0].name
                });
            }
        });
        var t = wx.getStorageSync("url2");
        console.log(i), this.setData({
            url: t,
            link: i
        });
    },
    getPhoneNumber: function(e) {
        var a = this, t = wx.getStorageSync("key"), o = e.detail.iv, n = e.detail.encryptedData;
        console.log(t), console.log(o), console.log(n), app.util.request({
            url: "entry/wxapp/jiemi",
            cachetime: "0",
            data: {
                sessionKey: t,
                iv: o,
                data: n
            },
            success: function(e) {
                console.log(e), a.setData({
                    num: e.data.phoneNumber
                });
            }
        });
    },
    bindPickerChange: function(e) {
        console.log("picker发送选择改变，携带值为", e.detail.value), this.setData({
            index: e.detail.value
        });
    },
    radioChange: function(e) {
        console.log("radio发生change事件，携带value值为：", e.detail.value), this.setData({
            rz_type: e.detail.value
        });
    },
    choose: function(e) {
        var t = this, o = t.data.url, n = wx.getStorageSync("uniacid");
        console.log(o), console.log(n), wx.chooseImage({
            count: 1,
            sizeType: [ "original", "compressed" ],
            sourceType: [ "album", "camera" ],
            success: function(e) {
                console.log(e);
                var a = e.tempFilePaths[0];
                wx.uploadFile({
                    url: o + "app/index.php?i=" + n + "&c=entry&a=wxapp&do=Upload&m=zh_tcwq",
                    filePath: a,
                    name: "upfile",
                    formData: {},
                    success: function(e) {
                        console.log(e);
                        var a = t.data.logo;
                        a[0] = e.data, t.setData({
                            logo: a
                        });
                    },
                    fail: function(e) {
                        console.log(e);
                    }
                });
            }
        });
    },
    lbdelete1: function(e) {
        var a = e.currentTarget.dataset.index, t = this.data.logo;
        t.splice(a, 1), console.log(t), this.setData({
            logo: t
        });
    },
    gongg: function(e) {
        console.log(e.detail.value);
        var a = parseInt(e.detail.value.length);
        this.setData({
            zsnum: a
        });
    },
    add: function(e) {
        var a = this;
        wx.chooseLocation({
            type: "wgs84",
            success: function(e) {
                console.log(e);
                e.latitude, e.longitude, e.speed, e.accuracy;
                a.setData({
                    address: e.address,
                    start_lat: e.latitude,
                    start_lng: e.longitude
                });
            }
        });
    },
    formSubmit: function(e) {
        console.log(e);
        var a = this, t = wx.getStorageSync("city"), o = e.detail.value.name, n = e.detail.value.tel, l = e.detail.value.details, i = e.detail.value.address, s = "", c = a.data.logo, r = a.data.yellow_set, u = (a.data.items, 
        a.data.start_lat + "," + a.data.start_lng);
        console.log(u);
        var d = a.data.store, g = a.data.nav[a.data.index];
        if (2 == a.data.is_tel) var p = 1; else p = a.data.num;
        for (var m in d) if (d[m].type_name == g) var y = d[m].id;
        var f = a.data.rz_type;
        for (var h in r) if (r[h].id == f) {
            console.log(r[h].money);
            var w = Number(r[h].money);
        }
        if (console.log(r), console.log(a.data.rz_type), console.log(c[0]), "" == o ? s = "公司名称不能为空" : "" == n ? s = "公司电话不能为空" : "" == l ? s = "公司简介不能为空" : null == i || "" == i ? s = "请正确填写公司地址" : 0 == c.length ? s = "请上传公司logo" : null == p && (s = "还没进行手机号验证"), 
        "" != s) wx.showModal({
            title: "提示",
            content: s,
            showCancel: !0,
            cancelText: "取消",
            confirmText: "确定",
            success: function(e) {},
            fail: function(e) {},
            complete: function(e) {}
        }); else {
            c = c[0];
            var v = wx.getStorageSync("users").id, x = wx.getStorageSync("openid");
            0 < w ? app.util.request({
                url: "entry/wxapp/Pay",
                cachetime: "0",
                data: {
                    openid: x,
                    money: w
                },
                success: function(e) {
                    console.log(e), wx.requestPayment({
                        timeStamp: e.data.timeStamp,
                        nonceStr: e.data.nonceStr,
                        package: e.data.package,
                        signType: e.data.signType,
                        paySign: e.data.paySign,
                        success: function(e) {
                            console.log("这里是支付成功"), app.util.request({
                                url: "entry/wxapp/fx",
                                cachetime: "0",
                                data: {
                                    user_id: v,
                                    money: w
                                },
                                success: function(e) {
                                    console.log(e);
                                }
                            }), console.log(e), app.util.request({
                                url: "entry/wxapp/YellowPage",
                                cachetime: "0",
                                data: {
                                    user_id: v,
                                    logo: c,
                                    company_name: o,
                                    company_address: i,
                                    type_id: y,
                                    link_tel: n,
                                    rz_type: f,
                                    coordinates: u,
                                    content: l,
                                    imgs: "",
                                    tel2: p,
                                    cityname: t
                                },
                                success: function(e) {
                                    console.log(e), app.util.request({
                                        url: "entry/wxapp/SaveHyPayLog",
                                        cachetime: "0",
                                        data: {
                                            hy_id: e.data,
                                            money: w
                                        },
                                        success: function(e) {
                                            console.log(e);
                                        }
                                    }), wx.showModal({
                                        title: "提示",
                                        content: "提交成功等待审核"
                                    }), setTimeout(function() {
                                        wx.navigateBack({
                                            delta: 1
                                        });
                                    }, 2e3);
                                }
                            });
                        },
                        fail: function(e) {
                            console.log("这里是支付失败"), console.log(e), wx.showToast({
                                title: "支付失败",
                                duration: 1e3
                            });
                        }
                    });
                }
            }) : app.util.request({
                url: "entry/wxapp/YellowPage",
                cachetime: "0",
                data: {
                    user_id: v,
                    logo: c,
                    company_name: o,
                    company_address: i,
                    type_id: y,
                    link_tel: n,
                    rz_type: f,
                    coordinates: u,
                    content: l,
                    imgs: "",
                    tel2: p,
                    cityname: t
                },
                success: function(e) {
                    console.log(e), wx.showToast({
                        title: "入驻成功",
                        icon: "",
                        image: "",
                        duration: 2e3,
                        mask: !0,
                        success: function(e) {},
                        fail: function(e) {},
                        complete: function(e) {}
                    }), setTimeout(function() {
                        wx.navigateBack({
                            delta: 1
                        });
                    }, 2e3);
                }
            });
        }
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {}
});