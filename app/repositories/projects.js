import gitClient from '../core/GitClient.js'
import { Project } from '../mappers/mapToProject.js'
import mapToMember, { Member } from '../mappers/mapToMember.js'
import store from '../store/index.js'

/**
 * this function also store data to roles
 * @param {Project} project
 * @returns {Promise<Member[]>}
 */
export const getProjectMembersAll = async (project) => {
  const response = await gitClient.getPaginated(`/projects/${project.id}/members`)

  const data = mapToMember(response.data)

  data.forEach(member => {
    store.addUserAccessEntity(member, project)
  })

  return data
}
