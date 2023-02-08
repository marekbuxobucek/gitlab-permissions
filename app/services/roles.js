#!/usr/bin/env node
import chalk from 'chalk'

import config from '../config/index.js'
import { getGroupDetail, getDescendantGroups, getGroupMembersAll } from '../repositories/groups.js'
import { getProjectMembersAll } from '../repositories/projects.js'
import store from '../store/index.js'
import { writeToFile } from '../utils/file.js'
import { KIND_PROJECT } from '../mappers/mapToProject.js'
import { KIND_GROUP } from '../mappers/mapToGroup.js'
import { pluralizationSimple } from '../utils/string.js'

const main = async () => {

  const [, , ...args] = process.argv

  if (args[0] && !parseInt(args[0])) {
    console.log(`${chalk.blue('args: ')} ${chalk.green('Your first argument topGroupId is not a number %s', parseInt(args[0]))}`)
  }
  if (!parseInt(args[0])) {
    console.log(`${chalk.blue('args: ')} ${chalk.green('Using default argument topGroupId ', config.groups.topGroupId)}`)
  }

  const topGroupId = parseInt(args[0]) || config.groups.topGroupId

  let promiseLoaders = []
  let groupsDetail = []

  const topGroup = await getGroupDetail(topGroupId)
  groupsDetail.push(topGroup)

  const descendantGroups = await getDescendantGroups(topGroupId)

  if (!Array.isArray(descendantGroups)) {

  }

  for (let descendantGroup of descendantGroups) {
    promiseLoaders.push(getGroupDetail(descendantGroup.id))
  }

  const descendantGroupsDetail = await Promise.all(promiseLoaders)
  groupsDetail = groupsDetail.concat(descendantGroupsDetail)

  const projects = groupsDetail.reduce((acc, group, index) => {
    return acc.concat(group.projects)
  }, [])

  promiseLoaders = []

  for (let project of projects) {
    promiseLoaders.push(getProjectMembersAll(project))
  }
  await Promise.all(promiseLoaders)

  promiseLoaders = []

  for (let group of groupsDetail) {
    promiseLoaders.push(getGroupMembersAll(group))
  }
  await Promise.all(promiseLoaders)

  printC()

  writeToFile('roles.json', JSON.stringify(store.roles))
}

function printC () {
  console.log(chalk.red('\n<<<<<<<<<<<<<<<<<<<<<<<< >>>>>>>>>>>>>>>>>>>>>>'))
  console.log(chalk.red('<<<<<<<<<<<<<<<<<<<<<<<< >>>>>>>>>>>>>>>>>>>>>>\n'))
  if (!Object.keys(store.roles)) {
   return
  }
  for (let userId of Object.keys(store.roles)) {
    console.log(chalk.red('-----------------------------'))
    console.log(`${chalk.blue(store.roles[userId].name)} [${chalk.yellow(store.roles[userId].username)}]`)
    console.log(`${chalk.magenta('groups:        ')} [${chalk.yellow(store.roles[userId][pluralizationSimple(KIND_GROUP)].map(entity => `${entity.fullPath} || ${entity.role} ||`))}]`)
    console.log(`${chalk.magenta('projects:      ')} [${chalk.yellow(store.roles[userId][pluralizationSimple(KIND_PROJECT)].map(entity => `${entity.fullPath} || ${entity.role} ||`))}]`)
  }

  console.log(chalk.red('\n<<<<<<<<<<<<<<<<<<<<<<<< >>>>>>>>>>>>>>>>>>>>>>'))
  console.log(chalk.red('<<<<<<<<<<<<<<<<<<<<<<<< >>>>>>>>>>>>>>>>>>>>>>\n'))
}

main()
