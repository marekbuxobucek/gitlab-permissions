import mapData from './mapData.js'
import mapToProject from './mapToProject.js'

export const KIND_GROUP = 'group'

/**
 *   @returns {{id: number,projects: *[],webUrl: string,name: string,fullPath: string,description: string,kind: 'group'}}
 */
export class Group {
  constructor (data) {
    this.id = data.id
    this.projects = mapData(mapToProject, data.projects ?? [])
    this.fullPath = data.full_path ?? ''
    this.kind = KIND_GROUP
  }
}

const mapToGroup = (data) => {
  return new Group(data)
}

export default function (data) {
  return mapData(mapToGroup, data)
}