
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Image, Upload } from 'lucide-react';

interface ImageGalleryTileProps {
  onNavigate: (page: string, tab?: string) => void;
}

const ImageGalleryTile: React.FC<ImageGalleryTileProps> = ({ onNavigate }) => {
  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onNavigate('image-gallery')}
    >
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center justify-between">
          <div className="flex items-center">
            <Image className="w-5 h-5 mr-2" />
            Image Gallery
          </div>
          <span className="text-sm font-normal text-blue-600">Open Gallery →</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Upload className="w-16 h-16 text-gray-300 mb-4" />
          <p className="text-gray-600 mb-2">No images uploaded yet</p>
          <p className="text-sm text-gray-500">
            Click to start building your image collection
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageGalleryTile;
