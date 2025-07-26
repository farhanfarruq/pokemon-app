// app/hooks/usePokemonData.ts
'use client';
import { useState, useEffect, useCallback } from 'react';

// --- Interfaces ---
export interface PokemonListResult {
  name: string;
  url: string;
}

export interface PokemonListData {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListResult[];
}

export interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    other: { 'official-artwork': { front_default: string; }; };
    front_default: string;
    front_shiny: string;
  };
  types: { slot: number; type: { name: string; url: string; } }[];
  stats: { base_stat: number; stat: { name: string; }; }[];
  abilities: { ability: { name: string; url: string; }; is_hidden: boolean; }[];
  species: { url: string; };
}

export interface PokemonSpecies {
  flavor_text_entries: { flavor_text: string; language: { name: string; }; }[];
  capture_rate: number;
  gender_rate: number;
  hatch_counter: number;
  habitat: { name: string; } | null;
  generation: { name: string; };
  egg_groups: { name: string; }[];
  evolution_chain: { url: string; };
}

export interface TypeDetail {
  damage_relations: {
    double_damage_from: { name: string; url:string; }[];
  };
}

export interface AbilityDetail {
    name: string;
    effect_entries: {
        effect: string;
        short_effect: string;
        language: { name: string };
    }[];
}

export interface EvolutionDetail {
    min_level: number;
    trigger: { name: string };
    item: { name: string } | null;
}

export interface EvolutionChain {
    species: { name: string; url: string };
    evolves_to: EvolutionChain[];
    evolution_details: EvolutionDetail[];
}


// --- Custom Hooks ---

export const usePokemonList = () => {
  const [pokemonList, setPokemonList] = useState<PokemonListResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPokemonList = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
        const data: PokemonListData = await response.json();
        setPokemonList(data.results);
      } catch (error) {
        console.error("Failed to fetch Pokemon list:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPokemonList();
  }, []);

  return { pokemonList, loading };
};


export const usePokemonDetail = (name: string | null) => {
    const [detail, setDetail] = useState<PokemonDetail | null>(null);
    const [species, setSpecies] = useState<PokemonSpecies | null>(null);
    const [evolutionChain, setEvolutionChain] = useState<EvolutionChain | null>(null);
    const [weaknesses, setWeaknesses] = useState<string[]>([]);
    const [abilities, setAbilities] = useState<AbilityDetail[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchDetails = useCallback(async (pokemonName: string) => {
        setLoading(true);
        setError(null);
        try {
            const detailRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
            if (!detailRes.ok) throw new Error("Pokemon not found");
            const detailData: PokemonDetail = await detailRes.json();
            setDetail(detailData);

            const speciesRes = await fetch(detailData.species.url);
            const speciesData: PokemonSpecies = await speciesRes.json();
            setSpecies(speciesData);

            const evolutionRes = await fetch(speciesData.evolution_chain.url);
            const evolutionData = await evolutionRes.json();
            setEvolutionChain(evolutionData.chain);

            const typePromises = detailData.types.map(t => fetch(t.type.url).then(res => res.json()));
            const typeDetails: TypeDetail[] = await Promise.all(typePromises);
            const allWeaknesses = new Set<string>();
            typeDetails.forEach(t => {
                t.damage_relations.double_damage_from.forEach(w => allWeaknesses.add(w.name));
            });
            setWeaknesses(Array.from(allWeaknesses));

            const abilityPromises = detailData.abilities.map(a => fetch(a.ability.url).then(res => res.json()));
            const abilityDetails: AbilityDetail[] = await Promise.all(abilityPromises);
            setAbilities(abilityDetails);

        } catch (err: unknown) {
            console.error("Failed to fetch details:", err);
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred");
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (name) {
            fetchDetails(name);
        } else {
            setDetail(null);
            setSpecies(null);
            setEvolutionChain(null);
            setWeaknesses([]);
            setAbilities([]);
        }
    }, [name, fetchDetails]);

    return { detail, species, evolutionChain, weaknesses, abilities, loading, error };
};