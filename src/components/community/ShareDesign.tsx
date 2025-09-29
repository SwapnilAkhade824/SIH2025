import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  Tag,
  MapPin,
  Clock,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShareDesignProps {
  onClose: () => void;
  onShare: (design: any) => void;
}

export function ShareDesign({ onClose, onShare }: ShareDesignProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    tags: [] as string[],
    difficulty: "",
    timeSpent: ""
  });
  const [currentTag, setCurrentTag] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const categories = ["Traditional", "Digital", "Competition", "Learning", "Innovation"];
  const difficulties = ["Beginner", "Intermediate", "Advanced", "Expert"];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category || !imagePreview) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and upload an image",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    // Simulate upload delay
    setTimeout(() => {
      const newDesign = {
        id: Date.now(),
        user: {
          name: "You",
          avatar: "Y",
          level: "Intermediate",
          location: formData.location || "Your Location"
        },
        image: imagePreview,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        tags: formData.tags,
        difficulty: formData.difficulty,
        timeSpent: formData.timeSpent,
        likes: 0,
        comments: 0,
        shares: 0,
        timeAgo: "Just now",
        featured: false
      };

      onShare(newDesign);
      setIsUploading(false);
      
      toast({
        title: "Design Shared!",
        description: "Your kolam design has been shared with the community"
      });
      
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="card-traditional w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Upload className="w-5 h-5 text-primary" />
              <span>Share Your Kolam Design</span>
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Design Image *</Label>
              <div className="border-2 border-dashed border-primary/20 rounded-lg p-6 text-center hover:border-primary/40 transition-colors">
                {imagePreview ? (
                  <div className="relative">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="max-h-48 mx-auto rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => setImagePreview(null)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div>
                    <ImageIcon className="w-12 h-12 text-primary/40 mx-auto mb-2" />
                    <p className="text-muted-foreground mb-2">Upload your kolam design</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <Button type="button" variant="outline" asChild>
                      <label htmlFor="image-upload" className="cursor-pointer">
                        Choose Image
                      </label>
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Give your design a catchy title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your kolam design, inspiration, and creation process"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            {/* Category and Difficulty */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Difficulty Level</Label>
                <Select value={formData.difficulty} onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties.map(difficulty => (
                      <SelectItem key={difficulty} value={difficulty}>{difficulty}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Location and Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                  <Input
                    id="location"
                    placeholder="City, State"
                    className="pl-10"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timeSpent">Time Spent</Label>
                <div className="relative">
                  <Clock className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                  <Input
                    id="timeSpent"
                    placeholder="e.g., 2 hours"
                    className="pl-10"
                    value={formData.timeSpent}
                    onChange={(e) => setFormData(prev => ({ ...prev, timeSpent: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                  <Input
                    placeholder="Add tags (e.g., festival, geometric)"
                    className="pl-10"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                </div>
                <Button type="button" variant="outline" onClick={addTag}>
                  Add
                </Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="flex items-center space-x-1">
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isUploading}
                className="flex-1 btn-hero"
              >
                {isUploading ? (
                  <>
                    <Upload className="w-4 h-4 mr-2 animate-spin" />
                    Sharing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Share Design
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
