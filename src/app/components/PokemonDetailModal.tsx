// app/components/PokemonDetailModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { usePokemonDetail, EvolutionChain as EvolutionChainType, EvolutionDetail as EvolutionDetailType } from '../hooks/usePokemonData';
import { IoArrowBack, IoMale, IoFemale, IoArrowForward } from 'react-icons/io5';
import TypeIcon from './TypeIcon';

// Interface
interface PokemonDetailModalProps {
  pokemonName: string | null;
  onClose: () => void;
}

//--- Helper Components ---

// Judul untuk setiap seksi
const SectionTitle: React.FC<{ title: string; color: string }> = ({ title, color }) => (
  <h3 className={`text-center font-bold text-lg ${color} my-5`}>{title}</h3>
);

// Bar untuk statistik
const StatDisplay: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => {
    const width = Math.min((value / 255) * 100, 100);
    return (
        <div className="flex items-center w-full gap-3 text-sm">
            <p className={`w-1/4 text-right font-bold capitalize ${color}`}>{label}</p>
            <p className="w-[45px] text-left font-bold text-poke-dark-text">{String(value).padStart(3, '0')}</p>
            <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                <div className={`${color.replace('text-', 'bg-')} h-1.5 rounded-full`} style={{ width: `${width}%` }}></div>
            </div>
        </div>
    );
};

// Ikon untuk kelemahan
const WeaknessDisplay: React.FC<{ typeName: string }> = ({ typeName }) => (
    <div className="flex items-center gap-1 text-sm">
        <TypeIcon typeName={typeName} />
        <span>2x</span>
    </div>
);

// Komponen untuk satu tahap evolusi
const EvolutionStage: React.FC<{ species: { name: string; url: string; }; }> = ({ species }) => {
    const [sprite, setSprite] = useState<string | null>(null);
    const pokemonId = species.url.split('/').slice(-2, -1)[0];
    const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;

    useEffect(() => {
      setSprite(spriteUrl);
    }, [spriteUrl]);

    return (
      <div className="flex flex-col items-center flex-1">
        {sprite ? (
          <Image src={sprite} alt={species.name} width={96} height={96} className="drop-shadow-lg"/>
        ) : (
          <div className="w-24 h-24 bg-gray-200 rounded-full animate-pulse" />
        )}
        <p className="font-bold capitalize mt-2 text-center text-poke-dark-text">{species.name}</p>
      </div>
    );
};

// Komponen untuk detail cara evolusi (panah dan level/item)
const EvolutionDetail: React.FC<{ details: EvolutionDetailType[] | undefined; color: string; }> = ({ details, color }) => {
    if (!details || details.length === 0) return null;
    const detail = details[0];

    let triggerText = '';
    if (detail.trigger.name === 'level-up') {
        if (detail.min_level) {
            triggerText = `Lv. ${detail.min_level}`;
        } else {
            triggerText = 'Level Up';
        }
    } else if (detail.trigger.name === 'use-item' && detail.item) {
        triggerText = detail.item.name.replace(/-/g, ' ');
    } else if (detail.trigger.name === 'trade') {
        triggerText = 'Trade';
    } else {
        triggerText = detail.trigger.name.replace(/-/g, ' ');
    }

    return (
        <div className="flex flex-col items-center justify-center mx-1 flex-shrink-0">
            <p className={`text-xs font-bold mb-1 ${color} capitalize text-center`}>{triggerText}</p>
            <IoArrowForward size={24} className={color} />
        </div>
    );
};

