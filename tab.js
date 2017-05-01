(function($) {

    var Tab = function(tab) {

        var _this_ = this;
        this.tab = tab;

        // 默认参数 
        _this_.config = {
            "triggerType": "mouseover", //操作方式，支持mouseover和click
            "effect": "default", //切换效果，支持default和fade
            "invoke": 1, //设置默认页面
            "auto": 3000 //是否自动切换页面，为false时表示不指定切，为数字表示自动切换间隔实际
        };

        //扩展参数，优先扩展属性'data-config',否则再扩展JS对象config
        if (this.getConfig()) {
            $.extend(_this_.config, this.getConfig())
        } else if (this.tab && this.tab != "") {
            $.extend(_this_.config, tab)
        }

        this.tabItems = this.tab.find("ul.tab-nav li")
        this.contentItems = this.tab.find("div.content-wrap div.content-item")

        //绑定注册的事件
        var config = _this_.config;
        if (config.triggerType === "click") {
            this.tabItems.bind(config.triggerType, function(e) {
                _this_.invoke($(this));
            })
        } else {
            this.tabItems.bind("mouseover", function(e) {
                var self = $(this)
                this.timer = window.setTimeout(function() {
                    _this_.invoke(self);
                }, 300)
            });

            this.tabItems.mouseout(function() {
                window.clearTimeout(_this_.timer)
            })
        }

        //设置自动切换
        if (config.auto) {
            _this_.timer = null
            _this_.loop = 0

            //鼠标悬停在内容上时暂停自动切换
            _this_.contentItems.hover(function() {
                    window.clearInterval(_this_.timer);
                },
                function() {
                    _this_.autoPlay();
                });

            _this_.autoPlay()
        }

        // 设置默认选项卡
        if (config.invoke > 1) {
            this.invoke(_this_.tabItems.eq(config.invoke - 1))
        }
    }

    Tab.prototype = {
        //获取配置
        getConfig: function() {

            if (!this.tab.attr) {
                return null;
            }

            var config = this.tab.attr("data-config");
            if (config && config != "") {
                return $.parseJSON(config);
            }

            return null;
        },

        //切换选项卡
        invoke: function(currentTab) {
            var _this_ = this;

            var index = currentTab.index()

            currentTab.addClass("actived").siblings().removeClass('actived')

            var effect = this.config.effect;

            var conItems = _this_.contentItems;

            if (effect === "fade") {
                conItems.eq(index).fadeIn().siblings().fadeOut();
            } else {
                conItems.eq(index).addClass("current").siblings().removeClass("current");
            }

            if (_this_.config.auto) {
                _this_.loop = index;
            }
        },
        //自动切换
        autoPlay: function() {
            var _this_ = this;
            var tabItems = _this_.tabItems;
            var len = tabItems.length;
            var config = _this_.config;

            this.timer = window.setInterval(function() {
                _this_.loop = _this_.loop + 1;

                var index = _this_.loop % len;

                tabItems.eq(index).trigger(config.triggerType);
            }, config.auto)
        }
    };

    //注册jQuery方法，html中可以使用 $('.js-tab').tab()注册
    $.fn.extend({
        tab: function() {
            //this 指页面中的所有'js-tab' 集合
            this.each(function() {
                //this 指页面中的每个'js-tab'对象
                new Tab($(this))
            })

            return this;
        }
    });
    window.Tab = Tab;
})(jQuery);