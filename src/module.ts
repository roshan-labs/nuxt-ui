import { existsSync } from 'fs'
import type { ModuleOptions as WindiModuleOptions } from 'nuxt-windicss'
import type { FullConfig } from 'windicss/types/interfaces'
import {
  addComponentsDir,
  createResolver,
  defineNuxtModule,
  installModule,
  resolvePath,
} from '@nuxt/kit'
import WindiModule from 'nuxt-windicss'
import type { Options as IconModuleOptions } from 'unplugin-icons'
import IconModule from 'unplugin-icons/nuxt'
import { defu } from 'defu'

import { name as packageName, version } from '../package.json'
import { extendUserConfig } from './runtime/windicss'

export interface ModuleOptions {
  /** 组件前缀 */
  prefix?: string
}

const module = defineNuxtModule<ModuleOptions>({
  meta: {
    name: packageName,
    version,
    configKey: 'nuxtUI',
  },
  defaults: {
    prefix: 'n',
  },
  async setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)
    const componentsPath = resolver.resolve('./runtime/components')
    const windiConfigPath = await resolvePath('windi.config')
    const defaultWindiOptions: WindiModuleOptions = {
      scan: {
        include: [`${componentsPath}/**/*.{vue,tsx}`],
      },
    }

    let windiConfig: FullConfig | string | undefined

    // 读取 windicss.config 配置
    if (['object', 'string'].includes(typeof nuxt.options.windicss?.config)) {
      windiConfig = nuxt.options.windicss?.config
    }

    // 如果上一步读取的配置是对象则与 UI 配置合并
    if (typeof windiConfig === 'object') {
      windiConfig = extendUserConfig(windiConfig)
    }

    if (!windiConfig && !existsSync(windiConfigPath)) {
      windiConfig = extendUserConfig()
    }

    // 注册组件
    addComponentsDir({
      path: componentsPath,
      prefix: options.prefix,
    })

    // 安装 icon 模块
    await installModule(IconModule, {
      autoInstall: true,
      iconCustomizer(_collection, _icon, props) {
        // 重置图标样式
        props.width = '1em'
        props.height = '1em'
      },
    } as IconModuleOptions)
    // 安装 windicss 模块
    await installModule(WindiModule, {
      ...defu(nuxt.options.windicss || {}, defaultWindiOptions),
      config: windiConfig,
    } as WindiModuleOptions)
  },
})

declare module '@nuxt/schema' {
  // 修复 nuxt-windicss 模块未导出类型
  interface NuxtOptions {
    windicss?: WindiModuleOptions
  }

  interface NuxtConfig {
    nuxtUI?: ModuleOptions
  }
}

export { module as default }
