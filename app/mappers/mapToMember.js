import mapData from './mapData.js'
import mapAccessLevelToRole from './mapAccessLevelToRole.js'

export class Member {
  constructor (data) {
    this.id = data.id
    this.name = data.name ?? ''
    this.username = data.username ?? ''
    this.accessLevel = data.access_level ?? ''
    this.role = mapData(mapAccessLevelToRole, this.accessLevel)
  }
}

const mapToMember = (data) => {
  return new Member(data)
}

export default function (data) {
  return mapData(mapToMember, data)
}