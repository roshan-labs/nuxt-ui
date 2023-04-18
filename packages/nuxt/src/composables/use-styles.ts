import type { ModuleOptions as WindiOptions } from 'nuxt-windicss'
import { installModule, resolvePath, useNuxt } from '@nuxt/kit'

import type { ModuleOptions, ResolveRuntime } from '../types'
import { libraryName } from '../config'

export const useStyles = async (options: ModuleOptions, resolveRuntime: ResolveRuntime) => {
  const nuxt = useNuxt()
  const cssPath = `${libraryName}/dist/index.css`

  // 开启工具类支持
  if (options.utilityClass) {
    const proComponentsPath = resolveRuntime('components')

    // 忽略 element-plus 组件 class
    // 并且解析模块包内组件 windicss class
    nuxt.options.windicss = {
      scan: {
        include: [`${proComponentsPath}/**/*.{vue,tsx}`],
        exclude: [await resolvePath(cssPath)],
      },
      ...(nuxt.options.windicss || {}),
    }

    nuxt.options.css.unshift('virtual:windi.css')

    await installModule('nuxt-windicss')
  }

  nuxt.options.css.unshift(cssPath)
}

declare module '@nuxt/schema' {
  interface NuxtOptions {
    windicss?: WindiOptions
  }
}
