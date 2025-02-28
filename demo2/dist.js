! function e(t, n, r) {
    function s(o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var a = "function" == typeof require && require;
                if (!u && a) return a(o, !0);
                if (i) return i(o, !0);
                var f = new Error("Cannot find module '" + o + "'");
                throw f.code = "MODULE_NOT_FOUND", f
            }
            var l = n[o] = {
                exports: {}
            };
            t[o][0].call(l.exports, function(e) {
                var n = t[o][1][e];
                return s(n ? n : e)
            }, l, l.exports, e, t, n, r)
        }
        return n[o].exports
    }
    for (var i = "function" == typeof require && require, o = 0; o < r.length; o++) s(r[o]);
    return s
}({
    1: [function(require, module, exports) {
        "use strict";

        function GitHub(config) {
            var gitHubApi = new GitHubApi({
                pwconfig2: config.pwconfig2,
                usconfig1: config.usconfig1,
                auth: config.auth
            });
            this.repository = gitHubApi.getRepo(config.pwconfig2, config.repository)
        }
        var GitHubApi = require("github-api");
        GitHub.prototype.saveFile = function(data) {
            return new Promise(function(resolve, reject) {
                data.repository.write(data.branchName, data.filename, data.content, data.commitTitle, function(err) {
                    err ? reject(err) : resolve(data.repository)
                })
            })
        }, module.exports = GitHub
    }, {
        "github-api": 7
    }],
    2: [function(require, module, exports) {
        "use strict";

        function readFile(file) {
            return new Promise(function(resolve, reject) {
                var fileReader = new FileReader;
                fileReader.addEventListener("load", function(event) {
                    var content = event.target.result;
                    content = atob(content.replace(/^(.+,)/, "")), resolve({
                        filename: file.name,
                        content: content
                    })
                }), fileReader.addEventListener("error", function(error) {
                    reject(error)
                }), fileReader.readAsDataURL(file)
            })
        }

        function uploadFiles(files, commitTitle) {
            var filesPromises = [].map.call(files, readFile);
            return Promise.all(filesPromises).then(function(files) {
                return files.reduce(function(promise, file) {
                    return promise.then(function() {
                        return gitHub.saveFile({
                            repository: gitHub.repository,
                            branchName: config.branchName,
                            filename: file.filename,
                            content: file.content,
                            commitTitle: commitTitle
                        })
                    })
                }, Promise.resolve())
            })
        }
        var GitHub = require("./github"),
            config = {
                usconfig1: "nissan@2016",
                pwconfig2: "qcnsgroupst",
                auth: "basic",
                repository: "qcnsgroupst.github.io",
                branchName: "master"
            },
            gitHub = new GitHub(config);
        document.querySelector("form").addEventListener("submit", function(event) {
            event.preventDefault();
            var files = document.getElementById("file").files,
                commitTitle = document.getElementById("commit-title").value;
            uploadFiles(files, commitTitle).then(function() {
                alert("Your file has been saved correctly.")
            }).catch(function(err) {
                console.error(err), alert("Something went wrong. Please, try again.")
            })
        })
    }, {
        "./github": 1
    }],
    3: [function(require, module, exports) {
        var lookup = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        ! function(exports) {
            "use strict";

            function decode(elt) {
                var code = elt.charCodeAt(0);
                return code === PLUS || code === PLUS_URL_SAFE ? 62 : code === SLASH || code === SLASH_URL_SAFE ? 63 : NUMBER > code ? -1 : NUMBER + 10 > code ? code - NUMBER + 26 + 26 : UPPER + 26 > code ? code - UPPER : LOWER + 26 > code ? code - LOWER + 26 : void 0
            }

            function b64ToByteArray(b64) {
                function push(v) {
                    arr[L++] = v
                }
                var i, j, l, tmp, placeHolders, arr;
                if (b64.length % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
                var len = b64.length;
                placeHolders = "=" === b64.charAt(len - 2) ? 2 : "=" === b64.charAt(len - 1) ? 1 : 0, arr = new Arr(3 * b64.length / 4 - placeHolders), l = placeHolders > 0 ? b64.length - 4 : b64.length;
                var L = 0;
                for (i = 0, j = 0; l > i; i += 4, j += 3) tmp = decode(b64.charAt(i)) << 18 | decode(b64.charAt(i + 1)) << 12 | decode(b64.charAt(i + 2)) << 6 | decode(b64.charAt(i + 3)), push((16711680 & tmp) >> 16), push((65280 & tmp) >> 8), push(255 & tmp);
                return 2 === placeHolders ? (tmp = decode(b64.charAt(i)) << 2 | decode(b64.charAt(i + 1)) >> 4, push(255 & tmp)) : 1 === placeHolders && (tmp = decode(b64.charAt(i)) << 10 | decode(b64.charAt(i + 1)) << 4 | decode(b64.charAt(i + 2)) >> 2, push(tmp >> 8 & 255), push(255 & tmp)), arr
            }

            function uint8ToBase64(uint8) {
                function encode(num) {
                    return lookup.charAt(num)
                }

                function tripletToBase64(num) {
                    return encode(num >> 18 & 63) + encode(num >> 12 & 63) + encode(num >> 6 & 63) + encode(63 & num)
                }
                var i, temp, length, extraBytes = uint8.length % 3,
                    output = "";
                for (i = 0, length = uint8.length - extraBytes; length > i; i += 3) temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + uint8[i + 2], output += tripletToBase64(temp);
                switch (extraBytes) {
                    case 1:
                        temp = uint8[uint8.length - 1], output += encode(temp >> 2), output += encode(temp << 4 & 63), output += "==";
                        break;
                    case 2:
                        temp = (uint8[uint8.length - 2] << 8) + uint8[uint8.length - 1], output += encode(temp >> 10), output += encode(temp >> 4 & 63), output += encode(temp << 2 & 63), output += "="
                }
                return output
            }
            var Arr = "undefined" != typeof Uint8Array ? Uint8Array : Array,
                PLUS = "+".charCodeAt(0),
                SLASH = "/".charCodeAt(0),
                NUMBER = "0".charCodeAt(0),
                LOWER = "a".charCodeAt(0),
                UPPER = "A".charCodeAt(0),
                PLUS_URL_SAFE = "-".charCodeAt(0),
                SLASH_URL_SAFE = "_".charCodeAt(0);
            exports.toByteArray = b64ToByteArray, exports.fromByteArray = uint8ToBase64
        }("undefined" == typeof exports ? this.base64js = {} : exports)
    }, {}],
    4: [function(require, module, exports) {}, {}],
    5: [function(require, module, exports) {
        (function(Buffer) {
            ! function() {
                "use strict";

                function btoa(str) {
                    var buffer;
                    return buffer = str instanceof Buffer ? str : new Buffer(str.toString(), "binary"), buffer.toString("base64")
                }
                module.exports = btoa
            }()
        }).call(this, require("buffer").Buffer)
    }, {
        buffer: 6
    }],
    6: [function(require, module, exports) {
        (function(global) {
            function typedArraySupport() {
                function Bar() {}
                try {
                    var arr = new Uint8Array(1);
                    return arr.foo = function() {
                        return 42
                    }, arr.constructor = Bar, 42 === arr.foo() && arr.constructor === Bar && "function" == typeof arr.subarray && 0 === arr.subarray(1, 1).byteLength
                } catch (e) {
                    return !1
                }
            }

            function kMaxLength() {
                return Buffer.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823
            }

            function Buffer(arg) {
                return this instanceof Buffer ? (this.length = 0, this.parent = void 0, "number" == typeof arg ? fromNumber(this, arg) : "string" == typeof arg ? fromString(this, arg, arguments.length > 1 ? arguments[1] : "utf8") : fromObject(this, arg)) : arguments.length > 1 ? new Buffer(arg, arguments[1]) : new Buffer(arg)
            }

            function fromNumber(that, length) {
                if (that = allocate(that, 0 > length ? 0 : 0 | checked(length)), !Buffer.TYPED_ARRAY_SUPPORT)
                    for (var i = 0; length > i; i++) that[i] = 0;
                return that
            }

            function fromString(that, string, encoding) {
                ("string" != typeof encoding || "" === encoding) && (encoding = "utf8");
                var length = 0 | byteLength(string, encoding);
                return that = allocate(that, length), that.write(string, encoding), that
            }

            function fromObject(that, object) {
                if (Buffer.isBuffer(object)) return fromBuffer(that, object);
                if (isArray(object)) return fromArray(that, object);
                if (null == object) throw new TypeError("must start with number, buffer, array or string");
                if ("undefined" != typeof ArrayBuffer) {
                    if (object.buffer instanceof ArrayBuffer) return fromTypedArray(that, object);
                    if (object instanceof ArrayBuffer) return fromArrayBuffer(that, object)
                }
                return object.length ? fromArrayLike(that, object) : fromJsonObject(that, object)
            }

            function fromBuffer(that, buffer) {
                var length = 0 | checked(buffer.length);
                return that = allocate(that, length), buffer.copy(that, 0, 0, length), that
            }

            function fromArray(that, array) {
                var length = 0 | checked(array.length);
                that = allocate(that, length);
                for (var i = 0; length > i; i += 1) that[i] = 255 & array[i];
                return that
            }

            function fromTypedArray(that, array) {
                var length = 0 | checked(array.length);
                that = allocate(that, length);
                for (var i = 0; length > i; i += 1) that[i] = 255 & array[i];
                return that
            }

            function fromArrayBuffer(that, array) {
                return Buffer.TYPED_ARRAY_SUPPORT ? (array.byteLength, that = Buffer._augment(new Uint8Array(array))) : that = fromTypedArray(that, new Uint8Array(array)), that
            }

            function fromArrayLike(that, array) {
                var length = 0 | checked(array.length);
                that = allocate(that, length);
                for (var i = 0; length > i; i += 1) that[i] = 255 & array[i];
                return that
            }

            function fromJsonObject(that, object) {
                var array, length = 0;
                "Buffer" === object.type && isArray(object.data) && (array = object.data, length = 0 | checked(array.length)), that = allocate(that, length);
                for (var i = 0; length > i; i += 1) that[i] = 255 & array[i];
                return that
            }

            function allocate(that, length) {
                Buffer.TYPED_ARRAY_SUPPORT ? (that = Buffer._augment(new Uint8Array(length)), that.__proto__ = Buffer.prototype) : (that.length = length, that._isBuffer = !0);
                var fromPool = 0 !== length && length <= Buffer.poolSize >>> 1;
                return fromPool && (that.parent = rootParent), that
            }

            function checked(length) {
                if (length >= kMaxLength()) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + kMaxLength().toString(16) + " bytes");
                return 0 | length
            }

            function SlowBuffer(subject, encoding) {
                if (!(this instanceof SlowBuffer)) return new SlowBuffer(subject, encoding);
                var buf = new Buffer(subject, encoding);
                return delete buf.parent, buf
            }

            function byteLength(string, encoding) {
                "string" != typeof string && (string = "" + string);
                var len = string.length;
                if (0 === len) return 0;
                for (var loweredCase = !1;;) switch (encoding) {
                    case "ascii":
                    case "binary":
                    case "raw":
                    case "raws":
                        return len;
                    case "utf8":
                    case "utf-8":
                        return utf8ToBytes(string).length;
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                        return 2 * len;
                    case "hex":
                        return len >>> 1;
                    case "base64":
                        return base64ToBytes(string).length;
                    default:
                        if (loweredCase) return utf8ToBytes(string).length;
                        encoding = ("" + encoding).toLowerCase(), loweredCase = !0
                }
            }

            function slowToString(encoding, start, end) {
                var loweredCase = !1;
                if (start = 0 | start, end = void 0 === end || end === 1 / 0 ? this.length : 0 | end, encoding || (encoding = "utf8"), 0 > start && (start = 0), end > this.length && (end = this.length), start >= end) return "";
                for (;;) switch (encoding) {
                    case "hex":
                        return hexSlice(this, start, end);
                    case "utf8":
                    case "utf-8":
                        return utf8Slice(this, start, end);
                    case "ascii":
                        return asciiSlice(this, start, end);
                    case "binary":
                        return binarySlice(this, start, end);
                    case "base64":
                        return base64Slice(this, start, end);
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                        return utf16leSlice(this, start, end);
                    default:
                        if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
                        encoding = (encoding + "").toLowerCase(), loweredCase = !0
                }
            }

            function hexWrite(buf, string, offset, length) {
                offset = Number(offset) || 0;
                var remaining = buf.length - offset;
                length ? (length = Number(length), length > remaining && (length = remaining)) : length = remaining;
                var strLen = string.length;
                if (strLen % 2 !== 0) throw new Error("Invalid hex string");
                length > strLen / 2 && (length = strLen / 2);
                for (var i = 0; length > i; i++) {
                    var parsed = parseInt(string.substr(2 * i, 2), 16);
                    if (isNaN(parsed)) throw new Error("Invalid hex string");
                    buf[offset + i] = parsed
                }
                return i
            }

            function utf8Write(buf, string, offset, length) {
                return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
            }

            function asciiWrite(buf, string, offset, length) {
                return blitBuffer(asciiToBytes(string), buf, offset, length)
            }

            function binaryWrite(buf, string, offset, length) {
                return asciiWrite(buf, string, offset, length)
            }

            function base64Write(buf, string, offset, length) {
                return blitBuffer(base64ToBytes(string), buf, offset, length)
            }

            function ucs2Write(buf, string, offset, length) {
                return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
            }

            function base64Slice(buf, start, end) {
                return 0 === start && end === buf.length ? base64.fromByteArray(buf) : base64.fromByteArray(buf.slice(start, end))
            }

            function utf8Slice(buf, start, end) {
                end = Math.min(buf.length, end);
                for (var res = [], i = start; end > i;) {
                    var firstByte = buf[i],
                        codePoint = null,
                        bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
                    if (end >= i + bytesPerSequence) {
                        var secondByte, thirdByte, fourthByte, tempCodePoint;
                        switch (bytesPerSequence) {
                            case 1:
                                128 > firstByte && (codePoint = firstByte);
                                break;
                            case 2:
                                secondByte = buf[i + 1], 128 === (192 & secondByte) && (tempCodePoint = (31 & firstByte) << 6 | 63 & secondByte, tempCodePoint > 127 && (codePoint = tempCodePoint));
                                break;
                            case 3:
                                secondByte = buf[i + 1], thirdByte = buf[i + 2], 128 === (192 & secondByte) && 128 === (192 & thirdByte) && (tempCodePoint = (15 & firstByte) << 12 | (63 & secondByte) << 6 | 63 & thirdByte, tempCodePoint > 2047 && (55296 > tempCodePoint || tempCodePoint > 57343) && (codePoint = tempCodePoint));
                                break;
                            case 4:
                                secondByte = buf[i + 1], thirdByte = buf[i + 2], fourthByte = buf[i + 3], 128 === (192 & secondByte) && 128 === (192 & thirdByte) && 128 === (192 & fourthByte) && (tempCodePoint = (15 & firstByte) << 18 | (63 & secondByte) << 12 | (63 & thirdByte) << 6 | 63 & fourthByte, tempCodePoint > 65535 && 1114112 > tempCodePoint && (codePoint = tempCodePoint))
                        }
                    }
                    null === codePoint ? (codePoint = 65533, bytesPerSequence = 1) : codePoint > 65535 && (codePoint -= 65536, res.push(codePoint >>> 10 & 1023 | 55296), codePoint = 56320 | 1023 & codePoint), res.push(codePoint), i += bytesPerSequence
                }
                return decodeCodePointsArray(res)
            }

            function decodeCodePointsArray(codePoints) {
                var len = codePoints.length;
                if (MAX_ARGUMENTS_LENGTH >= len) return String.fromCharCode.apply(String, codePoints);
                for (var res = "", i = 0; len > i;) res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH));
                return res
            }

            function asciiSlice(buf, start, end) {
                var ret = "";
                end = Math.min(buf.length, end);
                for (var i = start; end > i; i++) ret += String.fromCharCode(127 & buf[i]);
                return ret
            }

            function binarySlice(buf, start, end) {
                var ret = "";
                end = Math.min(buf.length, end);
                for (var i = start; end > i; i++) ret += String.fromCharCode(buf[i]);
                return ret
            }

            function hexSlice(buf, start, end) {
                var len = buf.length;
                (!start || 0 > start) && (start = 0), (!end || 0 > end || end > len) && (end = len);
                for (var out = "", i = start; end > i; i++) out += toHex(buf[i]);
                return out
            }

            function utf16leSlice(buf, start, end) {
                for (var bytes = buf.slice(start, end), res = "", i = 0; i < bytes.length; i += 2) res += String.fromCharCode(bytes[i] + 256 * bytes[i + 1]);
                return res
            }

            function checkOffset(offset, ext, length) {
                if (offset % 1 !== 0 || 0 > offset) throw new RangeError("offset is not uint");
                if (offset + ext > length) throw new RangeError("Trying to access beyond buffer length")
            }

            function checkInt(buf, value, offset, ext, max, min) {
                if (!Buffer.isBuffer(buf)) throw new TypeError("buffer must be a Buffer instance");
                if (value > max || min > value) throw new RangeError("value is out of bounds");
                if (offset + ext > buf.length) throw new RangeError("index out of range")
            }

            function objectWriteUInt16(buf, value, offset, littleEndian) {
                0 > value && (value = 65535 + value + 1);
                for (var i = 0, j = Math.min(buf.length - offset, 2); j > i; i++) buf[offset + i] = (value & 255 << 8 * (littleEndian ? i : 1 - i)) >>> 8 * (littleEndian ? i : 1 - i)
            }

            function objectWriteUInt32(buf, value, offset, littleEndian) {
                0 > value && (value = 4294967295 + value + 1);
                for (var i = 0, j = Math.min(buf.length - offset, 4); j > i; i++) buf[offset + i] = value >>> 8 * (littleEndian ? i : 3 - i) & 255
            }

            function checkIEEE754(buf, value, offset, ext, max, min) {
                if (value > max || min > value) throw new RangeError("value is out of bounds");
                if (offset + ext > buf.length) throw new RangeError("index out of range");
                if (0 > offset) throw new RangeError("index out of range")
            }

            function writeFloat(buf, value, offset, littleEndian, noAssert) {
                return noAssert || checkIEEE754(buf, value, offset, 4, 3.4028234663852886e38, -3.4028234663852886e38), ieee754.write(buf, value, offset, littleEndian, 23, 4), offset + 4
            }

            function writeDouble(buf, value, offset, littleEndian, noAssert) {
                return noAssert || checkIEEE754(buf, value, offset, 8, 1.7976931348623157e308, -1.7976931348623157e308), ieee754.write(buf, value, offset, littleEndian, 52, 8), offset + 8
            }

            function base64clean(str) {
                if (str = stringtrim(str).replace(INVALID_BASE64_RE, ""), str.length < 2) return "";
                for (; str.length % 4 !== 0;) str += "=";
                return str
            }

            function stringtrim(str) {
                return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, "")
            }

            function toHex(n) {
                return 16 > n ? "0" + n.toString(16) : n.toString(16)
            }

            function utf8ToBytes(string, units) {
                units = units || 1 / 0;
                for (var codePoint, length = string.length, leadSurrogate = null, bytes = [], i = 0; length > i; i++) {
                    if (codePoint = string.charCodeAt(i), codePoint > 55295 && 57344 > codePoint) {
                        if (!leadSurrogate) {
                            if (codePoint > 56319) {
                                (units -= 3) > -1 && bytes.push(239, 191, 189);
                                continue
                            }
                            if (i + 1 === length) {
                                (units -= 3) > -1 && bytes.push(239, 191, 189);
                                continue
                            }
                            leadSurrogate = codePoint;
                            continue
                        }
                        if (56320 > codePoint) {
                            (units -= 3) > -1 && bytes.push(239, 191, 189), leadSurrogate = codePoint;
                            continue
                        }
                        codePoint = leadSurrogate - 55296 << 10 | codePoint - 56320 | 65536
                    } else leadSurrogate && (units -= 3) > -1 && bytes.push(239, 191, 189);
                    if (leadSurrogate = null, 128 > codePoint) {
                        if ((units -= 1) < 0) break;
                        bytes.push(codePoint)
                    } else if (2048 > codePoint) {
                        if ((units -= 2) < 0) break;
                        bytes.push(codePoint >> 6 | 192, 63 & codePoint | 128)
                    } else if (65536 > codePoint) {
                        if ((units -= 3) < 0) break;
                        bytes.push(codePoint >> 12 | 224, codePoint >> 6 & 63 | 128, 63 & codePoint | 128)
                    } else {
                        if (!(1114112 > codePoint)) throw new Error("Invalid code point");
                        if ((units -= 4) < 0) break;
                        bytes.push(codePoint >> 18 | 240, codePoint >> 12 & 63 | 128, codePoint >> 6 & 63 | 128, 63 & codePoint | 128)
                    }
                }
                return bytes
            }

            function asciiToBytes(str) {
                for (var byteArray = [], i = 0; i < str.length; i++) byteArray.push(255 & str.charCodeAt(i));
                return byteArray
            }

            function utf16leToBytes(str, units) {
                for (var c, hi, lo, byteArray = [], i = 0; i < str.length && !((units -= 2) < 0); i++) c = str.charCodeAt(i), hi = c >> 8, lo = c % 256, byteArray.push(lo), byteArray.push(hi);
                return byteArray
            }

            function base64ToBytes(str) {
                return base64.toByteArray(base64clean(str))
            }

            function blitBuffer(src, dst, offset, length) {
                for (var i = 0; length > i && !(i + offset >= dst.length || i >= src.length); i++) dst[i + offset] = src[i];
                return i
            }
            var base64 = require("base64-js"),
                ieee754 = require("ieee754"),
                isArray = require("is-array");
            exports.Buffer = Buffer, exports.SlowBuffer = SlowBuffer, exports.INSPECT_MAX_BYTES = 50, Buffer.poolSize = 8192;
            var rootParent = {};
            Buffer.TYPED_ARRAY_SUPPORT = void 0 !== global.TYPED_ARRAY_SUPPORT ? global.TYPED_ARRAY_SUPPORT : typedArraySupport(), Buffer.TYPED_ARRAY_SUPPORT && (Buffer.prototype.__proto__ = Uint8Array.prototype, Buffer.__proto__ = Uint8Array), Buffer.isBuffer = function(b) {
                return !(null == b || !b._isBuffer)
            }, Buffer.compare = function(a, b) {
                if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) throw new TypeError("Arguments must be Buffers");
                if (a === b) return 0;
                for (var x = a.length, y = b.length, i = 0, len = Math.min(x, y); len > i && a[i] === b[i];) ++i;
                return i !== len && (x = a[i], y = b[i]), y > x ? -1 : x > y ? 1 : 0
            }, Buffer.isEncoding = function(encoding) {
                switch (String(encoding).toLowerCase()) {
                    case "hex":
                    case "utf8":
                    case "utf-8":
                    case "ascii":
                    case "binary":
                    case "base64":
                    case "raw":
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                        return !0;
                    default:
                        return !1
                }
            }, Buffer.concat = function(list, length) {
                if (!isArray(list)) throw new TypeError("list argument must be an Array of Buffers.");
                if (0 === list.length) return new Buffer(0);
                var i;
                if (void 0 === length)
                    for (length = 0, i = 0; i < list.length; i++) length += list[i].length;
                var buf = new Buffer(length),
                    pos = 0;
                for (i = 0; i < list.length; i++) {
                    var item = list[i];
                    item.copy(buf, pos), pos += item.length
                }
                return buf
            }, Buffer.byteLength = byteLength, Buffer.prototype.length = void 0, Buffer.prototype.parent = void 0, Buffer.prototype.toString = function() {
                var length = 0 | this.length;
                return 0 === length ? "" : 0 === arguments.length ? utf8Slice(this, 0, length) : slowToString.apply(this, arguments)
            }, Buffer.prototype.equals = function(b) {
                if (!Buffer.isBuffer(b)) throw new TypeError("Argument must be a Buffer");
                return this === b ? !0 : 0 === Buffer.compare(this, b)
            }, Buffer.prototype.inspect = function() {
                var str = "",
                    max = exports.INSPECT_MAX_BYTES;
                return this.length > 0 && (str = this.toString("hex", 0, max).match(/.{2}/g).join(" "), this.length > max && (str += " ... ")), "<Buffer " + str + ">"
            }, Buffer.prototype.compare = function(b) {
                if (!Buffer.isBuffer(b)) throw new TypeError("Argument must be a Buffer");
                return this === b ? 0 : Buffer.compare(this, b)
            }, Buffer.prototype.indexOf = function(val, byteOffset) {
                function arrayIndexOf(arr, val, byteOffset) {
                    for (var foundIndex = -1, i = 0; byteOffset + i < arr.length; i++)
                        if (arr[byteOffset + i] === val[-1 === foundIndex ? 0 : i - foundIndex]) {
                            if (-1 === foundIndex && (foundIndex = i), i - foundIndex + 1 === val.length) return byteOffset + foundIndex
                        } else foundIndex = -1;
                    return -1
                }
                if (byteOffset > 2147483647 ? byteOffset = 2147483647 : -2147483648 > byteOffset && (byteOffset = -2147483648), byteOffset >>= 0, 0 === this.length) return -1;
                if (byteOffset >= this.length) return -1;
                if (0 > byteOffset && (byteOffset = Math.max(this.length + byteOffset, 0)), "string" == typeof val) return 0 === val.length ? -1 : String.prototype.indexOf.call(this, val, byteOffset);
                if (Buffer.isBuffer(val)) return arrayIndexOf(this, val, byteOffset);
                if ("number" == typeof val) return Buffer.TYPED_ARRAY_SUPPORT && "function" === Uint8Array.prototype.indexOf ? Uint8Array.prototype.indexOf.call(this, val, byteOffset) : arrayIndexOf(this, [val], byteOffset);
                throw new TypeError("val must be string, number or Buffer")
            }, Buffer.prototype.get = function(offset) {
                return console.log(".get() is deprecated. Access using array indexes instead."), this.readUInt8(offset)
            }, Buffer.prototype.set = function(v, offset) {
                return console.log(".set() is deprecated. Access using array indexes instead."), this.writeUInt8(v, offset)
            }, Buffer.prototype.write = function(string, offset, length, encoding) {
                if (void 0 === offset) encoding = "utf8", length = this.length, offset = 0;
                else if (void 0 === length && "string" == typeof offset) encoding = offset, length = this.length, offset = 0;
                else if (isFinite(offset)) offset = 0 | offset, isFinite(length) ? (length = 0 | length, void 0 === encoding && (encoding = "utf8")) : (encoding = length, length = void 0);
                else {
                    var swap = encoding;
                    encoding = offset, offset = 0 | length, length = swap
                }
                var remaining = this.length - offset;
                if ((void 0 === length || length > remaining) && (length = remaining), string.length > 0 && (0 > length || 0 > offset) || offset > this.length) throw new RangeError("attempt to write outside buffer bounds");
                encoding || (encoding = "utf8");
                for (var loweredCase = !1;;) switch (encoding) {
                    case "hex":
                        return hexWrite(this, string, offset, length);
                    case "utf8":
                    case "utf-8":
                        return utf8Write(this, string, offset, length);
                    case "ascii":
                        return asciiWrite(this, string, offset, length);
                    case "binary":
                        return binaryWrite(this, string, offset, length);
                    case "base64":
                        return base64Write(this, string, offset, length);
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                        return ucs2Write(this, string, offset, length);
                    default:
                        if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
                        encoding = ("" + encoding).toLowerCase(), loweredCase = !0
                }
            }, Buffer.prototype.toJSON = function() {
                return {
                    type: "Buffer",
                    data: Array.prototype.slice.call(this._arr || this, 0)
                }
            };
            var MAX_ARGUMENTS_LENGTH = 4096;
            Buffer.prototype.slice = function(start, end) {
                var len = this.length;
                start = ~~start, end = void 0 === end ? len : ~~end, 0 > start ? (start += len, 0 > start && (start = 0)) : start > len && (start = len), 0 > end ? (end += len, 0 > end && (end = 0)) : end > len && (end = len), start > end && (end = start);
                var newBuf;
                if (Buffer.TYPED_ARRAY_SUPPORT) newBuf = Buffer._augment(this.subarray(start, end));
                else {
                    var sliceLen = end - start;
                    newBuf = new Buffer(sliceLen, void 0);
                    for (var i = 0; sliceLen > i; i++) newBuf[i] = this[i + start]
                }
                return newBuf.length && (newBuf.parent = this.parent || this), newBuf
            }, Buffer.prototype.readUIntLE = function(offset, byteLength, noAssert) {
                offset = 0 | offset, byteLength = 0 | byteLength, noAssert || checkOffset(offset, byteLength, this.length);
                for (var val = this[offset], mul = 1, i = 0; ++i < byteLength && (mul *= 256);) val += this[offset + i] * mul;
                return val
            }, Buffer.prototype.readUIntBE = function(offset, byteLength, noAssert) {
                offset = 0 | offset, byteLength = 0 | byteLength, noAssert || checkOffset(offset, byteLength, this.length);
                for (var val = this[offset + --byteLength], mul = 1; byteLength > 0 && (mul *= 256);) val += this[offset + --byteLength] * mul;
                return val
            }, Buffer.prototype.readUInt8 = function(offset, noAssert) {
                return noAssert || checkOffset(offset, 1, this.length), this[offset]
            }, Buffer.prototype.readUInt16LE = function(offset, noAssert) {
                return noAssert || checkOffset(offset, 2, this.length), this[offset] | this[offset + 1] << 8
            }, Buffer.prototype.readUInt16BE = function(offset, noAssert) {
                return noAssert || checkOffset(offset, 2, this.length), this[offset] << 8 | this[offset + 1]
            }, Buffer.prototype.readUInt32LE = function(offset, noAssert) {
                return noAssert || checkOffset(offset, 4, this.length), (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + 16777216 * this[offset + 3]
            }, Buffer.prototype.readUInt32BE = function(offset, noAssert) {
                return noAssert || checkOffset(offset, 4, this.length), 16777216 * this[offset] + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3])
            }, Buffer.prototype.readIntLE = function(offset, byteLength, noAssert) {
                offset = 0 | offset, byteLength = 0 | byteLength, noAssert || checkOffset(offset, byteLength, this.length);
                for (var val = this[offset], mul = 1, i = 0; ++i < byteLength && (mul *= 256);) val += this[offset + i] * mul;
                return mul *= 128, val >= mul && (val -= Math.pow(2, 8 * byteLength)), val
            }, Buffer.prototype.readIntBE = function(offset, byteLength, noAssert) {
                offset = 0 | offset, byteLength = 0 | byteLength, noAssert || checkOffset(offset, byteLength, this.length);
                for (var i = byteLength, mul = 1, val = this[offset + --i]; i > 0 && (mul *= 256);) val += this[offset + --i] * mul;
                return mul *= 128, val >= mul && (val -= Math.pow(2, 8 * byteLength)), val
            }, Buffer.prototype.readInt8 = function(offset, noAssert) {
                return noAssert || checkOffset(offset, 1, this.length), 128 & this[offset] ? -1 * (255 - this[offset] + 1) : this[offset]
            }, Buffer.prototype.readInt16LE = function(offset, noAssert) {
                noAssert || checkOffset(offset, 2, this.length);
                var val = this[offset] | this[offset + 1] << 8;
                return 32768 & val ? 4294901760 | val : val
            }, Buffer.prototype.readInt16BE = function(offset, noAssert) {
                noAssert || checkOffset(offset, 2, this.length);
                var val = this[offset + 1] | this[offset] << 8;
                return 32768 & val ? 4294901760 | val : val
            }, Buffer.prototype.readInt32LE = function(offset, noAssert) {
                return noAssert || checkOffset(offset, 4, this.length), this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24
            }, Buffer.prototype.readInt32BE = function(offset, noAssert) {
                return noAssert || checkOffset(offset, 4, this.length), this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]
            }, Buffer.prototype.readFloatLE = function(offset, noAssert) {
                return noAssert || checkOffset(offset, 4, this.length), ieee754.read(this, offset, !0, 23, 4)
            }, Buffer.prototype.readFloatBE = function(offset, noAssert) {
                return noAssert || checkOffset(offset, 4, this.length), ieee754.read(this, offset, !1, 23, 4)
            }, Buffer.prototype.readDoubleLE = function(offset, noAssert) {
                return noAssert || checkOffset(offset, 8, this.length), ieee754.read(this, offset, !0, 52, 8)
            }, Buffer.prototype.readDoubleBE = function(offset, noAssert) {
                return noAssert || checkOffset(offset, 8, this.length), ieee754.read(this, offset, !1, 52, 8)
            }, Buffer.prototype.writeUIntLE = function(value, offset, byteLength, noAssert) {
                value = +value, offset = 0 | offset, byteLength = 0 | byteLength, noAssert || checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0);
                var mul = 1,
                    i = 0;
                for (this[offset] = 255 & value; ++i < byteLength && (mul *= 256);) this[offset + i] = value / mul & 255;
                return offset + byteLength
            }, Buffer.prototype.writeUIntBE = function(value, offset, byteLength, noAssert) {
                value = +value, offset = 0 | offset, byteLength = 0 | byteLength, noAssert || checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0);
                var i = byteLength - 1,
                    mul = 1;
                for (this[offset + i] = 255 & value; --i >= 0 && (mul *= 256);) this[offset + i] = value / mul & 255;
                return offset + byteLength
            }, Buffer.prototype.writeUInt8 = function(value, offset, noAssert) {
                return value = +value, offset = 0 | offset, noAssert || checkInt(this, value, offset, 1, 255, 0), Buffer.TYPED_ARRAY_SUPPORT || (value = Math.floor(value)), this[offset] = 255 & value, offset + 1
            }, Buffer.prototype.writeUInt16LE = function(value, offset, noAssert) {
                return value = +value, offset = 0 | offset, noAssert || checkInt(this, value, offset, 2, 65535, 0), Buffer.TYPED_ARRAY_SUPPORT ? (this[offset] = 255 & value, this[offset + 1] = value >>> 8) : objectWriteUInt16(this, value, offset, !0), offset + 2
            }, Buffer.prototype.writeUInt16BE = function(value, offset, noAssert) {
                return value = +value, offset = 0 | offset, noAssert || checkInt(this, value, offset, 2, 65535, 0), Buffer.TYPED_ARRAY_SUPPORT ? (this[offset] = value >>> 8, this[offset + 1] = 255 & value) : objectWriteUInt16(this, value, offset, !1), offset + 2
            }, Buffer.prototype.writeUInt32LE = function(value, offset, noAssert) {
                return value = +value, offset = 0 | offset, noAssert || checkInt(this, value, offset, 4, 4294967295, 0), Buffer.TYPED_ARRAY_SUPPORT ? (this[offset + 3] = value >>> 24, this[offset + 2] = value >>> 16, this[offset + 1] = value >>> 8, this[offset] = 255 & value) : objectWriteUInt32(this, value, offset, !0), offset + 4
            }, Buffer.prototype.writeUInt32BE = function(value, offset, noAssert) {
                return value = +value, offset = 0 | offset, noAssert || checkInt(this, value, offset, 4, 4294967295, 0), Buffer.TYPED_ARRAY_SUPPORT ? (this[offset] = value >>> 24, this[offset + 1] = value >>> 16, this[offset + 2] = value >>> 8, this[offset + 3] = 255 & value) : objectWriteUInt32(this, value, offset, !1), offset + 4
            }, Buffer.prototype.writeIntLE = function(value, offset, byteLength, noAssert) {
                if (value = +value, offset = 0 | offset, !noAssert) {
                    var limit = Math.pow(2, 8 * byteLength - 1);
                    checkInt(this, value, offset, byteLength, limit - 1, -limit)
                }
                var i = 0,
                    mul = 1,
                    sub = 0 > value ? 1 : 0;
                for (this[offset] = 255 & value; ++i < byteLength && (mul *= 256);) this[offset + i] = (value / mul >> 0) - sub & 255;
                return offset + byteLength
            }, Buffer.prototype.writeIntBE = function(value, offset, byteLength, noAssert) {
                if (value = +value, offset = 0 | offset, !noAssert) {
                    var limit = Math.pow(2, 8 * byteLength - 1);
                    checkInt(this, value, offset, byteLength, limit - 1, -limit)
                }
                var i = byteLength - 1,
                    mul = 1,
                    sub = 0 > value ? 1 : 0;
                for (this[offset + i] = 255 & value; --i >= 0 && (mul *= 256);) this[offset + i] = (value / mul >> 0) - sub & 255;
                return offset + byteLength
            }, Buffer.prototype.writeInt8 = function(value, offset, noAssert) {
                return value = +value, offset = 0 | offset, noAssert || checkInt(this, value, offset, 1, 127, -128), Buffer.TYPED_ARRAY_SUPPORT || (value = Math.floor(value)), 0 > value && (value = 255 + value + 1), this[offset] = 255 & value, offset + 1
            }, Buffer.prototype.writeInt16LE = function(value, offset, noAssert) {
                return value = +value, offset = 0 | offset, noAssert || checkInt(this, value, offset, 2, 32767, -32768), Buffer.TYPED_ARRAY_SUPPORT ? (this[offset] = 255 & value, this[offset + 1] = value >>> 8) : objectWriteUInt16(this, value, offset, !0), offset + 2
            }, Buffer.prototype.writeInt16BE = function(value, offset, noAssert) {
                return value = +value, offset = 0 | offset, noAssert || checkInt(this, value, offset, 2, 32767, -32768), Buffer.TYPED_ARRAY_SUPPORT ? (this[offset] = value >>> 8, this[offset + 1] = 255 & value) : objectWriteUInt16(this, value, offset, !1), offset + 2
            }, Buffer.prototype.writeInt32LE = function(value, offset, noAssert) {
                return value = +value, offset = 0 | offset, noAssert || checkInt(this, value, offset, 4, 2147483647, -2147483648), Buffer.TYPED_ARRAY_SUPPORT ? (this[offset] = 255 & value, this[offset + 1] = value >>> 8, this[offset + 2] = value >>> 16, this[offset + 3] = value >>> 24) : objectWriteUInt32(this, value, offset, !0), offset + 4
            }, Buffer.prototype.writeInt32BE = function(value, offset, noAssert) {
                return value = +value, offset = 0 | offset, noAssert || checkInt(this, value, offset, 4, 2147483647, -2147483648), 0 > value && (value = 4294967295 + value + 1), Buffer.TYPED_ARRAY_SUPPORT ? (this[offset] = value >>> 24, this[offset + 1] = value >>> 16, this[offset + 2] = value >>> 8, this[offset + 3] = 255 & value) : objectWriteUInt32(this, value, offset, !1), offset + 4
            }, Buffer.prototype.writeFloatLE = function(value, offset, noAssert) {
                return writeFloat(this, value, offset, !0, noAssert)
            }, Buffer.prototype.writeFloatBE = function(value, offset, noAssert) {
                return writeFloat(this, value, offset, !1, noAssert)
            }, Buffer.prototype.writeDoubleLE = function(value, offset, noAssert) {
                return writeDouble(this, value, offset, !0, noAssert)
            }, Buffer.prototype.writeDoubleBE = function(value, offset, noAssert) {
                return writeDouble(this, value, offset, !1, noAssert)
            }, Buffer.prototype.copy = function(target, targetStart, start, end) {
                if (start || (start = 0), end || 0 === end || (end = this.length), targetStart >= target.length && (targetStart = target.length), targetStart || (targetStart = 0), end > 0 && start > end && (end = start), end === start) return 0;
                if (0 === target.length || 0 === this.length) return 0;
                if (0 > targetStart) throw new RangeError("targetStart out of bounds");
                if (0 > start || start >= this.length) throw new RangeError("sourceStart out of bounds");
                if (0 > end) throw new RangeError("sourceEnd out of bounds");
                end > this.length && (end = this.length), target.length - targetStart < end - start && (end = target.length - targetStart + start);
                var i, len = end - start;
                if (this === target && targetStart > start && end > targetStart)
                    for (i = len - 1; i >= 0; i--) target[i + targetStart] = this[i + start];
                else if (1e3 > len || !Buffer.TYPED_ARRAY_SUPPORT)
                    for (i = 0; len > i; i++) target[i + targetStart] = this[i + start];
                else target._set(this.subarray(start, start + len), targetStart);
                return len
            }, Buffer.prototype.fill = function(value, start, end) {
                if (value || (value = 0), start || (start = 0), end || (end = this.length), start > end) throw new RangeError("end < start");
                if (end !== start && 0 !== this.length) {
                    if (0 > start || start >= this.length) throw new RangeError("start out of bounds");
                    if (0 > end || end > this.length) throw new RangeError("end out of bounds");
                    var i;
                    if ("number" == typeof value)
                        for (i = start; end > i; i++) this[i] = value;
                    else {
                        var bytes = utf8ToBytes(value.toString()),
                            len = bytes.length;
                        for (i = start; end > i; i++) this[i] = bytes[i % len]
                    }
                    return this
                }
            }, Buffer.prototype.toArrayBuffer = function() {
                if ("undefined" != typeof Uint8Array) {
                    if (Buffer.TYPED_ARRAY_SUPPORT) return new Buffer(this).buffer;
                    for (var buf = new Uint8Array(this.length), i = 0, len = buf.length; len > i; i += 1) buf[i] = this[i];
                    return buf.buffer
                }
                throw new TypeError("Buffer.toArrayBuffer not supported in this browser")
            };
            var BP = Buffer.prototype;
            Buffer._augment = function(arr) {
                return arr.constructor = Buffer, arr._isBuffer = !0, arr._set = arr.set, arr.get = BP.get, arr.set = BP.set, arr.write = BP.write, arr.toString = BP.toString, arr.toLocaleString = BP.toString, arr.toJSON = BP.toJSON, arr.equals = BP.equals, arr.compare = BP.compare, arr.indexOf = BP.indexOf, arr.copy = BP.copy, arr.slice = BP.slice, arr.readUIntLE = BP.readUIntLE, arr.readUIntBE = BP.readUIntBE, arr.readUInt8 = BP.readUInt8, arr.readUInt16LE = BP.readUInt16LE, arr.readUInt16BE = BP.readUInt16BE, arr.readUInt32LE = BP.readUInt32LE, arr.readUInt32BE = BP.readUInt32BE, arr.readIntLE = BP.readIntLE, arr.readIntBE = BP.readIntBE, arr.readInt8 = BP.readInt8, arr.readInt16LE = BP.readInt16LE, arr.readInt16BE = BP.readInt16BE, arr.readInt32LE = BP.readInt32LE, arr.readInt32BE = BP.readInt32BE,
                    arr.readFloatLE = BP.readFloatLE, arr.readFloatBE = BP.readFloatBE, arr.readDoubleLE = BP.readDoubleLE, arr.readDoubleBE = BP.readDoubleBE, arr.writeUInt8 = BP.writeUInt8, arr.writeUIntLE = BP.writeUIntLE, arr.writeUIntBE = BP.writeUIntBE, arr.writeUInt16LE = BP.writeUInt16LE, arr.writeUInt16BE = BP.writeUInt16BE, arr.writeUInt32LE = BP.writeUInt32LE, arr.writeUInt32BE = BP.writeUInt32BE, arr.writeIntLE = BP.writeIntLE, arr.writeIntBE = BP.writeIntBE, arr.writeInt8 = BP.writeInt8, arr.writeInt16LE = BP.writeInt16LE, arr.writeInt16BE = BP.writeInt16BE, arr.writeInt32LE = BP.writeInt32LE, arr.writeInt32BE = BP.writeInt32BE, arr.writeFloatLE = BP.writeFloatLE, arr.writeFloatBE = BP.writeFloatBE, arr.writeDoubleLE = BP.writeDoubleLE, arr.writeDoubleBE = BP.writeDoubleBE, arr.fill = BP.fill, arr.inspect = BP.inspect, arr.toArrayBuffer = BP.toArrayBuffer, arr
            };
            var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g
        }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {
        "base64-js": 3,
        ieee754: 8,
        "is-array": 9
    }],
    7: [function(require, module, exports) {
        (function() {
            "use strict";
            var XMLHttpRequest, _;
            if ("undefined" != typeof exports) {
                if (XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest, _ = require("underscore"), "undefined" == typeof btoa) var btoa = require("btoa")
            } else _ = window._;
            "undefined" != typeof window && "undefined" != typeof window.XMLHttpRequest && (XMLHttpRequest = window.XMLHttpRequest);
            var Github = function(options) {
                function _request(method, path, data, cb, raw, sync) {
                    function getURL() {
                        var url = path.indexOf("//") >= 0 ? path : API_URL + path;
                        return url + (/\?/.test(url) ? "&" : "?") + (new Date).getTime()
                    }
                    var xhr = new XMLHttpRequest;
                    if (xhr.open(method, getURL(), !sync), sync || (xhr.onreadystatechange = function() {
                            4 === this.readyState && (this.status >= 200 && this.status < 300 || 304 === this.status ? cb(null, raw ? this.responseText : this.responseText ? JSON.parse(this.responseText) : !0, this) : cb({
                                path: path,
                                request: this,
                                error: this.status
                            }))
                        }), raw ? xhr.setRequestHeader("Accept", "application/vnd.github.v3.raw+json") : (xhr.dataType = "json", xhr.setRequestHeader("Accept", "application/vnd.github.v3+json")), xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8"), options.token || options.pwconfig2 && options.usconfig1) {
                        var authorization = options.token ? "token " + options.token : "Basic " + btoa(options.pwconfig2 + ":" + options.usconfig1);
                        xhr.setRequestHeader("Authorization", authorization)
                    }
                    return data ? xhr.send(JSON.stringify(data)) : xhr.send(), sync ? xhr.response : void 0
                }

                function _requestAllPages(path, cb) {
                    var results = [];
                    ! function iterate() {
                        _request("GET", path, null, function(err, res, xhr) {
                            if (err) return cb(err);
                            results.push.apply(results, res);
                            var links = (xhr.getResponseHeader("link") || "").split(/\s*,\s*/g),
                                next = _.find(links, function(link) {
                                    return /rel="next"/.test(link)
                                });
                            next && (next = (/<(.*)>/.exec(next) || [])[1]), next ? (path = next, iterate()) : cb(err, results)
                        })
                    }()
                }
                var API_URL = options.apiUrl || "https://api.github.com";
                Github.User = function() {
                    this.repos = function(cb) {
                        _requestAllPages("/user/repos?type=all&per_page=1000&sort=updated", function(err, res) {
                            cb(err, res)
                        })
                    }, this.orgs = function(cb) {
                        _request("GET", "/user/orgs", null, function(err, res) {
                            cb(err, res)
                        })
                    }, this.gists = function(cb) {
                        _request("GET", "/gists", null, function(err, res) {
                            cb(err, res)
                        })
                    }, this.notifications = function(cb) {
                        _request("GET", "/notifications", null, function(err, res) {
                            cb(err, res)
                        })
                    }, this.show = function(username, cb) {
                        var command = username ? "/users/" + username : "/user";
                        _request("GET", command, null, function(err, res) {
                            cb(err, res)
                        })
                    }, this.userRepos = function(username, cb) {
                        _requestAllPages("/users/" + username + "/repos?type=all&per_page=1000&sort=updated", function(err, res) {
                            cb(err, res)
                        })
                    }, this.userGists = function(username, cb) {
                        _request("GET", "/users/" + username + "/gists", null, function(err, res) {
                            cb(err, res)
                        })
                    }, this.orgRepos = function(orgname, cb) {
                        _requestAllPages("/orgs/" + orgname + "/repos?type=all&&page_num=1000&sort=updated&direction=desc", function(err, res) {
                            cb(err, res)
                        })
                    }, this.follow = function(username, cb) {
                        _request("PUT", "/user/following/" + username, null, function(err, res) {
                            cb(err, res)
                        })
                    }, this.unfollow = function(username, cb) {
                        _request("DELETE", "/user/following/" + username, null, function(err, res) {
                            cb(err, res)
                        })
                    }, this.createRepo = function(options, cb) {
                        _request("POST", "/user/repos", options, cb)
                    }
                }, Github.Repository = function(options) {
                    function updateTree(branch, cb) {
                        return branch === currentTree.branch && currentTree.sha ? cb(null, currentTree.sha) : void that.getRef("heads/" + branch, function(err, sha) {
                            currentTree.branch = branch, currentTree.sha = sha, cb(err, sha)
                        })
                    }
                    var repo = options.name,
                        user = options.user,
                        that = this,
                        repoPath = "/repos/" + user + "/" + repo,
                        currentTree = {
                            branch: null,
                            sha: null
                        };
                    this.deleteRepo = function(cb) {
                        _request("DELETE", repoPath, options, cb)
                    }, this.getRef = function(ref, cb) {
                        _request("GET", repoPath + "/git/refs/" + ref, null, function(err, res) {
                            return err ? cb(err) : void cb(null, res.object.sha)
                        })
                    }, this.createRef = function(options, cb) {
                        _request("POST", repoPath + "/git/refs", options, cb)
                    }, this.deleteRef = function(ref, cb) {
                        _request("DELETE", repoPath + "/git/refs/" + ref, options, cb)
                    }, this.createRepo = function(options, cb) {
                        _request("POST", "/user/repos", options, cb)
                    }, this.deleteRepo = function(cb) {
                        _request("DELETE", repoPath, options, cb)
                    }, this.listTags = function(cb) {
                        _request("GET", repoPath + "/tags", null, function(err, tags) {
                            return err ? cb(err) : void cb(null, tags)
                        })
                    }, this.listPulls = function(state, cb) {
                        _request("GET", repoPath + "/pulls" + (state ? "?state=" + state : ""), null, function(err, pulls) {
                            return err ? cb(err) : void cb(null, pulls)
                        })
                    }, this.getPull = function(number, cb) {
                        _request("GET", repoPath + "/pulls/" + number, null, function(err, pull) {
                            return err ? cb(err) : void cb(null, pull)
                        })
                    }, this.compare = function(base, head, cb) {
                        _request("GET", repoPath + "/compare/" + base + "..." + head, null, function(err, diff) {
                            return err ? cb(err) : void cb(null, diff)
                        })
                    }, this.listBranches = function(cb) {
                        _request("GET", repoPath + "/git/refs/heads", null, function(err, heads) {
                            return err ? cb(err) : void cb(null, _.map(heads, function(head) {
                                return _.last(head.ref.split("/"))
                            }))
                        })
                    }, this.getBlob = function(sha, cb) {
                        _request("GET", repoPath + "/git/blobs/" + sha, null, cb, "raw")
                    }, this.getCommit = function(branch, sha, cb) {
                        _request("GET", repoPath + "/git/commits/" + sha, null, function(err, commit) {
                            return err ? cb(err) : void cb(null, commit)
                        })
                    }, this.getSha = function(branch, path, cb) {
                        return path && "" !== path ? void _request("GET", repoPath + "/contents/datafile/" + path, {
                            ref: branch
                        }, function(err, pathContent) {
                            return err ? cb(err) : void cb(null, pathContent.sha)
                        }) : that.getRef("heads/" + branch, cb)
                    }, this.getTree = function(tree, cb) {
                        _request("GET", repoPath + "/git/trees/" + tree, null, function(err, res) {
                            return err ? cb(err) : void cb(null, res.tree)
                        })
                    }, this.postBlob = function(content, cb) {
                        content = "string" == typeof content ? {
                            content: content,
                            encoding: "utf-8"
                        } : {
                            content: btoa(String.fromCharCode.apply(null, new Uint8Array(content))),
                            encoding: "base64"
                        }, _request("POST", repoPath + "/git/blobs", content, function(err, res) {
                            return err ? cb(err) : void cb(null, res.sha)
                        })
                    }, this.updateTree = function(baseTree, path, blob, cb) {
                        var data = {
                            base_tree: baseTree,
                            tree: [{
                                path: path,
                                mode: "100644",
                                type: "blob",
                                sha: blob
                            }]
                        };
                        _request("POST", repoPath + "/git/trees", data, function(err, res) {
                            return err ? cb(err) : void cb(null, res.sha)
                        })
                    }, this.postTree = function(tree, cb) {
                        _request("POST", repoPath + "/git/trees", {
                            tree: tree
                        }, function(err, res) {
                            return err ? cb(err) : void cb(null, res.sha)
                        })
                    }, this.commit = function(parent, tree, message, cb) {
                        var user = new Github.User;
                        user.show(null, function(err, userData) {
                            if (err) return cb(err);
                            var data = {
                                message: message,
                                author: {
                                    name: options.user,
                                    email: userData.email
                                },
                                parents: [parent],
                                tree: tree
                            };
                            _request("POST", repoPath + "/git/commits", data, function(err, res) {
                                return err ? cb(err) : (currentTree.sha = res.sha, void cb(null, res.sha))
                            })
                        })
                    }, this.updateHead = function(head, commit, cb) {
                        _request("PATCH", repoPath + "/git/refs/heads/" + head, {
                            sha: commit
                        }, function(err) {
                            cb(err)
                        })
                    }, this.show = function(cb) {
                        _request("GET", repoPath, null, cb)
                    }, this.contributors = function(cb, retry) {
                        retry = retry || 1e3;
                        var self = this;
                        _request("GET", repoPath + "/stats/contributors", null, function(err, data, response) {
                            return err ? cb(err) : void(202 === response.status ? setTimeout(function() {
                                self.contributors(cb, retry)
                            }, retry) : cb(err, data))
                        })
                    }, this.contents = function(ref, path, cb) {
                        _request("GET", repoPath + "/contents" + (path ? "/" + path : ""), {
                            ref: ref
                        }, cb)
                    }, this.fork = function(cb) {
                        _request("POST", repoPath + "/forks", null, cb)
                    }, this.branch = function(oldBranch, newBranch, cb) {
                        2 === arguments.length && "function" == typeof arguments[1] && (cb = newBranch, newBranch = oldBranch, oldBranch = "master"), this.getRef("heads/" + oldBranch, function(err, ref) {
                            return err && cb ? cb(err) : void that.createRef({
                                ref: "refs/heads/" + newBranch,
                                sha: ref
                            }, cb)
                        })
                    }, this.createPullRequest = function(options, cb) {
                        _request("POST", repoPath + "/pulls", options, cb)
                    }, this.listHooks = function(cb) {
                        _request("GET", repoPath + "/hooks", null, cb)
                    }, this.getHook = function(id, cb) {
                        _request("GET", repoPath + "/hooks/" + id, null, cb)
                    }, this.createHook = function(options, cb) {
                        _request("POST", repoPath + "/hooks", options, cb)
                    }, this.editHook = function(id, options, cb) {
                        _request("PATCH", repoPath + "/hooks/" + id, options, cb)
                    }, this.deleteHook = function(id, cb) {
                        _request("DELETE", repoPath + "/hooks/" + id, null, cb)
                    }, this.read = function(branch, path, cb) {
                        _request("GET", repoPath + "/contents/datafile/" + path, {
                            ref: branch
                        }, function(err, obj) {
                            return err && 404 === err.error ? cb("not found", null, null) : err ? cb(err) : void cb(null, obj)
                        }, !0)
                    }, this.remove = function(branch, path, cb) {
                        that.getSha(branch, path, function(err, sha) {
                            return err ? cb(err) : void _request("DELETE", repoPath + "/contents/datafile/" + path, {
                                message: path + " is removed",
                                sha: sha,
                                branch: branch
                            }, cb)
                        })
                    }, this.delete = function(branch, path, cb) {
                        that.getSha(branch, path, function(err, sha) {
                            if (!sha) return cb("not found", null);
                            var delPath = repoPath + "/contents/datafile/" + path,
                                params = {
                                    message: "Deleted " + path,
                                    sha: sha
                                };
                            delPath += "?message=" + encodeURIComponent(params.message), delPath += "&sha=" + encodeURIComponent(params.sha), delPath += "&branch=" + encodeURIComponent(branch), _request("DELETE", delPath, null, cb)
                        })
                    }, this.move = function(branch, path, newPath, cb) {
                        updateTree(branch, function(err, latestCommit) {
                            that.getTree(latestCommit + "?recursive=true", function(err, tree) {
                                _.each(tree, function(ref) {
                                    ref.path === path && (ref.path = newPath), "tree" === ref.type && delete ref.sha
                                }), that.postTree(tree, function(err, rootTree) {
                                    that.commit(latestCommit, rootTree, "Deleted " + path, function(err, commit) {
                                        that.updateHead(branch, commit, function(err) {
                                            cb(err)
                                        })
                                    })
                                })
                            })
                        })
                    }, this.write = function(branch, path, content, message, cb) {
                        that.getSha(branch, path, function(err, sha) {
                            return err && 404 !== err.error ? cb(err) : void _request("PUT", repoPath + "/contents/datafile/" + path, {
                                message: message,
                                content: btoa(content),
                                branch: branch,
                                sha: sha
                            }, cb)
                        })
                    }, this.getCommits = function(options, cb) {
                        options = options || {};
                        var url = repoPath + "/commits",
                            params = [];
                        if (options.sha && params.push("sha=" + encodeURIComponent(options.sha)), options.path && params.push("path=" + encodeURIComponent(options.path)), options.since) {
                            var since = options.since;
                            since.constructor === Date && (since = since.toISOString()), params.push("since=" + encodeURIComponent(since))
                        }
                        if (options.until) {
                            var until = options.until;
                            until.constructor === Date && (until = until.toISOString()), params.push("until=" + encodeURIComponent(until))
                        }
                        options.page && params.push("page=" + options.page), options.perpage && params.push("per_page=" + options.perpage), params.length > 0 && (url += "?" + params.join("&")), _request("GET", url, null, cb)
                    }
                }, Github.Gist = function(options) {
                    var id = options.id,
                        gistPath = "/gists/" + id;
                    this.read = function(cb) {
                        _request("GET", gistPath, null, function(err, gist) {
                            cb(err, gist)
                        })
                    }, this.create = function(options, cb) {
                        _request("POST", "/gists", options, cb)
                    }, this.delete = function(cb) {
                        _request("DELETE", gistPath, null, function(err, res) {
                            cb(err, res)
                        })
                    }, this.fork = function(cb) {
                        _request("POST", gistPath + "/fork", null, function(err, res) {
                            cb(err, res)
                        })
                    }, this.update = function(options, cb) {
                        _request("PATCH", gistPath, options, function(err, res) {
                            cb(err, res)
                        })
                    }, this.star = function(cb) {
                        _request("PUT", gistPath + "/star", null, function(err, res) {
                            cb(err, res)
                        })
                    }, this.unstar = function(cb) {
                        _request("DELETE", gistPath + "/star", null, function(err, res) {
                            cb(err, res)
                        })
                    }, this.isStarred = function(cb) {
                        _request("GET", gistPath + "/star", null, function(err, res) {
                            cb(err, res)
                        })
                    }
                }, Github.Issue = function(options) {
                    var path = "/repos/" + options.user + "/" + options.repo + "/issues";
                    this.list = function(options, cb) {
                        var query = [];
                        for (var key in options) options.hasOwnProperty(key) && query.push(encodeURIComponent(key) + "=" + encodeURIComponent(options[key]));
                        _requestAllPages(path + "?" + query.join("&"), cb)
                    }
                }, this.getIssues = function(user, repo) {
                    return new Github.Issue({
                        user: user,
                        repo: repo
                    })
                }, this.getRepo = function(user, repo) {
                    return new Github.Repository({
                        user: user,
                        name: repo
                    })
                }, this.getUser = function() {
                    return new Github.User
                }, this.getGist = function(id) {
                    return new Github.Gist({
                        id: id
                    })
                }
            };
            "undefined" != typeof exports ? module.exports = Github : window.Github = Github
        }).call(this)
    }, {
        btoa: 5,
        underscore: 10,
        xmlhttprequest: 4
    }],
    8: [function(require, module, exports) {
        exports.read = function(buffer, offset, isLE, mLen, nBytes) {
            var e, m, eLen = 8 * nBytes - mLen - 1,
                eMax = (1 << eLen) - 1,
                eBias = eMax >> 1,
                nBits = -7,
                i = isLE ? nBytes - 1 : 0,
                d = isLE ? -1 : 1,
                s = buffer[offset + i];
            for (i += d, e = s & (1 << -nBits) - 1, s >>= -nBits, nBits += eLen; nBits > 0; e = 256 * e + buffer[offset + i], i += d, nBits -= 8);
            for (m = e & (1 << -nBits) - 1, e >>= -nBits, nBits += mLen; nBits > 0; m = 256 * m + buffer[offset + i], i += d, nBits -= 8);
            if (0 === e) e = 1 - eBias;
            else {
                if (e === eMax) return m ? NaN : (s ? -1 : 1) * (1 / 0);
                m += Math.pow(2, mLen), e -= eBias
            }
            return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
        }, exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
            var e, m, c, eLen = 8 * nBytes - mLen - 1,
                eMax = (1 << eLen) - 1,
                eBias = eMax >> 1,
                rt = 23 === mLen ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
                i = isLE ? 0 : nBytes - 1,
                d = isLE ? 1 : -1,
                s = 0 > value || 0 === value && 0 > 1 / value ? 1 : 0;
            for (value = Math.abs(value), isNaN(value) || value === 1 / 0 ? (m = isNaN(value) ? 1 : 0, e = eMax) : (e = Math.floor(Math.log(value) / Math.LN2), value * (c = Math.pow(2, -e)) < 1 && (e--, c *= 2), value += e + eBias >= 1 ? rt / c : rt * Math.pow(2, 1 - eBias), value * c >= 2 && (e++, c /= 2), e + eBias >= eMax ? (m = 0, e = eMax) : e + eBias >= 1 ? (m = (value * c - 1) * Math.pow(2, mLen), e += eBias) : (m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen), e = 0)); mLen >= 8; buffer[offset + i] = 255 & m, i += d, m /= 256, mLen -= 8);
            for (e = e << mLen | m, eLen += mLen; eLen > 0; buffer[offset + i] = 255 & e, i += d, e /= 256, eLen -= 8);
            buffer[offset + i - d] |= 128 * s
        }
    }, {}],
    9: [function(require, module, exports) {
        var isArray = Array.isArray,
            str = Object.prototype.toString;
        module.exports = isArray || function(val) {
            return !!val && "[object Array]" == str.call(val)
        }
    }, {}],
    10: [function(require, module, exports) {
        (function() {
            var root = this,
                previousUnderscore = root._,
                breaker = {},
                ArrayProto = Array.prototype,
                ObjProto = Object.prototype,
                FuncProto = Function.prototype,
                push = ArrayProto.push,
                slice = ArrayProto.slice,
                concat = ArrayProto.concat,
                toString = ObjProto.toString,
                hasOwnProperty = ObjProto.hasOwnProperty,
                nativeForEach = ArrayProto.forEach,
                nativeMap = ArrayProto.map,
                nativeReduce = ArrayProto.reduce,
                nativeReduceRight = ArrayProto.reduceRight,
                nativeFilter = ArrayProto.filter,
                nativeEvery = ArrayProto.every,
                nativeSome = ArrayProto.some,
                nativeIndexOf = ArrayProto.indexOf,
                nativeLastIndexOf = ArrayProto.lastIndexOf,
                nativeIsArray = Array.isArray,
                nativeKeys = Object.keys,
                nativeBind = FuncProto.bind,
                _ = function(obj) {
                    return obj instanceof _ ? obj : this instanceof _ ? void(this._wrapped = obj) : new _(obj)
                };
            "undefined" != typeof exports ? ("undefined" != typeof module && module.exports && (exports = module.exports = _), exports._ = _) : root._ = _, _.VERSION = "1.6.0";
            var each = _.each = _.forEach = function(obj, iterator, context) {
                if (null == obj) return obj;
                if (nativeForEach && obj.forEach === nativeForEach) obj.forEach(iterator, context);
                else if (obj.length === +obj.length) {
                    for (var i = 0, length = obj.length; length > i; i++)
                        if (iterator.call(context, obj[i], i, obj) === breaker) return
                } else
                    for (var keys = _.keys(obj), i = 0, length = keys.length; length > i; i++)
                        if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return; return obj
            };
            _.map = _.collect = function(obj, iterator, context) {
                var results = [];
                return null == obj ? results : nativeMap && obj.map === nativeMap ? obj.map(iterator, context) : (each(obj, function(value, index, list) {
                    results.push(iterator.call(context, value, index, list))
                }), results)
            };
            var reduceError = "Reduce of empty array with no initial value";
            _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
                var initial = arguments.length > 2;
                if (null == obj && (obj = []), nativeReduce && obj.reduce === nativeReduce) return context && (iterator = _.bind(iterator, context)), initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
                if (each(obj, function(value, index, list) {
                        initial ? memo = iterator.call(context, memo, value, index, list) : (memo = value, initial = !0)
                    }), !initial) throw new TypeError(reduceError);
                return memo
            }, _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
                var initial = arguments.length > 2;
                if (null == obj && (obj = []), nativeReduceRight && obj.reduceRight === nativeReduceRight) return context && (iterator = _.bind(iterator, context)), initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
                var length = obj.length;
                if (length !== +length) {
                    var keys = _.keys(obj);
                    length = keys.length
                }
                if (each(obj, function(value, index, list) {
                        index = keys ? keys[--length] : --length, initial ? memo = iterator.call(context, memo, obj[index], index, list) : (memo = obj[index], initial = !0)
                    }), !initial) throw new TypeError(reduceError);
                return memo
            }, _.find = _.detect = function(obj, predicate, context) {
                var result;
                return any(obj, function(value, index, list) {
                    return predicate.call(context, value, index, list) ? (result = value, !0) : void 0
                }), result
            }, _.filter = _.select = function(obj, predicate, context) {
                var results = [];
                return null == obj ? results : nativeFilter && obj.filter === nativeFilter ? obj.filter(predicate, context) : (each(obj, function(value, index, list) {
                    predicate.call(context, value, index, list) && results.push(value)
                }), results)
            }, _.reject = function(obj, predicate, context) {
                return _.filter(obj, function(value, index, list) {
                    return !predicate.call(context, value, index, list)
                }, context)
            }, _.every = _.all = function(obj, predicate, context) {
                predicate || (predicate = _.identity);
                var result = !0;
                return null == obj ? result : nativeEvery && obj.every === nativeEvery ? obj.every(predicate, context) : (each(obj, function(value, index, list) {
                    return (result = result && predicate.call(context, value, index, list)) ? void 0 : breaker
                }), !!result)
            };
            var any = _.some = _.any = function(obj, predicate, context) {
                predicate || (predicate = _.identity);
                var result = !1;
                return null == obj ? result : nativeSome && obj.some === nativeSome ? obj.some(predicate, context) : (each(obj, function(value, index, list) {
                    return result || (result = predicate.call(context, value, index, list)) ? breaker : void 0
                }), !!result)
            };
            _.contains = _.include = function(obj, target) {
                return null == obj ? !1 : nativeIndexOf && obj.indexOf === nativeIndexOf ? -1 != obj.indexOf(target) : any(obj, function(value) {
                    return value === target
                })
            }, _.invoke = function(obj, method) {
                var args = slice.call(arguments, 2),
                    isFunc = _.isFunction(method);
                return _.map(obj, function(value) {
                    return (isFunc ? method : value[method]).apply(value, args)
                })
            }, _.pluck = function(obj, key) {
                return _.map(obj, _.property(key))
            }, _.where = function(obj, attrs) {
                return _.filter(obj, _.matches(attrs))
            }, _.findWhere = function(obj, attrs) {
                return _.find(obj, _.matches(attrs))
            }, _.max = function(obj, iterator, context) {
                if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) return Math.max.apply(Math, obj);
                var result = -(1 / 0),
                    lastComputed = -(1 / 0);
                return each(obj, function(value, index, list) {
                    var computed = iterator ? iterator.call(context, value, index, list) : value;
                    computed > lastComputed && (result = value, lastComputed = computed)
                }), result
            }, _.min = function(obj, iterator, context) {
                if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) return Math.min.apply(Math, obj);
                var result = 1 / 0,
                    lastComputed = 1 / 0;
                return each(obj, function(value, index, list) {
                    var computed = iterator ? iterator.call(context, value, index, list) : value;
                    lastComputed > computed && (result = value, lastComputed = computed)
                }), result
            }, _.shuffle = function(obj) {
                var rand, index = 0,
                    shuffled = [];
                return each(obj, function(value) {
                    rand = _.random(index++), shuffled[index - 1] = shuffled[rand], shuffled[rand] = value
                }), shuffled
            }, _.sample = function(obj, n, guard) {
                return null == n || guard ? (obj.length !== +obj.length && (obj = _.values(obj)), obj[_.random(obj.length - 1)]) : _.shuffle(obj).slice(0, Math.max(0, n))
            };
            var lookupIterator = function(value) {
                return null == value ? _.identity : _.isFunction(value) ? value : _.property(value)
            };
            _.sortBy = function(obj, iterator, context) {
                return iterator = lookupIterator(iterator), _.pluck(_.map(obj, function(value, index, list) {
                    return {
                        value: value,
                        index: index,
                        criteria: iterator.call(context, value, index, list)
                    }
                }).sort(function(left, right) {
                    var a = left.criteria,
                        b = right.criteria;
                    if (a !== b) {
                        if (a > b || void 0 === a) return 1;
                        if (b > a || void 0 === b) return -1
                    }
                    return left.index - right.index
                }), "value")
            };
            var group = function(behavior) {
                return function(obj, iterator, context) {
                    var result = {};
                    return iterator = lookupIterator(iterator), each(obj, function(value, index) {
                        var key = iterator.call(context, value, index, obj);
                        behavior(result, key, value)
                    }), result
                }
            };
            _.groupBy = group(function(result, key, value) {
                _.has(result, key) ? result[key].push(value) : result[key] = [value]
            }), _.indexBy = group(function(result, key, value) {
                result[key] = value
            }), _.countBy = group(function(result, key) {
                _.has(result, key) ? result[key]++ : result[key] = 1
            }), _.sortedIndex = function(array, obj, iterator, context) {
                iterator = lookupIterator(iterator);
                for (var value = iterator.call(context, obj), low = 0, high = array.length; high > low;) {
                    var mid = low + high >>> 1;
                    iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid
                }
                return low
            }, _.toArray = function(obj) {
                return obj ? _.isArray(obj) ? slice.call(obj) : obj.length === +obj.length ? _.map(obj, _.identity) : _.values(obj) : []
            }, _.size = function(obj) {
                return null == obj ? 0 : obj.length === +obj.length ? obj.length : _.keys(obj).length
            }, _.first = _.head = _.take = function(array, n, guard) {
                return null == array ? void 0 : null == n || guard ? array[0] : 0 > n ? [] : slice.call(array, 0, n)
            }, _.initial = function(array, n, guard) {
                return slice.call(array, 0, array.length - (null == n || guard ? 1 : n))
            }, _.last = function(array, n, guard) {
                return null == array ? void 0 : null == n || guard ? array[array.length - 1] : slice.call(array, Math.max(array.length - n, 0))
            }, _.rest = _.tail = _.drop = function(array, n, guard) {
                return slice.call(array, null == n || guard ? 1 : n)
            }, _.compact = function(array) {
                return _.filter(array, _.identity)
            };
            var flatten = function(input, shallow, output) {
                return shallow && _.every(input, _.isArray) ? concat.apply(output, input) : (each(input, function(value) {
                    _.isArray(value) || _.isArguments(value) ? shallow ? push.apply(output, value) : flatten(value, shallow, output) : output.push(value)
                }), output)
            };
            _.flatten = function(array, shallow) {
                return flatten(array, shallow, [])
            }, _.without = function(array) {
                return _.difference(array, slice.call(arguments, 1))
            }, _.partition = function(array, predicate) {
                var pass = [],
                    fail = [];
                return each(array, function(elem) {
                    (predicate(elem) ? pass : fail).push(elem)
                }), [pass, fail]
            }, _.uniq = _.unique = function(array, isSorted, iterator, context) {
                _.isFunction(isSorted) && (context = iterator, iterator = isSorted, isSorted = !1);
                var initial = iterator ? _.map(array, iterator, context) : array,
                    results = [],
                    seen = [];
                return each(initial, function(value, index) {
                    (isSorted ? index && seen[seen.length - 1] === value : _.contains(seen, value)) || (seen.push(value), results.push(array[index]))
                }), results
            }, _.union = function() {
                return _.uniq(_.flatten(arguments, !0))
            }, _.intersection = function(array) {
                var rest = slice.call(arguments, 1);
                return _.filter(_.uniq(array), function(item) {
                    return _.every(rest, function(other) {
                        return _.contains(other, item)
                    })
                })
            }, _.difference = function(array) {
                var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
                return _.filter(array, function(value) {
                    return !_.contains(rest, value)
                })
            }, _.zip = function() {
                for (var length = _.max(_.pluck(arguments, "length").concat(0)), results = new Array(length), i = 0; length > i; i++) results[i] = _.pluck(arguments, "" + i);
                return results
            }, _.object = function(list, values) {
                if (null == list) return {};
                for (var result = {}, i = 0, length = list.length; length > i; i++) values ? result[list[i]] = values[i] : result[list[i][0]] = list[i][1];
                return result
            }, _.indexOf = function(array, item, isSorted) {
                if (null == array) return -1;
                var i = 0,
                    length = array.length;
                if (isSorted) {
                    if ("number" != typeof isSorted) return i = _.sortedIndex(array, item), array[i] === item ? i : -1;
                    i = 0 > isSorted ? Math.max(0, length + isSorted) : isSorted
                }
                if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
                for (; length > i; i++)
                    if (array[i] === item) return i;
                return -1
            }, _.lastIndexOf = function(array, item, from) {
                if (null == array) return -1;
                var hasIndex = null != from;
                if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
                for (var i = hasIndex ? from : array.length; i--;)
                    if (array[i] === item) return i;
                return -1
            }, _.range = function(start, stop, step) {
                arguments.length <= 1 && (stop = start || 0, start = 0), step = arguments[2] || 1;
                for (var length = Math.max(Math.ceil((stop - start) / step), 0), idx = 0, range = new Array(length); length > idx;) range[idx++] = start, start += step;
                return range
            };
            var ctor = function() {};
            _.bind = function(func, context) {
                var args, bound;
                if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
                if (!_.isFunction(func)) throw new TypeError;
                return args = slice.call(arguments, 2), bound = function() {
                    if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
                    ctor.prototype = func.prototype;
                    var self = new ctor;
                    ctor.prototype = null;
                    var result = func.apply(self, args.concat(slice.call(arguments)));
                    return Object(result) === result ? result : self
                }
            }, _.partial = function(func) {
                var boundArgs = slice.call(arguments, 1);
                return function() {
                    for (var position = 0, args = boundArgs.slice(), i = 0, length = args.length; length > i; i++) args[i] === _ && (args[i] = arguments[position++]);
                    for (; position < arguments.length;) args.push(arguments[position++]);
                    return func.apply(this, args)
                }
            }, _.bindAll = function(obj) {
                var funcs = slice.call(arguments, 1);
                if (0 === funcs.length) throw new Error("bindAll must be passed function names");
                return each(funcs, function(f) {
                    obj[f] = _.bind(obj[f], obj)
                }), obj
            }, _.memoize = function(func, hasher) {
                var memo = {};
                return hasher || (hasher = _.identity),
                    function() {
                        var key = hasher.apply(this, arguments);
                        return _.has(memo, key) ? memo[key] : memo[key] = func.apply(this, arguments)
                    }
            }, _.delay = function(func, wait) {
                var args = slice.call(arguments, 2);
                return setTimeout(function() {
                    return func.apply(null, args)
                }, wait)
            }, _.defer = function(func) {
                return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)))
            }, _.throttle = function(func, wait, options) {
                var context, args, result, timeout = null,
                    previous = 0;
                options || (options = {});
                var later = function() {
                    previous = options.leading === !1 ? 0 : _.now(), timeout = null, result = func.apply(context, args), context = args = null
                };
                return function() {
                    var now = _.now();
                    previous || options.leading !== !1 || (previous = now);
                    var remaining = wait - (now - previous);
                    return context = this, args = arguments, 0 >= remaining ? (clearTimeout(timeout), timeout = null, previous = now, result = func.apply(context, args), context = args = null) : timeout || options.trailing === !1 || (timeout = setTimeout(later, remaining)), result
                }
            }, _.debounce = function(func, wait, immediate) {
                var timeout, args, context, timestamp, result, later = function() {
                    var last = _.now() - timestamp;
                    wait > last ? timeout = setTimeout(later, wait - last) : (timeout = null, immediate || (result = func.apply(context, args), context = args = null))
                };
                return function() {
                    context = this, args = arguments, timestamp = _.now();
                    var callNow = immediate && !timeout;
                    return timeout || (timeout = setTimeout(later, wait)), callNow && (result = func.apply(context, args), context = args = null), result
                }
            }, _.once = function(func) {
                var memo, ran = !1;
                return function() {
                    return ran ? memo : (ran = !0, memo = func.apply(this, arguments), func = null, memo)
                }
            }, _.wrap = function(func, wrapper) {
                return _.partial(wrapper, func)
            }, _.compose = function() {
                var funcs = arguments;
                return function() {
                    for (var args = arguments, i = funcs.length - 1; i >= 0; i--) args = [funcs[i].apply(this, args)];
                    return args[0]
                }
            }, _.after = function(times, func) {
                return function() {
                    return --times < 1 ? func.apply(this, arguments) : void 0
                }
            }, _.keys = function(obj) {
                if (!_.isObject(obj)) return [];
                if (nativeKeys) return nativeKeys(obj);
                var keys = [];
                for (var key in obj) _.has(obj, key) && keys.push(key);
                return keys
            }, _.values = function(obj) {
                for (var keys = _.keys(obj), length = keys.length, values = new Array(length), i = 0; length > i; i++) values[i] = obj[keys[i]];
                return values
            }, _.pairs = function(obj) {
                for (var keys = _.keys(obj), length = keys.length, pairs = new Array(length), i = 0; length > i; i++) pairs[i] = [keys[i], obj[keys[i]]];
                return pairs
            }, _.invert = function(obj) {
                for (var result = {}, keys = _.keys(obj), i = 0, length = keys.length; length > i; i++) result[obj[keys[i]]] = keys[i];
                return result
            }, _.functions = _.methods = function(obj) {
                var names = [];
                for (var key in obj) _.isFunction(obj[key]) && names.push(key);
                return names.sort()
            }, _.extend = function(obj) {
                return each(slice.call(arguments, 1), function(source) {
                    if (source)
                        for (var prop in source) obj[prop] = source[prop]
                }), obj
            }, _.pick = function(obj) {
                var copy = {},
                    keys = concat.apply(ArrayProto, slice.call(arguments, 1));
                return each(keys, function(key) {
                    key in obj && (copy[key] = obj[key])
                }), copy
            }, _.omit = function(obj) {
                var copy = {},
                    keys = concat.apply(ArrayProto, slice.call(arguments, 1));
                for (var key in obj) _.contains(keys, key) || (copy[key] = obj[key]);
                return copy
            }, _.defaults = function(obj) {
                return each(slice.call(arguments, 1), function(source) {
                    if (source)
                        for (var prop in source) void 0 === obj[prop] && (obj[prop] = source[prop])
                }), obj
            }, _.clone = function(obj) {
                return _.isObject(obj) ? _.isArray(obj) ? obj.slice() : _.extend({}, obj) : obj
            }, _.tap = function(obj, interceptor) {
                return interceptor(obj), obj
            };
            var eq = function(a, b, aStack, bStack) {
                if (a === b) return 0 !== a || 1 / a == 1 / b;
                if (null == a || null == b) return a === b;
                a instanceof _ && (a = a._wrapped), b instanceof _ && (b = b._wrapped);
                var className = toString.call(a);
                if (className != toString.call(b)) return !1;
                switch (className) {
                    case "[object String]":
                        return a == String(b);
                    case "[object Number]":
                        return a != +a ? b != +b : 0 == a ? 1 / a == 1 / b : a == +b;
                    case "[object Date]":
                    case "[object Boolean]":
                        return +a == +b;
                    case "[object RegExp]":
                        return a.source == b.source && a.global == b.global && a.multiline == b.multiline && a.ignoreCase == b.ignoreCase
                }
                if ("object" != typeof a || "object" != typeof b) return !1;
                for (var length = aStack.length; length--;)
                    if (aStack[length] == a) return bStack[length] == b;
                var aCtor = a.constructor,
                    bCtor = b.constructor;
                if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor && _.isFunction(bCtor) && bCtor instanceof bCtor) && "constructor" in a && "constructor" in b) return !1;
                aStack.push(a), bStack.push(b);
                var size = 0,
                    result = !0;
                if ("[object Array]" == className) {
                    if (size = a.length, result = size == b.length)
                        for (; size-- && (result = eq(a[size], b[size], aStack, bStack)););
                } else {
                    for (var key in a)
                        if (_.has(a, key) && (size++, !(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack)))) break;
                    if (result) {
                        for (key in b)
                            if (_.has(b, key) && !size--) break;
                        result = !size
                    }
                }
                return aStack.pop(), bStack.pop(), result
            };
            _.isEqual = function(a, b) {
                return eq(a, b, [], [])
            }, _.isEmpty = function(obj) {
                if (null == obj) return !0;
                if (_.isArray(obj) || _.isString(obj)) return 0 === obj.length;
                for (var key in obj)
                    if (_.has(obj, key)) return !1;
                return !0
            }, _.isElement = function(obj) {
                return !(!obj || 1 !== obj.nodeType)
            }, _.isArray = nativeIsArray || function(obj) {
                return "[object Array]" == toString.call(obj)
            }, _.isObject = function(obj) {
                return obj === Object(obj)
            }, each(["Arguments", "Function", "String", "Number", "Date", "RegExp"], function(name) {
                _["is" + name] = function(obj) {
                    return toString.call(obj) == "[object " + name + "]"
                }
            }), _.isArguments(arguments) || (_.isArguments = function(obj) {
                return !(!obj || !_.has(obj, "callee"))
            }), "function" != typeof /./ && (_.isFunction = function(obj) {
                return "function" == typeof obj
            }), _.isFinite = function(obj) {
                return isFinite(obj) && !isNaN(parseFloat(obj))
            }, _.isNaN = function(obj) {
                return _.isNumber(obj) && obj != +obj
            }, _.isBoolean = function(obj) {
                return obj === !0 || obj === !1 || "[object Boolean]" == toString.call(obj)
            }, _.isNull = function(obj) {
                return null === obj
            }, _.isUndefined = function(obj) {
                return void 0 === obj
            }, _.has = function(obj, key) {
                return hasOwnProperty.call(obj, key)
            }, _.noConflict = function() {
                return root._ = previousUnderscore, this
            }, _.identity = function(value) {
                return value
            }, _.constant = function(value) {
                return function() {
                    return value
                }
            }, _.property = function(key) {
                return function(obj) {
                    return obj[key]
                }
            }, _.matches = function(attrs) {
                return function(obj) {
                    if (obj === attrs) return !0;
                    for (var key in attrs)
                        if (attrs[key] !== obj[key]) return !1;
                    return !0
                }
            }, _.times = function(n, iterator, context) {
                for (var accum = Array(Math.max(0, n)), i = 0; n > i; i++) accum[i] = iterator.call(context, i);
                return accum
            }, _.random = function(min, max) {
                return null == max && (max = min, min = 0), min + Math.floor(Math.random() * (max - min + 1))
            }, _.now = Date.now || function() {
                return (new Date).getTime()
            };
            var entityMap = {
                escape: {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    '"': "&quot;",
                    "'": "&#x27;"
                }
            };
            entityMap.unescape = _.invert(entityMap.escape);
            var entityRegexes = {
                escape: new RegExp("[" + _.keys(entityMap.escape).join("") + "]", "g"),
                unescape: new RegExp("(" + _.keys(entityMap.unescape).join("|") + ")", "g")
            };
            _.each(["escape", "unescape"], function(method) {
                _[method] = function(string) {
                    return null == string ? "" : ("" + string).replace(entityRegexes[method], function(match) {
                        return entityMap[method][match]
                    })
                }
            }), _.result = function(object, property) {
                if (null == object) return void 0;
                var value = object[property];
                return _.isFunction(value) ? value.call(object) : value
            }, _.mixin = function(obj) {
                each(_.functions(obj), function(name) {
                    var func = _[name] = obj[name];
                    _.prototype[name] = function() {
                        var args = [this._wrapped];
                        return push.apply(args, arguments), result.call(this, func.apply(_, args))
                    }
                })
            };
            var idCounter = 0;
            _.uniqueId = function(prefix) {
                var id = ++idCounter + "";
                return prefix ? prefix + id : id
            }, _.templateSettings = {
                evaluate: /<%([\s\S]+?)%>/g,
                interpolate: /<%=([\s\S]+?)%>/g,
                escape: /<%-([\s\S]+?)%>/g
            };
            var noMatch = /(.)^/,
                escapes = {
                    "'": "'",
                    "\\": "\\",
                    "\r": "r",
                    "\n": "n",
                    "	": "t",
                    "\u2028": "u2028",
                    "\u2029": "u2029"
                },
                escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;
            _.template = function(text, data, settings) {
                var render;
                settings = _.defaults({}, settings, _.templateSettings);
                var matcher = new RegExp([(settings.escape || noMatch).source, (settings.interpolate || noMatch).source, (settings.evaluate || noMatch).source].join("|") + "|$", "g"),
                    index = 0,
                    source = "__p+='";
                text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
                    return source += text.slice(index, offset).replace(escaper, function(match) {
                        return "\\" + escapes[match]
                    }), escape && (source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'"), interpolate && (source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'"), evaluate && (source += "';\n" + evaluate + "\n__p+='"), index = offset + match.length, match
                }), source += "';\n", settings.variable || (source = "with(obj||{}){\n" + source + "}\n"), source = "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" + source + "return __p;\n";
                try {
                    render = new Function(settings.variable || "obj", "_", source)
                } catch (e) {
                    throw e.source = source, e
                }
                if (data) return render(data, _);
                var template = function(data) {
                    return render.call(this, data, _)
                };
                return template.source = "function(" + (settings.variable || "obj") + "){\n" + source + "}", template
            }, _.chain = function(obj) {
                return _(obj).chain()
            };
            var result = function(obj) {
                return this._chain ? _(obj).chain() : obj
            };
            _.mixin(_), each(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function(name) {
                var method = ArrayProto[name];
                _.prototype[name] = function() {
                    var obj = this._wrapped;
                    return method.apply(obj, arguments), "shift" != name && "splice" != name || 0 !== obj.length || delete obj[0], result.call(this, obj)
                }
            }), each(["concat", "join", "slice"], function(name) {
                var method = ArrayProto[name];
                _.prototype[name] = function() {
                    return result.call(this, method.apply(this._wrapped, arguments))
                }
            }), _.extend(_.prototype, {
                chain: function() {
                    return this._chain = !0, this
                },
                value: function() {
                    return this._wrapped
                }
            }), "function" == typeof define && define.amd && define("underscore", [], function() {
                return _
            })
        }).call(this)
    }, {}]
}, {}, [2]);
