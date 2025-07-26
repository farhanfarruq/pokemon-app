// app/components/PokemonCard.tsx
'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import TypeIcon from './TypeIcon';

interface PokemonCardProps {
  name: string;
  url: string;
  onSelect: () => void;
  isSelected: boolean;
}

interface PokemonMiniDetail {
  id: number;
  // Menggunakan URL sprite yang lebih andal
  sprite: string; 
  types: { type: { name: string } }[];
}

const PokemonCard: React.FC<PokemonCardProps> = ({ name, url, onSelect, isSelected }) => {
  const [data, setData] = useState<PokemonMiniDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMiniDetail = async () => {
      setLoading(true);
      try {
        const response = await fetch(url);
        const detail = await response.json();
        
        // Mengambil ID dari URL untuk membangun URL gambar yang benar
        const pokemonId = detail.id;
        const animatedSpriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${pokemonId}.gif`;
        const staticSpriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;

        // Logika untuk memilih sprite: coba animasi dulu, jika gagal, pakai statis
        const res = await fetch(animatedSpriteUrl);
        const finalSprite = res.ok ? animatedSpriteUrl : staticSpriteUrl;

        setData({
          id: detail.id,
          sprite: finalSprite,
          types: detail.types,
        });

      } catch (error) {
        console.error("Failed to fetch mini detail:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMiniDetail();
  }, [url]);

  if (loading) {
    return (
      <div className="w-full h-20 bg-gray-200/50 rounded-lg animate-pulse"></div>
    );
  }

  if (!data) return null;

  return (
    <div
      onClick={onSelect}
      className={`group flex items-center p-3 rounded-xl cursor-pointer transition-all duration-300 ${isSelected ? 'bg-poke-light-blue shadow-lg scale-105' : 'bg-white/70 backdrop-blur-sm hover:bg-white'}`}
    >
      <div className="w-16 h-16 flex-shrink-0 relative">
        {data.sprite && (
          <Image
            src={data.sprite}
            alt={name}
            layout="fill"
            objectFit="contain"
            unoptimized // Penting untuk GIF
          />
        )}
      </div>
      <div className="flex-grow ml-4">
        <p className="font-bold text-poke-dark-text text-lg capitalize">{name}</p>
        <p className="text-gray-400 text-sm font-semibold">#{String(data.id).padStart(3, '0')}</p>
      </div>
      <div className="flex gap-2">
        {data.types.map((typeInfo, index) => (
          <TypeIcon key={index} typeName={typeInfo.type.name} />
        ))}
      </div>
    </div>
  );
};

export default PokemonCard;