import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import logoUrl from "@/assets/logo.png";
import type { StoreLocation } from "@/data/storeLocations";

type Props = {
  stores: StoreLocation[];
  focusedId: string | null;
  onMarkerSelect: (id: string) => void;
};

function useLatest<T>(value: T) {
  const r = useRef(value);
  r.current = value;
  return r;
}

const defaultCenter: L.LatLngExpression = [16.05, 106.3];
const defaultZoom = 6;

function markerIcon() {
  return L.divIcon({
    className: "y99-leaflet-marker-wrap",
    html: `<div class="y99-leaflet-marker"><img src="${logoUrl}" width="14" height="14" alt="" /></div>`,
    iconSize: [28, 32],
    iconAnchor: [14, 32],
    popupAnchor: [0, -28],
  });
}

export function StoreLocatorLeaflet({ stores, focusedId, onMarkerSelect }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const onSelectRef = useLatest(onMarkerSelect);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;

    const map = L.map(el, {
      zoomControl: true,
      scrollWheelZoom: true,
      attributionControl: false,
    }).setView(defaultCenter, defaultZoom);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "",
    }).addTo(map);

    const group = L.layerGroup().addTo(map);
    mapRef.current = map;
    layerRef.current = group;

    const onResize = () => map.invalidateSize();
    window.addEventListener("resize", onResize);
    requestAnimationFrame(() => map.invalidateSize());

    return () => {
      window.removeEventListener("resize", onResize);
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
      markersRef.current.clear();
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const group = layerRef.current;
    if (!map || !group) return;

    group.clearLayers();
    markersRef.current.clear();

    const icon = markerIcon();
    for (const s of stores) {
      const m = L.marker([s.lat, s.lng], { icon })
        .bindPopup(`<strong>${escapeHtml(s.name)}</strong><br/>${escapeHtml(s.address)}`)
        .on("click", () => onSelectRef.current(s.id));
      m.addTo(group);
      markersRef.current.set(s.id, m);
    }

    if (stores.length === 0) {
      map.setView(defaultCenter, defaultZoom);
      return;
    }

    if (stores.length === 1) {
      map.setView([stores[0].lat, stores[0].lng], 14);
      return;
    }

    const bounds = L.latLngBounds(stores.map((s) => [s.lat, s.lng] as L.LatLngTuple));
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 12 });
  }, [stores]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !focusedId) return;
    const marker = markersRef.current.get(focusedId);
    const store = stores.find((s) => s.id === focusedId);
    if (!store) return;

    if (marker) {
      marker.openPopup();
      map.flyTo([store.lat, store.lng], Math.max(map.getZoom(), 15), { duration: 0.6 });
    }
  }, [focusedId, stores]);

  return <div ref={hostRef} className="h-full min-h-[200px] w-full rounded-xl z-0" />;
}

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
