import { useState } from "react";
import { MapPin, Plus, Minus, Maximize2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";

interface MapViewProps {
  latitude?: number;
  longitude?: number;
  locationName?: string;
}

export function MapView({ latitude, longitude, locationName }: MapViewProps) {
  const [zoom, setZoom] = useState(12);
  const minZoom = 4;
  const maxZoom = 18;

  const handleZoomIn = () => setZoom((z) => Math.min(maxZoom, z + 1));
  const handleZoomOut = () => setZoom((z) => Math.max(minZoom, z - 1));

  // Grid size decreases as zoom increases to simulate zooming in
  const gridSize = Math.max(8, 40 - (zoom - minZoom) * 2);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          Project Location Map
        </CardTitle>
      </CardHeader>
      <CardContent>
        {latitude && longitude ? (
          <div className="relative w-full h-72 bg-[#e8f4e8] rounded-lg overflow-hidden border select-none">
            {/* Map-like background with colored regions */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, #d4e8d4 0%, #e8f0e0 25%, #c2dbe8 50%, #d0e4d0 75%, #e0eed0 100%)",
              }}
            />

            {/* Simulated water bodies */}
            <div
              className="absolute rounded-full opacity-40"
              style={{
                width: `${120 + zoom * 4}px`,
                height: `${60 + zoom * 2}px`,
                top: "15%",
                right: "10%",
                background: "linear-gradient(135deg, #90cdf4, #63b3ed)",
              }}
            />
            <div
              className="absolute rounded-full opacity-30"
              style={{
                width: `${80 + zoom * 3}px`,
                height: `${40 + zoom * 2}px`,
                bottom: "20%",
                left: "5%",
                background: "linear-gradient(135deg, #90cdf4, #63b3ed)",
              }}
            />

            {/* Simulated road lines */}
            <div className="absolute inset-0 overflow-hidden">
              <div
                className="absolute bg-white/50"
                style={{
                  height: "2px",
                  width: "140%",
                  top: "45%",
                  left: "-20%",
                  transform: "rotate(-12deg)",
                }}
              />
              <div
                className="absolute bg-white/50"
                style={{
                  height: "2px",
                  width: "140%",
                  top: "60%",
                  left: "-20%",
                  transform: "rotate(8deg)",
                }}
              />
              <div
                className="absolute bg-white/40"
                style={{
                  width: "2px",
                  height: "140%",
                  left: "35%",
                  top: "-20%",
                  transform: "rotate(5deg)",
                }}
              />
              <div
                className="absolute bg-white/40"
                style={{
                  width: "2px",
                  height: "140%",
                  left: "65%",
                  top: "-20%",
                  transform: "rotate(-8deg)",
                }}
              />
            </div>

            {/* Grid overlay */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)",
                backgroundSize: `${gridSize}px ${gridSize}px`,
              }}
            />

            {/* Marker Pin */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[100%] flex flex-col items-center z-10">
              <div className="bg-white px-2.5 py-1 rounded-lg shadow-lg text-xs font-bold mb-1 max-w-[170px] truncate text-center border border-gray-200">
                {locationName || "Project Site"}
              </div>
              <MapPin className="w-9 h-9 text-red-500 fill-red-100 drop-shadow-lg" />
              <div className="w-3 h-1.5 bg-black/25 blur-[3px] rounded-full mt-0.5" />
            </div>

            {/* Zoom Controls */}
            <div className="absolute top-3 right-3 flex flex-col gap-1 z-10">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-white/95 backdrop-blur-sm shadow-md hover:bg-white border-gray-300"
                onClick={handleZoomIn}
                disabled={zoom >= maxZoom}
              >
                <Plus className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-white/95 backdrop-blur-sm shadow-md hover:bg-white border-gray-300"
                onClick={handleZoomOut}
                disabled={zoom <= minZoom}
              >
                <Minus className="w-4 h-4" />
              </Button>
            </div>

            {/* Zoom level indicator */}
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] text-muted-foreground font-mono shadow-sm border border-gray-200 z-10">
              Zoom: {zoom}x
            </div>

            {/* Coordinates overlay */}
            <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] text-muted-foreground font-mono shadow-sm border border-gray-200">
              {latitude.toFixed(6)}, {longitude.toFixed(6)}
            </div>

            {/* Map attribution placeholder */}
            <div className="absolute bottom-2 right-2 flex items-center gap-1">
              <Maximize2 className="w-3 h-3 text-muted-foreground/60" />
              <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded shadow-sm text-[10px] text-muted-foreground font-medium border border-gray-200">
                Map View
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-72 bg-muted rounded-lg border border-dashed border-muted-foreground/30 text-muted-foreground">
            <MapPin className="w-8 h-8 mb-2 opacity-50" />
            <p>Location coordinates not provided</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
