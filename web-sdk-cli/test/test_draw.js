var canvas = document.getElementById('canvas');

if (canvas) {
    var context = canvas.getContext('2d');
    var width = 500;
    var height = 500;

    window.draw = function (data) {
        var id = context.createImageData(1, 1); // only do this once per page
        var d = id.data;                        // only do this once per page
        d[0] = 255;
        d[1] = 0;
        d[2] = 0;
        d[3] = 255;
        var coord = convert(data.px, data.py);
        var x = coord.x;
        var y = coord.y;
        context.putImageData(id, x, y);
    };

    /**
     * Percent convert to canvas coordinates
     * @param x
     * @param y
     * @returns {{x: number, y: number}}
     */
    function convert(x, y) {
        return {x: parseInt((x * width) / 100), y: parseInt((y * height) / 100)}
    }

    var max = -Infinity;
    var map = {};
    window.draw = function (data) {
        let key = parseInt(x) + '_' + parseInt(y);
        map [key] = map [key] || 0;
        map [key]++;
        let newValue = map[key];
        if (!max) {
            max = newValue;
        } else {
            if (newValue > max) {
                max = newValue;
            }
        }
        //simpleheat.radius(0.1, 50);
        simpleheat.data(data.map(e => {
            p = convert(e.px, e.py);
            return [p.x, p.y, 4];
        }));
        simpleheat.max(5);
        simpleheat.draw(8);
    }
    /**
     * Draw in canvas
     * @param data
     */
    window.draw = function (data) {
        simpleheat.data(data.map(e => {
            p = convert(e.px, e.py);
            return [p.x, p.y];
        }));
        simpleheat.max(10);
        simpleheat.draw(8);
        /*
        var r2 = 20;
        var r1 = 2;
        var coord = convert(data.px, data.py);
        var x = coord.x;
        var y = coord.y;
        //
        let key = parseInt(x) + '_' + parseInt(y);
        map [key] = map [key] || 0;
        map [key]++;
        let newValue = map[key];
        if (!max) {
            max = newValue;
        } else {
            if (newValue > max) {
                console.log('new max', newValue);
                console.log('redraw', newValue);
                max = newValue;
            }
        }
        // Shadow
        var radGradient = context.createRadialGradient(x, y, 1, x, y, r2);
        radGradient.addColorStop(0, 'rgb(255,0,0,0.1)');
        radGradient.addColorStop(1, 'rgb(255,0,0,0)');
        context.fillStyle = radGradient;
        context.fillRect(x - r2, y - r2, 2 * r2, 2 * r2);*/
    }
}