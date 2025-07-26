// app/components/TypeIcon.tsx
import Image from 'next/image';

interface TypeIconProps {
  typeName: string;
  size?: 'small' | 'large';
}

const typeInfo: { [key: string]: { icon: string; color: string } } = {
  grass: { icon: 'https://archives.bulbagarden.net/media/upload/0/08/Battrio_Grass_type.png', color: 'bg-green-500' },
  fire: { icon: 'https://archives.bulbagarden.net/media/upload/8/8a/Battrio_Fire_type.png', color: 'bg-orange-500' },
  water: { icon: 'https://archives.bulbagarden.net/media/upload/2/29/Battrio_Water_type.png', color: 'bg-blue-500' },
  poison: { icon: 'https://archives.bulbagarden.net/media/upload/2/20/Battrio_Poison_type.png', color: 'bg-purple-500' },
  flying: { icon: 'https://archives.bulbagarden.net/media/upload/9/97/Battrio_Flying_type.png', color: 'bg-indigo-400' },
  bug: { icon: 'https://archives.bulbagarden.net/media/upload/5/57/Battrio_Bug_type.png', color: 'bg-lime-500' },
  normal: { icon: 'https://archives.bulbagarden.net/media/upload/7/75/Battrio_Normal_type.png', color: 'bg-gray-400' },
  electric: { icon: 'https://archives.bulbagarden.net/media/upload/0/02/Battrio_Electric_type.png', color: 'bg-yellow-400' },
  ground: { icon: 'https://archives.bulbagarden.net/media/upload/f/f1/Battrio_Ground_type.png', color: 'bg-yellow-600' },
  fairy: { icon: 'https://archives.bulbagarden.net/media/upload/5/5a/Fairy_icon.png', color: 'bg-pink-400' },
  fighting: { icon: 'https://archives.bulbagarden.net/media/upload/1/1b/Battrio_Fighting_type.png', color: 'bg-red-700' },
  psychic: { icon: 'https://archives.bulbagarden.net/media/upload/6/61/Battrio_Psychic_type.png', color: 'bg-pink-500' },
  rock: { icon: 'https://archives.bulbagarden.net/media/upload/7/77/Battrio_Rock_type.png', color: 'bg-stone-500' },
  steel: { icon: 'https://archives.bulbagarden.net/media/upload/5/59/Battrio_Steel_type.png', color: 'bg-slate-500' },
  ice: { icon: 'https://archives.bulbagarden.net/media/upload/0/01/Battrio_Ice_type.png', color: 'bg-cyan-300' },
  ghost: { icon: 'https://archives.bulbagarden.net/media/upload/2/28/Battrio_Ghost_type.png', color: 'bg-indigo-700' },
  dragon: { icon: 'https://archives.bulbagarden.net/media/upload/5/51/Battrio_Dragon_type.png', color: 'bg-violet-700' },
  dark: { icon: 'https://archives.bulbagarden.net/media/upload/0/0f/Battrio_Dark_type.png', color: 'bg-neutral-800'},
};

const TypeIcon: React.FC<TypeIconProps> = ({ typeName, size = 'small' }) => {
  const info = typeInfo[typeName] || { icon: 'https://archives.bulbagarden.net/media/upload/7/75/Battrio_Normal_type.png', color: 'bg-gray-400' };

  if (size === 'large') {
    return (
      <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-1 border border-gray-200">
        <Image src={info.icon} alt={typeName} width={24} height={24} unoptimized />
        <span className="font-semibold capitalize text-poke-dark-text">{typeName}</span>
      </div>
    );
  }

  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${info.color}`}>
      <Image src={info.icon} alt={typeName} width={20} height={20} unoptimized />
    </div>
  );
};

export default TypeIcon;