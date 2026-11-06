(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["rive"] = factory();
	else
		root["rive"] = factory();
})(this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Animation: () => (/* reexport safe */ _Animation__WEBPACK_IMPORTED_MODULE_0__.Animation)
/* harmony export */ });
/* harmony import */ var _Animation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);



/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Animation: () => (/* binding */ Animation)
/* harmony export */ });
/**
 * Represents an animation that can be played on an Artboard.
 * Wraps animations and instances from the runtime and keeps track of playback state.
 *
 * The `Animation` class manages the state and behavior of a single animation instance,
 * including its current time, loop count, and ability to scrub to a specific time.
 *
 * The class provides methods to advance the animation, apply its interpolated keyframe
 * values to the Artboard, and clean up the underlying animation instance when the
 * animation is no longer needed.
 */
var Animation = /** @class */ (function () {
    /**
     * Constructs a new animation
     * @constructor
     * @param {any} animation: runtime animation object
     * @param {any} instance: runtime animation instance object
     */
    function Animation(animation, artboard, runtime, playing) {
        this.animation = animation;
        this.artboard = artboard;
        this.playing = playing;
        this.loopCount = 0;
        /**
         * The time to which the animation should move to on the next render.
         * If not null, the animation will scrub to this time instead of advancing by the given time.
         */
        this.scrubTo = null;
        this.instance = new runtime.LinearAnimationInstance(animation, artboard);
    }
    Object.defineProperty(Animation.prototype, "name", {
        /**
         * Returns the animation's name
         */
        get: function () {
            return this.animation.name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Animation.prototype, "time", {
        /**
         * Returns the animation's name
         */
        get: function () {
            return this.instance.time;
        },
        /**
         * Sets the animation's current time
         */
        set: function (value) {
            this.instance.time = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Animation.prototype, "loopValue", {
        /**
         * Returns the animation's loop type
         */
        get: function () {
            return this.animation.loopValue;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Animation.prototype, "needsScrub", {
        /**
         * Indicates whether the animation needs to be scrubbed.
         * @returns `true` if the animation needs to be scrubbed, `false` otherwise.
         */
        get: function () {
            return this.scrubTo !== null;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Advances the animation by the give time. If the animation needs scrubbing,
     * time is ignored and the stored scrub value is used.
     * @param time the time to advance the animation by if no scrubbing required
     */
    Animation.prototype.advance = function (time) {
        if (this.scrubTo === null) {
            this.instance.advance(time);
        }
        else {
            this.instance.time = 0;
            this.instance.advance(this.scrubTo);
            this.scrubTo = null;
        }
    };
    /**
     * Apply interpolated keyframe values to the artboard. This should be called after calling
     * .advance() on an animation instance so that new values are applied to properties.
     *
     * Note: This does not advance the artboard, which updates all objects on the artboard
     * @param mix - Mix value for the animation from 0 to 1
     */
    Animation.prototype.apply = function (mix) {
        this.instance.apply(mix);
    };
    /**
     * Deletes the backing Wasm animation instance; once this is called, this
     * animation is no more.
     */
    Animation.prototype.cleanup = function () {
        this.instance.delete();
    };
    return Animation;
}());



/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RuntimeLoader: () => (/* binding */ RuntimeLoader)
/* harmony export */ });
/* harmony import */ var _rive_advanced_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var package_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5);
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};


// Runtime singleton; use getInstance to provide a callback that returns the
// Rive runtime
var RuntimeLoader = /** @class */ (function () {
    // Class is never instantiated
    function RuntimeLoader() {
    }
    // Rejects all pending awaitInstance() promises and resets loading state so
    // the next call to getInstance() / awaitInstance() can retry with a new URL.
    RuntimeLoader.notifyError = function (error) {
        var _a;
        RuntimeLoader.isLoading = false;
        while (RuntimeLoader.errorCallbackQueue.length > 0) {
            (_a = RuntimeLoader.errorCallbackQueue.shift()) === null || _a === void 0 ? void 0 : _a(error);
        }
        RuntimeLoader.callBackQueue = [];
    };
    // Loads the runtime
    RuntimeLoader.loadRuntime = function () {
        // Capture the URL at call time so the catch closure always refers to the
        // URL this particular attempt used, even if wasmURL is mutated for a retry.
        var attemptedUrl = RuntimeLoader.wasmURL;
        var wasmBinary = RuntimeLoader.wasmBinary;
        if (RuntimeLoader.enablePerfMarks)
            performance.mark('rive:wasm-init:start');
        _rive_advanced_mjs__WEBPACK_IMPORTED_MODULE_0__["default"](__assign({ 
            // Loads Wasm bundle
            locateFile: function () { return attemptedUrl; } }, (wasmBinary ? { wasmBinary: wasmBinary } : {})))
            .then(function (rive) {
            var _a;
            if (RuntimeLoader.enablePerfMarks) {
                performance.mark('rive:wasm-init:end');
                performance.measure('rive:wasm-init', 'rive:wasm-init:start', 'rive:wasm-init:end');
            }
            RuntimeLoader.runtime = rive;
            RuntimeLoader.errorCallbackQueue = [];
            // Fire all the callbacks
            while (RuntimeLoader.callBackQueue.length > 0) {
                (_a = RuntimeLoader.callBackQueue.shift()) === null || _a === void 0 ? void 0 : _a(RuntimeLoader.runtime);
            }
        })
            .catch(function (error) {
            // Capture specific error details
            var errorDetails = {
                message: (error === null || error === void 0 ? void 0 : error.message) || "Unknown error",
                type: (error === null || error === void 0 ? void 0 : error.name) || "Error",
                // Some browsers may provide additional WebAssembly-specific details
                wasmError: error instanceof WebAssembly.CompileError ||
                    error instanceof WebAssembly.RuntimeError,
                originalError: error,
            };
            // Log detailed error for debugging
            console.debug("Rive WASM load error details:", errorDetails);
            // In case the primary URL fails, or the wasm was not supported, try the
            // fallback URL (a rive_fallback.wasm compiled for older architectures).
            // The fallback can be customised or disabled via setWasmFallbackUrl().
            // TODO: (Gordon): preemptively test browser support and load the correct wasm file. Then use the fallback only if the primary fails.
            var fallbackUrl = RuntimeLoader.wasmFallbackURL;
            var alreadyOnFallback = fallbackUrl !== null &&
                attemptedUrl.toLowerCase() === fallbackUrl.toLowerCase();
            if (fallbackUrl !== null && !alreadyOnFallback) {
                console.warn("Failed to load WASM from ".concat(attemptedUrl, " (").concat(errorDetails.message, "), trying fallback URL: ").concat(fallbackUrl));
                // Clear wasmBinary so the retry actually fetches via locateFile
                // instead of re-using the same (failing) in-memory binary.
                RuntimeLoader.wasmBinary = null;
                RuntimeLoader.setWasmUrl(fallbackUrl);
                RuntimeLoader.loadRuntime();
            }
            else {
                // When alreadyOnFallback is true, wasmURL has already been overwritten
                // with the fallback URL, so we can no longer recover the original
                // primary URL here. The primary URL was logged in the earlier warning.
                var triedUrls = alreadyOnFallback
                    ? "the configured WASM URL or its fallback (".concat(fallbackUrl, ")")
                    : attemptedUrl;
                var errorMessage = [
                    "Could not load Rive WASM file from ".concat(triedUrls, "."),
                    "Possible reasons:",
                    "- Network connection is down",
                    "- WebAssembly is not supported in this environment",
                    "- The WASM file is corrupted or incompatible",
                    "\nError details:",
                    "- Type: ".concat(errorDetails.type),
                    "- Message: ".concat(errorDetails.message),
                    "- WebAssembly-specific error: ".concat(errorDetails.wasmError),
                    "\nTo resolve, you may need to:",
                    "1. Check your network connection",
                    "2. Set a new WASM source via RuntimeLoader.setWasmUrl()",
                    "3. Call RuntimeLoader.awaitInstance() again",
                ].join("\n");
                console.error(errorMessage);
                RuntimeLoader.notifyError(new Error(errorMessage));
            }
        });
    };
    // Provides a runtime instance via a callback
    RuntimeLoader.getInstance = function (callback, onError) {
        // If it's not loading, start loading runtime
        if (!RuntimeLoader.isLoading) {
            RuntimeLoader.isLoading = true;
            RuntimeLoader.loadRuntime();
        }
        if (!RuntimeLoader.runtime) {
            RuntimeLoader.callBackQueue.push(callback);
            if (onError) {
                RuntimeLoader.errorCallbackQueue.push(onError);
            }
        }
        else {
            callback(RuntimeLoader.runtime);
        }
    };
    // Provides a runtime instance via a promise; rejects if WASM fails to load.
    RuntimeLoader.awaitInstance = function () {
        return new Promise(function (resolve, reject) {
            return RuntimeLoader.getInstance(resolve, reject);
        });
    };
    // Manually sets the wasm url
    RuntimeLoader.setWasmUrl = function (url) {
        RuntimeLoader.wasmURL = url;
    };
    // Gets the current wasm url
    RuntimeLoader.getWasmUrl = function () {
        return RuntimeLoader.wasmURL;
    };
    /**
     * Sets the URL used as a fallback when the primary WASM URL fails to load.
     * Pass `null` to disable the fallback entirely.
     *
     * Defaults to pulling from the jsdelivr CDN.
     */
    RuntimeLoader.setWasmFallbackUrl = function (url) {
        RuntimeLoader.wasmFallbackURL = url;
    };
    // Gets the current fallback wasm url (null means fallback is disabled)
    RuntimeLoader.getWasmFallbackUrl = function () {
        return RuntimeLoader.wasmFallbackURL;
    };
    // Manually sets the wasm binary or clears it with null
    RuntimeLoader.setWasmBinary = function (value) {
        if ((value instanceof ArrayBuffer) || value === null) {
            RuntimeLoader.wasmBinary = value;
            return;
        }
        console.error("setWasmBinary expects an ArrayBuffer or null");
    };
    // Gets the current wasm build as ArrayBuffer or null
    RuntimeLoader.getWasmBinary = function () {
        return RuntimeLoader.wasmBinary;
    };
    // Flag to indicate that loading has started/completed
    RuntimeLoader.isLoading = false;
    // List of callbacks for the runtime that come in while loading
    RuntimeLoader.callBackQueue = [];
    // Path to the Wasm file; default path works for testing only;
    // if embedded wasm is used then this is never used.
    RuntimeLoader.wasmURL = "https://unpkg.com/".concat(package_json__WEBPACK_IMPORTED_MODULE_1__.name, "@").concat(package_json__WEBPACK_IMPORTED_MODULE_1__.version, "/rive.wasm");
    // Fallback WASM URL tried when the primary URL fails. Set to null to disable
    // the fallback entirely. Defaults to pulling from the jsdelivr CDN.
    RuntimeLoader.wasmFallbackURL = "https://cdn.jsdelivr.net/npm/".concat(package_json__WEBPACK_IMPORTED_MODULE_1__.name, "@").concat(package_json__WEBPACK_IMPORTED_MODULE_1__.version, "/rive_fallback.wasm");
    RuntimeLoader.wasmBinary = null;
    // Error callbacks enqueued from .getInstance()
    RuntimeLoader.errorCallbackQueue = [];
    /**
     * When true, performance.mark / performance.measure entries are emitted for
     * WASM initialization.
     */
    RuntimeLoader.enablePerfMarks = false;
    return RuntimeLoader;
}());



/***/ }),
/* 4 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var Rive=(()=>{var _scriptName=globalThis.document?.currentScript?.src;return async function(moduleArg={}){var moduleRtn;var D=moduleArg,aa=!!globalThis.window,ca=!!globalThis.WorkerGlobalScope;
function da(){function c(z){const A=q;l=e=0;q=new Map;A.forEach(C=>{try{C(z)}catch(G){console.error(G)}});this.Ra();x&&x.ub()}let e=0,l=0,q=new Map,x=null,y=null;this.requestAnimationFrame=function(z){e||=requestAnimationFrame(c.bind(this));const A=++l;q.set(A,z);return A};this.cancelAnimationFrame=function(z){q.delete(z);e&&0==q.size&&(cancelAnimationFrame(e),e=0)};this.qb=function(z){y&&(document.body.remove(y),y=null);z||(y=document.createElement("div"),y.style.backgroundColor="black",y.style.position=
"fixed",y.style.right=0,y.style.top=0,y.style.color="white",y.style.padding="4px",y.innerHTML="RIVE FPS",z=function(A){y.innerHTML="RIVE FPS "+A.toFixed(1)},document.body.appendChild(y));x=new function(){let A=0,C=0;this.ub=function(){var G=performance.now();C?(++A,G-=C,1E3<G&&(z(1E3*A/G),A=C=0)):(C=G,A=0)}}};this.Ra=function(){}}
function ea(){console.assert(!0);const c=new Map;let e=-Infinity;this.push=function(l){l=l+255>>8;c.has(l)&&clearTimeout(c.get(l));c.set(l,setTimeout(function(){c.delete(l);0==c.length?e=-Infinity:l==e&&(e=Math.max(...c.keys()),console.assert(e<l))},1E3));e=Math.max(l,e);return e<<8}}const fa=D.onRuntimeInitialized;
D.onRuntimeInitialized=function(){fa&&fa();D.startFileScripts=function(z){const A=D.riveScripting;return z&&A&&z.startScripts?A.prepare().then(function(){z.startScripts();return z}):Promise.resolve(z)};let c=D.decodeAudio;D.decodeAudio=function(z,A,C=null){z=c(z,C??null);A(z)};let e=D.decodeFont;D.decodeFont=function(z,A,C=null){z=e(z,C??null);A(z)};const l=D.FileAsset.prototype.decode;D.FileAsset.prototype.decode=function(z,A){return l.call(this,z,A??null)};let q=D.setFallbackFontCb;D.setFallbackFontCallback=
"function"===typeof q?function(z){q(z)}:function(){console.warn("Module.setFallbackFontCallback called, but text support is not enabled in this build.")};const x=D.FileAssetLoader;D.ptrToAsset=z=>{let A=D.ptrToFileAsset(z);return A.isImage?D.ptrToImageAsset(z):A.isFont?D.ptrToFontAsset(z):A.isAudio?D.ptrToAudioAsset(z):A};D.CustomFileAssetLoader=x.extend("CustomFileAssetLoader",{__construct:function({loadContents:z}){this.__parent.__construct.call(this);this.eb=z},loadContents:function(z,A){z=D.ptrToAsset(z);
return this.eb(z,A)}});D.CDNFileAssetLoader=x.extend("CDNFileAssetLoader",{__construct:function(z){this.__parent.__construct.call(this);this.gb=z??null},loadContents:function(z){let A=D.ptrToAsset(z);z=A.cdnUuid;if(""===z)return!1;const C=this.gb??null;(function(G,u){var a=new XMLHttpRequest;a.responseType="arraybuffer";a.onreadystatechange=function(){4==a.readyState&&200==a.status&&u(a)};a.open("GET",G,!0);a.send(null)})(A.cdnBaseUrl+"/"+z,G=>{A.decode(new Uint8Array(G.response),C)});return!0}});
D.FallbackFileAssetLoader=x.extend("FallbackFileAssetLoader",{__construct:function(){this.__parent.__construct.call(this);this.Qa=[]},addLoader:function(z){this.Qa.push(z)},loadContents:function(z,A){for(let C of this.Qa)if(C.loadContents(z,A))return!0;return!1}});let y=D.computeAlignment;D.computeAlignment=function(z,A,C,G,u=1){return y.call(this,z,A,C,G,u)}};
(function(){function c(u,a){const d=u.kb,r=u.da,p=u.ca,v=u.Ba??{i:!1},f=(k,h)=>{k=new Uint8Array(a().buffer,k,h);const m=4096<h?u.Ga(h):u.ua(h);if(0===m)throw Error(`could not stage ${h} bytes for the host`);u.Z().set(k,m);v.i&&(v.la+=h);return m},b=(k,h)=>{0!==k&&4096<h&&u.Da(k)},g=(k,h,m)=>{(new Uint8Array(a().buffer,h,m)).set(u.Z().subarray(k,k+m));v.i&&(v.ja+=m)},n=k=>h=>{const m=(new Uint32Array(a().buffer,h-4,1))[0],w=r();let t=0;try{t=f(h,m),d.md(k,t,m)}finally{b(t,m),p(w)}};return{env:{seed:()=>
Date.now()*Math.random(),emscripten_get_now:()=>performance.now(),emscripten_date_now:()=>Date.now(),trace:(k,h,m,w,t,B,F)=>{var H=console,K=H.log;const P=a().buffer,ba=(new Uint32Array(P,k-4,1))[0];k=(new TextDecoder("utf-16le")).decode(new Uint8Array(P,k,ba));return K.call(H,"trace: "+k,...[m,w,t,B,F].slice(0,h))},"console.log":n(0),"console.debug":n(0),"console.info":n(0),"console.warn":n(0),"console.error":n(0),"console.time":n(1),"console.timeLog":n(2),"console.timeEnd":n(3)},rive_rt_v1:{log:(k,
h,m)=>{const w=r();let t=0;try{t=f(h,m),d.Zg(k,t,m)}finally{b(t,m),p(w)}},mark_needs_update:d.$g,budget_exceeded:d.Tg,error:(k,h)=>{const m=r();let w=0;try{w=f(k,h),d.Xg(w,h)}finally{b(w,h),p(m)}},now:()=>performance.now(),date_now:()=>Date.now(),debug_enter:d.Ug,debug_line:d.Wg,debug_leave:d.Vg,utc_offset:d.ah,is_dst:d.Yg,zone_name:(k,h,m)=>{const w=r();let t=0;try{t=f(h,m);const B=d.bh(k,t,m);g(t,h,m);return B}finally{b(t,m),p(w)}}},rive_data_v1:{view_model:d.ie,root_view_model:d.ce,global_view_model:(k,
h,m)=>{const w=r();let t=0;try{return t=f(h,m),d.Jd(k,t,m)}finally{b(t,m),p(w)}},global_view_model_names:(k,h,m)=>{const w=r();let t=0;try{t=f(h,m);const B=d.Kd(k,t,m);g(t,h,m);return B}finally{b(t,m),p(w)}},context:d.yd,context_parent:d.zd,context_view_model:d.Bd,context_release:d.Ad,has_view_model:(k,h)=>{const m=r();let w=0;try{return w=f(k,h),d.Ld(w,h)}finally{b(w,h),p(m)}},new_view_model:(k,h,m,w)=>{const t=r();let B=0,F=0;try{return B=f(k,h),F=f(m,w),d.Zd(B,h,F,w)}finally{b(F,w),b(B,h),p(t)}},
vmi_release:d.xe,vmi_number:(k,h,m)=>{const w=r();let t=0;try{return t=f(h,m),d.ve(k,t,m)}finally{b(t,m),p(w)}},vmi_boolean:(k,h,m)=>{const w=r();let t=0;try{return t=f(h,m),d.ne(k,t,m)}finally{b(t,m),p(w)}},vmi_string:(k,h,m)=>{const w=r();let t=0;try{return t=f(h,m),d.ye(k,t,m)}finally{b(t,m),p(w)}},vmi_trigger:(k,h,m)=>{const w=r();let t=0;try{return t=f(h,m),d.Ae(k,t,m)}finally{b(t,m),p(w)}},vmi_color:(k,h,m)=>{const w=r();let t=0;try{return t=f(h,m),d.oe(k,t,m)}finally{b(t,m),p(w)}},vmi_view_model:(k,
h,m)=>{const w=r();let t=0;try{return t=f(h,m),d.Be(k,t,m)}finally{b(t,m),p(w)}},vmi_property:(k,h,m,w,t)=>{const B=r();let F=0,H=0;try{F=f(h,m);H=f(w,4*t);const K=d.we(k,F,m,H,t);g(H,w,4*t);return K}finally{b(H,4*t),b(F,m),p(B)}},vmi_instance:(k,h,m)=>{const w=r();let t=0;try{return t=f(h,m),d.te(k,t,m)}finally{b(t,m),p(w)}},vmi_symbol_index:d.ze,vmi_equal:d.qe,view_model_get:d.je,vmi_list:(k,h,m)=>{const w=r();let t=0;try{return t=f(h,m),d.ue(k,t,m)}finally{b(t,m),p(w)}},vmi_enum:(k,h,m)=>{const w=
r();let t=0;try{return t=f(h,m),d.pe(k,t,m)}finally{b(t,m),p(w)}},vmi_image:(k,h,m)=>{const w=r();let t=0;try{return t=f(h,m),d.se(k,t,m)}finally{b(t,m),p(w)}},vmi_font:(k,h,m)=>{const w=r();let t=0;try{return t=f(h,m),d.re(k,t,m)}finally{b(t,m),p(w)}},vmi_blob:(k,h,m)=>{const w=r();let t=0;try{return t=f(h,m),d.me(k,t,m)}finally{b(t,m),p(w)}},vmi_artboard:(k,h,m)=>{const w=r();let t=0;try{return t=f(h,m),d.le(k,t,m)}finally{b(t,m),p(w)}},image_get:d.Md,image_set:d.Nd,font_get:d.Gd,font_set:d.Id,
font_release:d.Hd,blob_present:d.sd,blob_get:(k,h,m)=>{const w=r();let t=0;try{t=f(h,m);const B=d.qd(k,t,m);g(t,h,m);return B}finally{b(t,m),p(w)}},blob_name:(k,h,m)=>{const w=r();let t=0;try{t=f(h,m);const B=d.rd(k,t,m);g(t,h,m);return B}finally{b(t,m),p(w)}},blob_set:(k,h,m)=>{const w=r();let t=0;try{t=f(h,m),d.td(k,t,m)}finally{b(t,m),p(w)}},blob_clear:d.pd,artboard_get:d.nd,artboard_set:d.od,enum_get:(k,h,m)=>{const w=r();let t=0;try{t=f(h,m);const B=d.Dd(k,t,m);g(t,h,m);return B}finally{b(t,
m),p(w)}},enum_set:(k,h,m)=>{const w=r();let t=0;try{t=f(h,m),d.Ed(k,t,m)}finally{b(t,m),p(w)}},enum_values:(k,h,m)=>{const w=r();let t=0;try{t=f(h,m);const B=d.Fd(k,t,m);g(t,h,m);return B}finally{b(t,m),p(w)}},prop_release:d.be,trigger_fire:d.ge,list_length:d.Rd,list_push:d.Td,list_pop:d.Sd,list_shift:d.Xd,list_clear:d.Od,list_swap:d.Yd,list_insert:d.Qd,list_remove:d.Ud,list_remove_at:d.Wd,list_remove_all_of:d.Vd,list_get:d.Pd,view_model_set:d.ke,color_get:d.wd,color_set:d.xd,number_get:d.$d,number_set:d.ae,
boolean_get:d.ud,boolean_set:d.vd,string_get:(k,h,m)=>{const w=r();let t=0;try{t=f(h,m);const B=d.ee(k,t,m);g(t,h,m);return B}finally{b(t,m),p(w)}},string_changed:d.de,string_set:(k,h,m)=>{const w=r();let t=0;try{t=f(h,m),d.fe(k,t,m)}finally{b(t,m),p(w)}},watch:d.Ce,unwatch:d.he,convert_result:(k,h,m,w,t,B)=>{const F=r();let H=0;try{H=f(t,B),d.Cd(k,h,m,w,H,B)}finally{b(H,B),p(F)}}},rive_artboard_v1:{release:d.vc,advance:d.Ob,draw:d.Wb,instance:d.fc,data:d.Vb,width:d.Ac,height:d.ec,set_width:d.zc,
set_height:d.yc,frame_origin:d.cc,set_frame_origin:d.xc,bounds:(k,h,m)=>{const w=r();let t=0;try{t=f(h,4*m),d.Ub(k,t,m),g(t,h,4*m)}finally{b(t,4*m),p(w)}},pointer_event:d.tc,scroll_event:d.wc,gamepad_event:(k,h,m)=>{const w=r();let t=0;try{return t=f(h,m),d.dc(k,t,m)}finally{b(t,m),p(w)}},animation:(k,h,m)=>{const w=r();let t=0;try{return t=f(h,m),d.Pb(k,t,m)}finally{b(t,m),p(w)}},animation_release:d.Sb,animation_duration:d.Rb,animation_advance:d.Qb,animation_set_time:d.Tb,add_to_path:d.Nb,node:(k,
h,m)=>{const w=r();let t=0;try{return t=f(h,m),d.hc(k,t,m)}finally{b(t,m),p(w)}},node_release:d.oc,node_transform:(k,h,m)=>{const w=r();let t=0;try{t=f(h,4*m),d.rc(k,t,m),g(t,h,4*m)}finally{b(t,4*m),p(w)}},node_set:d.pc,node_world_transform:(k,h,m)=>{const w=r();let t=0;try{t=f(h,4*m),d.sc(k,t,m),g(t,h,4*m)}finally{b(t,4*m),p(w)}},node_set_world_transform:(k,h,m)=>{const w=r();let t=0;try{t=f(h,4*m),d.qc(k,t,m)}finally{b(t,4*m),p(w)}},node_decompose:(k,h,m)=>{const w=r();let t=0;try{t=f(h,4*m),d.jc(k,
t,m)}finally{b(t,4*m),p(w)}},node_path_verbs:(k,h,m)=>{const w=r();let t=0;try{t=f(h,m);const B=d.nc(k,t,m);g(t,h,m);return B}finally{b(t,m),p(w)}},node_path_points:(k,h,m)=>{const w=r();let t=0;try{t=f(h,4*m);const B=d.mc(k,t,m);g(t,h,4*m);return B}finally{b(t,4*m),p(w)}},node_paint:(k,h,m)=>{const w=r();let t=0;try{t=f(h,4*m);const B=d.kc(k,t,m);g(t,h,4*m);return B}finally{b(t,4*m),p(w)}},node_children:(k,h,m)=>{const w=r();let t=0;try{t=f(h,4*m);const B=d.ic(k,t,m);g(t,h,4*m);return B}finally{b(t,
4*m),p(w)}},node_parent:d.lc,property_key:(k,h,m)=>{const w=r();let t=0;try{return t=f(h,m),d.uc(k,t,m)}finally{b(t,m),p(w)}},draw_visit:d.Yb,draw_modulated:d.Xb,drawable_draw:d.Zb,drawable_value:(k,h,m,w)=>{const t=r();let B=0;try{B=f(m,4*w);const F=d.bc(k,h,B,w);g(B,m,4*w);return F}finally{b(B,4*w),p(t)}},drawable_string:(k,h,m,w)=>{const t=r();let B=0;try{B=f(m,w);const F=d.ac(k,h,B,w);g(B,m,w);return F}finally{b(B,w),p(t)}},drawable_properties:(k,h,m)=>{const w=r();let t=0;try{t=f(h,m);const B=
d.$b(k,t,m);g(t,h,m);return B}finally{b(t,m),p(w)}}},rive_audio_v1:{source:(k,h,m)=>{const w=r();let t=0;try{return t=f(h,m),d.Tc(k,t,m)}finally{b(t,m),p(w)}},source_release:d.Wc,source_duration:d.Vc,source_sample_rate:d.Xc,source_channels:d.Uc,play:d.Bc,play_at_time:d.Dc,play_in_time:d.Fc,play_at_frame:d.Cc,play_in_frame:d.Ec,time:d.Yc,time_frame:d.Zc,sample_rate:d.Gc,sound_release:d.Kc,sound_play:d.Jc,sound_pause:d.Ic,sound_resume:d.Lc,sound_stop:d.Pc,sound_seek:d.Mc,sound_seek_frame:d.Nc,sound_completed:d.Hc,
sound_time:d.Qc,sound_time_frame:d.Rc,sound_volume:d.Sc,sound_set_volume:d.Oc},rive_path_v1:{"new":d.Eg,update:(k,h,m,w,t,B)=>{const F=r();let H=0,K=0;try{H=f(h,m),K=f(w,4*t),d.Hg(k,H,m,K,t,B)}finally{b(K,4*t),b(H,m),p(F)}},release:d.Gg,add:d.Cg,verbs:(k,h,m)=>{const w=r();let t=0;try{t=f(h,m);const B=d.Ig(k,t,m);g(t,h,m);return B}finally{b(t,m),p(w)}},points:(k,h,m)=>{const w=r();let t=0;try{t=f(h,4*m);const B=d.Fg(k,t,m);g(t,h,4*m);return B}finally{b(t,4*m),p(w)}},effect_result:(k,h,m,w)=>{const t=
r();let B=0,F=0;try{B=f(k,h),F=f(m,4*w),d.Dg(B,h,F,w)}finally{b(F,4*w),b(B,h),p(t)}}},rive_measure_v1:{path_new:(k,h,m,w)=>{const t=r();let B=0,F=0;try{return B=f(k,h),F=f(m,4*w),d.hg(B,h,F,w)}finally{b(F,4*w),b(B,h),p(t)}},contours_new:(k,h,m,w)=>{const t=r();let B=0,F=0;try{return B=f(k,h),F=f(m,4*w),d.cg(B,h,F,w)}finally{b(F,4*w),b(B,h),p(t)}},contour_next:d.bg,length:d.gg,is_closed:d.fg,pos_tan:(k,h,m,w)=>{const t=r();let B=0;try{B=f(m,4*w),d.ig(k,h,B,w),g(B,m,4*w)}finally{b(B,4*w),p(t)}},warp:(k,
h,m,w,t)=>{const B=r();let F=0;try{F=f(w,4*t),d.kg(k,h,m,F,t),g(F,w,4*t)}finally{b(F,4*t),p(B)}},extract:d.dg,extract_read:(k,h,m,w,t)=>{const B=r();let F=0,H=0;try{F=f(h,m);H=f(w,4*t);const K=d.eg(k,F,m,H,t);g(F,h,m);g(H,w,4*t);return K}finally{b(H,4*t),b(F,m),p(B)}},release:d.jg},rive_paint_v1:{"new":d.wg,release:d.xg,style:d.Ag,color:d.tg,thickness:d.Bg,join:d.vg,cap:d.sg,blend_mode:d.rg,feather:d.ug,shader:d.yg,shader_transform:(k,h,m)=>{const w=r();let t=0;try{t=f(h,4*m),d.zg(k,t,m)}finally{b(t,
4*m),p(w)}}},rive_canvas_v1:{"new":d.hd,release:d.jd,width:d.ld,height:d.fd,resize:d.kd,image:d.gd,begin_frame:d.dd,end_frame:d.ed},rive_gpu_v1:{features:(k,h)=>{const m=r();let w=0;try{w=f(k,4*h);const t=d.pf(w,h);g(w,k,4*h);return t}finally{b(w,4*h),p(m)}},canvas_new:d.lf,canvas_release:d.mf,canvas_color_view:(k,h,m)=>{const w=r();let t=0;try{t=f(h,4*m);const B=d.jf(k,t,m);g(t,h,4*m);return B}finally{b(t,4*m),p(w)}},canvas_image:d.kf,canvas_resize:(k,h,m,w,t)=>{const B=r();let F=0;try{F=f(w,4*t);
const H=d.nf(k,h,m,F,t);g(F,w,4*t);return H}finally{b(F,4*t),p(B)}},target_view:(k,h,m)=>{const w=r();let t=0;try{t=f(h,4*m);const B=d.Of(k,t,m);g(t,h,4*m);return B}finally{b(t,4*m),p(w)}},pass_begin:(k,h,m,w)=>{const t=r();let B=0,F=0;try{return B=f(k,h),F=f(m,w),d.rf(B,h,F,w)}finally{b(F,w),b(B,h),p(t)}},pass_set_pipeline:d.zf,pass_set_vertex_buffer:d.Cf,pass_set_index_buffer:d.yf,pass_set_bind_group:(k,h,m,w,t)=>{const B=r();let F=0;try{F=f(w,t),d.wf(k,h,m,F,t)}finally{b(F,t),p(B)}},pass_set_viewport:d.Df,
pass_set_scissor:d.Af,pass_set_stencil_reference:d.Bf,pass_set_blend_color:d.xf,pass_draw:d.sf,pass_draw_indexed:d.tf,pass_finish:d.uf,pass_release:d.vf,image_view:d.qf,buffer_new:(k,h,m,w,t)=>{const B=r();let F=0;try{return F=f(w,t),d.ff(k,h,m,F,t)}finally{b(F,t),p(B)}},buffer_update:(k,h,m,w)=>{const t=r();let B=0;try{B=f(m,w),d.hf(k,h,B,w)}finally{b(B,w),p(t)}},buffer_release:d.gf,texture_new:(k,h)=>{const m=r();let w=0;try{return w=f(k,h),d.Pf(w,h)}finally{b(w,h),p(m)}},texture_upload:(k,h,m,
w,t)=>{const B=r();let F=0,H=0;try{F=f(h,m),H=f(w,t),d.Rf(k,F,m,H,t)}finally{b(H,t),b(F,m),p(B)}},texture_release:d.Qf,sampler_new:(k,h)=>{const m=r();let w=0;try{return w=f(k,h),d.Gf(w,h)}finally{b(w,h),p(m)}},sampler_release:d.Hf,texture_view_new:(k,h,m)=>{const w=r();let t=0;try{return t=f(h,m),d.Sf(k,t,m)}finally{b(t,m),p(w)}},texture_view_release:d.Tf,shader_target:d.Nf,shader_asset_bytes:(k,h,m,w,t)=>{const B=r();let F=0,H=0;try{F=f(h,m);H=f(w,t);const K=d.If(k,F,m,H,t);g(H,w,t);return K}finally{b(H,
t),b(F,m),p(B)}},shader_asset_id:(k,h,m)=>{const w=r();let t=0;try{return t=f(h,m),d.Jf(k,t,m)}finally{b(t,m),p(w)}},shader_module_from_asset:(k,h,m,w)=>{const t=r();let B=0;try{return B=f(h,m),d.Kf(k,B,m,w)}finally{b(B,m),p(t)}},shader_module_new:(k,h,m,w)=>{const t=r();let B=0,F=0;try{return B=f(k,h),F=f(m,w),d.Lf(B,h,F,w)}finally{b(F,w),b(B,h),p(t)}},shader_module_release:d.Mf,bind_group_layout_new:(k,h,m)=>{const w=r();let t=0;try{return t=f(h,m),d.bf(k,t,m)}finally{b(t,m),p(w)}},bind_group_layout_release:d.cf,
bind_group_layout_from_shader:(k,h,m,w)=>{const t=r();let B=0;try{return B=f(m,4*w),d.$e(k,h,B,w)}finally{b(B,4*w),p(t)}},bind_group_layout_from_shaders:(k,h,m,w,t)=>{const B=r();let F=0;try{return F=f(w,4*t),d.af(k,h,m,F,t)}finally{b(F,4*t),p(B)}},bind_group_new:(k,h,m,w,t,B,F)=>{const H=r();let K=0,P=0,ba=0;try{return K=f(h,m),P=f(w,t),ba=f(B,F),d.df(k,K,m,P,t,ba,F)}finally{b(ba,F),b(P,t),b(K,m),p(H)}},bind_group_release:d.ef,pipeline_new:(k,h,m,w)=>{const t=r();let B=0,F=0;try{return B=f(k,h),
F=f(m,w),d.Ef(B,h,F,w)}finally{b(F,w),b(B,h),p(t)}},pipeline_release:d.Ff},rive_mat4_v1:{multiply:(k,h,m,w,t,B)=>{const F=r();let H=0,K=0,P=0;try{H=f(k,h),K=f(m,w),P=f(t,B),d.ag(H,h,K,w,P,B),g(H,k,h)}finally{b(P,B),b(K,w),b(H,h),p(F)}},invert:(k,h,m,w)=>{const t=r();let B=0,F=0;try{B=f(k,h);F=f(m,w);const H=d.$f(B,h,F,w);g(B,k,h);return H}finally{b(F,w),b(B,h),p(t)}}},rive_buffer_v1:{"new":d.ad,update:(k,h,m)=>{const w=r();let t=0;try{t=f(h,m),d.cd(k,t,m)}finally{b(t,m),p(w)}},release:d.bd},rive_mesh_instances_v1:{"new":d.lg,
resize:d.ng,update:(k,h,m,w)=>{const t=r();let B=0;try{B=f(m,w),d.og(k,h,B,w)}finally{b(B,w),p(t)}},release:d.mg},rive_blob_v1:{asset_bytes:(k,h,m,w,t)=>{const B=r();let F=0,H=0;try{F=f(h,m);H=f(w,t);const K=d.$c(k,F,m,H,t);g(H,w,t);return K}finally{b(H,t),b(F,m),p(B)}}},rive_image_v1:{from_asset:(k,h,m)=>{const w=r();let t=0;try{return t=f(h,m),d.Wf(k,t,m)}finally{b(t,m),p(w)}},width:d.Zf,height:d.Xf,release:d.Yf,decode:(k,h,m)=>{const w=r();let t=0;try{return t=f(k,h),d.Uf(t,h,m)}finally{b(t,h),
p(w)}},decode_cancel:d.Vf},rive_font_v1:{from_asset:(k,h,m)=>{const w=r();let t=0;try{return t=f(h,m),d.Re(k,t,m)}finally{b(t,m),p(w)}},decode:(k,h)=>{const m=r();let w=0;try{return w=f(k,h),d.Pe(w,h)}finally{b(w,h),p(m)}},release:d.Xe,metrics:(k,h,m)=>{const w=r();let t=0;try{t=f(h,4*m),d.We(k,t,m),g(t,h,4*m)}finally{b(t,4*m),p(w)}},weight:d.Ye,is_italic:d.Ve,axis_count:d.Ne,axis:(k,h,m,w)=>{const t=r();let B=0;try{B=f(m,4*w),d.Me(k,h,B,w),g(B,m,4*w)}finally{b(B,4*w),p(t)}},axis_value:d.Oe,features:(k,
h,m)=>{const w=r();let t=0;try{t=f(h,4*m);const B=d.Qe(k,t,m);g(t,h,4*m);return B}finally{b(t,4*m),p(w)}},has_glyph:d.Ue,with_options:(k,h,m,w,t)=>{const B=r();let F=0,H=0;try{return F=f(h,4*m),H=f(w,4*t),d.Ze(k,F,m,H,t)}finally{b(H,4*t),b(F,4*m),p(B)}},glyph_verbs:(k,h,m,w)=>{const t=r();let B=0;try{B=f(m,w);const F=d.Te(k,h,B,w);g(B,m,w);return F}finally{b(B,w),p(t)}},glyph_points:(k,h,m,w)=>{const t=r();let B=0;try{B=f(m,4*w);const F=d.Se(k,h,B,w);g(B,m,4*w);return F}finally{b(B,4*w),p(t)}}},rive_text_v1:{"new":d.rh,
release:d.sh,append:(k,h,m,w,t,B,F,H,K)=>{const P=r();let ba=0;try{ba=f(h,m),d.hh(k,ba,m,w,t,B,F,H,K)}finally{b(ba,m),p(P)}},clear:d.kh,layout:(k,h,m)=>{const w=r();let t=0;try{t=f(h,m),d.oh(k,t,m)}finally{b(t,m),p(w)}},draw:d.lh,bounds:(k,h,m)=>{const w=r();let t=0;try{t=f(h,4*m),d.ih(k,t,m),g(t,h,4*m)}finally{b(t,4*m),p(w)}},length:d.ph,lines:(k,h,m)=>{const w=r();let t=0;try{t=f(h,4*m);const B=d.qh(k,t,m);g(t,h,4*m);return B}finally{b(t,4*m),p(w)}},runs:(k,h,m)=>{const w=r();let t=0;try{t=f(h,
4*m);const B=d.th(k,t,m);g(t,h,4*m);return B}finally{b(t,4*m),p(w)}},glyphs:(k,h,m)=>{const w=r();let t=0;try{t=f(h,4*m);const B=d.mh(k,t,m);g(t,h,4*m);return B}finally{b(t,4*m),p(w)}},hit_test:d.nh,caret:(k,h,m,w)=>{const t=r();let B=0;try{B=f(m,4*w);const F=d.jh(k,h,B,w);g(B,m,4*w);return F}finally{b(B,4*w),p(t)}},selection_rects:(k,h,m,w,t)=>{const B=r();let F=0;try{F=f(w,4*t);const H=d.uh(k,h,m,F,t);g(F,w,4*t);return H}finally{b(F,4*t),p(B)}}},rive_shader_v1:{linear:d.dh,radial:d.eh,release:d.fh},
rive_test_v1:{blob:(k,h,m,w)=>{const t=r();let B=0,F=0;try{B=f(k,h);F=f(m,w);const H=d.gh(B,h,F,w);g(F,m,w);return H}finally{b(F,w),b(B,h),p(t)}}},rive_transition_v1:{child_draw:d.vh,child_width:d.xh,child_height:d.wh},rive_renderer_v1:{save:d.Rg,restore:d.Qg,transform:d.Sg,draw_path:d.Ng,clip_path:d.Jg,modulate_opacity:d.Pg,modulate_color:d.Og,draw_image:d.Kg,draw_image_mesh:d.Lg,draw_image_mesh_instanced:d.Mg},rive_net_v1:{fetch:(k,h,m)=>{const w=r();let t=0;try{return t=f(k,h),d.pg(t,h,m)}finally{b(t,
h),p(w)}},fetch_cancel:d.qg},rive_file_v1:{decode:(k,h,m,w)=>{const t=r();let B=0,F=0;try{B=f(k,h);F=f(m,4*w);const H=d.Ke(B,h,F,w);g(F,m,4*w);return H}finally{b(F,4*w),b(B,h),p(t)}},release:d.Le,artboard_count:d.De,artboard_name:(k,h,m,w)=>{const t=r();let B=0;try{B=f(m,w);const F=d.Ee(k,h,B,w);g(B,m,w);return F}finally{b(B,w),p(t)}},bindable:(k,h,m,w)=>{const t=r();let B=0;try{return B=f(h,m),d.Fe(k,B,m,w)}finally{b(B,m),p(t)}},bindable_release:d.Je,bindable_name:(k,h,m)=>{const w=r();let t=0;try{t=
f(h,m);const B=d.Ie(k,t,m);g(t,h,m);return B}finally{b(t,m),p(w)}},bindable_data:d.Ge,bindable_equal:d.He}}}function e(u,a){const d=a.Ba??{i:!1},r=()=>{const f=Error(a.j);a.j=null;throw f;},p=()=>{throw Error("librive faulted in a nested script call");},v=()=>{throw Error("script VM was released");};return{Zg:(f=>(b,g,n)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g,n)}catch(k){throw b=k,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(0)),$g:(f=>b=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b)}catch(g){throw b=g,a.h=!0,
b;}a.h&&p();null!==a.j&&r()})(u(1)),Tg:(f=>b=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b)}catch(g){throw b=g,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(2)),Xg:(f=>(b,g)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(3)),Ug:(f=>(b,g)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(4)),Wg:(f=>b=>{0===a.g&&v();d.i&&d.l++;let g;try{g=f(a.g,b)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r();return g})(u(5)),
Vg:(f=>()=>{0===a.g&&v();d.i&&d.l++;try{f(a.g)}catch(g){var b=g;a.h=!0;throw b;}a.h&&p();null!==a.j&&r()})(u(6)),ah:(f=>b=>{0===a.g&&v();d.i&&d.l++;let g;try{g=f(a.g,b)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r();return g})(u(7)),Yg:(f=>b=>{0===a.g&&v();d.i&&d.l++;let g;try{g=f(a.g,b)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r();return g})(u(8)),bh:(f=>(b,g,n)=>{0===a.g&&v();d.i&&d.l++;let k;try{k=f(a.g,b,g,n)}catch(h){throw b=h,a.h=!0,b;}a.h&&p();null!==a.j&&r();return k})(u(9)),
ie:(f=>b=>{0===a.g&&v();d.i&&d.l++;let g;try{g=f(a.g,b)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r();return g})(u(10)),ce:(f=>b=>{0===a.g&&v();d.i&&d.l++;let g;try{g=f(a.g,b)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r();return g})(u(11)),Jd:(f=>(b,g,n)=>{0===a.g&&v();d.i&&d.l++;let k;try{k=f(a.g,b,g,n)}catch(h){throw b=h,a.h=!0,b;}a.h&&p();null!==a.j&&r();return k})(u(12)),Kd:(f=>(b,g,n)=>{0===a.g&&v();d.i&&d.l++;let k;try{k=f(a.g,b,g,n)}catch(h){throw b=h,a.h=!0,b;}a.h&&p();null!==
a.j&&r();return k})(u(13)),yd:(f=>b=>{0===a.g&&v();d.i&&d.l++;let g;try{g=f(a.g,b)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r();return g})(u(14)),zd:(f=>b=>{0===a.g&&v();d.i&&d.l++;let g;try{g=f(a.g,b)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r();return g})(u(15)),Bd:(f=>b=>{0===a.g&&v();d.i&&d.l++;let g;try{g=f(a.g,b)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r();return g})(u(16)),Ad:(f=>b=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b)}catch(g){throw b=g,a.h=!0,b;}a.h&&p();null!==
a.j&&r()})(u(17)),Ld:(f=>(b,g)=>{0===a.g&&v();d.i&&d.l++;let n;try{n=f(a.g,b,g)}catch(k){throw b=k,a.h=!0,b;}a.h&&p();null!==a.j&&r();return n})(u(18)),Zd:(f=>(b,g,n,k)=>{0===a.g&&v();d.i&&d.l++;let h;try{h=f(a.g,b,g,n,k)}catch(m){throw b=m,a.h=!0,b;}a.h&&p();null!==a.j&&r();return h})(u(19)),xe:(f=>b=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b)}catch(g){throw b=g,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(20)),ve:(f=>(b,g,n)=>{0===a.g&&v();d.i&&d.l++;let k;try{k=f(a.g,b,g,n)}catch(h){throw b=h,a.h=!0,b;}a.h&&
p();null!==a.j&&r();return k})(u(21)),ne:(f=>(b,g,n)=>{0===a.g&&v();d.i&&d.l++;let k;try{k=f(a.g,b,g,n)}catch(h){throw b=h,a.h=!0,b;}a.h&&p();null!==a.j&&r();return k})(u(22)),ye:(f=>(b,g,n)=>{0===a.g&&v();d.i&&d.l++;let k;try{k=f(a.g,b,g,n)}catch(h){throw b=h,a.h=!0,b;}a.h&&p();null!==a.j&&r();return k})(u(23)),Ae:(f=>(b,g,n)=>{0===a.g&&v();d.i&&d.l++;let k;try{k=f(a.g,b,g,n)}catch(h){throw b=h,a.h=!0,b;}a.h&&p();null!==a.j&&r();return k})(u(24)),oe:(f=>(b,g,n)=>{0===a.g&&v();d.i&&d.l++;let k;try{k=
f(a.g,b,g,n)}catch(h){throw b=h,a.h=!0,b;}a.h&&p();null!==a.j&&r();return k})(u(25)),Be:(f=>(b,g,n)=>{0===a.g&&v();d.i&&d.l++;let k;try{k=f(a.g,b,g,n)}catch(h){throw b=h,a.h=!0,b;}a.h&&p();null!==a.j&&r();return k})(u(26)),we:(f=>(b,g,n,k,h)=>{0===a.g&&v();d.i&&d.l++;let m;try{m=f(a.g,b,g,n,k,h)}catch(w){throw b=w,a.h=!0,b;}a.h&&p();null!==a.j&&r();return m})(u(27)),te:(f=>(b,g,n)=>{0===a.g&&v();d.i&&d.l++;let k;try{k=f(a.g,b,g,n)}catch(h){throw b=h,a.h=!0,b;}a.h&&p();null!==a.j&&r();return k})(u(28)),
ze:(f=>b=>{0===a.g&&v();d.i&&d.l++;let g;try{g=f(a.g,b)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r();return g})(u(29)),qe:(f=>(b,g)=>{0===a.g&&v();d.i&&d.l++;let n;try{n=f(a.g,b,g)}catch(k){throw b=k,a.h=!0,b;}a.h&&p();null!==a.j&&r();return n})(u(30)),je:(f=>b=>{0===a.g&&v();d.i&&d.l++;let g;try{g=f(a.g,b)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r();return g})(u(31)),ue:(f=>(b,g,n)=>{0===a.g&&v();d.i&&d.l++;let k;try{k=f(a.g,b,g,n)}catch(h){throw b=h,a.h=!0,b;}a.h&&p();null!==
a.j&&r();return k})(u(32)),pe:(f=>(b,g,n)=>{0===a.g&&v();d.i&&d.l++;let k;try{k=f(a.g,b,g,n)}catch(h){throw b=h,a.h=!0,b;}a.h&&p();null!==a.j&&r();return k})(u(33)),se:(f=>(b,g,n)=>{0===a.g&&v();d.i&&d.l++;let k;try{k=f(a.g,b,g,n)}catch(h){throw b=h,a.h=!0,b;}a.h&&p();null!==a.j&&r();return k})(u(34)),re:(f=>(b,g,n)=>{0===a.g&&v();d.i&&d.l++;let k;try{k=f(a.g,b,g,n)}catch(h){throw b=h,a.h=!0,b;}a.h&&p();null!==a.j&&r();return k})(u(35)),me:(f=>(b,g,n)=>{0===a.g&&v();d.i&&d.l++;let k;try{k=f(a.g,b,
g,n)}catch(h){throw b=h,a.h=!0,b;}a.h&&p();null!==a.j&&r();return k})(u(36)),le:(f=>(b,g,n)=>{0===a.g&&v();d.i&&d.l++;let k;try{k=f(a.g,b,g,n)}catch(h){throw b=h,a.h=!0,b;}a.h&&p();null!==a.j&&r();return k})(u(37)),Md:(f=>b=>{0===a.g&&v();d.i&&d.l++;let g;try{g=f(a.g,b)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r();return g})(u(38)),Nd:(f=>(b,g)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(39)),Gd:(f=>b=>{0===a.g&&v();d.i&&d.l++;let g;
try{g=f(a.g,b)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r();return g})(u(40)),Id:(f=>(b,g)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(41)),Hd:(f=>b=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b)}catch(g){throw b=g,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(42)),sd:(f=>b=>{0===a.g&&v();d.i&&d.l++;let g;try{g=f(a.g,b)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r();return g})(u(43)),qd:(f=>(b,g,n)=>{0===a.g&&v();d.i&&d.l++;let k;try{k=f(a.g,
b,g,n)}catch(h){throw b=h,a.h=!0,b;}a.h&&p();null!==a.j&&r();return k})(u(44)),rd:(f=>(b,g,n)=>{0===a.g&&v();d.i&&d.l++;let k;try{k=f(a.g,b,g,n)}catch(h){throw b=h,a.h=!0,b;}a.h&&p();null!==a.j&&r();return k})(u(45)),td:(f=>(b,g,n)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g,n)}catch(k){throw b=k,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(46)),pd:(f=>b=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b)}catch(g){throw b=g,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(47)),nd:(f=>b=>{0===a.g&&v();d.i&&d.l++;let g;try{g=f(a.g,
b)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r();return g})(u(48)),od:(f=>(b,g)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(49)),Dd:(f=>(b,g,n)=>{0===a.g&&v();d.i&&d.l++;let k;try{k=f(a.g,b,g,n)}catch(h){throw b=h,a.h=!0,b;}a.h&&p();null!==a.j&&r();return k})(u(50)),Ed:(f=>(b,g,n)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g,n)}catch(k){throw b=k,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(51)),Fd:(f=>(b,g,n)=>{0===a.g&&v();d.i&&d.l++;let k;try{k=
f(a.g,b,g,n)}catch(h){throw b=h,a.h=!0,b;}a.h&&p();null!==a.j&&r();return k})(u(52)),be:(f=>b=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b)}catch(g){throw b=g,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(53)),ge:(f=>b=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b)}catch(g){throw b=g,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(54)),Rd:(f=>b=>{0===a.g&&v();d.i&&d.l++;let g;try{g=f(a.g,b)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r();return g})(u(55)),Td:(f=>(b,g)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g)}catch(n){throw b=
n,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(56)),Sd:(f=>b=>{0===a.g&&v();d.i&&d.l++;let g;try{g=f(a.g,b)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r();return g})(u(57)),Xd:(f=>b=>{0===a.g&&v();d.i&&d.l++;let g;try{g=f(a.g,b)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r();return g})(u(58)),Od:(f=>b=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b)}catch(g){throw b=g,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(59)),Yd:(f=>(b,g,n)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g,n)}catch(k){throw b=k,a.h=!0,b;}a.h&&
p();null!==a.j&&r()})(u(60)),Qd:(f=>(b,g,n)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g,n)}catch(k){throw b=k,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(61)),Ud:(f=>(b,g)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(62)),Wd:(f=>(b,g)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(63)),Vd:(f=>(b,g)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(64)),
Pd:(f=>(b,g)=>{0===a.g&&v();d.i&&d.l++;let n;try{n=f(a.g,b,g)}catch(k){throw b=k,a.h=!0,b;}a.h&&p();null!==a.j&&r();return n})(u(65)),ke:(f=>(b,g)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(66)),wd:(f=>b=>{0===a.g&&v();d.i&&d.l++;let g;try{g=f(a.g,b)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r();return g})(u(67)),xd:(f=>(b,g)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(68)),$d:(f=>
b=>{0===a.g&&v();d.i&&d.l++;let g;try{g=f(a.g,b)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r();return g})(u(69)),ae:(f=>(b,g)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(70)),ud:(f=>b=>{0===a.g&&v();d.i&&d.l++;let g;try{g=f(a.g,b)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r();return g})(u(71)),vd:(f=>(b,g)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(72)),ee:(f=>(b,g,n)=>{0===
a.g&&v();d.i&&d.l++;let k;try{k=f(a.g,b,g,n)}catch(h){throw b=h,a.h=!0,b;}a.h&&p();null!==a.j&&r();return k})(u(73)),de:(f=>b=>{0===a.g&&v();d.i&&d.l++;let g;try{g=f(a.g,b)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r();return g})(u(74)),fe:(f=>(b,g,n)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g,n)}catch(k){throw b=k,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(75)),Ce:(f=>(b,g)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(76)),he:(f=>b=>{0===a.g&&
v();d.i&&d.l++;try{f(a.g,b)}catch(g){throw b=g,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(77)),Cd:(f=>(b,g,n,k,h,m)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g,n,k,h,m)}catch(w){throw b=w,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(78)),vc:(f=>b=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b)}catch(g){throw b=g,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(79)),Ob:(f=>(b,g)=>{0===a.g&&v();d.i&&d.l++;let n;try{n=f(a.g,b,g)}catch(k){throw b=k,a.h=!0,b;}a.h&&p();null!==a.j&&r();return n})(u(80)),Wb:(f=>(b,g)=>{0===a.g&&v();d.i&&
d.l++;try{f(a.g,b,g)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(81)),fc:(f=>(b,g)=>{0===a.g&&v();d.i&&d.l++;let n;try{n=f(a.g,b,g)}catch(k){throw b=k,a.h=!0,b;}a.h&&p();null!==a.j&&r();return n})(u(82)),Vb:(f=>b=>{0===a.g&&v();d.i&&d.l++;let g;try{g=f(a.g,b)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r();return g})(u(83)),Ac:(f=>b=>{0===a.g&&v();d.i&&d.l++;let g;try{g=f(a.g,b)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r();return g})(u(84)),ec:(f=>b=>{0===a.g&&v();d.i&&
d.l++;let g;try{g=f(a.g,b)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r();return g})(u(85)),zc:(f=>(b,g)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(86)),yc:(f=>(b,g)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(87)),cc:(f=>b=>{0===a.g&&v();d.i&&d.l++;let g;try{g=f(a.g,b)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r();return g})(u(88)),xc:(f=>(b,g)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,
b,g)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(89)),Ub:(f=>(b,g,n)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g,n)}catch(k){throw b=k,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(90)),tc:(f=>(b,g,n,k,h)=>{0===a.g&&v();d.i&&d.l++;let m;try{m=f(a.g,b,g,n,k,h)}catch(w){throw b=w,a.h=!0,b;}a.h&&p();null!==a.j&&r();return m})(u(91)),wc:(f=>(b,g,n,k,h,m,w,t,B)=>{0===a.g&&v();d.i&&d.l++;let F;try{F=f(a.g,b,g,n,k,h,m,w,t,B)}catch(H){throw b=H,a.h=!0,b;}a.h&&p();null!==a.j&&r();return F})(u(92)),dc:(f=>
(b,g,n)=>{0===a.g&&v();d.i&&d.l++;let k;try{k=f(a.g,b,g,n)}catch(h){throw b=h,a.h=!0,b;}a.h&&p();null!==a.j&&r();return k})(u(93)),Pb:(f=>(b,g,n)=>{0===a.g&&v();d.i&&d.l++;let k;try{k=f(a.g,b,g,n)}catch(h){throw b=h,a.h=!0,b;}a.h&&p();null!==a.j&&r();return k})(u(94)),Sb:(f=>b=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b)}catch(g){throw b=g,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(95)),Rb:(f=>b=>{0===a.g&&v();d.i&&d.l++;let g;try{g=f(a.g,b)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r();return g})(u(96)),
Qb:(f=>(b,g)=>{0===a.g&&v();d.i&&d.l++;let n;try{n=f(a.g,b,g)}catch(k){throw b=k,a.h=!0,b;}a.h&&p();null!==a.j&&r();return n})(u(97)),Tb:(f=>(b,g,n)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g,n)}catch(k){throw b=k,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(98)),Nb:(f=>(b,g,n,k,h,m,w,t)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g,n,k,h,m,w,t)}catch(B){throw b=B,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(99)),hc:(f=>(b,g,n)=>{0===a.g&&v();d.i&&d.l++;let k;try{k=f(a.g,b,g,n)}catch(h){throw b=h,a.h=!0,b;}a.h&&p();null!==
a.j&&r();return k})(u(100)),oc:(f=>b=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b)}catch(g){throw b=g,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(101)),rc:(f=>(b,g,n)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g,n)}catch(k){throw b=k,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(102)),pc:(f=>(b,g,n,k)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g,n,k)}catch(h){throw b=h,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(103)),sc:(f=>(b,g,n)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g,n)}catch(k){throw b=k,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(104)),
qc:(f=>(b,g,n)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g,n)}catch(k){throw b=k,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(105)),jc:(f=>(b,g,n)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g,n)}catch(k){throw b=k,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(106)),nc:(f=>(b,g,n)=>{0===a.g&&v();d.i&&d.l++;let k;try{k=f(a.g,b,g,n)}catch(h){throw b=h,a.h=!0,b;}a.h&&p();null!==a.j&&r();return k})(u(107)),mc:(f=>(b,g,n)=>{0===a.g&&v();d.i&&d.l++;let k;try{k=f(a.g,b,g,n)}catch(h){throw b=h,a.h=!0,b;}a.h&&p();null!==a.j&&r();
return k})(u(108)),kc:(f=>(b,g,n)=>{0===a.g&&v();d.i&&d.l++;let k;try{k=f(a.g,b,g,n)}catch(h){throw b=h,a.h=!0,b;}a.h&&p();null!==a.j&&r();return k})(u(109)),ic:(f=>(b,g,n)=>{0===a.g&&v();d.i&&d.l++;let k;try{k=f(a.g,b,g,n)}catch(h){throw b=h,a.h=!0,b;}a.h&&p();null!==a.j&&r();return k})(u(110)),lc:(f=>b=>{0===a.g&&v();d.i&&d.l++;let g;try{g=f(a.g,b)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r();return g})(u(111)),uc:(f=>(b,g,n)=>{0===a.g&&v();d.i&&d.l++;let k;try{k=f(a.g,b,g,n)}catch(h){throw b=
h,a.h=!0,b;}a.h&&p();null!==a.j&&r();return k})(u(112)),Yb:(f=>(b,g)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(113)),Xb:(f=>(b,g,n)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g,n)}catch(k){throw b=k,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(114)),Zb:(f=>(b,g)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(115)),bc:(f=>(b,g,n,k)=>{0===a.g&&v();d.i&&d.l++;let h;try{h=f(a.g,b,g,n,k)}catch(m){throw b=
m,a.h=!0,b;}a.h&&p();null!==a.j&&r();return h})(u(116)),ac:(f=>(b,g,n,k)=>{0===a.g&&v();d.i&&d.l++;let h;try{h=f(a.g,b,g,n,k)}catch(m){throw b=m,a.h=!0,b;}a.h&&p();null!==a.j&&r();return h})(u(117)),$b:(f=>void 0===f?l("rive_artboard_v1","drawable_properties"):(b,g,n)=>{0===a.g&&v();d.i&&d.l++;let k;try{k=f(a.g,b,g,n)}catch(h){throw b=h,a.h=!0,b;}a.h&&p();null!==a.j&&r();return k})(u(118)),Tc:(f=>(b,g,n)=>{0===a.g&&v();d.i&&d.l++;let k;try{k=f(a.g,b,g,n)}catch(h){throw b=h,a.h=!0,b;}a.h&&p();null!==
a.j&&r();return k})(u(119)),Wc:(f=>b=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b)}catch(g){throw b=g,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(120)),Vc:(f=>b=>{0===a.g&&v();d.i&&d.l++;let g;try{g=f(a.g,b)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r();return g})(u(121)),Xc:(f=>b=>{0===a.g&&v();d.i&&d.l++;let g;try{g=f(a.g,b)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r();return g})(u(122)),Uc:(f=>b=>{0===a.g&&v();d.i&&d.l++;let g;try{g=f(a.g,b)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&
r();return g})(u(123)),Bc:(f=>b=>{0===a.g&&v();d.i&&d.l++;let g;try{g=f(a.g,b)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r();return g})(u(124)),Dc:(f=>(b,g)=>{0===a.g&&v();d.i&&d.l++;let n;try{n=f(a.g,b,g)}catch(k){throw b=k,a.h=!0,b;}a.h&&p();null!==a.j&&r();return n})(u(125)),Fc:(f=>(b,g)=>{0===a.g&&v();d.i&&d.l++;let n;try{n=f(a.g,b,g)}catch(k){throw b=k,a.h=!0,b;}a.h&&p();null!==a.j&&r();return n})(u(126)),Cc:(f=>(b,g)=>{0===a.g&&v();d.i&&d.l++;let n;try{n=f(a.g,b,g)}catch(k){throw b=
k,a.h=!0,b;}a.h&&p();null!==a.j&&r();return n})(u(127)),Ec:(f=>(b,g)=>{0===a.g&&v();d.i&&d.l++;let n;try{n=f(a.g,b,g)}catch(k){throw b=k,a.h=!0,b;}a.h&&p();null!==a.j&&r();return n})(u(128)),Yc:(f=>()=>{0===a.g&&v();d.i&&d.l++;try{var b=f(a.g)}catch(g){throw b=g,a.h=!0,b;}a.h&&p();null!==a.j&&r();return b})(u(129)),Zc:(f=>()=>{0===a.g&&v();d.i&&d.l++;try{var b=f(a.g)}catch(g){throw b=g,a.h=!0,b;}a.h&&p();null!==a.j&&r();return b})(u(130)),Gc:(f=>()=>{0===a.g&&v();d.i&&d.l++;try{var b=f(a.g)}catch(g){throw b=
g,a.h=!0,b;}a.h&&p();null!==a.j&&r();return b})(u(131)),Kc:(f=>b=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b)}catch(g){throw b=g,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(132)),Jc:(f=>b=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b)}catch(g){throw b=g,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(133)),Ic:(f=>b=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b)}catch(g){throw b=g,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(134)),Lc:(f=>b=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b)}catch(g){throw b=g,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(135)),
Pc:(f=>(b,g)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(136)),Mc:(f=>(b,g)=>{0===a.g&&v();d.i&&d.l++;let n;try{n=f(a.g,b,g)}catch(k){throw b=k,a.h=!0,b;}a.h&&p();null!==a.j&&r();return n})(u(137)),Nc:(f=>(b,g)=>{0===a.g&&v();d.i&&d.l++;let n;try{n=f(a.g,b,g)}catch(k){throw b=k,a.h=!0,b;}a.h&&p();null!==a.j&&r();return n})(u(138)),Hc:(f=>b=>{0===a.g&&v();d.i&&d.l++;let g;try{g=f(a.g,b)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r();return g})(u(139)),
Qc:(f=>b=>{0===a.g&&v();d.i&&d.l++;let g;try{g=f(a.g,b)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r();return g})(u(140)),Rc:(f=>b=>{0===a.g&&v();d.i&&d.l++;let g;try{g=f(a.g,b)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r();return g})(u(141)),Sc:(f=>b=>{0===a.g&&v();d.i&&d.l++;let g;try{g=f(a.g,b)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r();return g})(u(142)),Oc:(f=>(b,g)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(143)),
Eg:(f=>()=>{0===a.g&&v();d.i&&d.l++;try{var b=f(a.g)}catch(g){throw b=g,a.h=!0,b;}a.h&&p();null!==a.j&&r();return b})(u(144)),Hg:(f=>(b,g,n,k,h,m)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g,n,k,h,m)}catch(w){throw b=w,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(145)),Gg:(f=>b=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b)}catch(g){throw b=g,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(146)),Cg:(f=>(b,g,n,k,h,m,w,t)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g,n,k,h,m,w,t)}catch(B){throw b=B,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(147)),
Ig:(f=>(b,g,n)=>{0===a.g&&v();d.i&&d.l++;let k;try{k=f(a.g,b,g,n)}catch(h){throw b=h,a.h=!0,b;}a.h&&p();null!==a.j&&r();return k})(u(148)),Fg:(f=>(b,g,n)=>{0===a.g&&v();d.i&&d.l++;let k;try{k=f(a.g,b,g,n)}catch(h){throw b=h,a.h=!0,b;}a.h&&p();null!==a.j&&r();return k})(u(149)),Dg:(f=>(b,g,n,k)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g,n,k)}catch(h){throw b=h,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(150)),hg:(f=>(b,g,n,k)=>{0===a.g&&v();d.i&&d.l++;let h;try{h=f(a.g,b,g,n,k)}catch(m){throw b=m,a.h=!0,b;
}a.h&&p();null!==a.j&&r();return h})(u(151)),cg:(f=>(b,g,n,k)=>{0===a.g&&v();d.i&&d.l++;let h;try{h=f(a.g,b,g,n,k)}catch(m){throw b=m,a.h=!0,b;}a.h&&p();null!==a.j&&r();return h})(u(152)),bg:(f=>b=>{0===a.g&&v();d.i&&d.l++;let g;try{g=f(a.g,b)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r();return g})(u(153)),gg:(f=>b=>{0===a.g&&v();d.i&&d.l++;let g;try{g=f(a.g,b)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r();return g})(u(154)),fg:(f=>b=>{0===a.g&&v();d.i&&d.l++;let g;try{g=f(a.g,b)}catch(n){throw b=
n,a.h=!0,b;}a.h&&p();null!==a.j&&r();return g})(u(155)),ig:(f=>(b,g,n,k)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g,n,k)}catch(h){throw b=h,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(156)),kg:(f=>(b,g,n,k,h)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g,n,k,h)}catch(m){throw b=m,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(157)),dg:(f=>(b,g,n,k)=>{0===a.g&&v();d.i&&d.l++;let h;try{h=f(a.g,b,g,n,k)}catch(m){throw b=m,a.h=!0,b;}a.h&&p();null!==a.j&&r();return h})(u(158)),eg:(f=>(b,g,n,k,h)=>{0===a.g&&v();d.i&&d.l++;let m;
try{m=f(a.g,b,g,n,k,h)}catch(w){throw b=w,a.h=!0,b;}a.h&&p();null!==a.j&&r();return m})(u(159)),jg:(f=>b=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b)}catch(g){throw b=g,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(160)),wg:(f=>()=>{0===a.g&&v();d.i&&d.l++;try{var b=f(a.g)}catch(g){throw b=g,a.h=!0,b;}a.h&&p();null!==a.j&&r();return b})(u(161)),xg:(f=>b=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b)}catch(g){throw b=g,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(162)),Ag:(f=>(b,g)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g)}catch(n){throw b=
n,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(163)),tg:(f=>(b,g)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(164)),Bg:(f=>(b,g)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(165)),vg:(f=>(b,g)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(166)),sg:(f=>(b,g)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&
r()})(u(167)),rg:(f=>(b,g)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(168)),ug:(f=>(b,g)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(169)),yg:(f=>(b,g)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(170)),zg:(f=>(b,g,n)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g,n)}catch(k){throw b=k,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(171)),hd:(f=>(b,g)=>
{0===a.g&&v();d.i&&d.l++;let n;try{n=f(a.g,b,g)}catch(k){throw b=k,a.h=!0,b;}a.h&&p();null!==a.j&&r();return n})(u(172)),jd:(f=>b=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b)}catch(g){throw b=g,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(173)),ld:(f=>b=>{0===a.g&&v();d.i&&d.l++;let g;try{g=f(a.g,b)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r();return g})(u(174)),fd:(f=>b=>{0===a.g&&v();d.i&&d.l++;let g;try{g=f(a.g,b)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r();return g})(u(175)),kd:(f=>(b,
g,n)=>{0===a.g&&v();d.i&&d.l++;let k;try{k=f(a.g,b,g,n)}catch(h){throw b=h,a.h=!0,b;}a.h&&p();null!==a.j&&r();return k})(u(176)),gd:(f=>b=>{0===a.g&&v();d.i&&d.l++;let g;try{g=f(a.g,b)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r();return g})(u(177)),dd:(f=>(b,g)=>{0===a.g&&v();d.i&&d.l++;let n;try{n=f(a.g,b,g)}catch(k){throw b=k,a.h=!0,b;}a.h&&p();null!==a.j&&r();return n})(u(178)),ed:(f=>b=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b)}catch(g){throw b=g,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(179)),
pf:(f=>(b,g)=>{0===a.g&&v();d.i&&d.l++;let n;try{n=f(a.g,b,g)}catch(k){throw b=k,a.h=!0,b;}a.h&&p();null!==a.j&&r();return n})(u(180)),lf:(f=>(b,g)=>{0===a.g&&v();d.i&&d.l++;let n;try{n=f(a.g,b,g)}catch(k){throw b=k,a.h=!0,b;}a.h&&p();null!==a.j&&r();return n})(u(181)),mf:(f=>b=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b)}catch(g){throw b=g,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(182)),jf:(f=>(b,g,n)=>{0===a.g&&v();d.i&&d.l++;let k;try{k=f(a.g,b,g,n)}catch(h){throw b=h,a.h=!0,b;}a.h&&p();null!==a.j&&r();
return k})(u(183)),kf:(f=>b=>{0===a.g&&v();d.i&&d.l++;let g;try{g=f(a.g,b)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r();return g})(u(184)),nf:(f=>(b,g,n,k,h)=>{0===a.g&&v();d.i&&d.l++;let m;try{m=f(a.g,b,g,n,k,h)}catch(w){throw b=w,a.h=!0,b;}a.h&&p();null!==a.j&&r();return m})(u(185)),Of:(f=>(b,g,n)=>{0===a.g&&v();d.i&&d.l++;let k;try{k=f(a.g,b,g,n)}catch(h){throw b=h,a.h=!0,b;}a.h&&p();null!==a.j&&r();return k})(u(186)),rf:(f=>(b,g,n,k)=>{0===a.g&&v();d.i&&d.l++;let h;try{h=f(a.g,b,g,n,
k)}catch(m){throw b=m,a.h=!0,b;}a.h&&p();null!==a.j&&r();return h})(u(187)),zf:(f=>(b,g)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(188)),Cf:(f=>(b,g,n,k)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g,n,k)}catch(h){throw b=h,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(189)),yf:(f=>(b,g,n,k)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g,n,k)}catch(h){throw b=h,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(190)),wf:(f=>(b,g,n,k,h)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,
b,g,n,k,h)}catch(m){throw b=m,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(191)),Df:(f=>(b,g,n,k,h,m,w)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g,n,k,h,m,w)}catch(t){throw b=t,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(192)),Af:(f=>(b,g,n,k,h)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g,n,k,h)}catch(m){throw b=m,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(193)),Bf:(f=>(b,g)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(194)),xf:(f=>(b,g,n,k,h)=>{0===a.g&&v();d.i&&d.l++;
try{f(a.g,b,g,n,k,h)}catch(m){throw b=m,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(195)),sf:(f=>(b,g,n,k,h)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g,n,k,h)}catch(m){throw b=m,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(196)),tf:(f=>(b,g,n,k,h,m)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g,n,k,h,m)}catch(w){throw b=w,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(197)),uf:(f=>b=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b)}catch(g){throw b=g,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(198)),vf:(f=>b=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,
b)}catch(g){throw b=g,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(199)),qf:(f=>(b,g,n)=>{0===a.g&&v();d.i&&d.l++;let k;try{k=f(a.g,b,g,n)}catch(h){throw b=h,a.h=!0,b;}a.h&&p();null!==a.j&&r();return k})(u(200)),ff:(f=>(b,g,n,k,h)=>{0===a.g&&v();d.i&&d.l++;let m;try{m=f(a.g,b,g,n,k,h)}catch(w){throw b=w,a.h=!0,b;}a.h&&p();null!==a.j&&r();return m})(u(201)),hf:(f=>(b,g,n,k)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g,n,k)}catch(h){throw b=h,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(202)),gf:(f=>b=>{0===a.g&&v();
d.i&&d.l++;try{f(a.g,b)}catch(g){throw b=g,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(203)),Pf:(f=>(b,g)=>{0===a.g&&v();d.i&&d.l++;let n;try{n=f(a.g,b,g)}catch(k){throw b=k,a.h=!0,b;}a.h&&p();null!==a.j&&r();return n})(u(204)),Rf:(f=>(b,g,n,k,h)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g,n,k,h)}catch(m){throw b=m,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(205)),Qf:(f=>b=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b)}catch(g){throw b=g,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(206)),Gf:(f=>(b,g)=>{0===a.g&&v();d.i&&d.l++;
let n;try{n=f(a.g,b,g)}catch(k){throw b=k,a.h=!0,b;}a.h&&p();null!==a.j&&r();return n})(u(207)),Hf:(f=>b=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b)}catch(g){throw b=g,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(208)),Sf:(f=>(b,g,n)=>{0===a.g&&v();d.i&&d.l++;let k;try{k=f(a.g,b,g,n)}catch(h){throw b=h,a.h=!0,b;}a.h&&p();null!==a.j&&r();return k})(u(209)),Tf:(f=>b=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b)}catch(g){throw b=g,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(210)),Nf:(f=>()=>{0===a.g&&v();d.i&&d.l++;try{var b=
f(a.g)}catch(g){throw b=g,a.h=!0,b;}a.h&&p();null!==a.j&&r();return b})(u(211)),If:(f=>(b,g,n,k,h)=>{0===a.g&&v();d.i&&d.l++;let m;try{m=f(a.g,b,g,n,k,h)}catch(w){throw b=w,a.h=!0,b;}a.h&&p();null!==a.j&&r();return m})(u(212)),Jf:(f=>(b,g,n)=>{0===a.g&&v();d.i&&d.l++;let k;try{k=f(a.g,b,g,n)}catch(h){throw b=h,a.h=!0,b;}a.h&&p();null!==a.j&&r();return k})(u(213)),Kf:(f=>(b,g,n,k)=>{0===a.g&&v();d.i&&d.l++;let h;try{h=f(a.g,b,g,n,k)}catch(m){throw b=m,a.h=!0,b;}a.h&&p();null!==a.j&&r();return h})(u(214)),
Lf:(f=>void 0===f?l("rive_gpu_v1","shader_module_new"):(b,g,n,k)=>{0===a.g&&v();d.i&&d.l++;let h;try{h=f(a.g,b,g,n,k)}catch(m){throw b=m,a.h=!0,b;}a.h&&p();null!==a.j&&r();return h})(u(215)),Mf:(f=>b=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b)}catch(g){throw b=g,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(216)),bf:(f=>(b,g,n)=>{0===a.g&&v();d.i&&d.l++;let k;try{k=f(a.g,b,g,n)}catch(h){throw b=h,a.h=!0,b;}a.h&&p();null!==a.j&&r();return k})(u(217)),cf:(f=>b=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b)}catch(g){throw b=
g,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(218)),$e:(f=>(b,g,n,k)=>{0===a.g&&v();d.i&&d.l++;let h;try{h=f(a.g,b,g,n,k)}catch(m){throw b=m,a.h=!0,b;}a.h&&p();null!==a.j&&r();return h})(u(219)),af:(f=>(b,g,n,k,h)=>{0===a.g&&v();d.i&&d.l++;let m;try{m=f(a.g,b,g,n,k,h)}catch(w){throw b=w,a.h=!0,b;}a.h&&p();null!==a.j&&r();return m})(u(220)),df:(f=>(b,g,n,k,h,m,w)=>{0===a.g&&v();d.i&&d.l++;let t;try{t=f(a.g,b,g,n,k,h,m,w)}catch(B){throw b=B,a.h=!0,b;}a.h&&p();null!==a.j&&r();return t})(u(221)),ef:(f=>b=>
{0===a.g&&v();d.i&&d.l++;try{f(a.g,b)}catch(g){throw b=g,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(222)),Ef:(f=>(b,g,n,k)=>{0===a.g&&v();d.i&&d.l++;let h;try{h=f(a.g,b,g,n,k)}catch(m){throw b=m,a.h=!0,b;}a.h&&p();null!==a.j&&r();return h})(u(223)),Ff:(f=>b=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b)}catch(g){throw b=g,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(224)),ag:(f=>(b,g,n,k,h,m)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g,n,k,h,m)}catch(w){throw b=w,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(225)),$f:(f=>(b,
g,n,k)=>{0===a.g&&v();d.i&&d.l++;let h;try{h=f(a.g,b,g,n,k)}catch(m){throw b=m,a.h=!0,b;}a.h&&p();null!==a.j&&r();return h})(u(226)),ad:(f=>(b,g,n)=>{0===a.g&&v();d.i&&d.l++;let k;try{k=f(a.g,b,g,n)}catch(h){throw b=h,a.h=!0,b;}a.h&&p();null!==a.j&&r();return k})(u(227)),cd:(f=>(b,g,n)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g,n)}catch(k){throw b=k,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(228)),bd:(f=>b=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b)}catch(g){throw b=g,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(229)),
lg:(f=>b=>{0===a.g&&v();d.i&&d.l++;let g;try{g=f(a.g,b)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r();return g})(u(230)),ng:(f=>(b,g)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(231)),og:(f=>(b,g,n,k)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g,n,k)}catch(h){throw b=h,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(232)),mg:(f=>b=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b)}catch(g){throw b=g,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(233)),$c:(f=>(b,g,n,k,
h)=>{0===a.g&&v();d.i&&d.l++;let m;try{m=f(a.g,b,g,n,k,h)}catch(w){throw b=w,a.h=!0,b;}a.h&&p();null!==a.j&&r();return m})(u(234)),Wf:(f=>(b,g,n)=>{0===a.g&&v();d.i&&d.l++;let k;try{k=f(a.g,b,g,n)}catch(h){throw b=h,a.h=!0,b;}a.h&&p();null!==a.j&&r();return k})(u(235)),Zf:(f=>b=>{0===a.g&&v();d.i&&d.l++;let g;try{g=f(a.g,b)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r();return g})(u(236)),Xf:(f=>b=>{0===a.g&&v();d.i&&d.l++;let g;try{g=f(a.g,b)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&
r();return g})(u(237)),Yf:(f=>b=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b)}catch(g){throw b=g,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(238)),Uf:(f=>(b,g,n)=>{0===a.g&&v();d.i&&d.l++;let k;try{k=f(a.g,b,g,n)}catch(h){throw b=h,a.h=!0,b;}a.h&&p();null!==a.j&&r();return k})(u(239)),Vf:(f=>b=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b)}catch(g){throw b=g,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(240)),Re:(f=>(b,g,n)=>{0===a.g&&v();d.i&&d.l++;let k;try{k=f(a.g,b,g,n)}catch(h){throw b=h,a.h=!0,b;}a.h&&p();null!==a.j&&
r();return k})(u(241)),Pe:(f=>void 0===f?l("rive_font_v1","decode"):(b,g)=>{0===a.g&&v();d.i&&d.l++;let n;try{n=f(a.g,b,g)}catch(k){throw b=k,a.h=!0,b;}a.h&&p();null!==a.j&&r();return n})(u(242)),Xe:(f=>b=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b)}catch(g){throw b=g,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(243)),We:(f=>(b,g,n)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g,n)}catch(k){throw b=k,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(244)),Ye:(f=>b=>{0===a.g&&v();d.i&&d.l++;let g;try{g=f(a.g,b)}catch(n){throw b=
n,a.h=!0,b;}a.h&&p();null!==a.j&&r();return g})(u(245)),Ve:(f=>b=>{0===a.g&&v();d.i&&d.l++;let g;try{g=f(a.g,b)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r();return g})(u(246)),Ne:(f=>b=>{0===a.g&&v();d.i&&d.l++;let g;try{g=f(a.g,b)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r();return g})(u(247)),Me:(f=>(b,g,n,k)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g,n,k)}catch(h){throw b=h,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(248)),Oe:(f=>(b,g)=>{0===a.g&&v();d.i&&d.l++;let n;try{n=f(a.g,b,g)}catch(k){throw b=
k,a.h=!0,b;}a.h&&p();null!==a.j&&r();return n})(u(249)),Qe:(f=>(b,g,n)=>{0===a.g&&v();d.i&&d.l++;let k;try{k=f(a.g,b,g,n)}catch(h){throw b=h,a.h=!0,b;}a.h&&p();null!==a.j&&r();return k})(u(250)),Ue:(f=>(b,g)=>{0===a.g&&v();d.i&&d.l++;let n;try{n=f(a.g,b,g)}catch(k){throw b=k,a.h=!0,b;}a.h&&p();null!==a.j&&r();return n})(u(251)),Ze:(f=>(b,g,n,k,h)=>{0===a.g&&v();d.i&&d.l++;let m;try{m=f(a.g,b,g,n,k,h)}catch(w){throw b=w,a.h=!0,b;}a.h&&p();null!==a.j&&r();return m})(u(252)),Te:(f=>void 0===f?l("rive_font_v1",
"glyph_verbs"):(b,g,n,k)=>{0===a.g&&v();d.i&&d.l++;let h;try{h=f(a.g,b,g,n,k)}catch(m){throw b=m,a.h=!0,b;}a.h&&p();null!==a.j&&r();return h})(u(253)),Se:(f=>void 0===f?l("rive_font_v1","glyph_points"):(b,g,n,k)=>{0===a.g&&v();d.i&&d.l++;let h;try{h=f(a.g,b,g,n,k)}catch(m){throw b=m,a.h=!0,b;}a.h&&p();null!==a.j&&r();return h})(u(254)),rh:(f=>void 0===f?l("rive_text_v1","new"):()=>{0===a.g&&v();d.i&&d.l++;try{var b=f(a.g)}catch(g){throw b=g,a.h=!0,b;}a.h&&p();null!==a.j&&r();return b})(u(255)),sh:(f=>
void 0===f?l("rive_text_v1","release"):b=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b)}catch(g){throw b=g,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(256)),hh:(f=>void 0===f?l("rive_text_v1","append"):(b,g,n,k,h,m,w,t,B)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g,n,k,h,m,w,t,B)}catch(F){throw b=F,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(257)),kh:(f=>void 0===f?l("rive_text_v1","clear"):b=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b)}catch(g){throw b=g,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(258)),oh:(f=>void 0===f?l("rive_text_v1",
"layout"):(b,g,n)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g,n)}catch(k){throw b=k,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(259)),lh:(f=>void 0===f?l("rive_text_v1","draw"):(b,g,n)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g,n)}catch(k){throw b=k,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(260)),ih:(f=>void 0===f?l("rive_text_v1","bounds"):(b,g,n)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g,n)}catch(k){throw b=k,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(261)),ph:(f=>void 0===f?l("rive_text_v1","length"):b=>{0===a.g&&
v();d.i&&d.l++;let g;try{g=f(a.g,b)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r();return g})(u(262)),qh:(f=>void 0===f?l("rive_text_v1","lines"):(b,g,n)=>{0===a.g&&v();d.i&&d.l++;let k;try{k=f(a.g,b,g,n)}catch(h){throw b=h,a.h=!0,b;}a.h&&p();null!==a.j&&r();return k})(u(263)),th:(f=>void 0===f?l("rive_text_v1","runs"):(b,g,n)=>{0===a.g&&v();d.i&&d.l++;let k;try{k=f(a.g,b,g,n)}catch(h){throw b=h,a.h=!0,b;}a.h&&p();null!==a.j&&r();return k})(u(264)),mh:(f=>void 0===f?l("rive_text_v1","glyphs"):
(b,g,n)=>{0===a.g&&v();d.i&&d.l++;let k;try{k=f(a.g,b,g,n)}catch(h){throw b=h,a.h=!0,b;}a.h&&p();null!==a.j&&r();return k})(u(265)),nh:(f=>void 0===f?l("rive_text_v1","hit_test"):(b,g,n)=>{0===a.g&&v();d.i&&d.l++;let k;try{k=f(a.g,b,g,n)}catch(h){throw b=h,a.h=!0,b;}a.h&&p();null!==a.j&&r();return k})(u(266)),jh:(f=>void 0===f?l("rive_text_v1","caret"):(b,g,n,k)=>{0===a.g&&v();d.i&&d.l++;let h;try{h=f(a.g,b,g,n,k)}catch(m){throw b=m,a.h=!0,b;}a.h&&p();null!==a.j&&r();return h})(u(267)),uh:(f=>void 0===
f?l("rive_text_v1","selection_rects"):(b,g,n,k,h)=>{0===a.g&&v();d.i&&d.l++;let m;try{m=f(a.g,b,g,n,k,h)}catch(w){throw b=w,a.h=!0,b;}a.h&&p();null!==a.j&&r();return m})(u(268)),dh:(f=>(b,g,n,k,h,m,w)=>{0===a.g&&v();d.i&&d.l++;let t;try{t=f(a.g,b,g,n,k,h,m,w)}catch(B){throw b=B,a.h=!0,b;}a.h&&p();null!==a.j&&r();return t})(u(269)),eh:(f=>(b,g,n,k,h,m)=>{0===a.g&&v();d.i&&d.l++;let w;try{w=f(a.g,b,g,n,k,h,m)}catch(t){throw b=t,a.h=!0,b;}a.h&&p();null!==a.j&&r();return w})(u(270)),fh:(f=>b=>{0===a.g&&
v();d.i&&d.l++;try{f(a.g,b)}catch(g){throw b=g,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(271)),gh:(f=>(b,g,n,k)=>{0===a.g&&v();d.i&&d.l++;let h;try{h=f(a.g,b,g,n,k)}catch(m){throw b=m,a.h=!0,b;}a.h&&p();null!==a.j&&r();return h})(u(272)),vh:(f=>(b,g)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(273)),xh:(f=>b=>{0===a.g&&v();d.i&&d.l++;let g;try{g=f(a.g,b)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r();return g})(u(274)),wh:(f=>b=>{0===a.g&&
v();d.i&&d.l++;let g;try{g=f(a.g,b)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r();return g})(u(275)),Rg:(f=>b=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b)}catch(g){throw b=g,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(276)),Qg:(f=>b=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b)}catch(g){throw b=g,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(277)),Sg:(f=>(b,g,n,k,h,m,w)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g,n,k,h,m,w)}catch(t){throw b=t,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(278)),Ng:(f=>(b,g,n)=>{0===a.g&&v();
d.i&&d.l++;try{f(a.g,b,g,n)}catch(k){throw b=k,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(279)),Jg:(f=>(b,g)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(280)),Pg:(f=>(b,g)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(281)),Og:(f=>(b,g,n)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g,n)}catch(k){throw b=k,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(282)),Kg:(f=>(b,g,n,k,h)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,
b,g,n,k,h)}catch(m){throw b=m,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(283)),Lg:(f=>(b,g,n,k,h,m,w,t)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g,n,k,h,m,w,t)}catch(B){throw b=B,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(284)),Mg:(f=>(b,g,n,k,h,m,w)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g,n,k,h,m,w)}catch(t){throw b=t,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(285)),pg:(f=>(b,g,n)=>{0===a.g&&v();d.i&&d.l++;let k;try{k=f(a.g,b,g,n)}catch(h){throw b=h,a.h=!0,b;}a.h&&p();null!==a.j&&r();return k})(u(286)),qg:(f=>
b=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b)}catch(g){throw b=g,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(287)),Ke:(f=>(b,g,n,k)=>{0===a.g&&v();d.i&&d.l++;let h;try{h=f(a.g,b,g,n,k)}catch(m){throw b=m,a.h=!0,b;}a.h&&p();null!==a.j&&r();return h})(u(288)),Le:(f=>b=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b)}catch(g){throw b=g,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(289)),De:(f=>b=>{0===a.g&&v();d.i&&d.l++;let g;try{g=f(a.g,b)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r();return g})(u(290)),Ee:(f=>(b,g,
n,k)=>{0===a.g&&v();d.i&&d.l++;let h;try{h=f(a.g,b,g,n,k)}catch(m){throw b=m,a.h=!0,b;}a.h&&p();null!==a.j&&r();return h})(u(291)),Fe:(f=>(b,g,n,k)=>{0===a.g&&v();d.i&&d.l++;let h;try{h=f(a.g,b,g,n,k)}catch(m){throw b=m,a.h=!0,b;}a.h&&p();null!==a.j&&r();return h})(u(292)),Je:(f=>b=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b)}catch(g){throw b=g,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(293)),Ie:(f=>(b,g,n)=>{0===a.g&&v();d.i&&d.l++;let k;try{k=f(a.g,b,g,n)}catch(h){throw b=h,a.h=!0,b;}a.h&&p();null!==a.j&&
r();return k})(u(294)),Ge:(f=>b=>{0===a.g&&v();d.i&&d.l++;let g;try{g=f(a.g,b)}catch(n){throw b=n,a.h=!0,b;}a.h&&p();null!==a.j&&r();return g})(u(295)),He:(f=>(b,g)=>{0===a.g&&v();d.i&&d.l++;let n;try{n=f(a.g,b,g)}catch(k){throw b=k,a.h=!0,b;}a.h&&p();null!==a.j&&r();return n})(u(296)),md:(f=>(b,g,n)=>{0===a.g&&v();d.i&&d.l++;try{f(a.g,b,g,n)}catch(k){throw b=k,a.h=!0,b;}a.h&&p();null!==a.j&&r()})(u(297))}}function l(u,a){return()=>{throw Error("failed to call unlinked import function "+u+"."+a);
}}function q(u){u=[0,...u,11];return new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,u.length+2,1,u.length,...u])}function x(u,a){let d=0,r=0,p;do p=u[a++],d|=(p&127)<<r,r+=7;while(p&128);return[d>>>0,a]}function y(u){const a=[];do{const d=u&127;u>>>=7;a.push(u?d|128:d)}while(u);return a}function z(u){var a=[],d=-1;for(var r=8;r<u.length;){const [p,v]=x(u,r+1);8===u[r]?d=x(u,v)[0]:a.push({id:u[r],at:r,body:v,end:v+p});r=v+p}if(0>d||!a.some(p=>7===p.id))return u;r=[u.subarray(0,8)];
for(const p of a){if(7!==p.id){r.push(u.subarray(p.at,p.end));continue}const [v,f]=x(u,p.body);a=Array.from("__riveLiftedStart",n=>n.charCodeAt(0));a=[...y(a.length),...a,0,...y(d)];const b=y(v+1),g=u.subarray(f,p.end);r.push(Uint8Array.from([7,...y(b.length+g.length+a.length),...b]),g,Uint8Array.from(a))}u=new Uint8Array(r.reduce((p,v)=>p+v.length,0));d=0;for(const p of r)u.set(p,d),d+=p.length;return u}const A=[253,12,...Array(16).fill(0)],C=q([...A]),G=q([...A,...A,253,128,2]);(function(u){function a(h,
m){const w=c({kb:e(v.Bb,h.L),Z:v.Z,da:v.da,ua:v.ua,ca:v.ca,Ga:v.Ga,Da:v.Da,Ba:b},()=>{if(null===h.memory)throw Error("script passed memory to the host while its module was still starting");return h.memory});for(const t of WebAssembly.Module.imports(m))if("function"===t.kind){let B,F,H,K;(H=(B=w)[F=t.module]??(B[F]={}))[K=t.name]??(H[K]=l(t.module,t.name))}return w}function d(h,m){const w=v.da();for(const {name:t}of WebAssembly.Module.exports(m)){if(!t.startsWith("__rive"))continue;m=3*t.length+1;
const B=v.ua(m);v.ab(t,B,m);v.exports._rive_web_vm_module_export(h.L.g,B)}v.ca(w)}function r(h,m){h.memory=m.exports.memory;h.Aa=null;const w=v.exports._rive_web_vm_booting;w(h.L.g);const t=v.da();try{m.exports.__riveLiftedStart?.()}catch(B){throw v.ca(t),h.L.j=null,B;}finally{w(0)}h.instance=m}async function p(h){try{const w=await WebAssembly.compile(z(h.Aa));if(0!==h.L.g){d(h,w);var m=await WebAssembly.instantiate(w,a(h,w));0!==h.L.g&&r(h,m)}}catch(w){h.error=String(w?.message??w)}}let v=null;const f=
new Map,b={i:!1,l:0,la:0,ja:0,ka:0,ma:0},g=u.riveScriptingValidate??(h=>WebAssembly.validate(h));let n=null;const k={ib(h){v??=h},register(h,m){m=m.slice();var w=f.set;n??={Xa:g(C),Mb:g(G)};var t=n.Xa&&n.Mb||g(m)?null:n.Xa?"this browser lacks WebAssembly relaxed SIMD, so this file's scripts are off; bake with wasmSimd: on to support it":"this browser lacks WebAssembly SIMD, so this file's scripts are off; bake with wasmSimd: off to support it";w.call(f,h,{L:{g:h,j:null,h:!1,Ba:b},Aa:m,instance:null,
memory:null,V:null,error:t,names:new Map})},release(h){const m=f.get(h);m&&(m.L.g=0,f.delete(h))},Jb(){const h=[];for(const m of f.values())if(null===m.instance&&null===m.error){let w;(w=m).V??(w.V=p(m));h.push(m.V)}return Promise.all(h)},start(h){h=f.get(h);if(!h)return"script module was never registered";if(null===h.instance&&null===h.error){if(null!==h.V)return"script module is still being prepared";try{const m=new WebAssembly.Module(z(h.Aa));d(h,m);r(h,new WebAssembly.Instance(m,a(h,m)))}catch(m){h.error=
String(m?.message??m)}}return h.error},V(h){h=f.get(h);return null===h?.instance&&null===h.error&&null!==h.V?1:0},Ab(h,m){return"function"===typeof f.get(h)?.instance?.exports[v.Ja(m)]?1:0},call(h,m,w,t,B,F,H){h=f.get(h);if(!h||null===h.instance)return 1;let K=h.names.get(m);void 0===K&&(K=h.instance.exports[v.Ja(m)]??null,h.names.set(m,K));if("function"!==typeof K)return 1;try{m=t>>3;const P=K(...v.Pa().subarray(m,m+w));v.Pa()[B>>3]="number"===typeof P?P:0;return 0}catch(P){return h.L.j=null,v.ab(String(P?.message??
P),F,H),h.L.h?3:2}},Kb(h,m){if(h=f.get(h))h.L.j=v.Ja(m)},read(h,m,w,t){h=f.get(h)?.memory;if(!h||m+t>h.buffer.byteLength)return 0;v.Z().set(new Uint8Array(h.buffer,m,t),w);b.i&&(b.ka+=t);return 1},write(h,m,w,t){h=f.get(h)?.memory;if(!h||m+t>h.buffer.byteLength)return 0;(new Uint8Array(h.buffer,m,t)).set(v.Z().subarray(w,w+t));b.i&&(b.ma+=t);return 1},Ch(h,m){h=f.get(h)?.memory;if(!h||m>=h.buffer.byteLength)return-1;h=(new Uint8Array(h.buffer)).indexOf(0,m);return 0>h?-1:h-m},Hb(h){return(h=f.get(h)?.memory)?
h.buffer.byteLength>>>16:0},mb(h){b.i=!!h;b.l=0;b.la=0;b.ja=0;b.ka=0;b.ma=0},Cb(){return{hostCalls:b.l,bytesStaged:b.la,bytesCopiedOut:b.ja,bytesRead:b.ka,bytesWritten:b.ma}}};k.prepare=k.Jb;k.countHostCalls=k.mb;k.hostCallCounts=k.Cb;return u.riveScripting=k})(D)})();const ha=D.onRuntimeInitialized;
D.onRuntimeInitialized=function(){function c(p){this.G=p;this.cb=p.getContext("2d");this.La=q;this.O=[];this.aa=0;this.clear=function(){console.assert(0==this.aa);this.O=[];x.delete(this)};this.save=function(){++this.aa;this.O.push(q.save.bind(q))};this.restore=function(){0<this.aa&&(this.O.push(q.restore.bind(q)),--this.aa)};this.transform=function(v){this.O.push(q.transform.bind(q,v))};this.align=function(v,f,b,g,n=1){this.O.push(q.align.bind(q,v,f,b,g,n))};this.flush=function(){console.assert(0==
this.aa);x.add(this);q.Ka||l()};this.bindContext=function(){const v=this.La;v&&v.T&&ia(v.T)};this["delete"]=function(){}}function e(p,v=!1){var f={alpha:!0,depth:v,stencil:v,antialias:v,premultipliedAlpha:!0,preserveDrawingBuffer:0,powerPreference:"high-performance",failIfMajorPerformanceCaveat:0,enableExtensionsByDefault:!1,explicitSwapControl:0,renderViaOffscreenBackBuffer:0};v=p.getContext("webgl2",f);if(!v)return null;f=ja(v,f);ia(f);const b=y(p.width,p.height);b.T=f;b.G=p;b.za=p.width;b.ya=p.height;
b.P=v;b.jb=function(){this.T&&ia(this.T)};var g=b.delete;b.delete=function(){this.jb();g.call(this);var n=this.T;E===I[n]&&(E=null);"object"==typeof JSEvents&&JSEvents.Hh(I[n].F.canvas);I[n]?.F.canvas&&(I[n].F.canvas.bb=void 0);this.T=this.G=this.za=this.ya=this.P=I[n]=null};return b}function l(){if(q){var p=q.fb,v=0,f=0,b=0,g=Array(x.size),n=0;for(var k of x)k.X=Math.min(k.G.width,p),k.W=Math.min(k.G.height,p),k.wa=k.W*k.X,v=Math.max(v,k.X),f=Math.max(f,k.W),b+=k.wa,g[n++]=k;x.clear();if(!(0>=b)){v=
1<<(0>=v?0:32-Math.clz32(v-1));for(f=1<<(0>=f?0:32-Math.clz32(f-1));f*v<b;)v<=f?v*=2:f*=2;v=Math.min(v,p);v=Math.min(f,p);g.sort((w,t)=>t.wa-w.wa);b=new D.DynamicRectanizer(p);for(k=0;k<g.length;){b.reset(v,f);for(n=k;n<g.length;++n){var h=g[n],m=b.addRect(h.X,h.W);if(0>m){console.assert(n>k);break}h.ha=m&65535;h.ia=m>>16}h=C.push(b.drawWidth());m=G.push(b.drawHeight());console.assert(h>=b.drawWidth());console.assert(m>=b.drawHeight());console.assert(h<=p);console.assert(m<=p);q.G.width!=h&&(q.G.width=
h);q.G.height!=m&&(q.G.height=m);q.clear();for(h=k;h<n;++h){m=g[h];q.saveClipRect(m.ha,m.ia,m.ha+m.X,m.ia+m.W);let w=new D.Mat2D;w.xx=m.X/m.G.width;w.yy=m.W/m.G.height;w.xy=w.yx=0;w.tx=m.ha;w.ty=m.ia;q.transform(w);for(const t of m.O)t();q.restoreClipRect();m.O=[]}for(q.flush();k<n;++k)h=g[k],m=h.cb,m.globalCompositeOperation="copy",m.drawImage(q.G,h.ha,h.ia,h.X,h.W,0,0,h.G.width,h.G.height);k=n}}}}ha&&ha();let q=null;const x=new Set,y=D.makeRenderer;D.makeRenderer=function(p,v){if(!q){function f(b){var g=
document.createElement("canvas");g.width=1;g.height=1;q=e(g,b);if(!q)return null;q.Ka=!!q.P.getExtension("WEBGL_shader_pixel_local_storage");q.fb=Math.min(q.P.getParameter(q.P.MAX_RENDERBUFFER_SIZE),q.P.getParameter(q.P.MAX_TEXTURE_SIZE));q.xa=!q.Ka;if(b=q.P.getExtension("WEBGL_debug_renderer_info"))g=q.P.getParameter(b.UNMASKED_RENDERER_WEBGL),q.P.getParameter(b.UNMASKED_VENDOR_WEBGL).includes("Google")&&g.includes("ANGLE Metal Renderer")&&(q.xa=!1);return q}q=f(!0);if(!q)throw"Unable to create WebGL context, your environment may not support WebGL. Try out @rive-app/canvas as an alternative.";
q.xa||(q=f(!1))}return v?new c(p):e(p,q.xa)};const z=D.Artboard.prototype["delete"];D.Artboard.prototype["delete"]=function(){this.hb=!0;z.call(this)};const A=D.Artboard.prototype.draw;D.Artboard.prototype.draw=function(p){p.O?p.O.push(()=>{this.hb||A.call(this,p.La)}):A.call(this,p)};const C=new ea,G=new ea,u=new da;D.requestAnimationFrame=u.requestAnimationFrame.bind(u);D.cancelAnimationFrame=u.cancelAnimationFrame.bind(u);D.enableFPSCounter=u.qb.bind(u);u.Ra=l;D.resolveAnimationFrame=l;let a=D.load;
D.load=function(p,v,f=!0,b=null){const g=new D.FallbackFileAssetLoader;void 0!==v&&g.addLoader(v);f&&(v=new D.CDNFileAssetLoader(b),g.addLoader(v));return D.startFileScripts(a(p,g,b??null))};const d=D.WebGL2Renderer.prototype.clear;D.WebGL2Renderer.prototype.clear=function(){ia(this.T);const p=this.G;if(this.za!=p.width||this.ya!=p.height)this.resize(p.width,p.height),this.za=p.width,this.ya=p.height;d.call(this)};D.decodeImage=function(p,v,f=null){p=D.decodeWebGL2Image(p,f??null);v(p)};let r=D.Renderer.prototype.align;
D.Renderer.prototype.align=function(p,v,f,b,g=1){r.call(this,p,v,f,b,g)}};var ka="./this.program";ca&&(_scriptName=self.location.href);var la="",ma,na;
if(aa||ca){try{la=(new URL(".",_scriptName)).href}catch{}ca&&(na=c=>{var e=new XMLHttpRequest;e.open("GET",c,!1);e.responseType="arraybuffer";e.send(null);return new Uint8Array(e.response)});ma=async c=>{if(oa(c))return new Promise((l,q)=>{var x=new XMLHttpRequest;x.open("GET",c,!0);x.responseType="arraybuffer";x.onload=()=>{200==x.status||0==x.status&&x.response?l(x.response):q(x.status)};x.onerror=q;x.send(null)});var e=await fetch(c,{credentials:"same-origin"});if(e.ok)return e.arrayBuffer();throw Error(e.status+
" : "+e.url);}}var pa=console.log.bind(console),qa=console.error.bind(console),ra,sa=!1,oa=c=>c.startsWith("file://"),ta,ua,va,J,wa,xa,L,M,ya,za,Aa=!1;function Ba(){var c=Ca.buffer;D.HEAP8=va=new Int8Array(c);wa=new Int16Array(c);D.HEAPU8=J=new Uint8Array(c);D.HEAPU16=xa=new Uint16Array(c);D.HEAP32=L=new Int32Array(c);D.HEAPU32=M=new Uint32Array(c);D.HEAPF32=ya=new Float32Array(c);za=new Float64Array(c)}
function Da(c){D.onAbort?.(c);c="Aborted("+c+")";qa(c);sa=!0;c=new WebAssembly.RuntimeError(c+". Build with -sASSERTIONS for more info.");ua?.(c);throw c;}var Ea;async function Fa(c){if(!ra)try{var e=await ma(c);return new Uint8Array(e)}catch{}if(c==Ea&&ra)c=new Uint8Array(ra);else if(na)c=na(c);else throw"both async and sync fetching of the wasm failed";return c}
async function Ga(c,e){try{var l=await Fa(c);return await WebAssembly.instantiate(l,e)}catch(q){qa(`failed to asynchronously prepare wasm: ${q}`),Da(q)}}async function Ha(c){var e=Ea;if(!ra&&!oa(e))try{var l=fetch(e,{credentials:"same-origin"});return await WebAssembly.instantiateStreaming(l,c)}catch(q){qa(`wasm streaming compile failed: ${q}`),qa("falling back to ArrayBuffer instantiation")}return Ga(e,c)}
var N,Ia,Ja=c=>{for(;0<c.length;)c.shift()(D)},Ka=[],La=[],Ma=()=>{var c=D.preRun.shift();La.push(c)},Oa=c=>Na(c),Qa=()=>Pa(),Ra=globalThis.TextDecoder&&new TextDecoder,Sa=(c,e,l,q)=>{l=e+l;if(q)return l;for(;c[e]&&!(e>=l);)++e;return e},Ta=(c,e=0,l,q)=>{l=Sa(c,e,l,q);if(16<l-e&&c.buffer&&Ra)return Ra.decode(c.subarray(e,l));for(q="";e<l;){var x=c[e++];if(x&128){var y=c[e++]&63;if(192==(x&224))q+=String.fromCharCode((x&31)<<6|y);else{var z=c[e++]&63;x=224==(x&240)?(x&15)<<12|y<<6|z:(x&7)<<18|y<<12|
z<<6|c[e++]&63;65536>x?q+=String.fromCharCode(x):(x-=65536,q+=String.fromCharCode(55296|x>>10,56320|x&1023))}}else q+=String.fromCharCode(x)}return q},Ua=(c,e)=>Object.defineProperty(e,"name",{value:c}),Va=[],Wa=[0,1,,1,null,1,!0,1,!1,1],O=class extends Error{constructor(c){super(c);this.name="BindingError"}},Q=c=>{if(!c)throw new O(`Cannot use deleted val. handle = ${c}`);return Wa[c]},Xa=c=>{switch(c){case void 0:return 2;case null:return 4;case !0:return 6;case !1:return 8;default:const e=Va.pop()||
Wa.length;Wa[e]=c;Wa[e+1]=1;return e}};class Ya extends Error{}
var R=c=>{for(var e="";;){var l=J[c++];if(!l)return e;e+=String.fromCharCode(l)}},Za={},$a=(c,e)=>{if(void 0===e)throw new O("ptr should not be undefined");for(;c.C;)e=c.fa(e),c=c.C;return e},ab={},db=c=>{c=bb(c);var e=R(c);cb(c);return e},eb=(c,e)=>{var l=ab[c];if(void 0===l)throw c=`${e} has unknown type ${db(c)}`,new O(c);return l},fb=()=>{},gb=!1,hb=c=>{if(!globalThis.FinalizationRegistry)return hb=e=>e,c;gb=new FinalizationRegistry(e=>{e=e.m;--e.count.value;0===e.count.value&&(e.D?e.J.N(e.D):
e.v.o.N(e.u))});hb=e=>{var l=e.m;l.D&&gb.register(e,{m:l},e);return e};fb=e=>{gb.unregister(e)};return hb(c)},ib={},jb=c=>{for(;c.length;){var e=c.pop();c.pop()(e)}};function kb(c){return this.s(M[c>>2])}
var lb={},mb={},nb=class extends Error{constructor(c){super(c);this.name="InternalError"}},T=(c,e,l)=>{function q(A){A=l(A);if(A.length!==c.length)throw new nb("Mismatched type converter count");for(var C=0;C<c.length;++C)S(c[C],A[C])}c.forEach(A=>mb[A]=e);var x=Array(e.length),y=[],z=0;for(let [A,C]of e.entries())ab.hasOwnProperty(C)?x[A]=ab[C]:(y.push(C),lb.hasOwnProperty(C)||(lb[C]=[]),lb[C].push(()=>{x[A]=ab[C];++z;z===y.length&&q(x)}));0===y.length&&q(x)};
function ob(c,e,l={}){var q=e.name;if(!c)throw new O(`type "${q}" must have a positive integer typeid pointer`);if(ab.hasOwnProperty(c)){if(l.Db)return;throw new O(`Cannot register type '${q}' twice`);}ab[c]=e;delete mb[c];lb.hasOwnProperty(c)&&(e=lb[c],delete lb[c],e.forEach(x=>x()))}function S(c,e,l={}){return ob(c,e,l)}var pb=c=>{throw new O(c.m.v.o.name+" instance already deleted");},qb=[];function rb(){}
var sb={},tb=(c,e,l)=>{if(void 0===c[e].A){var q=c[e];c[e]=function(...x){if(!c[e].A.hasOwnProperty(x.length))throw new O(`Function '${l}' called with an invalid number of arguments (${x.length}) - expects one of (${c[e].A})!`);return c[e].A[x.length].apply(this,x)};c[e].A=[];c[e].A[q.R]=q}},ub=(c,e,l)=>{if(D.hasOwnProperty(c)){if(void 0===l||void 0!==D[c].A&&void 0!==D[c].A[l])throw new O(`Cannot register public name '${c}' twice`);tb(D,c,c);if(D[c].A.hasOwnProperty(l))throw new O(`Cannot register multiple overloads of a function with the same number of arguments (${l})!`);
D[c].A[l]=e}else D[c]=e,D[c].R=l},vb=c=>{c=c.replace(/[^a-zA-Z0-9_]/g,"$");var e=c.charCodeAt(0);return 48<=e&&57>=e?`_${c}`:c};function wb(c,e,l,q,x,y,z,A){this.name=c;this.constructor=e;this.M=l;this.N=q;this.C=x;this.vb=y;this.fa=z;this.ob=A;this.Ta=[]}
var xb=(c,e,l)=>{for(;e!==l;){if(!e.fa)throw new O(`Expected null or instance of ${l.name}, got an instance of ${e.name}`);c=e.fa(c);e=e.C}return c},yb=c=>{if(null===c)return"null";var e=typeof c;return"object"===e||"array"===e||"function"===e?c.toString():""+c};
function zb(c,e){if(null===e){if(this.Ea)throw new O(`null is not a valid ${this.name}`);return 0}if(!e.m)throw new O(`Cannot pass "${yb(e)}" as a ${this.name}`);if(!e.m.u)throw new O(`Cannot pass deleted object as a pointer of type ${this.name}`);return xb(e.m.u,e.m.v.o,this.o)}
function Ab(c,e){if(null===e){if(this.Ea)throw new O(`null is not a valid ${this.name}`);if(this.pa){var l=this.Ha();null!==c&&c.push(this.N,l);return l}return 0}if(!e||!e.m)throw new O(`Cannot pass "${yb(e)}" as a ${this.name}`);if(!e.m.u)throw new O(`Cannot pass deleted object as a pointer of type ${this.name}`);if(!this.oa&&e.m.v.oa)throw new O(`Cannot convert argument of type ${e.m.J?e.m.J.name:e.m.v.name} to parameter type ${this.name}`);l=xb(e.m.u,e.m.v.o,this.o);if(this.pa){if(void 0===e.m.D)throw new O("Passing raw pointer to smart pointer is illegal");
switch(this.Bh){case 0:if(e.m.J===this)l=e.m.D;else throw new O(`Cannot convert argument of type ${e.m.J?e.m.J.name:e.m.v.name} to parameter type ${this.name}`);break;case 1:l=e.m.D;break;case 2:if(e.m.J===this)l=e.m.D;else{var q=e.clone();l=this.Lb(l,Xa(()=>q["delete"]()));null!==c&&c.push(this.N,l)}break;default:throw new O("Unsupported sharing policy");}}return l}
function Bb(c,e){if(null===e){if(this.Ea)throw new O(`null is not a valid ${this.name}`);return 0}if(!e.m)throw new O(`Cannot pass "${yb(e)}" as a ${this.name}`);if(!e.m.u)throw new O(`Cannot pass deleted object as a pointer of type ${this.name}`);if(e.m.v.oa)throw new O(`Cannot convert argument of type ${e.m.v.name} to parameter type ${this.name}`);return xb(e.m.u,e.m.v.o,this.o)}
var Cb=(c,e,l)=>{if(e===l)return c;if(void 0===l.C)return null;c=Cb(c,e,l.C);return null===c?null:l.ob(c)},Db=(c,e)=>{e=$a(c,e);return Za[e]},Eb=(c,e)=>{if(!e.v||!e.u)throw new nb("makeClassHandle requires ptr and ptrType");if(!!e.J!==!!e.D)throw new nb("Both smartPtrType and smartPtr must be specified");e.count={value:1};return hb(Object.create(c,{m:{value:e,writable:!0}}))};
function Fb(c,e,l,q,x,y,z,A,C,G,u){this.name=c;this.o=e;this.Ea=l;this.oa=q;this.pa=x;this.Ib=y;this.Bh=z;this.Va=A;this.Ha=C;this.Lb=G;this.N=u;x||void 0!==e.C?this.B=Ab:(this.B=q?zb:Bb,this.H=null)}
var Gb=(c,e,l)=>{if(!D.hasOwnProperty(c))throw new nb("Replacing nonexistent public symbol");void 0!==D[c].A&&void 0!==l?D[c].A[l]=e:(D[c]=e,D[c].R=l)},U={},Ib=(c,e,l=[])=>{c.includes("j")?(c=c.replace(/p/g,"i"),e=(0,U[c])(e,...l)):e=Hb.get(e)(...l);return e},Jb=(c,e)=>(...l)=>Ib(c,e,l),V=(c,e)=>{c=R(c);var l=c.includes("j")?Jb(c,e):Hb.get(e);if("function"!=typeof l)throw new O(`unknown function pointer with signature ${c}: ${e}`);return l};class Kb extends Error{}
var Lb=(c,e)=>{function l(y){x[y]||ab[y]||(mb[y]?mb[y].forEach(l):(q.push(y),x[y]=!0))}var q=[],x={};e.forEach(l);throw new Kb(`${c}: `+q.map(db).join([", "]));};function Mb(c){for(var e=1;e<c.length;++e)if(null!==c[e]&&void 0===c[e].H)return!0;return!1}
function Nb(c,e,l,q,x){var y=e.length;if(2>y)throw new O("argTypes array size mismatch! Must at least get return value and 'this' types!");var z=null!==e[1]&&null!==l,A=Mb(e),C=!e[0].Fb,G=y-2,u=Array(G),a=[],d=[];return Ua(c,function(...r){d.length=0;a.length=z?2:1;a[0]=x;if(z){var p=e[1].B(d,this);a[1]=p}for(var v=0;v<G;++v)u[v]=e[v+2].B(d,r[v]),a.push(u[v]);r=q(...a);if(A)jb(d);else for(v=z?1:2;v<e.length;v++){var f=1===v?p:u[v-2];null!==e[v].H&&e[v].H(f)}p=C?e[0].s(r):void 0;return p})}
var Ob=(c,e)=>{for(var l=[],q=0;q<c;q++)l.push(M[e+4*q>>2]);return l},Pb=c=>{c=c.trim();const e=c.indexOf("(");return-1===e?c:c.slice(0,e)},Qb=(c,e,l)=>{if(!(c instanceof Object))throw new O(`${l} with invalid "this": ${c}`);if(!(c instanceof e.o.constructor))throw new O(`${l} incompatible with "this" of type ${c.constructor.name}`);if(!c.m.u)throw new O(`cannot call emscripten binding method ${l} on deleted object`);return xb(c.m.u,c.m.v.o,e.o)},Rb=c=>{9<c&&0===--Wa[c+1]&&(Wa[c]=void 0,Va.push(c))},
Sb={name:"emscripten::val",s:c=>{var e=Q(c);Rb(c);return e},B:(c,e)=>Xa(e),I:kb,H:null},Tb=(c,e,l)=>{switch(e){case 1:return l?function(q){return this.s(va[q])}:function(q){return this.s(J[q])};case 2:return l?function(q){return this.s(wa[q>>1])}:function(q){return this.s(xa[q>>1])};case 4:return l?function(q){return this.s(L[q>>2])}:function(q){return this.s(M[q>>2])};default:throw new TypeError(`invalid integer width (${e}): ${c}`);}},Ub=(c,e)=>{switch(e){case 4:return function(l){return this.s(ya[l>>
2])};case 8:return function(l){return this.s(za[l>>3])};default:throw new TypeError(`invalid float width (${e}): ${c}`);}},Vb=(c,e,l)=>{switch(e){case 1:return l?q=>va[q]:q=>J[q];case 2:return l?q=>wa[q>>1]:q=>xa[q>>1];case 4:return l?q=>L[q>>2]:q=>M[q>>2];default:throw new TypeError(`invalid integer width (${e}): ${c}`);}},Wb=(c,e,l)=>{var q=J;if(!(0<l))return 0;var x=e;l=e+l-1;for(var y=0;y<c.length;++y){var z=c.codePointAt(y);if(127>=z){if(e>=l)break;q[e++]=z}else if(2047>=z){if(e+1>=l)break;q[e++]=
192|z>>6;q[e++]=128|z&63}else if(65535>=z){if(e+2>=l)break;q[e++]=224|z>>12;q[e++]=128|z>>6&63;q[e++]=128|z&63}else{if(e+3>=l)break;q[e++]=240|z>>18;q[e++]=128|z>>12&63;q[e++]=128|z>>6&63;q[e++]=128|z&63;y++}}q[e]=0;return e-x},Xb=c=>{for(var e=0,l=0;l<c.length;++l){var q=c.charCodeAt(l);127>=q?e++:2047>=q?e+=2:55296<=q&&57343>=q?(e+=4,++l):e+=3}return e},Yb=globalThis.TextDecoder?new TextDecoder("utf-16le"):void 0,Zb=(c,e,l)=>{c>>=1;e=Sa(xa,c,e/2,l);if(16<e-c&&Yb)return Yb.decode(xa.subarray(c,e));
for(l="";c<e;++c)l+=String.fromCharCode(xa[c]);return l},$b=(c,e,l)=>{l??=2147483647;if(2>l)return 0;l-=2;var q=e;l=l<2*c.length?l/2:c.length;for(var x=0;x<l;++x)wa[e>>1]=c.charCodeAt(x),e+=2;wa[e>>1]=0;return e-q},ac=c=>2*c.length,bc=(c,e,l)=>{var q="";c>>=2;for(var x=0;!(x>=e/4);x++){var y=M[c+x];if(!y&&!l)break;q+=String.fromCodePoint(y)}return q},cc=(c,e,l)=>{l??=2147483647;if(4>l)return 0;var q=e;l=q+l-4;for(var x=0;x<c.length;++x){var y=c.codePointAt(x);65535<y&&x++;L[e>>2]=y;e+=4;if(e+4>l)break}L[e>>
2]=0;return e-q},dc=c=>{for(var e=0,l=0;l<c.length;++l)65535<c.codePointAt(l)&&l++,e+=4;return e},ec=[],fc=c=>{var e=ec.length;ec.push(c);return e},gc=(c,e)=>{for(var l=Array(c),q=0;q<c;++q)l[q]=eb(M[e+4*q>>2],`parameter ${q}`);return l},hc={},ic=c=>{var e=hc[c];return void 0===e?R(c):e},jc=[0,31,60,91,121,152,182,213,244,274,305,335],kc=[0,31,59,90,120,151,181,212,243,273,304,334],lc=[],mc=c=>{c.Eh=c.getExtension("WEBGL_draw_instanced_base_vertex_base_instance")},nc=c=>{c.Gh=c.getExtension("WEBGL_multi_draw_instanced_base_vertex_base_instance")},
W,oc=c=>{var e="EXT_color_buffer_float EXT_conservative_depth EXT_disjoint_timer_query_webgl2 EXT_texture_norm16 NV_shader_noperspective_interpolation WEBGL_clip_cull_distance EXT_clip_control EXT_color_buffer_half_float EXT_depth_clamp EXT_float_blend EXT_polygon_offset_clamp EXT_texture_compression_bptc EXT_texture_compression_rgtc EXT_texture_filter_anisotropic KHR_parallel_shader_compile OES_texture_float_linear WEBGL_blend_func_extended WEBGL_compressed_texture_astc WEBGL_compressed_texture_etc WEBGL_compressed_texture_etc1 WEBGL_compressed_texture_s3tc WEBGL_compressed_texture_s3tc_srgb WEBGL_debug_renderer_info WEBGL_debug_shaders WEBGL_lose_context WEBGL_multi_draw WEBGL_polygon_mode".split(" ");
return(c.getSupportedExtensions()||[]).filter(l=>e.includes(l))},pc=1,qc=[],X=[],rc=[],sc=[],tc=[],Y=[],uc=[],I=[],vc=[],wc={},xc={},yc=4,zc=0,Ac=c=>{for(var e=pc++,l=c.length;l<e;l++)c[l]=null;return e},Bc=(c,e,l,q)=>{for(var x=0;x<c;x++){var y=W[l](),z=y&&Ac(q);y?(y.name=z,q[z]=y):Z||=1282;L[e+4*x>>2]=z}},ja=(c,e)=>{var l=Ac(I),q={handle:l,attributes:e,version:e.Fh,F:c};c.canvas&&(c.canvas.bb=q);I[l]=q;if("undefined"==typeof e.pb||e.pb)if((c=q)||(c=E),!c.Eb){c.Eb=!0;e=c.F;e.Gb=e.getExtension("WEBGL_multi_draw");
e.sb=e.getExtension("EXT_polygon_offset_clamp");e.rb=e.getExtension("EXT_clip_control");e.Dh=e.getExtension("WEBGL_polygon_mode");mc(e);nc(e);2<=c.version&&(e.Na=e.getExtension("EXT_disjoint_timer_query_webgl2"));if(2>c.version||!e.Na)e.Na=e.getExtension("EXT_disjoint_timer_query");for(var x of oc(e))x.includes("lose_context")||x.includes("debug")||e.getExtension(x)}return l},ia=c=>{E=I[c];D.ctx=W=E?.F;return!(c&&!W)},Z,E,Cc={},Ec=()=>{if(!Dc){var c={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",
HOME:"/home/web_user",LANG:(globalThis.navigator?.language??"C").replace("-","_")+".UTF-8",_:ka||"./this.program"},e;for(e in Cc)void 0===Cc[e]?delete c[e]:c[e]=Cc[e];var l=[];for(e in c)l.push(`${e}=${c[e]}`);Dc=l}return Dc},Dc,Fc=[null,[],[]],Gc=[],Hc=()=>{var c=oc(W);return c=c.concat(c.map(e=>"GL_"+e))},Ic=(c,e,l)=>{if(e){var q=void 0;switch(c){case 36346:q=1;break;case 36344:0!=l&&1!=l&&(Z||=1280);return;case 34814:case 36345:q=0;break;case 34466:var x=W.getParameter(34467);q=x?x.length:0;break;
case 33309:if(2>E.version){Z||=1282;return}q=Hc().length;break;case 33307:case 33308:if(2>E.version){Z||=1280;return}q=33307==c?3:0}if(void 0===q)switch(x=W.getParameter(c),typeof x){case "number":q=x;break;case "boolean":q=x?1:0;break;case "string":Z||=1280;return;case "object":if(null===x)switch(c){case 34964:case 35725:case 34965:case 36006:case 36007:case 32873:case 34229:case 36662:case 36663:case 35053:case 35055:case 36010:case 35097:case 35869:case 32874:case 36389:case 35983:case 35368:case 34068:q=
0;break;default:Z||=1280;return}else{if(x instanceof Float32Array||x instanceof Uint32Array||x instanceof Int32Array||x instanceof Array){for(c=0;c<x.length;++c)switch(l){case 0:L[e+4*c>>2]=x[c];break;case 2:ya[e+4*c>>2]=x[c];break;case 4:va[e+c]=x[c]?1:0}return}try{q=x.name|0}catch(y){Z||=1280;qa(`GL_INVALID_ENUM in glGet${l}v: Unknown object returned from WebGL getParameter(${c})! (error: ${y})`);return}}break;default:Z||=1280;qa(`GL_INVALID_ENUM in glGet${l}v: Native code calling glGet${l}v(${c}) and it returns ${x} of type ${typeof x}!`);
return}switch(l){case 1:l=q;M[e>>2]=l;M[e+4>>2]=(l-M[e>>2])/4294967296;break;case 0:L[e>>2]=q;break;case 2:ya[e>>2]=q;break;case 4:va[e]=q?1:0}}else Z||=1281},Kc=c=>{var e=Xb(c)+1,l=Jc(e);l&&Wb(c,l,e);return l},Lc=c=>"]"==c.slice(-1)&&c.lastIndexOf("["),Mc=c=>{c-=5120;return 0==c?va:1==c?J:2==c?wa:4==c?L:6==c?ya:5==c||28922==c||28520==c||30779==c||30782==c?M:xa},Oc=c=>Nc(c);
(()=>{let c=rb.prototype;Object.assign(c,{isAliasOf:function(l){if(!(this instanceof rb&&l instanceof rb))return!1;var q=this.m.v.o,x=this.m.u;l.m=l.m;var y=l.m.v.o;for(l=l.m.u;q.C;)x=q.fa(x),q=q.C;for(;y.C;)l=y.fa(l),y=y.C;return q===y&&x===l},clone:function(){this.m.u||pb(this);if(this.m.$)return this.m.count.value+=1,this;var l=hb,q=Object,x=q.create,y=Object.getPrototypeOf(this),z=this.m;l=l(x.call(q,y,{m:{value:{count:z.count,ba:z.ba,$:z.$,u:z.u,v:z.v,D:z.D,J:z.J}}}));l.m.count.value+=1;l.m.ba=
!1;return l},["delete"](){this.m.u||pb(this);if(this.m.ba&&!this.m.$)throw new O("Object already scheduled for deletion");fb(this);var l=this.m;--l.count.value;0===l.count.value&&(l.D?l.J.N(l.D):l.v.o.N(l.u));this.m.$||(this.m.D=void 0,this.m.u=void 0)},isDeleted:function(){return!this.m.u},deleteLater:function(){this.m.u||pb(this);if(this.m.ba&&!this.m.$)throw new O("Object already scheduled for deletion");qb.push(this);this.m.ba=!0;return this}});const e=Symbol.dispose;e&&(c[e]=c["delete"])})();
Object.assign(Fb.prototype,{wb(c){this.Va&&(c=this.Va(c));return c},Ma(c){this.N?.(c)},I:kb,s:function(c){function e(){return this.pa?Eb(this.o.M,{v:this.Ib,u:l,J:this,D:c}):Eb(this.o.M,{v:this,u:c})}var l=this.wb(c);if(!l)return this.Ma(c),null;var q=Db(this.o,l);if(void 0!==q){if(0===q.m.count.value)return q.m.u=l,q.m.D=c,q.clone();q=q.clone();this.Ma(c);return q}q=this.o.vb(l);q=sb[q];if(!q)return e.call(this);q=this.oa?q.lb:q.pointerType;var x=Cb(l,this.o,q.o);return null===x?e.call(this):this.pa?
Eb(q.o.M,{v:q,u:x,J:this,D:c}):Eb(q.o.M,{v:q,u:x})}});for(let c=0;32>c;++c)Gc.push(Array(c));D.print&&(pa=D.print);D.printErr&&(qa=D.printErr);D.wasmBinary&&(ra=D.wasmBinary);D.thisProgram&&(ka=D.thisProgram);if(D.preInit)for("function"==typeof D.preInit&&(D.preInit=[D.preInit]);0<D.preInit.length;)D.preInit.shift()();
var Sc={346227:(c,e,l,q,x)=>{if("undefined"===typeof window||void 0===(window.AudioContext||window.webkitAudioContext))return 0;if("undefined"===typeof window.miniaudio){window.miniaudio={referenceCount:0};window.miniaudio.device_type={};window.miniaudio.device_type.playback=c;window.miniaudio.device_type.capture=e;window.miniaudio.device_type.duplex=l;window.miniaudio.device_state={};window.miniaudio.device_state.stopped=q;window.miniaudio.device_state.started=x;let y=window.miniaudio;y.devices=
[];y.track_device=function(z){for(var A=0;A<y.devices.length;++A)if(null==y.devices[A])return y.devices[A]=z,A;y.devices.push(z);return y.devices.length-1};y.untrack_device_by_index=function(z){for(y.devices[z]=null;0<y.devices.length;)if(null==y.devices[y.devices.length-1])y.devices.pop();else break};y.untrack_device=function(z){for(var A=0;A<y.devices.length;++A)if(y.devices[A]==z)return y.untrack_device_by_index(A)};y.get_device_by_index=function(z){return y.devices[z]};y.unlock_event_types=["touchend",
"click"];y.unlock=function(){for(var z=0;z<y.devices.length;++z){var A=y.devices[z];null!=A&&null!=A.K&&A.state===y.device_state.started&&A.K.resume().then(()=>{Pc(A.Sa)},C=>{console.error("Failed to resume audiocontext",C)})}y.unlock_event_types.map(function(C){document.removeEventListener(C,y.unlock,!0)})};y.unlock_event_types.map(function(z){document.addEventListener(z,y.unlock,!0)})}window.miniaudio.referenceCount+=1;return 1},348405:()=>{"undefined"!==typeof window.miniaudio&&(window.miniaudio.unlock_event_types.map(function(c){document.removeEventListener(c,
window.miniaudio.unlock,!0)}),--window.miniaudio.referenceCount,0===window.miniaudio.referenceCount&&delete window.miniaudio)},348709:()=>void 0!==navigator.mediaDevices&&void 0!==navigator.mediaDevices.getUserMedia,348813:()=>{try{var c=new (window.AudioContext||window.webkitAudioContext),e=c.sampleRate;c.close();return e}catch(l){return 0}},348984:(c,e,l,q,x,y)=>{if("undefined"===typeof window.miniaudio)return-1;var z={},A={};c==window.miniaudio.device_type.playback&&0!=l&&(A.sampleRate=l);z.K=
new (window.AudioContext||window.webkitAudioContext)(A);z.K.suspend();z.state=window.miniaudio.device_state.stopped;l=0;c!=window.miniaudio.device_type.playback&&(l=e);z.S=z.K.createScriptProcessor(q,l,e);z.S.onaudioprocess=function(C){if(null==z.na||0==z.na.length)z.na=new Float32Array(ya.buffer,x,q*e);if(c==window.miniaudio.device_type.capture||c==window.miniaudio.device_type.duplex){for(var G=0;G<e;G+=1)for(var u=C.inputBuffer.getChannelData(G),a=z.na,d=0;d<q;d+=1)a[d*e+G]=u[d];Qc(y,q,x)}if(c==
window.miniaudio.device_type.playback||c==window.miniaudio.device_type.duplex)for(Rc(y,q,x),G=0;G<C.outputBuffer.numberOfChannels;++G)for(u=C.outputBuffer.getChannelData(G),a=z.na,d=0;d<q;d+=1)u[d]=a[d*e+G];else for(G=0;G<C.outputBuffer.numberOfChannels;++G)C.outputBuffer.getChannelData(G).fill(0)};c!=window.miniaudio.device_type.capture&&c!=window.miniaudio.device_type.duplex||navigator.mediaDevices.getUserMedia({audio:!0,video:!1}).then(function(C){z.va=z.K.createMediaStreamSource(C);z.va.connect(z.S);
z.S.connect(z.K.destination)}).catch(function(C){console.log("Failed to get user media: "+C)});c==window.miniaudio.device_type.playback&&z.S.connect(z.K.destination);z.Sa=y;return window.miniaudio.track_device(z)},351861:c=>window.miniaudio.get_device_by_index(c).K.sampleRate,351934:c=>{c=window.miniaudio.get_device_by_index(c);void 0!==c.S&&(c.S.onaudioprocess=function(){},c.S.disconnect(),c.S=void 0);void 0!==c.va&&(c.va.disconnect(),c.va=void 0);c.K.close();c.K=void 0;c.Sa=void 0},352334:c=>{window.miniaudio.untrack_device_by_index(c)},
352384:c=>{c=window.miniaudio.get_device_by_index(c);c.K.resume();c.state=window.miniaudio.device_state.started},352523:c=>{c=window.miniaudio.get_device_by_index(c);c.K.suspend();c.state=window.miniaudio.device_state.stopped}},cb,Jc,bb,Tc,Uc,Vc,Wc,Pc,Qc,Rc,Xc,Yc,Na,Nc,Pa,Ca,Hb,$c={__syscall_fcntl64:function(){return 0},__syscall_ioctl:function(){return 0},__syscall_openat:function(){},_abort_js:()=>Da(""),_embind_create_inheriting_constructor:(c,e,l)=>{c=R(c);e=eb(e,"wrapper");l=Q(l);var q=e.o,x=
q.M,y=q.C.M,z=q.C.constructor;c=Ua(c,function(...A){for(var C of q.C.Ta)if(this[C]===y[C])throw new Ya(`Pure virtual function ${C} must be implemented in JavaScript`);Object.defineProperty(this,"__parent",{value:x});this.__construct(...A)});x.__construct=function(...A){if(this===x)throw new O("Pass correct 'this' to __construct");A=z.implement(this,...A);fb(A);var C=A.m;A.notifyOnDestruction();C.$=!0;Object.defineProperties(this,{m:{value:C}});hb(this);A=C.u;A=$a(q,A);if(Za.hasOwnProperty(A))throw new O(`Tried to register registered instance: ${A}`);
Za[A]=this};x.__destruct=function(){if(this===x)throw new O("Pass correct 'this' to __destruct");fb(this);var A=this.m.u;A=$a(q,A);if(Za.hasOwnProperty(A))delete Za[A];else throw new O(`Tried to unregister unregistered instance: ${A}`);};c.prototype=Object.create(x);Object.assign(c.prototype,l);return Xa(c)},_embind_finalize_value_object:c=>{var e=ib[c];delete ib[c];var l=e.Ha,q=e.N,x=e.Oa,y=x.map(z=>z.zb).concat(x.map(z=>z.zh));T([c],y,z=>{var A={},C,G;for([C,G]of x.entries()){const u=z[C],a=G.xb,
d=G.yb,r=z[C+x.length],p=G.yh,v=G.Ah;A[G.tb]={read:f=>u.s(a(d,f)),write:(f,b)=>{var g=[];p(v,f,r.B(g,b));jb(g)},optional:u.optional}}return[{name:e.name,s:u=>{var a={},d;for(d in A)a[d]=A[d].read(u);q(u);return a},B:(u,a)=>{for(var d in A)if(!(d in a||A[d].optional))throw new TypeError(`Missing field: "${d}"`);var r=l();for(d in A)A[d].write(r,a[d]);null!==u&&u.push(q,r);return r},I:kb,H:q}]})},_embind_register_bigint:()=>{},_embind_register_bool:(c,e,l,q)=>{e=R(e);S(c,{name:e,s:function(x){return!!x},
B:function(x,y){return y?l:q},I:function(x){return this.s(J[x])},H:null})},_embind_register_class:(c,e,l,q,x,y,z,A,C,G,u,a,d)=>{u=R(u);y=V(x,y);A&&=V(z,A);G&&=V(C,G);d=V(a,d);var r=vb(u);ub(r,function(){Lb(`Cannot construct ${u} due to unbound types`,[q])});T([c,e,l],q?[q]:[],p=>{p=p[0];if(q){var v=p.o;var f=v.M}else f=rb.prototype;p=Ua(u,function(...k){if(Object.getPrototypeOf(this)!==b)throw new O(`Use 'new' to construct ${u}`);if(void 0===g.U)throw new O(`${u} has no accessible constructor`);var h=
g.U[k.length];if(void 0===h)throw new O(`Tried to invoke ctor of ${u} with invalid number of parameters (${k.length}) - expected (${Object.keys(g.U).toString()}) parameters instead!`);return h.apply(this,k)});var b=Object.create(f,{constructor:{value:p}});p.prototype=b;var g=new wb(u,p,b,d,v,y,A,G);if(g.C){var n;(n=g.C).ga??(n.ga=[]);g.C.ga.push(g)}v=new Fb(u,g,!0,!1,!1);n=new Fb(u+"*",g,!1,!1,!1);f=new Fb(u+" const*",g,!1,!0,!1);sb[c]={pointerType:n,lb:f};Gb(r,p);return[v,n,f]})},_embind_register_class_class_function:(c,
e,l,q,x,y,z)=>{var A=Ob(l,q);e=R(e);e=Pb(e);y=V(x,y);T([],[c],C=>{function G(){Lb(`Cannot call ${u} due to unbound types`,A)}C=C[0];var u=`${C.name}.${e}`;e.startsWith("@@")&&(e=Symbol[e.substring(2)]);var a=C.o.constructor;void 0===a[e]?(G.R=l-1,a[e]=G):(tb(a,e,u),a[e].A[l-1]=G);T([],A,d=>{d=Nb(u,[d[0],null].concat(d.slice(1)),null,y,z);void 0===a[e].A?(d.R=l-1,a[e]=d):a[e].A[l-1]=d;if(C.o.ga)for(const r of C.o.ga)r.constructor.hasOwnProperty(e)||(r.constructor[e]=d);return[]});return[]})},_embind_register_class_class_property:(c,
e,l,q,x,y,z,A)=>{e=R(e);y=V(x,y);T([],[c],C=>{C=C[0];var G=`${C.name}.${e}`,u={get(){Lb(`Cannot access ${G} due to unbound types`,[l])},enumerable:!0,configurable:!0};u.set=A?()=>{Lb(`Cannot access ${G} due to unbound types`,[l])}:()=>{throw new O(`${G} is a read-only property`);};Object.defineProperty(C.o.constructor,e,u);T([],[l],a=>{a=a[0];var d={get(){return a.s(y(q))},enumerable:!0};A&&(A=V(z,A),d.set=r=>{var p=[];A(q,a.B(p,r));jb(p)});Object.defineProperty(C.o.constructor,e,d);return[]});return[]})},
_embind_register_class_constructor:(c,e,l,q,x,y)=>{var z=Ob(e,l);x=V(q,x);T([],[c],A=>{A=A[0];var C=`constructor ${A.name}`;void 0===A.o.U&&(A.o.U=[]);if(void 0!==A.o.U[e-1])throw new O(`Cannot register multiple constructors with identical number of parameters (${e-1}) for class '${A.name}'! Overload resolution is currently only performed using the parameter count, not actual type info!`);A.o.U[e-1]=()=>{Lb(`Cannot construct ${A.name} due to unbound types`,z)};T([],z,G=>{G.splice(1,0,null);A.o.U[e-
1]=Nb(C,G,null,x,y);return[]});return[]})},_embind_register_class_function:(c,e,l,q,x,y,z,A)=>{var C=Ob(l,q);e=R(e);e=Pb(e);y=V(x,y);T([],[c],G=>{function u(){Lb(`Cannot call ${a} due to unbound types`,C)}G=G[0];var a=`${G.name}.${e}`;e.startsWith("@@")&&(e=Symbol[e.substring(2)]);A&&G.o.Ta.push(e);var d=G.o.M,r=d[e];void 0===r||void 0===r.A&&r.className!==G.name&&r.R===l-2?(u.R=l-2,u.className=G.name,d[e]=u):(tb(d,e,a),d[e].A[l-2]=u);T([],C,p=>{p=Nb(a,p,G,y,z);void 0===d[e].A?(p.R=l-2,d[e]=p):d[e].A[l-
2]=p;return[]});return[]})},_embind_register_class_property:(c,e,l,q,x,y,z,A,C,G)=>{e=R(e);x=V(q,x);T([],[c],u=>{u=u[0];var a=`${u.name}.${e}`,d={get(){Lb(`Cannot access ${a} due to unbound types`,[l,z])},enumerable:!0,configurable:!0};d.set=C?()=>Lb(`Cannot access ${a} due to unbound types`,[l,z]):()=>{throw new O(a+" is a read-only property");};Object.defineProperty(u.o.M,e,d);T([],C?[l,z]:[l],r=>{var p=r[0],v={get(){var b=Qb(this,u,a+" getter");return p.s(x(y,b))},enumerable:!0};if(C){C=V(A,C);
var f=r[1];v.set=function(b){var g=Qb(this,u,a+" setter"),n=[];C(G,g,f.B(n,b));jb(n)}}Object.defineProperty(u.o.M,e,v);return[]});return[]})},_embind_register_emval:c=>S(c,Sb),_embind_register_enum:(c,e,l,q,x)=>{e=R(e);x=0===x?"object":1===x?"number":"string";switch(x){case "object":function z(){}z.values={};S(c,{name:e,constructor:z,valueType:x,s:function(A){return this.constructor.values[A]},B:(A,C)=>C.value,I:Tb(e,l,q),H:null});ub(e,z);break;case "number":var y={};S(c,{name:e,Fa:y,valueType:x,
s:A=>A,B:(A,C)=>C,I:Tb(e,l,q),H:null});ub(e,y);delete D[e].R;break;case "string":y={},S(c,{name:e,$a:{},Wa:{},Fa:y,valueType:x,s:function(A){return this.Wa[A]},B:function(A,C){return this.$a[C]},I:Tb(e,l,q),H:null}),ub(e,y),delete D[e].R}},_embind_register_enum_value:(c,e,l)=>{var q=eb(c,"enum");e=R(e);switch(q.valueType){case "object":c=q.constructor;q=Object.create(q.constructor.prototype,{value:{value:l},constructor:{value:Ua(`${q.name}_${e}`,function(){})}});c.values[l]=q;c[e]=q;break;case "number":q.Fa[e]=
l;break;case "string":q.$a[e]=l,q.Wa[l]=e,q.Fa[e]=e}},_embind_register_float:(c,e,l)=>{e=R(e);S(c,{name:e,s:q=>q,B:(q,x)=>x,I:Ub(e,l),H:null})},_embind_register_function:(c,e,l,q,x,y)=>{var z=Ob(e,l);c=R(c);c=Pb(c);x=V(q,x);ub(c,function(){Lb(`Cannot call ${c} due to unbound types`,z)},e-1);T([],z,A=>{Gb(c,Nb(c,[A[0],null].concat(A.slice(1)),null,x,y),e-1);return[]})},_embind_register_integer:(c,e,l,q,x)=>{e=R(e);let y=A=>A;if(0===q){var z=32-8*l;y=A=>A<<z>>>z;x=y(x)}S(c,{name:e,s:y,B:(A,C)=>C,I:Vb(e,
l,0!==q),H:null})},_embind_register_memory_view:(c,e,l)=>{function q(y){return new x(va.buffer,M[y+4>>2],M[y>>2])}var x=[Int8Array,Uint8Array,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array][e];l=R(l);S(c,{name:l,s:q,I:q},{Db:!0})},_embind_register_std_string:(c,e)=>{e=R(e);S(c,{name:e,s(l){var q=(q=l+4)?Ta(J,q,M[l>>2],!0):"";cb(l);return q},B(l,q){q instanceof ArrayBuffer&&(q=new Uint8Array(q));var x="string"==typeof q;if(!(x||ArrayBuffer.isView(q)&&1==q.BYTES_PER_ELEMENT))throw new O("Cannot pass non-string to std::string");
var y=x?Xb(q):q.length;var z=Jc(4+y+1),A=z+4;M[z>>2]=y;x?Wb(q,A,y+1):J.set(q,A);null!==l&&l.push(cb,z);return z},I:kb,H(l){cb(l)}})},_embind_register_std_wstring:(c,e,l)=>{l=R(l);if(2===e){var q=Zb;var x=$b;var y=ac}else q=bc,x=cc,y=dc;S(c,{name:l,s:z=>{var A=q(z+4,M[z>>2]*e,!0);cb(z);return A},B:(z,A)=>{if("string"!=typeof A)throw new O(`Cannot pass non-string to C++ string type ${l}`);var C=y(A),G=Jc(4+C+e);M[G>>2]=C/e;x(A,G+4,C+e);null!==z&&z.push(cb,G);return G},I:kb,H(z){cb(z)}})},_embind_register_value_object:(c,
e,l,q,x,y)=>{ib[c]={name:R(e),Ha:V(l,q),N:V(x,y),Oa:[]}},_embind_register_value_object_field:(c,e,l,q,x,y,z,A,C,G)=>{ib[c].Oa.push({tb:R(e),zb:l,xb:V(q,x),yb:y,zh:z,yh:V(A,C),Ah:G})},_embind_register_void:(c,e)=>{e=R(e);S(c,{Fb:!0,name:e,s:()=>{},B:()=>{}})},_emscripten_throw_longjmp:()=>{throw Infinity;},_emval_create_invoker:(c,e,l)=>{var [q,...x]=gc(c,e),y=q.B.bind(q),z=x.map(C=>C.I.bind(C));c--;var A=Array(c);e=`methodCaller<(${x.map(C=>C.name)}) => ${q.name}>`;return fc(Ua(e,(C,G,u,a)=>{for(var d=
0,r=0;r<c;++r)A[r]=z[r](a+d),d+=8;switch(l){case 0:var p=Q(C).apply(null,A);break;case 2:p=Reflect.construct(Q(C),A);break;case 3:p=A[0];break;case 1:p=Q(C)[ic(G)](...A)}C=[];p=y(C,p);C.length&&(M[u>>2]=Xa(C));return p}))},_emval_decref:Rb,_emval_get_property:(c,e)=>{c=Q(c);e=Q(e);return Xa(c[e])},_emval_incref:c=>{9<c&&(Wa[c+1]+=1)},_emval_invoke:(c,e,l,q,x)=>ec[c](e,l,q,x),_emval_new_array:()=>Xa([]),_emval_new_cstring:c=>Xa(ic(c)),_emval_new_object:()=>Xa({}),_emval_run_destructors:c=>{var e=Q(c);
jb(e);Rb(c)},_emval_set_property:(c,e,l)=>{c=Q(c);e=Q(e);l=Q(l);c[e]=l},_gmtime_js:function(c,e,l){c=new Date(1E3*(e+2097152>>>0<4194305-!!c?(c>>>0)+4294967296*e:NaN));L[l>>2]=c.getUTCSeconds();L[l+4>>2]=c.getUTCMinutes();L[l+8>>2]=c.getUTCHours();L[l+12>>2]=c.getUTCDate();L[l+16>>2]=c.getUTCMonth();L[l+20>>2]=c.getUTCFullYear()-1900;L[l+24>>2]=c.getUTCDay();L[l+28>>2]=(c.getTime()-Date.UTC(c.getUTCFullYear(),0,1,0,0,0,0))/864E5|0},_localtime_js:function(c,e,l){c=new Date(1E3*(e+2097152>>>0<4194305-
!!c?(c>>>0)+4294967296*e:NaN));L[l>>2]=c.getSeconds();L[l+4>>2]=c.getMinutes();L[l+8>>2]=c.getHours();L[l+12>>2]=c.getDate();L[l+16>>2]=c.getMonth();L[l+20>>2]=c.getFullYear()-1900;L[l+24>>2]=c.getDay();e=c.getFullYear();L[l+28>>2]=(0!==e%4||0===e%100&&0!==e%400?kc:jc)[c.getMonth()]+c.getDate()-1|0;L[l+36>>2]=-(60*c.getTimezoneOffset());e=(new Date(c.getFullYear(),6,1)).getTimezoneOffset();var q=(new Date(c.getFullYear(),0,1)).getTimezoneOffset();L[l+32>>2]=(e!=q&&c.getTimezoneOffset()==Math.min(q,
e))|0},_timegm_js:function(c){var e=new Date(Date.UTC(L[c+20>>2]+1900,L[c+16>>2],L[c+12>>2],L[c+8>>2],L[c+4>>2],L[c>>2],0));L[c+24>>2]=e.getUTCDay();L[c+28>>2]=(e.getTime()-Date.UTC(e.getUTCFullYear(),0,1,0,0,0,0))/864E5|0;c=e.getTime()/1E3;Yc((N=c,1<=+Math.abs(N)?0<N?+Math.floor(N/4294967296)>>>0:~~+Math.ceil((N-+(~~N>>>0))/4294967296)>>>0:0));return c>>>0},_tzset_js:(c,e,l,q)=>{var x=(new Date).getFullYear(),y=(new Date(x,0,1)).getTimezoneOffset();x=(new Date(x,6,1)).getTimezoneOffset();M[c>>2]=
60*Math.max(y,x);L[e>>2]=Number(y!=x);e=z=>{var A=Math.abs(z);return`UTC${0<=z?"-":"+"}${String(Math.floor(A/60)).padStart(2,"0")}${String(A%60).padStart(2,"0")}`};c=e(y);e=e(x);x<y?(Wb(c,l,17),Wb(e,q,17)):(Wb(c,q,17),Wb(e,l,17))},beginPixelLocalStorageWEBGL:function(c,e,l){(c=I[c].F.ta)&&c.beginPixelLocalStorageWEBGL(new Uint32Array(Ca.buffer,4*l,e))},clock_time_get:function(c,e,l,q){if(!(0<=c&&3>=c))return 28;c=Math.round(1E6*(0===c?Date.now():performance.now()));Ia=[c>>>0,(N=c,1<=+Math.abs(N)?
0<N?+Math.floor(N/4294967296)>>>0:~~+Math.ceil((N-+(~~N>>>0))/4294967296)>>>0:0)];L[q>>2]=Ia[0];L[q+4>>2]=Ia[1];return 0},decode_image:function(c,e,l){var q=D.images;q||(q=new Map,D.images=q);var x=new Image;q.set(c,x);e=D.HEAP8.subarray(e,e+l);l=new Uint8Array(l);l.set(e);x.src=URL.createObjectURL(new Blob([l],{type:"image/png"}));x.onload=function(){D._setWebImage(c,x.width,x.height)}},delete_image:function(c){var e=D.images;e&&e.get(c)&&e.delete(c)},emscripten_asm_const_int:(c,e,l)=>{lc.length=
0;for(var q;q=J[e++];){var x=105!=q;x&=112!=q;l+=x&&l%8?4:0;lc.push(112==q?M[l>>2]:105==q?L[l>>2]:za[l>>3]);l+=x?8:4}return Sc[c](...lc)},emscripten_date_now:()=>Date.now(),emscripten_get_now:()=>performance.now(),emscripten_resize_heap:c=>{var e=J.length;c>>>=0;if(2147483648<c)return!1;for(var l=1;4>=l;l*=2){var q=e*(1+.2/l);q=Math.min(q,c+100663296);a:{q=(Math.min(2147483648,65536*Math.ceil(Math.max(c,q)/65536))-Ca.buffer.byteLength+65535)/65536|0;try{Ca.grow(q);Ba();var x=1;break a}catch(y){}x=
void 0}if(x)return!0}return!1},emscripten_webgl_enable_extension:(c,e)=>{c=I[c];e=e?Ta(J,e):"";e.startsWith("GL_")&&(e=e.slice(3));"WEBGL_draw_instanced_base_vertex_base_instance"==e&&mc(W);"WEBGL_multi_draw_instanced_base_vertex_base_instance"==e&&nc(W);"WEBGL_multi_draw"==e&&(W.Gb=W.getExtension("WEBGL_multi_draw"));"EXT_polygon_offset_clamp"==e&&(W.sb=W.getExtension("EXT_polygon_offset_clamp"));"EXT_clip_control"==e&&(W.rb=W.getExtension("EXT_clip_control"));"WEBGL_polygon_mode"==e&&(W.Dh=W.getExtension("WEBGL_polygon_mode"));
return!!c.F.getExtension(e)},emscripten_webgl_get_current_context:()=>E?E.handle:0,emscripten_webgl_make_context_current:c=>ia(c)?0:-5,enable_WEBGL_provoking_vertex:function(c){c=I[c].F;c.Ua=c.getExtension("WEBGL_provoking_vertex");return!!c.Ua},enable_WEBGL_shader_pixel_local_storage_coherent:function(c){c=I[c].F;const e=c.getExtension("WEBGL_shader_pixel_local_storage");if(e&&e.isCoherent()){if(5==e.framebufferTexturePixelLocalStorageWEBGL.length)return c.ta=e,!0;console.warn("WEBGL_shader_pixel_local_storage is advertised, but a deprecated version has been detected. Disabling.")}return!1},
endPixelLocalStorageWEBGL:function(c,e,l){(c=I[c].F.ta)&&c.endPixelLocalStorageWEBGL(new Uint32Array(Ca.buffer,4*l,e))},environ_get:(c,e)=>{var l=0,q=0,x;for(x of Ec()){var y=e+l;M[c+q>>2]=y;l+=Wb(x,y,Infinity)+1;q+=4}return 0},environ_sizes_get:(c,e)=>{var l=Ec();M[c>>2]=l.length;c=0;for(var q of l)c+=Xb(q)+1;M[e>>2]=c;return 0},fd_close:()=>52,fd_read:()=>52,fd_seek:function(){return 70},fd_write:(c,e,l,q)=>{for(var x=0,y=0;y<l;y++){var z=M[e>>2],A=M[e+4>>2];e+=8;for(var C=0;C<A;C++){var G=c,u=
J[z+C],a=Fc[G];0===u||10===u?((1===G?pa:qa)(Ta(a)),a.length=0):a.push(u)}x+=A}M[q>>2]=x;return 0},framebufferPixelLocalClearValuefvWEBGL:function(c,e,l,q,x,y){(c=I[c].F.ta)&&c.framebufferPixelLocalClearValuefvWEBGL(e,[l,q,x,y])},framebufferTexturePixelLocalStorageWEBGL:function(c,e,l,q,x,y){(c=I[c].F.ta)&&c.framebufferTexturePixelLocalStorageWEBGL(e,tc[l],q,x,y)},glActiveTexture:c=>W.activeTexture(c),glAttachShader:(c,e)=>{W.attachShader(X[c],Y[e])},glBindAttribLocation:(c,e,l)=>{W.bindAttribLocation(X[c],
e,l?Ta(J,l):"")},glBindBuffer:(c,e)=>{35051==c?W.Ca=e:35052==c&&(W.Y=e);W.bindBuffer(c,qc[e])},glBindBufferRange:(c,e,l,q,x)=>{W.bindBufferRange(c,e,qc[l],q,x)},glBindFramebuffer:(c,e)=>{W.bindFramebuffer(c,rc[e])},glBindRenderbuffer:(c,e)=>{W.bindRenderbuffer(c,sc[e])},glBindSampler:(c,e)=>{W.bindSampler(c,vc[e])},glBindTexture:(c,e)=>{W.bindTexture(c,tc[e])},glBindVertexArray:c=>{W.bindVertexArray(uc[c])},glBlendColor:(c,e,l,q)=>W.blendColor(c,e,l,q),glBlendEquation:c=>W.blendEquation(c),glBlendEquationSeparate:(c,
e)=>W.blendEquationSeparate(c,e),glBlendFunc:(c,e)=>W.blendFunc(c,e),glBlendFuncSeparate:(c,e,l,q)=>W.blendFuncSeparate(c,e,l,q),glBlitFramebuffer:(c,e,l,q,x,y,z,A,C,G)=>W.blitFramebuffer(c,e,l,q,x,y,z,A,C,G),glBufferData:(c,e,l,q)=>{l&&e?W.bufferData(c,J,q,l,e):W.bufferData(c,e,q)},glBufferSubData:(c,e,l,q)=>{l&&W.bufferSubData(c,e,J,q,l)},glCheckFramebufferStatus:c=>W.checkFramebufferStatus(c),glClear:c=>W.clear(c),glClearBufferfi:(c,e,l,q)=>W.clearBufferfi(c,e,l,q),glClearBufferfv:(c,e,l)=>{W.clearBufferfv(c,
e,ya,l>>2)},glClearBufferiv:(c,e,l)=>{W.clearBufferiv(c,e,L,l>>2)},glClearBufferuiv:(c,e,l)=>{W.clearBufferuiv(c,e,M,l>>2)},glClearColor:(c,e,l,q)=>W.clearColor(c,e,l,q),glClearDepthf:c=>W.clearDepth(c),glClearStencil:c=>W.clearStencil(c),glColorMask:(c,e,l,q)=>{W.colorMask(!!c,!!e,!!l,!!q)},glCompileShader:c=>{W.compileShader(Y[c])},glCompressedTexSubImage2D:(c,e,l,q,x,y,z,A,C)=>{W.Y||!A?W.compressedTexSubImage2D(c,e,l,q,x,y,z,A,C):W.compressedTexSubImage2D(c,e,l,q,x,y,z,J,C,A)},glCompressedTexSubImage3D:(c,
e,l,q,x,y,z,A,C,G,u)=>{W.Y?W.compressedTexSubImage3D(c,e,l,q,x,y,z,A,C,G,u):W.compressedTexSubImage3D(c,e,l,q,x,y,z,A,C,J,u,G)},glCreateProgram:()=>{var c=Ac(X),e=W.createProgram();e.name=c;e.sa=e.qa=e.ra=0;e.Ia=1;X[c]=e;return c},glCreateShader:c=>{var e=Ac(Y);Y[e]=W.createShader(c);return e},glCullFace:c=>W.cullFace(c),glDeleteBuffers:(c,e)=>{for(var l=0;l<c;l++){var q=L[e+4*l>>2],x=qc[q];x&&(W.deleteBuffer(x),x.name=0,qc[q]=null,q==W.Ca&&(W.Ca=0),q==W.Y&&(W.Y=0))}},glDeleteFramebuffers:(c,e)=>
{for(var l=0;l<c;++l){var q=L[e+4*l>>2],x=rc[q];x&&(W.deleteFramebuffer(x),x.name=0,rc[q]=null)}},glDeleteProgram:c=>{if(c){var e=X[c];e?(W.deleteProgram(e),e.name=0,X[c]=null):Z||=1281}},glDeleteRenderbuffers:(c,e)=>{for(var l=0;l<c;l++){var q=L[e+4*l>>2],x=sc[q];x&&(W.deleteRenderbuffer(x),x.name=0,sc[q]=null)}},glDeleteSamplers:(c,e)=>{for(var l=0;l<c;l++){var q=L[e+4*l>>2],x=vc[q];x&&(W.deleteSampler(x),x.name=0,vc[q]=null)}},glDeleteShader:c=>{if(c){var e=Y[c];e?(W.deleteShader(e),Y[c]=null):
Z||=1281}},glDeleteTextures:(c,e)=>{for(var l=0;l<c;l++){var q=L[e+4*l>>2],x=tc[q];x&&(W.deleteTexture(x),x.name=0,tc[q]=null)}},glDeleteVertexArrays:(c,e)=>{for(var l=0;l<c;l++){var q=L[e+4*l>>2];W.deleteVertexArray(uc[q]);uc[q]=null}},glDepthFunc:c=>W.depthFunc(c),glDepthMask:c=>{W.depthMask(!!c)},glDepthRangef:(c,e)=>W.depthRange(c,e),glDisable:c=>W.disable(c),glDisableVertexAttribArray:c=>{W.disableVertexAttribArray(c)},glDrawArrays:(c,e,l)=>{W.drawArrays(c,e,l)},glDrawArraysInstanced:(c,e,l,
q)=>{W.drawArraysInstanced(c,e,l,q)},glDrawBuffers:(c,e)=>{for(var l=Gc[c],q=0;q<c;q++)l[q]=L[e+4*q>>2];W.drawBuffers(l)},glDrawElements:(c,e,l,q)=>{W.drawElements(c,e,l,q)},glDrawElementsInstanced:(c,e,l,q,x)=>{W.drawElementsInstanced(c,e,l,q,x)},glEnable:c=>W.enable(c),glEnableVertexAttribArray:c=>{W.enableVertexAttribArray(c)},glFlush:()=>W.flush(),glFramebufferRenderbuffer:(c,e,l,q)=>{W.framebufferRenderbuffer(c,e,l,sc[q])},glFramebufferTexture2D:(c,e,l,q,x)=>{W.framebufferTexture2D(c,e,l,tc[q],
x)},glFramebufferTextureLayer:(c,e,l,q,x)=>{W.framebufferTextureLayer(c,e,tc[l],q,x)},glFrontFace:c=>W.frontFace(c),glGenBuffers:(c,e)=>{Bc(c,e,"createBuffer",qc)},glGenFramebuffers:(c,e)=>{Bc(c,e,"createFramebuffer",rc)},glGenRenderbuffers:(c,e)=>{Bc(c,e,"createRenderbuffer",sc)},glGenSamplers:(c,e)=>{Bc(c,e,"createSampler",vc)},glGenTextures:(c,e)=>{Bc(c,e,"createTexture",tc)},glGenVertexArrays:(c,e)=>{Bc(c,e,"createVertexArray",uc)},glGenerateMipmap:c=>W.generateMipmap(c),glGetFloatv:(c,e)=>Ic(c,
e,2),glGetFramebufferAttachmentParameteriv:(c,e,l,q)=>{c=W.getFramebufferAttachmentParameter(c,e,l);if(c instanceof WebGLRenderbuffer||c instanceof WebGLTexture)c=c.name|0;L[q>>2]=c},glGetIntegerv:(c,e)=>Ic(c,e,0),glGetProgramInfoLog:(c,e,l,q)=>{c=W.getProgramInfoLog(X[c]);null===c&&(c="(unknown error)");e=0<e&&q?Wb(c,q,e):0;l&&(L[l>>2]=e)},glGetProgramiv:(c,e,l)=>{if(l)if(c>=pc)Z||=1281;else if(c=X[c],35716==e)c=W.getProgramInfoLog(c),null===c&&(c="(unknown error)"),L[l>>2]=c.length+1;else if(35719==
e){if(!c.sa){var q=W.getProgramParameter(c,35718);for(e=0;e<q;++e)c.sa=Math.max(c.sa,W.getActiveUniform(c,e).name.length+1)}L[l>>2]=c.sa}else if(35722==e){if(!c.qa)for(q=W.getProgramParameter(c,35721),e=0;e<q;++e)c.qa=Math.max(c.qa,W.getActiveAttrib(c,e).name.length+1);L[l>>2]=c.qa}else if(35381==e){if(!c.ra)for(q=W.getProgramParameter(c,35382),e=0;e<q;++e)c.ra=Math.max(c.ra,W.getActiveUniformBlockName(c,e).length+1);L[l>>2]=c.ra}else L[l>>2]=W.getProgramParameter(c,e);else Z||=1281},glGetShaderInfoLog:(c,
e,l,q)=>{c=W.getShaderInfoLog(Y[c]);null===c&&(c="(unknown error)");e=0<e&&q?Wb(c,q,e):0;l&&(L[l>>2]=e)},glGetShaderiv:(c,e,l)=>{l?35716==e?(c=W.getShaderInfoLog(Y[c]),null===c&&(c="(unknown error)"),L[l>>2]=c?c.length+1:0):35720==e?(c=W.getShaderSource(Y[c]),L[l>>2]=c?c.length+1:0):L[l>>2]=W.getShaderParameter(Y[c],e):Z||=1281},glGetString:c=>{var e=wc[c];if(!e){switch(c){case 7939:e=Kc(Hc().join(" "));break;case 7936:case 7937:case 37445:case 37446:(e=W.getParameter(c))||(Z||=1280);e=e?Kc(e):0;
break;case 7938:e=Kc(`OpenGL ES 3.0 (${W.getParameter(7938)})`);break;case 35724:e=W.getParameter(35724);var l=e.match(/^WebGL GLSL ES ([0-9]\.[0-9][0-9]?)(?:$| .*)/);null!==l&&(3==l[1].length&&(l[1]+="0"),e=`OpenGL ES GLSL ES ${l[1]} (${e})`);e=Kc(e);break;default:Z||=1280}wc[c]=e}return e},glGetStringi:(c,e)=>{if(2>E.version)return Z||=1282,0;var l=xc[c];if(l)return 0>e||e>=l.length?(Z||=1281,0):l[e];switch(c){case 7939:return l=Hc().map(Kc),l=xc[c]=l,0>e||e>=l.length?(Z||=1281,0):l[e];default:return Z||=
1280,0}},glGetUniformBlockIndex:(c,e)=>W.getUniformBlockIndex(X[c],e?Ta(J,e):""),glGetUniformLocation:(c,e)=>{e=e?Ta(J,e):"";if(c=X[c]){var l=c,q=l.ea,x=l.Za,y;if(!q){l.ea=q={};l.Ya={};var z=W.getProgramParameter(l,35718);for(y=0;y<z;++y){var A=W.getActiveUniform(l,y);var C=A.name;A=A.size;var G=Lc(C);G=0<G?C.slice(0,G):C;var u=l.Ia;l.Ia+=A;x[G]=[A,u];for(C=0;C<A;++C)q[u]=C,l.Ya[u++]=G}}l=c.ea;q=0;x=e;y=Lc(e);0<y&&(q=parseInt(e.slice(y+1))>>>0,x=e.slice(0,y));if((x=c.Za[x])&&q<x[0]&&(q+=x[1],l[q]=
l[q]||W.getUniformLocation(c,e)))return q}else Z||=1281;return-1},glInvalidateFramebuffer:(c,e,l)=>{for(var q=Gc[e],x=0;x<e;x++)q[x]=L[l+4*x>>2];W.invalidateFramebuffer(c,q)},glLinkProgram:c=>{c=X[c];W.linkProgram(c);c.ea=0;c.Za={}},glPixelStorei:(c,e)=>{3317==c?yc=e:3314==c&&(zc=e);W.pixelStorei(c,e)},glPolygonOffset:(c,e)=>W.polygonOffset(c,e),glReadBuffer:c=>W.readBuffer(c),glReadPixels:(c,e,l,q,x,y,z)=>{if(W.Ca)W.readPixels(c,e,l,q,x,y,z);else{var A=Mc(y);z>>>=31-Math.clz32(A.BYTES_PER_ELEMENT);
W.readPixels(c,e,l,q,x,y,A,z)}},glRenderbufferStorage:(c,e,l,q)=>W.renderbufferStorage(c,e,l,q),glRenderbufferStorageMultisample:(c,e,l,q,x)=>W.renderbufferStorageMultisample(c,e,l,q,x),glSamplerParameterf:(c,e,l)=>{W.samplerParameterf(vc[c],e,l)},glSamplerParameteri:(c,e,l)=>{W.samplerParameteri(vc[c],e,l)},glScissor:(c,e,l,q)=>W.scissor(c,e,l,q),glShaderSource:(c,e,l,q)=>{for(var x="",y=0;y<e;++y){var z=(z=M[l+4*y>>2])?Ta(J,z,q?M[q+4*y>>2]:void 0):"";x+=z}W.shaderSource(Y[c],x)},glStencilFunc:(c,
e,l)=>W.stencilFunc(c,e,l),glStencilFuncSeparate:(c,e,l,q)=>W.stencilFuncSeparate(c,e,l,q),glStencilMask:c=>W.stencilMask(c),glStencilMaskSeparate:(c,e)=>W.stencilMaskSeparate(c,e),glStencilOp:(c,e,l)=>W.stencilOp(c,e,l),glStencilOpSeparate:(c,e,l,q)=>W.stencilOpSeparate(c,e,l,q),glTexParameteri:(c,e,l)=>W.texParameteri(c,e,l),glTexStorage2D:(c,e,l,q,x)=>W.texStorage2D(c,e,l,q,x),glTexStorage3D:(c,e,l,q,x,y)=>W.texStorage3D(c,e,l,q,x,y),glTexSubImage2D:(c,e,l,q,x,y,z,A,C)=>{if(W.Y)W.texSubImage2D(c,
e,l,q,x,y,z,A,C);else if(C){var G=Mc(A);W.texSubImage2D(c,e,l,q,x,y,z,A,G,C>>>31-Math.clz32(G.BYTES_PER_ELEMENT))}else{if(C){G=Mc(A);var u=y*((zc||x)*({5:3,6:4,8:2,29502:3,29504:4,26917:2,26918:2,29846:3,29847:4}[z-6402]||1)*G.BYTES_PER_ELEMENT+yc-1&-yc);C=G.subarray(C>>>31-Math.clz32(G.BYTES_PER_ELEMENT),C+u>>>31-Math.clz32(G.BYTES_PER_ELEMENT))}else C=null;W.texSubImage2D(c,e,l,q,x,y,z,A,C)}},glTexSubImage3D:(c,e,l,q,x,y,z,A,C,G,u)=>{if(W.Y)W.texSubImage3D(c,e,l,q,x,y,z,A,C,G,u);else if(u){var a=
Mc(G);W.texSubImage3D(c,e,l,q,x,y,z,A,C,G,a,u>>>31-Math.clz32(a.BYTES_PER_ELEMENT))}else W.texSubImage3D(c,e,l,q,x,y,z,A,C,G,null)},glUniform1i:(c,e)=>{var l=W,q=l.uniform1i;var x=W.nb;if(x){var y=x.ea[c];"number"==typeof y&&(x.ea[c]=y=W.getUniformLocation(x,x.Ya[c]+(0<y?`[${y}]`:"")));c=y}else Z||=1282,c=void 0;q.call(l,c,e)},glUniformBlockBinding:(c,e,l)=>{c=X[c];W.uniformBlockBinding(c,e,l)},glUseProgram:c=>{c=X[c];W.useProgram(c);W.nb=c},glVertexAttribDivisor:(c,e)=>{W.vertexAttribDivisor(c,e)},
glVertexAttribIPointer:(c,e,l,q,x)=>{W.vertexAttribIPointer(c,e,l,q,x)},glVertexAttribPointer:(c,e,l,q,x,y)=>{W.vertexAttribPointer(c,e,l,!!q,x,y)},glViewport:(c,e,l,q)=>W.viewport(c,e,l,q),invoke_vii:Zc,isWindowsBrowser:function(){return-1<navigator.platform.indexOf("Win")},provokingVertexWEBGL:function(c,e){(c=I[c].F.Ua)&&c.provokingVertexWEBGL(e)},riveWebCall:function(c,e,l,q,x,y,z){return D.riveScripting.call(c,e,l,q,x,y,z)},riveWebHasExport:function(c,e){return D.riveScripting.Ab(c,e)},riveWebMemoryPages:function(c){return D.riveScripting.Hb(c)},
riveWebPreparing:function(c){return D.riveScripting.V(c)},riveWebRaise:function(c,e){D.riveScripting.Kb(c,e)},riveWebReadMemory:function(c,e,l,q){return D.riveScripting.read(c,e,l,q)},riveWebRegister:function(c,e,l){const q=D.riveScripting;if(!q)return 0;q.ib({exports:D,Bb:x=>{x=M[(Wc()>>2)+x];return 0===x?void 0:Hb.get(x)},Z:()=>J,Pa:()=>za,da:Qa,ua:Oc,ca:Oa,Ga:Jc,Da:cb,Ja:x=>x?Ta(J,x):"",ab:(x,y,z)=>Wb(x,y,z)});q.register(c,J.subarray(e,e+l));return 1},riveWebRelease:function(c){D.riveScripting?.release(c)},
riveWebStart:function(c){c=D.riveScripting.start(c);return null===c?0:Kc(c)},riveWebStringLength:function(c,e){return D.riveScripting.Ch(c,e)},riveWebWriteMemory:function(c,e,l,q){return D.riveScripting.write(c,e,l,q)},upload_image:function(c,e){var l=D.images;l&&(e=l.get(e))&&(c=I[c].F,c.pixelStorei(c.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!0),c.texImage2D(c.TEXTURE_2D,0,c.RGBA,c.RGBA,c.UNSIGNED_BYTE,e),c.pixelStorei(c.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1))},wasm_start_image_decode:function(c,e,l){e=new Uint8Array(Ca.buffer,
e,l);var q=new Uint8Array(l);q.set(e);Promise.resolve().then(function(){return createImageBitmap(new Blob([q]))}).then(function(x){var y=(new OffscreenCanvas(x.width,x.height)).getContext("2d");y.drawImage(x,0,0);y=y.getImageData(0,0,x.width,x.height);var z=y.data.length,A=Tc(z);A?((new Uint8Array(Ca.buffer,A,z)).set(y.data),Uc(c,x.width,x.height,A,z)):Vc(c)}).catch(function(){Vc(c)})}};function Zc(c,e,l){var q=Pa();try{Hb.get(c)(e,l)}catch(x){Na(q);if(x!==x+0)throw x;Xc(1,0)}}var ad;
ad=await (async function(){function c(l){l=ad=l.exports;cb=l.free;Jc=l.malloc;D._setWebImage=l.setWebImage;bb=l.__getTypeName;Tc=D._wasm_image_decode_alloc=l.wasm_image_decode_alloc;Uc=D._wasm_image_decode_complete=l.wasm_image_decode_complete;Vc=D._wasm_image_decode_error=l.wasm_image_decode_error;D._rive_web_vm_module_export=l.rive_web_vm_module_export;D._rive_web_vm_booting=l.rive_web_vm_booting;Wc=D._rive_web_calls=l.rive_web_calls;Pc=D._ma_device__on_notification_unlocked=l.ma_device__on_notification_unlocked;
D._ma_malloc_emscripten=l.ma_malloc_emscripten;D._ma_free_emscripten=l.ma_free_emscripten;Qc=D._ma_device_process_pcm_frames_capture__webaudio=l.ma_device_process_pcm_frames_capture__webaudio;Rc=D._ma_device_process_pcm_frames_playback__webaudio=l.ma_device_process_pcm_frames_playback__webaudio;Xc=l.setThrew;Yc=l._emscripten_tempret_set;Na=l._emscripten_stack_restore;Nc=l._emscripten_stack_alloc;Pa=l.emscripten_stack_get_current;U.vij=l.dynCall_vij;U.iij=l.dynCall_iij;U.ji=l.dynCall_ji;U.iijii=l.dynCall_iijii;
U.iiiji=l.dynCall_iiiji;U.iiji=l.dynCall_iiji;U.jii=l.dynCall_jii;U.vijj=l.dynCall_vijj;U.jiji=l.dynCall_jiji;Ca=l.memory;Hb=l.__indirect_function_table;Ba();return ad}var e={env:$c,wasi_snapshot_preview1:$c};if(D.instantiateWasm)return new Promise(l=>{D.instantiateWasm(e,(q,x)=>{l(c(q,x))})});Ea??=D.locateFile?D.locateFile("webgl2_advanced.wasm",la):la+"webgl2_advanced.wasm";return c((await Ha(e)).instance)}());
(function(){function c(){D.calledRun=!0;if(!sa){Aa=!0;ad.__wasm_call_ctors();ta?.(D);D.onRuntimeInitialized?.();if(D.postRun)for("function"==typeof D.postRun&&(D.postRun=[D.postRun]);D.postRun.length;){var e=D.postRun.shift();Ka.push(e)}Ja(Ka)}}if(D.preRun)for("function"==typeof D.preRun&&(D.preRun=[D.preRun]);D.preRun.length;)Ma();Ja(La);D.setStatus?(D.setStatus("Running..."),setTimeout(()=>{setTimeout(()=>D.setStatus(""),1);c()},1)):c()})();Aa?moduleRtn=D:moduleRtn=new Promise((c,e)=>{ta=c;ua=e});
;return moduleRtn}})();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Rive);


/***/ }),
/* 5 */
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"name":"@rive-app/webgl2","version":"2.44.2","description":"Rive\'s webgl2 based web api.","main":"rive.js","homepage":"https://rive.app","repository":{"type":"git","url":"https://github.com/rive-app/rive-wasm/tree/master/js"},"keywords":["rive","animation"],"author":"Rive","contributors":["Luigi Rosso <luigi@rive.app> (https://rive.app)","Maxwell Talbot <max@rive.app> (https://rive.app)","Arthur Vivian <arthur@rive.app> (https://rive.app)","Umberto Sonnino <umberto@rive.app> (https://rive.app)","Matthew Sullivan <matt.j.sullivan@gmail.com> (mailto:matt.j.sullivan@gmail.com)","Chris Dalton <chris@rive.app> (https://rive.app)"],"license":"MIT","files":["rive.js","rive.wasm","rive_fallback.wasm","rive.js.map","rive.d.ts","rive_advanced.mjs.d.ts","runtimeLoader.d.ts","utils","semantics"],"typings":"rive.d.ts","dependencies":{},"browser":{"fs":false,"path":false}}');

/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AccessibilityOverlay: () => (/* reexport safe */ _accessibilityOverlay__WEBPACK_IMPORTED_MODULE_1__.AccessibilityOverlay),
/* harmony export */   CHECK_STATE_MASK: () => (/* reexport safe */ _types__WEBPACK_IMPORTED_MODULE_2__.CHECK_STATE_MASK),
/* harmony export */   CHECK_STATE_OFFSET: () => (/* reexport safe */ _types__WEBPACK_IMPORTED_MODULE_2__.CHECK_STATE_OFFSET),
/* harmony export */   SemanticActionType: () => (/* reexport safe */ _types__WEBPACK_IMPORTED_MODULE_2__.SemanticActionType),
/* harmony export */   SemanticCheckState: () => (/* reexport safe */ _types__WEBPACK_IMPORTED_MODULE_2__.SemanticCheckState),
/* harmony export */   SemanticMode: () => (/* reexport safe */ _types__WEBPACK_IMPORTED_MODULE_2__.SemanticMode),
/* harmony export */   SemanticRole: () => (/* reexport safe */ _types__WEBPACK_IMPORTED_MODULE_2__.SemanticRole),
/* harmony export */   SemanticState: () => (/* reexport safe */ _types__WEBPACK_IMPORTED_MODULE_2__.SemanticState),
/* harmony export */   SemanticTrait: () => (/* reexport safe */ _types__WEBPACK_IMPORTED_MODULE_2__.SemanticTrait),
/* harmony export */   SemanticTreeModel: () => (/* reexport safe */ _semanticTreeModel__WEBPACK_IMPORTED_MODULE_0__.SemanticTreeModel),
/* harmony export */   checkStateOf: () => (/* reexport safe */ _types__WEBPACK_IMPORTED_MODULE_2__.checkStateOf),
/* harmony export */   hasState: () => (/* reexport safe */ _types__WEBPACK_IMPORTED_MODULE_2__.hasState),
/* harmony export */   hasTrait: () => (/* reexport safe */ _types__WEBPACK_IMPORTED_MODULE_2__.hasTrait),
/* harmony export */   roleName: () => (/* reexport safe */ _types__WEBPACK_IMPORTED_MODULE_2__.roleName),
/* harmony export */   stateNames: () => (/* reexport safe */ _types__WEBPACK_IMPORTED_MODULE_2__.stateNames),
/* harmony export */   traitNames: () => (/* reexport safe */ _types__WEBPACK_IMPORTED_MODULE_2__.traitNames)
/* harmony export */ });
/* harmony import */ var _semanticTreeModel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7);
/* harmony import */ var _accessibilityOverlay__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9);
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8);





/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SemanticTreeModel: () => (/* binding */ SemanticTreeModel)
/* harmony export */ });
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8);
var __spreadArray = (undefined && undefined.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};

/**
 * Maintains an in-memory semantic tree built from incremental
 * {@link SemanticsDiff} updates received each frame from the WASM runtime.
 *
 * Processing order within {@link applyDiff} follows the contract defined in
 * `semantic_snapshot.hpp`: removed → added → moved → childrenUpdated →
 * updatedSemantic → updatedGeometry.
 */
var SemanticTreeModel = /** @class */ (function () {
    function SemanticTreeModel() {
        this._nodesById = new Map();
        this._roots = [];
        this._semanticVersion = 0;
        this._geometryVersion = 0;
        this._geometryChangedIds = new Set();
        this._semanticChangedIds = new Set();
        this._debug = false;
    }
    Object.defineProperty(SemanticTreeModel.prototype, "nodeCount", {
        get: function () {
            return this._nodesById.size;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SemanticTreeModel.prototype, "semanticVersion", {
        /** Bumped when semantic content or tree structure changes. */
        get: function () {
            return this._semanticVersion;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SemanticTreeModel.prototype, "geometryVersion", {
        /** Bumped when node bounds change without a semantic/structural change. */
        get: function () {
            return this._geometryVersion;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SemanticTreeModel.prototype, "geometryChangedIds", {
        /** Node IDs whose bounds changed in the most recent {@link applyDiff}. */
        get: function () {
            return this._geometryChangedIds;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SemanticTreeModel.prototype, "semanticChangedIds", {
        /**
         * Node IDs whose semantic fields (role/label/value/hint/flags/headingLevel)
         * changed in the most recent {@link applyDiff}. Structural changes (moves,
         * child reorders, removals) bump {@link semanticVersion} but don't mark
         * nodes here — element attributes don't depend on tree position.
         */
        get: function () {
            return this._semanticChangedIds;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SemanticTreeModel.prototype, "roots", {
        /** Root node IDs in sibling order. */
        get: function () {
            return this._roots;
        },
        enumerable: false,
        configurable: true
    });
    /** Look up a node by its ID, or undefined if not in the tree. */
    SemanticTreeModel.prototype.nodeById = function (id) {
        return this._nodesById.get(id);
    };
    /** The node with SemanticState.Focused, or undefined. */
    SemanticTreeModel.prototype.focusedNode = function () {
        // Manual iteration: runs every frame and must stop at the first hit (the
        // TS target forbids for-of over Map iterators).
        var it = this._nodesById.values();
        for (var r = it.next(); !r.done; r = it.next()) {
            if ((0,_types__WEBPACK_IMPORTED_MODULE_0__.hasState)(r.value.stateFlags, _types__WEBPACK_IMPORTED_MODULE_0__.SemanticState.Focused))
                return r.value;
        }
        return;
    };
    /** Current index of a node among its siblings (or roots), or -1 if absent. */
    SemanticTreeModel.prototype.siblingIndexOf = function (id) {
        var node = this._nodesById.get(id);
        if (!node)
            return -1;
        if (node.parentId < 0)
            return this._roots.indexOf(id);
        var parent = this._nodesById.get(node.parentId);
        return parent ? parent.children.indexOf(id) : -1;
    };
    /** Detach a node from its current parent (or from roots). */
    SemanticTreeModel.prototype.detach = function (id) {
        var node = this._nodesById.get(id);
        if (!node)
            return;
        if (node.parentId < 0) {
            var idx = this._roots.indexOf(id);
            if (idx !== -1)
                this._roots.splice(idx, 1);
        }
        else {
            var parent_1 = this._nodesById.get(node.parentId);
            if (parent_1) {
                var idx = parent_1.children.indexOf(id);
                if (idx !== -1)
                    parent_1.children.splice(idx, 1);
            }
        }
    };
    /** Attach a node under a parent at a given sibling index (or as root). */
    SemanticTreeModel.prototype.attach = function (id, parentId, siblingIndex) {
        var node = this._nodesById.get(id);
        if (!node)
            return;
        if (parentId < 0) {
            node.parentId = -1;
            var idx = clamp(siblingIndex, 0, this._roots.length);
            this._roots.splice(idx, 0, id);
        }
        else {
            var parent_2 = this._nodesById.get(parentId);
            if (!parent_2) {
                node.parentId = -1;
                this._roots.push(id);
            }
            else {
                node.parentId = parentId;
                var idx = clamp(siblingIndex, 0, parent_2.children.length);
                parent_2.children.splice(idx, 0, id);
            }
        }
    };
    /** Recursively remove a node and all descendants. */
    SemanticTreeModel.prototype.removeSubtree = function (id) {
        var node = this._nodesById.get(id);
        if (!node)
            return;
        // Copy children array — we're mutating during traversal
        var kids = __spreadArray([], node.children, true);
        for (var _i = 0, kids_1 = kids; _i < kids_1.length; _i++) {
            var child = kids_1[_i];
            this.removeSubtree(child);
        }
        this.detach(id);
        this._nodesById.delete(id);
    };
    /**
     * Apply an incremental diff to the tree. Bumps version counters and notifies
     * listeners only when the tree actually changed.
     *
     * No-op diffs (field values identical to current model) do not bump
     * versions — the native side guards against emitting these, but applyDiff
     * defends its subscribers regardless.
     */
    SemanticTreeModel.prototype.applyDiff = function (diff) {
        var _a, _b;
        var _this = this;
        this._geometryChangedIds.clear();
        this._semanticChangedIds.clear();
        var semanticChanged = false;
        var geometryChanged = false;
        var markSemantic = function () {
            semanticChanged = true;
        };
        var markSemanticNode = function (id) {
            semanticChanged = true;
            _this._semanticChangedIds.add(id);
        };
        var markGeometry = function (id) {
            geometryChanged = true;
            _this._geometryChangedIds.add(id);
        };
        // 1. removed
        for (var _i = 0, _c = diff.removed; _i < _c.length; _i++) {
            var id = _c[_i];
            if (this._nodesById.has(id)) {
                this.removeSubtree(id);
                markSemantic();
            }
        }
        // 2. added
        for (var _d = 0, _e = diff.added; _d < _e.length; _d++) {
            var n = _e[_d];
            var existing = this._nodesById.get(n.id);
            if (existing) {
                if (semanticFieldsDiffer(existing, n)) {
                    applySemantic(existing, n);
                    markSemanticNode(n.id);
                }
                if (geometryFieldsDiffer(existing, n)) {
                    applyGeometry(existing, n);
                    markGeometry(n.id);
                }
            }
            else {
                this._nodesById.set(n.id, nodeFromDiff(n));
                markSemanticNode(n.id);
                markGeometry(n.id);
            }
            this.detach(n.id);
            this.attach(n.id, n.parentId, n.siblingIndex);
        }
        // 3. moved
        // The runtime emits a node as "moved" when its parentId OR siblingIndex
        // changes, so a reorder-only move (same parent, new index) is still a
        // structural/semantic change. Compare the actual position before and after
        // re-attaching so that geometry-only or no-op moves don't bump the semantic
        // version (which would defeat the semantic/geometry version split).
        for (var _f = 0, _g = diff.moved; _f < _g.length; _f++) {
            var n = _g[_f];
            var existing = this._nodesById.get(n.id);
            if (!existing)
                continue;
            var parentChanged = existing.parentId !== n.parentId;
            var oldIndex = this.siblingIndexOf(n.id);
            var geomChanged = geometryFieldsDiffer(existing, n);
            if (geomChanged) {
                applyGeometry(existing, n);
                markGeometry(n.id);
            }
            this.detach(n.id);
            this.attach(n.id, n.parentId, n.siblingIndex);
            if (parentChanged || this.siblingIndexOf(n.id) !== oldIndex) {
                markSemantic();
            }
        }
        // 4. childrenUpdated
        for (var _h = 0, _j = diff.childrenUpdated; _h < _j.length; _h++) {
            var update = _j[_h];
            if (update.parentId < 0) {
                var next = update.childIds.filter(function (id) { return _this._nodesById.has(id); });
                if (!arraysEqual(this._roots, next)) {
                    this._roots.length = 0;
                    (_a = this._roots).push.apply(_a, next);
                    for (var _k = 0, _l = this._roots; _k < _l.length; _k++) {
                        var id = _l[_k];
                        var node = this._nodesById.get(id);
                        if (node)
                            node.parentId = -1;
                    }
                    markSemantic();
                }
            }
            else {
                var parent_3 = this._nodesById.get(update.parentId);
                if (!parent_3)
                    continue;
                var next = update.childIds.filter(function (id) { return _this._nodesById.has(id); });
                if (!arraysEqual(parent_3.children, next)) {
                    parent_3.children.length = 0;
                    (_b = parent_3.children).push.apply(_b, next);
                    for (var _m = 0, _o = parent_3.children; _m < _o.length; _m++) {
                        var id = _o[_m];
                        var node = this._nodesById.get(id);
                        if (node)
                            node.parentId = update.parentId;
                    }
                    markSemantic();
                }
            }
        }
        // 5. updatedSemantic — semantic fields updated
        for (var _p = 0, _q = diff.updatedSemantic; _p < _q.length; _p++) {
            var n = _q[_p];
            var existing = this._nodesById.get(n.id);
            if (!existing)
                continue;
            if (!semanticFieldsDiffer(existing, n))
                continue;
            applySemantic(existing, n);
            markSemanticNode(n.id);
        }
        // 6. updatedGeometry — bounds of a semantic node updated
        for (var _r = 0, _s = diff.updatedGeometry; _r < _s.length; _r++) {
            var n = _s[_r];
            var existing = this._nodesById.get(n.id);
            if (!existing)
                continue;
            if (!geometryFieldsDiffer(existing, n))
                continue;
            applyGeometry(existing, n);
            markGeometry(n.id);
        }
        if (!semanticChanged && !geometryChanged)
            return;
        if (semanticChanged)
            this._semanticVersion++;
        if (geometryChanged)
            this._geometryVersion++;
        if (this._debug) {
            this.logDiff(diff, semanticChanged, geometryChanged);
        }
    };
    Object.defineProperty(SemanticTreeModel.prototype, "debug", {
        /** Enable/disable debug logging of diffs to the console. */
        set: function (enabled) {
            this._debug = enabled;
        },
        enumerable: false,
        configurable: true
    });
    SemanticTreeModel.prototype.logDiff = function (diff, semanticChanged, geometryChanged) {
        var lines = [
            "[rive:semantics] semantic v".concat(this._semanticVersion) +
                (geometryChanged ? " geometry v".concat(this._geometryVersion) : "") +
                (semanticChanged ? "" : " (geometry-only)"),
        ];
        for (var _i = 0, _a = diff.removed; _i < _a.length; _i++) {
            var id = _a[_i];
            lines.push("  - removed #".concat(id));
        }
        for (var _b = 0, _c = diff.added; _b < _c.length; _b++) {
            var n = _c[_b];
            lines.push("  + added #".concat(n.id, " ").concat((0,_types__WEBPACK_IMPORTED_MODULE_0__.roleName)(n.role)) +
                (n.label ? " \"".concat(n.label, "\"") : "") +
                " bounds:(".concat(n.minX.toFixed(1), ",").concat(n.minY.toFixed(1), ")-(").concat(n.maxX.toFixed(1), ",").concat(n.maxY.toFixed(1), ")") +
                " states=[".concat((0,_types__WEBPACK_IMPORTED_MODULE_0__.stateNames)(n.stateFlags), "]") +
                " traits=[".concat((0,_types__WEBPACK_IMPORTED_MODULE_0__.traitNames)(n.traitFlags), "]"));
        }
        for (var _d = 0, _e = diff.moved; _d < _e.length; _d++) {
            var n = _e[_d];
            lines.push("  ~ moved #".concat(n.id, " \u2192 parent=").concat(n.parentId, " idx=").concat(n.siblingIndex) +
                " bounds:(".concat(n.minX.toFixed(1), ",").concat(n.minY.toFixed(1), ")-(").concat(n.maxX.toFixed(1), ",").concat(n.maxY.toFixed(1), ")"));
        }
        for (var _f = 0, _g = diff.childrenUpdated; _f < _g.length; _f++) {
            var u = _g[_f];
            lines.push("  \u2195 children of ".concat(u.parentId < 0 ? "root" : "#" + u.parentId, ": [").concat(u.childIds.join(", "), "]"));
        }
        for (var _h = 0, _j = diff.updatedSemantic; _h < _j.length; _h++) {
            var n = _j[_h];
            lines.push("  \u270E semantic #".concat(n.id, " ").concat((0,_types__WEBPACK_IMPORTED_MODULE_0__.roleName)(n.role)) +
                (n.label ? " \"".concat(n.label, "\"") : "") +
                " states=[".concat((0,_types__WEBPACK_IMPORTED_MODULE_0__.stateNames)(n.stateFlags), "]") +
                " traits=[".concat((0,_types__WEBPACK_IMPORTED_MODULE_0__.traitNames)(n.traitFlags), "]"));
        }
        for (var _k = 0, _l = diff.updatedGeometry; _k < _l.length; _k++) {
            var n = _l[_k];
            lines.push("  \u229E geometry #".concat(n.id, " (").concat(n.minX.toFixed(1), ",").concat(n.minY.toFixed(1), ")-(").concat(n.maxX.toFixed(1), ",").concat(n.maxY.toFixed(1), ")"));
        }
        console.log(lines.join("\n"));
    };
    /**
     * Returns every node in depth-first order, paired with its depth level.
     * Useful for debug logging / rendering a flat list.
     */
    SemanticTreeModel.prototype.flattened = function () {
        var _this = this;
        var out = [];
        var walk = function (id, depth) {
            var node = _this._nodesById.get(id);
            if (!node)
                return;
            out.push({ depth: depth, node: node });
            for (var _i = 0, _a = node.children; _i < _a.length; _i++) {
                var child = _a[_i];
                walk(child, depth + 1);
            }
        };
        for (var _i = 0, _a = this._roots; _i < _a.length; _i++) {
            var root = _a[_i];
            walk(root, 0);
        }
        return out;
    };
    return SemanticTreeModel;
}());

function clamp(v, min, max) {
    return v < min ? min : v > max ? max : v;
}
function arraysEqual(a, b) {
    if (a.length !== b.length)
        return false;
    for (var i = 0; i < a.length; i++) {
        if (a[i] !== b[i])
            return false;
    }
    return true;
}
function nodeFromDiff(n) {
    return {
        id: n.id,
        parentId: -1,
        role: n.role,
        label: n.label,
        value: n.value,
        hint: n.hint,
        stateFlags: n.stateFlags,
        traitFlags: n.traitFlags,
        headingLevel: n.headingLevel,
        minX: n.minX,
        minY: n.minY,
        maxX: n.maxX,
        maxY: n.maxY,
        children: [],
    };
}
/** Compare role/label/value/hint/stateFlags/traitFlags/headingLevel. */
function semanticFieldsDiffer(a, b) {
    return (a.role !== b.role ||
        a.label !== b.label ||
        a.value !== b.value ||
        a.hint !== b.hint ||
        a.stateFlags !== b.stateFlags ||
        a.traitFlags !== b.traitFlags ||
        a.headingLevel !== b.headingLevel);
}
/** Compare only bounds (minX/minY/maxX/maxY). */
function geometryFieldsDiffer(a, b) {
    return (a.minX !== b.minX ||
        a.minY !== b.minY ||
        a.maxX !== b.maxX ||
        a.maxY !== b.maxY);
}
function applySemantic(target, src) {
    target.role = src.role;
    target.label = src.label;
    target.value = src.value;
    target.hint = src.hint;
    target.stateFlags = src.stateFlags;
    target.traitFlags = src.traitFlags;
    target.headingLevel = src.headingLevel;
}
function applyGeometry(target, src) {
    target.minX = src.minX;
    target.minY = src.minY;
    target.maxX = src.maxX;
    target.maxY = src.maxY;
}


/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CHECK_STATE_MASK: () => (/* binding */ CHECK_STATE_MASK),
/* harmony export */   CHECK_STATE_OFFSET: () => (/* binding */ CHECK_STATE_OFFSET),
/* harmony export */   SemanticActionType: () => (/* binding */ SemanticActionType),
/* harmony export */   SemanticCheckState: () => (/* binding */ SemanticCheckState),
/* harmony export */   SemanticMode: () => (/* binding */ SemanticMode),
/* harmony export */   SemanticRole: () => (/* binding */ SemanticRole),
/* harmony export */   SemanticState: () => (/* binding */ SemanticState),
/* harmony export */   SemanticTrait: () => (/* binding */ SemanticTrait),
/* harmony export */   checkStateOf: () => (/* binding */ checkStateOf),
/* harmony export */   hasState: () => (/* binding */ hasState),
/* harmony export */   hasTrait: () => (/* binding */ hasTrait),
/* harmony export */   roleName: () => (/* binding */ roleName),
/* harmony export */   stateNames: () => (/* binding */ stateNames),
/* harmony export */   traitNames: () => (/* binding */ traitNames)
/* harmony export */ });
// ---------------------------------------------------------------------------
// SemanticRole — mirrors rive::SemanticRole
// ---------------------------------------------------------------------------
var SemanticRole = {
    none: 0,
    button: 1,
    link: 2,
    checkbox: 3,
    switchControl: 4,
    slider: 5,
    textField: 6,
    text: 7,
    image: 8,
    group: 9,
    list: 10,
    listItem: 11,
    tab: 12,
    tabList: 13,
    dialog: 14,
    alertDialog: 15,
    radioGroup: 16,
    radioButton: 17,
};
// ---------------------------------------------------------------------------
// SemanticState — mirrors rive::SemanticState bitmask
//
// Bits 0-7 are trait-gated (only meaningful when the corresponding
// SemanticTrait is set). Bits 8-13 are non-trait states.
//
// Check state is the exception: it is a two-bit *field* at bits 2-3 rather
// than a flag, because a checkbox is tri-state. It is not a member of this
// table — read it with checkStateOf().
// ---------------------------------------------------------------------------
var SemanticState = {
    None: 0,
    // Trait-gated
    Expanded: 1 << 0, // requires Expandable
    Selected: 1 << 1, // requires Selectable
    // Bits 2-3 are the check state field, not independent flags -- see SemanticCheckState.
    Toggled: 1 << 4, // requires Toggleable
    Required: 1 << 5, // requires Requirable
    Disabled: 1 << 6, // requires Enablable
    Focused: 1 << 7, // requires Focusable
    // Non-trait
    Hidden: 1 << 8,
    LiveRegion: 1 << 9,
    ReadOnly: 1 << 10,
    Modal: 1 << 11,
    Obscured: 1 << 12,
    Multiline: 1 << 13,
};
function hasState(flags, state) {
    return (flags & state) !== 0;
}
// SemanticCheckState — mirrors rive::SemanticCheckState
//
// The tri-state of a checkable node. Occupies two bits of stateFlags at
// CHECK_STATE_OFFSET, so it is read as a value rather than tested as a flag.
// Only meaningful when the Checkable trait is set.
var SemanticCheckState = {
    Unchecked: 0,
    Checked: 1,
    Mixed: 2,
};
/** Bit offset of the check field within stateFlags. */
var CHECK_STATE_OFFSET = 2;
/** Mask of the check field within stateFlags. */
var CHECK_STATE_MASK = 3 << CHECK_STATE_OFFSET;
/**
 * Decodes the check field out of `flags`. The field is two bits. Returns 0, 1, or 2
 * per the mapping in SemanticCheckState.
 */
function checkStateOf(flags) {
    var value = (flags & CHECK_STATE_MASK) >> CHECK_STATE_OFFSET;
    return value >= SemanticCheckState.Mixed
        ? SemanticCheckState.Mixed
        : value;
}
/**
 * Controls when the instance builds semantic trees and accessibility overlays.
 *
 * - `disabled`: no semantics work.
 * - `enabled`: semantics and overlay are active immediately after load.
 */
var SemanticMode = {
    Disabled: "disabled",
    Enabled: "enabled",
};
// ---------------------------------------------------------------------------
// SemanticTrait — mirrors rive::SemanticTrait bitmask
//
// Traits declare what *capabilities* a node has. A state flag is only
// meaningful when its corresponding trait is set.
// ---------------------------------------------------------------------------
var SemanticTrait = {
    None: 0,
    Expandable: 1 << 0,
    Selectable: 1 << 1,
    Checkable: 1 << 2,
    Toggleable: 1 << 3,
    Requirable: 1 << 4,
    Enablable: 1 << 5,
    Focusable: 1 << 6,
};
function hasTrait(flags, trait) {
    return (flags & trait) !== 0;
}
// ---------------------------------------------------------------------------
// SemanticActionType — mirrors rive::SemanticActionType
// ---------------------------------------------------------------------------
var SemanticActionType = {
    tap: 0,
    increase: 1,
    decrease: 2,
};
// ---------------------------------------------------------------------------
// Helpers — readable names for bitmask flags
// ---------------------------------------------------------------------------
var _roleNames = {};
for (var _i = 0, _a = Object.entries(SemanticRole); _i < _a.length; _i++) {
    var _b = _a[_i], name_1 = _b[0], val = _b[1];
    _roleNames[val] = name_1;
}
var _stateEntries = Object.entries(SemanticState).filter(function (_a) {
    var v = _a[1];
    return v !== 0;
});
var _traitEntries = Object.entries(SemanticTrait).filter(function (_a) {
    var v = _a[1];
    return v !== 0;
});
function roleName(role) {
    var _a;
    return (_a = _roleNames[role]) !== null && _a !== void 0 ? _a : "unknown(".concat(role, ")");
}
function stateNames(flags) {
    if (flags === 0)
        return "none";
    var active = [];
    for (var _i = 0, _stateEntries_1 = _stateEntries; _i < _stateEntries_1.length; _i++) {
        var _a = _stateEntries_1[_i], name_2 = _a[0], bit = _a[1];
        if (flags & bit)
            active.push(name_2);
    }
    switch (checkStateOf(flags)) {
        case SemanticCheckState.Checked:
            active.push("Checked");
            break;
        case SemanticCheckState.Mixed:
            active.push("Mixed");
            break;
    }
    return active.join(", ") || "none";
}
function traitNames(flags) {
    if (flags === 0)
        return "none";
    var active = [];
    for (var _i = 0, _traitEntries_1 = _traitEntries; _i < _traitEntries_1.length; _i++) {
        var _a = _traitEntries_1[_i], name_3 = _a[0], bit = _a[1];
        if (flags & bit)
            active.push(name_3);
    }
    return active.join(", ") || "none";
}


/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AccessibilityOverlay: () => (/* binding */ AccessibilityOverlay)
/* harmony export */ });
/* harmony import */ var _claimedKeyEvents__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(10);
/* harmony import */ var _utils_canvasOffset__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(11);
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8);



var warnedUnpositionedWrapper = false;
/**
 * Warns once per page when no positioned element sits at or inside the canvas's
 * nearest scroll container: the overlay then can't scroll with the canvas. Reads only.
 */
function warnIfWrapperUnpositioned(canvas) {
    if (warnedUnpositionedWrapper)
        return;
    // Null when detached (or display:none / fixed); nothing to judge yet.
    var offsetParent = canvas.offsetParent;
    if (!offsetParent)
        return;
    var scrolls = function (v) { return v === "auto" || v === "scroll" || v === "overlay"; };
    var scroller = null;
    var el = canvas.parentElement;
    // Bounds pathological nesting.
    var MAX_ANCESTOR_WALK = 32;
    for (var i = 0; el && el !== document.documentElement && i < MAX_ANCESTOR_WALK; i++, el = el.parentElement) {
        var style = getComputedStyle(el);
        if (scrolls(style.overflowX) || scrolls(style.overflowY)) {
            scroller = el;
            break;
        }
    }
    // Only the viewport scrolls: any offsetParent scrolls with the page.
    if (!scroller || scroller.contains(offsetParent))
        return;
    warnedUnpositionedWrapper = true;
    console.warn('[Rive] Semantics: give the element wrapping the <canvas> "position: relative" (or another positioned value) so the semantic overlay scrolls with the canvas. Without it, screen readers may scroll to stale positions when the canvas is inside a scrolling container.');
}
/**
 * Creates and manages an invisible DOM tree overlaying a Rive canvas. This is for
 * screen readers to discover and interact with the Rive content.
 *
 * Each semantic node in the {@link SemanticTreeModel} gets a corresponding
 * DOM element with appropriate ARIA role, states, and action handlers so
 * assistive technologies (i.e. screen readers) can discover
 * and interact with the Rive content.
 *
 * Each node receives a prefixed ID (`id=rive-{instanceId}-sem-{nodeId}`) to avoid host-page ID collisions.
 * The nodeID is Rive's semantic node ID from core runtime.
 * Each node is styled with `pointer-events: none`. Interactive nodes can receive
 * programmatic focus and keydown events without entering the browser Tab order.
 */
var AccessibilityOverlay = /** @class */ (function () {
    function AccessibilityOverlay(options) {
        var _this = this;
        var _a, _b;
        this.elements = new Map();
        /** Visually-hidden description spans keyed by node ID, referenced by aria-describedby. */
        this.descElements = new Map();
        this.lastSemanticVersion = -1;
        this.lastGeometryVersion = -1;
        /** Text elements whose fit-scale needs recomputing, batched per update (see flushTextGeometry). */
        this.pendingTextGeometry = [];
        /** Last measured box-size|text key per text element, to skip redundant re-measures. */
        this.textGeometryKeys = new WeakMap();
        /** Node data last passed to applyAttributes per element; see {@link setEditingHostNode}. */
        this.appliedNodes = new WeakMap();
        this.lastCanvasPositioning = {
            width: -1, height: -1, offsetTop: -1, offsetLeft: -1,
        };
        /**
         * Set when a ResizeObserver/window-resize signals the canvas geometry may have
         * changed, cleared once the transform is re-synced. Lets {@link needsUpdate}
         * report geometry changes without a per-frame `getBoundingClientRect()` reflow.
         * Starts true so the first update computes the transform.
         */
        this._geometryDirty = true;
        /** True while reconciling the DOM (reserved for future focus-sync guards). */
        this.isUpdating = false;
        /** Node whose element the editing host stands in for, or null. */
        this.editingHostNodeId = null;
        /** Semantic version last folded into the editing host's decoration. */
        this.editingHostSemanticVersion = -1;
        /**
         * Single child div of the overlay container that carries the artboard→CSS
         * transform. All semantic node elements are children of this div and express
         * their positions in raw artboard-space coordinates. The CSS transform on
         * this container maps artboard units to CSS pixels in one GPU pass — no
         * per-node matrix multiplication required.
         */
        this.transformContainer = null;
        this._artboardBounds = { minX: 0, minY: 0, maxX: 0, maxY: 0 };
        this.repositionTimer = null;
        this.canvasResizeObserver = null;
        this.parentResizeObserver = null;
        /**
         * Detects canvas *position* drift. See {@link observePosition}.
         */
        this.positionObserver = null;
        this._onWindowResize = function () { return _this.scheduleReposition(); };
        this.instanceId = options.instanceId;
        this.fireAction = options.fireAction;
        this.requestFocus = options.requestFocus;
        this.clearFocus = options.clearFocus;
        this.canvas = options.canvas;
        this.semanticsOptions = options.semanticsOptions;
        this.allowFocusInterrupt = (_a = options.allowFocusInterrupt) !== null && _a !== void 0 ? _a : false;
        this.isEditingHostFocused = (_b = options.isEditingHostFocused) !== null && _b !== void 0 ? _b : (function () { return false; });
        this.container = this.createContainer(options.canvas);
        this.attachPositionObservers();
        warnIfWrapperUnpositioned(options.canvas);
    }
    /**
     * Hide the stood-in node's element (no duplicate textbox for AT); re-derive the previous
     * one's aria-hidden.
     */
    AccessibilityOverlay.prototype.setEditingHostNode = function (nodeId) {
        if (this.editingHostNodeId === nodeId)
            return;
        var previous = this.editingHostNodeId;
        this.editingHostNodeId = nodeId;
        if (previous !== null) {
            var previousEl = this.elements.get(previous);
            // Re-derive rather than un-hide: the node may have become Hidden mid-session.
            if (previousEl) {
                var previousNode = this.appliedNodes.get(previousEl);
                if (previousNode && this.isAriaHidden(previousNode)) {
                    setAttr(previousEl, "aria-hidden", "true");
                }
                else {
                    removeAttr(previousEl, "aria-hidden");
                }
            }
        }
        if (nodeId !== null) {
            var el = this.elements.get(nodeId);
            if (el)
                setAttr(el, "aria-hidden", "true");
        }
    };
    /**
     * Describe the focused text field on the host and hide its element; no-op unless
     * semantics changed.
     * @param force - apply even if semantics are unchanged (session start).
     */
    AccessibilityOverlay.prototype.syncEditingHost = function (tree, host, force) {
        var _a;
        if (!force && tree.semanticVersion === this.editingHostSemanticVersion)
            return;
        this.editingHostSemanticVersion = tree.semanticVersion;
        var node = tree.focusedNode();
        if (node === undefined || node.role !== _types__WEBPACK_IMPORTED_MODULE_2__.SemanticRole.textField) {
            // Nothing to describe; drop the stale description rather than misname the host.
            if (this.editingHostNodeId !== null) {
                host.resetDecoration();
                this.setEditingHostNode(null);
            }
            return;
        }
        // Every key is passed on every call, nulls included, so nothing survives from
        // the previously described field.
        host.setSecure((0,_types__WEBPACK_IMPORTED_MODULE_2__.hasState)(node.stateFlags, _types__WEBPACK_IMPORTED_MODULE_2__.SemanticState.Obscured));
        host.decorate({
            "aria-label": node.label || null,
            "aria-readonly": (0,_types__WEBPACK_IMPORTED_MODULE_2__.hasState)(node.stateFlags, _types__WEBPACK_IMPORTED_MODULE_2__.SemanticState.ReadOnly) ? "true" : null,
            "aria-multiline": (0,_types__WEBPACK_IMPORTED_MODULE_2__.hasState)(node.stateFlags, _types__WEBPACK_IMPORTED_MODULE_2__.SemanticState.Multiline) ? "true" : null,
            // Trait-gated to match applyAttributes.
            "aria-required": (0,_types__WEBPACK_IMPORTED_MODULE_2__.hasTrait)(node.traitFlags, _types__WEBPACK_IMPORTED_MODULE_2__.SemanticTrait.Requirable) &&
                (0,_types__WEBPACK_IMPORTED_MODULE_2__.hasState)(node.stateFlags, _types__WEBPACK_IMPORTED_MODULE_2__.SemanticState.Required)
                ? "true"
                : null,
            // The hint span applyAttributes maintains (update() runs earlier in the frame).
            "aria-describedby": (node.hint && ((_a = this.descElements.get(node.id)) === null || _a === void 0 ? void 0 : _a.id)) || null,
        });
        this.setEditingHostNode(node.id);
    };
    /** True while the editing host stands in for a node's element. */
    AccessibilityOverlay.prototype.hasEditingHost = function () {
        return this.editingHostNodeId !== null;
    };
    /**
     * Undo the stand-in; if the host still has DOM focus, move it to the focused node's
     * element so AT announces it.
     */
    AccessibilityOverlay.prototype.releaseEditingHost = function (tree, host) {
        var _a;
        host === null || host === void 0 ? void 0 : host.resetDecoration();
        this.setEditingHostNode(null);
        this.editingHostSemanticVersion = -1;
        if (!(host === null || host === void 0 ? void 0 : host.hasDomFocus()))
            return;
        var focusedNodeId = (_a = tree === null || tree === void 0 ? void 0 : tree.focusedNode()) === null || _a === void 0 ? void 0 : _a.id;
        if (focusedNodeId !== undefined)
            this.focusNodeElement(focusedNodeId);
    };
    /** Move DOM focus onto a node's element. No-op for a node with no element. */
    AccessibilityOverlay.prototype.focusNodeElement = function (nodeId) {
        var el = this.elements.get(nodeId);
        if (!el)
            return;
        this.focusElementInPlace(el);
    };
    // The overlay is positioned outside the canvas's scroll chain, so a plain focus()
    // would scroll the root instead; scroll the canvas into view through its real ancestors.
    AccessibilityOverlay.prototype.focusElementInPlace = function (el) {
        var _a, _b;
        this.syncContainerBeforeFocus();
        el.focus({ preventScroll: true });
        (_b = (_a = this.canvas).scrollIntoView) === null || _b === void 0 ? void 0 : _b.call(_a, {
            block: "nearest",
            inline: "nearest",
            behavior: "instant",
        });
        // The scroll moved the canvas; re-align now rather than after the observer throttle.
        this.syncContainerGeometry();
        this.observePosition();
    };
    AccessibilityOverlay.prototype.getSemanticOverlayContainer = function () {
        return this.container;
    };
    // ---- Container lifecycle ----
    // Keep the a11y tree overlay matched to the canvas's position and size:
    // 1. The canvas resized           — ResizeObserver
    // 2. The canvas's parent resized   — ResizeObserver
    // 3. The window resized            — resize event
    // 4. The canvas moved/drifted      — IntersectionObserver (see observePosition)
    AccessibilityOverlay.prototype.attachPositionObservers = function () {
        var _this = this;
        this.canvasResizeObserver = new ResizeObserver(function () { return _this.scheduleReposition(); });
        this.canvasResizeObserver.observe(this.canvas);
        var parent = this.canvas.parentElement;
        if (parent) {
            this.parentResizeObserver = new ResizeObserver(function () { return _this.scheduleReposition(); });
            this.parentResizeObserver.observe(parent);
        }
        window.addEventListener("resize", this._onWindowResize);
        this.observePosition();
    };
    /**
     * Arms an IntersectionObserver whose root box is bounded to the canvas, so it
     * fires when the canvas moves relative to the viewport — position drift that
     * no ResizeObserver reports. Lets us re-sync the overlay container on a move
     * instead of recalculating the canvas bounding box every frame.
     */
    AccessibilityOverlay.prototype.observePosition = function () {
        var _this = this;
        var _a;
        if (typeof IntersectionObserver === "undefined")
            return;
        (_a = this.positionObserver) === null || _a === void 0 ? void 0 : _a.disconnect();
        this.positionObserver = null;
        var rect = this.canvas.getBoundingClientRect();
        // Can't frame a zero-area element; it will re-arm on the next reposition.
        if (!rect.width || !rect.height)
            return;
        // Shrink the viewport root box down to exactly the canvas: a negative inset
        // from each viewport edge to the matching canvas edge, in CSS shorthand
        // order (top, right, bottom, left). Rounded so sub-pixel jitter doesn't trip
        // the 1.0 threshold.
        var insetToPx = function (v) { return "".concat(-Math.round(v), "px"); };
        var rootMargin = [
            rect.top, // top:    viewport top → canvas top
            window.innerWidth - rect.right, // right:  viewport right → canvas right
            window.innerHeight - rect.bottom, // bottom: viewport bottom → canvas bottom
            rect.left, // left:   viewport left → canvas left
        ]
            .map(insetToPx)
            .join(" ");
        // The observer emits an initial notification for the current (contained)
        // state; ignore that and only react to a subsequent move.
        var armed = false;
        this.positionObserver = new IntersectionObserver(function () {
            if (!armed) {
                armed = true;
                return;
            }
            _this.scheduleReposition();
        }, { threshold: 1.0, rootMargin: rootMargin });
        this.positionObserver.observe(this.canvas);
    };
    AccessibilityOverlay.prototype.scheduleReposition = function () {
        var _this = this;
        // A resize/move may have changed canvas size/scale/position; force a
        // transform recompute on the next frame's update.
        this._geometryDirty = true;
        if (this.repositionTimer !== null)
            return;
        this.repositionTimer = setTimeout(function () {
            _this.repositionTimer = null;
            _this.syncContainerGeometry();
            // Re-arm the position observer at the canvas's new location.
            _this.observePosition();
        }, 500); // Throttle to avoid rapid style recalculations
    };
    /** Returns true when the container's size changed (node transforms need recomputing). */
    AccessibilityOverlay.prototype.syncContainerGeometry = function () {
        var rect = this.canvas.getBoundingClientRect();
        var _a = (0,_utils_canvasOffset__WEBPACK_IMPORTED_MODULE_1__.canvasOffset)(this.canvas), top = _a.top, left = _a.left;
        var sizeChanged = rect.width !== this.lastCanvasPositioning.width ||
            rect.height !== this.lastCanvasPositioning.height;
        if (!sizeChanged &&
            top === this.lastCanvasPositioning.offsetTop &&
            left === this.lastCanvasPositioning.offsetLeft)
            return false;
        this.container.style.top = top + "px";
        this.container.style.left = left + "px";
        this.container.style.width = rect.width + "px";
        this.container.style.height = rect.height + "px";
        this.container.tabIndex = -1;
        this.lastCanvasPositioning.width = rect.width;
        this.lastCanvasPositioning.height = rect.height;
        this.lastCanvasPositioning.offsetTop = top;
        this.lastCanvasPositioning.offsetLeft = left;
        return sizeChanged;
    };
    /**
     * Re-align the container right before focusing one of its elements. The position
     * observer re-syncs after scrolling on a throttle; focusing an element while the
     * container is stale would make the browser scroll the page to where it sits.
     */
    AccessibilityOverlay.prototype.syncContainerBeforeFocus = function () {
        if (this.syncContainerGeometry())
            this._geometryDirty = true;
    };
    AccessibilityOverlay.prototype.createContainer = function (canvas) {
        var _a, _b;
        var container = document.createElement("div");
        container.id = "rive-a11y-".concat(this.instanceId);
        container.setAttribute("role", "region");
        container.setAttribute("aria-label", (_b = (_a = this.semanticsOptions) === null || _a === void 0 ? void 0 : _a.riveCanvasLabel) !== null && _b !== void 0 ? _b : "Rive animation");
        // Size to the canvas's CSS layout box, not the parent container.
        var rect = canvas.getBoundingClientRect();
        var _c = (0,_utils_canvasOffset__WEBPACK_IMPORTED_MODULE_1__.canvasOffset)(this.canvas), top = _c.top, left = _c.left;
        container.style.cssText = [
            "position:absolute",
            "top:".concat(top, "px"),
            "left:".concat(left, "px"),
            "line-height:normal",
            "font-size:16px",
            "width:".concat(rect.width, "px"),
            "height:".concat(rect.height, "px"),
            "overflow:hidden",
            "pointer-events:none",
            // Visually hidden but still in the accessibility tree.
            // `display:none` and `visibility:hidden` would hide from AT.
            "opacity:0",
        ].join(";");
        canvas.insertAdjacentElement("afterend", container);
        return container;
    };
    /**
     * Returns what changed since the last update, or null if nothing changed.
     *
     * Callers use this to avoid recomputing the (relatively expensive)
     * artboard→canvas transform on frames where only node bounds changed in the
     * tree: the transform only needs recomputing when `layoutChanged` is true.
     */
    AccessibilityOverlay.prototype.needsUpdate = function (tree) {
        var semanticChanged = tree.semanticVersion !== this.lastSemanticVersion;
        var nodeGeometryChanged = tree.geometryVersion !== this.lastGeometryVersion;
        var layoutChanged = this._geometryDirty || !this.transformContainer;
        if (!semanticChanged && !nodeGeometryChanged && !layoutChanged)
            return null;
        return { semanticChanged: semanticChanged, nodeGeometryChanged: nodeGeometryChanged, layoutChanged: layoutChanged };
    };
    /**
     * Update the overlay DOM to reflect the current state of the semantic tree.
     * Call once per frame after `applyDiff` when {@link needsUpdate} reports a
     * change, when layout/transform inputs are dirty, or when a fresh
     * `forwardMat` is supplied (even if the tree versions are unchanged).
     *
     * @param tree           The in-memory semantic tree model
     * @param forwardMat     Artboard→canvas-pixel transform from `computeAlignment`,
     *                       or null to reuse the existing CSS transform on the
     *                       transform container
     * @param dpr            Device pixel ratio used for the canvas backing store
     * @param artboardBounds The artboard's own bounding rectangle
     */
    AccessibilityOverlay.prototype.update = function (tree, forwardMat, dpr, artboardBounds, change) {
        var overlayChange = change !== null && change !== void 0 ? change : this.needsUpdate(tree);
        if (!overlayChange && forwardMat) {
            overlayChange = {
                semanticChanged: false,
                nodeGeometryChanged: false,
                layoutChanged: true,
            };
        }
        if (!overlayChange)
            return;
        this.performUpdate(tree, forwardMat, dpr, artboardBounds, overlayChange);
    };
    AccessibilityOverlay.prototype.performUpdate = function (tree, forwardMat, dpr, artboardBounds, change) {
        var _a;
        var semanticChanged = change.semanticChanged, nodeGeometryChanged = change.nodeGeometryChanged;
        // Per-node change sets only describe the most recent applyDiff. If more
        // than one semantic version elapsed since our last update (first build,
        // or a diff we never consumed), fall back to re-applying attributes on
        // every node rather than trusting an incomplete set.
        var reapplyAllAttributes = tree.semanticVersion - this.lastSemanticVersion > 1;
        this.lastSemanticVersion = tree.semanticVersion;
        this.lastGeometryVersion = tree.geometryVersion;
        this.isUpdating = true;
        this._artboardBounds = artboardBounds;
        // Container box + artboard transform only run when a fresh forwardMat was
        // supplied (layout/transform dirty). Node-only bounds updates reuse the
        // existing CSS transform and go through updateGeometryForChangedNodes.
        // Skipping syncContainerGeometry here on semantic-only frames avoids a
        // getBoundingClientRect() reflow on every animation frame. The throttled
        // scheduleReposition() path still keeps the container aligned when the page
        // layout shifts.
        if (forwardMat) {
            this.syncContainerGeometry();
            this.syncTransformContainer(forwardMat, dpr, artboardBounds);
            // Transform is now in sync with the latest layout.
            this._geometryDirty = false;
        }
        if (semanticChanged) {
            var rootEl = (_a = this.transformContainer) !== null && _a !== void 0 ? _a : this.container;
            var activeIds_1 = new Set();
            this.rebuildChildren(rootEl, tree.roots, tree, 0, // parentLeft in artboard space (transform container origin)
            0, // parentTop  in artboard space
            activeIds_1, reapplyAllAttributes);
            var staleIds_2 = [];
            this.elements.forEach(function (_el, id) {
                if (!activeIds_1.has(id))
                    staleIds_2.push(id);
            });
            for (var _i = 0, staleIds_1 = staleIds_2; _i < staleIds_1.length; _i++) {
                var id = staleIds_1[_i];
                var el = this.elements.get(id);
                if (el && el.parentNode)
                    el.parentNode.removeChild(el);
                this.elements.delete(id);
                var desc = this.descElements.get(id);
                if (desc && desc.parentNode)
                    desc.parentNode.removeChild(desc);
                this.descElements.delete(id);
            }
        }
        else if (nodeGeometryChanged) {
            this.updateGeometryForChangedNodes(tree);
        }
        // Text scaling needs layout reads; batch them into one pass after all
        // position/attribute writes so each frame forces at most one reflow.
        this.flushTextGeometry();
        this.isUpdating = false;
    };
    /** Remove the overlay from the DOM entirely. */
    AccessibilityOverlay.prototype.destroy = function () {
        var _a, _b, _c;
        if (this.repositionTimer !== null) {
            clearTimeout(this.repositionTimer);
            this.repositionTimer = null;
        }
        window.removeEventListener("resize", this._onWindowResize);
        (_a = this.canvasResizeObserver) === null || _a === void 0 ? void 0 : _a.disconnect();
        (_b = this.parentResizeObserver) === null || _b === void 0 ? void 0 : _b.disconnect();
        (_c = this.positionObserver) === null || _c === void 0 ? void 0 : _c.disconnect();
        if (this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
        this.elements.clear();
        this.descElements.clear();
        this.pendingTextGeometry.length = 0;
    };
    // ---- Tree → DOM reconciliation ----
    /**
     * Reconcile a parent DOM element's children with an ordered list of
     * semantic node IDs. Creates, updates, and reorders elements as needed.
     *
     * Node positions are expressed in artboard-space coordinates. The CSS
     * transform on the transform container maps artboard units to CSS pixels,
     * so no per-node matrix multiplication is required here.
     *
     * @param parentArtboardLeft  Absolute artboard minX of the parent node (0 for roots)
     * @param parentArtboardTop   Absolute artboard minY of the parent node (0 for roots)
     */
    AccessibilityOverlay.prototype.rebuildChildren = function (parentEl, childIds, tree, parentArtboardLeft, parentArtboardTop, activeIds, applyAllAttributes) {
        for (var i = 0; i < childIds.length; i++) {
            var nodeId = childIds[i];
            var nodeData = tree.nodeById(nodeId);
            if (!nodeData)
                continue;
            activeIds.add(nodeId);
            var el = this.elements.get(nodeId);
            var isNew = !el;
            if (!el) {
                el = this.createElement(nodeData);
                this.elements.set(nodeId, el);
            }
            // Attributes are only applied to new elements and nodes whose semantic
            // fields changed in the latest diff. Skipping redundant setAttribute
            // calls eliminates WebKit AX notifications that knock VoiceOver off its
            // current element.
            if (isNew || applyAllAttributes || tree.semanticChangedIds.has(nodeId)) {
                this.applyAttributes(el, nodeData);
            }
            this.applyPosition(el, nodeData, parentArtboardLeft, parentArtboardTop);
            // Only touch the DOM tree if the element isn't already in the correct
            // position. Moving a focused element can blur it and knock AT off the
            // current node.
            var currentChild = parentEl.children[i];
            if (currentChild !== el) {
                if (currentChild) {
                    parentEl.insertBefore(el, currentChild);
                }
                else {
                    parentEl.appendChild(el);
                }
            }
            // Reflect the runtime Focused state into DOM focus. Runs after insertion
            // so the element is attached, and skips elements that already hold focus.
            // The cheap trait/state flag checks gate the (per-node) DOM queries below,
            // so the activeElement/closest/contains walks only run for a node that is
            // actually focusable + focused — not for every node on every frame.
            if ((0,_types__WEBPACK_IMPORTED_MODULE_2__.hasTrait)(nodeData.traitFlags, _types__WEBPACK_IMPORTED_MODULE_2__.SemanticTrait.Focusable) &&
                (0,_types__WEBPACK_IMPORTED_MODULE_2__.hasState)(nodeData.stateFlags, _types__WEBPACK_IMPORTED_MODULE_2__.SemanticState.Focused)) {
                var active = document.activeElement;
                // While focus is inside one of our modal dialogs, don't pull it back
                // out to a background node.
                var focusedModal = active === null || active === void 0 ? void 0 : active.closest('[aria-modal="true"]');
                var trappedByModal = !!focusedModal &&
                    this.container.contains(focusedModal) &&
                    !focusedModal.contains(el);
                // Not while the proxy has focus (would steal the caret, drop the keyboard) nor onto
                // its aria-hidden stand-in.
                if (nodeId !== this.editingHostNodeId &&
                    active !== el &&
                    !trappedByModal &&
                    !this.isEditingHostFocused() &&
                    this.canMoveFocus()) {
                    // No scrollIntoView: this runs on semantic diffs and must not drag the page.
                    this.syncContainerBeforeFocus();
                    el.focus({ preventScroll: true });
                }
            }
            // Recurse into children with this node's absolute artboard position.
            if (nodeData.children.length > 0) {
                this.rebuildChildren(el, nodeData.children, tree, nodeData.minX, nodeData.minY, activeIds, applyAllAttributes);
            }
            // Focus a modal/alert dialog when it first appears (after children are
            // built so the focus target can be resolved from the subtree).
            if (isNew)
                this.autoFocusDialogOnAppear(el, nodeData, tree);
        }
    };
    /**
     * Reposition only the subtrees whose bounds changed in the latest diff.
     * Descendants are included because node CSS positions are parent-relative.
     */
    AccessibilityOverlay.prototype.updateGeometryForChangedNodes = function (tree) {
        var _a, _b;
        for (var _i = 0, _c = Array.from(tree.geometryChangedIds); _i < _c.length; _i++) {
            var nodeId = _c[_i];
            var nodeData = tree.nodeById(nodeId);
            if (!nodeData)
                continue;
            var parentLeft = 0;
            var parentTop = 0;
            var parentEl = (_a = this.transformContainer) !== null && _a !== void 0 ? _a : this.container;
            if (nodeData.parentId >= 0) {
                var parent_1 = tree.nodeById(nodeData.parentId);
                if (parent_1) {
                    parentLeft = parent_1.minX;
                    parentTop = parent_1.minY;
                    parentEl = (_b = this.elements.get(nodeData.parentId)) !== null && _b !== void 0 ? _b : parentEl;
                }
            }
            this.updateNodeGeometrySubtree(tree, nodeId, parentLeft, parentTop, parentEl);
        }
    };
    AccessibilityOverlay.prototype.updateNodeGeometrySubtree = function (tree, nodeId, parentArtboardLeft, parentArtboardTop, _parentEl) {
        var nodeData = tree.nodeById(nodeId);
        if (!nodeData)
            return;
        var el = this.elements.get(nodeId);
        if (!el)
            return;
        this.applyPosition(el, nodeData, parentArtboardLeft, parentArtboardTop);
        for (var _i = 0, _a = nodeData.children; _i < _a.length; _i++) {
            var childId = _a[_i];
            this.updateNodeGeometrySubtree(tree, childId, nodeData.minX, nodeData.minY, el);
        }
    };
    /**
     * Whether the overlay may move focus now. Following focus already inside this
     * instance is always allowed; pulling it in from the host page is gated behind
     * allowFocusInterrupt (from the Rive class).
     */
    AccessibilityOverlay.prototype.canMoveFocus = function () {
        var active = document.activeElement;
        var focusAlreadyInScope = active === this.canvas || this.container.contains(active);
        return focusAlreadyInScope || this.allowFocusInterrupt;
    };
    /**
     * Move focus into a newly appeared modal/alert dialog so screen readers
     * announce and read its content (web ATs don't auto-enter a freshly mounted
     * dialog). Skips when focus can't move (see canMoveFocus) or a descendant
     * already holds it. The dialog's aria-modal keeps focus trapped inside.
     */
    AccessibilityOverlay.prototype.autoFocusDialogOnAppear = function (el, node, tree) {
        var _a;
        if (!isModalDialogRole(node.role, node.stateFlags))
            return;
        if (!this.canMoveFocus())
            return;
        // A descendant already holds focus — don't override it.
        var active = document.activeElement;
        if (active && active !== el && el.contains(active))
            return;
        var target = (_a = this.routeDefaultFocusTarget(node, tree)) !== null && _a !== void 0 ? _a : el;
        if (!target.hasAttribute("tabindex"))
            target.setAttribute("tabindex", "-1");
        if (document.activeElement !== target)
            target.focus({ preventScroll: true });
    };
    /**
     * Resolve the element assistive technologies (AT) should focus on appearance. Walks the subtree
     * depth-first and returns the first focusable node's host element, else the
     * inner <span> of the first labeled leaf. Container and unlabeled nodes are
     * descended into but never focused. Returns null if nothing qualifies.
     */
    AccessibilityOverlay.prototype.routeDefaultFocusTarget = function (node, tree) {
        var _a;
        for (var _i = 0, _b = node.children; _i < _b.length; _i++) {
            var childId = _b[_i];
            var child = tree.nodeById(childId);
            if (!child)
                continue;
            var childEl = this.elements.get(childId);
            // Focusable node → its host element (even if it has children).
            if (childEl && isFocusableNode(child))
                return childEl;
            // Container or unlabeled node → descend without focusing it.
            if (child.children.length > 0 || !child.label) {
                var nested = this.routeDefaultFocusTarget(child, tree);
                if (nested)
                    return nested;
                continue;
            }
            // Labeled leaf → its inner label span.
            if (childEl) {
                return (_a = childEl.querySelector(":scope > span")) !== null && _a !== void 0 ? _a : childEl;
            }
        }
        return null;
    };
    Object.defineProperty(AccessibilityOverlay.prototype, "nodeIdPrefix", {
        // ---- Element creation ----
        /** Shared `id` prefix for all semantic node elements of this instance. */
        get: function () {
            return "rive-".concat(this.instanceId, "-sem-");
        },
        enumerable: false,
        configurable: true
    });
    /** Recover the semantic node ID from an overlay element, or null. */
    AccessibilityOverlay.prototype.nodeIdFromElement = function (el) {
        if (!el.id.startsWith(this.nodeIdPrefix))
            return null;
        var raw = el.id.slice(this.nodeIdPrefix.length);
        // Guard the empty string explicitly: Number("") is 0, not NaN.
        if (!raw)
            return null;
        var id = Number(raw);
        return Number.isNaN(id) ? null : id;
    };
    AccessibilityOverlay.prototype.createElement = function (node) {
        var tag = tagForRole(node.role);
        var el = document.createElement(tag);
        el.id = "".concat(this.nodeIdPrefix).concat(node.id);
        el.style.cssText = BASE_NODE_STYLE;
        if (node.role === _types__WEBPACK_IMPORTED_MODULE_2__.SemanticRole.text) {
            // The positioned outer div is the AX element
            // VoiceOver uses for its highlight box; an inner <span> carries the text
            // without position:absolute (which would strip the span from VoiceOver's
            // bounds calculation).
            var textSpan = document.createElement("span");
            textSpan.style.cssText = SPAN_EXP;
            el.appendChild(textSpan);
        }
        this.attachActionHandlers(el, node);
        return el;
    };
    // ---- Action handlers ----
    /**
     * Wire arrow-key roving focus for a group member (tab, radio). Arrow keys
     * move focus to the next/previous member (wrapping), optionally Home/End jump
     * to first/last, and the newly focused member receives a tap action.
     */
    AccessibilityOverlay.prototype.attachRovingNav = function (el, opts) {
        var _this = this;
        el.addEventListener("keydown", function (e) {
            var target = null;
            if (e.key === "ArrowRight" || e.key === "ArrowDown")
                target = "next";
            else if (e.key === "ArrowLeft" || e.key === "ArrowUp")
                target = "prev";
            else if (opts.includeHomeEnd && e.key === "Home")
                target = "first";
            else if (opts.includeHomeEnd && e.key === "End")
                target = "last";
            if (!target)
                return;
            (0,_claimedKeyEvents__WEBPACK_IMPORTED_MODULE_0__.claimKeyEvent)(e);
            var members = opts.members();
            var idx = members.indexOf(el);
            if (idx < 0)
                return;
            var n = members.length;
            var next = target === "next" ? members[(idx + 1) % n]
                : target === "prev" ? members[(idx - 1 + n) % n]
                    : target === "first" ? members[0]
                        : members[n - 1];
            if (next && next !== el) {
                _this.focusElementInPlace(next);
                var nextId = _this.nodeIdFromElement(next);
                if (nextId !== null)
                    _this.fireAction(nextId, _types__WEBPACK_IMPORTED_MODULE_2__.SemanticActionType.tap);
            }
        });
    };
    AccessibilityOverlay.prototype.attachActionHandlers = function (el, node) {
        var _this = this;
        var role = node.role;
        var nodeId = node.id;
        if (isClickableRole(role)) {
            el.addEventListener("click", function () {
                _this.fireAction(nodeId, _types__WEBPACK_IMPORTED_MODULE_2__.SemanticActionType.tap);
            });
            // Links activate on Enter only (Space scrolls the page per browser
            // convention). All other clickable roles accept both Enter and Space.
            var activationKeys_1 = role === _types__WEBPACK_IMPORTED_MODULE_2__.SemanticRole.link ? ["Enter"] : ["Enter", " "];
            el.addEventListener("keydown", function (e) {
                if (activationKeys_1.includes(e.key)) {
                    (0,_claimedKeyEvents__WEBPACK_IMPORTED_MODULE_0__.claimKeyEvent)(e);
                    _this.fireAction(nodeId, _types__WEBPACK_IMPORTED_MODULE_2__.SemanticActionType.tap);
                }
            });
        }
        if (role === _types__WEBPACK_IMPORTED_MODULE_2__.SemanticRole.slider) {
            el.addEventListener("keydown", function (e) {
                if (e.key === "ArrowRight" || e.key === "ArrowUp") {
                    (0,_claimedKeyEvents__WEBPACK_IMPORTED_MODULE_0__.claimKeyEvent)(e);
                    _this.fireAction(nodeId, _types__WEBPACK_IMPORTED_MODULE_2__.SemanticActionType.increase);
                }
                else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
                    (0,_claimedKeyEvents__WEBPACK_IMPORTED_MODULE_0__.claimKeyEvent)(e);
                    _this.fireAction(nodeId, _types__WEBPACK_IMPORTED_MODULE_2__.SemanticActionType.decrease);
                }
            });
        }
        if (role === _types__WEBPACK_IMPORTED_MODULE_2__.SemanticRole.tab) {
            this.attachRovingNav(el, {
                includeHomeEnd: true,
                members: function () {
                    var parent = el.parentElement;
                    if (!parent)
                        return [];
                    return Array.from(parent.children).filter(function (c) {
                        return c instanceof HTMLElement && c.getAttribute("role") === "tab";
                    });
                },
            });
        }
        if (role === _types__WEBPACK_IMPORTED_MODULE_2__.SemanticRole.radioButton) {
            this.attachRovingNav(el, {
                includeHomeEnd: false,
                members: function () {
                    var _a;
                    var group = (_a = el.closest('[role="radiogroup"]')) !== null && _a !== void 0 ? _a : el.parentElement;
                    if (!group)
                        return [];
                    return Array.from(group.querySelectorAll('[role="radio"]'));
                },
            });
        }
        // Focus handler for nodes with the Focusable trait. When AT focuses an
        // element, notify the C++ runtime so it can update internal focus state
        // (visual focus rings, etc.). Gated on Focusable trait
        if ((0,_types__WEBPACK_IMPORTED_MODULE_2__.hasTrait)(node.traitFlags, _types__WEBPACK_IMPORTED_MODULE_2__.SemanticTrait.Focusable)) {
            el.addEventListener("focus", function () {
                _this.requestFocus(nodeId);
            });
        }
    };
    // ---- Attribute application ----
    AccessibilityOverlay.prototype.isAriaHidden = function (node) {
        var role = node.role;
        var flags = node.stateFlags;
        // Hide from AT when explicitly hidden, or when an image has no accessible
        // name — a nameless role="img" is a WCAG 1.1.1 violation; treat it as
        // decorative instead.
        var isDecorativeImage = role === _types__WEBPACK_IMPORTED_MODULE_2__.SemanticRole.image && !node.label;
        // The <input> proxy is the accessible element for the node it stands in for.
        var isEditingHostStandIn = node.id === this.editingHostNodeId;
        return ((0,_types__WEBPACK_IMPORTED_MODULE_2__.hasState)(flags, _types__WEBPACK_IMPORTED_MODULE_2__.SemanticState.Hidden) ||
            // Obscured text fields stay reachable (value withheld, like a native password input).
            ((0,_types__WEBPACK_IMPORTED_MODULE_2__.hasState)(flags, _types__WEBPACK_IMPORTED_MODULE_2__.SemanticState.Obscured) && role !== _types__WEBPACK_IMPORTED_MODULE_2__.SemanticRole.textField) ||
            isDecorativeImage ||
            isEditingHostStandIn);
    };
    AccessibilityOverlay.prototype.applyAttributes = function (el, node) {
        var _a, _b, _c;
        this.appliedNodes.set(el, node);
        var role = node.role;
        var flags = node.stateFlags;
        var traits = node.traitFlags;
        // Role
        var ariaRole = ariaRoleForSemantic(role);
        if (ariaRole) {
            setAttr(el, "role", ariaRole);
        }
        else {
            removeAttr(el, "role");
        }
        // Links: a bare <a> with no href has no link semantics, so set the role
        // explicitly (ariaRoleForSemantic returns null for link → native <a>).
        if (role === _types__WEBPACK_IMPORTED_MODULE_2__.SemanticRole.link) {
            setAttr(el, "role", "link");
        }
        // Tabindex — keep the screen-reader overlay out of the browser's sequential
        // Tab order. Interactive/focusable nodes remain programmatically focusable
        // so AT/runtime focus sync can still target them when needed. List items are
        // included because Mobile Safari won't iterate them otherwise.
        if (isInteractiveRole(role) ||
            (0,_types__WEBPACK_IMPORTED_MODULE_2__.hasTrait)(traits, _types__WEBPACK_IMPORTED_MODULE_2__.SemanticTrait.Focusable) ||
            role === _types__WEBPACK_IMPORTED_MODULE_2__.SemanticRole.listItem) {
            setAttr(el, "tabindex", "-1");
        }
        else {
            removeAttr(el, "tabindex");
        }
        // Label / value / hint
        if (node.label) {
            setAttr(el, "aria-label", node.label);
        }
        else {
            removeAttr(el, "aria-label");
        }
        if (role === _types__WEBPACK_IMPORTED_MODULE_2__.SemanticRole.slider) {
            if (node.value) {
                // aria-valuenow must be numeric; keep the display string (e.g. "75%")
                // in aria-valuetext only.
                var numericValue = parseFloat(node.value);
                if (Number.isFinite(numericValue)) {
                    setAttr(el, "aria-valuenow", String(numericValue));
                }
                else {
                    removeAttr(el, "aria-valuenow");
                }
                setAttr(el, "aria-valuetext", node.value);
            }
            else {
                removeAttr(el, "aria-valuenow");
                removeAttr(el, "aria-valuetext");
            }
            // TODO: aria-valuemin / aria-valuemax are required by ARIA.
            // Defaulting to horizontal; vertical sliders need orientation data from C++.
            setAttr(el, "aria-orientation", "horizontal");
            setBoolAttr(el, "aria-readonly", (0,_types__WEBPACK_IMPORTED_MODULE_2__.hasState)(flags, _types__WEBPACK_IMPORTED_MODULE_2__.SemanticState.ReadOnly));
        }
        else {
            removeAttr(el, "aria-valuenow");
            removeAttr(el, "aria-valuetext");
            removeAttr(el, "aria-orientation");
            removeAttr(el, "aria-readonly");
        }
        if (node.hint) {
            var descId = "rive-".concat(this.instanceId, "-desc-").concat(node.id);
            var descEl = this.descElements.get(node.id);
            if (!descEl) {
                descEl = document.createElement("span");
                descEl.id = descId;
                descEl.style.cssText = DESC_SPAN_STYLE;
                this.container.appendChild(descEl);
                this.descElements.set(node.id, descEl);
            }
            if (descEl.textContent !== node.hint)
                descEl.textContent = node.hint;
            setAttr(el, "aria-describedby", descId);
        }
        else {
            removeAttr(el, "aria-describedby");
            var staleDesc = this.descElements.get(node.id);
            if (staleDesc) {
                if (staleDesc.parentNode)
                    staleDesc.parentNode.removeChild(staleDesc);
                this.descElements.delete(node.id);
            }
        }
        // Text nodes: use textContent rather than aria-label so screen readers
        // announce the text in virtual/browse mode (aria-label on a bare <span>
        // with no widget role is ignored by some AT in document browse mode).
        if (role === _types__WEBPACK_IMPORTED_MODULE_2__.SemanticRole.text) {
            var textSpan = (_a = el.querySelector(":scope > span")) !== null && _a !== void 0 ? _a : el;
            var text = (_b = node.label) !== null && _b !== void 0 ? _b : "";
            if (textSpan.textContent !== text)
                textSpan.textContent = text;
            removeAttr(el, "aria-label");
            if (node.headingLevel > 0) {
                setAttr(el, "role", "heading");
                setAttr(el, "aria-level", String(node.headingLevel));
            }
            else {
                // The generic role branch above already cleared role="heading";
                // aria-level must go with it when a heading reverts to plain text.
                removeAttr(el, "aria-level");
            }
        }
        // ---- Trait-gated states ----
        // Only set the ARIA property when the trait is present. When the trait
        // is absent, remove the attribute so AT sees "not applicable" rather
        // than "false".
        if ((0,_types__WEBPACK_IMPORTED_MODULE_2__.hasTrait)(traits, _types__WEBPACK_IMPORTED_MODULE_2__.SemanticTrait.Expandable) && ARIA_EXPANDED_ROLES.has(role)) {
            setBoolAttr(el, "aria-expanded", (0,_types__WEBPACK_IMPORTED_MODULE_2__.hasState)(flags, _types__WEBPACK_IMPORTED_MODULE_2__.SemanticState.Expanded));
        }
        else {
            removeAttr(el, "aria-expanded");
        }
        // aria-selected is required on ALL tabs per ARIA spec regardless of trait;
        // for other roles it is trait-gated and guarded to ARIA_SELECTED_ROLES.
        if (role === _types__WEBPACK_IMPORTED_MODULE_2__.SemanticRole.tab) {
            setBoolAttr(el, "aria-selected", (0,_types__WEBPACK_IMPORTED_MODULE_2__.hasState)(flags, _types__WEBPACK_IMPORTED_MODULE_2__.SemanticState.Selected));
        }
        else if ((0,_types__WEBPACK_IMPORTED_MODULE_2__.hasTrait)(traits, _types__WEBPACK_IMPORTED_MODULE_2__.SemanticTrait.Selectable) && ARIA_SELECTED_ROLES.has(role)) {
            setBoolAttr(el, "aria-selected", (0,_types__WEBPACK_IMPORTED_MODULE_2__.hasState)(flags, _types__WEBPACK_IMPORTED_MODULE_2__.SemanticState.Selected));
        }
        else {
            removeAttr(el, "aria-selected");
        }
        if ((0,_types__WEBPACK_IMPORTED_MODULE_2__.hasTrait)(traits, _types__WEBPACK_IMPORTED_MODULE_2__.SemanticTrait.Checkable) && ARIA_CHECKED_ROLES.has(role)) {
            // Check state is a tri-state field, but not every checkable role
            // accepts all three values — see ARIA_MIXED_ROLES.
            var checkState = (0,_types__WEBPACK_IMPORTED_MODULE_2__.checkStateOf)(flags);
            if (checkState === _types__WEBPACK_IMPORTED_MODULE_2__.SemanticCheckState.Mixed &&
                ARIA_MIXED_ROLES.has(role)) {
                setAttr(el, "aria-checked", "mixed");
            }
            else {
                setBoolAttr(el, "aria-checked", checkState === _types__WEBPACK_IMPORTED_MODULE_2__.SemanticCheckState.Checked);
            }
        }
        else {
            removeAttr(el, "aria-checked");
        }
        if ((0,_types__WEBPACK_IMPORTED_MODULE_2__.hasTrait)(traits, _types__WEBPACK_IMPORTED_MODULE_2__.SemanticTrait.Toggleable)) {
            if (ARIA_PRESSED_ROLES.has(role)) {
                setBoolAttr(el, "aria-pressed", (0,_types__WEBPACK_IMPORTED_MODULE_2__.hasState)(flags, _types__WEBPACK_IMPORTED_MODULE_2__.SemanticState.Toggled));
            }
            else {
                removeAttr(el, "aria-pressed");
            }
            // switch uses aria-checked (not aria-pressed) for its on/off state.
            if (role === _types__WEBPACK_IMPORTED_MODULE_2__.SemanticRole.switchControl) {
                setBoolAttr(el, "aria-checked", (0,_types__WEBPACK_IMPORTED_MODULE_2__.hasState)(flags, _types__WEBPACK_IMPORTED_MODULE_2__.SemanticState.Toggled));
            }
        }
        else {
            removeAttr(el, "aria-pressed");
        }
        if ((0,_types__WEBPACK_IMPORTED_MODULE_2__.hasTrait)(traits, _types__WEBPACK_IMPORTED_MODULE_2__.SemanticTrait.Requirable) && ARIA_REQUIRED_ROLES.has(role)) {
            setBoolAttr(el, "aria-required", (0,_types__WEBPACK_IMPORTED_MODULE_2__.hasState)(flags, _types__WEBPACK_IMPORTED_MODULE_2__.SemanticState.Required));
        }
        else {
            removeAttr(el, "aria-required");
        }
        if ((0,_types__WEBPACK_IMPORTED_MODULE_2__.hasTrait)(traits, _types__WEBPACK_IMPORTED_MODULE_2__.SemanticTrait.Enablable)) {
            setBoolAttr(el, "aria-disabled", (0,_types__WEBPACK_IMPORTED_MODULE_2__.hasState)(flags, _types__WEBPACK_IMPORTED_MODULE_2__.SemanticState.Disabled));
        }
        else {
            removeAttr(el, "aria-disabled");
        }
        // ---- Non-trait states ----
        if (this.isAriaHidden(node)) {
            setAttr(el, "aria-hidden", "true");
        }
        else {
            removeAttr(el, "aria-hidden");
        }
        if ((0,_types__WEBPACK_IMPORTED_MODULE_2__.hasState)(flags, _types__WEBPACK_IMPORTED_MODULE_2__.SemanticState.LiveRegion)) {
            setAttr(el, "aria-live", "polite");
        }
        else {
            removeAttr(el, "aria-live");
        }
        // textField-specific
        // TODO: Details here may change once we implement text inputs
        if (role === _types__WEBPACK_IMPORTED_MODULE_2__.SemanticRole.textField) {
            setBoolAttr(el, "aria-readonly", (0,_types__WEBPACK_IMPORTED_MODULE_2__.hasState)(flags, _types__WEBPACK_IMPORTED_MODULE_2__.SemanticState.ReadOnly));
            setBoolAttr(el, "aria-multiline", (0,_types__WEBPACK_IMPORTED_MODULE_2__.hasState)(flags, _types__WEBPACK_IMPORTED_MODULE_2__.SemanticState.Multiline));
            // Surface the current field value as DOM text so screen readers can
            // announce it. Only safe when the node has no semantic children —
            // setting textContent would remove any child elements from the DOM.
            if (node.children.length === 0) {
                var value = (0,_types__WEBPACK_IMPORTED_MODULE_2__.hasState)(flags, _types__WEBPACK_IMPORTED_MODULE_2__.SemanticState.Obscured) ? "" : ((_c = node.value) !== null && _c !== void 0 ? _c : "");
                if (el.textContent !== value)
                    el.textContent = value;
            }
            else {
                // A value rendered earlier (before the node had children) must not linger,
                // least of all once the field turns Obscured.
                for (var _i = 0, _d = Array.from(el.childNodes); _i < _d.length; _i++) {
                    var child = _d[_i];
                    if (child.nodeType === Node.TEXT_NODE)
                        child.remove();
                }
            }
        }
        else {
            removeAttr(el, "aria-multiline");
        }
        // alertDialog is always modal per WAI-ARIA; a plain dialog only when the Modal state flag is set.
        if (isModalDialogRole(role, flags)) {
            setAttr(el, "aria-modal", "true");
        }
        else {
            removeAttr(el, "aria-modal");
        }
    };
    // ---- Positioning ----
    /**
     * Positions an element in artboard-space coordinates relative to its parent.
     *
     * Node bounds stay in raw artboard units — the CSS `transform: matrix(...)`
     * on the transform container maps artboard units to CSS pixels in one GPU
     * pass. No per-node forwardMat multiplication or DPR division needed here.
     *
     * Round to whole artboard units before comparing to avoid triggering AX
     * layout notifications from sub-unit floating-point animation jitter.
     */
    AccessibilityOverlay.prototype.applyPosition = function (el, node, parentArtboardLeft, parentArtboardTop) {
        // Clamp each node's rect to the artboard viewport before computing CSS.
        // Without this, nodes whose artboard bounds exceed the artboard (e.g. a
        // scroll list container whose height is the full content, not the viewport)
        // produce CSS heights that overflow the transform container. WebKit then
        // unions all descendant AX rects and extends the container's AX origin
        // above the canvas regardless of overflow:hidden on ancestors.
        var ab = this._artboardBounds;
        var clampedMinX = Math.max(node.minX, ab.minX);
        var clampedMinY = Math.max(node.minY, ab.minY);
        var clampedMaxX = Math.min(node.maxX, ab.maxX);
        var clampedMaxY = Math.min(node.maxY, ab.maxY);
        var elLeft = clampedMinX - parentArtboardLeft;
        var elTop = clampedMinY - parentArtboardTop;
        var elWidth = Math.max(0, clampedMaxX - clampedMinX);
        var elHeight = Math.max(0, clampedMaxY - clampedMinY);
        var tx = Math.round(elLeft);
        var ty = Math.round(elTop);
        var pxWidth = Math.round(elWidth) + "px";
        var pxHeight = Math.round(elHeight) + "px";
        // Use left/top layout properties for positioning. VoiceOver reliably
        // handles layout position + a single ancestor CSS transform (the transform
        // container). Chaining CSS transforms across multiple stacking contexts
        // (transform container → node identity → item translate) caused VoiceOver
        // to compute the correct SIZE but wrong POSITION. Artboard clamping above
        // guarantees tx/ty are always ≥ 0, so the negative-top overflow problem
        // that originally prompted the switch to CSS transforms no longer applies.
        var pxLeft = tx + "px";
        var pxTop = ty + "px";
        if (el.style.left !== pxLeft)
            el.style.left = pxLeft;
        if (el.style.top !== pxTop)
            el.style.top = pxTop;
        if (el.style.width !== pxWidth)
            el.style.width = pxWidth;
        if (el.style.height !== pxHeight)
            el.style.height = pxHeight;
        // Clear any CSS transform from a previous render pass.
        if (el.style.transform)
            el.style.transform = "";
        if (node.role === _types__WEBPACK_IMPORTED_MODULE_2__.SemanticRole.text) {
            this.pendingTextGeometry.push(el);
        }
    };
    /**
     * Scale each queued text span to fit its layout box, batched so a frame
     * pays at most one synchronous layout: all measurement-reset writes first,
     * then all rect reads, then all transform writes. Interleaving
     * write→read→write per node would force a reflow per text node instead.
     *
     * Nodes whose box size and text are unchanged since the last pass are
     * skipped entirely (their existing transform is still correct — the scale
     * is a ratio of two rects, so ancestor transform changes cancel out).
     */
    AccessibilityOverlay.prototype.flushTextGeometry = function () {
        var _a;
        if (this.pendingTextGeometry.length === 0)
            return;
        // Phase 1 — writes: reset spans to their natural size for measurement.
        // The previous pass's scale must be cleared, or the rect reads below
        // would measure the scaled span and compound the correction.
        var toMeasure = [];
        for (var _i = 0, _b = this.pendingTextGeometry; _i < _b.length; _i++) {
            var host = _b[_i];
            var span = (_a = host.querySelector(":scope > span")) !== null && _a !== void 0 ? _a : host;
            var key = "".concat(host.style.width, "|").concat(host.style.height, "|").concat(span.textContent);
            if (this.textGeometryKeys.get(host) === key)
                continue;
            span.style.width = "auto";
            span.style.height = "auto";
            span.style.transformOrigin = "0 0";
            span.style.transform = "";
            toMeasure.push({ host: host, span: span, key: key });
        }
        this.pendingTextGeometry.length = 0;
        // Phase 2 — reads: one layout pass covers every rect measurement.
        var transforms = toMeasure.map(function (_a) {
            var host = _a.host, span = _a.span;
            var parentRect = host.getBoundingClientRect();
            var natural = span.getBoundingClientRect();
            if (natural.width > 0 && natural.height > 0) {
                var scaleX = parentRect.width / natural.width;
                var scaleY = parentRect.height / natural.height;
                return "scale(".concat(scaleX, ", ").concat(scaleY, ")");
            }
            return "none";
        });
        // Phase 3 — writes: apply all transforms.
        for (var i = 0; i < toMeasure.length; i++) {
            var _c = toMeasure[i], host = _c.host, span = _c.span, key = _c.key;
            span.style.transform = transforms[i];
            this.textGeometryKeys.set(host, key);
        }
    };
    // ---- Transform container ----
    /**
     * Creates (on first call) and updates the artboard-space transform container.
     *
     * The container is sized to the artboard dimensions and carries a CSS
     * `transform: matrix(...)` that maps artboard coordinates to the canvas's CSS box
     * (forwardMat in backing-store pixels, scaled by CSS size / backing-store size). All semantic
     * node elements are children of this container and use raw artboard
     * coordinates as their CSS `left/top/width/height`, so the CSS compositor
     * applies the artboard→screen mapping in one pass.
     */
    AccessibilityOverlay.prototype.syncTransformContainer = function (forwardMat, dpr, artboardBounds) {
        if (!this.transformContainer) {
            var tc = document.createElement("div");
            tc.style.cssText = [
                "position:absolute",
                "top:0",
                "left:0",
                // overflow:visible — artboard viewport clamping is done per-node in
                // applyPosition
                "overflow:visible",
                "pointer-events:none",
                "transform-origin:0 0",
            ].join(";");
            this.container.appendChild(tc);
            this.transformContainer = tc;
        }
        var w = artboardBounds.maxX - artboardBounds.minX;
        var h = artboardBounds.maxY - artboardBounds.minY;
        this.transformContainer.style.width = Math.round(w) + "px";
        this.transformContainer.style.height = Math.round(h) + "px";
        // Backing-store pixels → CSS pixels. Measured rather than 1/dpr: a canvas can be
        // stretched by CSS, or have a stale backing store after a resize, and the drawn
        // content follows the CSS box either way. Equal to 1/dpr when they match.
        var cssWidth = this.lastCanvasPositioning.width;
        var cssHeight = this.lastCanvasPositioning.height;
        var fallback = 1 / (dpr || 1);
        var sx = this.canvas.width > 0 && cssWidth > 0 ? cssWidth / this.canvas.width : fallback;
        var sy = this.canvas.height > 0 && cssHeight > 0 ? cssHeight / this.canvas.height : fallback;
        var a = forwardMat.xx * sx;
        var b = forwardMat.xy * sy;
        var c = forwardMat.yx * sx;
        var d = forwardMat.yy * sy;
        var tx = forwardMat.tx * sx;
        var ty = forwardMat.ty * sy;
        this.transformContainer.style.transform =
            "matrix(".concat(a, ",").concat(b, ",").concat(c, ",").concat(d, ",").concat(tx, ",").concat(ty, ")");
    };
    return AccessibilityOverlay;
}());

// ---------------------------------------------------------------------------
// Static helpers (module-private)
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// ARIA attribute eligibility — role sets
//
// Each set lists the Rive roles for which a given ARIA attribute is valid per
// WAI-ARIA 1.2 ("Used in roles" + "Inherits into roles"). The trait-gated
// blocks in applyAttributes check these before setting an attribute so that
// C++ nodes with unexpected trait combinations never produce invalid markup.
//
// To add a new role: append it to the relevant set(s) here — no other changes
// needed in applyAttributes.
// ---------------------------------------------------------------------------
/** aria-expanded: button, link, checkbox, switch (inherits button), tab. */
var ARIA_EXPANDED_ROLES = new Set([
    _types__WEBPACK_IMPORTED_MODULE_2__.SemanticRole.button,
    _types__WEBPACK_IMPORTED_MODULE_2__.SemanticRole.link,
    _types__WEBPACK_IMPORTED_MODULE_2__.SemanticRole.checkbox,
    _types__WEBPACK_IMPORTED_MODULE_2__.SemanticRole.switchControl,
    _types__WEBPACK_IMPORTED_MODULE_2__.SemanticRole.tab,
]);
/**
 * aria-selected: tab is the only role in our current set that natively
 * supports it. Tab is also handled by an explicit unconditional branch in
 * applyAttributes (ARIA requires it there regardless of Selectable trait), but
 * the set still lists it so the constraint is visible in one place.
 */
var ARIA_SELECTED_ROLES = new Set([
    _types__WEBPACK_IMPORTED_MODULE_2__.SemanticRole.tab,
]);
/** aria-checked: checkbox, radio, switch. */
var ARIA_CHECKED_ROLES = new Set([
    _types__WEBPACK_IMPORTED_MODULE_2__.SemanticRole.checkbox,
    _types__WEBPACK_IMPORTED_MODULE_2__.SemanticRole.radioButton,
    _types__WEBPACK_IMPORTED_MODULE_2__.SemanticRole.switchControl,
]);
/**
 * aria-checked="mixed": checkbox only. ARIA defines checkbox as three-valued
 * (true/false/mixed) but radio and switch as two-valued (true/false), so an
 * indeterminate check state degrades to false for those roles rather than
 * emitting a value they do not support.
 */
var ARIA_MIXED_ROLES = new Set([
    _types__WEBPACK_IMPORTED_MODULE_2__.SemanticRole.checkbox,
]);
/**
 * aria-pressed: button only. switch is a button subclass in ARIA but uses
 * aria-checked (not aria-pressed) for its on/off state — it is intentionally
 * excluded here and handled separately in the Toggleable block.
 */
var ARIA_PRESSED_ROLES = new Set([
    _types__WEBPACK_IMPORTED_MODULE_2__.SemanticRole.button,
]);
/** aria-required: checkbox, textbox, radiogroup. */
var ARIA_REQUIRED_ROLES = new Set([
    _types__WEBPACK_IMPORTED_MODULE_2__.SemanticRole.checkbox,
    _types__WEBPACK_IMPORTED_MODULE_2__.SemanticRole.textField,
    _types__WEBPACK_IMPORTED_MODULE_2__.SemanticRole.radioGroup,
]);
// ---------------------------------------------------------------------------
/** Style for visually-hidden description spans used with aria-describedby. */
var DESC_SPAN_STYLE = [
    "position:absolute",
    "width:1px",
    "height:1px",
    "overflow:hidden",
    "pointer-events:none",
    "left:-9999px",
].join(";");
var BASE_NODE_STYLE = [
    "position:absolute",
    "pointer-events:none",
    "box-sizing:border-box",
    "overflow:visible",
    "margin:0",
    "padding:0",
    "transform-origin: 0px 0px 0px",
    "border:none",
    "background:transparent",
    "color:transparent",
    // "list-style:none",
].join(";");
var SPAN_EXP = [
    "display:inline-block",
    "white-space:nowrap",
    "pointer-events:none",
].join(";");
/**
 * Attribute writers that skip same-value mutations. Even a no-op setAttribute
 * fires a mutation record, and whether AX layers dedupe those is
 * browser-specific — skipping the write is the only browser-proof guard.
 */
function setAttr(el, attr, value) {
    if (el.getAttribute(attr) !== value)
        el.setAttribute(attr, value);
}
function removeAttr(el, attr) {
    if (el.hasAttribute(attr))
        el.removeAttribute(attr);
}
function setBoolAttr(el, attr, value) {
    setAttr(el, attr, value ? "true" : "false");
}
/** Roles that receive click/Enter/Space action handlers. */
function isClickableRole(role) {
    switch (role) {
        case _types__WEBPACK_IMPORTED_MODULE_2__.SemanticRole.button:
        case _types__WEBPACK_IMPORTED_MODULE_2__.SemanticRole.link:
        case _types__WEBPACK_IMPORTED_MODULE_2__.SemanticRole.checkbox:
        case _types__WEBPACK_IMPORTED_MODULE_2__.SemanticRole.switchControl:
        case _types__WEBPACK_IMPORTED_MODULE_2__.SemanticRole.tab:
        case _types__WEBPACK_IMPORTED_MODULE_2__.SemanticRole.radioButton:
            return true;
        default:
            return false;
    }
}
/** Roles that receive tabindex="-1" for programmatic/AT focus (not Tab order). */
function isInteractiveRole(role) {
    switch (role) {
        case _types__WEBPACK_IMPORTED_MODULE_2__.SemanticRole.button:
        case _types__WEBPACK_IMPORTED_MODULE_2__.SemanticRole.link:
        case _types__WEBPACK_IMPORTED_MODULE_2__.SemanticRole.checkbox:
        case _types__WEBPACK_IMPORTED_MODULE_2__.SemanticRole.switchControl:
        case _types__WEBPACK_IMPORTED_MODULE_2__.SemanticRole.slider:
        case _types__WEBPACK_IMPORTED_MODULE_2__.SemanticRole.tab:
        case _types__WEBPACK_IMPORTED_MODULE_2__.SemanticRole.radioButton:
        case _types__WEBPACK_IMPORTED_MODULE_2__.SemanticRole.textField:
            return true;
        default:
            return false;
    }
}
/**
 * A modal/alert dialog: alertDialog is always modal per WAI-ARIA, a plain
 * dialog only when the Modal state flag is set.
 */
function isModalDialogRole(role, flags) {
    return (role === _types__WEBPACK_IMPORTED_MODULE_2__.SemanticRole.alertDialog ||
        (role === _types__WEBPACK_IMPORTED_MODULE_2__.SemanticRole.dialog && (0,_types__WEBPACK_IMPORTED_MODULE_2__.hasState)(flags, _types__WEBPACK_IMPORTED_MODULE_2__.SemanticState.Modal)));
}
/** Whether a node can receive focus: an interactive role or the Focusable trait. */
function isFocusableNode(node) {
    return (isInteractiveRole(node.role) ||
        (0,_types__WEBPACK_IMPORTED_MODULE_2__.hasTrait)(node.traitFlags, _types__WEBPACK_IMPORTED_MODULE_2__.SemanticTrait.Focusable));
}
/**
 * Choose an HTML tag for a given role. Prefer native semantic elements
 * where they exist — screen readers treat them more reliably than
 * generic elements with ARIA role overrides.
 */
function tagForRole(role) {
    switch (role) {
        case _types__WEBPACK_IMPORTED_MODULE_2__.SemanticRole.link:
            return "a";
        case _types__WEBPACK_IMPORTED_MODULE_2__.SemanticRole.text:
            // The outer div is the positioned AX element VoiceOver measures for its
            // highlight box. The text itself lives in a child <span> (see createElement).
            return "div";
        default:
            return "div";
    }
}
/**
 * Maps a Rive SemanticRole to an ARIA `role` attribute value.
 * Returns null for roles that don't need an explicit role attribute here
 * (e.g. text nodes use an outer div + inner span with textContent; heading
 * role is applied separately when headingLevel > 0).
 */
function ariaRoleForSemantic(role) {
    switch (role) {
        case _types__WEBPACK_IMPORTED_MODULE_2__.SemanticRole.none:
            // TODO: Role "none" removes the node from the accessibility tree. For now, setting to Group, but maybe we want to switch to "none"
            // or "presentation".
            return "group";
        case _types__WEBPACK_IMPORTED_MODULE_2__.SemanticRole.button:
            return "button";
        case _types__WEBPACK_IMPORTED_MODULE_2__.SemanticRole.link:
            return null; // native <a>
        case _types__WEBPACK_IMPORTED_MODULE_2__.SemanticRole.checkbox:
            return "checkbox";
        case _types__WEBPACK_IMPORTED_MODULE_2__.SemanticRole.switchControl:
            return "switch";
        case _types__WEBPACK_IMPORTED_MODULE_2__.SemanticRole.slider:
            return "slider";
        case _types__WEBPACK_IMPORTED_MODULE_2__.SemanticRole.textField:
            return "textbox";
        case _types__WEBPACK_IMPORTED_MODULE_2__.SemanticRole.image:
            return "img";
        case _types__WEBPACK_IMPORTED_MODULE_2__.SemanticRole.group:
            return "group";
        case _types__WEBPACK_IMPORTED_MODULE_2__.SemanticRole.list:
            return "list";
        case _types__WEBPACK_IMPORTED_MODULE_2__.SemanticRole.listItem:
            return "listitem";
        case _types__WEBPACK_IMPORTED_MODULE_2__.SemanticRole.tab:
            return "tab";
        case _types__WEBPACK_IMPORTED_MODULE_2__.SemanticRole.tabList:
            return "tablist";
        case _types__WEBPACK_IMPORTED_MODULE_2__.SemanticRole.dialog:
            return "dialog";
        case _types__WEBPACK_IMPORTED_MODULE_2__.SemanticRole.alertDialog:
            return "alertdialog";
        case _types__WEBPACK_IMPORTED_MODULE_2__.SemanticRole.radioGroup:
            return "radiogroup";
        case _types__WEBPACK_IMPORTED_MODULE_2__.SemanticRole.radioButton:
            return "radio";
        case _types__WEBPACK_IMPORTED_MODULE_2__.SemanticRole.text:
            // Text nodes use <span>; heading role is applied separately
            // when headingLevel > 0.
            return null;
        default:
            return null;
    }
}


/***/ }),
/* 10 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   claimKeyEvent: () => (/* binding */ claimKeyEvent),
/* harmony export */   isKeyEventClaimed: () => (/* binding */ isKeyEventClaimed)
/* harmony export */ });
var claimed = new WeakSet();
/**
 * Marks a key event as handled by a semantic overlay widget (and prevents its
 * default), so the Rive keyboard handler leaves it alone. A plain
 * `defaultPrevented` check can't tell these apart from host-page handlers.
 */
function claimKeyEvent(event) {
    event.preventDefault();
    claimed.add(event);
}
function isKeyEventClaimed(event) {
    return claimed.has(event);
}


/***/ }),
/* 11 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   canvasOffset: () => (/* binding */ canvasOffset)
/* harmony export */ });
/**
 * Canvas offset within its offsetParent, minus the scroll of ancestors in between (they
 * move the canvas, not absolutely positioned siblings).
 */
function canvasOffset(canvas) {
    var top = canvas.offsetTop;
    var left = canvas.offsetLeft;
    var offsetParent = canvas.offsetParent;
    if (!offsetParent)
        return { top: top, left: left };
    for (var el = canvas.parentElement; el && el !== offsetParent; el = el.parentElement) {
        top -= el.scrollTop;
        left -= el.scrollLeft;
    }
    return { top: top, left: left };
}


/***/ }),
/* 12 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AudioAssetWrapper: () => (/* reexport safe */ _finalizationRegistry__WEBPACK_IMPORTED_MODULE_3__.AudioAssetWrapper),
/* harmony export */   AudioWrapper: () => (/* reexport safe */ _finalizationRegistry__WEBPACK_IMPORTED_MODULE_3__.AudioWrapper),
/* harmony export */   BLANK_URL: () => (/* reexport safe */ _sanitizeUrl__WEBPACK_IMPORTED_MODULE_2__.BLANK_URL),
/* harmony export */   CustomFileAssetLoaderWrapper: () => (/* reexport safe */ _finalizationRegistry__WEBPACK_IMPORTED_MODULE_3__.CustomFileAssetLoaderWrapper),
/* harmony export */   FileAssetWrapper: () => (/* reexport safe */ _finalizationRegistry__WEBPACK_IMPORTED_MODULE_3__.FileAssetWrapper),
/* harmony export */   FileFinalizer: () => (/* reexport safe */ _finalizationRegistry__WEBPACK_IMPORTED_MODULE_3__.FileFinalizer),
/* harmony export */   FocusSessionState: () => (/* reexport safe */ _registerKeyboardInteractions__WEBPACK_IMPORTED_MODULE_1__.FocusSessionState),
/* harmony export */   FontAssetWrapper: () => (/* reexport safe */ _finalizationRegistry__WEBPACK_IMPORTED_MODULE_3__.FontAssetWrapper),
/* harmony export */   FontWrapper: () => (/* reexport safe */ _finalizationRegistry__WEBPACK_IMPORTED_MODULE_3__.FontWrapper),
/* harmony export */   ImageAssetWrapper: () => (/* reexport safe */ _finalizationRegistry__WEBPACK_IMPORTED_MODULE_3__.ImageAssetWrapper),
/* harmony export */   ImageWrapper: () => (/* reexport safe */ _finalizationRegistry__WEBPACK_IMPORTED_MODULE_3__.ImageWrapper),
/* harmony export */   KeyboardInteractions: () => (/* reexport safe */ _registerKeyboardInteractions__WEBPACK_IMPORTED_MODULE_1__.KeyboardInteractions),
/* harmony export */   RiveFont: () => (/* reexport safe */ _riveFont__WEBPACK_IMPORTED_MODULE_4__.RiveFont),
/* harmony export */   createFinalization: () => (/* reexport safe */ _finalizationRegistry__WEBPACK_IMPORTED_MODULE_3__.createFinalization),
/* harmony export */   finalizationRegistry: () => (/* reexport safe */ _finalizationRegistry__WEBPACK_IMPORTED_MODULE_3__.finalizationRegistry),
/* harmony export */   registerTouchInteractions: () => (/* reexport safe */ _registerTouchInteractions__WEBPACK_IMPORTED_MODULE_0__.registerTouchInteractions),
/* harmony export */   sanitizeUrl: () => (/* reexport safe */ _sanitizeUrl__WEBPACK_IMPORTED_MODULE_2__.sanitizeUrl)
/* harmony export */ });
/* harmony import */ var _registerTouchInteractions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(13);
/* harmony import */ var _registerKeyboardInteractions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(14);
/* harmony import */ var _sanitizeUrl__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(17);
/* harmony import */ var _finalizationRegistry__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(18);
/* harmony import */ var _riveFont__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(19);







/***/ }),
/* 13 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   registerTouchInteractions: () => (/* binding */ registerTouchInteractions)
/* harmony export */ });
var _this = undefined;
// A detented wheel reports lines; the runtime wants pixels.
var PIXELS_PER_LINE = 16;
// ScrollPhase.update. The DOM reports no gesture phase, so every wheel event
// is an update and the runtime closes the gesture once it goes quiet.
var SCROLL_PHASE_UPDATE = 1;
/**
 * Extracts ClientCoordinates from a TouchList, respecting multi-touch vs.
 * single-touch mode. In single-touch mode, only the touch matching
 * primaryTouchId is returned (or the first touch when primaryTouchId is null).
 */
var getTouchCoordinates = function (changedTouches, enableMultiTouch, primaryTouchId) {
    var _a;
    var coordinates = [];
    if (enableMultiTouch) {
        for (var i = 0; i < changedTouches.length; i++) {
            var touch = changedTouches[i];
            coordinates.push({
                clientX: touch.clientX,
                clientY: touch.clientY,
                identifier: touch.identifier,
            });
        }
    }
    else {
        // In "single-touch mode", only track the primary finger identified at touchstart.
        // Search changedTouches for the touch matching the recorded primary touch identifier, or (on initial touchstart)
        // take the first available touch identifier.
        var primaryTouch = primaryTouchId !== null
            ? (_a = Array.from(changedTouches).find(function (t) { return t.identifier === primaryTouchId; })) !== null && _a !== void 0 ? _a : null
            : changedTouches[0];
        if (primaryTouch) {
            coordinates.push({
                clientX: primaryTouch.clientX,
                clientY: primaryTouch.clientY,
                identifier: primaryTouch.identifier,
            });
        }
    }
    return coordinates;
};
/**
 * Returns the clientX and clientY properties from touch or mouse events. Also
 * calls preventDefault() on the event if it is a touchstart or touchmove to prevent
 * scrolling the page on mobile devices
 * @param event - Either a TouchEvent or a MouseEvent
 * @param isTouchScrollEnabled - Whether touch scrolling is enabled
 * @param enableMultiTouch - Whether to process multiple simultaneous touches
 * @param primaryTouchId - When working with single touches, only process the touch
 *   with this identifier. Pass null to accept any touch (used during touchstart to
 *   capture the first finger down).
 * @returns - Coordinates of the clientX and clientY properties from the touch/mouse event
 */
var getClientCoordinates = function (event, isTouchScrollEnabled, enableMultiTouch, primaryTouchId) {
    var _a;
    var touchEvent = event;
    if ((_a = touchEvent.changedTouches) === null || _a === void 0 ? void 0 : _a.length) {
        // This flag, if false, prevents touch events on the canvas default behavior
        // which may prevent scrolling if a drag motion on the canvas is performed
        if (!isTouchScrollEnabled && ["touchstart", "touchmove"].includes(event.type)) {
            event.preventDefault();
        }
        return getTouchCoordinates(touchEvent.changedTouches, enableMultiTouch, primaryTouchId);
    }
    return [
        {
            clientX: event.clientX,
            clientY: event.clientY,
            identifier: 0,
        },
    ];
};
/**
 * Registers mouse move/up/down and wheel callback handlers on the canvas to send meaningful
 * coordinates to the state machine pointer move/up/down/scroll functions based on cursor
 * interaction
 */
var registerTouchInteractions = function (_a) {
    var canvas = _a.canvas, artboard = _a.artboard, _b = _a.stateMachines, stateMachines = _b === void 0 ? [] : _b, renderer = _a.renderer, rive = _a.rive, fit = _a.fit, alignment = _a.alignment, _c = _a.isTouchScrollEnabled, isTouchScrollEnabled = _c === void 0 ? false : _c, _d = _a.dispatchPointerExit, dispatchPointerExit = _d === void 0 ? true : _d, _e = _a.enableMultiTouch, enableMultiTouch = _e === void 0 ? false : _e, _f = _a.layoutScaleFactor, layoutScaleFactor = _f === void 0 ? 1.0 : _f, advanceAndDrain = _a.advanceAndDrain, summonKeyboard = _a.summonKeyboard, isTextProxyFocused = _a.isTextProxyFocused;
    if (!canvas ||
        !stateMachines.length ||
        !renderer ||
        !rive ||
        !artboard ||
        typeof window === "undefined") {
        return null;
    }
    // A gesture latched before the previous listeners came down (a pause, say)
    // never reached its idle timeout, and would take the next wheel wherever
    // it lands. These instances are live here; at teardown they may not be.
    for (var _i = 0, stateMachines_1 = stateMachines; _i < stateMachines_1.length; _i++) {
        var stateMachine = stateMachines_1[_i];
        stateMachine.cancelScroll();
    }
    /**
     * After a touchend event, some browsers may fire synthetic mouse events
     * (mouseover, mousedown, mousemove, mouseup) if the touch interaction did not cause
     * any default action (such as scrolling).
     *
     * This is done to simulate the behavior of a mouse for applications that do not support
     * touch events.
     *
     * We're keeping track of the previous event to not send the synthetic mouse events if the
     * touch event was a click (touchstart -> touchend).
     *
     * Emulated events only occur when `isTouchScrollEnabled` is true; when false,
     * touchstart is default-prevented, which suppresses them.
     * Emulated mousedown is prevented while the proxy is focused, or it would blur it and
     * drop the keyboard.
     **/
    var _prevEventType = null;
    var _syntheticEventsActive = false;
    /**
     * When enableMultiTouch is false ("single-touch mode"), we track the identifier of the first finger that touched down.
     * All subsequent touch events are filtered to this identifier so that a second finger
     * moving cannot displace the tracked pointer position.
     * Reset to null when the primary finger lifts (or touchcancel is called)
     */
    var _primaryTouchId = null;
    /**
     * Maps client-space points into Artboard space through the fit and alignment
     * of the canvas.
     */
    var mapToArtboard = function (boundingRect, points) {
        var forwardMatrix = rive.computeAlignment(fit, alignment, {
            minX: 0,
            minY: 0,
            maxX: boundingRect.width,
            maxY: boundingRect.height,
        }, artboard.bounds, layoutScaleFactor);
        var invertedMatrix = new rive.Mat2D();
        forwardMatrix.invert(invertedMatrix);
        var mapped = points.map(function (_a) {
            var clientX = _a.clientX, clientY = _a.clientY;
            var canvasX = clientX - boundingRect.left;
            var canvasY = clientY - boundingRect.top;
            var canvasCoordinatesVector = new rive.Vec2D(canvasX, canvasY);
            var transformedVector = rive.mapXY(invertedMatrix, canvasCoordinatesVector);
            var point = { x: transformedVector.x(), y: transformedVector.y() };
            transformedVector.delete();
            canvasCoordinatesVector.delete();
            return point;
        });
        invertedMatrix.delete();
        forwardMatrix.delete();
        return mapped;
    };
    var processEventCallback = function (event) {
        var _a;
        // Exit early out of all synthetic mouse events
        // https://stackoverflow.com/questions/9656990/how-to-prevent-simulated-mouse-events-in-mobile-browsers
        // https://stackoverflow.com/questions/25572070/javascript-touchend-versus-click-dilemma
        if (_syntheticEventsActive && event instanceof MouseEvent) {
            if (event.type === "mousedown" && (isTextProxyFocused === null || isTextProxyFocused === void 0 ? void 0 : isTextProxyFocused())) {
                event.preventDefault();
            }
            // Synthetic event finished
            if (event.type == "mouseup") {
                _syntheticEventsActive = false;
            }
            return;
        }
        // Test if it's a "touch click". This could cause the browser to send
        // synthetic mouse events.
        _syntheticEventsActive =
            isTouchScrollEnabled &&
                event.type === "touchend" &&
                _prevEventType === "touchstart";
        _prevEventType = event.type;
        var boundingRect = event.currentTarget.getBoundingClientRect();
        // On touchstart in single-touch mode, record the first new finger as the primary
        // touch if we aren't already tracking one.
        if (!enableMultiTouch && event.type === "touchstart" && _primaryTouchId === null) {
            var firstTouch = (_a = event.changedTouches) === null || _a === void 0 ? void 0 : _a[0];
            if (firstTouch) {
                _primaryTouchId = firstTouch.identifier;
            }
        }
        var coordinateSets = getClientCoordinates(event, isTouchScrollEnabled, enableMultiTouch, enableMultiTouch ? null : _primaryTouchId);
        var positionedSets = coordinateSets.filter(function (coordinateSet) { return coordinateSet.clientX || coordinateSet.clientY; });
        mapToArtboard(boundingRect, positionedSets).forEach(function (point, i) {
            positionedSets[i].transformedX = point.x;
            positionedSets[i].transformedY = point.y;
        });
        switch (event.type) {
            /**
             * There's a 2px buffer for a hitRadius when translating the pointer coordinates
             * down to the state machine. In cases where the hitbox is about that much away
             * from the Artboard border, we don't have exact precision on determining pointer
             * exit. We're therefore adding to the translated coordinates on mouseout of a canvas
             * to ensure that we report the mouse has truly exited the hitarea.
             * https://github.com/rive-app/rive-cpp/blob/master/src/animation/state_machine_instance.cpp#L336
             *
             */
            case "mouseout":
                var _loop_1 = function (stateMachine) {
                    if (dispatchPointerExit) {
                        coordinateSets.forEach(function (coordinateSet) {
                            stateMachine.pointerExit(coordinateSet.transformedX, coordinateSet.transformedY, coordinateSet.identifier);
                        });
                    }
                    else {
                        coordinateSets.forEach(function (coordinateSet) {
                            stateMachine.pointerMove(coordinateSet.transformedX, coordinateSet.transformedY, coordinateSet.identifier);
                        });
                    }
                };
                for (var _i = 0, stateMachines_2 = stateMachines; _i < stateMachines_2.length; _i++) {
                    var stateMachine = stateMachines_2[_i];
                    _loop_1(stateMachine);
                }
                break;
            // Pointer moving/hovering on the canvas
            case "touchmove":
            case "mouseover":
            case "mousemove": {
                var _loop_2 = function (stateMachine) {
                    coordinateSets.forEach(function (coordinateSet) {
                        stateMachine.pointerMove(coordinateSet.transformedX, coordinateSet.transformedY, coordinateSet.identifier);
                    });
                };
                for (var _b = 0, stateMachines_3 = stateMachines; _b < stateMachines_3.length; _b++) {
                    var stateMachine = stateMachines_3[_b];
                    _loop_2(stateMachine);
                }
                break;
            }
            // Pointer click initiated but not released yet on the canvas
            case "touchstart":
            case "mousedown": {
                var _loop_3 = function (stateMachine) {
                    coordinateSets.forEach(function (coordinateSet) {
                        stateMachine.pointerDown(coordinateSet.transformedX, coordinateSet.transformedY, coordinateSet.identifier);
                    });
                };
                for (var _c = 0, stateMachines_4 = stateMachines; _c < stateMachines_4.length; _c++) {
                    var stateMachine = stateMachines_4[_c];
                    _loop_3(stateMachine);
                }
                // Advance the state machine immediately so pointer down(s) takes effect synchronously
                advanceAndDrain(0, { pointerDown: true });
                break;
            }
            // Pointer click released on the canvas
            case "touchend": {
                var _loop_4 = function (stateMachine) {
                    coordinateSets.forEach(function (coordinateSet) {
                        stateMachine.pointerUp(coordinateSet.transformedX, coordinateSet.transformedY, coordinateSet.identifier);
                        stateMachine.pointerExit(coordinateSet.transformedX, coordinateSet.transformedY, coordinateSet.identifier);
                    });
                };
                for (var _d = 0, stateMachines_5 = stateMachines; _d < stateMachines_5.length; _d++) {
                    var stateMachine = stateMachines_5[_d];
                    _loop_4(stateMachine);
                }
                // Advance the state machine immediately so pointer up(s) takes effect synchronously
                advanceAndDrain(0);
                // Still inside the touch gesture — summon the keyboard if the tap focused a
                // text input
                summonKeyboard === null || summonKeyboard === void 0 ? void 0 : summonKeyboard();
                // Release the primary touch lock once that finger lifts so the next
                // touchstart can claim a new primary finger.
                if (!enableMultiTouch &&
                    coordinateSets.some(function (c) { return c.identifier === _primaryTouchId; })) {
                    _primaryTouchId = null;
                }
                break;
            }
            case "mouseup": {
                var _loop_5 = function (stateMachine) {
                    coordinateSets.forEach(function (coordinateSet) {
                        stateMachine.pointerUp(coordinateSet.transformedX, coordinateSet.transformedY, coordinateSet.identifier);
                    });
                };
                for (var _e = 0, stateMachines_6 = stateMachines; _e < stateMachines_6.length; _e++) {
                    var stateMachine = stateMachines_6[_e];
                    _loop_5(stateMachine);
                }
                // Advance the state machine immediately so pointer up(s) takes effect synchronously
                advanceAndDrain(0);
                summonKeyboard === null || summonKeyboard === void 0 ? void 0 : summonKeyboard();
                break;
            }
            default:
        }
    };
    var touchCancelCallback = function () {
        _primaryTouchId = null;
    };
    /**
     * Forwards wheel and trackpad scrolling to the state machines. The page keeps
     * the wheel unless a scroll view actually moves, so it still scrolls when
     * Rive has nothing to scroll or a view sits at its edge.
     */
    var wheelCallback = function (event) {
        // Pinch zoom arrives as a ctrl+wheel and belongs to the page. A wheel that
        // can't be cancelled is part of a sequence the page is already scrolling;
        // taking it too would move both.
        if (event.ctrlKey || !event.cancelable) {
            return;
        }
        // Read before the deltas: Firefox reports pixels once a delta has been
        // read first.
        var deltaMode = event.deltaMode;
        var deltaX = event.deltaX;
        var deltaY = event.deltaY;
        // Shift+wheel scrolls sideways. Most browsers already report it on the x
        // axis; a vertical-only view would decline it on y.
        if (event.shiftKey && !deltaX) {
            deltaX = deltaY;
            deltaY = 0;
        }
        var boundingRect = event.currentTarget.getBoundingClientRect();
        // A page is the canvas's visible size, the nearest the host can get to the
        // scroll view's own.
        var toPixelsX = deltaMode === WheelEvent.DOM_DELTA_LINE
            ? PIXELS_PER_LINE
            : deltaMode === WheelEvent.DOM_DELTA_PAGE
                ? boundingRect.width
                : 1;
        var toPixelsY = deltaMode === WheelEvent.DOM_DELTA_LINE
            ? PIXELS_PER_LINE
            : deltaMode === WheelEvent.DOM_DELTA_PAGE
                ? boundingRect.height
                : 1;
        // The DOM reports how far to scroll; the runtime wants how far content
        // travels.
        var scrollX = -deltaX * toPixelsX;
        var scrollY = -deltaY * toPixelsY;
        if (!scrollX && !scrollY) {
            return;
        }
        // Mapping both ends of the delta keeps only the scale of the fit.
        var _a = mapToArtboard(boundingRect, [
            { clientX: event.clientX, clientY: event.clientY },
            { clientX: event.clientX + scrollX, clientY: event.clientY + scrollY },
        ]), position = _a[0], moved = _a[1];
        // The DOM never says whether a pixel delta came from a trackpad, so it
        // counts as precise either way, as it does in the browser's own scrolling.
        var precise = deltaMode === WheelEvent.DOM_DELTA_PIXEL;
        var timeStamp = event.timeStamp / 1000;
        // A latched state machine owns the rest of its gesture, even past its edge.
        var latched = stateMachines.filter(function (sm) { return sm.hasScrollLatch(); });
        var ordered = latched.concat(stateMachines.filter(function (sm) { return latched.indexOf(sm) === -1; }));
        var consumed = ordered.some(function (stateMachine) {
            return stateMachine.pointerScroll(position.x, position.y, moved.x - position.x, moved.y - position.y, SCROLL_PHASE_UPDATE, precise, timeStamp, 0) !== 0;
        });
        if (!consumed) {
            return;
        }
        event.preventDefault();
        // Advance now so the scroll lands on the next frame drawn.
        advanceAndDrain(0);
    };
    var callback = processEventCallback.bind(_this);
    canvas.addEventListener("mouseover", callback);
    canvas.addEventListener("mouseout", callback);
    canvas.addEventListener("mousemove", callback);
    canvas.addEventListener("mousedown", callback);
    canvas.addEventListener("mouseup", callback);
    canvas.addEventListener("touchmove", callback, {
        passive: isTouchScrollEnabled,
    });
    canvas.addEventListener("touchstart", callback, {
        passive: isTouchScrollEnabled,
    });
    canvas.addEventListener("touchend", callback);
    canvas.addEventListener("touchcancel", touchCancelCallback);
    // Not passive, or preventDefault could not keep the page from scrolling.
    canvas.addEventListener("wheel", wheelCallback, { passive: false });
    return function () {
        canvas.removeEventListener("mouseover", callback);
        canvas.removeEventListener("mouseout", callback);
        canvas.removeEventListener("mousemove", callback);
        canvas.removeEventListener("mousedown", callback);
        canvas.removeEventListener("mouseup", callback);
        canvas.removeEventListener("touchmove", callback);
        canvas.removeEventListener("touchstart", callback);
        canvas.removeEventListener("touchend", callback);
        canvas.removeEventListener("touchcancel", touchCancelCallback);
        canvas.removeEventListener("wheel", wheelCallback);
    };
};


/***/ }),
/* 14 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FocusSessionState: () => (/* binding */ FocusSessionState),
/* harmony export */   KeyboardInteractions: () => (/* binding */ KeyboardInteractions)
/* harmony export */ });
/* harmony import */ var _keyMap__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15);
/* harmony import */ var _semantics_claimedKeyEvents__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(10);
/* harmony import */ var _textInputProxy__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(16);



/**
 * Defaults suppressed while typing (scroll/navigate/submit). Tab is traversal's; proxy
 * Space returns earlier as a printable.
 */
var EDITING_NAV_CODES = new Set([
    "Space",
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "ArrowDown",
    "Backspace",
    "Delete",
    "Home",
    "End",
    "Enter",
    "NumpadEnter",
]);
/** A keystroke that types a character (not a Ctrl/Cmd shortcut). */
function isPrintable(event) {
    return event.key.length === 1 && !event.ctrlKey && !event.metaKey;
}
function isArrowKey(key) {
    return (key === _keyMap__WEBPACK_IMPORTED_MODULE_0__.Key.left || key === _keyMap__WEBPACK_IMPORTED_MODULE_0__.Key.right || key === _keyMap__WEBPACK_IMPORTED_MODULE_0__.Key.up || key === _keyMap__WEBPACK_IMPORTED_MODULE_0__.Key.down);
}
/**
 * Alt/Ctrl/Meta arrows are browser/OS shortcuts (Alt+Left = back, Cmd+Arrow, etc.).
 * Shift is allowed: it is the spatial-navigation chord in Vivaldi/Opera.
 */
function hasShortcutModifier(event) {
    return event.altKey || event.ctrlKey || event.metaKey;
}
/**
 * Tracks the relationship between DOM focus inside this Rive focus domain (canvas or semantic overlay)
 * and Rive's internal focus for the current focus session.
 *
 * NotFocused   — DOM focus left the domain, Rive released focus internally, or Tab walked
 *                off the end of the tree. Keyboard input isn't ours, so Tab is ignored and
 *                reaches the next page element.
 * EntryPending — DOM focus is inside the domain but Rive holds no node yet, so the next Tab
 *                enters the focus tree. Set by pointer focus on the canvas, by assistive technology (AT) focus landing
 *                in the overlay, and by keyboard focus whose entry attempt found no eligible node.
 * RiveFocused  — a Rive node holds focus. Tab/Shift+Tab route to the Rive focus manager and stay
 *                inside the domain until either Rive reports focus ended (pollFocusState) or
 *                Tab walks off the edge of the tree (focusNext()/focusPrevious() returns false and
 *                Rive no longer holds focus).
 *
 * Keyboard focus on the canvas enters the tree immediately: onCanvasFocus infers direction from
 * where focus came from and goes straight to RiveFocused when a node accepts.
 */
var FocusSessionState;
(function (FocusSessionState) {
    FocusSessionState["NotFocused"] = "notFocused";
    FocusSessionState["EntryPending"] = "entryPending";
    FocusSessionState["RiveFocused"] = "riveFocused";
})(FocusSessionState || (FocusSessionState = {}));
/**
 * Manages keyboard and DOM focus interactions for Rive's focus domain (<canvas>, semantic
 * overlay, text input proxy). Owns the proxy and the text input session state.
 * Because keyboard events can apply on either part of the domain, we need to track what events we should
 * handle/intercept, and when to release focus back to the page outside of the domain.
 *
 * Tracks the canvas focus session state (focusSessionState) and routes
 * Tab/Shift+Tab to the Rive state machine's focus manager. Exposes shared
 * state as properties so the Rive render loop can read them directly.
 */
var KeyboardInteractions = /** @class */ (function () {
    function KeyboardInteractions(_a) {
        var canvas = _a.canvas, stateMachine = _a.stateMachine, hasFocusNodes = _a.hasFocusNodes, getOverlayElement = _a.getOverlayElement;
        var _this = this;
        var _b, _c;
        this.focusSessionState = FocusSessionState.NotFocused;
        /** Whether the canvas currently has browser DOM focus. */
        this.canvasHasFocus = false;
        /** After Tab exits the last Rive node, ignore keydowns until focus re-enters the focus domain. */
        this.focusDomainReleased = false;
        /** Overlay element currently wired with focusin/keydown listeners, if any. */
        this.currentOverlayElement = null;
        /** Codes whose keydown an overlay widget took, so their keyup is skipped too. */
        this.claimedKeyCodes = new Set();
        this.textInputSessionActive = false;
        /**
         * The proxy is always empty: copy Rive's selection; always preventDefault.
         */
        this.onCopy = function (event) {
            var _a;
            event.preventDefault();
            var selected = _this.mainSm.selectedText();
            if (selected)
                (_a = event.clipboardData) === null || _a === void 0 ? void 0 : _a.setData("text/plain", selected);
        };
        /**
         * Handles the canvas gaining browser focus. The behavior differs based on how focus was gained -
         *
         * Pointer-driven focus: the canvas now has focus but Rive holds nothing yet, so we move to EntryPending — this lets the
         * next Tab enter the focus tree even when the focus is pointer-driven
         *
         * Keyboard-driven focus: we enter the Rive focus tree immediately once canvas gains focus.
         * The direction is inferred from where focus came from: an element before the canvas in DOM order
         * means a forward Tab (focusNext), one after means a Shift+Tab (focusPrevious). :focus-visible
         * gates this so a click doesn't yank Rive focus to the first node on the focus event itself.
         */
        this.onCanvasFocus = function (event) {
            _this.syncOverlayListener();
            _this.canvasHasFocus = true;
            _this.focusDomainReleased = false;
            if (_this.isInFocusDomain(event.relatedTarget) ||
                !_this.hasFocusNodes ||
                _this.mainSm.focusState().hasFocus) {
                return;
            }
            _this.focusSessionState = FocusSessionState.EntryPending;
            // Pointer focus waits for the user's next Tab (handled in onKeyDown). Keyboard focus enters now.
            if (!_this.isKeyboardDrivenFocus())
                return;
            var forward = _this.cameFromBeforeCanvas(event.relatedTarget);
            if (forward ? _this.mainSm.focusNext() : _this.mainSm.focusPrevious()) {
                _this.focusSessionState = FocusSessionState.RiveFocused;
            }
        };
        /**
         * Marks internal state that the canvas has lost DOM focus. Do not actually clear
         * Rive focus though if:
         * 1. DOM focus is still within Rive domain (i.e., semantic overlay)
         * 2. Document just lost focus (i.e. tab switching)
         *
         * When we're not in either of those buckets, it's safe to call `clearFocus()` on the SMI.
         */
        this.onCanvasBlur = function (event) {
            // Must stay before the state reset because beginTextInputSession sets the session state and
            // then focuses the proxy, which synchronously blurs the canvas.
            if (_this.inputProxy.owns(event.relatedTarget))
                return;
            _this.focusSessionState = FocusSessionState.NotFocused;
            _this.canvasHasFocus = false;
            if (_this.blurStaysWithRive(event.relatedTarget))
                return;
            _this.mainSm.clearFocus();
        };
        /**
         * Assistive technology (AT) focus landing inside the overlay is DOM focus inside the Rive focus domain, so open a
         * session even when no Rive node holds focus yet. shouldRiveHandleKeyEvent treats NotFocused
         * as authoritative, so without this the overlay's Tab keydowns reach onKeyDown and get dropped
         * at that gate — the browser would move focus out of Rive instead of to the next focus node.
         */
        this.onOverlayFocusIn = function (event) {
            if (!_this.isInOverlay(event.target))
                return;
            _this.focusDomainReleased = false;
            if (!_this.hasFocusNodes)
                return;
            if (_this.focusSessionState !== FocusSessionState.NotFocused)
                return;
            _this.focusSessionState = _this.mainSm.focusState().hasFocus
                ? FocusSessionState.RiveFocused
                : FocusSessionState.EntryPending;
        };
        /** Overlay listeners attach lazily, so the first focusin only ever lands here. */
        this.onFocusDomainHostFocusIn = function (event) {
            _this.syncOverlayListener();
            _this.onOverlayFocusIn(event);
            // Focus entering the proxy re-enters the focus domain, so clear any earlier Tab-out
            // release, or onKeyDown would drop the session's keystrokes.
            if (_this.inputProxy.owns(event.target)) {
                _this.focusDomainReleased = false;
            }
        };
        /**
         * Handles keydown events in the Rive focus domain. We route certain keys to different functions, with the following
         * fallback behavior:
         * 1. Tab/Shift+Tab - check if keyInput() takes this key, if not, call focusNext/Previous traversal if there are focus nodes
         * 2. Check - if a semantic overlay element's key handler claimed the event, don't intercept the key event further
         * 3. Send key to `keyInput()` on Rive state machine if applicable.
         * 4. If the keyInput returned false, and the key is directional arrow keys, call directional focus methods on state machine
         * 5. Printables: in a session the proxy's input event supplies text; otherwise textInput().
         *    A printable fires both keyInput and textInput even if a listener claims it.
         * @param event KeyboardEvent
         * @returns void
         */
        this.onKeyDown = function (event) {
            _this.syncOverlayListener();
            // Keys that are part of an IME composition belong to the IME (candidate
            // navigation, commit). Safari reports the first one as keyCode 229 with
            // isComposing still false.
            if (event.isComposing || event.keyCode === 229)
                return;
            // After Tab exits the last Rive node, ignore keys until focus re-enters the focus domain.
            if (_this.focusDomainReleased)
                return;
            if (!_this.shouldRiveHandleKeyEvent(event))
                return;
            if (event.key === "Tab" && _this.hasFocusNodes) {
                // Tab listeners are matched per phase (down/repeat/up), as in the editor, so
                // each event is offered on its own; one that isn't claimed traverses.
                if (_this.mainSm.focusState().hasFocus &&
                    _this.mainSm.keyInput(_keyMap__WEBPACK_IMPORTED_MODULE_0__.Key.tab, (0,_keyMap__WEBPACK_IMPORTED_MODULE_0__.modifiersFromEvent)(event), true, event.repeat)) {
                    event.preventDefault();
                    return;
                }
                var forward = !event.shiftKey;
                var focusMoved = forward ? _this.mainSm.focusNext() : _this.mainSm.focusPrevious();
                var focusState = _this.mainSm.focusState();
                // focusMoved is false both at a Stop edge (focus stays put) and after walking off
                // the tree (focus cleared), so hasFocus discerns Stop edge from Rive releasing focus
                if (focusMoved || focusState.hasFocus) {
                    // A Rive node holds focus — keep trapping Tab inside Rive.
                    _this.focusSessionState = FocusSessionState.RiveFocused;
                    event.preventDefault();
                }
                else {
                    // No more traversable nodes — release Tab to the page.
                    if (document.activeElement !== _this.canvas &&
                        _this.isInFocusDomain(document.activeElement)) {
                        // The browser's default Tab starts from the focused element; from an overlay element,
                        // the nearest stop backward is the canvas itself. Start it from the
                        // canvas instead, so a Shift+Tab goes to the proper element before Rive.
                        _this.canvas.focus({ preventScroll: true });
                    }
                    _this.focusSessionState = FocusSessionState.NotFocused;
                    _this.focusDomainReleased = true;
                    _this.canvasHasFocus = false;
                }
                _this.syncOverlayListener();
                return;
            }
            // A semantic overlay widget (roving radio/tab group, slider, Enter/Space activation)
            // already acted on this key at its target, so don't act on it twice.
            if ((0,_semantics_claimedKeyEvents__WEBPACK_IMPORTED_MODULE_1__.isKeyEventClaimed)(event)) {
                _this.claimedKeyCodes.add(event.code);
                return;
            }
            // A new unclaimed press: drop any claim whose keyup never arrived.
            _this.claimedKeyCodes.delete(event.code);
            var fromProxy = _this.textInputSessionActive && _this.inputProxy.owns(event.target);
            var expectsKeyboardInput = _this.mainSm.focusState().expectsKeyboardInput;
            // The focused node gets first refusal (a TextInput's caret, or a keyboard listener
            // on that key). Keys with no Rive equivalent map to null and aren't dispatched.
            var key = (0,_keyMap__WEBPACK_IMPORTED_MODULE_0__.keyboardEventToRiveKey)(event);
            var consumed = key !== null &&
                _this.mainSm.keyInput(key, (0,_keyMap__WEBPACK_IMPORTED_MODULE_0__.modifiersFromEvent)(event), true, event.repeat);
            // An arrow key with no consumed key input moves focus spatially. While a Rive node holds focus,
            // arrows never scroll the page
            if (!consumed && key !== null && isArrowKey(key) && !hasShortcutModifier(event)) {
                consumed =
                    _this.focusInDirection(key) || _this.mainSm.focusState().hasFocus;
            }
            if (isPrintable(event)) {
                // During a session the printable must reach the proxy: its input event is the
                // (IME- and dead-key-correct) text source, and C++ inserts nothing from keyInput.
                if (fromProxy)
                    return;
                // Session live but focus elsewhere in Rive: refocus the proxy so the default inserts there.
                if (_this.textInputSessionActive && _this.isInFocusDomain(event.target)) {
                    _this.inputProxy.focus();
                    return;
                }
                if (!_this.textInputSessionActive && expectsKeyboardInput) {
                    _this.mainSm.textInput(event.key);
                }
            }
            // Rive consumed it, or an unmodified editing key while typing (would scroll/submit).
            var typing = fromProxy || expectsKeyboardInput;
            if (consumed ||
                (typing && !hasShortcutModifier(event) && EDITING_NAV_CODES.has(event.code))) {
                event.preventDefault();
            }
        };
        this.onKeyUp = function (event) {
            if (event.isComposing || event.keyCode === 229)
                return;
            if (_this.claimedKeyCodes.delete(event.code))
                return;
            if (_this.focusSessionState === FocusSessionState.NotFocused)
                return;
            var key = (0,_keyMap__WEBPACK_IMPORTED_MODULE_0__.keyboardEventToRiveKey)(event);
            if (key === null)
                return;
            _this.mainSm.keyInput(key, (0,_keyMap__WEBPACK_IMPORTED_MODULE_0__.modifiersFromEvent)(event), false, false);
        };
        this.canvas = canvas;
        this.mainSm = stateMachine;
        this.hasFocusNodes = hasFocusNodes;
        this.getOverlayElement = getOverlayElement;
        this.focusDomainHost = (_b = canvas.parentElement) !== null && _b !== void 0 ? _b : document;
        canvas.addEventListener("focus", this.onCanvasFocus);
        canvas.addEventListener("blur", this.onCanvasBlur);
        canvas.addEventListener("keydown", this.onKeyDown);
        canvas.addEventListener("keyup", this.onKeyUp);
        this.focusDomainHost.addEventListener("focusin", this.onFocusDomainHostFocusIn);
        this.syncOverlayListener();
        this.inputProxy = new _textInputProxy__WEBPACK_IMPORTED_MODULE_2__.TextInputProxy({
            container: (_c = canvas.parentElement) !== null && _c !== void 0 ? _c : document.body,
            canvas: canvas,
            textInput: function (text) { return _this.mainSm.textInput(text); },
            // Proxy keystrokes go through the same handlers as the canvas.
            onKeyDown: this.onKeyDown,
            onKeyUp: this.onKeyUp,
            onCopy: this.onCopy,
            onBlur: function (relatedTarget) { return _this.handleProxyBlur(relatedTarget); },
        });
    }
    KeyboardInteractions.prototype.isTextInputSessionActive = function () {
        return this.textInputSessionActive;
    };
    /** Session active and the proxy holds DOM focus. */
    KeyboardInteractions.prototype.isEditingHostFocused = function () {
        return this.textInputSessionActive && this.inputProxy.hasDomFocus();
    };
    /** @param focusProxy move DOM focus to the proxy; false leaves it where it is. */
    KeyboardInteractions.prototype.beginTextInputSession = function (focusProxy) {
        this.textInputSessionActive = true;
        this.focusSessionState = FocusSessionState.RiveFocused;
        if (focusProxy)
            this.inputProxy.focus();
    };
    /** @param fromBlur focus is already leaving; don't park it on the canvas. */
    KeyboardInteractions.prototype.endTextInputSession = function (fromBlur) {
        if (fromBlur === void 0) { fromBlur = false; }
        if (!this.textInputSessionActive)
            return;
        this.textInputSessionActive = false;
        this.inputProxy.endSession();
        if (fromBlur || !this.inputProxy.hasDomFocus())
            return;
        // Nothing took DOM focus from the proxy (e.g. semantics is off). Park it on the
        // canvas so keys keep reaching Rive; onCanvasFocus ignores focus from the input proxy.
        this.canvas.focus({ preventScroll: true });
    };
    /** Must run synchronously in the pointer gesture or mobile keyboards won't open. */
    KeyboardInteractions.prototype.summonForPointer = function () {
        if (this.textInputSessionActive)
            this.inputProxy.focus();
        else
            this.beginTextInputSession(true);
    };
    Object.defineProperty(KeyboardInteractions.prototype, "editingHost", {
        /** The text-input proxy, for the semantics layer to decorate while editing. */
        get: function () {
            return this.inputProxy;
        },
        enumerable: false,
        configurable: true
    });
    KeyboardInteractions.prototype.handleProxyBlur = function (relatedTarget) {
        // Teardown already in progress (endTextInputSession blurred the proxy).
        if (!this.textInputSessionActive)
            return;
        // Still in Rive or the document blurred: keep the session (pollFocusState tears down).
        if (this.blurStaysWithRive(relatedTarget))
            return;
        // Blurred out of Rive entirely: release C++ focus and end the session.
        this.mainSm.clearFocus();
        this.endTextInputSession(true);
        this.focusSessionState = FocusSessionState.NotFocused;
    };
    /**
     * Set the FocusSessionState. Useful for invoking a Rive "blur" without actually blurring from the <canvas>. This
     * helps put the DOM focus state on the canvas rather than the <body>, so the user doesn't lose the spot in page navigation
     *
     * @param state FocusSessionState enum
     */
    KeyboardInteractions.prototype.setFocusSessionState = function (state) {
        this.focusSessionState = state;
    };
    /**
     * Called by pollFocusState on the Rive instance when it observes hasFocus=true. Rive acquired
     * focus internally (e.g. via a listener action or state transition) without a DOM focus event,
     * so mark the session RiveFocused. This cannot resurrect a session that a DOM blur ended,
     * because onCanvasBlur clears Rive's focus alongside it.
     */
    KeyboardInteractions.prototype.notifyRiveFocused = function () {
        this.focusSessionState = FocusSessionState.RiveFocused;
    };
    /** Blur into the focus domain, or the whole document losing focus (tab/window switch). */
    KeyboardInteractions.prototype.blurStaysWithRive = function (relatedTarget) {
        return (this.isInFocusDomain(relatedTarget) ||
            (relatedTarget === null && !document.hasFocus()));
    };
    /** Arrow keys map to directional focus; anything else is not a focus move. */
    KeyboardInteractions.prototype.focusInDirection = function (key) {
        switch (key) {
            case _keyMap__WEBPACK_IMPORTED_MODULE_0__.Key.left:
                return this.mainSm.focusLeft();
            case _keyMap__WEBPACK_IMPORTED_MODULE_0__.Key.right:
                return this.mainSm.focusRight();
            case _keyMap__WEBPACK_IMPORTED_MODULE_0__.Key.up:
                return this.mainSm.focusUp();
            case _keyMap__WEBPACK_IMPORTED_MODULE_0__.Key.down:
                return this.mainSm.focusDown();
            default:
                return false;
        }
    };
    /**
     * Determine if Rive should handle keyboard input. If session state is `NotFocused` - no.
     * DOM focus stays parked on the canvas after Rive releases focus internally, and that Tab
     * has to reach the page rather than re-enter the tree.
     *
     * Otherwise, the event still has to belong to Rive:
     * 1. If the current DOM focus is in Rive domain (canvas or semantic overlay)
     * 2. If the target for the key input is for the semantic overlay, or the canvas
     */
    KeyboardInteractions.prototype.shouldRiveHandleKeyEvent = function (event) {
        if (this.focusSessionState === FocusSessionState.NotFocused)
            return false;
        var inFocusDomain = this.isInFocusDomain(document.activeElement) ||
            this.isInOverlay(event.target);
        var eventOnCanvas = event.target === this.canvas;
        return inFocusDomain || this.canvasHasFocus || eventOnCanvas;
    };
    /** DOM that counts as inside Rive for focus: canvas, overlay subtree, text-input proxy. */
    KeyboardInteractions.prototype.isInFocusDomain = function (target) {
        if (target === this.canvas)
            return true;
        if (this.inputProxy.owns(target))
            return true;
        return this.isInOverlay(target);
    };
    /** Overlay only (excludes the canvas) — the accessibility overlay subtree. */
    KeyboardInteractions.prototype.isInOverlay = function (target) {
        var _a, _b, _c;
        if (!(target instanceof Node))
            return false;
        return (_c = (_b = (_a = this.getOverlayElement) === null || _a === void 0 ? void 0 : _a.call(this)) === null || _b === void 0 ? void 0 : _b.contains(target)) !== null && _c !== void 0 ? _c : false;
    };
    KeyboardInteractions.prototype.syncOverlayListener = function () {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        var nextOverlayElement = (_b = (_a = this.getOverlayElement) === null || _a === void 0 ? void 0 : _a.call(this)) !== null && _b !== void 0 ? _b : null;
        if (nextOverlayElement === this.currentOverlayElement)
            return;
        (_c = this.currentOverlayElement) === null || _c === void 0 ? void 0 : _c.removeEventListener("focusin", this.onOverlayFocusIn);
        (_d = this.currentOverlayElement) === null || _d === void 0 ? void 0 : _d.removeEventListener("keydown", this.onKeyDown);
        (_e = this.currentOverlayElement) === null || _e === void 0 ? void 0 : _e.removeEventListener("keyup", this.onKeyUp);
        this.currentOverlayElement = nextOverlayElement;
        (_f = this.currentOverlayElement) === null || _f === void 0 ? void 0 : _f.addEventListener("focusin", this.onOverlayFocusIn);
        // Bubble phase, so a semantic widget's own key handler runs first and can claim
        // the key via claimKeyEvent (see onKeyDown).
        (_g = this.currentOverlayElement) === null || _g === void 0 ? void 0 : _g.addEventListener("keydown", this.onKeyDown);
        (_h = this.currentOverlayElement) === null || _h === void 0 ? void 0 : _h.addEventListener("keyup", this.onKeyUp);
    };
    /**
     * Whether the canvas currently matches :focus-visible — the browser's heuristic for keyboard-
     * (vs pointer-) driven focus. For older browser versions that don't support this selector, return false
     * so that we don't incorrectly assume pointer vs keyboard focus. Next tab would enter the focus tree in those edge cases.
     */
    KeyboardInteractions.prototype.isKeyboardDrivenFocus = function () {
        try {
            return this.canvas.matches(":focus-visible");
        }
        catch (_a) {
            return false;
        }
    };
    KeyboardInteractions.prototype.cameFromBeforeCanvas = function (from) {
        if (!from)
            return true;
        var position = this.canvas.compareDocumentPosition(from);
        if (position & Node.DOCUMENT_POSITION_PRECEDING)
            return true;
        if (position & Node.DOCUMENT_POSITION_FOLLOWING)
            return false;
        return true;
    };
    KeyboardInteractions.prototype.cleanup = function () {
        var _a, _b, _c;
        this.canvas.removeEventListener("focus", this.onCanvasFocus);
        this.canvas.removeEventListener("blur", this.onCanvasBlur);
        this.canvas.removeEventListener("keydown", this.onKeyDown);
        this.canvas.removeEventListener("keyup", this.onKeyUp);
        this.claimedKeyCodes.clear();
        this.focusDomainHost.removeEventListener("focusin", this.onFocusDomainHostFocusIn);
        (_a = this.currentOverlayElement) === null || _a === void 0 ? void 0 : _a.removeEventListener("focusin", this.onOverlayFocusIn);
        (_b = this.currentOverlayElement) === null || _b === void 0 ? void 0 : _b.removeEventListener("keydown", this.onKeyDown);
        (_c = this.currentOverlayElement) === null || _c === void 0 ? void 0 : _c.removeEventListener("keyup", this.onKeyUp);
        // Removing a focused element drops focus to <body> with no blur; park on the canvas.
        if (this.inputProxy.hasDomFocus()) {
            this.canvas.focus({ preventScroll: true });
        }
        this.inputProxy.cleanup();
        this.textInputSessionActive = false;
    };
    return KeyboardInteractions;
}());



/***/ }),
/* 15 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Key: () => (/* binding */ Key),
/* harmony export */   KeyModifiers: () => (/* binding */ KeyModifiers),
/* harmony export */   keyboardEventToRiveKey: () => (/* binding */ keyboardEventToRiveKey),
/* harmony export */   modifiersFromEvent: () => (/* binding */ modifiersFromEvent)
/* harmony export */ });
/*
 * Maps DOM keyboard events to the GLFW-style key codes and modifier bitmask
 * that StateMachineInstance.keyInput() expects. Values mirror `enum class Key`
 * and `enum class KeyModifiers` in rive-runtime focusable.hpp;
 * they are stable GLFW codes, so they live here as constants instead of an
 * embind enum.
 */
var __spreadArray = (undefined && undefined.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var Key = {
    space: 32,
    apostrophe: 39, // '
    comma: 44, // ,
    minus: 45, // -
    period: 46, // .
    slash: 47, // /
    key0: 48,
    key1: 49,
    key2: 50,
    key3: 51,
    key4: 52,
    key5: 53,
    key6: 54,
    key7: 55,
    key8: 56,
    key9: 57,
    semicolon: 59, // ;
    equal: 61, // =
    a: 65,
    b: 66,
    c: 67,
    d: 68,
    e: 69,
    f: 70,
    g: 71,
    h: 72,
    i: 73,
    j: 74,
    k: 75,
    l: 76,
    m: 77,
    n: 78,
    o: 79,
    p: 80,
    q: 81,
    r: 82,
    s: 83,
    t: 84,
    u: 85,
    v: 86,
    w: 87,
    x: 88,
    y: 89,
    z: 90,
    leftBracket: 91, // [
    backslash: 92, // \
    rightBracket: 93, // ]
    graveAccent: 96, // `
    world1: 161, // non-US #1
    world2: 162, // non-US #2
    escape: 256,
    enter: 257,
    tab: 258,
    backspace: 259,
    insert: 260,
    deleteKey: 261,
    right: 262,
    left: 263,
    down: 264,
    up: 265,
    pageUp: 266,
    pageDown: 267,
    home: 268,
    end: 269,
    capsLock: 280,
    scrollLock: 281,
    numLock: 282,
    printScreen: 283,
    pause: 284,
    f1: 290,
    f2: 291,
    f3: 292,
    f4: 293,
    f5: 294,
    f6: 295,
    f7: 296,
    f8: 297,
    f9: 298,
    f10: 299,
    f11: 300,
    f12: 301,
    f13: 302,
    f14: 303,
    f15: 304,
    f16: 305,
    f17: 306,
    f18: 307,
    f19: 308,
    f20: 309,
    f21: 310,
    f22: 311,
    f23: 312,
    f24: 313,
    f25: 314,
    kp0: 320,
    kp1: 321,
    kp2: 322,
    kp3: 323,
    kp4: 324,
    kp5: 325,
    kp6: 326,
    kp7: 327,
    kp8: 328,
    kp9: 329,
    kpDecimal: 330,
    kpDivide: 331,
    kpMultiply: 332,
    kpSubtract: 333,
    kpAdd: 334,
    kpEnter: 335,
    kpEqual: 336,
    leftShift: 340,
    leftControl: 341,
    leftAlt: 342,
    leftSuper: 343,
    rightShift: 344,
    rightControl: 345,
    rightAlt: 346,
    rightSuper: 347,
    menu: 348,
};
var KeyModifiers = {
    none: 0,
    shift: 1 << 0,
    ctrl: 1 << 1,
    alt: 1 << 2,
    meta: 1 << 3,
};
// Physical key (KeyboardEvent.code) to Rive key, by US-QWERTY position.
var CODE_TO_KEY = {
    // Modifiers are keys too (the editor sends them), and are also in the bitmask.
    ShiftLeft: Key.leftShift,
    ShiftRight: Key.rightShift,
    ControlLeft: Key.leftControl,
    ControlRight: Key.rightControl,
    AltLeft: Key.leftAlt,
    AltRight: Key.rightAlt,
    MetaLeft: Key.leftSuper,
    MetaRight: Key.rightSuper,
    KeyA: Key.a,
    KeyB: Key.b,
    KeyC: Key.c,
    KeyD: Key.d,
    KeyE: Key.e,
    KeyF: Key.f,
    KeyG: Key.g,
    KeyH: Key.h,
    KeyI: Key.i,
    KeyJ: Key.j,
    KeyK: Key.k,
    KeyL: Key.l,
    KeyM: Key.m,
    KeyN: Key.n,
    KeyO: Key.o,
    KeyP: Key.p,
    KeyQ: Key.q,
    KeyR: Key.r,
    KeyS: Key.s,
    KeyT: Key.t,
    KeyU: Key.u,
    KeyV: Key.v,
    KeyW: Key.w,
    KeyX: Key.x,
    KeyY: Key.y,
    KeyZ: Key.z,
    Digit0: Key.key0,
    Digit1: Key.key1,
    Digit2: Key.key2,
    Digit3: Key.key3,
    Digit4: Key.key4,
    Digit5: Key.key5,
    Digit6: Key.key6,
    Digit7: Key.key7,
    Digit8: Key.key8,
    Digit9: Key.key9,
    Numpad0: Key.kp0,
    Numpad1: Key.kp1,
    Numpad2: Key.kp2,
    Numpad3: Key.kp3,
    Numpad4: Key.kp4,
    Numpad5: Key.kp5,
    Numpad6: Key.kp6,
    Numpad7: Key.kp7,
    Numpad8: Key.kp8,
    Numpad9: Key.kp9,
    NumpadDecimal: Key.kpDecimal,
    NumpadDivide: Key.kpDivide,
    NumpadMultiply: Key.kpMultiply,
    NumpadSubtract: Key.kpSubtract,
    NumpadAdd: Key.kpAdd,
    NumpadEnter: Key.kpEnter,
    NumpadEqual: Key.kpEqual,
    Minus: Key.minus,
    Equal: Key.equal,
    BracketLeft: Key.leftBracket,
    BracketRight: Key.rightBracket,
    Backslash: Key.backslash,
    Semicolon: Key.semicolon,
    Quote: Key.apostrophe,
    Backquote: Key.graveAccent,
    Comma: Key.comma,
    Period: Key.period,
    Slash: Key.slash,
    IntlBackslash: Key.world1,
    IntlRo: Key.world2,
    Space: Key.space,
    Enter: Key.enter,
    Tab: Key.tab,
    Backspace: Key.backspace,
    Insert: Key.insert,
    Delete: Key.deleteKey,
    Escape: Key.escape,
    ArrowRight: Key.right,
    ArrowLeft: Key.left,
    ArrowDown: Key.down,
    ArrowUp: Key.up,
    PageUp: Key.pageUp,
    PageDown: Key.pageDown,
    Home: Key.home,
    End: Key.end,
    CapsLock: Key.capsLock,
    ScrollLock: Key.scrollLock,
    NumLock: Key.numLock,
    PrintScreen: Key.printScreen,
    Pause: Key.pause,
    ContextMenu: Key.menu,
    F1: Key.f1,
    F2: Key.f2,
    F3: Key.f3,
    F4: Key.f4,
    F5: Key.f5,
    F6: Key.f6,
    F7: Key.f7,
    F8: Key.f8,
    F9: Key.f9,
    F10: Key.f10,
    F11: Key.f11,
    F12: Key.f12,
    F13: Key.f13,
    F14: Key.f14,
    F15: Key.f15,
    F16: Key.f16,
    F17: Key.f17,
    F18: Key.f18,
    F19: Key.f19,
    F20: Key.f20,
    F21: Key.f21,
    F22: Key.f22,
    F23: Key.f23,
    F24: Key.f24,
    F25: Key.f25,
};
// Unshifted characters (event.key, lowercased) that name a Rive key.
var CHAR_TO_KEY = (function () {
    var map = {
        " ": Key.space,
        "'": Key.apostrophe,
        ",": Key.comma,
        "-": Key.minus,
        ".": Key.period,
        "/": Key.slash,
        ";": Key.semicolon,
        "=": Key.equal,
        "[": Key.leftBracket,
        "\\": Key.backslash,
        "]": Key.rightBracket,
        "`": Key.graveAccent,
    };
    for (var c = 0; c < 26; c++)
        map[String.fromCharCode(97 + c)] = Key.a + c;
    for (var d = 0; d <= 9; d++)
        map[String(d)] = Key.key0 + d;
    return map;
})();
// Non-printable event.key values; each shares its name with its code.
var NAMED_KEYS = new Set(__spreadArray([
    "Enter",
    "Tab",
    "Backspace",
    "Insert",
    "Delete",
    "Escape",
    "ArrowRight",
    "ArrowLeft",
    "ArrowDown",
    "ArrowUp",
    "PageUp",
    "PageDown",
    "Home",
    "End",
    "CapsLock",
    "ScrollLock",
    "NumLock",
    "PrintScreen",
    "Pause",
    "ContextMenu"
], Array.from({ length: 25 }, function (_, i) { return "F".concat(i + 1); }), true));
/**
 * Maps a KeyboardEvent to a Rive key, or null if Rive has no equivalent.
 *
 * Resolves the logical key: what the user's layout labels the key, ignoring
 * Shift, so a listener on "A" fires on AZERTY's A too. `event.key` is preferred;
 * `event.code` is the fallback when `key` isn't a plain unshifted character
 * (shifted symbols, Option/AltGr output, non-Latin letters, dead keys).
 * Digit-row and numpad keys skip the character lookup so AZERTY's digit row
 * still reports digits and numpad digits stay distinct from the digit row.
 */
function keyboardEventToRiveKey(event) {
    var _a, _b;
    var code = event.code, key = event.key;
    if (NAMED_KEYS.has(key)) {
        // NumpadEnter reports key "Enter"; keep it distinct.
        return code === "NumpadEnter" ? Key.kpEnter : (_a = CODE_TO_KEY[key]) !== null && _a !== void 0 ? _a : null;
    }
    if (!code.startsWith("Digit") && !code.startsWith("Numpad") && key) {
        var fromChar = CHAR_TO_KEY[key.toLowerCase()];
        if (fromChar !== undefined)
            return fromChar;
    }
    return (_b = CODE_TO_KEY[code]) !== null && _b !== void 0 ? _b : null;
}
function modifiersFromEvent(event) {
    var modifiers = KeyModifiers.none;
    if (event.shiftKey)
        modifiers |= KeyModifiers.shift;
    if (event.ctrlKey)
        modifiers |= KeyModifiers.ctrl;
    if (event.altKey)
        modifiers |= KeyModifiers.alt;
    if (event.metaKey)
        modifiers |= KeyModifiers.meta;
    return modifiers;
}


/***/ }),
/* 16 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TextInputProxy: () => (/* binding */ TextInputProxy)
/* harmony export */ });
/* harmony import */ var _canvasOffset__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);

// 16px: the smallest font size at which iOS Safari doesn't zoom on focus
var FONT_SIZE_PX = 16;
/** Capture-critical attributes decorate() must not touch. */
var PROTECTED_ATTRS = new Set([
    "type",
    "value",
    "style",
    "tabindex",
    "autocapitalize",
    "autocomplete",
    "autocorrect",
    "spellcheck",
]);
/**
 * Invisible per-instance <input> capturing IME/dead-key/paste text; focusable inside a
 * gesture to raise mobile keyboards. Always empty: C++ owns value and caret. Decorated
 * for AT only while it holds DOM focus.
 */
var TextInputProxy = /** @class */ (function () {
    function TextInputProxy(params) {
        var _this = this;
        // True between compositionstart/compositionend; we never commit mid-composition.
        this.composing = false;
        // Names set by decorate(), removed by resetDecoration().
        this.decoratedKeys = new Set();
        // Last written left/top, to skip no-op style writes.
        this.lastLeft = NaN;
        this.lastTop = NaN;
        /** Re-sync before input: the canvas may have scrolled since the session began. */
        this.reposition = function () { return _this.positionOverCanvas(); };
        this.onCompositionStart = function () {
            _this.composing = true;
        };
        this.onCompositionEnd = function () {
            _this.composing = false;
            // The composed text is now committed in element.value; forward it here. A
            // trailing `input` event (order varies by browser) then sees an empty field.
            _this.commit();
        };
        this.onInput = function () {
            if (_this.composing)
                return;
            _this.commit();
        };
        // An <input type=text> strips line breaks from its value, so forward the clipboard
        // text directly. Core's single-line fields strip them themselves.
        this.onPaste = function (event) {
            var _a;
            var text = (_a = event.clipboardData) === null || _a === void 0 ? void 0 : _a.getData("text/plain");
            if (!text)
                return;
            event.preventDefault();
            _this.params.textInput(text.replace(/\r\n?/g, "\n"));
        };
        this.onBlur = function (event) {
            _this.params.onBlur(event.relatedTarget);
        };
        this.params = params;
        this.element = this.createElement();
        this.positionOverCanvas();
        // Order vs. the overlay is unspecified; fine, Tab release starts from the canvas.
        this.params.container.appendChild(this.element);
    }
    // Registered first so it runs before the key handler inserts or moves the caret.
    TextInputProxy.prototype.listeners = function () {
        return [
            ["keydown", this.reposition],
            ["beforeinput", this.reposition],
            ["keydown", this.params.onKeyDown],
            ["keyup", this.params.onKeyUp],
            ["input", this.onInput],
            ["compositionstart", this.onCompositionStart],
            ["compositionend", this.onCompositionEnd],
            ["paste", this.onPaste],
            ["copy", this.params.onCopy],
            ["blur", this.onBlur],
        ];
    };
    TextInputProxy.prototype.createElement = function () {
        var el = document.createElement("input");
        el.type = "text";
        // Focusable but never in native tab order (Rive drives traversal synthetically),
        // and invisible without display:none (which would forbid focus).
        el.tabIndex = -1;
        el.setAttribute("aria-hidden", "true");
        // Always empty, so autocapitalize/autocorrect would misfire.
        el.setAttribute("autocapitalize", "off");
        el.setAttribute("autocomplete", "off");
        el.setAttribute("autocorrect", "off");
        el.spellcheck = false;
        // Over the canvas (not display:none) so iOS doesn't scroll-jump on keyboard open.
        // font-size must stay 16px or iOS Safari zooms on focus.
        el.style.cssText =
            "position:absolute;width:1px;height:1px;padding:0;margin:0;border:0;" +
                "outline:none;opacity:0;background:transparent;color:transparent;" +
                "caret-color:transparent;overflow:hidden;resize:none;z-index:0;" +
                // Focused programmatically only; must not swallow clicks
                "pointer-events:none;" +
                "font-size:".concat(FONT_SIZE_PX, "px;line-height:1;");
        for (var _i = 0, _a = this.listeners(); _i < _a.length; _i++) {
            var _b = _a[_i], type = _b[0], listener = _b[1];
            el.addEventListener(type, listener);
        }
        return el;
    };
    TextInputProxy.prototype.positionOverCanvas = function () {
        // Track the canvas (browsers scroll to the caret); clamp on-screen, one caret line box
        // (FONT_SIZE_PX) from the far edges, or the root scrolls to reveal it.
        var _a = (0,_canvasOffset__WEBPACK_IMPORTED_MODULE_0__.canvasOffset)(this.params.canvas), top = _a.top, left = _a.left;
        if (window.innerHeight > 0) {
            var r = this.params.canvas.getBoundingClientRect();
            top += clamp(r.top, 0, window.innerHeight - FONT_SIZE_PX) - r.top;
            left += clamp(r.left, 0, window.innerWidth - FONT_SIZE_PX) - r.left;
        }
        if (left !== this.lastLeft) {
            this.element.style.left = "".concat(left, "px");
            this.lastLeft = left;
        }
        if (top !== this.lastTop) {
            this.element.style.top = "".concat(top, "px");
            this.lastTop = top;
        }
    };
    /**
     * Forward the field's text to Rive and clear it.
     *
     * TODO: iOS won't autorepeat Backspace in an empty field (needs a text mirror).
     * */
    TextInputProxy.prototype.commit = function () {
        var text = this.element.value;
        if (!text)
            return;
        this.element.value = "";
        this.params.textInput(text);
    };
    /** Clear any transient value and decoration. Does not blur the element. */
    TextInputProxy.prototype.endSession = function () {
        this.element.value = "";
        // Browsers fire compositionend on blur, but a stuck flag would drop every
        // keystroke of the next session.
        this.composing = false;
        // Also covers blur-out, which bypasses the overlay.
        this.resetDecoration();
    };
    /** Must be called synchronously inside a gesture on iOS to raise the keyboard. */
    TextInputProxy.prototype.focus = function () {
        // Reposition first: iOS scrolls the focused input into view when the keyboard opens.
        this.positionOverCanvas();
        this.element.focus({ preventScroll: true });
    };
    TextInputProxy.prototype.hasDomFocus = function () {
        return document.activeElement === this.element;
    };
    TextInputProxy.prototype.owns = function (target) {
        return target === this.element;
    };
    /** See EditingHost.decorate. */
    TextInputProxy.prototype.decorate = function (attrs) {
        // aria-hidden outranks every attribute set below, so it must come off before this
        // element can stand in as the accessible element for the focused node.
        this.element.removeAttribute("aria-hidden");
        for (var _i = 0, _a = Object.entries(attrs); _i < _a.length; _i++) {
            var _b = _a[_i], name_1 = _b[0], value = _b[1];
            // Never override capture attrs.
            if (PROTECTED_ATTRS.has(name_1.toLowerCase()))
                continue;
            if (value === null) {
                this.element.removeAttribute(name_1);
                this.decoratedKeys.delete(name_1);
            }
            else {
                // Skip no-op writes: setting an attribute to the value it already has still
                // emits a mutation, and assistive tech is focused on this element mid-edit.
                if (this.element.getAttribute(name_1) !== value) {
                    this.element.setAttribute(name_1, value);
                }
                this.decoratedKeys.add(name_1);
            }
        }
    };
    /**
     * type=password for obscured fields so AT doesn't echo keys.
     * TODO: source "type" from Core, not semantics.
     */
    TextInputProxy.prototype.setSecure = function (secure) {
        var type = secure ? "password" : "text";
        if (this.element.type !== type)
            this.element.type = type;
    };
    /** Drop all decoration and return to the AT-invisible baseline. */
    TextInputProxy.prototype.resetDecoration = function () {
        var _this = this;
        this.setSecure(false);
        this.decoratedKeys.forEach(function (name) { return _this.element.removeAttribute(name); });
        this.decoratedKeys.clear();
        this.element.setAttribute("aria-hidden", "true");
    };
    TextInputProxy.prototype.cleanup = function () {
        for (var _i = 0, _a = this.listeners(); _i < _a.length; _i++) {
            var _b = _a[_i], type = _b[0], listener = _b[1];
            this.element.removeEventListener(type, listener);
        }
        this.element.remove();
    };
    return TextInputProxy;
}());

function clamp(v, min, max) {
    return Math.min(Math.max(v, min), Math.max(min, max));
}


/***/ }),
/* 17 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BLANK_URL: () => (/* binding */ BLANK_URL),
/* harmony export */   sanitizeUrl: () => (/* binding */ sanitizeUrl)
/* harmony export */ });
// Reference: https://github.com/braintree/sanitize-url/tree/main
var invalidProtocolRegex = /^([^\w]*)(javascript|data|vbscript)/im;
var htmlEntitiesRegex = /&#(\w+)(^\w|;)?/g;
var htmlCtrlEntityRegex = /&(newline|tab);/gi;
var ctrlCharactersRegex = /[\u0000-\u001F\u007F-\u009F\u2000-\u200D\uFEFF]/gim;
var urlSchemeRegex = /^.+(:|&colon;)/gim;
var relativeFirstCharacters = [".", "/"];
var BLANK_URL = "about:blank";
function isRelativeUrlWithoutProtocol(url) {
    return relativeFirstCharacters.indexOf(url[0]) > -1;
}
// adapted from https://stackoverflow.com/a/29824550/2601552
function decodeHtmlCharacters(str) {
    var removedNullByte = str.replace(ctrlCharactersRegex, "");
    return removedNullByte.replace(htmlEntitiesRegex, function (match, dec) {
        return String.fromCharCode(dec);
    });
}
function sanitizeUrl(url) {
    if (!url) {
        return BLANK_URL;
    }
    var sanitizedUrl = decodeHtmlCharacters(url)
        .replace(htmlCtrlEntityRegex, "")
        .replace(ctrlCharactersRegex, "")
        .trim();
    if (!sanitizedUrl) {
        return BLANK_URL;
    }
    if (isRelativeUrlWithoutProtocol(sanitizedUrl)) {
        return sanitizedUrl;
    }
    var urlSchemeParseResults = sanitizedUrl.match(urlSchemeRegex);
    if (!urlSchemeParseResults) {
        return sanitizedUrl;
    }
    var urlScheme = urlSchemeParseResults[0];
    if (invalidProtocolRegex.test(urlScheme)) {
        return BLANK_URL;
    }
    return sanitizedUrl;
}


/***/ }),
/* 18 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AudioAssetWrapper: () => (/* binding */ AudioAssetWrapper),
/* harmony export */   AudioWrapper: () => (/* binding */ AudioWrapper),
/* harmony export */   CustomFileAssetLoaderWrapper: () => (/* binding */ CustomFileAssetLoaderWrapper),
/* harmony export */   FileAssetWrapper: () => (/* binding */ FileAssetWrapper),
/* harmony export */   FileFinalizer: () => (/* binding */ FileFinalizer),
/* harmony export */   FontAssetWrapper: () => (/* binding */ FontAssetWrapper),
/* harmony export */   FontWrapper: () => (/* binding */ FontWrapper),
/* harmony export */   ImageAssetWrapper: () => (/* binding */ ImageAssetWrapper),
/* harmony export */   ImageWrapper: () => (/* binding */ ImageWrapper),
/* harmony export */   createFinalization: () => (/* binding */ createFinalization),
/* harmony export */   finalizationRegistry: () => (/* binding */ finalizationRegistry)
/* harmony export */ });
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var FileFinalizer = /** @class */ (function () {
    function FileFinalizer(file, session) {
        if (session === void 0) { session = null; }
        this.selfUnref = false;
        this._file = file;
        this._session = session;
    }
    FileFinalizer.prototype.unref = function () {
        if (this._file) {
            this._file.unref();
        }
        // After the file, never before: the file's resources belong to the session.
        if (this._session) {
            this._session.delete();
            this._session = null;
        }
    };
    // Disarms the GC path for a file cleanup() already released.
    FileFinalizer.prototype.release = function () {
        this._file = null;
        this._session = null;
    };
    return FileFinalizer;
}());
var ObjectFinalizer = /** @class */ (function () {
    function ObjectFinalizer(finalizableObject) {
        this._finalizableObject = finalizableObject;
    }
    ObjectFinalizer.prototype.unref = function () {
        this._finalizableObject.unref();
    };
    return ObjectFinalizer;
}());
var AssetWrapper = /** @class */ (function () {
    function AssetWrapper() {
        this.selfUnref = false;
    }
    AssetWrapper.prototype.unref = function () { };
    return AssetWrapper;
}());
var ImageWrapper = /** @class */ (function (_super) {
    __extends(ImageWrapper, _super);
    function ImageWrapper(image) {
        var _this = _super.call(this) || this;
        _this._nativeImage = image;
        return _this;
    }
    Object.defineProperty(ImageWrapper.prototype, "nativeImage", {
        get: function () {
            return this._nativeImage;
        },
        enumerable: false,
        configurable: true
    });
    ImageWrapper.prototype.unref = function () {
        if (this.selfUnref) {
            this._nativeImage.unref();
        }
    };
    return ImageWrapper;
}(AssetWrapper));
var AudioWrapper = /** @class */ (function (_super) {
    __extends(AudioWrapper, _super);
    function AudioWrapper(audio) {
        var _this = _super.call(this) || this;
        _this._nativeAudio = audio;
        return _this;
    }
    Object.defineProperty(AudioWrapper.prototype, "nativeAudio", {
        get: function () {
            return this._nativeAudio;
        },
        enumerable: false,
        configurable: true
    });
    AudioWrapper.prototype.unref = function () {
        if (this.selfUnref) {
            this._nativeAudio.unref();
        }
    };
    return AudioWrapper;
}(AssetWrapper));
var FontWrapper = /** @class */ (function (_super) {
    __extends(FontWrapper, _super);
    function FontWrapper(font) {
        var _this = _super.call(this) || this;
        _this._nativeFont = font;
        return _this;
    }
    Object.defineProperty(FontWrapper.prototype, "nativeFont", {
        get: function () {
            return this._nativeFont;
        },
        enumerable: false,
        configurable: true
    });
    FontWrapper.prototype.unref = function () {
        if (this.selfUnref) {
            this._nativeFont.unref();
        }
    };
    return FontWrapper;
}(AssetWrapper));
var CustomFileAssetLoaderWrapper = /** @class */ (function () {
    function CustomFileAssetLoaderWrapper(runtime, loaderCallback, session) {
        if (session === void 0) { session = null; }
        this._assetLoaderCallback = loaderCallback;
        this._session = session;
        this.assetLoader = new runtime.CustomFileAssetLoader({
            loadContents: this.loadContents.bind(this),
        });
    }
    CustomFileAssetLoaderWrapper.prototype.loadContents = function (asset, bytes) {
        var assetWrapper;
        if (asset.isImage) {
            assetWrapper = new ImageAssetWrapper(asset, this._session);
        }
        else if (asset.isAudio) {
            assetWrapper = new AudioAssetWrapper(asset, this._session);
        }
        else if (asset.isFont) {
            assetWrapper = new FontAssetWrapper(asset, this._session);
        }
        else {
            return false;
        }
        return this._assetLoaderCallback(assetWrapper, bytes);
    };
    return CustomFileAssetLoaderWrapper;
}());
/**
 * Rive class representing a FileAsset with relevant metadata fields to describe
 * an asset associated wtih the Rive File
 */
var FileAssetWrapper = /** @class */ (function () {
    function FileAssetWrapper(nativeAsset, session) {
        if (session === void 0) { session = null; }
        this._nativeFileAsset = nativeAsset;
        this._session = session;
    }
    FileAssetWrapper.prototype.decode = function (bytes) {
        // The session travels with the asset so a deferred file's assets are
        // session-typed without the caller needing to know the file's rendering mode.
        this._nativeFileAsset.decode(bytes, this._session);
    };
    Object.defineProperty(FileAssetWrapper.prototype, "name", {
        get: function () {
            return this._nativeFileAsset.name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FileAssetWrapper.prototype, "fileExtension", {
        get: function () {
            return this._nativeFileAsset.fileExtension;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FileAssetWrapper.prototype, "uniqueFilename", {
        get: function () {
            return this._nativeFileAsset.uniqueFilename;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FileAssetWrapper.prototype, "isAudio", {
        get: function () {
            return this._nativeFileAsset.isAudio;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FileAssetWrapper.prototype, "isImage", {
        get: function () {
            return this._nativeFileAsset.isImage;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FileAssetWrapper.prototype, "isFont", {
        get: function () {
            return this._nativeFileAsset.isFont;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FileAssetWrapper.prototype, "cdnUuid", {
        get: function () {
            return this._nativeFileAsset.cdnUuid;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FileAssetWrapper.prototype, "nativeFileAsset", {
        get: function () {
            return this._nativeFileAsset;
        },
        enumerable: false,
        configurable: true
    });
    return FileAssetWrapper;
}());
/**
 * Rive class extending the FileAsset that exposes a `setRenderImage()` API with a
 * decoded Image (via the `decodeImage()` API) to set a new Image on the Rive FileAsset
 */
var ImageAssetWrapper = /** @class */ (function (_super) {
    __extends(ImageAssetWrapper, _super);
    function ImageAssetWrapper() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ImageAssetWrapper.prototype.setRenderImage = function (image) {
        this._nativeFileAsset.setRenderImage(image.nativeImage);
    };
    return ImageAssetWrapper;
}(FileAssetWrapper));
/**
 * Rive class extending the FileAsset that exposes a `setAudioSource()` API with a
 * decoded Audio (via the `decodeAudio()` API) to set a new Audio on the Rive FileAsset
 */
var AudioAssetWrapper = /** @class */ (function (_super) {
    __extends(AudioAssetWrapper, _super);
    function AudioAssetWrapper() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AudioAssetWrapper.prototype.setAudioSource = function (audio) {
        this._nativeFileAsset.setAudioSource(audio.nativeAudio);
    };
    return AudioAssetWrapper;
}(FileAssetWrapper));
/**
 * Rive class extending the FileAsset that exposes a `setFont()` API with a
 * decoded Font (via the `decodeFont()` API) to set a new Font on the Rive FileAsset
 */
var FontAssetWrapper = /** @class */ (function (_super) {
    __extends(FontAssetWrapper, _super);
    function FontAssetWrapper() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FontAssetWrapper.prototype.setFont = function (font) {
        this._nativeFileAsset.setFont(font.nativeFont);
    };
    return FontAssetWrapper;
}(FileAssetWrapper));
var FakeFinalizationRegistry = /** @class */ (function () {
    function FakeFinalizationRegistry(_) {
    }
    FakeFinalizationRegistry.prototype.register = function (object) {
        object.selfUnref = true;
    };
    FakeFinalizationRegistry.prototype.unregister = function (_) { };
    return FakeFinalizationRegistry;
}());
var MyFinalizationRegistry = typeof FinalizationRegistry !== "undefined"
    ? FinalizationRegistry
    : FakeFinalizationRegistry;
var finalizationRegistry = new MyFinalizationRegistry(function (ob) {
    ob === null || ob === void 0 ? void 0 : ob.unref();
});
var createFinalization = function (target, finalizable) {
    var finalizer = new ObjectFinalizer(finalizable);
    finalizationRegistry.register(target, finalizer);
};



/***/ }),
/* 19 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RiveFont: () => (/* binding */ RiveFont)
/* harmony export */ });
/* harmony import */ var _runtimeLoader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);

// Class to manage fallback fonts for Rive.
var RiveFont = /** @class */ (function () {
    // Class is never instantiated
    function RiveFont() {
    }
    /**
     * Set a callback to dynamically set a list of fallback fonts based on the missing glyph and/or style of the default font.
     * Set null to clear the callback.
     * @param fontCallback Callback to set a list of fallback fonts.
     */
    RiveFont.setFallbackFontCallback = function (fontCallback) {
        RiveFont._fallbackFontCallback = fontCallback !== null && fontCallback !== void 0 ? fontCallback : null;
        RiveFont._wireFallbackProc();
    };
    // Get the pointer value to the Embind Font object from FontWrapper
    RiveFont._fontToPtr = function (fontWrapper) {
        var _a;
        if (fontWrapper == null)
            return null;
        var embindFont = fontWrapper.nativeFont;
        var ptr = (_a = embindFont === null || embindFont === void 0 ? void 0 : embindFont.ptr) === null || _a === void 0 ? void 0 : _a.call(embindFont);
        return ptr !== null && ptr !== void 0 ? ptr : null;
    };
    RiveFont._getFallbackPtr = function (fonts, index) {
        if (index < 0 || index >= fonts.length)
            return null;
        return RiveFont._fontToPtr(fonts[index]);
    };
    // Create the callback Rive expects to use for fallback fonts (regardless if set via a user-supplied static list, or callback)
    // 1. Ensure WASM is ready
    // 2. Bias for checking user callback over static list of fonts and pass it down to Rive to store as reference
    //    - When calling the user callback, check if we have any fonts left to check, and if not, return null to indicate there are no more fallbacks to try.
    //    - If the user callback returns an array of fonts, pass the pointer value to Rive of the font to try
    // 3. If no callback is provided, or the callback returns null, try the static list of fonts if they set any
    // 4. If no fallback method is set, return null.
    RiveFont._wireFallbackProc = function () {
        _runtimeLoader__WEBPACK_IMPORTED_MODULE_0__.RuntimeLoader.getInstance(function (rive) {
            var cb = RiveFont._fallbackFontCallback;
            if (cb) {
                rive.setFallbackFontCallback((function (missingGlyph, fallbackFontIndex, weight) {
                    var fontsReturned = cb(missingGlyph, weight);
                    if (fontsReturned) {
                        if (Array.isArray(fontsReturned)) {
                            return RiveFont._getFallbackPtr(fontsReturned, fallbackFontIndex);
                        }
                        // If the user callback only returns a single font, provide it to Rive the first time, otherwise if Rive
                        // calls back a second time, return null to indicate there are no more fallbacks to try.
                        return fallbackFontIndex === 0 ? RiveFont._fontToPtr(fontsReturned) : null;
                    }
                    return null;
                }));
            }
            else {
                rive.setFallbackFontCallback(null);
            }
        });
    };
    RiveFont._fallbackFontCallback = null;
    return RiveFont;
}());



/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Alignment: () => (/* binding */ Alignment),
/* harmony export */   DataEnum: () => (/* binding */ DataEnum),
/* harmony export */   DataType: () => (/* binding */ DataType),
/* harmony export */   DeprecationKeys: () => (/* binding */ DeprecationKeys),
/* harmony export */   DrawOptimizationOptions: () => (/* binding */ DrawOptimizationOptions),
/* harmony export */   EventType: () => (/* binding */ EventType),
/* harmony export */   Fit: () => (/* binding */ Fit),
/* harmony export */   Layout: () => (/* binding */ Layout),
/* harmony export */   LoopType: () => (/* binding */ LoopType),
/* harmony export */   Rive: () => (/* binding */ Rive),
/* harmony export */   RiveEventType: () => (/* binding */ RiveEventType),
/* harmony export */   RiveFile: () => (/* binding */ RiveFile),
/* harmony export */   RiveFont: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_3__.RiveFont),
/* harmony export */   RuntimeLoader: () => (/* reexport safe */ _runtimeLoader__WEBPACK_IMPORTED_MODULE_1__.RuntimeLoader),
/* harmony export */   SemanticMode: () => (/* reexport safe */ _semantics__WEBPACK_IMPORTED_MODULE_2__.SemanticMode),
/* harmony export */   StateMachineInput: () => (/* binding */ StateMachineInput),
/* harmony export */   StateMachineInputType: () => (/* binding */ StateMachineInputType),
/* harmony export */   Testing: () => (/* binding */ Testing),
/* harmony export */   ViewModel: () => (/* binding */ ViewModel),
/* harmony export */   ViewModelInstance: () => (/* binding */ ViewModelInstance),
/* harmony export */   ViewModelInstanceArtboard: () => (/* binding */ ViewModelInstanceArtboard),
/* harmony export */   ViewModelInstanceAssetFont: () => (/* binding */ ViewModelInstanceAssetFont),
/* harmony export */   ViewModelInstanceAssetImage: () => (/* binding */ ViewModelInstanceAssetImage),
/* harmony export */   ViewModelInstanceBoolean: () => (/* binding */ ViewModelInstanceBoolean),
/* harmony export */   ViewModelInstanceColor: () => (/* binding */ ViewModelInstanceColor),
/* harmony export */   ViewModelInstanceEnum: () => (/* binding */ ViewModelInstanceEnum),
/* harmony export */   ViewModelInstanceList: () => (/* binding */ ViewModelInstanceList),
/* harmony export */   ViewModelInstanceNumber: () => (/* binding */ ViewModelInstanceNumber),
/* harmony export */   ViewModelInstanceString: () => (/* binding */ ViewModelInstanceString),
/* harmony export */   ViewModelInstanceTrigger: () => (/* binding */ ViewModelInstanceTrigger),
/* harmony export */   ViewModelInstanceValue: () => (/* binding */ ViewModelInstanceValue),
/* harmony export */   decodeAudio: () => (/* binding */ decodeAudio),
/* harmony export */   decodeFont: () => (/* binding */ decodeFont),
/* harmony export */   decodeImage: () => (/* binding */ decodeImage)
/* harmony export */ });
/* harmony import */ var _animation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _runtimeLoader__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var _semantics__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(12);
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (undefined && undefined.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};




var RiveError = /** @class */ (function (_super) {
    __extends(RiveError, _super);
    function RiveError() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.isHandledError = true;
        return _this;
    }
    return RiveError;
}(Error));


// #regions helpers
var resolveErrorMessage = function (error) {
    return error && error.isHandledError
        ? error.message
        : "Problem loading file; may be corrupt!";
};
// #region layout
// Fit options for the canvas
var Fit;
(function (Fit) {
    Fit["Cover"] = "cover";
    Fit["Contain"] = "contain";
    Fit["Fill"] = "fill";
    Fit["FitWidth"] = "fitWidth";
    Fit["FitHeight"] = "fitHeight";
    Fit["None"] = "none";
    Fit["ScaleDown"] = "scaleDown";
    Fit["Layout"] = "layout";
})(Fit || (Fit = {}));
// Alignment options for the canvas
var Alignment;
(function (Alignment) {
    Alignment["Center"] = "center";
    Alignment["TopLeft"] = "topLeft";
    Alignment["TopCenter"] = "topCenter";
    Alignment["TopRight"] = "topRight";
    Alignment["CenterLeft"] = "centerLeft";
    Alignment["CenterRight"] = "centerRight";
    Alignment["BottomLeft"] = "bottomLeft";
    Alignment["BottomCenter"] = "bottomCenter";
    Alignment["BottomRight"] = "bottomRight";
})(Alignment || (Alignment = {}));
// Drawing optimization options
var DrawOptimizationOptions;
(function (DrawOptimizationOptions) {
    DrawOptimizationOptions["AlwaysDraw"] = "alwaysDraw";
    DrawOptimizationOptions["DrawOnChanged"] = "drawOnChanged";
})(DrawOptimizationOptions || (DrawOptimizationOptions = {}));
// Alignment options for Rive animations in a HTML canvas
var Layout = /** @class */ (function () {
    function Layout(params) {
        var _a, _b, _c, _d, _e, _f, _g;
        this.fit = (_a = params === null || params === void 0 ? void 0 : params.fit) !== null && _a !== void 0 ? _a : Fit.Contain;
        this.alignment = (_b = params === null || params === void 0 ? void 0 : params.alignment) !== null && _b !== void 0 ? _b : Alignment.Center;
        this.layoutScaleFactor = (_c = params === null || params === void 0 ? void 0 : params.layoutScaleFactor) !== null && _c !== void 0 ? _c : 1;
        this.minX = (_d = params === null || params === void 0 ? void 0 : params.minX) !== null && _d !== void 0 ? _d : 0;
        this.minY = (_e = params === null || params === void 0 ? void 0 : params.minY) !== null && _e !== void 0 ? _e : 0;
        this.maxX = (_f = params === null || params === void 0 ? void 0 : params.maxX) !== null && _f !== void 0 ? _f : 0;
        this.maxY = (_g = params === null || params === void 0 ? void 0 : params.maxY) !== null && _g !== void 0 ? _g : 0;
    }
    // Alternative constructor to build a Layout from an interface/object
    Layout.new = function (_a) {
        var fit = _a.fit, alignment = _a.alignment, minX = _a.minX, minY = _a.minY, maxX = _a.maxX, maxY = _a.maxY;
        warnOnce(DeprecationKeys.legacyConstructors, "This function is deprecated: please use `new Layout({})` instead");
        return new Layout({ fit: fit, alignment: alignment, minX: minX, minY: minY, maxX: maxX, maxY: maxY });
    };
    /**
     * Makes a copy of the layout, replacing any specified parameters
     */
    Layout.prototype.copyWith = function (_a) {
        var fit = _a.fit, alignment = _a.alignment, layoutScaleFactor = _a.layoutScaleFactor, minX = _a.minX, minY = _a.minY, maxX = _a.maxX, maxY = _a.maxY;
        return new Layout({
            fit: fit !== null && fit !== void 0 ? fit : this.fit,
            alignment: alignment !== null && alignment !== void 0 ? alignment : this.alignment,
            layoutScaleFactor: layoutScaleFactor !== null && layoutScaleFactor !== void 0 ? layoutScaleFactor : this.layoutScaleFactor,
            minX: minX !== null && minX !== void 0 ? minX : this.minX,
            minY: minY !== null && minY !== void 0 ? minY : this.minY,
            maxX: maxX !== null && maxX !== void 0 ? maxX : this.maxX,
            maxY: maxY !== null && maxY !== void 0 ? maxY : this.maxY,
        });
    };
    // Returns fit for the Wasm runtime format
    Layout.prototype.runtimeFit = function (rive) {
        if (this.cachedRuntimeFit)
            return this.cachedRuntimeFit;
        var fit;
        if (this.fit === Fit.Cover)
            fit = rive.Fit.cover;
        else if (this.fit === Fit.Contain)
            fit = rive.Fit.contain;
        else if (this.fit === Fit.Fill)
            fit = rive.Fit.fill;
        else if (this.fit === Fit.FitWidth)
            fit = rive.Fit.fitWidth;
        else if (this.fit === Fit.FitHeight)
            fit = rive.Fit.fitHeight;
        else if (this.fit === Fit.ScaleDown)
            fit = rive.Fit.scaleDown;
        else if (this.fit === Fit.Layout)
            fit = rive.Fit.layout;
        else
            fit = rive.Fit.none;
        this.cachedRuntimeFit = fit;
        return fit;
    };
    // Returns alignment for the Wasm runtime format
    Layout.prototype.runtimeAlignment = function (rive) {
        if (this.cachedRuntimeAlignment)
            return this.cachedRuntimeAlignment;
        var alignment;
        if (this.alignment === Alignment.TopLeft)
            alignment = rive.Alignment.topLeft;
        else if (this.alignment === Alignment.TopCenter)
            alignment = rive.Alignment.topCenter;
        else if (this.alignment === Alignment.TopRight)
            alignment = rive.Alignment.topRight;
        else if (this.alignment === Alignment.CenterLeft)
            alignment = rive.Alignment.centerLeft;
        else if (this.alignment === Alignment.CenterRight)
            alignment = rive.Alignment.centerRight;
        else if (this.alignment === Alignment.BottomLeft)
            alignment = rive.Alignment.bottomLeft;
        else if (this.alignment === Alignment.BottomCenter)
            alignment = rive.Alignment.bottomCenter;
        else if (this.alignment === Alignment.BottomRight)
            alignment = rive.Alignment.bottomRight;
        else
            alignment = rive.Alignment.center;
        this.cachedRuntimeAlignment = alignment;
        return alignment;
    };
    return Layout;
}());

// #endregion
// #region runtime

// #endregion
// #region state machines
/**
 * @deprecated State machine inputs are deprecated and will be removed in a
 * future major version: please use data binding properties instead. See
 * {@link https://rive.app/docs/editor/data-binding/migration-guide#state-machine-inputs}
 * for how to migrate.
 */
var StateMachineInputType;
(function (StateMachineInputType) {
    StateMachineInputType[StateMachineInputType["Number"] = 56] = "Number";
    StateMachineInputType[StateMachineInputType["Trigger"] = 58] = "Trigger";
    StateMachineInputType[StateMachineInputType["Boolean"] = 59] = "Boolean";
})(StateMachineInputType || (StateMachineInputType = {}));
/**
 * An input for a state machine
 * @deprecated State machine inputs are deprecated and will be removed in a
 * future major version: please use data binding properties instead. See
 * {@link https://rive.app/docs/editor/data-binding/migration-guide#state-machine-inputs}
 * for how to migrate.
 */
var StateMachineInput = /** @class */ (function () {
    function StateMachineInput(type, runtimeInput) {
        this.type = type;
        this.runtimeInput = runtimeInput;
    }
    Object.defineProperty(StateMachineInput.prototype, "name", {
        /**
         * Returns the name of the input
         */
        get: function () {
            return this.runtimeInput.name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StateMachineInput.prototype, "value", {
        /**
         * Returns the current value of the input
         */
        get: function () {
            return this.runtimeInput.value;
        },
        /**
         * Sets the value of the input
         */
        set: function (value) {
            this.runtimeInput.value = value;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Fires a trigger; does nothing on Number or Boolean input types
     */
    StateMachineInput.prototype.fire = function () {
        if (this.type === StateMachineInputType.Trigger) {
            this.runtimeInput.fire();
        }
    };
    /**
     * Deletes the input
     */
    StateMachineInput.prototype.delete = function () {
        this.runtimeInput = null;
    };
    return StateMachineInput;
}());

/**
 * @deprecated Subscribing to Rive Events at runtime is deprecated and will be removed in a future major
 * version: please use data binding instead. See
 * {@link https://rive.app/docs/runtimes/web/rive-events} for how to migrate.
 */
var RiveEventType;
(function (RiveEventType) {
    RiveEventType[RiveEventType["General"] = 128] = "General";
    RiveEventType[RiveEventType["OpenUrl"] = 131] = "OpenUrl";
})(RiveEventType || (RiveEventType = {}));
var BaseArtboard = /** @class */ (function () {
    function BaseArtboard(_isBindableArtboard) {
        this.isBindableArtboard = false;
        this.isBindableArtboard = _isBindableArtboard;
    }
    return BaseArtboard;
}());
var Artboard = /** @class */ (function (_super) {
    __extends(Artboard, _super);
    function Artboard(artboard, _file) {
        var _this = _super.call(this, false) || this;
        _this.nativeArtboard = artboard;
        _this.file = _file;
        return _this;
    }
    return Artboard;
}(BaseArtboard));
var BindableArtboard = /** @class */ (function (_super) {
    __extends(BindableArtboard, _super);
    function BindableArtboard(artboard) {
        var _this = _super.call(this, true) || this;
        _this.selfUnref = false;
        _this.nativeArtboard = artboard;
        return _this;
    }
    Object.defineProperty(BindableArtboard.prototype, "viewModel", {
        set: function (value) {
            this.nativeViewModel = value.nativeInstance;
        },
        enumerable: false,
        configurable: true
    });
    BindableArtboard.prototype.destroy = function () {
        var _a;
        if (this.selfUnref) {
            this.nativeArtboard.unref();
            (_a = this.nativeViewModel) === null || _a === void 0 ? void 0 : _a.unref();
        }
    };
    return BindableArtboard;
}(BaseArtboard));
var StateMachine = /** @class */ (function () {
    /**
     * @constructor
     * @param stateMachine runtime state machine object
     * @param instance runtime state machine instance object
     */
    function StateMachine(stateMachine, runtime, playing, artboard) {
        this.stateMachine = stateMachine;
        this.playing = playing;
        this.artboard = artboard;
        /**
         * Caches the inputs from the runtime
         */
        this.inputs = [];
        this.instance = new runtime.StateMachineInstance(stateMachine, artboard);
        this.initInputs(runtime);
    }
    Object.defineProperty(StateMachine.prototype, "hasFocusNodes", {
        /**
         * Whether this state machine has focus nodes
         */
        get: function () {
            return this.instance.hasFocusNodes();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StateMachine.prototype, "name", {
        get: function () {
            return this.stateMachine.name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StateMachine.prototype, "statesChanged", {
        /**
         * Returns a list of state names that have changed on this frame
         */
        get: function () {
            var names = [];
            for (var i = 0; i < this.instance.stateChangedCount(); i++) {
                names.push(this.instance.stateChangedNameByIndex(i));
            }
            return names;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Advances the state machine instance by a given time.
     * @param time - the time to advance the animation by in seconds
     */
    StateMachine.prototype.advance = function (time) {
        this.instance.advance(time);
    };
    /**
     * Advances the state machine instance by a given time and apply changes to artboard.
     * @param time - the time to advance the animation by in seconds
     */
    StateMachine.prototype.advanceAndApply = function (time) {
        this.instance.advanceAndApply(time);
    };
    /**
     * Enables semantic tree tracking for this state machine instance.
     */
    StateMachine.prototype.enableSemantics = function () {
        this.instance.enableSemantics();
    };
    /**
     * Returns the incremental semantic diff since the last call, or null
     * if semantics is not enabled or nothing changed.
     */
    StateMachine.prototype.drainSemanticsDiff = function () {
        return this.instance.drainSemanticsDiff();
    };
    /**
     * Fire a semantic action (tap, increase, decrease) on a node.
     * @param nodeId - The semantic node ID to target
     * @param actionType - 0 = tap, 1 = increase, 2 = decrease
     */
    StateMachine.prototype.fireSemanticAction = function (nodeId, actionType) {
        this.instance.fireSemanticAction(nodeId, actionType);
    };
    /**
     * When tools that enable accessible experiences traverse elements with focus,
     * we should call this method to focus the semantic node. It will also trigger
     * focus on any Focus listeners for this node
     * @param nodeId ID of the Semantic Node to focus
     * @returns boolean - True if focus was set, false otherwise
     */
    StateMachine.prototype.focusSemanticNode = function (nodeId) {
        return this.instance.focusSemanticNode(nodeId);
    };
    /**
     * Returns the number of events reported from the last advance call
     * @returns Number of events reported
     */
    StateMachine.prototype.reportedEventCount = function () {
        return this.instance.reportedEventCount();
    };
    /**
     * Returns a RiveEvent object emitted from the last advance call at the given index
     * of a list of potentially multiple events. If an event at the index is not found,
     * undefined is returned.
     * @param i index of the event reported in a list of potentially multiple events
     * @returns RiveEvent or extended RiveEvent object returned, or undefined
     */
    StateMachine.prototype.reportedEventAt = function (i) {
        return this.instance.reportedEventAt(i);
    };
    /**
     * Fetches references to the state machine's inputs and caches them
     * @param runtime an instance of the runtime; needed for the SMIInput types
     */
    StateMachine.prototype.initInputs = function (runtime) {
        // Fetch the inputs from the runtime if we don't have them
        for (var i = 0; i < this.instance.inputCount(); i++) {
            var input = this.instance.input(i);
            this.inputs.push(this.mapRuntimeInput(input, runtime));
        }
    };
    /**
     * Maps a runtime input to it's appropriate type
     * @param input
     */
    StateMachine.prototype.mapRuntimeInput = function (input, runtime) {
        if (input.type === runtime.SMIInput.bool) {
            return new StateMachineInput(StateMachineInputType.Boolean, input.asBool());
        }
        else if (input.type === runtime.SMIInput.number) {
            return new StateMachineInput(StateMachineInputType.Number, input.asNumber());
        }
        else if (input.type === runtime.SMIInput.trigger) {
            return new StateMachineInput(StateMachineInputType.Trigger, input.asTrigger());
        }
    };
    /**
     * Deletes the backing Wasm state machine instance; once this is called, this
     * state machine is no more.
     */
    StateMachine.prototype.cleanup = function () {
        this.inputs.forEach(function (input) {
            input.delete();
        });
        this.inputs.length = 0;
        this.instance.delete();
    };
    StateMachine.prototype.bindViewModelInstance = function (viewModelInstance) {
        if (viewModelInstance.runtimeInstance != null) {
            this.instance.bindViewModelInstance(viewModelInstance.runtimeInstance);
        }
    };
    /**
     * Get metadata about the state of focus if applicable for this state machine.
     * @returns FocusState - { hasFocus: boolean, expectsKeyboardInput: boolean }
     */
    StateMachine.prototype.focusState = function () {
        return this.instance.focusState();
    };
    /**
     * Clear focus from the Rive focus node tree.
     */
    StateMachine.prototype.clearFocus = function () {
        this.instance.clearFocus();
    };
    return StateMachine;
}());
// #endregion
// #region animator
/**
 * Manages animation
 */
var Animator = /** @class */ (function () {
    /**
     * Constructs a new animator
     * @constructor
     * @param runtime Rive runtime; needed to instance animations & state machines
     * @param artboard the artboard that holds all animations and state machines
     * @param animations optional list of animations
     * @param stateMachines optional list of state machines
     */
    function Animator(runtime, artboard, eventManager, animations, stateMachines) {
        if (animations === void 0) { animations = []; }
        if (stateMachines === void 0) { stateMachines = []; }
        this.runtime = runtime;
        this.artboard = artboard;
        this.eventManager = eventManager;
        this.animations = animations;
        this.stateMachines = stateMachines;
    }
    /**
     * Adds animations and state machines by their names. If names are shared
     * between animations & state machines, then the first one found will be
     * created. Best not to use the same names for these in your Rive file.
     * @param animatable the name(s) of animations and state machines to add
     * @returns a list of names of the playing animations and state machines
     */
    Animator.prototype.add = function (animatables, playing, fireEvent, semanticsActive) {
        if (fireEvent === void 0) { fireEvent = true; }
        if (semanticsActive === void 0) { semanticsActive = false; }
        animatables = mapToStringArray(animatables);
        // If animatables is empty, play or pause everything
        if (animatables.length === 0) {
            this.animations.forEach(function (a) { return (a.playing = playing); });
            this.stateMachines.forEach(function (m) { return (m.playing = playing); });
        }
        else {
            // Play/pause already instanced items, or create new instances
            var instancedAnimationNames = this.animations.map(function (a) { return a.name; });
            var instancedMachineNames = this.stateMachines.map(function (m) { return m.name; });
            for (var i = 0; i < animatables.length; i++) {
                var aIndex = instancedAnimationNames.indexOf(animatables[i]);
                var mIndex = instancedMachineNames.indexOf(animatables[i]);
                if (aIndex >= 0 || mIndex >= 0) {
                    if (aIndex >= 0) {
                        // Animation is instanced, play/pause it
                        this.animations[aIndex].playing = playing;
                    }
                    else {
                        // State machine is instanced, play/pause it
                        this.stateMachines[mIndex].playing = playing;
                    }
                }
                else {
                    // Try to create a new animation instance
                    var anim = this.artboard.animationByName(animatables[i]);
                    if (anim) {
                        var newAnimation = new _animation__WEBPACK_IMPORTED_MODULE_0__.Animation(anim, this.artboard, this.runtime, playing);
                        // Display the first frame of the specified animation
                        newAnimation.advance(0);
                        newAnimation.apply(1.0);
                        this.animations.push(newAnimation);
                    }
                    else {
                        // Try to create a new state machine instance
                        var sm = this.artboard.stateMachineByName(animatables[i]);
                        if (sm) {
                            var newStateMachine = new StateMachine(sm, this.runtime, playing, this.artboard);
                            if (semanticsActive) {
                                newStateMachine.enableSemantics();
                            }
                            this.stateMachines.push(newStateMachine);
                        }
                    }
                }
            }
        }
        // Fire play/paused events for animations
        if (fireEvent) {
            if (playing) {
                this.eventManager.fire({
                    type: EventType.Play,
                    data: this.playing,
                });
            }
            else {
                this.eventManager.fire({
                    type: EventType.Pause,
                    data: this.paused,
                });
            }
        }
        return playing ? this.playing : this.paused;
    };
    /**
     * Adds linear animations by their names.
     * @param animatables the name(s) of animations to add
     * @param playing whether animations should play on instantiation
     */
    Animator.prototype.initLinearAnimations = function (animatables, playing, isFallingBackFromStateMachines) {
        if (isFallingBackFromStateMachines === void 0) { isFallingBackFromStateMachines = false; }
        // Play/pause already instanced items, or create new instances
        // This validation is kept to maintain compatibility with current behavior.
        // But given that it this is called during artboard initialization
        // it should probably be safe to remove.
        var instancedAnimationNames = this.animations.map(function (a) { return a.name; });
        for (var i = 0; i < animatables.length; i++) {
            var aIndex = instancedAnimationNames.indexOf(animatables[i]);
            if (aIndex >= 0) {
                this.animations[aIndex].playing = playing;
            }
            else {
                // Try to create a new animation instance
                var anim = this.artboard.animationByName(animatables[i]);
                if (anim) {
                    var newAnimation = new _animation__WEBPACK_IMPORTED_MODULE_0__.Animation(anim, this.artboard, this.runtime, playing);
                    // Display the first frame of the specified animation
                    newAnimation.advance(0);
                    newAnimation.apply(1.0);
                    this.animations.push(newAnimation);
                }
                else if (isFallingBackFromStateMachines) { // Throw LoadError if we cannot load the state machine name at all
                    var smInitializationMessage = "State Machine with name ".concat(animatables[i], " not found");
                    throw new RiveError(smInitializationMessage);
                }
                else {
                    console.error("Animation with name ".concat(animatables[i], " not found."));
                }
            }
        }
    };
    /**
     * Adds state machines by their names.
     * @param animatables the name(s) of state machines to add
     * @param playing whether state machines should play on instantiation
     */
    Animator.prototype.initStateMachines = function (animatables, playing, semanticsActive) {
        // Play/pause already instanced items, or create new instances
        // This validation is kept to maintain compatibility with current behavior.
        // But given that it this is called during artboard initialization
        // it should probably be safe to remove.
        var instancedStateMachineNames = this.stateMachines.map(function (a) { return a.name; });
        for (var i = 0; i < animatables.length; i++) {
            var aIndex = instancedStateMachineNames.indexOf(animatables[i]);
            if (aIndex >= 0) {
                this.stateMachines[aIndex].playing = playing;
            }
            else {
                // Try to create a new state machine instance
                var sm = this.artboard.stateMachineByName(animatables[i]);
                if (sm) {
                    var newStateMachine = new StateMachine(sm, this.runtime, playing, this.artboard);
                    if (semanticsActive) {
                        newStateMachine.enableSemantics();
                    }
                    this.stateMachines.push(newStateMachine);
                }
                else {
                    console.warn("State Machine with name ".concat(animatables[i], " not found. Falling back to find an animation with the same name."));
                    // TODO: Remove this fallback in next major release as it complicates initialization.
                    // In order to maintain compatibility with current behavior, if a state machine is not found
                    // we look for an animation with the same name
                    this.initLinearAnimations([animatables[i]], playing, true);
                }
            }
        }
    };
    /**
     * Play the named animations/state machines
     * @param animatables the names of the animations/machines to play; plays all if empty
     * @returns a list of the playing items
     */
    Animator.prototype.play = function (animatables) {
        return this.add(animatables, true);
    };
    /**
     * Advance state machines if they are paused after initialization
     */
    Animator.prototype.advanceIfPaused = function () {
        this.stateMachines.forEach(function (sm) {
            if (!sm.playing) {
                sm.advanceAndApply(0);
            }
        });
    };
    /**
     * Pauses named animations and state machines, or everything if nothing is
     * specified
     * @param animatables names of the animations and state machines to pause
     * @returns a list of names of the animations and state machines paused
     */
    Animator.prototype.pause = function (animatables) {
        return this.add(animatables, false);
    };
    /**
     * Set time of named animations
     * @param animations names of the animations to scrub
     * @param value time scrub value, a floating point number to which the playhead is jumped
     * @returns a list of names of the animations that were scrubbed
     */
    Animator.prototype.scrub = function (animatables, value) {
        var forScrubbing = this.animations.filter(function (a) {
            return animatables.includes(a.name);
        });
        forScrubbing.forEach(function (a) { return (a.scrubTo = value); });
        return forScrubbing.map(function (a) { return a.name; });
    };
    Object.defineProperty(Animator.prototype, "playing", {
        /**
         * Returns a list of names of all animations and state machines currently
         * playing
         */
        get: function () {
            return this.animations
                .filter(function (a) { return a.playing; })
                .map(function (a) { return a.name; })
                .concat(this.stateMachines.filter(function (m) { return m.playing; }).map(function (m) { return m.name; }));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Animator.prototype, "paused", {
        /**
         * Returns a list of names of all animations and state machines currently
         * paused
         */
        get: function () {
            return this.animations
                .filter(function (a) { return !a.playing; })
                .map(function (a) { return a.name; })
                .concat(this.stateMachines.filter(function (m) { return !m.playing; }).map(function (m) { return m.name; }));
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Stops and removes all named animations and state machines
     * @param animatables animations and state machines to remove
     * @returns a list of names of removed items
     */
    Animator.prototype.stop = function (animatables) {
        var _this = this;
        animatables = mapToStringArray(animatables);
        // If nothing's specified, wipe them out, all of them
        var removedNames = [];
        // Stop everything
        if (animatables.length === 0) {
            removedNames = this.animations
                .map(function (a) { return a.name; })
                .concat(this.stateMachines.map(function (m) { return m.name; }));
            // Clean up before emptying the arrays
            this.animations.forEach(function (a) { return a.cleanup(); });
            this.stateMachines.forEach(function (m) { return m.cleanup(); });
            // Empty out the arrays
            this.animations.splice(0, this.animations.length);
            this.stateMachines.splice(0, this.stateMachines.length);
        }
        else {
            // Remove only the named animations/state machines
            var animationsToRemove = this.animations.filter(function (a) {
                return animatables.includes(a.name);
            });
            animationsToRemove.forEach(function (a) {
                a.cleanup();
                _this.animations.splice(_this.animations.indexOf(a), 1);
            });
            var machinesToRemove = this.stateMachines.filter(function (m) {
                return animatables.includes(m.name);
            });
            machinesToRemove.forEach(function (m) {
                m.cleanup();
                _this.stateMachines.splice(_this.stateMachines.indexOf(m), 1);
            });
            removedNames = animationsToRemove
                .map(function (a) { return a.name; })
                .concat(machinesToRemove.map(function (m) { return m.name; }));
        }
        this.eventManager.fire({
            type: EventType.Stop,
            data: removedNames,
        });
        // Return the list of animations removed
        return removedNames;
    };
    Object.defineProperty(Animator.prototype, "isPlaying", {
        /**
         * Returns true if at least one animation is active
         */
        get: function () {
            return (this.animations.reduce(function (acc, curr) { return acc || curr.playing; }, false) ||
                this.stateMachines.reduce(function (acc, curr) { return acc || curr.playing; }, false));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Animator.prototype, "isPaused", {
        /**
         * Returns true if all animations are paused and there's at least one animation
         */
        get: function () {
            return (!this.isPlaying &&
                (this.animations.length > 0 || this.stateMachines.length > 0));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Animator.prototype, "isStopped", {
        /**
         * Returns true if there are no playing or paused animations/state machines
         */
        get: function () {
            return this.animations.length === 0 && this.stateMachines.length === 0;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * If there are no animations or state machines, add the first one found
     * @returns the name of the animation or state machine instanced
     */
    Animator.prototype.atLeastOne = function (playing, fireEvent, semanticsActive) {
        if (fireEvent === void 0) { fireEvent = true; }
        if (semanticsActive === void 0) { semanticsActive = false; }
        var instancedName;
        if (this.animations.length === 0 && this.stateMachines.length === 0) {
            if (this.artboard.animationCount() > 0) {
                // Warn only when the v3 default would actually change what plays
                if (this.artboard.stateMachineCount() > 0) {
                    warnOnce(DeprecationKeys.defaultStateMachine, "No `stateMachine` was specified, so the artboard's first linear animation is playing by default. " +
                        "In the next major version, the artboard's state machine will be played by default instead when one exists. " +
                        "Pass the `stateMachine` parameter to adopt that behavior now.");
                }
                // Add the first animation
                this.add([(instancedName = this.artboard.animationByIndex(0).name)], playing, fireEvent);
            }
            else if (this.artboard.stateMachineCount() > 0) {
                // Add the first state machine
                this.add([(instancedName = this.artboard.stateMachineByIndex(0).name)], playing, fireEvent, semanticsActive);
            }
        }
        return instancedName;
    };
    /**
     * Checks if any animations have looped and if so, fire the appropriate event
     */
    Animator.prototype.handleLooping = function () {
        for (var _i = 0, _a = this.animations.filter(function (a) { return a.playing; }); _i < _a.length; _i++) {
            var animation = _a[_i];
            // Emit if the animation looped
            if (animation.loopValue === 0 && animation.loopCount) {
                animation.loopCount = 0;
                // This is a one-shot; if it has ended, delete the instance
                this.stop(animation.name);
            }
            else if (animation.loopValue === 1 && animation.loopCount) {
                this.eventManager.fire({
                    type: EventType.Loop,
                    data: { animation: animation.name, type: LoopType.Loop },
                });
                animation.loopCount = 0;
            }
            // Wasm indicates a loop at each time the animation
            // changes direction, so a full loop/lap occurs every
            // two loop counts
            else if (animation.loopValue === 2 && animation.loopCount > 1) {
                this.eventManager.fire({
                    type: EventType.Loop,
                    data: { animation: animation.name, type: LoopType.PingPong },
                });
                animation.loopCount = 0;
            }
        }
    };
    /**
     * Checks if states have changed in state machines and fires a statechange
     * event
     */
    Animator.prototype.handleStateChanges = function () {
        var statesChanged = [];
        for (var _i = 0, _a = this.stateMachines.filter(function (sm) { return sm.playing; }); _i < _a.length; _i++) {
            var stateMachine = _a[_i];
            statesChanged.push.apply(statesChanged, stateMachine.statesChanged);
        }
        if (statesChanged.length > 0) {
            this.eventManager.fire({
                type: EventType.StateChange,
                data: statesChanged,
            });
        }
    };
    Animator.prototype.handleAdvancing = function (time) {
        this.eventManager.fire({
            type: EventType.Advance,
            data: time,
        });
    };
    return Animator;
}());
// #endregion
// #region events
/**
 * Supported event types triggered in Rive
 */
var EventType;
(function (EventType) {
    EventType["Load"] = "load";
    EventType["LoadError"] = "loaderror";
    EventType["Play"] = "play";
    EventType["Pause"] = "pause";
    EventType["Stop"] = "stop";
    /**
     * @deprecated Loop events are deprecated and will be removed in a future
     * major version: they are only reported for linear animation playback, which
     * is deprecated. Use a state machine to control playback and data binding to
     * react to changes instead. See
     * {@link https://rive.app/docs/editor/data-binding/migration-guide} for how
     * to migrate.
     */
    EventType["Loop"] = "loop";
    EventType["Draw"] = "draw";
    EventType["Advance"] = "advance";
    /**
     * @deprecated Subscribing to state change events at runtime is deprecated
     * and will be removed in a future major version: use data binding (view model
     * property observers) or state machine actions to react to changes from your
     * graphic instead. See
     * {@link https://rive.app/docs/editor/state-machine/states#actions} for more details.
     */
    EventType["StateChange"] = "statechange";
    /**
     * @deprecated Subscribing to Rive Events at runtime is deprecated and will be removed in a future
     * major version: please use data binding instead. See
     * {@link https://rive.app/docs/runtimes/web/rive-events} for how to migrate.
     */
    EventType["RiveEvent"] = "riveevent";
    EventType["AudioStatusChange"] = "audiostatuschange";
})(EventType || (EventType = {}));
var riveEventsDeprecationWarning = "Subscribing to Rive Events at runtime is deprecated and will be removed in a future major version: " +
    "please use data binding instead. See " +
    "https://rive.app/docs/runtimes/web/rive-events for how to migrate.";
var stateMachineInputsDeprecationWarning = "State machine inputs are deprecated and will be removed in a future major version: " +
    "please use data binding properties instead. See " +
    "https://rive.app/docs/editor/data-binding/migration-guide#state-machine-inputs for how to migrate.";
var textRunsDeprecationWarning = "Text run APIs are deprecated and will be removed in a future major version: " +
    "please use data binding instead. See " +
    "https://rive.app/docs/editor/data-binding/migration-guide#updating-text-runs-at-runtime for how to migrate.";
var loopEventsDeprecationWarning = "Loop events are deprecated and will be removed in a future major version: " +
    "they are only reported for linear animation playback, which is deprecated. " +
    "Use a state machine to control playback and data binding to react to changes instead. See " +
    "https://rive.app/docs/editor/data-binding/migration-guide for how to migrate.";
var stateChangeEventsDeprecationWarning = "Subscribing to state change events at runtime is deprecated and will be removed in a future major version: " +
    "use data binding (view model property observers) or state machine actions to react to " +
    "changes from your graphic instead. See " +
    "https://rive.app/docs/editor/state-machine/states#actions for how to migrate.";
/**
 * The deprecations this runtime warns about. Each warning prints its own id, so
 * the value can be copied straight out of the console into
 * {@link Rive.suppressDeprecationWarnings}.
 */
var DeprecationKeys = {
    animationNames: "animation-names",
    animationsParam: "animations-param",
    defaultStateMachine: "default-state-machine",
    legacyConstructors: "legacy-constructors",
    legacyUnsubscribe: "legacy-unsubscribe",
    loopEvents: "loop-events",
    namesArray: "names-array",
    riveEvents: "rive-events",
    scrub: "scrub",
    stateChangeEvents: "state-change-events",
    stateMachineInputs: "state-machine-inputs",
    stateMachinesParam: "state-machines-param",
    textRuns: "text-runs",
};
// Derived from `DeprecationKeys`
var deprecationIds = new Set(Object.keys(DeprecationKeys).map(function (name) { return DeprecationKeys[name]; }));
// Deprecations that a consumer has opted out of. Kept at module scope so
// `warnOnce` can read it without referencing the `Rive` class
var suppressedDeprecations = new Set();
/** @internal Backing store for `Rive.suppressDeprecationWarnings`. */
var setSuppressedDeprecations = function (ids) {
    suppressedDeprecations.clear();
    if (!Array.isArray(ids)) {
        console.warn("[Rive] `suppressDeprecationWarnings` expects an array of deprecation ids, " +
            "received ".concat(typeof ids, ". Nothing was suppressed."));
        return;
    }
    for (var _i = 0, ids_1 = ids; _i < ids_1.length; _i++) {
        var id = ids_1[_i];
        if (deprecationIds.has(id)) {
            suppressedDeprecations.add(id);
        }
    }
};
// Deprecation warnings already emitted; each is logged at most once per page
// session to avoid flooding the console when many instances are created.
var emittedWarnings = new Set();
/**
 * Logs a deprecation warning at most once per page session, unless its id has
 * been passed to `Rive.suppressDeprecationWarnings`.
 */
var warnOnce = function (id, message) {
    if (suppressedDeprecations.has(id)) {
        return;
    }
    var key = "".concat(id, ":").concat(message);
    if (emittedWarnings.has(key)) {
        return;
    }
    emittedWarnings.add(key);
    console.warn("[Rive: ".concat(id, "] ").concat(message, "\n") +
        "To suppress this warning, set Rive.suppressDeprecationWarnings = [\"".concat(id, "\"]"));
};
/**
 * Warns that a playback-control method received an array of names; the next
 * major version restricts these parameters to a single string, since playing
 * multiple animations or state machines at once will not be supported.
 */
var warnIfNamesArray = function (names, methodName) {
    if (Array.isArray(names)) {
        warnOnce(DeprecationKeys.namesArray, "Passing an array of names to `".concat(methodName, "()` is deprecated: in the next major version this parameter will be a single string, and playing multiple animations or state machines at once will not be supported."));
    }
};
/**
 * Warns that a playback-control method received linear animation names;
 * name-based control remains supported for state machines only, so
 * user-specified linear animation names are going away in a future major
 * version.
 */
var warnDeprecatedAnimationNames = function (methodName) {
    warnOnce(DeprecationKeys.animationNames, "Passing linear animation names to `".concat(methodName, "()` is deprecated and will be removed in a future major version: ") +
        "Pass a single state machine name to control playback instead.");
};
/**
 * Looping types: one-shot, loop, and ping-pong
 * @deprecated Loop events are deprecated and will be removed in a future major
 * version: they are only reported for linear animation playback, which is
 * deprecated. Use a state machine to control playback and data binding to
 * react to changes instead.
 */
var LoopType;
(function (LoopType) {
    LoopType["OneShot"] = "oneshot";
    LoopType["Loop"] = "loop";
    LoopType["PingPong"] = "pingpong";
})(LoopType || (LoopType = {}));
// Manages Rive events and listeners
var EventManager = /** @class */ (function () {
    function EventManager(listeners) {
        if (listeners === void 0) { listeners = []; }
        this.listeners = listeners;
    }
    // Gets listeners of specified type
    EventManager.prototype.getListeners = function (type) {
        return this.listeners.filter(function (e) { return e.type === type; });
    };
    // Adds a listener
    EventManager.prototype.add = function (listener) {
        if (!this.listeners.includes(listener)) {
            this.listeners.push(listener);
        }
    };
    /**
     * Removes a listener
     * @param listener the listener with the callback to be removed
     */
    EventManager.prototype.remove = function (listener) {
        // We can't simply look for the listener as it'll be a different instance to
        // one originally subscribed. Find all the listeners of the right type and
        // then check their callbacks which should match.
        for (var i = 0; i < this.listeners.length; i++) {
            var currentListener = this.listeners[i];
            if (currentListener.type === listener.type) {
                if (currentListener.callback === listener.callback) {
                    this.listeners.splice(i, 1);
                    break;
                }
            }
        }
    };
    /**
     * Clears all listeners of specified type, or every listener if no type is
     * specified
     * @param type the type of listeners to clear, or all listeners if not
     * specified
     */
    EventManager.prototype.removeAll = function (type) {
        var _this = this;
        if (!type) {
            this.listeners.splice(0, this.listeners.length);
        }
        else {
            this.listeners
                .filter(function (l) { return l.type === type; })
                .forEach(function (l) { return _this.remove(l); });
        }
    };
    // Fires an event
    EventManager.prototype.fire = function (event) {
        var eventListeners = this.getListeners(event.type);
        eventListeners.forEach(function (listener) { return listener.callback(event); });
    };
    return EventManager;
}());
// Manages a queue of tasks
var TaskQueueManager = /** @class */ (function () {
    function TaskQueueManager(eventManager) {
        this.eventManager = eventManager;
        this.queue = [];
    }
    // Adds a task top the queue
    TaskQueueManager.prototype.add = function (task) {
        this.queue.push(task);
    };
    // Processes all tasks in the queue
    TaskQueueManager.prototype.process = function () {
        while (this.queue.length > 0) {
            var task = this.queue.shift();
            if (task === null || task === void 0 ? void 0 : task.action) {
                task.action();
            }
            if (task === null || task === void 0 ? void 0 : task.event) {
                this.eventManager.fire(task.event);
            }
        }
    };
    return TaskQueueManager;
}());
// #endregion
// #region Audio
var SystemAudioStatus;
(function (SystemAudioStatus) {
    SystemAudioStatus[SystemAudioStatus["AVAILABLE"] = 0] = "AVAILABLE";
    SystemAudioStatus[SystemAudioStatus["UNAVAILABLE"] = 1] = "UNAVAILABLE";
})(SystemAudioStatus || (SystemAudioStatus = {}));
// Class to handle audio context availability and status changes
var AudioManager = /** @class */ (function (_super) {
    __extends(AudioManager, _super);
    function AudioManager() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._started = false;
        _this._enabled = false;
        _this._status = SystemAudioStatus.UNAVAILABLE;
        return _this;
    }
    AudioManager.prototype.delay = function (time) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) { return setTimeout(resolve, time); })];
            });
        });
    };
    AudioManager.prototype.timeout = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (_, reject) { return setTimeout(reject, 50); })];
            });
        });
    };
    // Alerts animations on status changes and removes the listeners to avoid alerting twice.
    AudioManager.prototype.reportToListeners = function () {
        this.fire({ type: EventType.AudioStatusChange });
        this.removeAll();
    };
    /**
     * The audio context has been resolved.
     * Alert any listeners that we can now play audio.
     * Rive will now play audio at the configured volume.
     */
    AudioManager.prototype.enableAudio = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!this._enabled) {
                    this._enabled = true;
                    this._status = SystemAudioStatus.AVAILABLE;
                    this.reportToListeners();
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Check if we are able to play audio.
     *
     * We currently check the audio context, when resume() returns before a timeout we know that the
     * audio context is running and we can enable audio.
     */
    AudioManager.prototype.testAudio = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(this._status === SystemAudioStatus.UNAVAILABLE &&
                            this._audioContext !== null)) return [3 /*break*/, 4];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, Promise.race([this._audioContext.resume(), this.timeout()])];
                    case 2:
                        _b.sent();
                        this.enableAudio();
                        return [3 /*break*/, 4];
                    case 3:
                        _a = _b.sent();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Establish audio for use with rive.
     * We both test if we can use audio intermittently and listen for user interaction.
     * The aim is to enable audio playback as soon as the browser allows this.
     */
    AudioManager.prototype._establishAudio = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this._started) return [3 /*break*/, 5];
                        this._started = true;
                        if (!(typeof window == "undefined")) return [3 /*break*/, 1];
                        this.enableAudio();
                        return [3 /*break*/, 5];
                    case 1:
                        this._audioContext = new AudioContext();
                        this.listenForUserAction();
                        _a.label = 2;
                    case 2:
                        if (!(this._status === SystemAudioStatus.UNAVAILABLE)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.testAudio()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.delay(1000)];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    AudioManager.prototype.listenForUserAction = function () {
        var _this = this;
        // NOTE: AudioContexts are ready immediately if requested in a ui callback
        // we *could* re request one in this listener.
        var _clickListener = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // note this has "better" results than calling `await this.testAudio()`
                // as we force audio to be enabled in the current thread, rather than chancing
                // the thread to be passed over for some other async context
                this.enableAudio();
                return [2 /*return*/];
            });
        }); };
        // NOTE: we should test this on mobile/pads
        document.addEventListener("pointerdown", _clickListener, {
            once: true,
        });
    };
    /**
     * Establish the audio context for rive, this lets rive know that we can play audio.
     */
    AudioManager.prototype.establishAudio = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this._establishAudio();
                return [2 /*return*/];
            });
        });
    };
    Object.defineProperty(AudioManager.prototype, "systemVolume", {
        get: function () {
            if (this._status === SystemAudioStatus.UNAVAILABLE) {
                // We do an immediate test to avoid depending on the delay of the running test
                this.testAudio();
                return 0;
            }
            return 1;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AudioManager.prototype, "status", {
        get: function () {
            return this._status;
        },
        enumerable: false,
        configurable: true
    });
    return AudioManager;
}(EventManager));
var audioManager = new AudioManager();
var FakeResizeObserver = /** @class */ (function () {
    function FakeResizeObserver() {
    }
    FakeResizeObserver.prototype.observe = function () { };
    FakeResizeObserver.prototype.unobserve = function () { };
    FakeResizeObserver.prototype.disconnect = function () { };
    return FakeResizeObserver;
}());
var MyResizeObserver = globalThis.ResizeObserver || FakeResizeObserver;
/**
 * This class takes care of any observers that will be attached to an animation.
 * It should be treated as a singleton because observers are much more performant
 * when used for observing multiple elements by a single instance.
 */
var ObjectObservers = /** @class */ (function () {
    function ObjectObservers() {
        var _this = this;
        this._elementsMap = new Map();
        /**
         * Resize observers trigger both when the element changes its size and also when the
         * element is added or removed from the document.
         */
        this._onObservedEntry = function (entry) {
            var observed = _this._elementsMap.get(entry.target);
            if (observed !== null) {
                observed.onResize(entry.target.clientWidth == 0 || entry.target.clientHeight == 0);
            }
            else {
                _this._resizeObserver.unobserve(entry.target);
            }
        };
        this._onObserved = function (entries) {
            entries.forEach(_this._onObservedEntry);
        };
        this._resizeObserver = new MyResizeObserver(this._onObserved);
    }
    // Adds an observable element
    ObjectObservers.prototype.add = function (element, onResize) {
        var observed = {
            onResize: onResize,
            element: element,
        };
        this._elementsMap.set(element, observed);
        this._resizeObserver.observe(element);
        return observed;
    };
    // Removes an observable element
    ObjectObservers.prototype.remove = function (observed) {
        this._resizeObserver.unobserve(observed.element);
        this._elementsMap.delete(observed.element);
    };
    return ObjectObservers;
}());
var observers = new ObjectObservers();
// #endregion
// #region Rive
var nextRiveInstanceId = 0;
/**
 * Resolves which animation/state machine names playback should start with.
 * The `stateMachine` parameter takes priority; the deprecated plural
 * `animations`/`stateMachines` parameters apply only when it
 * is not provided.
 */
var resolveStartingPlayback = function (_a) {
    var stateMachine = _a.stateMachine, animations = _a.animations, stateMachines = _a.stateMachines;
    if (animations !== undefined) {
        warnOnce(DeprecationKeys.animationsParam, "The `animations` parameter is deprecated and will be removed in a future major version: please use the `stateMachine` parameter to play a state machine instead.");
    }
    if (stateMachines !== undefined) {
        warnOnce(DeprecationKeys.stateMachinesParam, "The `stateMachines` parameter is deprecated: please use `stateMachine` with a single state machine name instead.");
    }
    if (stateMachine) {
        return {
            startingAnimationNames: [],
            startingStateMachineNames: [stateMachine],
        };
    }
    return {
        startingAnimationNames: mapToStringArray(animations),
        startingStateMachineNames: mapToStringArray(stateMachines),
    };
};
var RiveFile = /** @class */ (function () {
    function RiveFile(params) {
        // Allow the runtime to automatically load assets hosted in Rive's runtime.
        this.enableRiveAssetCDN = true;
        // When true, emits performance.mark/measure entries during RiveFile load.
        this.enablePerfMarks = false;
        this.referenceCount = 0;
        this.destroyed = false;
        this.selfUnref = false;
        this.bindableArtboards = [];
        // Deferred rendering was requested; the session may still be null if this
        // build has no deferred support.
        this.deferred = false;
        // The session this file imported through, null when immediate. Owned here:
        // it has to outlive the file, so it is deleted after the file is released.
        this.session = null;
        // Attaching is once per session: a detached session can never replay again,
        // so a claimed file re-imports for the next instance implicitly. Mirrors the native
        // latch (WebGL2DeferredSession::everBound, C2DDeferredSession::claim).
        this._sessionClaimed = false;
        // Releasing this file has to be deterministic once a session owns its
        // resources, so the finalizer is disarmed rather than left to GC.
        this.fileFinalizer = null;
        this.boundElsewhereWarned = false;
        this.src = params.src;
        this.buffer = params.buffer;
        this.deferred = !!params.enableGPUCanvas;
        if (params.assetLoader)
            this.assetLoader = params.assetLoader;
        this.enableRiveAssetCDN =
            typeof params.enableRiveAssetCDN == "boolean"
                ? params.enableRiveAssetCDN
                : true;
        this.enablePerfMarks = !!params.enablePerfMarks;
        if (this.enablePerfMarks)
            _runtimeLoader__WEBPACK_IMPORTED_MODULE_1__.RuntimeLoader.enablePerfMarks = true;
        // New event management system
        this.eventManager = new EventManager();
        if (params.onLoad)
            this.on(EventType.Load, params.onLoad);
        if (params.onLoadError)
            this.on(EventType.LoadError, params.onLoadError);
    }
    RiveFile.prototype.releaseFile = function () {
        var _a, _b;
        // Release here rather than leaving it to the finalization registry. The
        // native file frees GL-backed resources when its last reference goes, and
        // callers reach this with the renderer's context current; a finalizer runs
        // with none, so those deletes would silently do nothing.
        (_a = this.fileFinalizer) === null || _a === void 0 ? void 0 : _a.release();
        (_b = this.file) === null || _b === void 0 ? void 0 : _b.unref();
        this.fileFinalizer = null;
        this.file = null;
    };
    RiveFile.prototype.releaseSession = function () {
        var _a;
        // Known limitation: cleanup() on a file an instance is still drawing
        // deletes the session under it. A RiveFile's creator holds no reference of
        // its own, so their cleanup() can take the count to zero.
        (_a = this.session) === null || _a === void 0 ? void 0 : _a.delete();
        this.session = null;
    };
    RiveFile.prototype.releaseBindableArtboards = function () {
        this.bindableArtboards.forEach(function (bindableArtboard) {
            return bindableArtboard.destroy();
        });
    };
    RiveFile.prototype.initData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, error_1, loader, loaderWrapper, _b, error_2, fileFinalizer;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!(this.src && !this.buffer)) return [3 /*break*/, 4];
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        _a = this;
                        return [4 /*yield*/, loadRiveFile(this.src)];
                    case 2:
                        _a.buffer = _c.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _c.sent();
                        if (error_1 instanceof Error) {
                            throw error_1;
                        }
                        throw new RiveError(RiveFile.fileLoadErrorMessage);
                    case 4:
                        if (this.destroyed) {
                            return [2 /*return*/];
                        }
                        if (this.deferred && this.session === null) {
                            this.session = RiveFile.makeDeferredSession(this.runtime);
                        }
                        if (this.assetLoader) {
                            loaderWrapper = new _utils__WEBPACK_IMPORTED_MODULE_3__.CustomFileAssetLoaderWrapper(this.runtime, this.assetLoader, this.session);
                            loader = loaderWrapper.assetLoader;
                        }
                        // Load the Rive file
                        if (this.enablePerfMarks)
                            performance.mark('rive:file-load:start');
                        _c.label = 5;
                    case 5:
                        _c.trys.push([5, 7, , 8]);
                        _b = this;
                        return [4 /*yield*/, this.runtime.load(new Uint8Array(this.buffer), loader, this.enableRiveAssetCDN, this.session)];
                    case 6:
                        _b.file = _c.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        error_2 = _c.sent();
                        // The finalizer that would reclaim the session is only registered once
                        // the import succeeds, so a failed load has to release it here.
                        this.releaseSession();
                        throw error_2;
                    case 8:
                        if (this.enablePerfMarks) {
                            performance.mark('rive:file-load:end');
                            performance.measure('rive:file-load', 'rive:file-load:start', 'rive:file-load:end');
                        }
                        if (this.destroyed) {
                            this.releaseFile();
                            this.releaseSession();
                            return [2 /*return*/];
                        }
                        if (this.file === null) {
                            // A malformed file resolves to null rather than rejecting. Release the
                            // session now: a finalizer for a file that does not exist would keep it
                            // alive until GC, or for as long as the caller holds the failed RiveFile.
                            this.releaseSession();
                            this.fireLoadError(RiveFile.fileLoadErrorMessage);
                            return [2 /*return*/];
                        }
                        fileFinalizer = new _utils__WEBPACK_IMPORTED_MODULE_3__.FileFinalizer(this.file, this.session);
                        this.fileFinalizer = fileFinalizer;
                        _utils__WEBPACK_IMPORTED_MODULE_3__.finalizationRegistry.register(this, fileFinalizer);
                        this.eventManager.fire({
                            type: EventType.Load,
                            data: this,
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    RiveFile.prototype.loadRiveFileBytes = function () {
        return __awaiter(this, void 0, void 0, function () {
            var bufferPromise;
            return __generator(this, function (_a) {
                if (this.enablePerfMarks)
                    performance.mark('rive:fetch-riv:start');
                bufferPromise = this.src
                    ? loadRiveFile(this.src)
                    : Promise.resolve(this.buffer);
                if (this.enablePerfMarks && this.src) {
                    bufferPromise.then(function () {
                        performance.mark('rive:fetch-riv:end');
                        performance.measure('rive:fetch-riv', 'rive:fetch-riv:start', 'rive:fetch-riv:end');
                    });
                }
                return [2 /*return*/, bufferPromise];
            });
        });
    };
    RiveFile.prototype.loadRuntime = function () {
        return __awaiter(this, void 0, void 0, function () {
            var runtimePromise;
            return __generator(this, function (_a) {
                if (this.enablePerfMarks)
                    performance.mark('rive:await-wasm:start');
                runtimePromise = _runtimeLoader__WEBPACK_IMPORTED_MODULE_1__.RuntimeLoader.awaitInstance();
                if (this.enablePerfMarks) {
                    runtimePromise.then(function () {
                        performance.mark('rive:await-wasm:end');
                        performance.measure('rive:await-wasm', 'rive:await-wasm:start', 'rive:await-wasm:end');
                    });
                }
                return [2 /*return*/, runtimePromise];
            });
        });
    };
    RiveFile.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, bufferResolved, runtimeResolved, error_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        // If no source file url specified, it's a bust
                        if (!this.src && !this.buffer) {
                            this.fireLoadError(RiveFile.missingErrorMessage);
                            return [2 /*return*/];
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, Promise.all([this.loadRiveFileBytes(), this.loadRuntime()])];
                    case 2:
                        _a = _b.sent(), bufferResolved = _a[0], runtimeResolved = _a[1];
                        if (this.destroyed) {
                            return [2 /*return*/];
                        }
                        // .riv file buffer and WASM runtime instance
                        this.buffer = bufferResolved;
                        this.runtime = runtimeResolved;
                        if (this.enablePerfMarks)
                            performance.mark('rive:init-data:start');
                        return [4 /*yield*/, this.initData()];
                    case 3:
                        _b.sent();
                        if (this.enablePerfMarks) {
                            performance.mark('rive:init-data:end');
                            performance.measure('rive:init-data', 'rive:init-data:start', 'rive:init-data:end');
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        error_3 = _b.sent();
                        this.fireLoadError(error_3 instanceof Error ? error_3.message : RiveFile.fileLoadErrorMessage);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    RiveFile.prototype.fireLoadError = function (message) {
        this.eventManager.fire({
            type: EventType.LoadError,
            data: message,
        });
        throw new RiveError(message);
    };
    /**
     * Subscribe to Rive-generated events
     * @param type the type of event to subscribe to
     * @param callback callback to fire when the event occurs
     */
    RiveFile.prototype.on = function (type, callback) {
        this.eventManager.add({
            type: type,
            callback: callback,
        });
    };
    /**
     * Unsubscribes from a Rive-generated event
     * @param type the type of event to unsubscribe from
     * @param callback the callback to unsubscribe
     */
    RiveFile.prototype.off = function (type, callback) {
        this.eventManager.remove({
            type: type,
            callback: callback,
        });
    };
    RiveFile.prototype.cleanup = function () {
        this.referenceCount -= 1;
        if (this.referenceCount <= 0) {
            this.removeAllRiveEventListeners();
            this.releaseFile();
            this.releaseBindableArtboards();
            // Everything imported through the session is gone; the session can go.
            this.releaseSession();
            this.destroyed = true;
        }
    };
    // Deferred is only compiled into some runtime builds, so feature detect it
    // and degrade to an immediate import rather than failing the load.
    RiveFile.makeDeferredSession = function (runtime) {
        var _a, _b;
        var session = (_b = (_a = runtime.makeDeferredSession) === null || _a === void 0 ? void 0 : _a.call(runtime)) !== null && _b !== void 0 ? _b : null;
        if (session === null && !RiveFile.deferredUnsupportedWarned) {
            RiveFile.deferredUnsupportedWarned = true;
            console.warn("Rive: `enableGPUCanvas: true` was ignored because this runtime build has no GPU Canvas support; importing in immediate mode. Use a @rive-app/webgl2 or @rive-app/canvas build with deferred rendering compiled in.");
        }
        return session;
    };
    Object.defineProperty(RiveFile.prototype, "deferredSession", {
        /**
         * @internal The deferred session this file imported through, or null if it
         * was imported in immediate mode.
         */
        get: function () {
            return this.session;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RiveFile.prototype, "deferredRequested", {
        /**
         * @internal Whether deferred was asked for, even when this build could not
         * honor it and imported immediate.
         */
        get: function () {
            return this.deferred;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RiveFile.prototype, "sessionClaimed", {
        /**
         * @internal Whether this file's session has ever been attached to a renderer.
         * Attaching is once per session, so a claimed file re-imports for the next
         * instance even after the renderer it was bound to is gone.
         */
        get: function () {
            return this._sessionClaimed;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * @internal Marks this file's session as spent. There is no matching release:
     * a session that has been attached can never replay for another renderer.
     */
    RiveFile.prototype.claimSession = function () {
        this._sessionClaimed = true;
    };
    /**
     * @internal One warning per file however many instances collide on it.
     */
    RiveFile.prototype.warnBoundElsewhereOnce = function () {
        if (this.boundElsewhereWarned) {
            return;
        }
        this.boundElsewhereWarned = true;
        console.warn("Rive: this deferred RiveFile is already bound to another Rive instance's canvas, and a deferred session cannot span canvases. Re-importing the file for this instance (an extra parse of the retained buffer, no extra network request).");
    };
    /**
     * @internal Re-imports this file from its retained buffer into a mode of its
     * own. The copy is owned by whoever asked for it and never joins this file's
     * reference count.
     */
    RiveFile.prototype.reimport = function (deferred) {
        return __awaiter(this, void 0, void 0, function () {
            var copy;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        copy = new RiveFile({
                            buffer: this.buffer,
                            assetLoader: this.assetLoader,
                            enableRiveAssetCDN: this.enableRiveAssetCDN,
                            enablePerfMarks: this.enablePerfMarks,
                            enableGPUCanvas: deferred,
                        });
                        return [4 /*yield*/, copy.init()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, copy];
                }
            });
        });
    };
    /**
     * Unsubscribes all Rive listeners from an event type, or everything if no type is
     * given
     * @param type the type of event to unsubscribe from, or all types if
     * undefined
     */
    RiveFile.prototype.removeAllRiveEventListeners = function (type) {
        this.eventManager.removeAll(type);
    };
    RiveFile.prototype.getInstance = function () {
        if (this.file !== null) {
            this.referenceCount += 1;
            return this.file;
        }
    };
    RiveFile.prototype.destroyIfUnused = function () {
        if (this.referenceCount <= 0) {
            this.cleanup();
        }
    };
    RiveFile.prototype.createBindableArtboard = function (nativeBindableArtboard) {
        if (nativeBindableArtboard != null) {
            var bindableArtboard = new BindableArtboard(nativeBindableArtboard);
            (0,_utils__WEBPACK_IMPORTED_MODULE_3__.createFinalization)(bindableArtboard, bindableArtboard.nativeArtboard);
            this.bindableArtboards.push(bindableArtboard);
            return bindableArtboard;
        }
        return null;
    };
    /**
     * @deprecated This function is deprecated. For better stability and memory management
     * use `getBindableArtboard()` instead.
     * @param {string} name - The name of the artboard.
     * @returns {Artboard} The artboard to bind to.
     */
    RiveFile.prototype.getArtboard = function (name) {
        var nativeArtboard = this.file.artboardByName(name);
        if (nativeArtboard != null) {
            return new Artboard(nativeArtboard, this);
        }
    };
    RiveFile.prototype.getBindableArtboard = function (name) {
        var nativeArtboard = this.file.bindableArtboardByName(name);
        return this.createBindableArtboard(nativeArtboard);
    };
    RiveFile.prototype.getDefaultBindableArtboard = function () {
        var nativeArtboard = this.file.bindableArtboardDefault();
        return this.createBindableArtboard(nativeArtboard);
    };
    RiveFile.prototype.internalBindableArtboardFromArtboard = function (artboard) {
        var nativeBindableArtboard = this.file.internalBindableArtboardFromArtboard(artboard);
        return this.createBindableArtboard(nativeBindableArtboard);
    };
    RiveFile.prototype.viewModelByName = function (name) {
        var viewModel = this.file.viewModelByName(name);
        if (viewModel !== null) {
            return new ViewModel(viewModel);
        }
        return null;
    };
    /**
     * @returns the names of the file's global view models, in file order.
     */
    RiveFile.prototype.globalViewModelNames = function () {
        return this.file.globalViewModelNames();
    };
    // Error message for missing source or buffer
    RiveFile.missingErrorMessage = "Rive source file or data buffer required";
    // Error message for file load error
    RiveFile.fileLoadErrorMessage = "The file failed to load";
    // Deferred support is per build, so the warning is per page, not per file.
    RiveFile.deferredUnsupportedWarned = false;
    return RiveFile;
}());

var Rive = /** @class */ (function () {
    function Rive(params) {
        var _this = this;
        var _a, _b, _c, _d;
        // Tracks if a Rive file is loaded
        this.loaded = false;
        // Tracks if a Rive file is destroyed
        this.destroyed = false;
        // Reference of an object that handles any observers for the animation
        this._observed = null;
        /**
         * Tracks if a Rive file is loaded; we need this in addition to loaded as some
         * commands (e.g. contents) can be called as soon as the file is loaded.
         * However, playback commands need to be queued and run in order once initial
         * animations and autoplay has been sorted out. This applies to play, pause,
         * and start.
         */
        this.readyForPlaying = false;
        // Deferred rendering was requested for this instance. The file it renders
        // has the final say, since a file's mode is fixed at import.
        this.deferredRenderer = false;
        // Whether this instance imported the file in `riveFile` (true) or the caller
        // supplied it (false). Only a file we imported may be released without a
        // matching getInstance(): a caller's file is theirs however this init ends.
        this.ownsRiveFile = false;
        // Runtime artboard
        this.artboard = null;
        // place to clear up pointer/touch event listeners
        this.eventCleanup = null;
        // Manages keyboard and DOM-focus interactions for the canvas.
        this._keyboardInteractions = null;
        this.shouldDisableRiveListeners = false;
        this.automaticallyHandleEvents = false;
        this.dispatchPointerExit = true;
        // Allow all pointers to be passed to the runtime
        this.enableMultiTouch = false;
        // Allow the runtime to automatically load assets hosted in Rive's runtime.
        this.enableRiveAssetCDN = true;
        this.semanticsMode = _semantics__WEBPACK_IMPORTED_MODULE_2__.SemanticMode.Disabled;
        this.semanticsOptions = {
            riveCanvasLabel: "Rive animation",
        };
        /** True when this instance may drain semantics and render the overlay. */
        this._semanticsActive = false;
        // Keep a local value of the set volume to update it asynchronously
        this._volume = 1;
        // Keep a local value of the set width to update it asynchronously
        this._artboardWidth = undefined;
        // Keep a local value of the set height to update it asynchronously
        this._artboardHeight = undefined;
        // Keep a local value of the device pixel ratio used in rendering and canvas/artboard resizing
        this._devicePixelRatioUsed = 1;
        // Whether the canvas element's size is 0
        this._hasZeroSize = false;
        // Whether a draw operation needs to be forced
        this._needsRedraw = false;
        // Canvas width and height. Values are lazily updated so they might
        // not be in sync with current canvas size.
        this._currentCanvasWidth = 0;
        this._currentCanvasHeight = 0;
        // Audio event listener
        this._audioEventListener = null;
        // draw method bound to the class
        this._boundDraw = null;
        // Page visibility handler — prevents state machine advancing / rAF from being invoked with large time delta
        // when the browser tab is switched back to after being hidden.
        this._pageVisibilityHandler = null;
        // True only when the page visibility handler itself cancelled an active frame.
        // Set by stopRendering(), cleared by startRendering(). Prevents the
        // visibilitychange handler from restarting a rendering loop the caller intentionally stopped.
        this._explicitlyStoppedRendering = false;
        this._viewModelInstance = null;
        // User-provided global view model instances, keyed by their global view
        // model's name. Globals not present here are still driven by the default
        // instances the runtime seeds; the getter only surfaces instances the user
        // has explicitly set.
        this._globalViewModelInstances = new Map();
        this._dataEnums = null;
        this._tabIndex = null;
        this._prevHasFocus = false;
        this._prevWantsTextInputSession = false;
        // Pointer-down defers the proxy focus: mousedown's default would refocus the canvas and
        // touchstart isn't user activation; pointer-up focuses it.
        this._inPointerDownDrain = false;
        this._focusOptions = {
            allowFocusInterrupt: false,
        };
        // Tracks the semantic tree for the given graphic
        this._semanticTree = null;
        this._accessibilityOverlay = null;
        /**
         * True when an input to the accessibility overlay's artboard→canvas transform
         * (layout fit/alignment/bounds, devicePixelRatio, or layout scale) has changed
         * and the matrix must be recomputed on the next overlay update. Avoids calling
         * computeAlignment every frame when only the semantic tree changed.
         */
        this._overlayTransformDirty = true;
        // Module-level counter for unique instance IDs for semantic overlay containers
        this._instanceId = "".concat(nextRiveInstanceId++);
        this.drawOptimization = DrawOptimizationOptions.DrawOnChanged;
        // When true, emits performance.mark/measure entries for load and render.
        this.enablePerfMarks = false;
        // Durations to generate a frame for the last second. Used for performance profiling.
        this.durations = [];
        this.frameTimes = [];
        this.frameCount = 0;
        this.isTouchScrollEnabled = false;
        this.onCanvasResize = function (hasZeroSize) {
            var toggledDisplay = _this._hasZeroSize !== hasZeroSize;
            _this._hasZeroSize = hasZeroSize;
            if (!hasZeroSize) {
                if (toggledDisplay) {
                    _this.resizeDrawingSurfaceToCanvas();
                }
            }
            else if (!_this._layout.maxX || !_this._layout.maxY) {
                _this.resizeToCanvas();
            }
        };
        this.isEditingHostFocused = function () { var _a, _b; return (_b = (_a = _this._keyboardInteractions) === null || _a === void 0 ? void 0 : _a.isEditingHostFocused()) !== null && _b !== void 0 ? _b : false; };
        // Tracks the current animation frame request
        this.frameRequestId = null;
        /**
         * Used be draw to track when a second of active rendering time has passed.
         * Used for debugging purposes
         */
        this.renderSecondTimer = 0;
        this._boundDraw = this.draw.bind(this);
        if (typeof document !== 'undefined') {
            this._pageVisibilityHandler = this._onPageVisibilityChange.bind(this);
            document.addEventListener('visibilitychange', this._pageVisibilityHandler);
        }
        this.canvas = params.canvas;
        if (params.canvas.constructor === HTMLCanvasElement) {
            this._observed = observers.add(this.canvas, this.onCanvasResize);
        }
        this._currentCanvasWidth = this.canvas.width;
        this._currentCanvasHeight = this.canvas.height;
        this.src = params.src;
        this.buffer = params.buffer;
        this.riveFile = params.riveFile;
        this.layout = (_a = params.layout) !== null && _a !== void 0 ? _a : new Layout();
        this.shouldDisableRiveListeners = !!params.shouldDisableRiveListeners;
        this.isTouchScrollEnabled = !!params.isTouchScrollEnabled;
        if (params.automaticallyHandleEvents) {
            warnOnce(DeprecationKeys.riveEvents, "The `automaticallyHandleEvents` parameter is deprecated. " +
                riveEventsDeprecationWarning);
        }
        this.automaticallyHandleEvents = !!params.automaticallyHandleEvents;
        this.dispatchPointerExit =
            params.dispatchPointerExit === false
                ? params.dispatchPointerExit
                : this.dispatchPointerExit;
        this.enableMultiTouch = !!params.enableMultiTouch;
        this.drawOptimization = (_b = params.drawingOptions) !== null && _b !== void 0 ? _b : this.drawOptimization;
        this.enableRiveAssetCDN =
            params.enableRiveAssetCDN === undefined
                ? true
                : params.enableRiveAssetCDN;
        this.enablePerfMarks = !!params.enablePerfMarks;
        if (this.enablePerfMarks)
            _runtimeLoader__WEBPACK_IMPORTED_MODULE_1__.RuntimeLoader.enablePerfMarks = true;
        this._focusOptions = (_c = params.focusOptions) !== null && _c !== void 0 ? _c : this._focusOptions;
        this._tabIndex = (_d = params.tabIndex) !== null && _d !== void 0 ? _d : null;
        this.deferredRenderer = !!params.enableGPUCanvas;
        // New event management system
        this.eventManager = new EventManager();
        if (params.onLoad)
            this.on(EventType.Load, params.onLoad);
        if (params.onLoadError)
            this.on(EventType.LoadError, params.onLoadError);
        if (params.onPlay)
            this.on(EventType.Play, params.onPlay);
        if (params.onPause)
            this.on(EventType.Pause, params.onPause);
        if (params.onStop)
            this.on(EventType.Stop, params.onStop);
        if (params.onLoop)
            this.on(EventType.Loop, params.onLoop);
        if (params.onStateChange)
            this.on(EventType.StateChange, params.onStateChange);
        if (params.onAdvance)
            this.on(EventType.Advance, params.onAdvance);
        /**
         * @deprecated Use camelCase'd versions instead.
         */
        if (params.onload && !params.onLoad)
            this.on(EventType.Load, params.onload);
        if (params.onloaderror && !params.onLoadError)
            this.on(EventType.LoadError, params.onloaderror);
        if (params.onplay && !params.onPlay)
            this.on(EventType.Play, params.onplay);
        if (params.onpause && !params.onPause)
            this.on(EventType.Pause, params.onpause);
        if (params.onstop && !params.onStop)
            this.on(EventType.Stop, params.onstop);
        if (params.onloop && !params.onLoop)
            this.on(EventType.Loop, params.onloop);
        if (params.onstatechange && !params.onStateChange)
            this.on(EventType.StateChange, params.onstatechange);
        /**
         * Asset loading
         */
        if (params.assetLoader)
            this.assetLoader = params.assetLoader;
        // Hook up the task queue
        this.taskQueue = new TaskQueueManager(this.eventManager);
        this.init({
            src: this.src,
            buffer: this.buffer,
            riveFile: this.riveFile,
            autoplay: params.autoplay,
            autoBind: params.autoBind,
            stateMachine: params.stateMachine,
            animations: params.animations,
            stateMachines: params.stateMachines,
            artboard: params.artboard,
            useOffscreenRenderer: params.useOffscreenRenderer,
            tabIndex: params.tabIndex,
            semanticsMode: params.semanticsMode,
            semanticsOptions: params.semanticsOptions,
            enableGPUCanvas: this.deferredRenderer,
        });
    }
    Object.defineProperty(Rive, "suppressDeprecationWarnings", {
        /**
         * Deprecation warnings to silence, by {@link DeprecationId}. Each warning
         * prints the id needed to silence it, so you can copy it out of the console.
         *
         * ```ts
         * Rive.suppressDeprecationWarnings = ["rive-events", "text-runs"];
         * ```
         *
         * Assigning replaces the whole list.
         * There is no option to silence everything
         */
        get: function () {
            return Object.freeze(Array.from(suppressedDeprecations));
        },
        set: function (ids) {
            setSuppressedDeprecations(ids);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rive.prototype, "viewModelCount", {
        get: function () {
            return this.file.viewModelCount();
        },
        enumerable: false,
        configurable: true
    });
    // Alternative constructor to build a Rive instance from an interface/object
    Rive.new = function (params) {
        warnOnce(DeprecationKeys.legacyConstructors, "This function is deprecated: please use `new Rive({})` instead");
        return new Rive(params);
    };
    /**
     * @experimental Turns on semantics and the accessibility overlay for this
     * instance. Idempotent; safe to call before or after load. Use this to drive
     * a consumer-controlled accessibility toggle when constructed with the
     * default {@link SemanticMode.Disabled}.
     */
    Rive.prototype.enableSemantics = function () {
        this.semanticsMode = _semantics__WEBPACK_IMPORTED_MODULE_2__.SemanticMode.Enabled;
        this.activateSemantics();
    };
    Rive.prototype.activateSemantics = function () {
        if (this._semanticsActive || this.semanticsMode === _semantics__WEBPACK_IMPORTED_MODULE_2__.SemanticMode.Disabled) {
            return;
        }
        this._semanticsActive = true;
        this.syncSemanticsOnStateMachines();
    };
    Rive.prototype.syncSemanticsOnStateMachines = function () {
        if (!this._semanticsActive || !this.animator) {
            return;
        }
        for (var _i = 0, _a = this.animator.stateMachines; _i < _a.length; _i++) {
            var stateMachine = _a[_i];
            stateMachine.enableSemantics();
        }
    };
    /**
     * Tears down the semantic tree and accessibility overlay. The overlay captures the
     * active state machine in its action closures, so it must not outlive the
     * instances it points at (reset/load delete them)
     */
    Rive.prototype.cleanupSemantics = function () {
        this._semanticTree = null;
        if (this._accessibilityOverlay) {
            this._accessibilityOverlay.destroy();
            this._accessibilityOverlay = null;
        }
    };
    // Event handler for when audio context becomes available
    Rive.prototype.onSystemAudioChanged = function () {
        this.volume = this._volume;
    };
    // Initializes the Rive object either from constructor or load()
    Rive.prototype.init = function (_a) {
        var _this = this;
        var _b, _c, _d, _e, _f;
        var src = _a.src, buffer = _a.buffer, riveFile = _a.riveFile, stateMachine = _a.stateMachine, animations = _a.animations, stateMachines = _a.stateMachines, artboard = _a.artboard, _g = _a.autoplay, autoplay = _g === void 0 ? false : _g, _h = _a.useOffscreenRenderer, useOffscreenRenderer = _h === void 0 ? false : _h, _j = _a.autoBind, autoBind = _j === void 0 ? false : _j, tabIndex = _a.tabIndex, semanticsMode = _a.semanticsMode, semanticsOptions = _a.semanticsOptions, enableGPUCanvas = _a.enableGPUCanvas;
        if (this.destroyed) {
            return;
        }
        // Validated before any state changes, so a call with no source leaves a
        // running instance untouched.
        if (!src && !buffer && !riveFile) {
            throw new RiveError(Rive.missingErrorMessage);
        }
        // Reload releases the outgoing file in the same order cleanup() uses:
        // artboard, then the renderer's session, then the file. The artboard goes
        // first because it holds an rcp<File> and its resources came from the
        // session about to be released. stop() has already deleted the animation
        // and state machine instances; reload deliberately skips cleanupInstances(),
        // which would also drop the event listeners load() keeps in place.
        if (this.artboard) {
            // Free GPU-backed resources with their own context current. No-op on
            // the canvas2d build.
            (_c = (_b = this.renderer) === null || _b === void 0 ? void 0 : _b.bindContext) === null || _c === void 0 ? void 0 : _c.call(_b);
            (_d = this.animator) === null || _d === void 0 ? void 0 : _d.stop();
            this.artboard.delete();
            this.artboard = null;
        }
        // Detach before the session is deleted: the handle dies with it.
        if (this.renderer) {
            (_f = (_e = this.renderer).detachSession) === null || _f === void 0 ? void 0 : _f.call(_e);
        }
        this.releaseCurrentRiveFile(/* isTeardown */ false);
        this.src = src;
        this.buffer = buffer;
        this.riveFile = riveFile;
        // initData flips this if it ends up importing the file itself.
        this.ownsRiveFile = false;
        // Sticky across reloads so a constructor-set flag survives; an explicit
        // `false` still turns it off.
        this.deferredRenderer = enableGPUCanvas !== null && enableGPUCanvas !== void 0 ? enableGPUCanvas : this.deferredRenderer;
        this._tabIndex = tabIndex !== null && tabIndex !== void 0 ? tabIndex : null;
        this.semanticsMode = semanticsMode !== null && semanticsMode !== void 0 ? semanticsMode : _semantics__WEBPACK_IMPORTED_MODULE_2__.SemanticMode.Disabled;
        this.semanticsOptions = semanticsOptions !== null && semanticsOptions !== void 0 ? semanticsOptions : this.semanticsOptions;
        // Names of the animations and state machines that should be initialized
        var _k = resolveStartingPlayback({
            stateMachine: stateMachine,
            animations: animations,
            stateMachines: stateMachines,
        }), startingAnimationNames = _k.startingAnimationNames, startingStateMachineNames = _k.startingStateMachineNames;
        // Ensure loaded is marked as false if loading new file
        this.loaded = false;
        this.readyForPlaying = false;
        // Ensure the runtime is loaded
        _runtimeLoader__WEBPACK_IMPORTED_MODULE_1__.RuntimeLoader.awaitInstance()
            .then(function (runtime) {
            if (_this.destroyed) {
                return;
            }
            _this.runtime = runtime;
            _this.removeRiveListeners();
            // load() reinitializes without cleanupInstances(); drop any stale overlay
            // bound to the previous file's state machines (no-op on first construct).
            _this.cleanupSemantics();
            _this.deleteRiveRenderer();
            // Get the canvas where you want to render the animation and create a renderer
            if (_this.enablePerfMarks)
                performance.mark('rive:make-renderer:start');
            try {
                // Always immediate at creation; a deferred file attaches its session
                // to this renderer once the file has loaded.
                _this.renderer = _this.runtime.makeRenderer(_this.canvas, useOffscreenRenderer);
                if (!_this.renderer) {
                    throw new Error("Renderer is null, cannot render Rive on the canvas.");
                }
            }
            catch (e) {
                console.error(e);
                throw new RiveError("Unable to create the renderer, your environment may not support WebGL. Try the @rive-app/canvas runtime as an alternative.");
            }
            if (_this.enablePerfMarks) {
                performance.mark('rive:make-renderer:end');
                performance.measure('rive:make-renderer', 'rive:make-renderer:start', 'rive:make-renderer:end');
            }
            // Initial size adjustment based on devicePixelRatio if no width/height are
            // specified explicitly
            if (!(_this.canvas.width || _this.canvas.height)) {
                _this.resizeDrawingSurfaceToCanvas();
            }
            // Load Rive data from a source uri or a data buffer
            _this.initData(artboard, startingAnimationNames, startingStateMachineNames, autoplay, autoBind)
                .then(function (hasInitialized) {
                if (hasInitialized) {
                    return _this.setupRiveListeners();
                }
            })
                .catch(function (e) {
                // initData already catches RiveErrors for load issues like artboard/state machine initialization
                // failures, so just console error and catch here so we don't double-fire the LoadError event
                console.error(e);
            });
        })
            .catch(function (e) {
            _this.eventManager.fire({ type: EventType.LoadError, data: e.message });
        });
    };
    /**
     * Setup Rive Listeners on the canvas
     * @param riveListenerOptions - Enables TouchEvent events on the canvas. Set to true to allow
     * touch scrolling on the canvas element on touch-enabled devices
     * i.e. { isTouchScrollEnabled: true }
     */
    Rive.prototype.setupRiveListeners = function (riveListenerOptions) {
        var _this = this;
        if (this.eventCleanup) {
            this.eventCleanup();
        }
        this.cleanupKeyboardInteractions();
        if (!this.shouldDisableRiveListeners) {
            var playingStateMachines = this.animator.stateMachines.filter(function (sm) { return sm.playing; });
            var activeStateMachines = playingStateMachines
                .filter(function (sm) { return _this.runtime.hasListeners(sm.instance); })
                .map(function (sm) { return sm.instance; });
            var touchScrollEnabledOption = this.isTouchScrollEnabled;
            var dispatchPointerExit = this.dispatchPointerExit;
            var enableMultiTouch = this.enableMultiTouch;
            if (riveListenerOptions &&
                "isTouchScrollEnabled" in riveListenerOptions) {
                touchScrollEnabledOption = riveListenerOptions.isTouchScrollEnabled;
            }
            this.eventCleanup = (0,_utils__WEBPACK_IMPORTED_MODULE_3__.registerTouchInteractions)({
                canvas: this.canvas,
                artboard: this.artboard,
                stateMachines: activeStateMachines,
                renderer: this.renderer,
                rive: this.runtime,
                fit: this._layout.runtimeFit(this.runtime),
                alignment: this._layout.runtimeAlignment(this.runtime),
                isTouchScrollEnabled: touchScrollEnabledOption,
                dispatchPointerExit: dispatchPointerExit,
                enableMultiTouch: enableMultiTouch,
                layoutScaleFactor: this._layout.layoutScaleFactor,
                advanceAndDrain: this.advanceAndDrainForPointer.bind(this),
                summonKeyboard: this.summonKeyboardForGesture.bind(this),
                isTextProxyFocused: this.isEditingHostFocused,
            });
            this.ensureKeyboardInteractions();
        }
    };
    Object.defineProperty(Rive.prototype, "focusStateMachine", {
        // Assumes a single state machine drives focus.
        get: function () {
            return this.animator.stateMachines.find(function (sm) { return sm.playing && sm.hasFocusNodes; });
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Wire keyboard interactions when a playing state machine has focus nodes.
     * Called at listener setup and lazily each frame so late-bound bindable artboards work.
     */
    Rive.prototype.ensureKeyboardInteractions = function () {
        var _this = this;
        if (this._keyboardInteractions ||
            this.shouldDisableRiveListeners ||
            typeof window === "undefined" ||
            !(this.canvas instanceof HTMLCanvasElement)) {
            return;
        }
        var smWithFocusNodes = this.focusStateMachine;
        if (!smWithFocusNodes) {
            return;
        }
        var currentCanvasTabIndex = this.canvas.tabIndex;
        if (currentCanvasTabIndex === -1 || isNaN(currentCanvasTabIndex)) {
            this.canvas.tabIndex = (this._tabIndex !== null ? this._tabIndex : 0);
        }
        this._keyboardInteractions = new _utils__WEBPACK_IMPORTED_MODULE_3__.KeyboardInteractions({
            canvas: this.canvas,
            stateMachine: smWithFocusNodes.instance,
            hasFocusNodes: true,
            getOverlayElement: function () { var _a, _b; return (_b = (_a = _this._accessibilityOverlay) === null || _a === void 0 ? void 0 : _a.getSemanticOverlayContainer()) !== null && _b !== void 0 ? _b : null; },
        });
    };
    /** Runs inside touchend/mouseup so focusing the proxy raises the mobile keyboard. */
    Rive.prototype.summonKeyboardForGesture = function () {
        if (!this._keyboardInteractions)
            return;
        var activeSm = this.focusStateMachine;
        if (!activeSm)
            return;
        if (this.wantsTextInputSession(activeSm.focusState().expectsKeyboardInput)) {
            this._keyboardInteractions.summonForPointer();
        }
    };
    /** expectsKeyboardInput, and (with semantics on) the focused node is a textField. */
    Rive.prototype.wantsTextInputSession = function (expectsKeyboardInput) {
        var _a;
        if (!expectsKeyboardInput)
            return false;
        var node = (_a = this._semanticTree) === null || _a === void 0 ? void 0 : _a.focusedNode();
        return node === undefined || node.role === _semantics__WEBPACK_IMPORTED_MODULE_2__.SemanticRole.textField;
    };
    Rive.prototype.advanceAndDrainForPointer = function (elapsedTime, options) {
        if (!(options === null || options === void 0 ? void 0 : options.pointerDown)) {
            this.advanceAndReportChanges(elapsedTime);
            return;
        }
        this._inPointerDownDrain = true;
        try {
            this.advanceAndReportChanges(elapsedTime);
        }
        finally {
            this._inPointerDownDrain = false;
        }
    };
    Rive.prototype.cleanupKeyboardInteractions = function () {
        var _a;
        if (this._keyboardInteractions) {
            this._keyboardInteractions.cleanup();
            this._keyboardInteractions = null;
        }
        this._prevWantsTextInputSession = false;
        (_a = this._accessibilityOverlay) === null || _a === void 0 ? void 0 : _a.releaseEditingHost(null, null);
    };
    /**
     * Remove Rive Listeners setup on the canvas
     */
    Rive.prototype.removeRiveListeners = function () {
        if (this.eventCleanup) {
            this.eventCleanup();
            this.eventCleanup = null;
        }
        this.cleanupKeyboardInteractions();
    };
    /**
     * If the instance has audio and the system audio is not ready
     * we hook the instance to the audio manager
     */
    Rive.prototype.initializeAudio = function () {
        var _this = this;
        var _a;
        // Initialize audio if needed
        if (audioManager.status == SystemAudioStatus.UNAVAILABLE) {
            if (this.file.hasAudio ||
                (((_a = this.artboard) === null || _a === void 0 ? void 0 : _a.hasAudio) && this._audioEventListener === null)) {
                this._audioEventListener = {
                    type: EventType.AudioStatusChange,
                    callback: function () { return _this.onSystemAudioChanged(); },
                };
                audioManager.add(this._audioEventListener);
                audioManager.establishAudio();
            }
        }
    };
    Rive.prototype.initArtboardSize = function () {
        if (!this.artboard)
            return;
        // Use preset values if they are not undefined
        this._artboardWidth = this.artboard.width =
            this._artboardWidth || this.artboard.width;
        this._artboardHeight = this.artboard.height =
            this._artboardHeight || this.artboard.height;
    };
    // Initializes runtime with Rive data and preps for playing.
    // Returns true for successful initialization.
    Rive.prototype.initData = function (artboardName, animationNames, stateMachineNames, autoplay, autoBind) {
        return __awaiter(this, void 0, void 0, function () {
            var riveFile, error_4, msg;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 5, , 6]);
                        // A caller-supplied riveFile is theirs to release; one we import here is
                        // ours, which matters if a deferred fallback replaces it below.
                        this.ownsRiveFile = this.riveFile == null;
                        if (!this.ownsRiveFile) return [3 /*break*/, 2];
                        riveFile = new RiveFile({
                            src: this.src,
                            buffer: this.buffer,
                            enableRiveAssetCDN: this.enableRiveAssetCDN,
                            assetLoader: this.assetLoader,
                            enablePerfMarks: this.enablePerfMarks,
                            // The instance owns this file, so its flag is the file's flag.
                            enableGPUCanvas: this.deferredRenderer,
                        });
                        this.riveFile = riveFile;
                        return [4 /*yield*/, riveFile.init()];
                    case 1:
                        _c.sent();
                        if (this.destroyed) {
                            // In the very unlikely scenario where the rive file created by this Rive is shared by
                            // another rive file, we only want to destroy it if this file is the only owner.
                            riveFile.destroyIfUnused();
                            return [2 /*return*/, false];
                        }
                        _c.label = 2;
                    case 2:
                        if (!(this.riveFile.deferredSession !== null || this.deferredRenderer)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.resolveDeferredRendering()];
                    case 3:
                        _c.sent();
                        if (this.destroyed) {
                            // cleanup() ran during a re-import. Taking a reference now would
                            // resurrect a file this instance is never going to draw. Only ours
                            // to release — a caller-supplied file stays theirs.
                            if (this.ownsRiveFile) {
                                (_a = this.riveFile) === null || _a === void 0 ? void 0 : _a.destroyIfUnused();
                            }
                            return [2 /*return*/, false];
                        }
                        _c.label = 4;
                    case 4:
                        this.file = this.riveFile.getInstance();
                        this.reportDisplayScale();
                        // Initialize and draw frame
                        this.initArtboard(artboardName, animationNames, stateMachineNames, autoplay, autoBind);
                        // Initialize the artboard size
                        this.initArtboardSize();
                        // Check for audio
                        this.initializeAudio();
                        if (this.semanticsMode === _semantics__WEBPACK_IMPORTED_MODULE_2__.SemanticMode.Enabled) {
                            this.activateSemantics();
                        }
                        else if (this._semanticsActive) {
                            this.syncSemanticsOnStateMachines();
                        }
                        // Everything's set up, emit a load event
                        try {
                            this.loaded = true;
                            this.eventManager.fire({
                                type: EventType.Load,
                                data: (_b = this.src) !== null && _b !== void 0 ? _b : "buffer",
                            });
                        }
                        catch (e) {
                            // If any synchronous errors surface from the user-supplied onLoad callback,
                            // this will console.error the error but will not invoke LoadError (onLoadError).
                            // Notably, this will not interfere with Rive rendering
                            console.error(e);
                        }
                        // Only initialize paused state machines after the load event has been fired
                        // to allow users to initialize inputs and view models before the first advance
                        this.animator.advanceIfPaused();
                        // Flag ready for playback commands and clear the task queue; this order
                        // is important or it may infinitely recurse
                        this.readyForPlaying = true;
                        this.taskQueue.process();
                        this.drawFrame();
                        return [2 /*return*/, true];
                    case 5:
                        error_4 = _c.sent();
                        msg = resolveErrorMessage(error_4);
                        this.eventManager.fire({ type: EventType.LoadError, data: msg });
                        return [2 /*return*/, Promise.reject(msg)];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Settles which rendering mode this Rive instance runs in. The file dictates: its rendering mode
     * is fixed at import, and an immediate renderer silently drops a deferred
     * file's resources. Every mismatch warns and degrades to something that
     * renders, so users shouldn't have a blank canvas. A fallback self-reimport replaces `this.riveFile`;
     * only a file this instance imported is released when that happens.
     */
    Rive.prototype.resolveDeferredRendering = function () {
        return __awaiter(this, void 0, void 0, function () {
            var file, ownsFile, renderer, session, attachSession, immediate, copy, copySession, fallback;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        file = this.riveFile;
                        ownsFile = this.ownsRiveFile;
                        renderer = this.renderer;
                        session = file.deferredSession;
                        if (session === null) {
                            // No second warning when the file asked for deferred and the build
                            // could not honor it; the unsupported-build warning already fired, and
                            // telling the user to set a flag they set would mislead.
                            if (this.deferredRenderer && !file.deferredRequested) {
                                console.warn("Rive: `enableGPUCanvas: true` was ignored because this RiveFile was imported without it. The mode is fixed at import: construct the RiveFile with `enableGPUCanvas: true` to opt in.");
                            }
                            return [2 /*return*/];
                        }
                        if (!this.deferredRenderer) {
                            console.warn("Rive: this RiveFile was imported with `enableGPUCanvas: true`, so this instance renders deferred even though `enableGPUCanvas` is false on the instance. An immediate renderer would drop the file's deferred resources and draw nothing.");
                        }
                        attachSession = renderer === null || renderer === void 0 ? void 0 : renderer.attachSession;
                        if (!(typeof attachSession !== "function")) return [3 /*break*/, 2];
                        // Offscreen renderers share one context across canvases, which a session
                        // cannot record for. An immediate copy of the file still renders.
                        console.warn("Rive: this renderer cannot replay a deferred session (`useOffscreenRenderer` is not supported with deferred rendering). Re-importing the file in immediate mode for this instance.");
                        return [4 /*yield*/, file.reimport(false)];
                    case 1:
                        immediate = _b.sent();
                        if (this.destroyed) {
                            // cleanup() ran while we were importing; nothing will use this copy.
                            immediate.destroyIfUnused();
                            return [2 /*return*/];
                        }
                        this.riveFile = immediate;
                        this.ownsRiveFile = true;
                        if (ownsFile) {
                            // Nothing else can reach the deferred import we just walked away from.
                            file.destroyIfUnused();
                        }
                        return [2 /*return*/];
                    case 2:
                        // Never re-offered once claimed, even if that renderer is gone: the
                        // resources the session's stream refers to died with it.
                        if (!file.sessionClaimed && attachSession.call(renderer, session)) {
                            file.claimSession();
                            return [2 /*return*/];
                        }
                        // Bound to another instance. Re-import from the retained buffer into a
                        // session of our own.
                        file.warnBoundElsewhereOnce();
                        return [4 /*yield*/, file.reimport(true)];
                    case 3:
                        copy = _b.sent();
                        if (this.destroyed) {
                            // The renderer was deleted while we imported; attaching to it would hand
                            // embind a deleted object.
                            copy.destroyIfUnused();
                            return [2 /*return*/];
                        }
                        this.riveFile = copy;
                        this.ownsRiveFile = true;
                        copySession = copy.deferredSession;
                        if (copySession !== null && attachSession.call(renderer, copySession)) {
                            copy.claimSession();
                            return [2 /*return*/];
                        }
                        // The copy's session could not take this canvas either (this renderer
                        // already holds one). An immediate re-import still renders; a deferred file
                        // on an immediate renderer would drop its resources and draw nothing.
                        console.warn("Rive: could not attach the re-imported file's deferred session to this canvas; falling back to immediate rendering for this instance.");
                        // If a leftover session is why the attach failed, it would keep routing
                        // the immediate file's draws into its recorder, which drops them.
                        (_a = renderer.detachSession) === null || _a === void 0 ? void 0 : _a.call(renderer);
                        return [4 /*yield*/, file.reimport(false)];
                    case 4:
                        fallback = _b.sent();
                        // The deferred copy was only ever ours, so it always goes.
                        copy.destroyIfUnused();
                        if (this.destroyed) {
                            fallback.destroyIfUnused();
                            return [2 /*return*/];
                        }
                        this.riveFile = fallback;
                        this.ownsRiveFile = true;
                        if (ownsFile) {
                            file.destroyIfUnused();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    // Initialize for playback
    Rive.prototype.initArtboard = function (artboardName, animationNames, stateMachineNames, autoplay, autoBind) {
        if (!this.file) {
            return;
        }
        // Fetch the artboard
        var rootArtboard = artboardName
            ? this.file.artboardByName(artboardName)
            : this.file.defaultArtboard();
        // Check we have a working artboard
        if (!rootArtboard) {
            throw new RiveError("Invalid artboard name or no default artboard");
        }
        this.artboard = rootArtboard;
        rootArtboard.volume = this._volume * audioManager.systemVolume;
        // Initialize the animator
        this.animator = new Animator(this.runtime, this.artboard, this.eventManager);
        // Initialize the animations; as loaded hasn't happened yet, we need to
        // suppress firing the play/pause events until the load event has fired. To
        // do this we tell the animator to suppress firing events, and add event
        // firing to the task queue.
        var instanceNames;
        if (animationNames.length > 0 || stateMachineNames.length > 0) {
            instanceNames = animationNames.concat(stateMachineNames);
            this.animator.initLinearAnimations(animationNames, autoplay);
            this.animator.initStateMachines(stateMachineNames, autoplay, this._semanticsActive);
        }
        else {
            instanceNames = [this.animator.atLeastOne(autoplay, false, this._semanticsActive)];
        }
        // Queue up firing the playback events
        this.taskQueue.add({
            event: {
                type: autoplay ? EventType.Play : EventType.Pause,
                data: instanceNames,
            },
        });
        if (autoBind) {
            // Set the main view model instance (if the artboard has one)...
            var viewModel = this.file.defaultArtboardViewModel(rootArtboard);
            if (viewModel !== null) {
                var runtimeInstance = viewModel.defaultInstance();
                if (runtimeInstance !== null) {
                    var viewModelInstance = new ViewModelInstance(runtimeInstance, null);
                    (0,_utils__WEBPACK_IMPORTED_MODULE_3__.createFinalization)(viewModelInstance, viewModelInstance.runtimeInstance);
                    this.setViewModelInstance(viewModelInstance);
                }
            }
            // ...and a default instance for each global view model (no longer
            // auto-created by the runtime), then apply everything in one rebind.
            for (var _i = 0, _a = this.file.globalViewModelNames(); _i < _a.length; _i++) {
                var name_1 = _a[_i];
                var globalViewModel = this.file.viewModelByName(name_1);
                if (globalViewModel !== null) {
                    var instance = new ViewModel(globalViewModel).defaultInstance();
                    if (instance !== null) {
                        this.setGlobalViewModelInstance(name_1, instance);
                    }
                }
            }
            this.bind();
        }
    };
    // Draws the current artboard frame
    Rive.prototype.drawFrame = function () {
        var _a, _b;
        if ((_a = document === null || document === void 0 ? void 0 : document.timeline) === null || _a === void 0 ? void 0 : _a.currentTime) {
            if (this.loaded && this.artboard && !this.frameRequestId) {
                this._boundDraw(document.timeline.currentTime);
                (_b = this.runtime) === null || _b === void 0 ? void 0 : _b.resolveAnimationFrame();
            }
        }
        else {
            this.scheduleRendering();
        }
    };
    Rive.prototype._canvasSizeChanged = function () {
        var changed = false;
        if (this.canvas) {
            if (this.canvas.width !== this._currentCanvasWidth) {
                this._currentCanvasWidth = this.canvas.width;
                changed = true;
            }
            if (this.canvas.height !== this._currentCanvasHeight) {
                this._currentCanvasHeight = this.canvas.height;
                changed = true;
            }
        }
        return changed;
    };
    // Content the artboard's change flag cannot see: ore and GPU canvas commands
    // scripts record straight into the session. Must be read before the renderer
    // clears — clearing marks the stream, so a later read is true every frame.
    Rive.prototype._deferredWorkPending = function () {
        var _a, _b, _c;
        return (_c = (_b = (_a = this.riveFile) === null || _a === void 0 ? void 0 : _a.deferredSession) === null || _b === void 0 ? void 0 : _b.recordedThisFrame()) !== null && _c !== void 0 ? _c : false;
    };
    /** Rive can move focus on its own, so reconcile the text session and DOM focus each frame. */
    Rive.prototype.pollFocusState = function () {
        this.ensureKeyboardInteractions();
        var ki = this._keyboardInteractions;
        var activeSm = ki ? this.focusStateMachine : undefined;
        if (!ki || !activeSm || !(this.canvas instanceof HTMLCanvasElement)) {
            this._prevHasFocus = false;
            this._prevWantsTextInputSession = false;
            return;
        }
        var _a = activeSm.focusState(), hasFocus = _a.hasFocus, expectsKeyboardInput = _a.expectsKeyboardInput;
        this.syncTextInputSession(ki, this.wantsTextInputSession(expectsKeyboardInput));
        this.syncRiveFocus(ki, this.canvas, hasFocus);
    };
    /** Begin/end the text session on wantsSession edges; decorate the proxy while it has DOM focus. */
    Rive.prototype.syncTextInputSession = function (ki, wantsSession) {
        var host = ki.editingHost;
        var overlay = this._accessibilityOverlay;
        if (wantsSession) {
            var began = !this._prevWantsTextInputSession;
            if (began) {
                // In-domain or opted-in only; during pointer-down, pointer-up focuses instead.
                var focusProxy = !this._inPointerDownDrain &&
                    (ki.isInFocusDomain(document.activeElement) ||
                        !!this._focusOptions.allowFocusInterrupt);
                ki.beginTextInputSession(focusProxy);
            }
            // The <input> proxy stands in for the semantic DOM field only while it holds DOM focus.
            if (overlay && this._semanticTree) {
                if (host.hasDomFocus()) {
                    overlay.syncEditingHost(this._semanticTree, host, began || !overlay.hasEditingHost());
                }
                else if (overlay.hasEditingHost()) {
                    overlay.releaseEditingHost(this._semanticTree, host);
                }
            }
        }
        else if (this._prevWantsTextInputSession) {
            // Overlay hand-off first, ahead of endTextInputSession's park-on-canvas fallback.
            overlay === null || overlay === void 0 ? void 0 : overlay.releaseEditingHost(this._semanticTree, host);
            ki.endTextInputSession();
        }
        this._prevWantsTextInputSession = wantsSession;
    };
    /** Mirror Rive's hasFocus into the keyboard session state and, on opt-in, canvas focus. */
    Rive.prototype.syncRiveFocus = function (ki, canvas, hasFocus) {
        if (hasFocus) {
            ki.notifyRiveFocused();
            // Pull focus from outside Rive only with allowFocusInterrupt.
            if (!this._prevHasFocus) {
                if (!ki.isInFocusDomain(document.activeElement) &&
                    this._focusOptions.allowFocusInterrupt) {
                    canvas.focus();
                }
                this._prevHasFocus = true;
            }
        }
        else {
            this._prevHasFocus = false;
            // Rive released focus internally (e.g. a state change): drop the Tab trap so the next
            // Tab leaves the canvas.
            if (ki.focusSessionState === _utils__WEBPACK_IMPORTED_MODULE_3__.FocusSessionState.RiveFocused) {
                ki.setFocusSessionState(_utils__WEBPACK_IMPORTED_MODULE_3__.FocusSessionState.NotFocused);
            }
        }
    };
    /**
     * Handles important sequence of reporting Rive events, advancing the state machine or animation, and invoking various callbacks
     * due to state changes, view model property changes, etc.
     *
     * @param elapsedTime time to advance the state machine by
     */
    Rive.prototype.advanceAndReportChanges = function (elapsedTime) {
        var _a, _b;
        // - Advance non-paused animations by the elapsed number of seconds
        // - Advance any animations that require scrubbing
        // - Advance to the first frame even when autoplay is false
        var activeAnimations = this.animator.animations
            .filter(function (a) { return a.playing || a.needsScrub; })
            // The scrubbed animations must be applied first to prevent weird artifacts
            // if the playing animations conflict with the scrubbed animating attribuates.
            .sort(function (first) { return (first.needsScrub ? -1 : 1); });
        for (var _i = 0, activeAnimations_1 = activeAnimations; _i < activeAnimations_1.length; _i++) {
            var animation = activeAnimations_1[_i];
            animation.advance(elapsedTime);
            if (animation.instance.didLoop) {
                animation.loopCount += 1;
            }
            animation.apply(1.0);
        }
        // - Advance non-paused state machines by the elapsed number of seconds
        // - Advance to the first frame even when autoplay is false
        var activeStateMachines = this.animator.stateMachines.filter(function (a) { return a.playing; });
        // Instrument the first 3 frames so the Performance timeline shows precise
        // per-call latency for advance, draw, and flush without polluting the trace.
        var _perfFrame = this.enablePerfMarks && this.frameCount < 3 ? this.frameCount : -1;
        for (var _c = 0, activeStateMachines_1 = activeStateMachines; _c < activeStateMachines_1.length; _c++) {
            var stateMachine = activeStateMachines_1[_c];
            // Check for events before the current frame's state machine advance
            var numEventsReported = stateMachine.reportedEventCount();
            if (numEventsReported) {
                for (var i = 0; i < numEventsReported; i++) {
                    var event_1 = stateMachine.reportedEventAt(i);
                    if (event_1) {
                        if (event_1.type === RiveEventType.OpenUrl) {
                            this.eventManager.fire({
                                type: EventType.RiveEvent,
                                data: event_1,
                            });
                            // Handle the event side effect if explicitly enabled
                            if (this.automaticallyHandleEvents) {
                                var newAnchorTag = document.createElement("a");
                                var _d = event_1, url = _d.url, target = _d.target;
                                var sanitizedUrl = (0,_utils__WEBPACK_IMPORTED_MODULE_3__.sanitizeUrl)(url);
                                url && newAnchorTag.setAttribute("href", sanitizedUrl);
                                target && newAnchorTag.setAttribute("target", target);
                                if (sanitizedUrl && sanitizedUrl !== _utils__WEBPACK_IMPORTED_MODULE_3__.BLANK_URL) {
                                    newAnchorTag.click();
                                }
                            }
                        }
                        else {
                            this.eventManager.fire({
                                type: EventType.RiveEvent,
                                data: event_1,
                            });
                        }
                    }
                }
            }
            if (_perfFrame >= 0)
                performance.mark("rive:sm-advance:start:f".concat(_perfFrame));
            stateMachine.advanceAndApply(elapsedTime);
            if (_perfFrame >= 0) {
                performance.mark("rive:sm-advance:end:f".concat(_perfFrame));
                performance.measure("rive:sm-advance:f".concat(_perfFrame), "rive:sm-advance:start:f".concat(_perfFrame), "rive:sm-advance:end:f".concat(_perfFrame));
            }
            if (this._semanticsActive) {
                var diff = stateMachine.drainSemanticsDiff();
                if (diff) {
                    if (!this._semanticTree) {
                        this._semanticTree = new _semantics__WEBPACK_IMPORTED_MODULE_2__.SemanticTreeModel();
                    }
                    this._semanticTree.applyDiff(diff);
                }
            }
        }
        // Update the accessibility overlay after all state machines have
        // been advanced and their diffs applied to the tree model.
        if (this._semanticsActive &&
            this._semanticTree &&
            activeStateMachines.length > 0 &&
            this.canvas instanceof HTMLCanvasElement) {
            if (!this._accessibilityOverlay) {
                var mainSm_1 = activeStateMachines[0];
                this._accessibilityOverlay = new _semantics__WEBPACK_IMPORTED_MODULE_2__.AccessibilityOverlay({
                    canvas: this.canvas,
                    instanceId: this._instanceId,
                    semanticsOptions: this.semanticsOptions,
                    allowFocusInterrupt: this._focusOptions.allowFocusInterrupt,
                    isEditingHostFocused: this.isEditingHostFocused,
                    fireAction: function (nodeId, actionType) {
                        mainSm_1.fireSemanticAction(nodeId, actionType);
                    },
                    requestFocus: function (nodeId) {
                        return mainSm_1.focusSemanticNode(nodeId);
                    },
                    clearFocus: function () {
                        return mainSm_1.instance.clearFocus();
                    },
                });
            }
            var overlayChange = (_a = this._accessibilityOverlay) === null || _a === void 0 ? void 0 : _a.needsUpdate(this._semanticTree);
            if (overlayChange || this._overlayTransformDirty) {
                // Only recompute the artboard→canvas transform when something that
                // affects it changed (canvas geometry or a layout/dpr input). When only
                // the semantic tree changed we pass null and reuse the existing CSS
                // transform on the overlay container.
                var forwardMat = null;
                if ((overlayChange === null || overlayChange === void 0 ? void 0 : overlayChange.layoutChanged) || this._overlayTransformDirty) {
                    var fit_1 = this._layout.runtimeFit(this.runtime);
                    var alignment = this._layout.runtimeAlignment(this.runtime);
                    forwardMat = this.runtime.computeAlignment(fit_1, alignment, {
                        minX: this._layout.minX,
                        minY: this._layout.minY,
                        maxX: this._layout.maxX,
                        maxY: this._layout.maxY,
                    }, this.artboard.bounds, this._devicePixelRatioUsed * this._layout.layoutScaleFactor);
                    this._overlayTransformDirty = false;
                }
                this._accessibilityOverlay.update(this._semanticTree, forwardMat, this._devicePixelRatioUsed, this.artboard.bounds, overlayChange);
                forwardMat === null || forwardMat === void 0 ? void 0 : forwardMat.delete();
            }
        }
        // For linear animations that have been applied to the artboard, advance it
        // by the elapsed time.
        if (this.animator.stateMachines.length == 0) {
            this.artboard.advance(elapsedTime);
        }
        // Check for any animations that looped
        this.animator.handleLooping();
        // Check for any state machines that had a state change
        this.animator.handleStateChanges();
        // Report advanced time
        this.animator.handleAdvancing(elapsedTime);
        // Poll focus state to see whether or not to blur or pull up a virtual keyboard for any change to a text input node.
        this.pollFocusState();
        // Handle callbacks for main view model property changes
        (_b = this._viewModelInstance) === null || _b === void 0 ? void 0 : _b.handleCallbacks();
        // Handle callbacks for global view model property changes
        this._globalViewModelInstances.forEach(function (instance) {
            if (instance) {
                instance.handleCallbacks();
            }
        });
    };
    /**
     * Draw rendering loop; renders animation frames at the correct time interval.
     * @param time the time at which to render a frame
     */
    Rive.prototype.draw = function (time, onSecond) {
        // Clear the frameRequestId, as we're now rendering a fresh frame
        this.frameRequestId = null;
        // load() tears the artboard down and re-inits asynchronously; a frame
        // queued before that lands here with nothing to draw.
        if (!this.artboard) {
            return;
        }
        var before = performance.now();
        // Instrument the first 3 frames so the Performance timeline shows precise
        // per-call latency for advance, draw, and flush without polluting the trace.
        var _perfFrame = this.enablePerfMarks && this.frameCount < 3 ? this.frameCount : -1;
        // On the first pass, make sure lastTime has a valid value
        if (!this.lastRenderTime) {
            this.lastRenderTime = time;
        }
        // Handle the onSecond callback
        this.renderSecondTimer += time - this.lastRenderTime;
        if (this.renderSecondTimer > 5000) {
            this.renderSecondTimer = 0;
            onSecond === null || onSecond === void 0 ? void 0 : onSecond();
        }
        // Calculate the elapsed time between frames in seconds
        var elapsedTime = (time - this.lastRenderTime) / 1000;
        this.lastRenderTime = time;
        this.advanceAndReportChanges(elapsedTime);
        var renderer = this.renderer;
        // Do not draw on 0 canvas size
        if (!this._hasZeroSize) {
            // If there was no dirt on this frame, do not clear and draw. The deferred
            // term has to be read here, before `clear()` below: clearing opens the
            // session's recording window and marks its stream, so a read taken after
            // it reports every frame as dirty and nothing is ever skipped.
            if (this.drawOptimization == DrawOptimizationOptions.AlwaysDraw ||
                this.artboard.didChange() ||
                this._deferredWorkPending() ||
                this._needsRedraw ||
                this._canvasSizeChanged()) {
                // Canvas must be wiped to prevent artifacts
                renderer.clear();
                renderer.save();
                // Update the renderer alignment if necessary
                if (_perfFrame >= 0)
                    performance.mark("rive:align-renderer:start:f".concat(_perfFrame));
                this.alignRenderer();
                if (_perfFrame >= 0) {
                    performance.mark("rive:align-renderer:end:f".concat(_perfFrame));
                    performance.measure("rive:align-renderer:f".concat(_perfFrame), "rive:align-renderer:start:f".concat(_perfFrame), "rive:align-renderer:end:f".concat(_perfFrame));
                }
                if (_perfFrame >= 0)
                    performance.mark("rive:artboard-draw:start:f".concat(_perfFrame));
                this.artboard.draw(renderer);
                if (_perfFrame >= 0) {
                    performance.mark("rive:artboard-draw:end:f".concat(_perfFrame));
                    performance.measure("rive:artboard-draw:f".concat(_perfFrame), "rive:artboard-draw:start:f".concat(_perfFrame), "rive:artboard-draw:end:f".concat(_perfFrame));
                }
                renderer.restore();
                if (_perfFrame >= 0)
                    performance.mark("rive:renderer-flush:start:f".concat(_perfFrame));
                renderer.flush();
                if (_perfFrame >= 0) {
                    performance.mark("rive:renderer-flush:end:f".concat(_perfFrame));
                    performance.measure("rive:renderer-flush:f".concat(_perfFrame), "rive:renderer-flush:start:f".concat(_perfFrame), "rive:renderer-flush:end:f".concat(_perfFrame));
                }
                this._needsRedraw = false;
            }
        }
        // Add duration to create frame to durations array
        this.frameCount++;
        var after = performance.now();
        this.frameTimes.push(after);
        this.durations.push(after - before);
        while (this.frameTimes[0] <= after - 1000) {
            this.frameTimes.shift();
            this.durations.shift();
        }
        // Calling requestAnimationFrame will rerun draw() at the correct rate:
        // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_animations
        if (this.animator.isPlaying) {
            // Request a new rendering frame
            this.scheduleRendering();
        }
        else if (this.animator.isPaused) {
            // Reset the end time so on playback it starts at the correct frame
            this.lastRenderTime = 0;
        }
        else if (this.animator.isStopped) {
            // Reset animation instances, artboard and time
            // TODO: implement this properly when we have instancing
            // this.initArtboard();
            // this.drawFrame();
            this.lastRenderTime = 0;
        }
    };
    /**
     * Align the renderer
     */
    Rive.prototype.alignRenderer = function () {
        var _a = this, renderer = _a.renderer, runtime = _a.runtime, _layout = _a._layout, artboard = _a.artboard;
        // Align things up safe in the knowledge we can restore if changed
        renderer.align(_layout.runtimeFit(runtime), _layout.runtimeAlignment(runtime), {
            minX: _layout.minX,
            minY: _layout.minY,
            maxX: _layout.maxX,
            maxY: _layout.maxY,
        }, artboard.bounds, this._devicePixelRatioUsed * _layout.layoutScaleFactor);
    };
    Object.defineProperty(Rive.prototype, "fps", {
        get: function () {
            return this.durations.length;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rive.prototype, "frameTime", {
        get: function () {
            if (this.durations.length === 0) {
                return 0;
            }
            return (this.durations.reduce(function (a, b) { return a + b; }, 0) / this.durations.length).toFixed(4);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Cleans up all Wasm-generated objects that need to be manually destroyed:
     * artboard instances, animation instances, state machine instances,
     * renderer instance, file and runtime.
     *
     * Once this is called, you will need to initialise a new instance of the
     * Rive class
     */
    Rive.prototype.cleanup = function () {
        var _a, _b, _c, _d, _e;
        this.destroyed = true;
        // Stop the renderer if it hasn't already been stopped.
        this.stopRendering();
        // Make the GL context backing this renderer current before any WASM teardown
        // that frees GPU resources. Binding here covers the artboard/file deletes;
        // deleteRiveRenderer() re-binds for the renderer's own delete. No-op on the
        // canvas2d build
        (_b = (_a = this.renderer) === null || _a === void 0 ? void 0 : _a.bindContext) === null || _b === void 0 ? void 0 : _b.call(_a);
        // Clean up any artboard, animation or state machine instances.
        this.cleanupInstances();
        // Remove from observer
        if (this._observed !== null) {
            observers.remove(this._observed);
        }
        this.removeRiveListeners();
        // The file and its session go before the renderer: the session's replay
        // state lives in the renderer's context. But the renderer must let go of
        // the session first — its detach handle dies with session.delete(), and a
        // later detach would pass embind a deleted object.
        if (this.renderer) {
            (_d = (_c = this.renderer).detachSession) === null || _d === void 0 ? void 0 : _d.call(_c);
        }
        this.releaseCurrentRiveFile(/* isTeardown */ true);
        this.riveFile = null;
        this.deleteRiveRenderer();
        if (this._audioEventListener !== null) {
            audioManager.remove(this._audioEventListener);
            this._audioEventListener = null;
        }
        if (this._pageVisibilityHandler) {
            document.removeEventListener('visibilitychange', this._pageVisibilityHandler);
            this._pageVisibilityHandler = null;
        }
        (_e = this._viewModelInstance) === null || _e === void 0 ? void 0 : _e.cleanup();
        this._viewModelInstance = null;
        this._globalViewModelInstances.forEach(function (instance) { return instance.cleanup(); });
        this._globalViewModelInstances.clear();
        this._dataEnums = null;
    };
    /**
     * Drops this instance's hold on `this.riveFile`. A reference taken through
     * getInstance() is given back; a file we imported but never referenced is
     * released outright so its session goes with it. A caller-supplied file we
     * never referenced is left alone.
     *
     * `isTeardown` distinguishes cleanup() from a reload. Teardown always hands
     * the reference back, as it always has. A reload must not do that for a
     * caller-supplied file: a RiveFile carries no reference for its creator, so
     * releasing here would take the last one and destroy a file the caller still
     * holds.
     */
    Rive.prototype.releaseCurrentRiveFile = function (isTeardown) {
        var _a, _b;
        if (this.file) {
            if (isTeardown || this.ownsRiveFile) {
                (_a = this.riveFile) === null || _a === void 0 ? void 0 : _a.cleanup();
            }
            this.file = null;
        }
        else if (this.ownsRiveFile) {
            (_b = this.riveFile) === null || _b === void 0 ? void 0 : _b.destroyIfUnused();
        }
    };
    /**
     * Cleans up the Renderer object. Only call this API if you no longer
     * need to render Rive content in your session.
     */
    Rive.prototype.deleteRiveRenderer = function () {
        var _a, _b;
        if (this.renderer) {
            // A session outliving this renderer has to stop pointing at it, and its
            // replay state has to drop while this context is still alive. No-op when
            // nothing was ever attached.
            (_b = (_a = this.renderer).detachSession) === null || _b === void 0 ? void 0 : _b.call(_a);
            this.renderer.delete();
        }
        this.renderer = null;
    };
    Object.defineProperty(Rive.prototype, "deferredRendererActive", {
        /**
         * @experimental This API is early and may encounter breaking behavior change without a major version bump
         *
         * Whether this instance is rendering through a deferred session. False whenever
         * a fallback ran, whatever was requested.
         */
        get: function () {
            var _a, _b, _c;
            return (_c = (_b = (_a = this.renderer) === null || _a === void 0 ? void 0 : _a.deferredActive) === null || _b === void 0 ? void 0 : _b.call(_a)) !== null && _c !== void 0 ? _c : false;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Cleans up any Wasm-generated objects that need to be manually destroyed:
     * artboard instances, animation instances, state machine instances.
     *
     * Once this is called, things will need to be reinitialized or bad things
     * might happen.
     */
    Rive.prototype.cleanupInstances = function () {
        var _a;
        if (this.eventCleanup !== null) {
            this.eventCleanup();
        }
        this.cleanupKeyboardInteractions();
        // Tear down semantics before deleting state machines — the overlay's action
        // closures point at instances that stop() is about to free.
        this.cleanupSemantics();
        // Delete all animation and state machine instances synchronously via the
        // animator
        (_a = this.animator) === null || _a === void 0 ? void 0 : _a.stop();
        if (this.artboard) {
            this.artboard.delete();
            this.artboard = null;
        }
    };
    /**
     * Tries to query the setup Artboard for a text run node with the given name.
     *
     * @param textRunName - Name of the text run node associated with a text object
     * @returns - TextValueRun node or undefined if the text run cannot be queried
     */
    Rive.prototype.retrieveTextRun = function (textRunName) {
        var _a;
        if (!textRunName) {
            console.warn("No text run name provided");
            return;
        }
        if (!this.artboard) {
            console.warn("Tried to access text run, but the Artboard is null");
            return;
        }
        var textRun = this.artboard.textRun(textRunName);
        if (!textRun) {
            console.warn("Could not access a text run with name '".concat(textRunName, "' in the '").concat((_a = this.artboard) === null || _a === void 0 ? void 0 : _a.name, "' Artboard. Note that you must rename a text run node in the Rive editor to make it queryable at runtime."));
            return;
        }
        return textRun;
    };
    /**
     * Returns a string from a given text run node name, or undefined if the text run
     * cannot be queried.
     *
     * @deprecated Text run APIs are deprecated: use data binding instead. See
     * {@link https://rive.app/docs/editor/data-binding/migration-guide#updating-text-runs-at-runtime}
     * for how to migrate.
     * @param textRunName - Name of the text run node associated with a text object
     * @returns - String value of the text run node or undefined
     */
    Rive.prototype.getTextRunValue = function (textRunName) {
        warnOnce(DeprecationKeys.textRuns, textRunsDeprecationWarning);
        var textRun = this.retrieveTextRun(textRunName);
        return textRun ? textRun.text : undefined;
    };
    /**
     * Sets a text value for a given text run node name if possible
     *
     * @deprecated Text run APIs are deprecated: use data binding instead. See
     * {@link https://rive.app/docs/editor/data-binding/migration-guide#updating-text-runs-at-runtime}
     * for how to migrate.
     * @param textRunName - Name of the text run node associated with a text object
     * @param textRunValue - String value to set on the text run node
     */
    Rive.prototype.setTextRunValue = function (textRunName, textRunValue) {
        warnOnce(DeprecationKeys.textRuns, textRunsDeprecationWarning);
        var textRun = this.retrieveTextRun(textRunName);
        if (textRun) {
            textRun.text = textRunValue;
        }
    };
    /**
     * Warns when playback-control names match linear animations in the
     * Animator's instanced context; state machine playback remain supported.
     *
     * Remove for v3 release
     */
    Rive.prototype.warnIfLinearAnimationNames = function (names, methodName) {
        if (this.animator &&
            this.animator.animations.some(function (a) { return names.includes(a.name); })) {
            warnDeprecatedAnimationNames(methodName);
        }
    };
    /**
     * Plays specified animations or state machines; if none specified, it
     * unpauses everything.
     * @param animationNames Animation or state machine name(s) to play.
     *
     * Deprecated usage: passing linear animation names (control playback with a
     * state machine instead) and passing an array of names (this parameter
     * becomes a single string in the next major version).
     */
    Rive.prototype.play = function (animationNames, autoplay) {
        var _this = this;
        warnIfNamesArray(animationNames, "play");
        var names = mapToStringArray(animationNames);
        // If the file's not loaded, queue up the play
        if (!this.readyForPlaying) {
            this.taskQueue.add({
                action: function () { return _this.play(animationNames, autoplay); },
            });
            return;
        }
        this.animator.play(names);
        this.warnIfLinearAnimationNames(names, "play");
        this.syncSemanticsOnStateMachines();
        if (this.eventCleanup) {
            this.eventCleanup();
        }
        this.cleanupKeyboardInteractions();
        this.setupRiveListeners();
        this.startRendering();
    };
    /**
     * Pauses specified animations or state machines; if none specified, pauses
     * all.
     * @param animationNames Animation or state machine name(s) to pause.
     *
     * Deprecated usage: passing linear animation names (control playback with a
     * state machine instead) and passing an array of names (this parameter
     * becomes a single string in the next major version).
     */
    Rive.prototype.pause = function (animationNames) {
        var _this = this;
        warnIfNamesArray(animationNames, "pause");
        var names = mapToStringArray(animationNames);
        // If the file's not loaded, early out, nothing to pause
        if (!this.readyForPlaying) {
            this.taskQueue.add({
                action: function () { return _this.pause(animationNames); },
            });
            return;
        }
        if (this.eventCleanup) {
            this.eventCleanup();
        }
        this.cleanupKeyboardInteractions();
        this.animator.pause(names);
        this.warnIfLinearAnimationNames(names, "pause");
    };
    /**
     * Scrubs specified animations to the given time; if none specified, scrubs
     * all of them.
     * @deprecated `scrub()` will be removed in a future major version: use a
     * state machine to control playback instead
     */
    Rive.prototype.scrub = function (animationNames, value) {
        var _this = this;
        warnOnce(DeprecationKeys.scrub, "`scrub()` is deprecated and will be removed in a future major version: " +
            "use a state machine to control playback instead.");
        var names = mapToStringArray(animationNames);
        // If the file's not loaded, early out, nothing to pause
        if (!this.readyForPlaying) {
            this.taskQueue.add({
                action: function () { return _this.scrub(animationNames, value); },
            });
            return;
        }
        // Scrub the animation time; we draw a single frame here so that if
        // nothing's currently playing, the scrubbed animation is still rendered/
        this.animator.scrub(names, value || 0);
        this.drawFrame();
    };
    /**
     * Stops specified animations or state machines; if none specified, stops
     * them all.
     * @param animationNames Animation or state machine name(s) to stop.
     *
     * Deprecated usage: passing linear animation names (control playback with a
     * state machine instead) and passing an array of names (this parameter
     * becomes a single string in the next major version).
     */
    Rive.prototype.stop = function (animationNames) {
        var _this = this;
        warnIfNamesArray(animationNames, "stop");
        var names = mapToStringArray(animationNames);
        // If the file's not loaded, early out, nothing to pause
        if (!this.readyForPlaying) {
            this.taskQueue.add({
                action: function () { return _this.stop(animationNames); },
            });
            return;
        }
        this.warnIfLinearAnimationNames(names, "stop");
        // If there is no artboard, this.animator will be undefined
        if (this.animator) {
            this.animator.stop(names);
        }
        if (this.eventCleanup) {
            this.eventCleanup();
        }
        this.cleanupKeyboardInteractions();
        this.cleanupSemantics();
    };
    /**
     * Resets the animation
     * @param artboard the name of the artboard, or default if none given
     * @param stateMachine the name of the state machine for playback
     * @param autoplay whether to autoplay when reset, defaults to false
     *
     */
    Rive.prototype.reset = function (params) {
        var _a, _b;
        // Get the current artboard, animations, state machines, and playback states
        var artBoardName = params === null || params === void 0 ? void 0 : params.artboard;
        var _c = resolveStartingPlayback({
            stateMachine: params === null || params === void 0 ? void 0 : params.stateMachine,
            animations: params === null || params === void 0 ? void 0 : params.animations,
            stateMachines: params === null || params === void 0 ? void 0 : params.stateMachines,
        }), animationNames = _c.startingAnimationNames, stateMachineNames = _c.startingStateMachineNames;
        var autoplay = (_a = params === null || params === void 0 ? void 0 : params.autoplay) !== null && _a !== void 0 ? _a : false;
        var autoBind = (_b = params === null || params === void 0 ? void 0 : params.autoBind) !== null && _b !== void 0 ? _b : false;
        // Stop everything and clean up
        this.cleanupInstances();
        // Reinitialize an artboard instance with the state
        this.initArtboard(artBoardName, animationNames, stateMachineNames, autoplay, autoBind);
        // Only drain the task queue once playback commands can execute; tasks
        // queued before then re-add themselves in a loop.
        if (this.readyForPlaying) {
            this.taskQueue.process();
        }
    };
    // Loads a new Rive file, keeping listeners in place
    Rive.prototype.load = function (params) {
        // Before stop(), so a call with no source leaves playback running.
        if (!params.src && !params.buffer && !params.riveFile) {
            throw new RiveError(Rive.missingErrorMessage);
        }
        // Stop all animations
        this.stop();
        // Reinitialize
        this.init(params);
    };
    Object.defineProperty(Rive.prototype, "layout", {
        /**
         * Returns the current layout. Note that layout should be treated as
         * immutable. If you want to change the layout, create a new one use the
         * layout setter
         */
        get: function () {
            return this._layout;
        },
        // Sets a new layout
        set: function (layout) {
            this._layout = layout;
            this.reportDisplayScale();
            // Fit/alignment/bounds feed the overlay transform.
            this._overlayTransformDirty = true;
            // If the maxX or maxY are 0, then set them to the canvas width and height
            if (!layout.maxX || !layout.maxY) {
                this.resizeToCanvas();
            }
            if (this.loaded && !this.animator.isPlaying) {
                this.drawFrame();
            }
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Sets the layout bounds to the current canvas size; this is typically called
     * when the canvas is resized
     */
    Rive.prototype.resizeToCanvas = function () {
        this._layout = this.layout.copyWith({
            minX: 0,
            minY: 0,
            maxX: this.canvas.width,
            maxY: this.canvas.height,
        });
        // Layout bounds feed the overlay transform.
        this._overlayTransformDirty = true;
    };
    /**
     * Accounts for devicePixelRatio as a multiplier to render the size of the canvas drawing surface.
     * Uses the size of the backing canvas to set new width/height attributes. Need to re-render
     * and resize the layout to match the new drawing surface afterwards.
     * Useful function for consumers to include in a window resize listener.
     *
     * This method will set the {@link devicePixelRatioUsed} property.
     *
     * Optionally, you can provide a {@link customDevicePixelRatio} to provide a
     * custom value.
     */
    Rive.prototype.resizeDrawingSurfaceToCanvas = function (customDevicePixelRatio) {
        if (this.canvas instanceof HTMLCanvasElement && !!window) {
            var _a = this.canvas.getBoundingClientRect(), width = _a.width, height = _a.height;
            var dpr = customDevicePixelRatio || window.devicePixelRatio || 1;
            this.devicePixelRatioUsed = dpr;
            this.canvas.width = dpr * width;
            this.canvas.height = dpr * height;
            this._needsRedraw = true;
            this.resizeToCanvas();
            if (this.layout.fit === Fit.Layout && this.artboard) {
                var scaleFactor = this._layout.layoutScaleFactor;
                this.artboard.width = width / scaleFactor;
                this.artboard.height = height / scaleFactor;
            }
            this.drawFrame();
        }
    };
    Object.defineProperty(Rive.prototype, "source", {
        // Returns the animation source, which may be undefined
        get: function () {
            return this.src;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rive.prototype, "activeArtboard", {
        /**
         * Returns the name of the active artboard
         */
        get: function () {
            return this.artboard ? this.artboard.name : "";
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rive.prototype, "semanticTree", {
        /**
         * Returns the semantic tree model when semantics are enabled, or null.
         * The overlay and external consumers use this to inspect the
         * current state of the semantic tree.
         */
        get: function () {
            return this._semanticTree;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rive.prototype, "accessibilityOverlay", {
        /**
         * Returns the accessibility overlay when semantics are enabled, or null.
         * External consumers can use this to inspect the
         * current state of the accessibility overlay for this instance.
         */
        get: function () {
            return this._accessibilityOverlay;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rive.prototype, "animationNames", {
        // Returns a list of animation names on the chosen artboard
        get: function () {
            // If the file's not loaded, we got nothing to return
            if (!this.loaded || !this.artboard) {
                return [];
            }
            var animationNames = [];
            for (var i = 0; i < this.artboard.animationCount(); i++) {
                animationNames.push(this.artboard.animationByIndex(i).name);
            }
            return animationNames;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rive.prototype, "stateMachineNames", {
        /**
         * Returns a list of state machine names from the current artboard
         */
        get: function () {
            // If the file's not loaded, we got nothing to return
            if (!this.loaded || !this.artboard) {
                return [];
            }
            var stateMachineNames = [];
            for (var i = 0; i < this.artboard.stateMachineCount(); i++) {
                stateMachineNames.push(this.artboard.stateMachineByIndex(i).name);
            }
            return stateMachineNames;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Returns the inputs for the specified instanced state machine, or an empty
     * list if the name is invalid or the state machine is not instanced. Returns
     * undefined if the file is not loaded yet.
     *
     * @deprecated State machine inputs are deprecated: use data binding
     * properties instead. See
     * {@link https://rive.app/docs/editor/data-binding/migration-guide#state-machine-inputs}
     * for how to migrate.
     * @param name the state machine name
     * @returns the inputs for the named state machine or undefined
     */
    Rive.prototype.stateMachineInputs = function (name) {
        warnOnce(DeprecationKeys.stateMachineInputs, stateMachineInputsDeprecationWarning);
        // If the file's not loaded, early out, nothing to pause
        if (!this.loaded) {
            return;
        }
        var stateMachine = this.animator.stateMachines.find(function (m) { return m.name === name; });
        return stateMachine === null || stateMachine === void 0 ? void 0 : stateMachine.inputs;
    };
    // Returns the input with the provided name at the given path
    Rive.prototype.retrieveInputAtPath = function (name, path) {
        if (!name) {
            console.warn("No input name provided for path '".concat(path, "'"));
            return;
        }
        if (!this.artboard) {
            console.warn("Tried to access input: '".concat(name, "', at path: '").concat(path, "', but the Artboard is null"));
            return;
        }
        var input = this.artboard.inputByPath(name, path);
        if (!input) {
            console.warn("Could not access an input with name: '".concat(name, "', at path:'").concat(path, "'"));
            return;
        }
        return input;
    };
    /**
     * Set the boolean input with the provided name at the given path with value
     * @deprecated State machine inputs are deprecated: use data binding
     * properties instead. See
     * {@link https://rive.app/docs/editor/data-binding/migration-guide#state-machine-inputs}
     * for how to migrate.
     * @param input the state machine input name
     * @param value the value to set the input to
     * @param path the path the input is located at an artboard level
     */
    Rive.prototype.setBooleanStateAtPath = function (inputName, value, path) {
        warnOnce(DeprecationKeys.stateMachineInputs, stateMachineInputsDeprecationWarning);
        var input = this.retrieveInputAtPath(inputName, path);
        if (!input)
            return;
        if (input.type === StateMachineInputType.Boolean) {
            input.asBool().value = value;
        }
        else {
            console.warn("Input with name: '".concat(inputName, "', at path:'").concat(path, "' is not a boolean"));
        }
    };
    /**
     * Set the number input with the provided name at the given path with value
     * @deprecated State machine inputs are deprecated: use data binding
     * properties instead. See
     * {@link https://rive.app/docs/editor/data-binding/migration-guide#state-machine-inputs}
     * for how to migrate.
     * @param input the state machine input name
     * @param value the value to set the input to
     * @param path the path the input is located at an artboard level
     */
    Rive.prototype.setNumberStateAtPath = function (inputName, value, path) {
        warnOnce(DeprecationKeys.stateMachineInputs, stateMachineInputsDeprecationWarning);
        var input = this.retrieveInputAtPath(inputName, path);
        if (!input)
            return;
        if (input.type === StateMachineInputType.Number) {
            input.asNumber().value = value;
        }
        else {
            console.warn("Input with name: '".concat(inputName, "', at path:'").concat(path, "' is not a number"));
        }
    };
    /**
     * Fire the trigger with the provided name at the given path
     * @deprecated State machine inputs are deprecated: use data binding
     * properties instead. See
     * {@link https://rive.app/docs/editor/data-binding/migration-guide#state-machine-inputs}
     * for how to migrate.
     * @param input the state machine input name
     * @param path the path the input is located at an artboard level
     */
    Rive.prototype.fireStateAtPath = function (inputName, path) {
        warnOnce(DeprecationKeys.stateMachineInputs, stateMachineInputsDeprecationWarning);
        var input = this.retrieveInputAtPath(inputName, path);
        if (!input)
            return;
        if (input.type === StateMachineInputType.Trigger) {
            input.asTrigger().fire();
        }
        else {
            console.warn("Input with name: '".concat(inputName, "', at path:'").concat(path, "' is not a trigger"));
        }
    };
    // Returns the TextValueRun object for the provided name at the given path
    Rive.prototype.retrieveTextAtPath = function (name, path) {
        if (!name) {
            console.warn("No text name provided for path '".concat(path, "'"));
            return;
        }
        if (!path) {
            console.warn("No path provided for text '".concat(name, "'"));
            return;
        }
        if (!this.artboard) {
            console.warn("Tried to access text: '".concat(name, "', at path: '").concat(path, "', but the Artboard is null"));
            return;
        }
        var text = this.artboard.textByPath(name, path);
        if (!text) {
            console.warn("Could not access text with name: '".concat(name, "', at path:'").concat(path, "'"));
            return;
        }
        return text;
    };
    /**
     * Retrieves the text value for a specified text run at a given path
     * @param textName The name of the text run
     * @param path The path to the text run within the artboard
     * @returns The text value of the text run, or undefined if not found
     *
     * @example
     * // Get the text value for a text run named "title" at one nested artboard deep
     * const titleText = riveInstance.getTextRunValueAtPath("title", "artboard1");
     *
     * @example
     * // Get the text value for a text run named "subtitle" within a nested group two artboards deep
     * const subtitleText = riveInstance.getTextRunValueAtPath("subtitle", "group/nestedGroup");
     *
     * @remarks
     * If the text run cannot be found at the specified path, a warning will be logged to the console.
     *
     * @deprecated Text run APIs are deprecated: use data binding instead. See
     * {@link https://rive.app/docs/editor/data-binding/migration-guide#updating-text-runs-at-runtime}
     * for how to migrate.
     */
    Rive.prototype.getTextRunValueAtPath = function (textName, path) {
        warnOnce(DeprecationKeys.textRuns, textRunsDeprecationWarning);
        var run = this.retrieveTextAtPath(textName, path);
        if (!run) {
            console.warn("Could not get text with name: '".concat(textName, "', at path:'").concat(path, "'"));
            return;
        }
        return run.text;
    };
    /**
     * Sets the text value for a specified text run at a given path
     * @param textName The name of the text run
     * @param value The new text value to set
     * @param path The path to the text run within the artboard
     * @returns void
     *
     * @example
     * // Set the text value for a text run named "title" at one nested artboard deep
     * riveInstance.setTextRunValueAtPath("title", "New Title", "artboard1");
     *
     * @example
     * // Set the text value for a text run named "subtitle" within a nested group two artboards deep
     * riveInstance.setTextRunValueAtPath("subtitle", "New Subtitle", "group/nestedGroup");
     *
     * @remarks
     * If the text run cannot be found at the specified path, a warning will be logged to the console.
     *
     * @deprecated Text run APIs are deprecated: use data binding instead. See
     * {@link https://rive.app/docs/editor/data-binding/migration-guide#updating-text-runs-at-runtime}
     * for how to migrate.
     */
    Rive.prototype.setTextRunValueAtPath = function (textName, value, path) {
        warnOnce(DeprecationKeys.textRuns, textRunsDeprecationWarning);
        var run = this.retrieveTextAtPath(textName, path);
        if (!run) {
            console.warn("Could not set text with name: '".concat(textName, "', at path:'").concat(path, "'"));
            return;
        }
        run.text = value;
    };
    Object.defineProperty(Rive.prototype, "playingStateMachineNames", {
        // Returns a list of playing machine names
        get: function () {
            // If the file's not loaded, we got nothing to return
            if (!this.loaded) {
                return [];
            }
            return this.animator.stateMachines
                .filter(function (m) { return m.playing; })
                .map(function (m) { return m.name; });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rive.prototype, "playingAnimationNames", {
        // Returns a list of playing animation names
        get: function () {
            // If the file's not loaded, we got nothing to return
            if (!this.loaded) {
                return [];
            }
            return this.animator.animations.filter(function (a) { return a.playing; }).map(function (a) { return a.name; });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rive.prototype, "pausedAnimationNames", {
        // Returns a list of paused animation names
        get: function () {
            // If the file's not loaded, we got nothing to return
            if (!this.loaded) {
                return [];
            }
            return this.animator.animations
                .filter(function (a) { return !a.playing; })
                .map(function (a) { return a.name; });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rive.prototype, "pausedStateMachineNames", {
        /**
         *  Returns a list of paused machine names
         * @returns a list of state machine names that are paused
         */
        get: function () {
            // If the file's not loaded, we got nothing to return
            if (!this.loaded) {
                return [];
            }
            return this.animator.stateMachines
                .filter(function (m) { return !m.playing; })
                .map(function (m) { return m.name; });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rive.prototype, "isPlaying", {
        /**
         * @returns true if any animation is playing
         */
        get: function () {
            return this.animator.isPlaying;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rive.prototype, "isPaused", {
        /**
         * @returns true if all instanced animations are paused
         */
        get: function () {
            return this.animator.isPaused;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rive.prototype, "isStopped", {
        /**
         * @returns true if no animations are playing or paused
         */
        get: function () {
            var _a, _b;
            return (_b = (_a = this.animator) === null || _a === void 0 ? void 0 : _a.isStopped) !== null && _b !== void 0 ? _b : true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rive.prototype, "bounds", {
        /**
         * @returns the bounds of the current artboard, or undefined if the artboard
         * isn't loaded yet.
         */
        get: function () {
            return this.artboard ? this.artboard.bounds : undefined;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Subscribe to Rive-generated events
     *
     * Note: subscribing to {@link EventType.RiveEvent},
     * {@link EventType.StateChange}, or {@link EventType.Loop} is deprecated;
     * use data binding instead. See
     * {@link https://rive.app/docs/runtimes/web/rive-events} (Rive Events) and
     * {@link https://rive.app/docs/editor/data-binding/migration-guide} for how
     * to migrate Rive graphics to a data binding workflow instead.
     * @param type the type of event to subscribe to
     * @param callback callback to fire when the event occurs
     */
    Rive.prototype.on = function (type, callback) {
        if (type === EventType.RiveEvent) {
            warnOnce(DeprecationKeys.riveEvents, riveEventsDeprecationWarning);
        }
        else if (type === EventType.StateChange) {
            warnOnce(DeprecationKeys.stateChangeEvents, stateChangeEventsDeprecationWarning);
        }
        else if (type === EventType.Loop) {
            warnOnce(DeprecationKeys.loopEvents, loopEventsDeprecationWarning);
        }
        this.eventManager.add({
            type: type,
            callback: callback,
        });
    };
    /**
     * Unsubscribes from a Rive-generated event
     * @param type the type of event to unsubscribe from
     * @param callback the callback to unsubscribe
     */
    Rive.prototype.off = function (type, callback) {
        this.eventManager.remove({
            type: type,
            callback: callback,
        });
    };
    /**
     * Unsubscribes from a Rive-generated event
     * @deprecated
     * @param callback the callback to unsubscribe from
     */
    Rive.prototype.unsubscribe = function (type, callback) {
        warnOnce(DeprecationKeys.legacyUnsubscribe, "This function is deprecated: please use `off()` instead.");
        this.off(type, callback);
    };
    /**
     * Unsubscribes all Rive listeners from an event type, or everything if no type is
     * given
     * @param type the type of event to unsubscribe from, or all types if
     * undefined
     */
    Rive.prototype.removeAllRiveEventListeners = function (type) {
        this.eventManager.removeAll(type);
    };
    /**
     * Unsubscribes all listeners from an event type, or everything if no type is
     * given
     * @deprecated
     * @param type the type of event to unsubscribe from, or all types if
     * undefined
     */
    Rive.prototype.unsubscribeAll = function (type) {
        warnOnce(DeprecationKeys.legacyUnsubscribe, "This function is deprecated: please use `removeAllRiveEventListeners()` instead.");
        this.removeAllRiveEventListeners(type);
    };
    /**
     * Stops the rendering loop; this is different from pausing in that it doesn't
     * change the state of any animation. It stops rendering from occurring. This
     * is designed for situations such as when Rive isn't visible.
     *
     * The only way to start rendering again is to call `startRendering`.
     * Animations that are marked as playing will start from the position that
     * they would have been at if rendering had not been stopped.
     */
    Rive.prototype.stopRendering = function () {
        this._explicitlyStoppedRendering = true;
        if (this.loaded && this.frameRequestId) {
            if (this.runtime.cancelAnimationFrame) {
                this.runtime.cancelAnimationFrame(this.frameRequestId);
            }
            else {
                cancelAnimationFrame(this.frameRequestId);
            }
            this.frameRequestId = null;
        }
    };
    /**
     * Starts the rendering loop if it has been previously stopped. If the
     * renderer is already active, then this will have zero effect.
     */
    Rive.prototype.startRendering = function () {
        this._explicitlyStoppedRendering = false;
        this.drawFrame();
    };
    Rive.prototype.scheduleRendering = function () {
        if (this.loaded && this.artboard && !this.frameRequestId) {
            if (this.runtime.requestAnimationFrame) {
                this.frameRequestId = this.runtime.requestAnimationFrame(this._boundDraw);
            }
            else {
                this.frameRequestId = requestAnimationFrame(this._boundDraw);
            }
        }
    };
    /**
     * Called when document.visibilitychange fires (tab change, window minimize, etc.).
     * Cancels the rAF loop on hide and resets the time reference so that no accumulated time is
     * applied to state machines when the tab becomes visible again. This prevents state machine
     * advances with large time deltas when rAF starts up again.
     */
    Rive.prototype._onPageVisibilityChange = function () {
        var _a, _b;
        if (document.hidden) {
            if (this.frameRequestId !== null) {
                if ((_a = this.runtime) === null || _a === void 0 ? void 0 : _a.cancelAnimationFrame) {
                    this.runtime.cancelAnimationFrame(this.frameRequestId);
                }
                else {
                    cancelAnimationFrame(this.frameRequestId);
                }
                this.frameRequestId = null;
            }
            // Reset so the first resumed frame starts with elapsedTime === 0.
            this.lastRenderTime = 0;
        }
        else if (((_b = this.animator) === null || _b === void 0 ? void 0 : _b.isPlaying) && !this._explicitlyStoppedRendering) {
            this.scheduleRendering();
        }
    };
    /**
     * Enables frames-per-second (FPS) reporting for the runtime
     * If no callback is provided, Rive will append a fixed-position div at the top-right corner of
     * the page with the FPS reading
     * @param fpsCallback - Callback from the runtime during the RAF loop that supplies the FPS value
     */
    Rive.prototype.enableFPSCounter = function (fpsCallback) {
        this.runtime.enableFPSCounter(fpsCallback);
    };
    /**
     * Disables frames-per-second (FPS) reporting for the runtime
     */
    Rive.prototype.disableFPSCounter = function () {
        this.runtime.disableFPSCounter();
    };
    Object.defineProperty(Rive.prototype, "contents", {
        /**
         * Returns the contents of a Rive file: the artboards, animations, and state machines
         */
        get: function () {
            if (!this.loaded) {
                return undefined;
            }
            var riveContents = {
                artboards: [],
            };
            for (var i = 0; i < this.file.artboardCount(); i++) {
                var artboard = this.file.artboardByIndex(i);
                var artboardContents = {
                    name: artboard.name,
                    animations: [],
                    stateMachines: [],
                };
                for (var j = 0; j < artboard.animationCount(); j++) {
                    var animation = artboard.animationByIndex(j);
                    artboardContents.animations.push(animation.name);
                }
                for (var k = 0; k < artboard.stateMachineCount(); k++) {
                    var stateMachine = artboard.stateMachineByIndex(k);
                    var name_2 = stateMachine.name;
                    var instance = new this.runtime.StateMachineInstance(stateMachine, artboard);
                    var inputContents = [];
                    for (var l = 0; l < instance.inputCount(); l++) {
                        var input = instance.input(l);
                        inputContents.push({ name: input.name, type: input.type });
                    }
                    artboardContents.stateMachines.push({
                        name: name_2,
                        inputs: inputContents,
                    });
                }
                riveContents.artboards.push(artboardContents);
            }
            return riveContents;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rive.prototype, "volume", {
        /**
         * Getter / Setter for the volume of the artboard
         */
        get: function () {
            if (this.artboard && this.artboard.volume !== this._volume) {
                this._volume = this.artboard.volume;
            }
            return this._volume;
        },
        set: function (value) {
            this._volume = value;
            if (this.artboard) {
                this.artboard.volume = value * audioManager.systemVolume;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rive.prototype, "artboardWidth", {
        /**
         * The width of the artboard.
         *
         * This will return 0 if the artboard is not loaded yet and a custom
         * width has not been set.
         *
         * Do not set this value manually when using {@link resizeDrawingSurfaceToCanvas}
         * with a {@link Layout.fit} of {@link Fit.Layout}, as the artboard width is
         * automatically set.
         */
        get: function () {
            var _a;
            if (this.artboard) {
                return this.artboard.width;
            }
            return (_a = this._artboardWidth) !== null && _a !== void 0 ? _a : 0;
        },
        set: function (value) {
            this._artboardWidth = value;
            if (this.artboard) {
                this.artboard.width = value;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rive.prototype, "artboardHeight", {
        /**
         * The height of the artboard.
         *
         * This will return 0 if the artboard is not loaded yet and a custom
         * height has not been set.
         *
         * Do not set this value manually when using {@link resizeDrawingSurfaceToCanvas}
         * with a {@link Layout.fit} of {@link Fit.Layout}, as the artboard height is
         * automatically set.
         */
        get: function () {
            var _a;
            if (this.artboard) {
                return this.artboard.height;
            }
            return (_a = this._artboardHeight) !== null && _a !== void 0 ? _a : 0;
        },
        set: function (value) {
            this._artboardHeight = value;
            if (this.artboard) {
                this.artboard.height = value;
            }
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Reset the artboard size to its original values.
     */
    Rive.prototype.resetArtboardSize = function () {
        if (this.artboard) {
            this.artboard.resetArtboardSize();
            this._artboardWidth = this.artboard.width;
            this._artboardHeight = this.artboard.height;
        }
        else {
            // If the artboard isn't loaded, we need to reset the custom width and height
            this._artboardWidth = undefined;
            this._artboardHeight = undefined;
        }
    };
    Object.defineProperty(Rive.prototype, "devicePixelRatioUsed", {
        /**
         * The device pixel ratio used in rendering and canvas/artboard resizing.
         *
         * This value will be overidden by the device pixel ratio used in
         * {@link resizeDrawingSurfaceToCanvas}. If you use that method, do not set this value.
         */
        get: function () {
            return this._devicePixelRatioUsed;
        },
        set: function (value) {
            if (value !== this._devicePixelRatioUsed) {
                this._overlayTransformDirty = true;
            }
            this._devicePixelRatioUsed = value;
            this.reportDisplayScale();
        },
        enumerable: false,
        configurable: true
    });
    // Not per frame: the scale is per file, and instances sharing one would trade
    // it every frame.
    Rive.prototype.reportDisplayScale = function () {
        var _a;
        (_a = this.file) === null || _a === void 0 ? void 0 : _a.displayScale(this._devicePixelRatioUsed * this._layout.layoutScaleFactor);
    };
    /**
     * Sets the main view model instance and applies it (rebinds). Equivalent to
     * `setViewModelInstance(vmi)` followed by `bind()`.
     */
    Rive.prototype.bindViewModelInstance = function (viewModelInstance) {
        if (!viewModelInstance) {
            return;
        }
        this.setViewModelInstance(viewModelInstance);
        this.bind();
    };
    /**
     * Sets the main view model instance in the data context WITHOUT rebinding.
     * Call {@link bind} to apply. Use this with {@link setGlobalViewModelInstance}
     * to batch multiple changes into a single rebind.
     */
    Rive.prototype.setViewModelInstance = function (viewModelInstance) {
        var _a;
        var runtimeInstance = viewModelInstance === null || viewModelInstance === void 0 ? void 0 : viewModelInstance.runtimeInstance;
        if (!this.artboard ||
            this.destroyed ||
            !viewModelInstance ||
            !runtimeInstance) {
            return;
        }
        viewModelInstance.internalIncrementReferenceCount();
        (_a = this._viewModelInstance) === null || _a === void 0 ? void 0 : _a.cleanup();
        this._viewModelInstance = viewModelInstance;
        if (this.animator.stateMachines.length > 0) {
            this.animator.stateMachines.forEach(function (stateMachine) {
                return stateMachine.instance.setViewModelInstance(runtimeInstance);
            });
        }
        else {
            this.artboard.setViewModelInstance(runtimeInstance);
        }
    };
    /**
     * Applies any pending `set*` view model instance changes by rebinding the
     * data binds once.
     * Implicitly creates and binds any view models that have not been set.
     */
    Rive.prototype.bind = function () {
        if (!this.artboard || this.destroyed) {
            return;
        }
        if (this.animator.stateMachines.length > 0) {
            this.animator.stateMachines.forEach(function (stateMachine) {
                return stateMachine.instance.bind();
            });
        }
        else {
            this.artboard.bind();
        }
    };
    Object.defineProperty(Rive.prototype, "viewModelInstance", {
        get: function () {
            return this._viewModelInstance;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Sets (or replaces) the global view model instance for the given global view
     * model name in the data context WITHOUT rebinding. The main instance and any
     * other globals keep their order. Call {@link bind} to apply — batch several
     * `set*` calls then a single `bind()` to avoid rebinding per set.
     * @param name - the name of the global view model
     * @param viewModelInstance - the instance to set for that global
     * @returns whether the instance was set (false if `name` does not match a
     * global view model in the file)
     */
    Rive.prototype.setGlobalViewModelInstance = function (name, viewModelInstance) {
        var _a;
        var runtimeInstance = viewModelInstance === null || viewModelInstance === void 0 ? void 0 : viewModelInstance.runtimeInstance;
        if (!this.artboard || this.destroyed || !runtimeInstance) {
            return false;
        }
        var bound = false;
        if (this.animator.stateMachines.length > 0) {
            this.animator.stateMachines.forEach(function (stateMachine) {
                if (stateMachine.instance.setGlobalViewModelInstance(name, runtimeInstance)) {
                    bound = true;
                }
            });
        }
        else {
            bound = this.artboard.setGlobalViewModelInstance(name, runtimeInstance);
        }
        if (bound) {
            viewModelInstance.internalIncrementReferenceCount();
            (_a = this._globalViewModelInstances.get(name)) === null || _a === void 0 ? void 0 : _a.cleanup();
            this._globalViewModelInstances.set(name, viewModelInstance);
        }
        return bound;
    };
    /**
     * @param name - the name of the global view model
     * @returns the global view model instance bound under the given name — the
     * instance set via {@link setGlobalViewModelInstance} or one created by
     * auto-bind — or null if none has been set/created for that name (globals are
     * not auto-created; the getter never creates one).
     */
    Rive.prototype.globalViewModelInstance = function (name) {
        var cached = this._globalViewModelInstances.get(name);
        if (cached) {
            return cached;
        }
        if (!this.artboard || this.destroyed) {
            return null;
        }
        // State machines share the artboard's data context; query the first one
        // when present (mirroring how the setter routes), otherwise the artboard.
        // This is a pure read — it returns null unless an instance was set/bound.
        var runtimeInstance = this.animator.stateMachines.length > 0
            ? this.animator.stateMachines[0].instance.globalViewModelInstance(name)
            : this.artboard.globalViewModelInstance(name);
        if (runtimeInstance === null) {
            return null;
        }
        var viewModelInstance = new ViewModelInstance(runtimeInstance, null);
        (0,_utils__WEBPACK_IMPORTED_MODULE_3__.createFinalization)(viewModelInstance, runtimeInstance);
        viewModelInstance.internalIncrementReferenceCount();
        this._globalViewModelInstances.set(name, viewModelInstance);
        return viewModelInstance;
    };
    /**
     * @returns the names of the file's global view models, in file order. Use
     * these with {@link setGlobalViewModelInstance} / {@link globalViewModelInstance}.
     */
    Rive.prototype.globalViewModelNames = function () {
        var _a, _b;
        return (_b = (_a = this.file) === null || _a === void 0 ? void 0 : _a.globalViewModelNames()) !== null && _b !== void 0 ? _b : [];
    };
    Rive.prototype.viewModelByIndex = function (index) {
        var viewModel = this.file.viewModelByIndex(index);
        if (viewModel !== null) {
            return new ViewModel(viewModel);
        }
        return null;
    };
    Rive.prototype.viewModelByName = function (name) {
        var _a;
        return (_a = this.riveFile) === null || _a === void 0 ? void 0 : _a.viewModelByName(name);
    };
    Rive.prototype.enums = function () {
        if (this._dataEnums === null) {
            var dataEnums = this.file.enums();
            this._dataEnums = dataEnums.map(function (dataEnum) {
                return new DataEnum(dataEnum);
            });
        }
        return this._dataEnums;
    };
    Rive.prototype.defaultViewModel = function () {
        if (this.artboard) {
            var viewModel = this.file.defaultArtboardViewModel(this.artboard);
            if (viewModel) {
                return new ViewModel(viewModel);
            }
        }
        return null;
    };
    /**
     * @deprecated This function is deprecated. For better stability and memory management
     * use `getBindableArtboard()` instead.
     * @param {string} name - The name of the artboard.
     * @returns {Artboard} The artboard to bind to.
     */
    Rive.prototype.getArtboard = function (name) {
        var _a, _b;
        return (_b = (_a = this.riveFile) === null || _a === void 0 ? void 0 : _a.getArtboard(name)) !== null && _b !== void 0 ? _b : null;
    };
    Rive.prototype.getBindableArtboard = function (name) {
        var _a, _b;
        return (_b = (_a = this.riveFile) === null || _a === void 0 ? void 0 : _a.getBindableArtboard(name)) !== null && _b !== void 0 ? _b : null;
    };
    Rive.prototype.getDefaultBindableArtboard = function () {
        var _a, _b;
        return (_b = (_a = this.riveFile) === null || _a === void 0 ? void 0 : _a.getDefaultBindableArtboard()) !== null && _b !== void 0 ? _b : null;
    };
    /**
     * Clear focus applicable to active state machines with focus nodes. Useful if users want to
     * reset focus state and behavior within the Rive graphic at any point (i.e. blurring off the canvas)
     */
    Rive.prototype.clearFocus = function () {
        var playingStateMachines = this.animator.stateMachines.filter(function (sm) { return sm.playing && sm.hasFocusNodes; });
        playingStateMachines.forEach(function (sm) { return sm.clearFocus(); });
    };
    // Error message for missing source or buffer
    Rive.missingErrorMessage = "Rive source file or data buffer required";
    // Error message for removed rive file
    Rive.cleanupErrorMessage = "Attempt to use file after calling cleanup.";
    return Rive;
}());

var DataType;
(function (DataType) {
    DataType["none"] = "none";
    DataType["string"] = "string";
    DataType["number"] = "number";
    DataType["boolean"] = "boolean";
    DataType["color"] = "color";
    DataType["list"] = "list";
    DataType["enumType"] = "enumType";
    DataType["trigger"] = "trigger";
    DataType["viewModel"] = "viewModel";
    DataType["integer"] = "integer";
    DataType["listIndex"] = "listIndex";
    DataType["image"] = "image";
    DataType["artboard"] = "artboard";
})(DataType || (DataType = {}));
var ViewModel = /** @class */ (function () {
    function ViewModel(viewModel) {
        this._viewModel = viewModel;
    }
    Object.defineProperty(ViewModel.prototype, "instanceCount", {
        get: function () {
            return this._viewModel.instanceCount;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ViewModel.prototype, "name", {
        get: function () {
            return this._viewModel.name;
        },
        enumerable: false,
        configurable: true
    });
    ViewModel.prototype.instanceByIndex = function (index) {
        var instance = this._viewModel.instanceByIndex(index);
        if (instance !== null) {
            var viewModelInstance = new ViewModelInstance(instance, null);
            (0,_utils__WEBPACK_IMPORTED_MODULE_3__.createFinalization)(viewModelInstance, instance);
            return viewModelInstance;
        }
        return null;
    };
    ViewModel.prototype.instanceByName = function (name) {
        var instance = this._viewModel.instanceByName(name);
        if (instance !== null) {
            var viewModelInstance = new ViewModelInstance(instance, null);
            (0,_utils__WEBPACK_IMPORTED_MODULE_3__.createFinalization)(viewModelInstance, instance);
            return viewModelInstance;
        }
        return null;
    };
    ViewModel.prototype.defaultInstance = function () {
        var runtimeInstance = this._viewModel.defaultInstance();
        if (runtimeInstance !== null) {
            var viewModelInstance = new ViewModelInstance(runtimeInstance, null);
            (0,_utils__WEBPACK_IMPORTED_MODULE_3__.createFinalization)(viewModelInstance, runtimeInstance);
            return viewModelInstance;
        }
        return null;
    };
    ViewModel.prototype.instance = function () {
        var runtimeInstance = this._viewModel.instance();
        if (runtimeInstance !== null) {
            var viewModelInstance = new ViewModelInstance(runtimeInstance, null);
            (0,_utils__WEBPACK_IMPORTED_MODULE_3__.createFinalization)(viewModelInstance, runtimeInstance);
            return viewModelInstance;
        }
        return null;
    };
    Object.defineProperty(ViewModel.prototype, "properties", {
        get: function () {
            return this._viewModel.getProperties();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ViewModel.prototype, "instanceNames", {
        get: function () {
            return this._viewModel.getInstanceNames();
        },
        enumerable: false,
        configurable: true
    });
    return ViewModel;
}());

var DataEnum = /** @class */ (function () {
    function DataEnum(dataEnum) {
        this._dataEnum = dataEnum;
    }
    Object.defineProperty(DataEnum.prototype, "name", {
        get: function () {
            return this._dataEnum.name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DataEnum.prototype, "values", {
        get: function () {
            return this._dataEnum.values;
        },
        enumerable: false,
        configurable: true
    });
    return DataEnum;
}());

var PropertyType;
(function (PropertyType) {
    PropertyType["Number"] = "number";
    PropertyType["String"] = "string";
    PropertyType["Boolean"] = "boolean";
    PropertyType["Color"] = "color";
    PropertyType["Trigger"] = "trigger";
    PropertyType["Enum"] = "enum";
    PropertyType["List"] = "list";
    PropertyType["Image"] = "image";
    PropertyType["Font"] = "font";
    PropertyType["Artboard"] = "artboard";
})(PropertyType || (PropertyType = {}));
var ViewModelInstance = /** @class */ (function () {
    function ViewModelInstance(runtimeInstance, parent) {
        this._parents = [];
        this._children = [];
        this._viewModelInstances = new Map();
        this._propertiesWithCallbacks = [];
        this._referenceCount = 0;
        this.selfUnref = false;
        this._runtimeInstance = runtimeInstance;
        if (parent !== null) {
            this._parents.push(parent);
        }
    }
    Object.defineProperty(ViewModelInstance.prototype, "runtimeInstance", {
        get: function () {
            return this._runtimeInstance;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ViewModelInstance.prototype, "nativeInstance", {
        get: function () {
            return this._runtimeInstance;
        },
        enumerable: false,
        configurable: true
    });
    ViewModelInstance.prototype.handleCallbacks = function () {
        if (this._propertiesWithCallbacks.length !== 0) {
            this._propertiesWithCallbacks.forEach(function (property) {
                property.handleCallbacks();
            });
            this._propertiesWithCallbacks.forEach(function (property) {
                property.clearChanges();
            });
        }
        this._children.forEach(function (child) { return child.handleCallbacks(); });
    };
    ViewModelInstance.prototype.addParent = function (parent) {
        if (!this._parents.includes(parent)) {
            this._parents.push(parent);
            if (this._propertiesWithCallbacks.length > 0 ||
                this._children.length > 0) {
                parent.addToViewModelCallbacks(this);
            }
        }
    };
    ViewModelInstance.prototype.removeParent = function (parent) {
        var index = this._parents.indexOf(parent);
        if (index !== -1) {
            var parent_1 = this._parents[index];
            parent_1.removeFromViewModelCallbacks(this);
            this._parents.splice(index, 1);
        }
    };
    /*
     * method for internal use, it shouldn't be called externally
     */
    ViewModelInstance.prototype.addToPropertyCallbacks = function (property) {
        var _this = this;
        if (!this._propertiesWithCallbacks.includes(property)) {
            this._propertiesWithCallbacks.push(property);
            if (this._propertiesWithCallbacks.length > 0) {
                this._parents.forEach(function (parent) {
                    parent.addToViewModelCallbacks(_this);
                });
            }
        }
    };
    /*
     * method for internal use, it shouldn't be called externally
     */
    ViewModelInstance.prototype.removeFromPropertyCallbacks = function (property) {
        var _this = this;
        if (this._propertiesWithCallbacks.includes(property)) {
            this._propertiesWithCallbacks = this._propertiesWithCallbacks.filter(function (prop) { return prop !== property; });
            if (this._children.length === 0 &&
                this._propertiesWithCallbacks.length === 0) {
                this._parents.forEach(function (parent) {
                    parent.removeFromViewModelCallbacks(_this);
                });
            }
        }
    };
    /*
     * method for internal use, it shouldn't be called externally
     */
    ViewModelInstance.prototype.addToViewModelCallbacks = function (instance) {
        var _this = this;
        if (!this._children.includes(instance)) {
            this._children.push(instance);
            this._parents.forEach(function (parent) {
                parent.addToViewModelCallbacks(_this);
            });
        }
    };
    /*
     * method for internal use, it shouldn't be called externally
     */
    ViewModelInstance.prototype.removeFromViewModelCallbacks = function (instance) {
        var _this = this;
        if (this._children.includes(instance)) {
            this._children = this._children.filter(function (child) { return child !== instance; });
            if (this._children.length === 0 &&
                this._propertiesWithCallbacks.length === 0) {
                this._parents.forEach(function (parent) {
                    parent.removeFromViewModelCallbacks(_this);
                });
            }
        }
    };
    ViewModelInstance.prototype.clearCallbacks = function () {
        this._propertiesWithCallbacks.forEach(function (property) {
            property.clearCallbacks();
        });
    };
    ViewModelInstance.prototype.propertyFromPath = function (path, type) {
        var pathSegments = path.split("/");
        return this.propertyFromPathSegments(pathSegments, 0, type);
    };
    ViewModelInstance.prototype.viewModelFromPathSegments = function (pathSegments, index) {
        var viewModelInstance = this.internalViewModelInstance(pathSegments[index]);
        if (viewModelInstance !== null) {
            if (index == pathSegments.length - 1) {
                return viewModelInstance;
            }
            else {
                return viewModelInstance.viewModelFromPathSegments(pathSegments, index++);
            }
        }
        return null;
    };
    ViewModelInstance.prototype.propertyFromPathSegments = function (pathSegments, index, type) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
        if (index < pathSegments.length - 1) {
            var viewModelInstance = this.internalViewModelInstance(pathSegments[index]);
            if (viewModelInstance !== null) {
                return viewModelInstance.propertyFromPathSegments(pathSegments, index + 1, type);
            }
            else {
                return null;
            }
        }
        var instance = null;
        switch (type) {
            case PropertyType.Number:
                instance = (_b = (_a = this._runtimeInstance) === null || _a === void 0 ? void 0 : _a.number(pathSegments[index])) !== null && _b !== void 0 ? _b : null;
                if (instance !== null) {
                    return new ViewModelInstanceNumber(instance, this);
                }
                break;
            case PropertyType.String:
                instance = (_d = (_c = this._runtimeInstance) === null || _c === void 0 ? void 0 : _c.string(pathSegments[index])) !== null && _d !== void 0 ? _d : null;
                if (instance !== null) {
                    return new ViewModelInstanceString(instance, this);
                }
                break;
            case PropertyType.Boolean:
                instance = (_f = (_e = this._runtimeInstance) === null || _e === void 0 ? void 0 : _e.boolean(pathSegments[index])) !== null && _f !== void 0 ? _f : null;
                if (instance !== null) {
                    return new ViewModelInstanceBoolean(instance, this);
                }
                break;
            case PropertyType.Color:
                instance = (_h = (_g = this._runtimeInstance) === null || _g === void 0 ? void 0 : _g.color(pathSegments[index])) !== null && _h !== void 0 ? _h : null;
                if (instance !== null) {
                    return new ViewModelInstanceColor(instance, this);
                }
                break;
            case PropertyType.Trigger:
                instance = (_k = (_j = this._runtimeInstance) === null || _j === void 0 ? void 0 : _j.trigger(pathSegments[index])) !== null && _k !== void 0 ? _k : null;
                if (instance !== null) {
                    return new ViewModelInstanceTrigger(instance, this);
                }
                break;
            case PropertyType.Enum:
                instance = (_m = (_l = this._runtimeInstance) === null || _l === void 0 ? void 0 : _l.enum(pathSegments[index])) !== null && _m !== void 0 ? _m : null;
                if (instance !== null) {
                    return new ViewModelInstanceEnum(instance, this);
                }
                break;
            case PropertyType.List:
                instance = (_p = (_o = this._runtimeInstance) === null || _o === void 0 ? void 0 : _o.list(pathSegments[index])) !== null && _p !== void 0 ? _p : null;
                if (instance !== null) {
                    return new ViewModelInstanceList(instance, this);
                }
                break;
            case PropertyType.Image:
                instance = (_r = (_q = this._runtimeInstance) === null || _q === void 0 ? void 0 : _q.image(pathSegments[index])) !== null && _r !== void 0 ? _r : null;
                if (instance !== null) {
                    return new ViewModelInstanceAssetImage(instance, this);
                }
                break;
            case PropertyType.Font:
                instance = (_t = (_s = this._runtimeInstance) === null || _s === void 0 ? void 0 : _s.font(pathSegments[index])) !== null && _t !== void 0 ? _t : null;
                if (instance !== null) {
                    return new ViewModelInstanceAssetFont(instance, this);
                }
                break;
            case PropertyType.Artboard:
                instance = (_v = (_u = this._runtimeInstance) === null || _u === void 0 ? void 0 : _u.artboard(pathSegments[index])) !== null && _v !== void 0 ? _v : null;
                if (instance !== null) {
                    return new ViewModelInstanceArtboard(instance, this);
                }
                break;
        }
        return null;
    };
    ViewModelInstance.prototype.internalViewModelInstance = function (name) {
        var _a;
        if (this._viewModelInstances.has(name)) {
            return this._viewModelInstances.get(name);
        }
        var viewModelRuntimeInstance = (_a = this._runtimeInstance) === null || _a === void 0 ? void 0 : _a.viewModel(name);
        if (viewModelRuntimeInstance !== null) {
            var viewModelInstance = new ViewModelInstance(viewModelRuntimeInstance, this);
            (0,_utils__WEBPACK_IMPORTED_MODULE_3__.createFinalization)(viewModelInstance, viewModelRuntimeInstance);
            viewModelInstance.internalIncrementReferenceCount();
            this._viewModelInstances.set(name, viewModelInstance);
            return viewModelInstance;
        }
        return null;
    };
    /**
     * method to access a property instance of type number belonging
     * to the view model instance or to a nested view model instance
     * @param path - path to the number property
     */
    ViewModelInstance.prototype.number = function (path) {
        var viewmodelInstanceValue = this.propertyFromPath(path, PropertyType.Number);
        return viewmodelInstanceValue;
    };
    /**
     * method to access a property instance of type string belonging
     * to the view model instance or to a nested view model instance
     * @param path - path to the string property
     */
    ViewModelInstance.prototype.string = function (path) {
        var viewmodelInstanceValue = this.propertyFromPath(path, PropertyType.String);
        return viewmodelInstanceValue;
    };
    /**
     * method to access a property instance of type boolean belonging
     * to the view model instance or to a nested view model instance
     * @param path - path to the boolean property
     */
    ViewModelInstance.prototype.boolean = function (path) {
        var viewmodelInstanceValue = this.propertyFromPath(path, PropertyType.Boolean);
        return viewmodelInstanceValue;
    };
    /**
     * method to access a property instance of type color belonging
     * to the view model instance or to a nested view model instance
     * @param path - path to the ttrigger property
     */
    ViewModelInstance.prototype.color = function (path) {
        var viewmodelInstanceValue = this.propertyFromPath(path, PropertyType.Color);
        return viewmodelInstanceValue;
    };
    /**
     * method to access a property instance of type trigger belonging
     * to the view model instance or to a nested view model instance
     * @param path - path to the trigger property
     */
    ViewModelInstance.prototype.trigger = function (path) {
        var viewmodelInstanceValue = this.propertyFromPath(path, PropertyType.Trigger);
        return viewmodelInstanceValue;
    };
    /**
     * method to access a property instance of type enum belonging
     * to the view model instance or to a nested view model instance
     * @param path - path to the enum property
     */
    ViewModelInstance.prototype.enum = function (path) {
        var viewmodelInstanceValue = this.propertyFromPath(path, PropertyType.Enum);
        return viewmodelInstanceValue;
    };
    /**
     * method to access a property instance of type list belonging
     * to the view model instance or to a nested view model instance
     * @param path - path to the list property
     */
    ViewModelInstance.prototype.list = function (path) {
        var viewmodelInstanceValue = this.propertyFromPath(path, PropertyType.List);
        return viewmodelInstanceValue;
    };
    /**
     * method to access a view model property instance belonging
     * to the view model instance or to a nested view model instance
     * @param path - path to the image property
     */
    ViewModelInstance.prototype.image = function (path) {
        var viewmodelInstanceValue = this.propertyFromPath(path, PropertyType.Image);
        return viewmodelInstanceValue;
    };
    /**
     * method to access a view model property instance belonging
     * to the view model instance or to a nested view model instance
     * @param path - path to the font property
     */
    ViewModelInstance.prototype.font = function (path) {
        var viewmodelInstanceValue = this.propertyFromPath(path, PropertyType.Font);
        return viewmodelInstanceValue;
    };
    /**
     * method to access an artboard property instance belonging
     * to the view model instance or to a nested view model instance
     * @param path - path to the image property
     */
    ViewModelInstance.prototype.artboard = function (path) {
        var viewmodelInstanceValue = this.propertyFromPath(path, PropertyType.Artboard);
        return viewmodelInstanceValue;
    };
    /**
     * method to access a view model property instance belonging
     * to the view model instance or to a nested view model instance
     * @param path - path to the view model property
     */
    ViewModelInstance.prototype.viewModel = function (path) {
        var pathSegments = path.split("/");
        var parentViewModelInstance = pathSegments.length > 1
            ? this.viewModelFromPathSegments(pathSegments.slice(0, pathSegments.length - 1), 0)
            : this;
        if (parentViewModelInstance != null) {
            return parentViewModelInstance.internalViewModelInstance(pathSegments[pathSegments.length - 1]);
        }
        return null;
    };
    ViewModelInstance.prototype.internalReplaceViewModel = function (name, value) {
        var _a;
        if (value.runtimeInstance !== null) {
            var result = ((_a = this._runtimeInstance) === null || _a === void 0 ? void 0 : _a.replaceViewModel(name, value.runtimeInstance)) ||
                false;
            if (result) {
                value.internalIncrementReferenceCount();
                var oldInstance_1 = this.internalViewModelInstance(name);
                if (oldInstance_1 !== null) {
                    oldInstance_1.removeParent(this);
                    if (this._children.includes(oldInstance_1)) {
                        this._children = this._children.filter(function (child) { return child !== oldInstance_1; });
                    }
                    oldInstance_1.cleanup();
                }
                this._viewModelInstances.set(name, value);
                value.addParent(this);
            }
            return result;
        }
        return false;
    };
    /**
     * method to replace a view model property with another view model value
     * @param path - path to the view model property
     * @param value - view model that will replace the original
     */
    ViewModelInstance.prototype.replaceViewModel = function (path, value) {
        var _a;
        var pathSegments = path.split("/");
        var viewModelInstance = pathSegments.length > 1
            ? this.viewModelFromPathSegments(pathSegments.slice(0, pathSegments.length - 1), 0)
            : this;
        return ((_a = viewModelInstance === null || viewModelInstance === void 0 ? void 0 : viewModelInstance.internalReplaceViewModel(pathSegments[pathSegments.length - 1], value)) !== null && _a !== void 0 ? _a : false);
    };
    /*
     * method to add one to the reference counter of the instance.
     * Use if the file owning the reference is destroyed but the instance needs to stay around
     */
    ViewModelInstance.prototype.incrementReferenceCount = function () {
        var _a;
        this._referenceCount++;
        (_a = this._runtimeInstance) === null || _a === void 0 ? void 0 : _a.incrementReferenceCount();
    };
    /*
     * method to subtract one to the reference counter of the instance.
     * Use if incrementReferenceCount has been called
     */
    ViewModelInstance.prototype.decrementReferenceCount = function () {
        var _a;
        this._referenceCount--;
        (_a = this._runtimeInstance) === null || _a === void 0 ? void 0 : _a.decrementReferenceCount();
    };
    Object.defineProperty(ViewModelInstance.prototype, "properties", {
        get: function () {
            var _a;
            return (((_a = this._runtimeInstance) === null || _a === void 0 ? void 0 : _a.getProperties().map(function (prop) { return (__assign({}, prop)); })) || []);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ViewModelInstance.prototype, "viewModelName", {
        /**
         * Get the name of the ViewModel definition this instance was created from.
         */
        get: function () {
            var _a, _b;
            return (_b = (_a = this._runtimeInstance) === null || _a === void 0 ? void 0 : _a.getViewModelName()) !== null && _b !== void 0 ? _b : "";
        },
        enumerable: false,
        configurable: true
    });
    ViewModelInstance.prototype.internalIncrementReferenceCount = function () {
        this._referenceCount++;
    };
    ViewModelInstance.prototype.cleanup = function () {
        var _this = this;
        var _a;
        this._referenceCount--;
        if (this._referenceCount <= 0) {
            if (this.selfUnref) {
                (_a = this._runtimeInstance) === null || _a === void 0 ? void 0 : _a.unref();
            }
            this._runtimeInstance = null;
            this.clearCallbacks();
            this._propertiesWithCallbacks = [];
            this._viewModelInstances.forEach(function (value) {
                value.cleanup();
            });
            this._viewModelInstances.clear();
            var children = __spreadArray([], this._children, true);
            this._children.length = 0;
            var parents = __spreadArray([], this._parents, true);
            this._parents.length = 0;
            children.forEach(function (child) {
                child.removeParent(_this);
            });
            parents.forEach(function (parent) {
                parent.removeFromViewModelCallbacks(_this);
            });
        }
    };
    return ViewModelInstance;
}());

var ViewModelInstanceValue = /** @class */ (function () {
    function ViewModelInstanceValue(instance, parent) {
        this.callbacks = [];
        this._viewModelInstanceValue = instance;
        this._parentViewModel = parent;
    }
    ViewModelInstanceValue.prototype.on = function (callback) {
        // Since we don't clean the changed flag for properties that don't have listeners,
        // we clean it the first time we add a listener to it
        if (this.callbacks.length === 0) {
            this._viewModelInstanceValue.clearChanges();
        }
        if (!this.callbacks.includes(callback)) {
            this.callbacks.push(callback);
            this._parentViewModel.addToPropertyCallbacks(this);
        }
    };
    ViewModelInstanceValue.prototype.off = function (callback) {
        if (!callback) {
            this.callbacks.length = 0;
        }
        else {
            this.callbacks = this.callbacks.filter(function (cb) { return cb !== callback; });
        }
        if (this.callbacks.length === 0) {
            this._parentViewModel.removeFromPropertyCallbacks(this);
        }
    };
    ViewModelInstanceValue.prototype.internalHandleCallback = function (callback) { };
    ViewModelInstanceValue.prototype.handleCallbacks = function () {
        var _this = this;
        if (this._viewModelInstanceValue.hasChanged) {
            this.callbacks.forEach(function (callback) {
                _this.internalHandleCallback(callback);
            });
        }
    };
    ViewModelInstanceValue.prototype.clearChanges = function () {
        this._viewModelInstanceValue.clearChanges();
    };
    ViewModelInstanceValue.prototype.clearCallbacks = function () {
        this.callbacks.length = 0;
    };
    Object.defineProperty(ViewModelInstanceValue.prototype, "name", {
        get: function () {
            return this._viewModelInstanceValue.name;
        },
        enumerable: false,
        configurable: true
    });
    return ViewModelInstanceValue;
}());

var ViewModelInstanceString = /** @class */ (function (_super) {
    __extends(ViewModelInstanceString, _super);
    function ViewModelInstanceString(instance, parent) {
        return _super.call(this, instance, parent) || this;
    }
    Object.defineProperty(ViewModelInstanceString.prototype, "value", {
        get: function () {
            return this._viewModelInstanceValue.value;
        },
        set: function (val) {
            this._viewModelInstanceValue.value = val;
        },
        enumerable: false,
        configurable: true
    });
    ViewModelInstanceString.prototype.internalHandleCallback = function (callback) {
        callback(this.value);
    };
    return ViewModelInstanceString;
}(ViewModelInstanceValue));

var ViewModelInstanceNumber = /** @class */ (function (_super) {
    __extends(ViewModelInstanceNumber, _super);
    function ViewModelInstanceNumber(instance, parent) {
        return _super.call(this, instance, parent) || this;
    }
    Object.defineProperty(ViewModelInstanceNumber.prototype, "value", {
        get: function () {
            return this._viewModelInstanceValue.value;
        },
        set: function (val) {
            this._viewModelInstanceValue.value = val;
        },
        enumerable: false,
        configurable: true
    });
    ViewModelInstanceNumber.prototype.internalHandleCallback = function (callback) {
        callback(this.value);
    };
    return ViewModelInstanceNumber;
}(ViewModelInstanceValue));

var ViewModelInstanceBoolean = /** @class */ (function (_super) {
    __extends(ViewModelInstanceBoolean, _super);
    function ViewModelInstanceBoolean(instance, parent) {
        return _super.call(this, instance, parent) || this;
    }
    Object.defineProperty(ViewModelInstanceBoolean.prototype, "value", {
        get: function () {
            return this._viewModelInstanceValue.value;
        },
        set: function (val) {
            this._viewModelInstanceValue.value = val;
        },
        enumerable: false,
        configurable: true
    });
    ViewModelInstanceBoolean.prototype.internalHandleCallback = function (callback) {
        callback(this.value);
    };
    return ViewModelInstanceBoolean;
}(ViewModelInstanceValue));

var ViewModelInstanceTrigger = /** @class */ (function (_super) {
    __extends(ViewModelInstanceTrigger, _super);
    function ViewModelInstanceTrigger(instance, parent) {
        return _super.call(this, instance, parent) || this;
    }
    ViewModelInstanceTrigger.prototype.trigger = function () {
        return this._viewModelInstanceValue.trigger();
    };
    ViewModelInstanceTrigger.prototype.internalHandleCallback = function (callback) {
        callback();
    };
    return ViewModelInstanceTrigger;
}(ViewModelInstanceValue));

var ViewModelInstanceEnum = /** @class */ (function (_super) {
    __extends(ViewModelInstanceEnum, _super);
    function ViewModelInstanceEnum(instance, parent) {
        return _super.call(this, instance, parent) || this;
    }
    Object.defineProperty(ViewModelInstanceEnum.prototype, "value", {
        get: function () {
            return this._viewModelInstanceValue.value;
        },
        set: function (val) {
            this._viewModelInstanceValue.value = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ViewModelInstanceEnum.prototype, "valueIndex", {
        get: function () {
            return this._viewModelInstanceValue
                .valueIndex;
        },
        set: function (val) {
            this._viewModelInstanceValue.valueIndex = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ViewModelInstanceEnum.prototype, "values", {
        get: function () {
            return this._viewModelInstanceValue.values;
        },
        enumerable: false,
        configurable: true
    });
    ViewModelInstanceEnum.prototype.internalHandleCallback = function (callback) {
        callback(this.value);
    };
    return ViewModelInstanceEnum;
}(ViewModelInstanceValue));

var ViewModelInstanceList = /** @class */ (function (_super) {
    __extends(ViewModelInstanceList, _super);
    function ViewModelInstanceList(instance, parent) {
        return _super.call(this, instance, parent) || this;
    }
    Object.defineProperty(ViewModelInstanceList.prototype, "length", {
        get: function () {
            return this._viewModelInstanceValue.size;
        },
        enumerable: false,
        configurable: true
    });
    ViewModelInstanceList.prototype.addInstance = function (instance) {
        if (instance.runtimeInstance != null) {
            this._viewModelInstanceValue.addInstance(instance.runtimeInstance);
            instance.addParent(this._parentViewModel);
        }
    };
    ViewModelInstanceList.prototype.addInstanceAt = function (instance, index) {
        if (instance.runtimeInstance != null) {
            if (this._viewModelInstanceValue.addInstanceAt(instance.runtimeInstance, index)) {
                instance.addParent(this._parentViewModel);
                return true;
            }
        }
        return false;
    };
    ViewModelInstanceList.prototype.removeInstance = function (instance) {
        if (instance.runtimeInstance != null) {
            this._viewModelInstanceValue.removeInstance(instance.runtimeInstance);
            instance.removeParent(this._parentViewModel);
        }
    };
    ViewModelInstanceList.prototype.removeInstanceAt = function (index) {
        this._viewModelInstanceValue.removeInstanceAt(index);
    };
    ViewModelInstanceList.prototype.instanceAt = function (index) {
        var runtimeInstance = this._viewModelInstanceValue.instanceAt(index);
        if (runtimeInstance != null) {
            var viewModelInstance = new ViewModelInstance(runtimeInstance, this._parentViewModel);
            (0,_utils__WEBPACK_IMPORTED_MODULE_3__.createFinalization)(viewModelInstance, runtimeInstance);
            return viewModelInstance;
        }
        return null;
    };
    ViewModelInstanceList.prototype.swap = function (a, b) {
        this._viewModelInstanceValue.swap(a, b);
    };
    ViewModelInstanceList.prototype.internalHandleCallback = function (callback) {
        callback();
    };
    return ViewModelInstanceList;
}(ViewModelInstanceValue));

var ViewModelInstanceColor = /** @class */ (function (_super) {
    __extends(ViewModelInstanceColor, _super);
    function ViewModelInstanceColor(instance, parent) {
        return _super.call(this, instance, parent) || this;
    }
    Object.defineProperty(ViewModelInstanceColor.prototype, "value", {
        get: function () {
            return this._viewModelInstanceValue.value;
        },
        set: function (val) {
            this._viewModelInstanceValue.value = val;
        },
        enumerable: false,
        configurable: true
    });
    ViewModelInstanceColor.prototype.rgb = function (r, g, b) {
        this._viewModelInstanceValue.rgb(r, g, b);
    };
    ViewModelInstanceColor.prototype.rgba = function (r, g, b, a) {
        this._viewModelInstanceValue.argb(a, r, g, b);
    };
    ViewModelInstanceColor.prototype.argb = function (a, r, g, b) {
        this._viewModelInstanceValue.argb(a, r, g, b);
    };
    // Value 0 to 255
    ViewModelInstanceColor.prototype.alpha = function (a) {
        this._viewModelInstanceValue.alpha(a);
    };
    // Value 0 to 1
    ViewModelInstanceColor.prototype.opacity = function (o) {
        this._viewModelInstanceValue.alpha(Math.round(Math.max(0, Math.min(1, o)) * 255));
    };
    ViewModelInstanceColor.prototype.internalHandleCallback = function (callback) {
        callback(this.value);
    };
    return ViewModelInstanceColor;
}(ViewModelInstanceValue));

var ViewModelInstanceAssetImage = /** @class */ (function (_super) {
    __extends(ViewModelInstanceAssetImage, _super);
    function ViewModelInstanceAssetImage(instance, root) {
        return _super.call(this, instance, root) || this;
    }
    Object.defineProperty(ViewModelInstanceAssetImage.prototype, "value", {
        set: function (image) {
            var _a;
            this._viewModelInstanceValue.value((_a = image === null || image === void 0 ? void 0 : image.nativeImage) !== null && _a !== void 0 ? _a : null);
        },
        enumerable: false,
        configurable: true
    });
    ViewModelInstanceAssetImage.prototype.internalHandleCallback = function (callback) {
        callback();
    };
    return ViewModelInstanceAssetImage;
}(ViewModelInstanceValue));

var ViewModelInstanceAssetFont = /** @class */ (function (_super) {
    __extends(ViewModelInstanceAssetFont, _super);
    function ViewModelInstanceAssetFont(instance, root) {
        return _super.call(this, instance, root) || this;
    }
    Object.defineProperty(ViewModelInstanceAssetFont.prototype, "value", {
        set: function (font) {
            var _a;
            this._viewModelInstanceValue.value((_a = font === null || font === void 0 ? void 0 : font.nativeFont) !== null && _a !== void 0 ? _a : null);
        },
        enumerable: false,
        configurable: true
    });
    ViewModelInstanceAssetFont.prototype.internalHandleCallback = function (callback) {
        callback();
    };
    return ViewModelInstanceAssetFont;
}(ViewModelInstanceValue));

var ViewModelInstanceArtboard = /** @class */ (function (_super) {
    __extends(ViewModelInstanceArtboard, _super);
    function ViewModelInstanceArtboard(instance, root) {
        return _super.call(this, instance, root) || this;
    }
    Object.defineProperty(ViewModelInstanceArtboard.prototype, "value", {
        set: function (artboard) {
            var _a, _b;
            var bindableArtboard;
            if (artboard.isBindableArtboard) {
                bindableArtboard = artboard;
            }
            else {
                bindableArtboard = artboard.file.internalBindableArtboardFromArtboard(artboard.nativeArtboard);
            }
            this._viewModelInstanceValue.value((_a = bindableArtboard === null || bindableArtboard === void 0 ? void 0 : bindableArtboard.nativeArtboard) !== null && _a !== void 0 ? _a : null);
            if (bindableArtboard === null || bindableArtboard === void 0 ? void 0 : bindableArtboard.nativeViewModel) {
                this._viewModelInstanceValue.viewModelInstance((_b = bindableArtboard === null || bindableArtboard === void 0 ? void 0 : bindableArtboard.nativeViewModel) !== null && _b !== void 0 ? _b : null);
            }
        },
        enumerable: false,
        configurable: true
    });
    ViewModelInstanceArtboard.prototype.internalHandleCallback = function (callback) {
        callback();
    };
    return ViewModelInstanceArtboard;
}(ViewModelInstanceValue));

// Loads Rive data from a URI via fetch.
var loadRiveFile = function (src) { return __awaiter(void 0, void 0, void 0, function () {
    var req, res, buffer;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                req = new Request(src);
                return [4 /*yield*/, fetch(req)];
            case 1:
                res = _a.sent();
                if (!res.ok) {
                    throw new Error("Failed to fetch the Rive file: HTTP ".concat(res.status));
                }
                return [4 /*yield*/, res.arrayBuffer()];
            case 2:
                buffer = _a.sent();
                return [2 /*return*/, buffer];
        }
    });
}); };
// #endregion
// #region utility functions
/*
 * Utility function to ensure an object is a string array
 */
var mapToStringArray = function (obj) {
    if (typeof obj === "string") {
        return [obj];
    }
    else if (obj instanceof Array) {
        return obj;
    }
    // If obj is undefined, return empty array
    return [];
};
// #endregion
// #region testing utilities
// Exports to only be used for tests
var Testing = {
    EventManager: EventManager,
    TaskQueueManager: TaskQueueManager,
};
// #endregion
// #region asset loaders
/**
 * Decodes bytes into an audio asset.
 *
 * Be sure to call `.unref()` on the audio once it is no longer needed. This
 * allows the engine to clean it up when it is not used by any more animations.
 */
var decodeAudio = function (bytes) { return __awaiter(void 0, void 0, void 0, function () {
    var decodedPromise, audio, audioWrapper;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                decodedPromise = new Promise(function (resolve) {
                    return _runtimeLoader__WEBPACK_IMPORTED_MODULE_1__.RuntimeLoader.getInstance(function (rive) {
                        rive.decodeAudio(bytes, resolve, null);
                    });
                });
                return [4 /*yield*/, decodedPromise];
            case 1:
                audio = _a.sent();
                audioWrapper = new _utils__WEBPACK_IMPORTED_MODULE_3__.AudioWrapper(audio);
                _utils__WEBPACK_IMPORTED_MODULE_3__.finalizationRegistry.register(audioWrapper, audio);
                return [2 /*return*/, audioWrapper];
        }
    });
}); };
/**
 * Decodes bytes into an image.
 *
 * Be sure to call `.unref()` on the image once it is no longer needed. This
 * allows the engine to clean it up when it is not used by any more animations.
 */
var decodeImage = function (bytes) { return __awaiter(void 0, void 0, void 0, function () {
    var decodedPromise, image, imageWrapper;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                decodedPromise = new Promise(function (resolve) {
                    return _runtimeLoader__WEBPACK_IMPORTED_MODULE_1__.RuntimeLoader.getInstance(function (rive) {
                        rive.decodeImage(bytes, resolve, null);
                    });
                });
                return [4 /*yield*/, decodedPromise];
            case 1:
                image = _a.sent();
                imageWrapper = new _utils__WEBPACK_IMPORTED_MODULE_3__.ImageWrapper(image);
                _utils__WEBPACK_IMPORTED_MODULE_3__.finalizationRegistry.register(imageWrapper, image);
                return [2 /*return*/, imageWrapper];
        }
    });
}); };
/**
 * Decodes bytes into a font.
 *
 * Be sure to call `.unref()` on the font once it is no longer needed. This
 * allows the engine to clean it up when it is not used by any more animations.
 */
var decodeFont = function (bytes) { return __awaiter(void 0, void 0, void 0, function () {
    var decodedPromise, font, fontWrapper;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                decodedPromise = new Promise(function (resolve) {
                    return _runtimeLoader__WEBPACK_IMPORTED_MODULE_1__.RuntimeLoader.getInstance(function (rive) {
                        rive.decodeFont(bytes, resolve, null);
                    });
                });
                return [4 /*yield*/, decodedPromise];
            case 1:
                font = _a.sent();
                fontWrapper = new _utils__WEBPACK_IMPORTED_MODULE_3__.FontWrapper(font);
                _utils__WEBPACK_IMPORTED_MODULE_3__.finalizationRegistry.register(fontWrapper, font);
                return [2 /*return*/, fontWrapper];
        }
    });
}); };
// #endregion

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=rive.js.map