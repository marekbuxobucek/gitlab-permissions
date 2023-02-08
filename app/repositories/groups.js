import gitClient from '../core/GitClient.js'
import mapToGroup, { Group } from '../mappers/mapToGroup.js'
import mapToMember, { Member } from '../mappers/mapToMember.js'
import store from '../store/index.js'

/**
 *
 * @param {number} groupId
 * @returns {Promise<Group>}
 */
export const getGroupDetail = async (groupId) => {

  const response = await gitClient.get(`/groups/${groupId}`)

  return mapToGroup(response.data)
}

/**
 * @param {number} groupId
 * @returns {Promise<Group[]>}
 */
export const getDescendantGroups = async (groupId) => {
  const response = await gitClient.getPaginated(`/groups/${groupId}/descendant_groups`)

  return mapToGroup(response.data)
}

/**
 * this function also store data to roles
 * @param {Group} group
 * @returns {Promise<Member[]>}
 */
export const getGroupMembersAll = async (group) => {
  const response = await gitClient.getPaginated(`/groups/${group.id}/members`)

  const data = mapToMember(response.data)

  data.forEach(member => {
    store.addUserAccessEntity(member, group)
  })

  return data
}