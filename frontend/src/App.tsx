import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import React, { useEffect, useState } from 'react';
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';

import AddItemScreen from '@/components/AddItemScreen';
import ChatScreen from '@/components/ChatScreen';
import { MainFeed } from '@/components/MainFeed';
import { MockIndicator } from '@/components/MockIndicator';
import { ScrollToTop } from '@/components/ScrollToTop';
import { PageWrapper } from '@/components/ui/PageWrapper';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useAuth } from '@/hooks/useAuth';
import AuthPage from '@/pages/AuthPage';
import FAQPage from '@/pages/FAQPage';
import { InsurancePage } from '@/pages/InsurancePage';
import { InsuranceSuccessPage } from '@/pages/InsuranceSuccessPage';
import ItemDetailsPage from '@/pages/ItemDetailsPage';
import { LoanConfirmationPage } from '@/pages/LoanConfirmationPage';
import { LoanRequestPage } from '@/pages/LoanRequestPage';
import SettingsPage from '@/pages/SettingsPage';
import { UserProfilePage } from '@/pages/UserProfilePage';
import { itemsService } from '@/services/items';
import { logEnvironmentStatus } from '@/utils/env-checker';

import { SearchFiltersProvider } from '@/contexts/SearchFiltersContext';
import { BottomNav } from './components/ui/bottom-nav';
import { OfflineBanner } from './components/ui/OfflineBanner';
import { OptimizedFooter } from './components/ui/OptimizedFooter';

import Index from '@/pages/Index';

import { AppHeader } from '@/components/ui/app-header';
import { CookieBanner } from '@/components/ui/CookieBanner';
import ContatoPage from '@/pages/ContatoPage';
import MessagesPage from '@/pages/MessagesPage';
import PoliticaPrivacidade from '@/pages/PoliticaPrivacidade';
import TermosUsoPage from '@/pages/TermosUsoPage';
import type { AddItemData, Item, User } from '@/types';

const queryClient = new QueryClient();

// Add ChatScreenWrapper component to handle item fetching
const ChatScreenWrapper = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const [item, setItem] = useState<Item | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItem = async () => {
      if (!itemId) return;
      try {
        const fetchedItem = await itemsService.getItem(itemId);
        setItem(fetchedItem);
      } catch (error) {
        console.error('Error fetching item:', error);
        navigate('/');
      }
    };
    fetchItem();
  }, [itemId, navigate]);

  if (!item) return null;

  return (
    <PageWrapper>
      <ChatScreen item={item} onBack={() => navigate(-1)} />
    </PageWrapper>
  );
};

// Update ProtectedRoute to use user instead of isAuthenticated
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/auth" />;
};

