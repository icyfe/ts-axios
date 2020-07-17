import { isDate, isPlainObject } from './util'

function encode(val: string): string {
    return encodeURIComponent(val)
        .replace(/%40/g, '@')
        .replace(/%3A/gi, ':')
        .replace(/%24/g, '$')
        .replace(/%2C/gi, ',')
        .replace(/%20/g, '+')
        .replace(/%5B/gi, '[')
        .replace(/%5D/gi, ']')
}

export function bulidURL(url: string, params?: any) {
    if (!params) {
        return url
    }

    console.log('url', url)

    const parts: string[] = [];

    Object.keys(params).forEach(key => {
        // 空值忽略
        let val = params[key]

        if (typeof val === 'undefined' || val === null) {
            return
        }
        let value: string[] = []
        // 参数值为数组  
        if (Array.isArray(val)) {
            value = val;
            key += '[]' // 如果是数组最终请求的 url 是 /base/get?foo[]=bar&foo[]=baz'
        } else {
            value = [val]
        }
        console.log('canshu', value)
        value.forEach(val => {
            //   参数值为 Date 类型
            if (isDate(val)) {
                val = val.toISOString()
            } else if (isPlainObject(val)) {
                val = JSON.stringify(val)
            }
            parts.push(`${encode(key)}=${encode(val)}`)
        })

    })
    let serializedParams = parts.join('&');
    // 如果序列化后的参数有值
    if (serializedParams) {
        // 丢弃url中的哈希标记 如：url: '/base/get#hash',
        const maskIdx = url.indexOf('#')
        if (maskIdx !== -1) {
            url = url.slice(0, maskIdx)
        }
        console.log('url2', url, serializedParams)
        //保留 url 中已存在的参数
        url += `${url.indexOf('?') === -1 ? "?" : '&'}${serializedParams}`
    }
    return url
}