import RestClient from './RestClient.js'
import appConfig from '../config/index.js'

/**
 *
 * @param {Response} response
 * @returns {*[]}
 */
const addToResponseData = (response) => {
  let data = []
  if (Array.isArray(response.data)) {
    data = data.concat(response.data)
  } else {
    data.push(response.data)
  }

  return data
}

class GitClient extends RestClient {
  /**
   * @param {Object} config
   */
  constructor (config = {}) {
    super({
      ...config,
      baseUrl: appConfig.gitlabRestApi.baseUrl,
      headers: { Authorization: `Bearer ${appConfig.gitlabRestApi.accessToken}` }
    })

  }

  /**
   *
   * @param urlPathName
   * @param config
   * @returns {Promise<{data: *[] }>}
   */
  async getPaginated (urlPathName, config = {}) {
    const currentPage = 1

    const paginatedConfig = {
      ...config,
      params: {
        ...(config?.params && config.params),
        per_page: appConfig.gitlabRestApi.perPage,
        page: currentPage
      }
    }

    const response = await this.get(urlPathName, paginatedConfig)

    const { xNextPage, xTotalPages } = this._pagination(response)

    // if there is not any pagination return original data structure
    if (currentPage === 1 && !xNextPage) {
      return response
    }

    const remainingData = await this._collectDataOfRemainPages(currentPage, xTotalPages, urlPathName, paginatedConfig)

    return { ...response, data: remainingData.concat(addToResponseData(response)) }
  }

  /**
   *
   * @param {number} currentPage
   * @param {number} xTotalPages
   * @param {string} urlPathName
   * @param {Object} config
   * @returns {Promise<*[]>}
   * @private
   */
  async _collectDataOfRemainPages (currentPage, xTotalPages, urlPathName, config) {
    const promiseAll = []
    const remainingPages = xTotalPages - currentPage

    const paginationConfig = { ...config }

    for (let index = 0; index < remainingPages; index++) {

      paginationConfig.params.page = currentPage + index + 1

      promiseAll.push(this.get(urlPathName, paginationConfig))
    }
    const responses = await Promise.all(promiseAll)

    let data = []

    for (const response of responses) {
      data = data.concat(addToResponseData(response))
    }

    return data
  }

  /**
   *
   * @param response
   * @returns {{xTotalPages: (string|number), xNextPage: (string|number)}}
   * @private
   */
  _pagination (response) {
    const headers = response.headers

    const xNextPage = headers.get('x-next-page') || 0
    const xTotalPages = headers.get('x-total-pages') || 0

    return { xNextPage, xTotalPages }
  }

}

export default new GitClient