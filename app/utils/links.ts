import type { NavigationMenuItem } from '@nuxt/ui'

export const navLinks: NavigationMenuItem[] = [
  {
    label: 'Home',
    icon: 'i-lucide-house',
    to: '/'
  },
  {
    label: 'About',
    icon: 'i-lucide-info',
    to: '/about'
  },
  {
    label: 'Members',
    icon: 'i-lucide-users',
    to: '/members'
  },
  {
    label: 'Research',
    icon: 'i-lucide-microscope',
    to: '/research'
  },
  {
    label: 'Publications',
    icon: 'i-lucide-book-open',
    to: '/publications'
  },
  {
    label: 'Collaborations',
    icon: 'i-lucide-network',
    to: '/collaborations'
  }
]
