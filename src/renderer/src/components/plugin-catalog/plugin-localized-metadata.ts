import { translate } from '@/i18n/i18n'

type LocalizedPluginMetadata = {
  sourceName: string
  sourceDescription: string
  name: string
  description: string
}

function officialPluginMetadata(pluginKey: string): LocalizedPluginMetadata | null {
  switch (pluginKey) {
    case 'stablyai.orca-multipass-recipes':
      return {
        sourceName: 'Orca Multipass Recipes',
        sourceDescription: 'A reviewed starter lifecycle for disposable Multipass workspaces.',
        name: translate(
          'auto.components.settings.PluginCatalogMetadata.multipassRecipesName',
          'Orca Multipass Recipes'
        ),
        description: translate(
          'auto.components.settings.PluginCatalogMetadata.multipassRecipesDescription',
          'A reviewed starter lifecycle for disposable Multipass workspaces.'
        )
      }
    case 'stablyai.orca-navigation-shortcuts':
      return {
        sourceName: 'Orca Navigation Shortcuts',
        sourceDescription: 'Command aliases and optional shortcuts for frequent Orca views.',
        name: translate(
          'auto.components.settings.PluginCatalogMetadata.navigationShortcutsName',
          'Orca Navigation Shortcuts'
        ),
        description: translate(
          'auto.components.settings.PluginCatalogMetadata.navigationShortcutsDescription',
          'Command aliases and optional shortcuts for frequent Orca views.'
        )
      }
    case 'stablyai.orca-portuguese':
      return {
        sourceName: 'Orca Portuguese',
        sourceDescription: 'Brazilian Portuguese translations for common Orca navigation.',
        name: translate(
          'auto.components.settings.PluginCatalogMetadata.portugueseName',
          'Orca Portuguese'
        ),
        description: translate(
          'auto.components.settings.PluginCatalogMetadata.portugueseDescription',
          'Brazilian Portuguese translations for common Orca navigation.'
        )
      }
    default:
      return null
  }
}

export function localizedPluginName(
  pluginKey: string,
  fallback: string,
  official: boolean
): string {
  const metadata = official ? officialPluginMetadata(pluginKey) : null
  return metadata && metadata.sourceName === fallback ? metadata.name : fallback
}

export function localizedPluginDescription(
  pluginKey: string,
  description: string | undefined,
  official: boolean
): string | undefined {
  const metadata = official ? officialPluginMetadata(pluginKey) : null
  return metadata && metadata.sourceDescription === description ? metadata.description : description
}

export function localizedPluginCategory(category: string): string {
  switch (category) {
    case 'languages':
      return translate(
        'auto.components.settings.PluginCatalogMetadata.categoryLanguages',
        'Languages'
      )
    case 'official':
      return translate(
        'auto.components.settings.PluginCatalogMetadata.categoryOfficial',
        'Official'
      )
    case 'vm-recipes':
      return translate(
        'auto.components.settings.PluginCatalogMetadata.categoryVmRecipes',
        'VM recipes'
      )
    case 'keybindings':
      return translate(
        'auto.components.settings.PluginCatalogMetadata.categoryKeybindings',
        'Keybindings'
      )
    default:
      return category
  }
}
