import fetch from 'node-fetch'

export default class RestClient {
  /**
   * @param {Object} config
   */
  constructor (config = {}) {
    this.baseUrl = config.baseUrl || ''
    this.headers = {
      accept: 'application/json, text/plain, */*',
      ...config.headers,
    }
    this.credentials = config.credentials || 'include'

    this.get = this.get.bind(this)
  }

  /**
   *
   * @param {Object} config
   * @returns {{headers: (*&{accept: string}), credentials: (*|"include"|"omit"|"same-origin"|CredentialsContainer|string)}}
   * @private
   */
  _buildRequestConfig (config = {}) {
    const { headers, credentials, ...otherConfig } = config
    return {
      ...otherConfig,
      credentials: credentials || this.credentials,
      headers: {
        ...this.headers,
        ...headers,
      },
    }
  }

  /**
   *
   * @param {string} urlPathName
   * @param {string|Object} params
   * @returns {string}
   * @private
   */
  _buildURL (urlPathName, params) {
    const query = params ? `?${new URLSearchParams(params)}` : ''
    return `${this.baseUrl}${urlPathName}${query}`
  }

  /**
   *
   * @param {Response} response
   * @returns {null|string|JSON}
   * @private
   */
  _parseResponseBody (response) {
    try {
      const contentType = response.headers.get('Content-Type')

      if (contentType.includes('application/json')) return response.json()

      return response.text()

    } catch {
      console.error('Failed to parse response body ', response)
      return null

    }
  }

  /**
   *
   * @param {Response} response
   * @returns {Promise<{headers: *, data: *, ok: *, status: *}>}
   * @private
   */
  async _mapResponse (response) {
    return {
      ok: response.ok,
      status: response.status,
      headers: response.headers,
      data: await this._parseResponseBody(response),
    }
  }

  /**
   *
   * @param {string} urlPathName
   * @param {Object} config
   * @returns {Promise<{headers: *, data: *, ok: *, status: *}>}
   */
  get (urlPathName, config = {}) {
    return this.fetch(urlPathName, {
      ...config,
      method: 'GET',
    })
  }

  /**
   *
   * @param {string} urlPathName
   * @param {Object} config
   * @returns {Promise<{headers: *, data: *, ok: *, status: *}>}
   */
  async fetch (urlPathName, config = {}) {
    const requestConfig = this._buildRequestConfig(config)
    const requestUrl = this._buildURL(urlPathName, config.params)

    const response = await fetch(requestUrl, requestConfig)

    if(response.status !== 200) {
      throw new Error(`request status ${response.status}: ${requestUrl} failed `)
    }

    return await this._mapResponse(response)
  }
}