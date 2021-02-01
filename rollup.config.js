import {terser} from 'rollup-plugin-terser';
import resolve from 'rollup-plugin-node-resolve';
import globals from 'rollup-plugin-node-globals';

import commonjs from 'rollup-plugin-commonjs';
import babel from "rollup-plugin-babel";
import json from 'rollup-plugin-json';
import replace from 'rollup-plugin-replace';

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;

let apiHost = process.env.SDK_API_HOST || 'http://localhost:3002/collect';
let version = process.env.SDK_VERSION || require('./package.json').version || 'beta';
// remove the # used to escape the
apiHost = apiHost.replace(/#/g, ':');


/**
 *
 */
export default {
    input: 'web-sdk-cli/src/main.js',
    format: 'iife',
    output: {
        file: production ? 'public/assets/sdk.js' : 'public/assets/sdk-test.js',
        format: 'iife', // immediately-invoked function expression — suitable for <script> tags
        sourcemap: !production,
    },
    plugins: [
        replace({
            values: {
                'SDK_API_HOST': apiHost,
                'SDK_VERSION': version
            },
        }),
        resolve({jsnext: true, preferBuiltins: true, browser: true, main: true}),
        commonjs({
            // non-CommonJS modules will be ignored, but you can also
            // specifically include/exclude files
            include: 'node_modules/**',  // Default: undefined
            browser: true,
            preferBuiltins: false,
            // if true then uses of `global` won't be dealt with by this plugin
            ignoreGlobal: false,  // Default: false

            // if false then skip sourceMap generation for CommonJS modules
            sourceMap: false  // Default: true

            // explicitly specify unresolvable named exports
            // (see below for more details)
            // namedExports: { './module.js': ['foo', 'bar' ] }  // Default: undefined
        }),
        json(),
        babel({
            runtimeHelpers: true,
            exclude: "node_modules/**",
            plugins: [
                [
                    "@babel/plugin-proposal-class-properties",
                    {
                        "loose": true
                    }
                ]
            ]
        }),
        globals,
        production && terser() // minify, but only in production
    ]
};
