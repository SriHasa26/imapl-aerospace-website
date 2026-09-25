import { useState } from 'react'
import { offices } from '../content/contact'

interface MapPoint {
  id: string
  city: string
  area: string
  query: string
  zoom: number
}

const TILE_X = [20, 21, 22, 23] as const
const TILE_Y = [13, 14, 15] as const
const ZOOM = 5
const TILE = 256

const points: MapPoint[] = [
  {
    id: 'peenya-corporate',
    city: 'Bengaluru',
    area: 'Peenya',
    query: '73 6th Main 3rd Phase Peenya Industrial Area Bengaluru 560058',
    zoom: 16,
  },
  {
    id: 'thigalarapalya-welding',
    city: 'Bengaluru',
    area: 'Thigalarapalya',
    query: 'Sri Raghavendra Industrial Estate Thigalarapalya Main Road Bengaluru 560058',
    zoom: 16,
  },
  {
    id: 'ajman-uae',
    city: 'Ajman',
    area: 'UAE',
    query: 'Ajman United Arab Emirates',
    zoom: 12,
  },
]

const cityPins = [
  {
    id: 'bengaluru',
    city: 'Bengaluru',
    lat: 13.023,
    lon: 77.514,
    pointId: 'peenya-corporate',
    areas: ['Peenya', 'Thigalarapalya'],
    align: 'left' as const,
  },
  {
    id: 'ajman',
    city: 'Ajman',
    lat: 25.4052,
    lon: 55.5136,
    pointId: 'ajman-uae',
    areas: ['UAE Office'],
    align: 'right' as const,
  },
]

function pinPercent(lat: number, lon: number) {
  const originX = TILE_X[0] * TILE
  const originY = TILE_Y[0] * TILE
  const width = TILE_X.length * TILE
  const height = TILE_Y.length * TILE
  const x = ((lon + 180) / 360) * (2 ** ZOOM) * TILE
  const sine = Math.sin((lat * Math.PI) / 180)
  const y = (0.5 - Math.log((1 + sine) / (1 - sine)) / (4 * Math.PI)) * (2 ** ZOOM) * TILE
  return {
    left: `${((x - originX) / width) * 100}%`,
    top: `${((y - originY) / height) * 100}%`,
  }
}

function googleEmbed(query: string, zoom: number) {
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=${zoom}&hl=en&output=embed`
}

function googleSearch(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

function officeFor(id: string) {
  return offices.find((office) => office.id === id)
}

const tiles = TILE_Y.flatMap((y) =>
  TILE_X.map((x) => ({
    x,
    y,
    src: `/maps/tiles/esri-5-${x}-${y}.jpg`,
  })),
)

export default function LocationsMap() {
  const [activeId, setActiveId] = useState('overview')
  const activePoint = points.find((point) => point.id === activeId)

  return (
    <div className="absolute inset-0 bg-[#d6e4f0]">
      {activePoint ? (
        <iframe
          key={activePoint.id}
          title={`${activePoint.city} ${activePoint.area} map`}
          src={googleEmbed(activePoint.query, activePoint.zoom)}
          className="absolute inset-0 h-full w-full border-0"
          loading="eager"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div className="absolute inset-0">
          <div
            className="grid h-full w-full"
            style={{
              gridTemplateColumns: `repeat(${TILE_X.length}, 1fr)`,
              gridTemplateRows: `repeat(${TILE_Y.length}, 1fr)`,
            }}
          >
            {tiles.map((tile) => (
              <img
                key={`${tile.x}-${tile.y}`}
                src={tile.src}
                alt=""
                className="h-full w-full object-cover"
                draggable={false}
              />
            ))}
          </div>
          {cityPins.map((pin) => (
            <button
              key={pin.id}
              type="button"
              className="work-map-pin"
              style={pinPercent(pin.lat, pin.lon)}
              onClick={() => setActiveId(pin.pointId)}
              aria-label={`${pin.city} locations`}
            >
              <span className="work-map-pin-ring" />
              <span className="work-map-pin-dot" />
              <span className={`work-map-label ${pin.align === 'left' ? 'work-map-label-left' : 'work-map-label-right'}`}>
                <span className="work-map-label-city">{pin.city}</span>
                {pin.areas.map((area) => (
                  <span key={area} className="work-map-label-area">{area}</span>
                ))}
              </span>
            </button>
          ))}
        </div>
      )}

      <div className="absolute left-3 top-3 z-10 max-w-[70%] rounded-sm bg-navy/80 px-3 py-2 backdrop-blur-md">
        <div className="font-mono text-[11px] uppercase tracking-widest text-orange">
          {activePoint ? `${activePoint.city} · ${activePoint.area}` : 'IMAPL Locations'}
        </div>
        <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-white/80">
          {activePoint ? officeFor(activePoint.id)?.label : 'Bengaluru · Ajman'}
        </div>
      </div>

      {activePoint && (
        <button
          type="button"
          className="absolute right-3 top-3 z-10 border border-white/20 bg-navy/80 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-white backdrop-blur-md hover:text-orange"
          onClick={() => setActiveId('overview')}
        >
          All locations
        </button>
      )}

      <div className="absolute inset-x-0 bottom-0 z-10 p-2.5">
        <div className="grid grid-cols-3 gap-2">
          {points.map((point) => {
            const selected = activeId === point.id
            return (
              <button
                key={point.id}
                type="button"
                className={`work-map-site-btn ${selected ? 'is-active' : ''}`}
                onClick={() => setActiveId(selected ? 'overview' : point.id)}
              >
                <span className="font-display text-sm font-bold leading-none text-white sm:text-base">{point.city}</span>
                <span className="mt-1 block font-mono text-[10px] uppercase tracking-widest text-orange">
                  {point.area}
                </span>
              </button>
            )
          })}
        </div>
        {activePoint && (
          <a
            href={googleSearch(activePoint.query)}
            target="_blank"
            rel="noreferrer"
            className="mt-2 block text-center font-mono text-[10px] uppercase tracking-widest text-orange hover:text-orange-light"
          >
            Open {activePoint.city} in Google Maps
          </a>
        )}
      </div>
    </div>
  )
}
