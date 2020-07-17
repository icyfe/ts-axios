import axios, { AxiosError } from '../../src/index'
axios({
    method: 'get',
    url: '/error/timeout',
    timeout: 2000
}).then((res) => {
    console.log(res)
}).catch((e: AxiosError) => {
    console.log(e.request)
    console.log('@@',e.isAxiosError)
})