// Komponen untuk render tab evolusi (BARU)
const EvolutionRenderer: React.FC<{ chain: EvolutionChainType | null; color: string; }> = ({ chain, color }) => {
    const [evolutionLine, setEvolutionLine] = useState<EvolutionChainType[]>([]);

    useEffect(() => {
        const line: EvolutionChainType[] = [];
        let current: EvolutionChainType | null | undefined = chain;
        while (current) {
            line.push(current);
            current = current.evolves_to?.[0];
        }
        setEvolutionLine(line);
    }, [chain]);

    if (!chain) {
        return <div className="text-center p-4">Loading evolution data...</div>;
    }

    if (evolutionLine.length <= 1) {
         return (
             <div className="animate-fade-in p-4">
                <SectionTitle title="Evolution Chain" color={color} />
                <p className="text-center text-gray-500">This Pokémon does not evolve.</p>
            </div>
         );
    }
    
    return (
        <div className="animate-fade-in p-4">
            <SectionTitle title="Evolution Chain" color={color} />
            <div className="space-y-4">
                {evolutionLine.slice(0, -1).map((stage, index) => {
                    const fromStage = stage;
                    const toStage = evolutionLine[index + 1];
                    if (!toStage) return null;

                    return (
                        <div key={fromStage.species.name} className="flex justify-around items-center w-full">
                            <EvolutionStage species={fromStage.species} />
                            <EvolutionDetail details={toStage.evolution_details} color={color} />
                            <EvolutionStage species={toStage.species} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};


//--- Komponen Utama Modal ---
const PokemonDetailModal: React.FC<PokemonDetailModalProps> = ({ pokemonName, onClose }) => {
  const { detail, species, weaknesses, abilities, evolutionChain } = usePokemonDetail(pokemonName);
  const [activeTab, setActiveTab] = useState<'STATS' | 'EVOLUTIONS'>('STATS');

  // Definisi Warna
  const typeColorName = detail?.types?.[0]?.type?.name ?? 'normal';
  const typeColors: { [key: string]: { bg: string, text: string, button: string } } = {
    grass: { bg: 'bg-green-500', text: 'text-green-500', button: 'bg-green-500' },
    fire: { bg: 'bg-orange-500', text: 'text-orange-500', button: 'bg-orange-500' },
    water: { bg: 'bg-blue-500', text: 'text-blue-500', button: 'bg-blue-500' },
    bug: { bg: 'bg-lime-500', text: 'text-lime-500', button: 'bg-lime-500' },
    normal: { bg: 'bg-gray-400', text: 'text-gray-500', button: 'bg-gray-400' },
    poison: { bg: 'bg-purple-500', text: 'text-purple-500', button: 'bg-purple-500' },
    electric: { bg: 'bg-yellow-400', text: 'text-yellow-400', button: 'bg-yellow-400' },
    ground: { bg: 'bg-yellow-600', text: 'text-yellow-600', button: 'bg-yellow-600' },
    fairy: { bg: 'bg-pink-400', text: 'text-pink-400', button: 'bg-pink-400' },
    fighting: { bg: 'bg-red-700', text: 'text-red-700', button: 'bg-red-700' },
    psychic: { bg: 'bg-pink-500', text: 'text-pink-500', button: 'bg-pink-500' },
    rock: { bg: 'bg-stone-500', text: 'text-stone-500', button: 'bg-stone-500' },
    steel: { bg: 'bg-slate-500', text: 'text-slate-500', button: 'bg-slate-500' },
    ice: { bg: 'bg-cyan-300', text: 'text-cyan-400', button: 'bg-cyan-300' },
    ghost: { bg: 'bg-indigo-600', text: 'text-indigo-600', button: 'bg-indigo-600' },
    dragon: { bg: 'bg-violet-600', text: 'text-violet-600', button: 'bg-violet-600' },
    dark: { bg: 'bg-neutral-700', text: 'text-neutral-700', button: 'bg-neutral-700' },
    default: { bg: 'bg-gray-400', text: 'text-gray-500', button: 'bg-gray-400' }
  };
  const { bg, text, button } = typeColors[typeColorName] || typeColors.default;

  const getAbilityDescription = (abilityName: string) => abilities.find(a => a.name === abilityName)?.effect_entries.find(e => e.language.name === 'en')?.short_effect || 'No special effect.';
  
  const genderRate = species?.gender_rate ?? -1;
  const femalePercentage = genderRate === -1 ? 0 : (genderRate / 8) * 100;
  const malePercentage = 100 - femalePercentage;

  const GenderChart = () => (
    <div className="relative w-12 h-12 mx-auto">
        <svg viewBox="0 0 36 36" className="transform -rotate-90">
            <path className="stroke-current text-gray-200" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="4"></path>
            <path className="stroke-current text-pink-500" strokeDasharray={`${femalePercentage}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="4" strokeDashoffset="-0.5"></path>
            <path className="stroke-current text-blue-500" strokeDasharray={`${malePercentage}, 100`} strokeDashoffset={`-${femalePercentage - 0.5}`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="4"></path>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
            <IoFemale className="text-pink-500 text-lg" />
            <IoMale className="text-blue-500 text-lg ml-1" />
        </div>
    </div>
  );

  const CaptureRateChart = () => {
    const rate = species?.capture_rate ?? 0;
    const percentage = (rate / 255) * 100;
    return (
        <div className="relative w-12 h-12 mx-auto">
             <svg viewBox="0 0 36 36" className="transform -rotate-90">
                <path className="stroke-current text-gray-200" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="4"></path>
                <path className={`stroke-current ${text}`} strokeDasharray={`${percentage}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="4"></path>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <Image src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" alt="pokeball" width={20} height={20} />
            </div>
        </div>
    );
  };
  
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-2">
      <div className="w-full max-w-sm h-[95vh] flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden relative">
        
        {/* Tombol Kembali (selalu terlihat) */}
        <button onClick={onClose} className="absolute top-4 left-4 text-white/90 hover:text-white z-30 transition-colors">
            <IoArrowBack size={28} />
        </button>
        
        {/* Kontainer Utama yang bisa di-scroll */}
        <div className={`flex-grow overflow-y-auto ${bg}`}>
          
          {/* Header Area (Gambar) */}
          <div className="relative h-48 w-full flex-shrink-0">
              {detail?.sprites?.other['official-artwork']?.front_default && (
                  <div className="absolute -bottom-10 inset-x-0 h-full z-20">
                      <Image
                          src={detail.sprites.other['official-artwork'].front_default}
                          alt={detail.name}
                          layout="fill"
                          objectFit="contain"
                          className="drop-shadow-2xl"
                          priority
                      />
                  </div>
              )}
          </div>
          
          {/* Konten Putih */}
          <div className="bg-white rounded-t-3xl z-10 relative">
            <div className="pt-14 p-5">
                <h1 className="text-center font-bold text-3xl capitalize">{detail?.name}</h1>
                <div className="flex justify-center gap-2 my-2">
                  {detail?.types?.map(t => <TypeIcon key={t.type.name} typeName={t.type.name} size="large" />)}
                </div>

                <div className="flex justify-center gap-4 my-6">
                  <button onClick={() => setActiveTab('STATS')} className={`font-bold py-2 px-6 rounded-full transition-colors ${activeTab === 'STATS' ? `${button} text-white shadow-md` : 'bg-gray-200 text-gray-500'}`}>Stats</button>
                  <button onClick={() => setActiveTab('EVOLUTIONS')} className={`font-bold py-2 px-6 rounded-full transition-colors ${activeTab === 'EVOLUTIONS' ? `${button} text-white shadow-md` : 'bg-gray-200 text-gray-500'}`}>Evolution</button>
                </div>

                {activeTab === 'STATS' && (
                  <div className="space-y-5 animate-fade-in">
                    
                    {/* Base Stats */}
                    <div className="space-y-3">{detail?.stats.map(s => <StatDisplay key={s.stat.name} label={s.stat.name} value={s.base_stat} color={text} />)}</div>
                    
                    {/* Weaknesses */}
                    <div>
                        <SectionTitle title="Weaknesses" color={text} />
                        <div className="flex flex-wrap justify-center gap-4">
                          {weaknesses.map(w => <WeaknessDisplay key={w} typeName={w} />)}
                        </div>
                    </div>
                    
                    {/* Abilities */}
                    <div>
                        <SectionTitle title="Abilities" color={text} />
                        <div className='space-y-3 text-sm'>
                          {detail?.abilities.map(a => (
                              <div key={a.ability.name}>
                                  <p className='font-bold capitalize'>{a.ability.name.replace('-', ' ')} {a.is_hidden && <span className="text-xs text-gray-500">(Hidden)</span>}</p>
                                  <p className='text-gray-600'>{getAbilityDescription(a.ability.name)}</p>
                              </div>
                          ))}
                        </div>
                    </div>

                    {/* Breeding */}
                    <div>
                          <SectionTitle title="Breeding" color={text} />
                          <div className="grid grid-cols-3 gap-2 text-center text-sm items-start">
                             {/* Egg Group */}
                             <div>
                                  <p className="font-semibold text-gray-500">Egg Group</p>
                                  <p className="font-bold capitalize mt-2">{species?.egg_groups.map(g => g.name).join('\n')}</p>
                             </div>
                             {/* Hatch Time */}
                             <div>
                                  <p className="font-semibold text-gray-500">Hatch Time</p>
                                  <p className="font-bold mt-2">{species?.hatch_counter} Cycles</p>
                                  <p className="text-xs text-gray-500">({(species?.hatch_counter ?? 0) * 255} Steps)</p>
                             </div>
                             {/* Gender */}
                             <div>
                                  <p className="font-semibold text-gray-500">Gender</p>
                                  {genderRate === -1 ? <p className="font-bold mt-2">Genderless</p> : <div><GenderChart /><p className="text-xs mt-1"><span className="text-blue-500">{malePercentage}%</span>, <span className="text-pink-500">{femalePercentage}%</span></p></div>}
                             </div>
                          </div>
                    </div>

                    {/* Capture */}
                    <div>
                          <SectionTitle title="Capture" color={text} />
                           <div className="grid grid-cols-3 gap-2 text-center text-sm items-start">
                             <div>
                                  <p className="font-semibold text-gray-500">Habitat</p>
                                  <p className="font-bold capitalize mt-2">{species?.habitat?.name ?? 'Unknown'}</p>
                             </div>
                             <div>
                                  <p className="font-semibold text-gray-500">Generation</p>
                                  <p className="font-bold mt-2">{species?.generation?.name.split('-')[1].toUpperCase()}</p>
                             </div>
                             <div>
                                  <p className="font-semibold text-gray-500">Capture Rate</p>
                                  <CaptureRateChart/>
                                  <p className="text-xs mt-1">{species?.capture_rate}</p>
                             </div>
                           </div>
                    </div>
                    
                    {/* Sprites */}
                    <div>
                        <SectionTitle title="Sprites" color={text} />
                        <div className="flex justify-around items-center">
                            <div className="text-center">
                                {detail?.sprites.front_default && <Image src={detail.sprites.front_default} alt="Normal Sprite" width={110} height={110} />}
                                <p className="font-bold">Normal</p>
                            </div>
                            <div className="text-center">
                                {detail?.sprites.front_shiny && <Image src={detail.sprites.front_shiny} alt="Shiny Sprite" width={110} height={110} />}
                                <p className="font-bold">Shiny</p>
                            </div>
                        </div>
                    </div>
                  </div>
                )}

                {activeTab === 'EVOLUTIONS' && ( <EvolutionRenderer chain={evolutionChain} color={text} /> )}
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetailModal;