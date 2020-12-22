'use strict';
//http://mourner.github.io/simpleheat/demo/
// https://github.com/mourner/simpleheat
/**
 * Function to create heatmap instance
 * @param  {string} canvas - canvas DOM identifier
 * @returns {instance} simpleheat - Returns heatmap instance
 */
class HeatMap {
    /**
     *
     */
    init(canvasId, config) {
        this._colorStops = [
            {
                "stop": 100,
                "range": [100, 90],
                "color": "rgba(253, 36, 5, 0.7)"
            },
            {
                "stop": 90,
                "range": [90, 80],
                "color": "rgba(255, 212, 32, 0.7) "
            },
            {
                "stop": 80,
                "range": [80, 70],
                "color": "rgba(217, 253, 40, 0.7)"
            },
            {
                "stop": 70,
                "range": [70, 60],
                "color": "rgba(71, 254, 41, 0.7)"
            },
            {
                "stop": 60,
                "range": [60, 50],
                "color": "rgba(0, 255, 130, 0.7)"
            },
            {
                "stop": 50,
                "range": [50, 40],
                "color": "rgba(0, 255, 205, 0.7)"
            },
            {
                "stop": 40,
                "range": [40, 30],
                "color": "rgba(1, 169, 251, 0.7)"
            },
            {
                "stop": 30,
                "range": [30, 20],
                "color": "rgba(0, 41, 229, 0.7)"
            },
            {
                "stop": 20,
                "range": [20, 10],
                "color": "rgba(40, 40, 89, 0.7)"
            },
            {
                "stop": 10,
                "range": [10, 0],
                "color": "rgba(50, 49, 58, 0.7)"
            }
        ]

        this.defaultRadius = 5;

        this.defaultGradient = {
            0.4: 'blue',
            0.6: 'cyan',
            0.7: 'green',
            0.8: 'yellow',
            1.0: 'red'
        };

        this._canvas = canvas = typeof canvasId === 'string' ? document.getElementById(canvasId) : canvasId;

        this._ctx = canvas.getContext('2d');
        this._width = canvas.width;
        this._height = canvas.height;

        this._max = 1;
        this._data = [];
    }

    data(data) {
        this._data = data;
        return this;
    }

    max(max) {
        this._max = max;
        return this;
    }

    viewPortSize(data) {
        this._viewPortHeight = data.height;
    }

    add(point) {
        this._data.push(point);
        return this;
    }

    clear() {
        this._data = [];
        return this;
    }

    radius(r, blur) {
        blur = blur === undefined ? 15 : blur;

        // create a grayscale blurred circle image that we'll use for drawing points
        var circle = this._circle = document.createElement('canvas'),
            ctx = circle.getContext('2d'),
            r2 = this._r = r + blur;

        circle.width = circle.height = r2 * 2;

        ctx.shadowOffsetX = ctx.shadowOffsetY = r2 * 2;
        ctx.shadowBlur = blur;
        ctx.shadowColor = 'green';

        ctx.beginPath();
        ctx.arc(-r2, -r2, r, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();

        return this;
    }

    resize() {
        this._width = this._canvas.width;
        this._height = this._canvas.height;
    }

    gradient(grad) {
        let width = 256;
        let height = 1;
        // create a 256x1 gradient that we'll use to turn a grayscale heatmap into a colored one
        var canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d'),
            gradient = ctx.createLinearGradient(0, 0, width, height);

        canvas.width = width;
        canvas.height = height;
        document.body.appendChild(canvas);

        for (var i in grad) {
            gradient.addColorStop(i, grad[i]);
        }

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        this._grad = ctx.getImageData(0, 0, width, height).data;

        return this;
    }

    draw(minOpacity) {
        if (!this._circle) {
            this.radius(this.defaultRadius);
        }

        if (!this._grad) {
            this.gradient(this.defaultGradient);
        }

        var ctx = this._ctx;

        ctx.clearRect(0, 0, this._width, this._height);

        // draw a grayscale heatmap by putting a blurred circle at each data point
        for (var i = 0, len = this._data.length, p; i < len; i++) {
            p = this._data[i];
            ctx.globalAlpha = Math.min(Math.max(p[2] / this._max, minOpacity === undefined ? 0.05 : minOpacity), 1);
            // craw a circle in the position of  x, y
            ctx.drawImage(this._circle, p[0] - this._r, p[1] - this._r);
        }

        // colorize the heatmap, using opacity value of each pixel to get the right color from our gradient
        var colored = ctx.getImageData(0, 0, this._width, this._height);
        this._colorize(colored.data, this._grad, minOpacity);
        ctx.putImageData(colored, 0, 0);

        return this;
    }

    _colorize(pixels, gradient, opacity) {
        for (var i = 0, len = pixels.length, j; i < len; i += 4) {
            j = pixels[i + 3] * 4; // get gradient color from opacity value

            if (j) {
                // console.log(gradient[j]);
                pixels[i] = gradient[j];
                pixels[i + 1] = gradient[j + 1];
                pixels[i + 2] = gradient[j + 2];
            } else {
            }
        }
    }
}


export default HeatMap;