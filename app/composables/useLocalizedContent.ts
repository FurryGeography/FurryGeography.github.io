export const useLocalizedContent = () => {
  const { locale } = useI18n()

  // Default language
  const fallbackLocale = 'en'

  const localize = (
    content: Record<string, string> | null | undefined
  ): string => {
    if (!content) return ''

    return (
      content[locale.value] ||
      content[fallbackLocale] ||
      Object.values(content).find(Boolean) ||
      ''
    )
  }

  return { localize }
}