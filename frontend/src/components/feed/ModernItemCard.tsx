import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Item, UserWithDetails } from '@/types';
import { getCategoryPlaceholder, handleImageError } from '@/utils/imageUtils';
import { CheckCircle2, Heart, MapPin, Share2 } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ModernItemCardProps {
  item: Item;
  itemOwner?: UserWithDetails;
  variant?: 'default' | 'compact';
}

export function ModernItemCard({ item, itemOwner, variant = 'default' }: ModernItemCardProps) {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const mainImage = imageError
    ? getCategoryPlaceholder(item.categoryId)
    : item.images[0] || getCategoryPlaceholder(item.categoryId);

  // Debug da imagem
  console.log(`🖼️ ModernItemCard - ${item.title}:`, {
    itemImages: item.images,
    firstImage: item.images?.[0],
    imageError,
    mainImage,
    categoryId: item.categoryId,
  });

  const isAvailable = item.status === 'available';

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getPeriodLabel = (period?: string) => {
    const labels: Record<string, string> = {
      hora: 'h',
      dia: 'dia',
      semana: 'sem',
      mes: 'mês',
    };
    return period ? labels[period] || period : 'dia';
  };

  const handleCardClick = () => {
    navigate(`/items/${item.id}`);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement share functionality
  };

  const onImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error(`🖼️ Erro ao carregar imagem para ${item.title}:`, {
      originalSrc: event.currentTarget.src,
      itemImages: item.images,
      categoryId: item.categoryId,
    });

    setImageError(true);
    const fallbackUrl = getCategoryPlaceholder(item.categoryId);
    handleImageError(event.nativeEvent, fallbackUrl);
  };

  return (
    <Card
      className={cn(
        'group relative cursor-pointer overflow-hidden border-0 bg-white',
        // Sombras e animações do design system
        'shadow-md transition-all duration-300 ease-in-out hover:shadow-xl',
        'hover:-translate-y-2 hover:scale-[1.02]',
        // Sombra com cor da marca
        'hover:shadow-purple-500/10',
        // Estado de disponibilidade
        !isAvailable && 'opacity-60 hover:opacity-70',
        'rounded-2xl'
      )}
      onClick={handleCardClick}
    >
      <CardContent className="p-0">
        {/* Imagem */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl">
          <img
            src={mainImage}
            alt={item.title}
            className="h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:brightness-110"
            onError={onImageError}
            loading="lazy"
          />

          {/* Overlay gradiente sutil com animação */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent transition-opacity duration-300 group-hover:opacity-75" />

          {/* Overlay de hover com efeito shimmer */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Status Badge - Apenas se indisponível */}
          {!isAvailable && (
            <div className="absolute left-3 top-3">
              <Badge className="border-0 bg-red-500 text-white shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
                Indisponível
              </Badge>
            </div>
          )}

          {/* Ações - Aparecem no hover com animações melhoradas */}
          <div className="absolute right-3 top-3 flex gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-1 group-hover:opacity-100">
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 rounded-full bg-white/90 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white hover:shadow-xl"
              onClick={handleFavoriteClick}
            >
              <Heart
                className={cn(
                  'h-4 w-4 transition-all duration-200',
                  isFavorited
                    ? 'scale-110 fill-red-500 text-red-500'
                    : 'hover:scale-105 hover:text-red-500'
                )}
              />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 rounded-full bg-white/90 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white hover:shadow-xl"
              onClick={handleShareClick}
            >
              <Share2 className="h-4 w-4 transition-all duration-200 hover:scale-105 hover:text-purple-600" />
            </Button>
          </div>

          {/* Preço - Destaque principal com animação */}
          <div className="absolute bottom-3 left-3">
            <div className="rounded-xl bg-white/95 px-3 py-2 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:scale-105 group-hover:bg-white group-hover:shadow-xl">
              <div className="text-lg font-bold text-foreground transition-colors duration-300 group-hover:text-purple-700">
                {formatPrice(item.price)}
              </div>
              <div className="-mt-1 text-xs text-muted-foreground transition-colors duration-300 group-hover:text-purple-500">
                por {getPeriodLabel(item.period)}
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="space-y-3 p-4">
          {/* Título */}
          <h3 className="line-clamp-2 text-lg font-semibold leading-tight text-foreground transition-colors duration-300 group-hover:text-purple-800">
            {item.title}
          </h3>

          {/* Descrição */}
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground transition-colors duration-300 group-hover:text-gray-700">
            {item.description || 'Sem descrição disponível'}
          </p>

          {/* Localização */}
          <div className="flex items-center gap-1 text-sm text-muted-foreground transition-all duration-300 group-hover:text-purple-600">
            <MapPin className="h-4 w-4 flex-shrink-0 text-purple-600 transition-all duration-300 group-hover:scale-110 group-hover:text-purple-700" />
            <span className="truncate font-medium">
              {item.location?.city || item.location?.address || 'Localização não informada'}
            </span>
          </div>

          {/* Status de disponibilidade */}
          {isAvailable && (
            <div className="flex items-center gap-1 text-sm text-emerald-600 transition-all duration-300 group-hover:scale-105 group-hover:text-emerald-700">
              <CheckCircle2 className="h-4 w-4 flex-shrink-0 transition-all duration-300 group-hover:scale-110" />
              <span className="font-medium">Disponível agora</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
