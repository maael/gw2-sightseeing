import { User } from '@prisma/client'
import isAfter from 'date-fns/isAfter'
import subDays from 'date-fns/subDays'
import fetch from 'isomorphic-fetch'
import { prisma } from '~/util/prisma'

async function getGw2Data(apiKey: string, path: string) {
  return fetch(`https://api.guildwars2.com/v2/${path}`, { headers: { Authorization: `Bearer ${apiKey}` } }).then((d) =>
    d.json()
  )
}

async function mapClass(apiKey: string, specializations: { pve: { id: number }[] }, profession: string) {
  for (const spec of specializations.pve) {
    const data = await getGw2Data(apiKey, `specializations/${spec.id}`)
    if (data.elite) return data.name
  }
  return profession
}

async function mapWorld(apiKey: string, worldId: number) {
  const data = await getGw2Data(apiKey, `worlds?ids=${worldId}`)
  const world = data ? data[0] : null
  if (!world) return { id: 0, name: 'Unknown', region: 'Unknown' }
  return {
    id: world.id.toString(),
    name: world.name,
    region: world.id.toString().startsWith('1') ? 'NA' : 'EU',
  }
}

async function getFullGw2Data(apiKey: string, gw2User: any) {
  const ts = new Date().toISOString()
  const world = await mapWorld(apiKey, gw2User.world)
  const characters = await Promise.all(
    (
      await getGw2Data(apiKey, 'characters?ids=all')
    ).map(async ({ name, race, gender, profession, guild, age, specializations }) => {
      const classData = await mapClass(apiKey, specializations, profession)
      return {
        name,
        race,
        gender,
        profession,
        guild: guild || '',
        age,
        class: classData,
      }
    })
  )
  const guilds = (await Promise.all(gw2User.guilds.map((g) => getGw2Data(apiKey, `guild/${g}`)))).map((g) => {
    return {
      id: g.id,
      name: g.name,
      tag: g.tag,
    }
  })
  const data = {
    gw2Id: gw2User.id,
    gw2Name: gw2User.name,
    accountData: {
      characters,
      name: gw2User.name,
      guilds,
      access: gw2User.access,
      world,
    },
    primaryCharacter: 0,
    createdAt: ts,
    updatedAt: ts,
    apiKey,
    settings: {
      mode: 'dark',
    },
    status: 'active',
    role: 'user',
  }
  return data
}

async function handleExistingUser(apiKey: string) {
  const matchingUser = await prisma.user.findFirst({ where: { apiKey } })
  if (matchingUser) return { user: updateExistingUser(apiKey, matchingUser), gw2User: undefined }
  const gw2User = await getGw2Data(apiKey, 'account')
  const altMatchingUser = await prisma.user.findFirst({ where: { gw2Id: gw2User.id } })
  if (altMatchingUser) return { user: updateExistingUser(apiKey, altMatchingUser, gw2User), gw2User }
  return { user: null, gw2User }
}

async function updateExistingUser(apiKey: string, user: User, gw2UserBase?: any) {
  if (isAfter(user.updatedAt, subDays(new Date(), 1))) return user
  console.info('[REFRESHING]', user.gw2Name)
  const gw2User = gw2UserBase ?? (await getGw2Data(apiKey, 'account'))
  const data = await getFullGw2Data(apiKey, gw2User)
  const updated = await prisma.user.update({
    where: { gw2Id: data.gw2Id },
    data: {
      gw2Name: data.gw2Name,
      accountData: {
        update: {
          access: data.accountData.access,
          guilds: data.accountData.guilds,
          name: data.accountData.name,
          characters: data.accountData.characters,
          world: data.accountData.world,
        },
      },
      updatedAt: data.updatedAt,
      apiKey: apiKey,
    },
  })
  return updated
}

async function handleNewUser(apiKey: string, gw2User: any) {
  const data = await getFullGw2Data(apiKey, gw2User)
  return prisma.user.create({
    data,
  })
}

export async function getUserByToken(apiKey: string) {
  const { user, gw2User } = await handleExistingUser(apiKey)
  if (user) return user
  if (!gw2User) return
  return handleNewUser(apiKey, gw2User)
}
