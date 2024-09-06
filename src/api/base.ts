const base = {
  api_v1_url: 'https://api.locyanfrp.cn',
  api_v2_url: 'https://api-v2.locyanfrp.cn/api/v2',
  buildResponse: (res: any, useDataPath: boolean = true) => {
    return {
      status: res.status,
      data: useDataPath ? res.data.data : res.data
    }
  }
}

export default base
