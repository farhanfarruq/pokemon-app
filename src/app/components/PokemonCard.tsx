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
        setData({
          id: detail.id,
          sprite: detail.sprites.front_default,
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
      <div className="w-full h-20 bg-gray-200 rounded-lg animate-pulse"></div>
    );
  }

  if (!data) return null;

  return (
    <div
      onClick={onSelect}
      className={`flex items-center p-3 rounded-xl cursor-pointer transition-all duration-200 ${isSelected ? 'bg-poke-light-blue shadow-lg' : 'bg-white hover:bg-gray-50'}`}
    >
      <Image
        src={data.sprite}
        alt={name}
        width={68}
        height={68}
        unoptimized
        className="flex-shrink-0"
      />
      <div className="flex-grow ml-4">
        <p className="text-poke-light-text text-sm">#{String(data.id).padStart(3, '0')}</p>
        <p className="font-bold text-poke-dark-text text-lg capitalize">{name}</p>
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