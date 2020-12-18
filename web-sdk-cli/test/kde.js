//
var x = [20, 28, 15, 20, 18, 25, 15, 18, 18, 20, 25, 30, 25, 22, 30, 22, 38, 40, 38, 30, 22, 20, 35, 33];
var y = [20, 14, 15, 20, 15, 20, 32, 33, 45, 50, 20, 20, 20, 25, 30, 38, 20, 28, 33, 50, 48, 40, 30, 35];

var canvas = document.getElementById("canvas_kde");
var ctx = canvas.getContext("2d");
var h = 20;
var max_x = Math.max.apply(window, x);
var max_y = Math.max.apply(window, y);

var gradient_kde_ctx;

/**
 * Kde distance
 * @param d : point distance
 * @param h : kernel radius
 */
function kde(d) {
    return (15 / 16) * Math.pow(1 - Math.pow(d / h, 2), 2);
}

/**
 * Distance between 2 points
 * @param p1
 * @param p2
 * @returns {number}
 */
function distance(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

function plot_gradient_canvas(grad) {
    let width = 256;
    let height = 1;
    // create a 256x1 gradient that we'll use to turn a grayscale heatmap into a colored one
    var canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        gradient = ctx.createLinearGradient(0, 0, width, height);

    canvas.width = width;
    canvas.height = height;
    document.body.appendChild(canvas);
    var defaultGradient = {
        0.4: '#008cff',
        0.6: 'cyan',
        0.7: 'green',
        0.8: 'yellow',
        1.0: 'red'
    };
    for (var i in defaultGradient) {
        gradient.addColorStop(i, defaultGradient[i]);
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    gradient_kde_ctx = ctx;

}

function draw_point(x, y, color) {
    color = color || 'red';
    ctx.beginPath();
    ctx.arc(x, y, 1, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
}

function drawPoints() {
    for (let i = 0; i < x.length; i++) {
        draw_point(x[i], y[i]);
    }
}

/**
 *
 * @param intensity
 * @param max
 * @returns {number}
 */
function getColor(intensity, max) {
    // get the intensity of 256
    let convertedValue = (intensity / max) * 256;
    let data = gradient_kde_ctx.getImageData(convertedValue, 0, 1, 1).data;
    return 'rgba(' + data[0] + ',' + data[1] + ',' + data[2] + ',1)';
}

function build_grid() {
    var i = 0, j = 0, k = 0, l = 0, data_matrix = [], d, max_intensity = 0, point_kde_distances;
    for (; i <= max_x  + 10; i++) {
        for (j = 0; j <= max_y + 10;   j++) {
            point_kde_distances = [];
            for (k = 0; k < x.length; k++) {
                d = distance({x: x[k], y: y[k]}, {x: i, y: j});
                if (d <= h && d > 0) {
                    point_kde_distances.push(kde(d));
                }
            }
            data_matrix[l++] = i;
            data_matrix [l++] = j;
            data_matrix [l++] = point_kde_distances.reduce((a, b) => a + b, 0);
            max_intensity = Math.max(max_intensity, data_matrix [l - 1]);
        }

    }
    for (i = 0; i < data_matrix.length; i += 3) {
        draw_point(data_matrix[i], data_matrix[i + 1], getColor(data_matrix[i + 2], max_intensity));
    }
}

plot_gradient_canvas();

build_grid();

drawPoints();
