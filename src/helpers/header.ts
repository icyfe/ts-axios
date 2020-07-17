import { isPlainObject, deepMerge } from "./util"
import { Method } from ".."
import { head } from "shelljs"


// 格式化指定请求头方式大小写不统一问题
function normalizeHeaderName(headers: any, normalizedName: string) {
    if (!headers) {
        return
    }
    Object.keys(headers).forEach(name => {
        if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
            headers[normalizedName] = headers[name]
            delete headers[name]
        }
    })
}

export function processHeaders(headers: any, data: any): any {
    normalizeHeaderName(headers, 'Content-Type')
    if (isPlainObject(data)) {
        if (headers && !headers['Content-Type']) {
            headers['Content-Type'] = 'application/json;charset=utf-8'
        }
    }

    return headers
}
// 解析header 字符串 将其转换成对象格式
export function parseHeaders(headers: string): any {
    const parse = Object.create(null);
    if (!headers) {
        return parse
    }
    // 每一个头部信息都是以回车符和换行符 \r\n 结束
    headers.split('\r\n').forEach(line => {
        let [key, val] = line.split(':')
        if (!key) {
            return
        }
        if (val) {
            val = val.trim();
        }
        parse[key] = val
    })
    return parse
}

export function flattenHeaders(headers: any, method: Method): any {
    if (!headers) {
        return headers
    }
    console.log('headroom', headers, method)
    headers = deepMerge(headers.common || {}, headers[method] || {}, headers)
    console.log('ddddddd', headers)
    const methodsToDelete = ['delete', 'get', 'head', 'options', 'post', 'put', 'patch', 'common']

    methodsToDelete.forEach(method => {
        delete headers[method]
    })

    return headers
}