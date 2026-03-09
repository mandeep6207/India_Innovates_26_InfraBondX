import { useEffect, useState } from "react";
import {
  Camera,
  Video,
  FileText,
  MapPin,
  Send,
  Plus,
  CheckCircle2,
  Clock,
  Image as ImageIcon,
  X,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { apiGet } from "@/app/services/api";
import { getIssuerProjects, postProjectUpdate } from "@/app/services/issuer";
import { formatDistanceToNow } from "date-fns";

interface ProjectUpdatesPageProps {
  onNavigate: (page: string) => void;
}

type IssuerProjectDTO = {
  id: number;
  title: string;
  location: string;
  status: string;
};

type ProjectUpdateDTO = {
  id: number;
  media_type: string;
  media_url?: string;
  description: string;
  latitude?: number;
  longitude?: number;
  timestamp: string;
};

type MediaType = "IMAGE" | "VIDEO" | "TEXT";

export function ProjectUpdatesPage({ onNavigate }: ProjectUpdatesPageProps) {
  const [projects, setProjects] = useState<IssuerProjectDTO[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [updates, setUpdates] = useState<ProjectUpdateDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingUpdates, setLoadingUpdates] = useState(false);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [mediaType, setMediaType] = useState<MediaType>("IMAGE");
  const [mediaUrl, setMediaUrl] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await getIssuerProjects();
        if (Array.isArray(res)) setProjects(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const fetchUpdates = async (pid: number) => {
    setLoadingUpdates(true);
    try {
      const res = await apiGet(`/projects/${pid}/updates`);
      if (Array.isArray(res)) setUpdates(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingUpdates(false);
    }
  };

  useEffect(() => {
    if (selectedProjectId) fetchUpdates(selectedProjectId);
  }, [selectedProjectId]);

  const handleSubmit = async () => {
    if (!selectedProjectId || !description.trim()) return;
    setSubmitting(true);
    try {
      const payload: Record<string, unknown> = {
        description: description.trim(),
        media_type: mediaType,
      };
      if (mediaType !== "TEXT" && mediaUrl.trim()) payload.media_url = mediaUrl.trim();
      if (latitude) payload.latitude = parseFloat(latitude);
      if (longitude) payload.longitude = parseFloat(longitude);

      const res = await postProjectUpdate(selectedProjectId, payload as any);
      if (res && !res.error) {
        setSubmitted(true);
        setDescription("");
        setMediaUrl("");
        setLatitude("");
        setLongitude("");
        setTimeout(() => {
          setSubmitted(false);
          setShowForm(false);
        }, 1500);
        fetchUpdates(selectedProjectId);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const mediaTypeOptions: { value: MediaType; label: string; icon: typeof Camera }[] = [
    { value: "IMAGE", label: "Photo", icon: Camera },
    { value: "VIDEO", label: "Video", icon: Video },
    { value: "TEXT", label: "Text Only", icon: FileText },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Project Updates</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Post construction progress — photos, videos & notes visible to investors.
          </p>
        </div>
        {selectedProjectId && (
          <Button onClick={() => setShowForm(!showForm)} className="gap-2">
            <Plus className="w-4 h-4" />
            Post Update
          </Button>
        )}
      </div>

      {/* Project Selector */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Select Project</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading projects...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {projects
                .filter((p) => p.status === "ACTIVE")
                .map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedProjectId(p.id);
                      setShowForm(false);
                    }}
                    className={`text-left p-3 rounded-lg border-2 transition-all ${
                      selectedProjectId === p.id
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:border-primary/40 hover:bg-accent/50"
                    }`}
                  >
                    <p className="font-medium text-sm truncate">{p.title}</p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {p.location}
                    </div>
                  </button>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* New Update Form */}
      {showForm && selectedProjectId && (
        <Card className="border-primary/30 shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Send className="w-4 h-4 text-primary" />
                New Progress Update
              </CardTitle>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Media Type Selector */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">Media Type</label>
              <div className="flex gap-2">
                {mediaTypeOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setMediaType(opt.value)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                      mediaType === opt.value
                        ? "bg-primary text-white border-primary shadow-sm"
                        : "border-border text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    <opt.icon className="w-4 h-4" />
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Media URL */}
            {mediaType !== "TEXT" && (
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  {mediaType === "IMAGE" ? "Image URL" : "Video URL"}
                </label>
                <input
                  type="url"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder={
                    mediaType === "IMAGE"
                      ? "https://example.com/site-photo.jpg"
                      : "https://example.com/progress-video.mp4"
                  }
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                {/* Preview */}
                {mediaUrl && mediaType === "IMAGE" && (
                  <div className="mt-2 rounded-lg overflow-hidden border max-h-40">
                    <img src={mediaUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
                {mediaUrl && mediaType === "VIDEO" && (
                  <div className="mt-2 rounded-lg overflow-hidden border max-h-40">
                    <video src={mediaUrl} className="w-full" controls />
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Describe the progress, work completed, or any notes..."
                className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
              />
            </div>

            {/* Geo Coordinates */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Latitude (optional)</label>
                <input
                  type="number"
                  step="any"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="21.2514"
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Longitude (optional)</label>
                <input
                  type="number"
                  step="any"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="81.6296"
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="flex items-center justify-end gap-3 pt-2">
              {submitted && (
                <span className="flex items-center gap-1 text-sm text-green-600 font-medium">
                  <CheckCircle2 className="w-4 h-4" /> Posted!
                </span>
              )}
              <Button
                disabled={!description.trim() || submitting}
                onClick={handleSubmit}
                className="gap-2"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                {submitting ? "Posting..." : "Publish Update"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Updates Timeline */}
      {selectedProjectId && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              Posted Updates
              {updates.length > 0 && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-normal">
                  {updates.length}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingUpdates ? (
              <p className="text-sm text-muted-foreground text-center py-8">Loading updates...</p>
            ) : updates.length === 0 ? (
              <div className="py-10 text-center text-muted-foreground">
                <ImageIcon className="w-8 h-8 mx-auto mb-3 opacity-20" />
                <p className="font-medium text-sm">No updates posted yet</p>
                <p className="text-xs mt-1">Click "Post Update" to add the first one.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {updates
                  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                  .map((u) => (
                    <div key={u.id} className="flex gap-3 p-3 rounded-lg border hover:bg-accent/30 transition-colors">
                      {/* Media type icon */}
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                          u.media_type === "IMAGE"
                            ? "bg-blue-100 text-blue-600"
                            : u.media_type === "VIDEO"
                            ? "bg-purple-100 text-purple-600"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {u.media_type === "IMAGE" ? (
                          <Camera className="w-4 h-4" />
                        ) : u.media_type === "VIDEO" ? (
                          <Video className="w-4 h-4" />
                        ) : (
                          <FileText className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-primary">
                            {formatDistanceToNow(new Date(u.timestamp), { addSuffix: true })}
                          </span>
                          {u.latitude && u.longitude && (
                            <span className="text-[10px] text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded flex items-center gap-0.5">
                              <MapPin className="w-2.5 h-2.5" />
                              {u.latitude.toFixed(2)}, {u.longitude.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-600">{u.description}</p>
                        {u.media_url && u.media_type === "IMAGE" && (
                          <img
                            src={u.media_url.startsWith("http") ? u.media_url : `http://localhost:5000${u.media_url}`}
                            alt="Update"
                            className="mt-2 rounded border max-h-32 object-cover"
                          />
                        )}
                        {u.media_url && u.media_type === "VIDEO" && (
                          <video
                            src={u.media_url.startsWith("http") ? u.media_url : `http://localhost:5000${u.media_url}`}
                            className="mt-2 rounded border max-h-32"
                            controls
                          />
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
