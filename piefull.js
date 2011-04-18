/*
 * piefull.js - Simple inline piecharts for HTML5 canvas
 *
 * Ben Bass 2011
 * @codedstructure
 *
 */

var piefull = {
    // default parameters.
    selector: '.piefull',
    yescol: '#00F',
    nocol: '#0F0',
    size: 24,

    // constants
    PERCENT_RE: /(-?\d+(?:\.\d*)?(?:e[+\-]?\d+)?)%?/i,
    START_ANGLE: (2 * Math.PI) * 0.75,

    main: function(selector, size, yescol, nocol) {
        var that = this;
        if (typeof document.querySelectorAll === 'undefined') {
            // we don't serve your type here...
            return;
        }
        var _selector = selector || this.selector;
        var _piesize = size || this.size;
        var _yescol = yescol || this.yescol;
        var _nocol = nocol || this.nocol;
        var _drawArc = function(ctx, arclen, full) {
            ctx.beginPath();
            ctx.moveTo(_piesize / 2,_piesize / 2);
            ctx.arc(_piesize / 2,_piesize / 2, _piesize / 2,
                    that.START_ANGLE, that.START_ANGLE + arclen, !full);
            ctx.fillStyle = full ? _yescol : _nocol;
            ctx.fill();
            ctx.closePath();
        };

        var pies = document.querySelectorAll(_selector);
        for (var i=0; i<pies.length; i++) {
            var pie = pies[i];

            // extract percentage from element text
            var valueText = pie.textContent || pie.innerText;
            var percent_match = that.PERCENT_RE.exec(valueText);
            // if no percentage found, don't change anything.
            if (percent_match !== null) {
                var value = percent_match[0];
                // convert percentage to arc length
                var arclen = (2*Math.PI)*parseFloat(value)/100;
                // create canvas element
                var canvas = document.createElement('canvas');
                // copy across class and id elements if present
                var attr = pie.getAttribute('class');
                if (attr) {
                    canvas.setAttribute('class', attr);
                }
                attr = pie.getAttribute('id');
                if (attr) {
                    canvas.setAttribute('id', attr);
                }
                // replace element with canvas - with title
                // containing original element text.
                pie.parentNode.replaceChild(canvas, pie);
                canvas.setAttribute('title', valueText);
                canvas.width = _piesize;
                canvas.height = _piesize;
                if (typeof canvas.getContext === 'undefined') {
                    // excanvas support
                    canvas = window.G_vmlCanvasManager.initElement(canvas);
                }
                var ctx = canvas.getContext('2d');
                _drawArc(ctx, arclen, true);
                _drawArc(ctx, arclen, false);
            }
        }
    }
};
