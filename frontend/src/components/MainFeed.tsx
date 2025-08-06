import { Loader2, RefreshCw, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { ItemGrid } from '@/components/feed/ItemGrid';
import { FinalCTASection, HeroSection, HowItWorksSection } from '@/components/home';
import { Button } from '@/components/ui/button';
import { EmptyState, ErrorState } from '@/components/ui/error-state';
import { showSuccess } from '@/components/ui/feedback-toast';
import { ItemGridSkeleton } from '@/components/ui/item-skeleton';
import PageContainer from '@/components/ui/page-container';
import { useSearchFilters } from '@/contexts/SearchFiltersContext';
import { useCategories } from '@/hooks/useCategories';
import { useIsAtTop } from '@/hooks/useIsAtTop';
import { useItems } from '@/hooks/useItems';
import { cn } from '@/lib/utils';
import { useStore } from '@/store';
import { typography } from '@/styles/design-system';
import type { ItemWithDetails } from '@/types';

const ITEMS_PER_PAGE = 12;

export function MainFeed() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userLocation: storeLocation } = useStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const isAtTop = useIsAtTop();
  const [showHomeSections, setShowHomeSections] = useState(true);
  const [allItems, setAllItems] = useState<ItemWithDetails[]>([]);

  // Use real API hooks
  const { categories, loadCategories } = useCategories();
  const {
    items: storeItems,
    loadItems: storeLoadItems,
    searchItemsWithPagination: storeSearchItems,
    isLoading,
    error,
  } = useItems();

  // Usar estado centralizado de busca e filtros
  const { filters, activeFilterCount, clearFilters } = useSearchFilters();

  // Scroll para o topo quando entramos na página de busca
  useEffect(() => {
    if (location.pathname === '/search' && filters.searchQuery) {
      // Scroll imediato para o topo quando navegamos para a página de busca
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  }, [location.pathname, filters.searchQuery]);

  // Load categories on mount
  useEffect(() => {
    if (categories.length === 0) {
      loadCategories();
    }
  }, [categories.length, loadCategories]);

  // Carregar localização do store apenas se já existir (não aplicar automaticamente)
  useEffect(() => {
    if (storeLocation && !filters.userLocation) {
      // Só carrega se o usuário já tinha definido uma localização anteriormente
      // updateFilter('userLocation', storeLocation);
    }
  }, [storeLocation, filters.userLocation]);

  // Reset pagination when filters change
  useEffect(() => {
    console.log('🔄 Filtros mudaram, resetando paginação');
    setCurrentPage(1);
    setHasMore(true);
    setAllItems([]); // Limpar itens acumulados quando filtros mudam
    setIsLoadingMore(false); // Reset loading state

    // Scroll para o topo quando há busca ativa para mostrar novos resultados
    if (filters.searchQuery) {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 200);
    }
  }, [
    filters.searchQuery,
    filters.selectedCategory,
    filters.maxDistance,
    filters.priceRange,
    filters.period,
    filters.onlyAvailable,
    filters.onlyVerified,
    filters.minRating,
    activeFilterCount,
  ]);

  // Hide home sections when there's active search or filters
  useEffect(() => {
    const hasActiveSearch = filters.searchQuery.trim().length > 0;
    const hasActiveFilters = activeFilterCount > 0;

    // Esconder seções home quando há busca ativa ou filtros
    setShowHomeSections(!hasActiveSearch && !hasActiveFilters);

    // Scroll suave apenas quando há busca ativa
    if (hasActiveSearch) {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  }, [filters.searchQuery, activeFilterCount]);

  // Load items when filters change
  useEffect(() => {
    const loadItems = async () => {
      const searchFilters = {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: filters.searchQuery,
        category_id: filters.selectedCategory || undefined,
        location_lat: filters.userLocation?.latitude,
        location_lng: filters.userLocation?.longitude,
        radius: filters.maxDistance,
        min_price: filters.priceRange?.[0],
        max_price: filters.priceRange?.[1],
        is_available: filters.onlyAvailable,
        condition_rating: filters.minRating,
      };

      const result = await storeSearchItems(searchFilters);

      console.log('📄 Resultado da paginação:', {
        success: result.success,
        currentPage,
        itemsReceived: result.data?.length || 0,
        hasMore: result.hasMore,
        total: result.total,
      });

      if (result.success && result.data) {
        if (currentPage === 1) {
          setAllItems(result.data);
        } else {
          setAllItems((prev) => {
            const existingIds = new Set(prev.map((item) => item.id));
            const newItems = result.data.filter((item) => !existingIds.has(item.id));
            return [...prev, ...newItems];
          });
        }
        setHasMore(result.hasMore || false);
        setIsLoadingMore(false);
      }
    };

    loadItems();
  }, [
    currentPage,
    filters.searchQuery,
    filters.selectedCategory,
    filters.userLocation,
    filters.maxDistance,
    filters.priceRange,
    filters.onlyAvailable,
    filters.minRating,
    storeSearchItems,
  ]);

  // Usar apenas allItems para paginação, ignorar storeItems
  const itemsData = allItems;

  console.log('📊 Estado dos itens:', {
    allItemsCount: allItems.length,
    itemsDataCount: itemsData.length,
    currentPage,
    hasMore,
    isLoadingMore,
    usingStoreItems: false, // Agora sempre usa allItems
  });

  const loadMoreItems = () => {
    console.log('🔄 loadMoreItems chamado:', { isLoadingMore, hasMore, isLoading, currentPage });
    if (isLoadingMore || !hasMore || isLoading) return;
    setIsLoadingMore(true);
    setCurrentPage((prev) => {
      console.log('📄 Incrementando página de', prev, 'para', prev + 1);
      return prev + 1;
    });
  };

  const handleCategorySelect = (categoryId: string | null) => {
    // Esta função não é mais necessária pois o estado é gerenciado centralmente
    // updateFilter('selectedCategory', categoryId);
  };

  const handleItemSelect = (item: ItemWithDetails) => {
    navigate(`/items/${item.id}`);
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleGetStarted = () => {
    navigate('/add-item');
  };

  const handleExploreItems = () => {
    const itemsSection = document.getElementById('items-section');
    if (itemsSection) {
      itemsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-background">
      {/* Main content com padding-top apenas para o conteúdo que precisa */}
      <PageContainer className={showHomeSections ? 'pt-0' : 'md:pt-28'}>
        {/* Home Sections - agora dentro do container para um fluxo contínuo */}
        {showHomeSections && (
          <>
            <HeroSection onExploreItems={handleExploreItems} onGetStarted={handleGetStarted} />
            <div className="mb-10">
              <HowItWorksSection />
            </div>
            {/* Divider moderno */}
            <div className="mt-6 flex justify-center">
              <div className="h-1 w-24 rounded-full bg-gradient-to-r from-purple-200 via-purple-400 to-purple-200 opacity-60" />
            </div>
            <FinalCTASection />
          </>
        )}

        {/* Items Section */}
        <section className="py-16" id="items-section">
          <div>
            {/* Section Header */}
            <div className="mb-8 text-center">
              <h2 className={cn(typography.heading.h2, 'mb-2')}>
                {showHomeSections ? 'Itens Disponíveis' : 'Resultados da Busca'}
              </h2>
              <p className={cn(typography.body.default, 'font-medium')}>
                {showHomeSections
                  ? 'Encontre o que você precisa perto de você'
                  : `${itemsData.length} item${itemsData.length !== 1 ? 's' : ''} encontrado${
                      itemsData.length !== 1 ? 's' : ''
                    }`}
              </p>
            </div>

            {/* Items Grid */}
            {isLoading && currentPage === 1 ? (
              <div className="min-h-[400px]">
                <ItemGridSkeleton count={8} />
              </div>
            ) : error ? (
              <ErrorState
                title="Erro ao carregar itens"
                message={error}
                onRetry={() => {
                  setCurrentPage(1);
                  setAllItems([]);
                }}
                className="min-h-[300px]"
              />
            ) : itemsData.length > 0 ? (
              <div>
                <ItemGrid items={itemsData as any} onItemSelect={handleItemSelect} />

                {/* Botão para carregar mais itens, que se transforma em um indicador de loading */}
                {hasMore && (
                  <div className="mt-8 flex justify-center">
                    <Button
                      disabled={isLoading || isLoadingMore}
                      variant="outline"
                      onClick={loadMoreItems}
                      className="w-full max-w-xs transition-all duration-300 hover:bg-gray-50"
                    >
                      {isLoadingMore ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Carregando...
                        </>
                      ) : (
                        <RefreshCw className="mr-2 h-4 w-4" />
                      )}
                      {!isLoadingMore && 'Carregar mais itens'}
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="min-h-[300px]">
                <EmptyState
                  title="Nenhum item encontrado"
                  message={
                    activeFilterCount > 0
                      ? 'Tente ajustar seus filtros ou limpar a busca.'
                      : 'Não há itens disponíveis no momento.'
                  }
                  className="min-h-[300px]"
                >
                  {activeFilterCount > 0 && (
                    <div className="mt-4 flex justify-center">
                      <Button
                        variant="outline"
                        onClick={() => {
                          clearFilters();
                          showSuccess('Filtros limpos', 'Todos os filtros foram removidos.');
                        }}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Limpar filtros
                      </Button>
                    </div>
                  )}
                </EmptyState>
              </div>
            )}
          </div>
        </section>
      </PageContainer>
    </div>
  );
}
