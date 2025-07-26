// app/page.tsx
"use client";

import { useState } from "react";
import PokemonCard from "./components/PokemonCard";
import PokemonDetailModal from "./components/PokemonDetailModal";
// ***** FIX 2: PASTIKAN KEDUA HOOK DI-IMPORT & TAMBAHKAN TIPE DATA *****
import { usePokemonList, PokemonListResult } from "./hooks/usePokemonData";

export default function Home() {
  const { pokemonList, loading } = usePokemonList();
  const [selectedPokemon, setSelectedPokemon] = useState<string | null>(null);

  const handleSelectPokemon = (name: string) => {
    setSelectedPokemon(name);
  };

  const handleCloseModal = () => {
    setSelectedPokemon(null);
  };

  return (
    <>
      {loading && !pokemonList.length && (
        <div className="fixed inset-0 flex flex-col justify-center items-center bg-gradient-to-br from-green-200 to-blue-200 z-[100]">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Pokebola-pokeball-png-0.png" alt="Pokeball" className="w-24 h-24 animate-spin"/>
            <p className="mt-4 text-2xl font-bold text-gray-600">Loading Pokémon...</p>
        </div>
      )}

      <main className="max-w-md mx-auto bg-gray-50 min-h-screen">
        <div className="p-4 bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b">
          <h1 className="text-center text-2xl font-bold text-poke-dark-text">Pokemon</h1>
        </div>

        <div className="p-4 space-y-3">
          {/* Menambahkan tipe data 'PokemonListResult' ke parameter 'pokemon' */}
          {pokemonList.map((pokemon: PokemonListResult) => (
            <PokemonCard
              key={pokemon.name}
              name={pokemon.name}
              url={pokemon.url}
              onSelect={() => handleSelectPokemon(pokemon.name)}
              isSelected={selectedPokemon === pokemon.name}
            />
          ))}
        </div>
      </main>

      {selectedPokemon && (
        <PokemonDetailModal
          pokemonName={selectedPokemon}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}