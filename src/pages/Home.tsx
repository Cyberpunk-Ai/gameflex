import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Users, Zap, Shield, ArrowRight, Star, Gamepad2, ChevronRight, TrendingUp, DollarSign, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TournamentCard } from '@/components/tournament-card';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  FadeIn, 
  FadeInUp, 
  StaggerContainer, 
  StaggerItem,
  AnimatedGradientText,
  MotionCard,
  FloatingElement,
  PulseGlow
} from '@/components/ui/motion';
import { 
  FloatingParticles, 
  GradientOrb, 
  GridBackground, 
  GlassCard,
  Spotlight,
  NoiseTexture
} from '@/components/ui/animated-background';
import { SkeletonTournamentCard, SkeletonLeaderboardRow } from '@/components/ui/skeleton-loader';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const features = [
  { icon: Trophy, title: 'Win Big Prizes', description: 'Compete for cash prizes up to KES 100,000+', color: 'from-yellow-500/20 to-orange-500/20' },
  { icon: Shield, title: 'Secure Payments', description: 'Fast M-Pesa payments with instant verification', color: 'from-green-500/20 to-emerald-500/20' },
  { icon: Users, title: 'Active Community', description: 'Join 1500+ gamers competing daily', color: 'from-blue-500/20 to-cyan-500/20' },
  { icon: Zap, title: 'Live Tournaments', description: 'Real-time brackets and live match updates', color: 'from-purple-500/20 to-pink-500/20' },
];

const games = [
  { name: 'FIFA 24', icon: '⚽', players: 450, gradient: 'from-green-500/20 to-emerald-500/10' },
  { name: 'Call of Duty', icon: '🎯', players: 380, gradient: 'from-red-500/20 to-orange-500/10' },
  { name: 'PUBG Mobile', icon: '🔫', players: 320, gradient: 'from-yellow-500/20 to-amber-500/10' },
  { name: 'Fortnite', icon: '🏗️', players: 280, gradient: 'from-blue-500/20 to-indigo-500/10' },
  { name: 'Apex Legends', icon: '🦊', players: 210, gradient: 'from-orange-500/20 to-red-500/10' },
  { name: 'Valorant', icon: '🎮', players: 190, gradient: 'from-pink-500/20 to-rose-500/10' },
];

const stats = [
  { value: '1.5K+', label: 'Active Players', icon: Users },
  { value: 'KES 2.4M', label: 'Paid Out', icon: DollarSign },
  { value: '48', label: 'Tournaments', icon: Trophy },
];

