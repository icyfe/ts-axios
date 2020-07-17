import { AxiosRequestConfig, AxiosResponse, AxiosPromise } from '../types'
import xhr from './xhr'
import { bulidURL } from '../helpers/url';
import { transformRequest, transformResonse } from '../helpers/data'
import { processHeaders, flattenHeaders } from '../helpers/header'

export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
    processConfig(config)
    return xhr(config).then(res => {
        return transformResponseData(res)
    })
}

function processConfig(config: AxiosRequestConfig): void {
    config.url = transformUrl(config)
    config.headers = transformHeaders(config)
    config.data = transformRequestData(config)
    console.log('sssss', config.headers, config.method)
    config.headers = flattenHeaders(config.headers, config.method!)
}
function transformUrl(config: AxiosRequestConfig): string {
    const { url = '', params } = config;
    return bulidURL(url, params)
}
function transformRequestData(config: AxiosRequestConfig): any {
    return transformRequest(config.data)
}
function transformHeaders(config: AxiosRequestConfig): any {
    const { headers = {}, data } = config;
    return processHeaders(headers, data)
}
function transformResponseData(res: AxiosResponse): AxiosResponse {
    res.data = transformResonse(res.data);
    return res
}
