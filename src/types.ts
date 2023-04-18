export interface ModuleOptions {
  /** 是否开启工具类支持 */
  utilityClass: boolean
}

export type ResolveRuntime = (path: string) => string

export type PresetImport = string | [name: string, as?: string, from?: string]