function AppRoutes() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading } = useAuth();

  // Check if current route is auth page
  const isAuthRoute = location.pathname === '/auth';

  // Redirect to auth if no user and not on auth page (but wait for loading to finish)
  useEffect(() => {
    if (!isLoading && !user && !isAuthRoute) {
      navigate('/auth', { replace: true });
    }
  }, [user, isAuthRoute, navigate, isLoading]);

  const handleLogin = (userData: User) => {
    // User is now managed by useAuth hook
    navigate('/', { replace: true });
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  // If no user, only show auth route
  if (!user) {
    return (
      <Routes>
        <Route
          element={
            <PageWrapper>
              <AuthPage onLogin={handleLogin} />
            </PageWrapper>
          }
          path="/auth"
        />
        <Route element={<Navigate replace to="/auth" />} path="*" />
      </Routes>
    );
  }

  // Protected routes (only rendered if user exists)
  return (
    <div className="flex min-h-screen flex-col">
      <MockIndicator />
      <OfflineBanner />
      <AppHeader
        user={
          user
            ? {
                id: 'temp-id',
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              }
            : null
        }
        onProfileClick={() => navigate('/profile')}
        showSearchField={location.pathname === '/' || location.pathname === '/search'}
        showBackButton={false}
        title={location.pathname === '/search' ? 'Resultados da Busca' : undefined}
      />

      {/* Main content area that grows to fill available space */}
      <div className="flex-1 pb-16 md:pb-0">
        <Routes>
          <Route
            element={
              <PageWrapper>
                <Index />
              </PageWrapper>
            }
            path="/"
          />
          <Route
            element={
              <PageWrapper>
                <ItemDetailsPage />
              </PageWrapper>
            }
            path="/items/:itemId"
          />
          <Route
            element={
              <PageWrapper>
                <LoanRequestPage />
              </PageWrapper>
            }
            path="/items/:itemId/loan"
          />
          <Route
            element={
              <PageWrapper>
                <LoanConfirmationPage />
              </PageWrapper>
            }
            path="/loan-confirmation"
          />
          <Route
            element={
              <PageWrapper>
                <InsurancePage />
              </PageWrapper>
            }
            path="/insurance"
          />
          <Route
            element={
              <PageWrapper>
                <InsuranceSuccessPage />
              </PageWrapper>
            }
            path="/insurance-success"
          />
          <Route
            element={
              <PageWrapper>
                <FAQPage />
              </PageWrapper>
            }
            path="/faq"
          />
          <Route
            element={
              <PageWrapper>
                <MainFeed />
              </PageWrapper>
            }
            path="/search"
          />
          <Route
            element={
              <ProtectedRoute>
                <ChatScreenWrapper />
              </ProtectedRoute>
            }
            path="/chat/:itemId"
          />
          <Route
            element={
              <PageWrapper>
                <UserProfilePage />
              </PageWrapper>
            }
            path="/profile"
          />
          <Route
            element={
              <ProtectedRoute>
                <PageWrapper>
                  <AddItemScreen
                    onBack={() => navigate(-1)}
                    onSave={async (data: AddItemData) => {
                      try {
                        // Preparar dados para o serviço
                        const itemData = {
                          title: data.title,
                          description: data.description,
                          price: parseFloat(data.price),
                          period: data.period,
                          images: data.images,
                          categoryId: data.categoryId,
                          ownerId: 'temp-id', // Mock user ID
                          location: {
                            latitude: data.latitude || 0,
                            longitude: data.longitude || 0,
                            address: data.address,
                          },
                          status: 'available' as const,
                        };

                        await itemsService.createItem(itemData);
                        navigate('/');
                      } catch (error) {
                        console.error('Error creating item:', error);
                        throw error;
                      }
                    }}
                  />
                </PageWrapper>
              </ProtectedRoute>
            }
            path="/add-item"
          />
          <Route
            element={
              <PageWrapper>
                <PoliticaPrivacidade />
              </PageWrapper>
            }
            path="/politica-privacidade"
          />
          <Route
            element={
              <PageWrapper>
                <SettingsPage />
              </PageWrapper>
            }
            path="/settings"
          />
          <Route
            element={
              <PageWrapper>
                <ContatoPage />
              </PageWrapper>
            }
            path="/contato"
          />
          <Route
            element={
              <PageWrapper>
                <TermosUsoPage />
              </PageWrapper>
            }
            path="/termos"
          />
          <Route
            element={
              <PageWrapper>
                <TermosUsoPage />
              </PageWrapper>
            }
            path="/termos-uso"
          />
          <Route
            element={
              <ProtectedRoute>
                <PageWrapper>
                  <MessagesPage />
                </PageWrapper>
              </ProtectedRoute>
            }
            path="/messages"
          />
          <Route element={<Navigate replace to="/" />} path="*" />
        </Routes>
      </div>

      {/* Bottom Navigation para mobile */}
      <BottomNav />

      {/* Footer otimizado mobile-first */}
      <OptimizedFooter />

      {/* Banner de cookies - apenas para usuários logados */}
      <CookieBanner />
    </div>
  );
}

function App() {
  // Log environment status on app startup
  useEffect(() => {
    logEnvironmentStatus();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <SearchFiltersProvider>
          <Router>
            <TooltipProvider delayDuration={0}>
              <ScrollToTop />
              <AppRoutes />
              <Toaster />
            </TooltipProvider>
          </Router>
        </SearchFiltersProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
