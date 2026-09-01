import packageJson from '../../../package.json' with { type: 'json' }

interface UiPackageJson {
  name: string
  version: string
}

const uiPackage = packageJson as UiPackageJson

export function getUiPackageMeta() {
  return {
    name: uiPackage.name,
    version: uiPackage.version,
  }
}
