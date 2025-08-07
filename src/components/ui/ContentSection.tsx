import { motion } from "framer-motion";
import type React from "react";
import { AboutBlock } from "./AboutBlock";
import { ContentBlock } from "./ContentBlock";
import { DetailsBlock } from "./DetailsBlock";
import { TagList } from "./TagList";
import { ProfileCard } from "@/components/account/ProfileCard";
import { ImageCarousel } from "@/components/projects/ImageCarousel";

interface DetailItem {
  label: string;
  value: string;
}

export interface ContentSectionConfig {
  images?: {
    urls: string[];
    title?: string;
    altTextPrefix: string;
  };
  about?: {
    title: string;
    description: string;
  };
  details?: {
    title: string;
    items: DetailItem[];
  };
  tags?: {
    title: string;
    items: string[];
    variant?: "primary" | "secondary";
  };
  profiles?: {
    title: string;
    userIds: string[];
  };
  customBlocks?: {
    title: string;
    content: React.ReactNode;
  }[];
}

export interface ContentSectionProps {
  config: ContentSectionConfig;
  className?: string;
  delay?: number;
}

export function ContentSection({ config, className = "", delay = 0.2 }: ContentSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`space-y-6 ${className}`}
    >
      {config.images && config.images.urls.length > 0 && (
        <ImageCarousel 
          images={config.images.urls} 
          title={config.images.title || ""} 
          altTextPrefix={config.images.altTextPrefix} 
        />
      )}

      {config.about && (
        <AboutBlock 
          title={config.about.title} 
          description={config.about.description} 
        />
      )}

      {config.details && (
        <DetailsBlock 
          title={config.details.title} 
          details={config.details.items} 
        />
      )}

      {config.tags && config.tags.items.length > 0 && (
        <ContentBlock title={config.tags.title}>
          <TagList tags={config.tags.items} variant={config.tags.variant} />
        </ContentBlock>
      )}

      {config.profiles && config.profiles.userIds.length > 0 && (
        <ContentBlock title={config.profiles.title}>
          {config.profiles.userIds.map((userId) => (
            <ProfileCard key={userId} userId={userId} />
          ))}
        </ContentBlock>
      )}

      {config.customBlocks?.map((block, index) => (
        <ContentBlock key={index} title={block.title}>
          {block.content}
        </ContentBlock>
      ))}
    </motion.div>
  );
}