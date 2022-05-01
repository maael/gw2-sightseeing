export type DessaMessage = LinkData | ArcMessage

export interface LinkData {
  type: 'link'
  ui_version: number
  ui_tick: number
  avatar: {
    front: [number, number]
    top: [number, number]
    position: [number, number]
  }
  name: string
  camera: {
    front: [number, number]
    top: [number, number]
    position: [number, number]
  }
  identity: {
    name: string
    profession: number
    spec: number
    race: number
    map_id: number
    world_id: number
    team_color_id: number
    commander: boolean
    map: number
    fov: number
    uisz: number
  }
  context_len: number
  context: {
    server_address: number[]
    map_id: number
    map_type: number
    shard_id: number
    instance: number
    build_id: number
    ui_state: number
    compass_width: number
    compass_height: number
    compass_rotation: number
    player_x: number
    player_y: number
    map_center_x: number
    map_center_y: number
    map_scale: number
    process_id: number
    mount_index: number
  }
  description: string
}

export type ArcBoolean = 0 | 1

export type ArcMessage = EvMessage | AgMessage

export interface EvMessage {
  type: 'arc'
  sub_type: 'ev_bytes'
  indicator: number
  skillname: string
  id: number
  revision: number
  src_agent: string
  dst_agent: string
  value: number
  buff_dmg: number
  overstack_value: number
  skillid: number
  src_instid: number
  dst_instid: number
  src_master_instid: number
  dst_master_instid: number
  iff: number
  buff: ArcBoolean
  result: number
  is_activation: ArcBoolean
  is_buffremove: ArcBoolean
  is_ninety: ArcBoolean
  is_fifty: ArcBoolean
  is_moving: ArcBoolean
  is_statechange: ArcBoolean
  is_flanking: ArcBoolean
  is_shields: ArcBoolean
  is_offcycle: ArcBoolean
  pad61: number
  pad62: number
  pad63: number
  pad64: number
}

export interface AgMessage {
  type: 'arc'
  sub_type: 'ag_bytes'
  indicator: number
  skillname: string
  id: number
  revision: number
  ag_id: number
  prof: number
  elite: ArcBoolean
  self_: any
  team: number
}
