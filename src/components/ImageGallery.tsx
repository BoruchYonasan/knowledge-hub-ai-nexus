
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Image, Upload, X, Eye, Trash2, Download } from 'lucide-react';

interface ImageGalleryProps {
  onNavigate?: (page: string) => void;
}

interface UploadedImage {
  id: string;
  src: string;
  name: string;
  size: number;
  uploadDate: Date;
  alt: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ onNavigate }) => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<UploadedImage | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = useCallback((files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImage: UploadedImage = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            src: e.target?.result as string,
            name: file.name,
            size: file.size,
            uploadDate: new Date(),
            alt: file.name.split('.')[0]
          };
          setUploadedImages(prev => [...prev, newImage]);
        };
        reader.readAsDataURL(file);
      }
    });
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  }, [handleFileUpload]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e.target.files);
  }, [handleFileUpload]);

  const deleteImage = useCallback((imageId: string) => {
    setUploadedImages(prev => prev.filter(img => img.id !== imageId));
    if (selectedImage?.id === imageId) {
      setSelectedImage(null);
    }
  }, [selectedImage]);

  const downloadImage = useCallback((image: UploadedImage) => {
    const link = document.createElement('a');
    link.href = image.src;
    link.download = image.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Image className="w-8 h-8 mr-3" />
            Image Gallery
          </h1>
          <p className="text-gray-600 mt-2">
            Upload and manage your image collection
          </p>
        </div>
        <Button
          onClick={() => onNavigate?.('dashboard')}
          variant="outline"
        >
          Back to Dashboard
        </Button>
      </div>

      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Images</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              Drop images here or click to browse
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Supports JPG, PNG, GIF, and WebP formats
            </p>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileInputChange}
              className="hidden"
              id="file-upload"
            />
            <Button asChild>
              <label htmlFor="file-upload" className="cursor-pointer">
                Choose Files
              </label>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Image Gallery */}
      {uploadedImages.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Your Images ({uploadedImages.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {uploadedImages.map((image) => (
                <div key={image.id} className="relative group">
                  <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-110 cursor-pointer"
                      onClick={() => setSelectedImage(image)}
                    />
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setSelectedImage(image)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => downloadImage(image)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteImage(image.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {image.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(image.size)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Image className="w-24 h-24 text-gray-300 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No images uploaded yet
              </h3>
              <p className="text-gray-500 mb-6">
                Start building your image gallery by uploading your first photos above.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Image Preview Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <Button
              className="absolute top-4 right-4"
              variant="secondary"
              size="sm"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-4 h-4" />
            </Button>
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white p-3 rounded-lg">
              <p className="font-medium">{selectedImage.name}</p>
              <p className="text-sm opacity-75">
                {formatFileSize(selectedImage.size)} • {selectedImage.uploadDate.toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
