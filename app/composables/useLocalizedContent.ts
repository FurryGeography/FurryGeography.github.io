export const useLocalizedContent = () => {
  const { locale, defaultLocale } = useI18n()

  const localize = (
    content: Record<string, string> | null | undefined
  ): string => {
    if (!content) return ''

    return (
      content[locale.value]
      || content[defaultLocale]
      || Object.values(content).find(Boolean)
      || ''
    )
  }

  return { localize }
}
