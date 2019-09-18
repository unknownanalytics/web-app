App.Charts = {
    /**
     * Store contexts gradients
     */
    __declaredCtxGradients: {},
    /**
     *
     * @param tag
     * @param properties
     * @param svgns
     * @returns {HTMLElement | SVGAElement | SVGCircleElement | SVGClipPathElement | SVGComponentTransferFunctionElement | SVGDefsElement | SVGDescElement | SVGEllipseElement | SVGFEBlendElement | SVGFEColorMatrixElement | SVGFEComponentTransferElement | SVGFECompositeElement | SVGFEConvolveMatrixElement | SVGFEDiffuseLightingElement | SVGFEDisplacementMapElement | SVGFEDistantLightElement | SVGFEFloodElement | SVGFEFuncAElement | SVGFEFuncBElement | SVGFEFuncGElement | SVGFEFuncRElement | SVGFEGaussianBlurElement | SVGFEImageElement | SVGFEMergeElement | SVGFEMergeNodeElement | SVGFEMorphologyElement | SVGFEOffsetElement | SVGFEPointLightElement | SVGFESpecularLightingElement | SVGFESpotLightElement | SVGFETileElement | SVGFETurbulenceElement | SVGFilterElement | SVGForeignObjectElement | SVGGElement | SVGImageElement | SVGGradientElement | SVGLineElement | SVGLinearGradientElement | SVGMarkerElement | SVGMaskElement | SVGPathElement | SVGMetadataElement | SVGPatternElement | SVGPolygonElement | SVGPolylineElement | SVGRadialGradientElement | SVGRectElement | SVGSVGElement | SVGScriptElement | SVGStopElement | SVGStyleElement | SVGSwitchElement | SVGSymbolElement | SVGTSpanElement | SVGTextContentElement | SVGTextElement | SVGTextPathElement | SVGTextPositioningElement | SVGTitleElement | SVGUseElement | SVGViewElement | SVGElement | Element}
     * @private
     */
    _createElementNS(tag, properties, svgns) {
        svgns = svgns || "http://www.w3.org/2000/svg";
        let el = document.createElementNS(svgns, tag);
        if (properties) {
            for (let prop in properties) {
                el.setAttributeNS(null, prop, properties[prop]);
            }
        }
        return el;
    },
    /**
     *
     * @param properties
     * @returns {*|HTMLElement|SVGAElement|SVGCircleElement|SVGClipPathElement|SVGComponentTransferFunctionElement|SVGDefsElement|SVGDescElement|SVGEllipseElement|SVGFEBlendElement|SVGFEColorMatrixElement|SVGFEComponentTransferElement|SVGFECompositeElement|SVGFEConvolveMatrixElement|SVGFEDiffuseLightingElement|SVGFEDisplacementMapElement|SVGFEDistantLightElement|SVGFEFloodElement|SVGFEFuncAElement|SVGFEFuncBElement|SVGFEFuncGElement|SVGFEFuncRElement|SVGFEGaussianBlurElement|SVGFEImageElement|SVGFEMergeElement|SVGFEMergeNodeElement|SVGFEMorphologyElement|SVGFEOffsetElement|SVGFEPointLightElement|SVGFESpecularLightingElement|SVGFESpotLightElement|SVGFETileElement|SVGFETurbulenceElement|SVGFilterElement|SVGForeignObjectElement|SVGGElement|SVGImageElement|SVGGradientElement|SVGLineElement|SVGLinearGradientElement|SVGMarkerElement|SVGMaskElement|SVGPathElement|SVGMetadataElement|SVGPatternElement|SVGPolygonElement|SVGPolylineElement|SVGRadialGradientElement|SVGRectElement|SVGSVGElement|SVGScriptElement|SVGStopElement|SVGStyleElement|SVGSwitchElement|SVGSymbolElement|SVGTSpanElement|SVGTextContentElement|SVGTextElement|SVGTextPathElement|SVGTextPositioningElement|SVGTitleElement|SVGUseElement|SVGViewElement|SVGElement|Element}
     * @private
     */
    _createSVG(properties) {
        properties = Object.assign({}, {'width': "100%", 'height': "25%"}, properties || {})
        return App.Charts._createElementNS('svg', properties);
    },
    /**
     *
     * @private
     */
    _createCanvasGradient(id, colors) {
        if (colors && colors.length > 1) {
            var c = document.createElement("canvas");
            let width = 300;
            let height = 2;
            c.width = width;
            c.height = height;
            var ctx = c.getContext("2d");
            var grd = ctx.createLinearGradient(0, 0, width, height);
            colors.forEach((stopColor, index) => {
                grd.addColorStop(index / (colors.length - 1), stopColor);
            });
            ctx.fillStyle = grd;
            ctx.fillRect(1, 1, width, height);
            document.body.appendChild(c);
            return ctx;
        }
    },
    /**
     *
     * @param id
     * @param stops
     * @returns {*|HTMLElement|SVGAElement|SVGCircleElement|SVGClipPathElement|SVGComponentTransferFunctionElement|SVGDefsElement|SVGDescElement|SVGEllipseElement|SVGFEBlendElement|SVGFEColorMatrixElement|SVGFEComponentTransferElement|SVGFECompositeElement|SVGFEConvolveMatrixElement|SVGFEDiffuseLightingElement|SVGFEDisplacementMapElement|SVGFEDistantLightElement|SVGFEFloodElement|SVGFEFuncAElement|SVGFEFuncBElement|SVGFEFuncGElement|SVGFEFuncRElement|SVGFEGaussianBlurElement|SVGFEImageElement|SVGFEMergeElement|SVGFEMergeNodeElement|SVGFEMorphologyElement|SVGFEOffsetElement|SVGFEPointLightElement|SVGFESpecularLightingElement|SVGFESpotLightElement|SVGFETileElement|SVGFETurbulenceElement|SVGFilterElement|SVGForeignObjectElement|SVGGElement|SVGImageElement|SVGGradientElement|SVGLineElement|SVGLinearGradientElement|SVGMarkerElement|SVGMaskElement|SVGPathElement|SVGMetadataElement|SVGPatternElement|SVGPolygonElement|SVGPolylineElement|SVGRadialGradientElement|SVGRectElement|SVGSVGElement|SVGScriptElement|SVGStopElement|SVGStyleElement|SVGSwitchElement|SVGSymbolElement|SVGTSpanElement|SVGTextContentElement|SVGTextElement|SVGTextPathElement|SVGTextPositioningElement|SVGTitleElement|SVGUseElement|SVGViewElement|SVGElement|Element}
     */
    _createGrandient(id, stops) {
        if (id && stops && stops.length) {
            var createNS = App.Charts._createElementNS;
            var gradient = createNS('linearGradient', {
                'x1': 0,
                'y1': 0,
                'x2': 0,
                'y2': 1,
                'id': id
            });
            stops.forEach((stopColor, index) => {
                gradient.appendChild(createNS('stop', {
                    'offset': (index / stops.length) * 100,
                    'stop-color': stopColor,
                }));
            });

            return gradient;
        }
        return null;
    },
    /**
     * @param data
     */
    convertPixelColorToRGBA(data) {
        return 'rgba(' + data[0] + ', ' + data[1] +
            ', ' + data[2] + ', ' + (data[3] / 255) + ')';
    },
    /**
     *
     * @returns {*|HTMLElement|SVGAElement|SVGCircleElement|SVGClipPathElement|SVGComponentTransferFunctionElement|SVGDefsElement|SVGDescElement|SVGEllipseElement|SVGFEBlendElement|SVGFEColorMatrixElement|SVGFEComponentTransferElement|SVGFECompositeElement|SVGFEConvolveMatrixElement|SVGFEDiffuseLightingElement|SVGFEDisplacementMapElement|SVGFEDistantLightElement|SVGFEFloodElement|SVGFEFuncAElement|SVGFEFuncBElement|SVGFEFuncGElement|SVGFEFuncRElement|SVGFEGaussianBlurElement|SVGFEImageElement|SVGFEMergeElement|SVGFEMergeNodeElement|SVGFEMorphologyElement|SVGFEOffsetElement|SVGFEPointLightElement|SVGFESpecularLightingElement|SVGFESpotLightElement|SVGFETileElement|SVGFETurbulenceElement|SVGFilterElement|SVGForeignObjectElement|SVGGElement|SVGImageElement|SVGGradientElement|SVGLineElement|SVGLinearGradientElement|SVGMarkerElement|SVGMaskElement|SVGPathElement|SVGMetadataElement|SVGPatternElement|SVGPolygonElement|SVGPolylineElement|SVGRadialGradientElement|SVGRectElement|SVGSVGElement|SVGScriptElement|SVGStopElement|SVGStyleElement|SVGSwitchElement|SVGSymbolElement|SVGTSpanElement|SVGTextContentElement|SVGTextElement|SVGTextPathElement|SVGTextPositioningElement|SVGTitleElement|SVGUseElement|SVGViewElement|SVGElement|Element}
     */
    createSVGCircle(attr) {
        return App.Charts._createElementNS('circle', attr);
    },
    /**
     *
     * @param value
     * @param colorsRange
     * @param options
     * @private
     */
    getGradient(value, colorsRange, options) {
        let key = JSON.stringify(colorsRange);
        let storedCtxGradients = App.Charts.__declaredCtxGradients;
        if (!storedCtxGradients[key]) {
            storedCtxGradients[key] = App.Charts._createCanvasGradient(String(Date.now), colorsRange);
        }
        let ctx = storedCtxGradients[key];
        let pixelPosition = Math.floor(ctx.canvas.width * value);
        return App.Charts.convertPixelColorToRGBA(ctx.getImageData(pixelPosition, 1, 1, 1).data);
    },
    /**
     *
     * @param dom
     * @param options
     */
    squares(dom, options) {
        options = options || {animate: true, y: 7, x: 5, stop: null, values: []};
        dom = typeof (dom) === 'string' ? document.getElementById(dom) : dom;
        if (dom) {
            var createNS = App.Charts._createElementNS;
            let svg = createNS('svg');
            let domClientWidth = dom.clientWidth;
            svg.setAttributeNS(null, 'width', "100%");
            svg.setAttributeNS(null, 'height', "100%");
            //<g transform="scale(1,-1) translate(0,-67)" id="vue-bars-1-path">
            dom.appendChild(svg);
            var paddingX = 3;
            var squareUnit = Math.min(domClientWidth / options.x, 23) - paddingX;
            var squareSpace = squareUnit + paddingX;
            var animStart = 0;
            // set height
            svg.setAttributeNS(null, 'viewBox', `0 0 ${domClientWidth} ${dom.clientHeight}`);
            var gradientID = 'gradient_' + Date.now();
            var defs = createNS('defs');
            defs.appendChild(App.Charts._createGrandient(gradientID, ['#ffbe88', '#ffa4bc']));
            svg.appendChild(defs);
            var i = 0, j = 0, square;
            let counter = 0;
            for (i; i < options.x; i++) {
                for (j = 0; j < options.y; j++) {
                    square = createNS('rect', {
                        'width': squareUnit,
                        'height': options.animate ? 0 : squareUnit,
                        'x': (j * squareSpace),
                        'y': (i * squareSpace),
                        'rx': '2px',
                        'fill': counter++ < options.stop ? 'url(#' + gradientID + ')' : 'gray',
                        //'style': "fill-opacity:0.1;stroke-opacity:0.9"
                    });
                    if (options.animate)
                        square.appendChild(createNS('animate', {
                            'attributeName': 'height',
                            'from': 0,
                            'begin': (animStart++) * 0.04 + 's',
                            'to': squareUnit,
                            'dur': '0.5s',
                            'fill': "freeze"
                        }));
                    svg.appendChild(square);
                }
            }
            if (options.values && options.values.length) {
                for (i = 0; i < options.values.length; j++) {

                }
            }
        }
    },


    /**
     *
     * @param dom
     * @param args
     */
    bubble(dom, data, options) {
        dom = typeof (dom) === 'string' ? document.getElementById(dom) : dom;
        if (dom) {
            options = options || {};
            if (!(data && (typeof (data) === typeof ([])) || data.length)) {
                return;
            }
            var createNS = App.Charts._createElementNS;
            var svg = App.Charts._createSVG();
            svg.setAttributeNS(null, 'viewBox', '0 0 300 75');
            dom.appendChild(svg);

            //
            let width = options.width || 300 /*svg.getBoundingClientRect().width*/;
            var entries = Math.min(20, data.length);
            let spaceBetween = Math.min(width / entries);
            //<g transform="scale(1,-1) translate(0,-67)" id="vue-bars-1-path">

            var r = 3;
            let i = 0, j, animStartX = 0, marginTop = 7, animStartY;
            for (i; i < entries; i++) {
                animStartY = 0
                for (j = 0; j < Math.min(7, data[i]); j++) {
                    /// ="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red"
                    day = createNS('circle', {
                        'r': r,
                        'cx': ((i + 1 / 2) * spaceBetween),
                        'cy': -200,
                        'fill': 'blue',
                    });
                    day.appendChild(createNS('animate', {
                        'attributeName': 'cy',
                        'from': '-200',
                        'begin': ((animStartX) * 0.04) + (animStartY++ * .03) + 's',
                        'to': r * 2 + (j * (r * 2 + (marginTop))),
                        'dur': '0.5s',
                        'fill': "freeze"
                    }));
                    svg.appendChild(day);
                }
                animStartX++;
            }
        }
    }
};