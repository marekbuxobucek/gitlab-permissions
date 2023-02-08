import configRoles from '../config/roles.js'

/**
 *
 * @param {String|Number} accessLevel
 */
export default function (accessLevel) {
  const accessLevelInt = parseInt(accessLevel)

  return configRoles.roles[accessLevelInt] ?? ''
}