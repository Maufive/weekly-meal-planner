import React from 'react';
import {
  Flex,
} from '@chakra-ui/react';
import Card from '../../components/Cards/CardWithImage/Card';
import SkeletonCards from '../../components/Cards/CardWithImage/CardSkeleton';
import { Recipe } from '../../types';

interface Props {
  recipes: Recipe[];
  lockedRecipeIds: string[];
  handleClickLockRecipe: (id: string) => void;
  handleFetchNewRecipe: (id: string) => void;
}

const GroceryBagCards: React.FC<Props> = ({
  recipes,
  lockedRecipeIds,
  handleClickLockRecipe,
  handleFetchNewRecipe,
}) => (
  <Flex
    flexWrap={{ base: 'nowrap', lg: 'wrap' }}
    spacing={4}
    minH={{ base: '50vh', md: '60vh', lg: '50vh' }}
    align="stretch"
    paddingBottom={4}
    overflowX="scroll"
    css={{
      scrollSnapType: 'x mandatory',
    }}
  >
    {!recipes && (
    <SkeletonCards />
    )}
    {recipes.length > 0 && recipes.map((recipe) => (
      <Card
        key={recipe.id}
        id={recipe.id}
        title={recipe.title}
        time={recipe.time}
        rating={recipe.rating}
        ratings={recipe.ratings}
        imageSrc={recipe.imageSrc}
        isLocked={lockedRecipeIds?.includes(recipe.id)}
        toggleLockRecipe={handleClickLockRecipe}
        onClickFetchNewRecipe={handleFetchNewRecipe}
      />
    ))}
  </Flex>
);

export default GroceryBagCards;
