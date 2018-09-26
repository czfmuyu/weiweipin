var app = getApp();

Page({
    data: {},
    onLoad: function(e) {
        var o = this, a = wx.getStorageSync("url"), t = e.price * e.num;
        o.setData({
            id: e.id,
            url: a,
            price: e.price,
            num: e.num,
            cost: t.toFixed(2),
            name1: e.name1,
            name2: e.name2,
            name3: e.name3,
            store_id: e.store_id
        }), console.log(e + "这是商家的id"), o.user_infos(), o.refresh();
    },
    refresh: function(e) {
        var u = this, o = u.data.id;
        app.util.request({
            url: "entry/wxapp/GoodInfo",
            cachetime: "0",
            data: {
                id: o
            },
            success: function(e) {
                console.log(e);
                var o = e.data.spec, a = {}, t = [];
                o.forEach(function(e) {
                    var o = e.spec_id + "_" + e.spec_name;
                    void 0 === a[o] && (a[o] = []), a[o].push(e);
                });
                for (var n = Object.keys(a), s = 0; s < n.length; s++) {
                    var c = n[s].split("_");
                    t.push({
                        spec_id: c[0],
                        spec_name: c[1],
                        value: a[n[s]]
                    });
                }
                console.log(t), e.data.good.imgs = e.data.good.imgs.split(","), e.data.good.lb_imgs = e.data.good.lb_imgs.split(",");
                var i = Number(u.data.cost), r = Number(e.data.good.freight), d = i + r;
                d = d.toFixed(2), u.setData({
                    store_good: e.data.good,
                    cost2: d,
                    freight: r,
                    result: t
                });
            }
        }), app.util.request({
            url: "entry/wxapp/StoreInfo",
            cachetime: "0",
            data: {
                id: u.data.store_id
            },
            success: function(e) {
                console.log(e), u.setData({
                    store: e.data.store[0]
                });
            }
        });
    },
    user_infos: function(e) {
        var c = this;
        wx.login({
            success: function(e) {
                var o = e.code;
                wx.getUserInfo({
                    success: function(e) {
                        var n = e.userInfo.nickName, s = e.userInfo.avatarUrl;
                        app.util.request({
                            url: "entry/wxapp/openid",
                            cachetime: "0",
                            data: {
                                code: o
                            },
                            success: function(e) {
                                var o = s, a = n, t = e.data.openid;
                                app.util.request({
                                    url: "entry/wxapp/Login",
                                    cachetime: "0",
                                    data: {
                                        openid: t,
                                        img: o,
                                        name: a
                                    },
                                    success: function(e) {
                                        console.log("这是用户的登录信息"), console.log(e), c.setData({
                                            user_info: e.data,
                                            openid: t
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    },
    address: function(e) {
        var o = this, a = o.data.user_info.id;
        console.log(a), wx.chooseAddress({
            success: function(e) {
                console.log(e), app.util.request({
                    url: "entry/wxapp/UpdAdd",
                    cachetime: "0",
                    data: {
                        user_id: a,
                        user_name: e.userName,
                        user_tel: e.telNumber,
                        user_address: e.provinceName + e.cityName + e.countyName + e.detailInfo
                    },
                    success: function(e) {
                        console.log(e), o.user_infos();
                    }
                });
            }
        });
    },
    add: function(e) {
        var o = this, a = o.data.num + 1, t = o.data.cost1, n = (t *= a.toFixed(2)) + o.data.freight;
        o.setData({
            num: a,
            cost: t,
            cost2: n
        });
    },
    subtraction: function(e) {
        var o = this.data.num;
        o -= 1;
        var a = this.data.cost1, t = (a *= o.toFixed(2)) + this.data.freight;
        this.setData({
            num: o,
            cost: a,
            cost2: t
        });
    },
    note: function(e) {
        console.log(e), this.setData({
            note: e.detail.value
        });
    },
    order: function(e) {
        var o = this;
        console.log(o.data);
        var a = o.data.store_good, t = o.data.user_info.id, n = o.data.user_info, s = o.data.openid, c = Number(a.freight), i = (Number(a.goods_cost), 
        o.data.cost2), r = o.data.note, d = o.data.result;
        if (1 == d.length) var u = d[0].spec_name + ":" + o.data.name1;
        if (2 == d.length) u = d[0].spec_name + ":" + o.data.name1 + ";" + d[1].spec_name + ":" + o.data.name2;
        if (3 == d.length) u = d[0].spec_name + ":" + o.data.name1 + ";" + d[1].spec_name + ":" + o.data.name2 + ";" + d[2].spec_name + ":" + o.data.name3;
        console.log(d), console.log(String(u)), r = null == r ? "" : o.data.note, "" == n.user_name ? wx.showModal({
            title: "提示",
            content: "您还没有填写收货地址喔",
            showCancel: !0,
            cancelText: "取消",
            cancelColor: "",
            confirmText: "确定",
            confirmColor: "",
            success: function(e) {},
            fail: function(e) {},
            complete: function(e) {}
        }) : (console.log(r), app.util.request({
            url: "entry/wxapp/addorder",
            cachetime: "0",
            data: {
                user_id: t,
                store_id: a.store_id,
                money: i,
                user_name: n.user_name,
                address: n.user_address,
                tel: n.user_tel,
                good_id: a.id,
                good_name: a.goods_name,
                good_img: a.imgs[0],
                good_money: o.data.price,
                good_spec: String(u),
                freight: c,
                good_num: o.data.num,
                note: r
            },
            success: function(e) {
                console.log(e);
                var o = e.data;
                console.log(i), app.util.request({
                    url: "entry/wxapp/Pay",
                    cachetime: "0",
                    data: {
                        openid: s,
                        money: i,
                        order_id: o
                    },
                    success: function(e) {
                        console.log(e), wx.requestPayment({
                            timeStamp: e.data.timeStamp,
                            nonceStr: e.data.nonceStr,
                            package: e.data.package,
                            signType: e.data.signType,
                            paySign: e.data.paySign,
                            success: function(e) {
                                console.log("这里是支付成功"), console.log(e), app.util.request({
                                    url: "entry/wxapp/PayOrder",
                                    cachetime: "0",
                                    data: {
                                        order_id: o
                                    },
                                    success: function(e) {
                                        console.log("改变订单状态"), console.log(e), wx.redirectTo({
                                            url: "../logs/order",
                                            success: function(e) {},
                                            fail: function(e) {},
                                            complete: function(e) {}
                                        });
                                    }
                                }), app.util.request({
                                    url: "entry/wxapp/sms2",
                                    cachetime: "0",
                                    data: {
                                        store_id: a.store_id
                                    },
                                    success: function(e) {
                                        console.log(e);
                                    }
                                });
                            },
                            fail: function(e) {
                                console.log("这里是支付失败"), console.log(e), wx.showToast({
                                    title: "支付失败",
                                    duration: 1e3
                                }), wx.redirectTo({
                                    url: "../logs/order",
                                    success: function(e) {},
                                    fail: function(e) {},
                                    complete: function(e) {}
                                });
                            }
                        });
                    }
                });
            }
        }));
    },
    onReady: function() {},
    onShow: function() {
        wx.setNavigationBarColor({
            frontColor: "#ffffff",
            backgroundColor: wx.getStorageSync("color"),
            animation: {
                duration: 0,
                timingFunc: "easeIn"
            }
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});