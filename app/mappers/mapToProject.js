import mapData from './mapData.js'

export const KIND_PROJECT = 'project'

/**
 *   @returns {{id: number,name: string,webUrl: string,kind: 'project'}}
 */
export class Project {
  constructor (data) {
    this.id = data.id
    this.fullPath = data.path_with_namespace ?? ''
    this.kind = KIND_PROJECT
  }
}

const mapToProject = (data) => {
  return new Project(data)
}

export default function (data) {
  return mapData(mapToProject, data)
}