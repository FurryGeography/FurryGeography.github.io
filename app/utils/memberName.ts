interface MemberName {
  givenName?: string | null
  middleName?: string | null
  familyName?: string | null
  displayName?: Record<string, string> | null
  nickname?: Record<string, string> | null
  name?: string | null
}

interface DirectoryMember extends MemberName {
  slug: string
  order?: number | null
}

export function formatMemberName(member: MemberName, locale: string): string {
  const language = locale.split('-')[0] ?? locale
  const preferred = member.displayName?.[locale] || member.displayName?.[language]

  if (preferred) return preferred

  const parts = [member.givenName, member.middleName, member.familyName]
  return parts.filter(Boolean).join(' ') || member.name || ''
}

export function formatMemberHeading(member: MemberName, locale: string): string {
  const name = formatMemberName(member, locale)
  const language = locale.split('-')[0] || locale
  const nicknames = member.nickname ?? {}

  const nickname = [
    nicknames[locale],
    nicknames[language],
    nicknames.en,
    ...Object.values(nicknames)
  ]
    .map(value => value?.trim())
    .find(Boolean)

  if (!nickname || nickname === name.trim()) return name
  if (!name) return nickname

  return language === 'zh'
    ? `${name}（${nickname}）`
    : `${name} (${nickname})`
}

export function memberComparator(locale: string) {
  const { compare } = new Intl.Collator(locale, { sensitivity: 'accent' })

  return (a: DirectoryMember, b: DirectoryMember): number => {
    const aOrder = a.order ?? Infinity
    const bOrder = b.order ?? Infinity

    if (aOrder !== bOrder) return aOrder - bOrder

    return compare(a.familyName || a.name || '', b.familyName || b.name || '')
      || compare(a.givenName || '', b.givenName || '')
      || compare(a.middleName || '', b.middleName || '')
      || compare(a.slug, b.slug)
      || (a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0)
  }
}