export default function Home() {
  const queryClient = useQueryClient();
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.95]);
  
  const { data: tournaments = [], isLoading: tournamentsLoading } = useQuery({
    queryKey: ['home-tournaments'],
    queryFn: async () => {
      const { data } = await supabase
        .from('tournaments')
        .select('*')
        .in('status', ['live', 'registration_open', 'upcoming'])
        .order('start_date', { ascending: true })
        .limit(6);
      return data ?? [];
    }
  });

  useEffect(() => {
    const channel = supabase
      .channel('home-tournaments-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tournaments' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['home-tournaments'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const { data: leaderboard = [], isLoading: leaderboardLoading } = useQuery({
    queryKey: ['home-leaderboard'],
    queryFn: async () => {
      const { data: statsData } = await supabase
        .from('leaderboard_stats')
        .select('*')
        .order('points', { ascending: false })
        .limit(5);
      
      if (!statsData || statsData.length === 0) return [];
      
      const userIds = [...new Set(statsData.map(s => s.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, username, avatar_url, game_handle')
        .in('user_id', userIds);
      
      const profileMap = new Map(profiles?.map(p => [p.user_id, p]) ?? []);
      
      return statsData.map(s => ({
        ...s,
        profiles: profileMap.get(s.user_id)
      }));
    }
  });

  const liveTournaments = tournaments.filter((t: any) => t.status === 'live');
  const upcomingTournaments = tournaments.filter((t: any) => t.status === 'registration_open' || t.status === 'upcoming').slice(0, 3);
  const topPlayers = leaderboard.slice(0, 5);

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <GridBackground />
          <FloatingParticles quantity={30} />
          <Spotlight />
          <NoiseTexture />
          <GradientOrb color="primary" size="xl" position={{ top: '-20%', left: '-10%' }} />
          <GradientOrb color="accent" size="lg" position={{ bottom: '-10%', right: '-5%' }} />
        </div>
        
        <motion.div 
          className="container mx-auto px-4 relative z-10 pt-20"
          style={{ opacity: heroOpacity, scale: heroScale }}
        >
          <div className="max-w-5xl mx-auto text-center">
            {/* Live Badge */}
            {liveTournaments.length > 0 && (
              <FadeIn>
                <motion.div
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-block"
                >
                  <Badge variant="live" className="mb-6 text-sm px-5 py-2 backdrop-blur-xl">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse mr-2" />
                    {liveTournaments.length} Tournament{liveTournaments.length > 1 ? 's' : ''} Live Now
                  </Badge>
                </motion.div>
              </FadeIn>
            )}
            
            {/* Main Heading */}
            <FadeInUp>
              <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[1.1] tracking-tight">
                Compete. Win.{' '}
                <AnimatedGradientText>Earn.</AnimatedGradientText>
              </h1>
            </FadeInUp>
            
            {/* Subheading */}
            <FadeInUp>
              <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                Kenya's premier gaming tournament platform. Join thousands of gamers competing for real cash prizes with M-Pesa payments.
              </p>
            </FadeInUp>
            
            {/* CTA Buttons */}
            <FadeInUp>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <PulseGlow className="rounded-xl">
                    <Button size="xl" variant="gaming" asChild className="relative overflow-hidden group">
                      <Link to="/tournaments">
                        <span className="relative z-10 flex items-center">
                          Browse Tournaments
                          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </Link>
                    </Button>
                  </PulseGlow>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button size="xl" variant="outline" asChild className="backdrop-blur-xl bg-background/50">
                    <Link to="/register">Create Account</Link>
                  </Button>
                </motion.div>
              </div>
            </FadeInUp>

            {/* Stats */}
            <StaggerContainer className="grid grid-cols-3 gap-4 md:gap-8 max-w-xl mx-auto">
              {stats.map((stat) => (
                <StaggerItem key={stat.label}>
                  <GlassCard className="p-4 md:p-6 text-center group hover:border-primary/30 transition-colors">
                    <motion.div 
                      className="font-display text-2xl md:text-4xl font-bold text-primary mb-1"
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    >
                      {stat.value}
                    </motion.div>
                    <div className="text-xs md:text-sm text-muted-foreground">{stat.label}</div>
                  </GlassCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
            <motion.div 
              className="w-1.5 h-3 rounded-full bg-primary"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Featured Games */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <FadeIn className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Popular Games</Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold">Choose Your Battlefield</h2>
          </FadeIn>
          
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {games.map((game) => (
              <StaggerItem key={game.name}>
                <MotionCard hoverEffect="lift">
                  <Link
                    to={`/tournaments?game=${game.name.toLowerCase().replace(' ', '')}`}
                    className={`block p-5 rounded-xl bg-gradient-to-br ${game.gradient} border border-border/50 hover:border-primary/50 transition-all text-center group`}
                  >
                    <motion.div 
                      className="text-5xl mb-3"
                      whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.4 }}
                    >
                      {game.icon}
                    </motion.div>
                    <div className="font-semibold text-sm mb-1">{game.name}</div>
                    <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                      <Users className="h-3 w-3" />
                      {game.players}
                    </div>
                  </Link>
                </MotionCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Featured Tournaments */}
      <section className="py-20 relative bg-gradient-to-b from-transparent via-card/30 to-transparent">
        <GradientOrb color="primary" size="lg" position={{ top: '20%', right: '-10%' }} className="opacity-30" />
        
        <div className="container mx-auto px-4">
          <FadeIn className="flex items-center justify-between mb-10">
            <div>
              <Badge variant="outline" className="mb-3">Featured</Badge>
              <h2 className="font-display text-3xl md:text-4xl font-bold">Upcoming Tournaments</h2>
            </div>
            <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" asChild className="group">
                <Link to="/tournaments">
                  View All 
                  <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>
          </FadeIn>
          
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournamentsLoading ? (
              [...Array(3)].map((_, i) => (
                <StaggerItem key={i}>
                  <SkeletonTournamentCard />
                </StaggerItem>
              ))
            ) : upcomingTournaments.length > 0 ? (
              upcomingTournaments.map((tournament) => (
                <StaggerItem key={tournament.id}>
                  <MotionCard hoverEffect="lift">
                    <TournamentCard tournament={tournament} />
                  </MotionCard>
                </StaggerItem>
              ))
            ) : (
              <StaggerItem className="col-span-full">
                <GlassCard className="p-12 text-center">
                  <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-display text-xl font-bold mb-2">No Tournaments Yet</h3>
                  <p className="text-muted-foreground">Check back soon for upcoming tournaments!</p>
                </GlassCard>
              </StaggerItem>
            )}
          </StaggerContainer>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <FadeIn className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Why GameFlex?</Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold">Built for Gamers</h2>
          </FadeIn>
          
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <StaggerItem key={feature.title}>
                <MotionCard hoverEffect="glow">
                  <GlassCard className={`p-6 text-center h-full bg-gradient-to-br ${feature.color}`}>
                    <motion.div 
                      className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5"
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <feature.icon className="h-7 w-7 text-primary" />
                    </motion.div>
                    <h3 className="font-display text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </GlassCard>
                </MotionCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Top Players */}
      <section className="py-20 relative bg-gradient-to-b from-transparent via-card/30 to-transparent">
        <div className="container mx-auto px-4">
          <FadeIn className="flex items-center justify-between mb-10">
            <div>
              <Badge variant="outline" className="mb-3">
                <TrendingUp className="h-3 w-3 mr-1" />
                Leaderboard
              </Badge>
              <h2 className="font-display text-3xl md:text-4xl font-bold">Top Players</h2>
            </div>
            <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" asChild className="group">
                <Link to="/leaderboard">
                  Full Rankings
                  <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>
          </FadeIn>
          
          <StaggerContainer className="space-y-3 max-w-3xl mx-auto">
            {leaderboardLoading ? (
              [...Array(5)].map((_, i) => (
                <StaggerItem key={i}>
                  <SkeletonLeaderboardRow />
                </StaggerItem>
              ))
            ) : topPlayers.length > 0 ? (
              topPlayers.map((player: any, index: number) => (
                <StaggerItem key={player.id}>
                  <MotionCard hoverEffect="lift">
                    <Link to={`/player/${player.user_id}`}>
                      <GlassCard className="flex items-center gap-4 p-4 hover:border-primary/30 transition-colors">
                        <motion.div 
                          className={`h-12 w-12 rounded-full flex items-center justify-center font-display font-bold text-lg ${
                            index === 0 ? 'bg-gradient-to-br from-yellow-500 to-amber-600 text-black' :
                            index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-black' :
                            index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-black' :
                            'bg-secondary text-muted-foreground'
                          }`}
                          whileHover={{ scale: 1.1 }}
                        >
                          {index < 3 ? <Crown className="h-5 w-5" /> : index + 1}
                        </motion.div>
                        <Avatar className="h-12 w-12 border-2 border-border">
                          <AvatarImage src={player.profiles?.avatar_url ?? ''} />
                          <AvatarFallback className="bg-primary/20 text-primary">
                            {(player.profiles?.username ?? 'U').slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold truncate">{player.profiles?.username ?? 'Unknown'}</div>
                          <div className="text-sm text-muted-foreground truncate">{player.profiles?.game_handle ?? '-'}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-display font-bold text-primary text-lg">{(player.points ?? 0).toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">{player.wins ?? 0}W - {player.losses ?? 0}L</div>
                        </div>
                      </GlassCard>
                    </Link>
                  </MotionCard>
                </StaggerItem>
              ))
            ) : (
              <StaggerItem>
                <GlassCard className="p-8 text-center">
                  <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No players on the leaderboard yet</p>
                </GlassCard>
              </StaggerItem>
            )}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <FadeInUp>
            <div className="max-w-4xl mx-auto relative">
              <GradientOrb color="primary" size="md" position={{ top: '-30%', left: '10%' }} className="opacity-50" />
              <GradientOrb color="accent" size="md" position={{ bottom: '-30%', right: '10%' }} className="opacity-50" />
              
              <GlassCard className="p-10 md:p-16 text-center relative overflow-hidden">
                <FloatingParticles quantity={15} />
                
                <FloatingElement>
                  <div className="h-16 w-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6">
                    <Gamepad2 className="h-8 w-8 text-primary" />
                  </div>
                </FloatingElement>
                
                <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
                  Ready to <AnimatedGradientText>Compete?</AnimatedGradientText>
                </h2>
                <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                  Join thousands of gamers and start winning today. Your next victory awaits.
                </p>
                
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <PulseGlow className="inline-block rounded-xl">
                    <Button size="xl" variant="gaming" asChild>
                      <Link to="/register" className="group">
                        Get Started Free
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </PulseGlow>
                </motion.div>
              </GlassCard>
            </div>
          </FadeInUp>
        </div>
      </section>
    </div>
  );
}
