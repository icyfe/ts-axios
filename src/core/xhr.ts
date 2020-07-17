import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from "../types";
import { parseHeaders } from "../helpers/header";
import { createError } from '../helpers/error'
export default function xhr(config: AxiosRequestConfig): AxiosPromise {
    return new Promise((resolve, reject) => {
        const { data = null, method = 'get', url = '', headers, responseType, timeout } = config
        const request = new XMLHttpRequest()
        if (timeout) {
            request.timeout = timeout
        }
        if (responseType) {
            request.responseType = responseType
        }

        request.open(method.toLocaleUpperCase(), url, true);

        Object.keys(headers).forEach((name) => {
            if (data === null && name.toLowerCase() === 'content-type') {
                delete headers[name]
            } else {
                request.setRequestHeader(name, headers[name])
            }
        })
        request.onreadystatechange = function handleLoad() {
            if (request.readyState !== 4) {
                return
            }
            // 网络错误的情况
            if (request.status === 0) {
                return
            }

            const responseHeaders = parseHeaders(request.getAllResponseHeaders())
            const responseData = responseType && responseType !== 'text' ? request.response : request.responseText
            const response: AxiosResponse = {
                data: responseData,
                status: request.status,
                statusText: request.statusText,
                headers: responseHeaders,
                config,
                request
            }
            handleResponse(response)
        }
        // 错误： 网络错误
        request.onerror = function handleError() {
            reject(createError(
                'Network Error',
                config,
                null,
                request
            ))
        }
        // 超时处理
        request.ontimeout = function handleTimeout() {
            reject(createError(
                `Timeout of ${config.timeout} ms exceeded`,
                config,
                'ECONNABORTED',
                request
            ))
        }
        request.send(data)
        // 处理响应体
        function handleResponse(response: AxiosResponse): void {
            if (response.status >= 200 && response.status < 300) {
                resolve(response)
            } else {
                reject(createError(
                    `Request failed with status code ${response.status}`,
                    config,
                    null,
                    request,
                    response
                ))
            }
        }
    })

}