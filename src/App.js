import React from "react";
import { gql, useQuery } from "@apollo/client";
import "./styles.css";

const PokemonFields = ` 
  fragment PokemonFields on Pokemon {
    id
    number
    name
    classification
    types
    resistant
    weaknesses
    fleeRate
    maxCP
    maxHP
    image
  }`

// FRAGMENT BASED QUERY

let POKEMONS_QUERY = gql`
  ${PokemonFields}
  query pokemons {
    pokemons(first: 10) {
      ...PokemonFields
    }
  }
`;
  
let FRAGMENT_POKEMON_QUERY = gql`
  ${PokemonFields}
  query pokemon($id: String) {
    pokemon(id: $id) {
      ...PokemonFields
    }
  }
`;

// NO FRAGMENT QUERY 
// COMMENT THIS REDECLARATIONS OUT TO SEE THE ISSUE

let NON_FRAGMENT_POKEMON_QUERY = gql`
  query pokemon($id: String) {
    pokemon(id: $id) {
      id
      number
      name
      classification
      types
      resistant
      weaknesses
      fleeRate
      maxCP
      maxHP
      image
    }
  }
`;

export default function App() {

  // cache-first queries that will be updated once the list query completes and broadcasts
  const { 
    data: {
      pokemon: fragmentPokemon
    } = { pokemon: null }
  } = useQuery(FRAGMENT_POKEMON_QUERY, { 
    variables: { id: "UG9rZW1vbjowMDk=" }, 
    fetchPolicy: 'cache-first' 
  });

  console.log('fragmentPokemon', fragmentPokemon)

  const { 
    data: {
      pokemon: nonFragmentPokemon
    } = { pokemon: null }
  } = useQuery(NON_FRAGMENT_POKEMON_QUERY, { 
    variables: { id: "UG9rZW1vbjowMDk=" }, 
    fetchPolicy: 'cache-first' 
  });

  console.log('nonFragmentPokemon', nonFragmentPokemon)
  
  // cache-and-network list query to fetch all pokemons
  const { 
    data: {
      pokemons
    } = { pokemons: [] }, 
    loading, 
  } = useQuery(POKEMONS_QUERY, { 
    fetchPolicy: 'cache-and-network' 
  });

  return (
    <div className="App">
      <h4>
        When using a read query type policy function, AND
        <br /><br />
        - using a fragment based query, cache misses return an empty object for the result.
        <br />
        - but, using a query without the fragment, cache misses return null.
        <br /><br />
        Open the console to see the difference in behavior.
      </h4>

      {/* NOTE we have to check the fragmentPokemen object is not empty otherwise we would get an exception */}
      <p>my favorite FRAGMENT pokemon is: <b>{Object.keys(fragmentPokemon).length > 0 ? fragmentPokemon.name.toUpperCase() : 'empty object'}</b></p>
      
      <p>my favorite NON FRAGMENT pokemon is: <b>{nonFragmentPokemon ? nonFragmentPokemon.name.toUpperCase() : 'null'}</b></p>

      { loading && <span>LOADING POKEMONS</span> }
      { !loading && <span>ALL POKEMONS</span> }
      { pokemons.map(pokemon => <p key={pokemon.id}>{pokemon.name}</p>) }


    </div>
  );
}
