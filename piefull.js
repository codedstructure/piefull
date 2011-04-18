/*
 * piefull.js - Simple inline piecharts for HTML5 canvas
 *
 * Ben Bass 2011
 * @codedstructure
 *
 */

piefull = {
    yescol: '#00F',
    nocol: '#0F0',
    size: 24,

    main: function(size, yescol, nocol) {
        if (typeof document.querySelectorAll === 'undefined') {
            // we don't serve your type here.
            return;
        }
        var piesize = size || this.size;
        var yescol = yescol || this.yescol;
        var nocol = nocol || this.nocol;
        var startAngle=(2*Math.PI)*0.75;
        var percent_re = /(-?\d+(?:\.\d*)?(?:e[+\-]?\d+)?)%?/i;

        var pies = document.querySelectorAll('.piefull');
        for (var i=0; i<pies.length; i++) {
            var pie = pies[i];

            // extract percentage from element text
            var valueText = pie.textContent || pie.innerText;
            var percent_match = percent_re.exec(valueText)
            // if no percentage found, don't change anything.
            if (percent_match != null) {
                var value = percent_match[0];
                var arclen = (2*Math.PI)*parseFloat(value)/100;
                var canvas = document.createElement('canvas');
                // replace element with canvas - with title
                // containing original element text.
                pie.parentNode.replaceChild(canvas, pie);
                canvas.setAttribute('title',valueText);
                canvas.width=piesize;
                canvas.height=piesize;
                if (typeof canvas.getContext === 'undefined') {
                    // excanvas support
                    canvas = window.G_vmlCanvasManager.initElement(canvas);
                }
                var ctx = canvas.getContext('2d');
                var drawArc = function(full,color) {
                    ctx.beginPath();
                    ctx.moveTo(piesize/2,piesize/2);
                    ctx.arc(piesize/2,piesize/2,piesize/2,
                            startAngle,startAngle+arclen, full);
                    ctx.fillStyle=color;
                    ctx.fill();
                    ctx.closePath();
                }
                drawArc(false, yescol);
                drawArc(true, nocol);
            }
        };
    }
};


