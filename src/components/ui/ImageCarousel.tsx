import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

interface ImageCarouselProps {
  images: string[];
  title?: string;
  altTextPrefix?: string;
}

export function ImageCarousel({
  images,
  title = "Gallery",
  altTextPrefix = "Image"
}: ImageCarouselProps) {
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
      <Carousel className="w-full max-w-4xl mx-auto">
        <CarouselContent>
          {images.map((imageUrl, idx) => (
            <CarouselItem key={idx}>
              <div className="p-4">
                <Card className="bg-gray-900/50 border-gray-700">
                  <CardContent className="p-4">
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                      <Image
                        src={imageUrl}
                        alt={`${altTextPrefix} - Image ${idx + 1}`}
                        fill
                        className="object-contain bg-gray-800/30"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
