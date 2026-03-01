import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ProfileHeader } from './Components/ProfileHeader'; 

// Adicione a palavra "type" aqui:
import type { UserProfile } from '../../types/user';

export const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { user: loggedInUser } = useAuth() as any;
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const isOwner = loggedInUser?.username === username || (username === 'silvaneto');

  useEffect(() => {
    setTimeout(() => {
      setProfileData({
        id: '1',
        name: 'Silva Neto',
        username: 'silvaneto',
        email: 'contato@email.com',
        bio: 'Fullstack Developer | React & NestJS',
        socials: { github: '', linkedin: '' },
        techStack: {
          systems: ['Windows'],
          languages: ['TypeScript'],
          tools: ['VS Code']
        },
        projects: []
      });
      setLoading(false);
    }, 500);
  }, [username]);

  if (loading) return <div className="p-20 text-center font-bold text-blue-600">CARREGANDO...</div>;
  if (!profileData) return <div className="text-center p-20 text-red-500 font-bold">PERFIL NÃO ENCONTRADO</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
      <div className="max-w-6xl mx-auto p-4 flex flex-col gap-6">
        
        <ProfileHeader 
          user={profileData} 
          isOwner={isOwner} 
          onOpenSettings={() => setIsSettingsOpen(true)} 
        />
        
      </div>
    </div>
  );
};