import React from 'react';
import type { UserProfile } from '../../../types/user';

interface Props {
  user: UserProfile;
  isOwner: boolean;
  onOpenSettings: () => void;
}

export const ProfileHeader: React.FC<Props> = ({ user, isOwner, onOpenSettings }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="h-44 bg-gradient-to-r from-blue-700 via-indigo-500 to-purple-600"></div>
      
      <div className="px-8 pb-8">
        <div className="relative flex justify-between items-end -mt-20">
          <div className="p-2 bg-white dark:bg-gray-800 rounded-3xl shadow-xl">
            <div className="w-36 h-36 bg-gray-200 dark:bg-gray-700 rounded-2xl border-4 border-white dark:border-gray-800 flex items-center justify-center text-5xl font-black text-gray-400 uppercase">
              {user.name.charAt(0)}
            </div>
          </div>
          
          <div className="flex gap-3 mb-2">
            {isOwner ? (
              <button 
                onClick={onOpenSettings}
                className="px-6 py-2.5 bg-gray-900 dark:bg-white dark:text-black text-white font-bold rounded-xl hover:scale-105 transition-transform"
              >
                Gerenciar Perfil
              </button>
            ) : (
              <a 
                href={`mailto:${user.email}`} 
                className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-500/40"
              >
                Entrar em contato
              </a>
            )}
          </div>
        </div>

        <div className="mt-6">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            {user.name} 
            <span className="text-xl font-medium text-gray-400 ml-3">(@{user.username})</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mt-2 font-medium max-w-2xl">{user.bio}</p>
        </div>
      </div>
    </div>
  );
};