const base = {
    api_v1_url: 'https://api.locyanfrp.cn',
    api_v2_url: 'https://api-v2.locyanfrp.cn/api/v2',
    buildResponse: (res) => {
        return {
            status: res.status,
            data: res.data.data
        }
    },
}

export default base
