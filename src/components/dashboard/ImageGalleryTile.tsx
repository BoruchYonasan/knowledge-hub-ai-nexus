
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Image, Eye } from 'lucide-react';

interface ImageGalleryTileProps {
  onNavigate: (page: string, tab?: string) => void;
}

const ImageGalleryTile: React.FC<ImageGalleryTileProps> = ({ onNavigate }) => {
  // Using placeholder images from the context
  const galleryImages = [
    {
      id: 1,
      src: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
      alt: 'Team collaboration workspace',
      title: 'Team Workspace'
    },
    {
      id: 2,
      src: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
      alt: 'Technology infrastructure',
      title: 'Tech Infrastructure'
    },
    {
      id: 3,
      src: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
      alt: 'Product development',
      title: 'Product Development'
    },
    {
      id: 4,
      src: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
      alt: 'Digital transformation',
      title: 'Digital Transformation'
    }
  ];

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onNavigate('content-manager')}
    >
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center justify-between">
          <div className="flex items-center">
            <Image className="w-5 h-5 mr-2" />
            Image Gallery
          </div>
          <span className="text-sm font-normal text-blue-600">View All →</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {galleryImages.map((image) => (
            <div key={image.id} className="relative group overflow-hidden rounded-lg">
              <img 
                src={image.src} 
                alt={image.alt}
                className="w-full h-20 object-cover transition-transform duration-200 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                <Eye className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                <p className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {image.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageGalleryTile;
