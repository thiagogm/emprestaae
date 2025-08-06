import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Item, UserWithDetails } from '@/types';
import { getCategoryPlaceholder, handleImageError } from '@/utils/imageUtils';
import { CheckCircle2, Heart, MapPin, Share2 } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface HorizontalItemCardProps {
  item: Item;
  itemOwner?: UserWithDetails;
  testImage?: string;
  onItemSelect?: (item: Item) => void;
}

export function HorizontalItemCard({
  item,
  itemOwner,
  testImage,
  onItemSelect,
}: HorizontalItemCardProps) {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const mainImage =
    testImage ||
    (imageError
      ? getCategoryPlaceholder(item.categoryId)
      : item.images[0] || getCategoryPlaceholder(item.categoryId));

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
    if (onItemSelect) {
      onItemSelect(item);
    } else {
      navigate(`/items/${item.id}`);
    }
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
        <div className="flex min-h-[100px] sm:min-h-[115px]">
          {/* Imagem à esquerda - ocupa toda a altura */}
          <div className="relative w-32 flex-shrink-0 sm:w-40 md:w-48">
            <div className="absolute inset-0 overflow-hidden rounded-l-2xl">
              <img
                src={mainImage}
                alt={item.title}
                className="h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:brightness-110"
                onError={onImageError}
                loading="lazy"
              />

              {/* Overlay gradiente sutil com animação */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10 transition-opacity duration-300 group-hover:opacity-75" />

              {/* Overlay de hover com efeito shimmer */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>

            {/* Status Badge - Apenas se indisponível */}
            {!isAvailable && (
              <div className="absolute left-2 top-2 z-10">
                <Badge className="border-0 bg-red-500 text-xs text-white shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
                  Indisponível
                </Badge>
              </div>
            )}
          </div>

          {/* Conteúdo à direita */}
          <div className="flex flex-1 flex-col justify-between p-3">
            <div className="space-y-2">
              {/* Header com título e ações */}
              <div className="flex items-start justify-between gap-2">
                <h3 className="line-clamp-2 flex-1 text-base font-semibold leading-tight text-foreground transition-colors duration-300 group-hover:text-purple-800 sm:text-lg">
                  {item.title}
                </h3>

                {/* Ações - Com animações melhoradas */}
                <div className="flex gap-1 opacity-60 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 rounded-full transition-all duration-200 hover:scale-110 hover:bg-red-50 hover:shadow-md"
                    onClick={handleFavoriteClick}
                  >
                    <Heart
                      className={cn(
                        'h-3.5 w-3.5 transition-all duration-200',
                        isFavorited
                          ? 'scale-110 fill-red-500 text-red-500'
                          : 'hover:scale-105 hover:text-red-500'
                      )}
                    />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 rounded-full transition-all duration-200 hover:scale-110 hover:bg-purple-50 hover:shadow-md"
                    onClick={handleShareClick}
                  >
                    <Share2 className="h-3.5 w-3.5 transition-all duration-200 hover:scale-105 hover:text-purple-600" />
                  </Button>
                </div>
              </div>

              {/* Descrição */}
              <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground transition-colors duration-300 group-hover:text-gray-700">
                {item.description || 'Sem descrição disponível'}
              </p>

              {/* Localização */}
              <div className="flex items-center gap-1 text-sm text-muted-foreground transition-all duration-300 group-hover:text-purple-600">
                <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-purple-600 transition-all duration-300 group-hover:scale-110 group-hover:text-purple-700" />
                <span className="truncate font-medium">
                  {item.location?.city || item.location?.address || 'Localização não informada'}
                </span>
              </div>
            </div>

            {/* Footer com preço e status */}
            <div className="mt-3 flex items-end justify-between">
              {/* Preço com animação */}
              <div className="flex flex-col transition-transform duration-300 group-hover:scale-105">
                <div className="text-lg font-bold text-foreground transition-colors duration-300 group-hover:text-purple-700 sm:text-xl">
                  {formatPrice(item.price)}
                </div>
                <div className="-mt-1 text-xs text-muted-foreground transition-colors duration-300 group-hover:text-purple-500">
                  por {getPeriodLabel(item.period)}
                </div>
              </div>

              {/* Status de disponibilidade com animação */}
              {isAvailable && (
                <div className="flex items-center gap-1 text-xs text-green-600 transition-all duration-300 group-hover:scale-105 group-hover:text-green-700 sm:text-sm">
                  <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-green-600 transition-all duration-300 group-hover:scale-110 group-hover:text-green-700" />
                  <span className="font-medium">Disponível</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
