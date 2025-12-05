(function( $ ) {
    $.widget("metro.countdown", {

        version: "1.0.1", // support both 3 and 2 digits display for days

        options: {
            style: {
                background: "bg-dark",
                foreground: "fg-white",
                divider: "fg-dark"
            },
            blink: true,
            days: 1,
            stoptimer: 0,
            ontick: function(d, h, m, s){},
            onstop: function(){}
        },

        wrappers: {},

        _interval: 0,

        _create: function(){
            var that = this, countdown = this.element;

            $.each(['Days','Hours','Minutes','Seconds'],function(i, item){
                var digitCount = (item === 'Days') ? 3 : 2;
                var $unitContainer = $('<span class="count'+item+'">');
                
                for(var k = 0; k < digitCount; k++) {
                    var $wrapper = $('<span class="digit-wrapper">')
                        .html('<span class="digit">0</span>');

                    if (k < digitCount - 1) {
                        $wrapper.css('margin-right', '5px');
                    }
                    
                    $unitContainer.append($wrapper);
                }

                $unitContainer.appendTo(countdown);


                if(item!="Seconds"){
                    countdown.append('<span class="divider"></span>');
                }
            });

            this.wrappers = this.element.find('.digit-wrapper');

            if (countdown.data('blink') != undefined) {
                this.options.blink = countdown.data('blick');
            }

            if (countdown.data('styleBackground') != undefined) {
                this.options.style.background = countdown.data('styleBackground');
            }

            if (countdown.data('styleForeground') != undefined) {
                this.options.style.foreground = countdown.data('styleForeground');
            }

            if (countdown.data('styleDivider') != undefined) {
                this.options.style.divider = countdown.data('styleDivider');
            }

            if (this.options.style.background != "default") {
                this.element.find(".digit").addClass(this.options.style.background);
            }

            if (this.options.style.foreground != "default") {
                this.element.find(".digit").addClass(this.options.style.foreground);
            }

            if (this.options.style.divider != "default") {
                this.element.find(".divider").addClass(this.options.style.divider);
            }

            if (countdown.data('stoptimer') != undefined) {
                this.options.stoptimer = new Date(countdown.data('stoptimer'));
            }

            if (this.options.stoptimer == 0) {
                this.options.stoptimer = (new Date()).getTime() + this.options.days*24*60*60*1000;
            }

            setTimeout( function(){
                that.tick()
            }, 1000);
        },

        _destroy: function(){

        },

        _setOption: function(key, value){
            this._super('_setOption', key, value);
        },

        tick: function(){
            var that = this;

            this._interval = setInterval(function(){
                var days = 24*60*60,
                    hours = 60*60,
                    minutes = 60;

                var left, d, h, m, s;

                left = Math.floor((that.options.stoptimer - (new Date())) / 1000);

                if(left < 0){
                    left = 0;
                }

                // Number of days left
                d = Math.floor(left / days);
                that.updateTrio(0, 1, 2, d);
                left -= d*days;

                // Number of hours left
                h = Math.floor(left / hours);
                that.updateDuo(3, 4, h);
                left -= h*hours;

                // Number of minutes left
                m = Math.floor(left / minutes);
                that.updateDuo(5, 6, m);
                left -= m*minutes;

                // Number of seconds left
                s = left;
                that.updateDuo(7, 8, s);

                // Calling an optional user supplied ontick
                that.options.ontick(d, h, m, s);

                that.blinkDivider();

                // Scheduling another call of this function in 1s
                if (d === 0 && h === 0 && m === 0 && s === 0) {
                    that.options.onstop();
                    that.stopDigit();
                    that._trigger('alarm');
                    clearInterval(that._interval);
                }
            }, 1000);
        },

        blinkDivider: function(){
            if (this.options.blink)
                this.element.find(".divider").toggleClass("no-visible");
        },

        stopDigit: function(){
            this.wrappers.each(function(){
                $(this).children(".digit").addClass("stop");
            })
        },

        updateTrio: function(hundreds, tens, units, value){
            var hundredsWrapper = this.wrappers.eq(hundreds);
            var h_val = Math.floor(value / 100);
            
            if (h_val === 0) {
                hundredsWrapper.css('display', 'none');
            } else {
                hundredsWrapper.css('display', 'inline-block'); 
                
                this.switchDigit(hundredsWrapper, h_val % 10);
            }

            this.switchDigit(this.wrappers.eq(tens), Math.floor(value/10)%10);
            this.switchDigit(this.wrappers.eq(units), value%10);
        },

        updateDuo: function(minor, major, value){
            this.switchDigit(this.wrappers.eq(minor),Math.floor(value/10)%10);
            this.switchDigit(this.wrappers.eq(major),value%10);
        },

        switchDigit: function(wrapper, number){
            var digit = wrapper.find('.digit');

            if(digit.is(':animated')){
                return false;
            }

            if(wrapper.data('digit') == number){
                // We are already showing this number
                return false;
            }

            wrapper.data('digit', number);

            var replacement = $('<span>',{
                'class':'digit',
                css:{
                    top:'-2.1em',
                    opacity:0
                },
                html:number
            });

            replacement.addClass(this.options.style.background);
            replacement.addClass(this.options.style.foreground);

            digit
                .before(replacement)
                .removeClass('static')
                .animate({top:'2.5em'},'fast',function(){
                    digit.remove();
                });

            replacement
                .delay(100)
                .animate({top:0,opacity:1},'fast');

            return true;
        }
    });
})( jQuery );