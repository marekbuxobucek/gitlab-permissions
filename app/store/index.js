import { Member } from '../mappers/mapToMember.js'
import { KIND_PROJECT, Project } from '../mappers/mapToProject.js'
import { KIND_GROUP, Group } from '../mappers/mapToGroup.js'
import { pluralizationSimple } from '../utils/string.js'

class Store {
  constructor () {
    this.roles = {}
  }

  /**
   *
   * @param {Member} member
   * @param {Project|Group} accessEntity
   */
  addUserAccessEntity (member, accessEntity) {
    if (!this.roles[member.id]) {
      this.roles[member.id] = {
        name: member.name,
        username: member.username,
        [pluralizationSimple(KIND_PROJECT)]: [],
        [pluralizationSimple(KIND_GROUP)]: [],
      }
    }

    // to prevent overriding instance attributes
    const obj = Object.assign({}, accessEntity)
    obj.accessLevel = member.accessLevel
    obj.role = member.role

    this.roles[member.id][pluralizationSimple(accessEntity.kind)].push(obj)
  }

}

export default new Store