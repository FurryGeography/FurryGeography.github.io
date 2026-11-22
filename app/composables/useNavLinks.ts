import type { NavigationMenuItem } from '@nuxt/ui'

export const useNavLinks = () => {
  const { t } = useI18n()
  const localePath = useLocalePath()

  return computed<NavigationMenuItem[]>(() => [
    {
      label: t('nav.home'),
      icon: 'i-lucide-house',
      to: localePath('/')
    },
    {
      label: t('nav.about'),
      icon: 'i-lucide-info',
      to: localePath('/about')
    },
    {
      label: t('nav.members'),
      icon: 'i-lucide-users',
      to: localePath('/members')
    },
    {
      label: t('nav.research'),
      icon: 'i-lucide-microscope',
      to: localePath('/research')
    },
    {
      label: t('nav.publications'),
      icon: 'i-lucide-book-open',
      to: localePath('/publications')
    },
    {
      label: t('nav.collaborations'),
      icon: 'i-lucide-network',
      to: localePath('/collaborations')
    }
  ])
}
