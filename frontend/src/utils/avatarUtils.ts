// Utilitários para avatares com fotos reais

// Lista de avatares masculinos do Unsplash
const MALE_AVATARS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
  'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
];

// Lista de avatares femininos do Unsplash
const FEMALE_AVATARS = [
  'https://images.unsplash.com/photo-1494790108755-2616b9c5e8e1?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
  'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
];

// Todos os avatares combinados
const ALL_AVATARS = [...MALE_AVATARS, ...FEMALE_AVATARS];

/**
 * Gera um avatar aleatório
 * @param gender - 'male', 'female' ou 'any' para qualquer gênero
 * @param seed - Seed opcional para gerar sempre o mesmo avatar para o mesmo seed
 * @returns URL do avatar
 */
export function getRandomAvatar(gender: 'male' | 'female' | 'any' = 'any', seed?: string): string {
  let avatarList: string[];

  switch (gender) {
    case 'male':
      avatarList = MALE_AVATARS;
      break;
    case 'female':
      avatarList = FEMALE_AVATARS;
      break;
    default:
      avatarList = ALL_AVATARS;
  }

  if (seed) {
    // Gera um índice baseado no seed para consistência
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    const index = Math.abs(hash) % avatarList.length;
    return avatarList[index];
  }

  // Avatar aleatório
  const randomIndex = Math.floor(Math.random() * avatarList.length);
  return avatarList[randomIndex];
}

/**
 * Gera um avatar baseado no nome da pessoa
 * Tenta inferir o gênero pelo nome e usa como seed
 */
export function getAvatarByName(name: string): string {
  const lowerName = name.toLowerCase();

  // Lista simples de nomes femininos comuns
  const femaleNames = [
    'maria',
    'ana',
    'joana',
    'carla',
    'paula',
    'julia',
    'lucia',
    'beatriz',
    'fernanda',
    'amanda',
    'patricia',
    'sandra',
    'monica',
    'claudia',
    'andrea',
    'mariana',
    'carolina',
    'gabriela',
    'isabela',
    'rafaela',
    'daniela',
  ];

  // Verifica se é um nome feminino
  const isFemale = femaleNames.some((femaleName) => lowerName.includes(femaleName));
  const gender = isFemale ? 'female' : 'male';

  return getRandomAvatar(gender, name);
}

/**
 * Gera um avatar para um usuário baseado no ID
 * Garante que o mesmo ID sempre retorne o mesmo avatar
 */
export function getAvatarById(userId: string, name?: string): string {
  if (name) {
    return getAvatarByName(name);
  }

  return getRandomAvatar('any', userId);
}

/**
 * Lista de avatares específicos para diferentes tipos de usuário
 */
export const PRESET_AVATARS = {
  admin:
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
  demo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
  guest:
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
  support:
    'https://images.unsplash.com/photo-1494790108755-2616b9c5e8e1?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
} as const;

export default {
  getRandomAvatar,
  getAvatarByName,
  getAvatarById,
  PRESET_AVATARS,
};
