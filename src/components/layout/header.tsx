import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  Trophy, 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings, 
  LayoutDashboard,
  Bell,
  Wallet,
  Shield,
  MessageCircle,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Tournaments', href: '/tournaments' },
  { name: 'Leaderboard', href: '/leaderboard' },
  { name: 'Achievements', href: '/achievements' },
  { name: 'Social', href: '/social' },
  { name: 'Marketplace', href: '/marketplace' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, profile, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { scrollY } = useScroll();
  
  const headerBackground = useTransform(
    scrollY,
    [0, 50],
    ['rgba(10, 11, 14, 0)', 'rgba(10, 11, 14, 0.9)']
  );
  
  const headerBorder = useTransform(
    scrollY,
    [0, 50],
    ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.1)']
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['unread-notifications', user?.id],
    queryFn: async () => {
      if (!user) return 0;
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_read', false);
      return count || 0;
    },
    enabled: !!user,
    refetchInterval: 30000,
  });

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('header-notifications')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${user.id}` 
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['unread-notifications', user.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <motion.header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled && "backdrop-blur-xl shadow-lg shadow-black/10"
      )}
      style={{ 
        backgroundColor: headerBackground as any,
        borderBottom: `1px solid`,
        borderColor: headerBorder as any
      }}
    >
      <nav className="container mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <motion.div 
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/30"
            whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Trophy className="h-5 w-5 text-primary-foreground" />
          </motion.div>
          <span className="font-display text-xl font-bold tracking-tight">
            Game<span className="text-primary">Flex</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1 bg-secondary/50 backdrop-blur-xl rounded-full p-1.5">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="relative px-4 py-2 text-sm font-medium transition-colors"
            >
              {isActive(item.href) && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute inset-0 bg-primary/15 rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <span className={cn(
                "relative z-10",
                isActive(item.href) ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}>
                {item.name}
              </span>
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-2">
          {isAuthenticated && user ? (
            <>
              {/* Messages */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" size="icon" asChild className="rounded-full">
                  <Link to="/messages">
                    <MessageCircle className="h-5 w-5" />
                  </Link>
                </Button>
              </motion.div>

              {/* Notifications */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" size="icon" className="relative rounded-full" asChild>
                  <Link to="/notifications">
                    <Bell className="h-5 w-5" />
                    <AnimatePresence>
                      {unreadCount > 0 && (
                        <motion.span 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-[10px] font-bold flex items-center justify-center text-destructive-foreground"
                        >
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                </Button>
              </motion.div>

              {/* Wallet */}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button variant="outline" size="sm" className="gap-2 rounded-full px-4" asChild>
                  <Link to="/wallet">
                    <Wallet className="h-4 w-4 text-primary" />
                    <span className="font-semibold">KES {(profile?.wallet_balance ?? 0).toLocaleString()}</span>
                  </Link>
                </Button>
              </motion.div>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.button 
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-secondary/50 hover:bg-secondary transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Avatar className="h-8 w-8 border-2 border-primary/20">
                      <AvatarImage src={profile?.avatar_url ?? ''} />
                      <AvatarFallback className="bg-primary/20 text-primary text-sm font-semibold">
                        {(profile?.username ?? 'U').slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-sm">{profile?.username ?? 'User'}</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </motion.button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-2">
                  <DropdownMenuLabel className="font-normal px-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{profile?.username ?? 'User'}</p>
                      <p className="text-xs text-muted-foreground">{profile?.email ?? user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="rounded-lg">
                    <Link to="/dashboard" className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-lg">
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-lg">
                    <Link to="/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild className="rounded-lg">
                        <Link to="/admin" className="cursor-pointer">
                          <Shield className="mr-2 h-4 w-4" />
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive rounded-lg">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button variant="ghost" asChild className="rounded-full">
                  <Link to="/login">Sign In</Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button variant="neon" asChild className="rounded-full">
                  <Link to="/register">Join Now</Link>
                </Button>
              </motion.div>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="lg:hidden p-2 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <AnimatePresence mode="wait">
            {mobileMenuOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="h-6 w-6" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="h-6 w-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden border-t border-border/50 backdrop-blur-xl bg-background/95 overflow-hidden"
          >
            <motion.div 
              className="container mx-auto p-4 space-y-2"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              exit={{ y: -20 }}
            >
              {navigation.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "block px-4 py-3.5 rounded-xl text-sm font-medium transition-colors",
                      isActive(item.href)
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    )}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
              
              <motion.div 
                className="pt-4 border-t border-border/50 space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {isAuthenticated && user ? (
                  <>
                    <div className="flex items-center gap-3 px-4 py-4 rounded-xl bg-gradient-to-r from-secondary/80 to-secondary/50 border border-border/50">
                      <Avatar className="h-12 w-12 border-2 border-primary/20">
                        <AvatarImage src={profile?.avatar_url ?? ''} />
                        <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                          {(profile?.username ?? 'U').slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-semibold">{profile?.username ?? 'User'}</p>
                        <p className="text-sm text-primary font-medium">KES {(profile?.wallet_balance ?? 0).toLocaleString()}</p>
                      </div>
                      {unreadCount > 0 && (
                        <Badge variant="destructive" className="rounded-full">
                          {unreadCount}
                        </Badge>
                      )}
                    </div>
                    <Link
                      to="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium hover:bg-secondary transition-colors"
                    >
                      <LayoutDashboard className="h-5 w-5 text-muted-foreground" />
                      Dashboard
                    </Link>
                    <Link
                      to="/notifications"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium hover:bg-secondary transition-colors"
                    >
                      <Bell className="h-5 w-5 text-muted-foreground" />
                      Notifications
                      {unreadCount > 0 && (
                        <Badge variant="destructive" className="ml-auto rounded-full text-xs">
                          {unreadCount}
                        </Badge>
                      )}
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium hover:bg-secondary transition-colors"
                      >
                        <Shield className="h-5 w-5 text-muted-foreground" />
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <LogOut className="h-5 w-5" />
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="flex gap-3">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex-1 text-center px-4 py-3.5 rounded-xl text-sm font-medium bg-secondary hover:bg-secondary/80 transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex-1 text-center px-4 py-3.5 rounded-xl text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      Join Now
                    </Link>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
