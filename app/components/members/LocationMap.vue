<script setup lang="ts">
import 'leaflet/dist/leaflet.css'

interface MapMember {
  latitude: number
  longitude: number
  slug: string
  name: string
  href: string
  external: boolean
}

const props = defineProps<{ members: MapMember[] }>()
const { t, locale } = useI18n()
const canvas = useTemplateRef<HTMLDivElement>('canvas')

let map: import('leaflet').Map | undefined
let observer: ResizeObserver | undefined
let stopMarkers: (() => void) | undefined
let disposed = false

function createMemberLinks(people: MapMember[]) {
  const container = document.createElement('div')

  for (const member of people) {
    const link = document.createElement('a')
    link.textContent = member.name
    link.href = member.href
    link.style.display = 'block'

    if (member.external) {
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
    }

    container.append(link)
  }

  return container
}

onMounted(async () => {
  const L = await import('leaflet')
  if (disposed || !canvas.value) return

  const element = canvas.value
  const instance = L.map(element, {
    zoomControl: false,
    zoomSnap: 0,
    worldCopyJump: true
  })
  map = instance

  // Leaflet copyright
  instance.attributionControl.setPrefix(
    '<a href="https://leafletjs.com/">Leaflet</a>'
  )

  L.control.zoom({
    position: 'topleft',
    zoomInTitle: t('memberMap.zoomIn'),
    zoomOutTitle: t('memberMap.zoomOut')
  }).addTo(instance)

  function resetView() {
    instance.invalidateSize({ pan: false })
    instance.closePopup()

    const zoom = Math.log2(instance.getSize().x * 1.03 / 256)
    instance.setView([29, 0], zoom, { animate: false })
  }

  resetView()

  const homeControl = new L.Control({ position: 'topleft' })

  homeControl.onAdd = () => {
    const box = L.DomUtil.create('div', 'leaflet-bar')
    const button = L.DomUtil.create('button', '', box)

    button.type = 'button'
    button.textContent = '⌂'
    button.dataset.mapHome = ''
    button.title = t('memberMap.home')
    button.setAttribute('aria-label', button.title)
    button.addEventListener('click', resetView)

    L.DomEvent.disableClickPropagation(box)
    return box
  }

  homeControl.addTo(instance)

  observer = new ResizeObserver(() => {
    instance.invalidateSize({ pan: false })
  })
  observer.observe(element)

  const markers = L.layerGroup().addTo(instance)

  stopMarkers = watch(() => props.members, (members) => {
    markers.clearLayers()

    // All share a single point at the same coordinates,
    // while each member retains an individual link.
    const places = new Map<string, MapMember[]>()

    for (const member of members) {
      const key = `${member.latitude},${member.longitude}`
      const people = places.get(key)

      if (people) people.push(member)
      else places.set(key, [member])
    }

    for (const people of places.values()) {
      const first = people[0]
      if (!first) continue

      const marker = L.circleMarker([first.latitude, first.longitude], {
        radius: 8,
        color: '#fff',
        weight: 2,
        fillColor: '#146858',
        fillOpacity: 1
      }).addTo(markers)

      const label = createMemberLinks(people)
      L.DomEvent.disableClickPropagation(label)

      marker.bindTooltip(label, {
        permanent: true,
        interactive: true,
        direction: 'top',
        offset: [0, -9],
        opacity: 1
      })

      marker.on('click', () => {
        if (first.external) {
          window.open(first.href, '_blank', 'noopener,noreferrer')
        } else {
          window.location.assign(first.href)
        }
      })
    }
  }, { immediate: true })

  const token = import.meta.env.VITE_GEOVIS_TOKEN || ''
  let useChinaMap = Boolean(token) && locale.value === 'zh'

  // When a geovisearth token is configured,
  // the English-language pages can also display different base maps based on the visitor's region.
  if (token && !useChinaMap) {
    try {
      const response = await fetch('https://ipwho.is/', {
        signal: AbortSignal.timeout(2500)
      })
      const data = response.ok ? await response.json() : null
      useChinaMap = data?.success === true && data.country_code === 'CN'
    } catch {
      useChinaMap = false
    }
  }

  if (disposed) return

  const params = 'token=6e2c06344f8697689935f49ef3967f1e&tmsIds=w'

  const street = L.tileLayer(
    useChinaMap
      ? `https://api.open.geovisearth.com/map/v1/vec/{z}/{x}/{y}?${params}&format=png`
      : 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      maxZoom: 17,
      minNativeZoom: useChinaMap ? 1 : 0,
      noWrap: true,
      attribution: useChinaMap
        ? '© Geovisearth'
        : '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }
  ).addTo(instance)

  const satellite = L.tileLayer(
    useChinaMap
      ? `https://api.open.geovisearth.com/pj/base/v1/2025/{z}/{x}/{y}?${params}&format=webp`
      : 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    {
      maxZoom: 16,
      tileSize: 256,
      noWrap: true,
      attribution: useChinaMap
        ? '© Geovisearth'
        : 'Tiles © Esri — Esri, Maxar, Earthstar Geographics, and the GIS User Community'
    }
  )

  L.control.layers({
    [t('memberMap.street')]: street,
    [t('memberMap.satellite')]: satellite
  }, undefined, {
    position: 'topright',
    collapsed: false
  }).addTo(instance)
})

onBeforeUnmount(() => {
  disposed = true
  stopMarkers?.()
  observer?.disconnect()
  map?.remove()
})
</script>

<template>
  <section
    aria-labelledby="member-map-heading"
    class="mx-auto max-w-6xl px-6 pb-24"
  >
    <h2
      id="member-map-heading"
      class="border-t border-default pt-10 text-3xl font-medium tracking-tight"
    >
      {{ t('memberLocations') }}
    </h2>

    <div
      ref="canvas"
      :aria-label="t('memberLocations')"
      class="relative isolate mt-6 h-[min(70vw,288px)] overflow-hidden rounded-lg border border-default sm:h-[30rem]"
    />
  </section>
</template>

<style scoped>
:deep([data-map-home]) {
  width: 30px;
  height: 30px;
  border: 0;
  background: white;
  color: #333;
  font-size: 20px;
  cursor: pointer;
}
</style>
