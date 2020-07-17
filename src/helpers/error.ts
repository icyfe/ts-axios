import { AxiosRequestConfig, AxiosResponse } from "../types"

export class AxiosError extends Error {
    isAxiosError: boolean
    config: AxiosRequestConfig
    code?: string | null
    request?: any
    resonse?: AxiosResponse
    constructor(message: string, config: AxiosRequestConfig, code?: string | null, requset?: any, response?: AxiosResponse) {
        super(message)
        this.isAxiosError = true
        this.config = config
        this.code = code
        this.request = requset
        this.resonse = response
        // 修复TypeScript 继承一些内置对象的时候的坑
        Object.setPrototypeOf(this, AxiosError.prototype)
    }
}

export function createError(
    message: string,
    config: AxiosRequestConfig,
    code?: string | null,
    request?: any,
    response?: AxiosResponse
): AxiosError {
    const error = new AxiosError(message, config, code, request, response)

    return error
}