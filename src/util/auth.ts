import fetch from 'isomorphic-fetch'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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
  if (!world) return null
  return {
    id: world.id,
    name: world.name,
    region: world.id.toString().startsWith('1') ? 'NA' : 'EU',
  }
}

export async function getUserByToken(apiKey: string) {
  const matchingUser = await prisma.user.findFirst({ where: { apiKey } })
  if (matchingUser) return matchingUser
  const gw2User = await getGw2Data(apiKey, 'account')
  const altMatchingUser = await prisma.user.findFirst({ where: { gw2Id: gw2User.id } })
  if (altMatchingUser) return altMatchingUser
  if (gw2User) {
    const ts = new Date().toISOString()
    const characters = await Promise.all(
      (
        await getGw2Data(apiKey, 'characters?ids=all')
      ).map(async ({ name, race, gender, profession, guild, age, specializations, world }) => {
        const [worldData, classData] = await Promise.all([
          mapWorld(apiKey, world),
          mapClass(apiKey, specializations, profession),
        ])
        return {
          name,
          race,
          gender,
          profession,
          world: worldData,
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
    return prisma.user.create({
      data,
    })
  }
  return null
}
