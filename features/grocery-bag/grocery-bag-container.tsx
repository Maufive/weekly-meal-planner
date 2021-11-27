/* eslint-disable react/no-array-index-key */
import React, {
  useCallback, useState, useEffect, useMemo,
} from 'react';
import {
  Heading, Stack, Box, Icon, Button, useDisclosure,
} from '@chakra-ui/react';
import { FilterIcon } from '@heroicons/react/solid';
import { useAppSelector, useAppDispatch } from '../../state/redux-hooks';
import {
  selectRecipesLoading,
  selectRecipes,
  fetchInitialRecipes,
  fetchSingleRecipe,
  fetchManyRecipes,
  selectFilters,
  setFilters,
} from './grocery-bag-duck';
import GroceryBagModal from './grocery-bag-filters-modal';
import RecipeDetailsModal from '../../components/modal/recipe-details-modal';
import CreateList from '../shopping-list/create-shopping-list';
import { Session } from '../../types';
import GroceryBagCards from './grocery-bag-cards';

interface GroceryBagContainerProps {
  session: Session | null;
}

const GroceryBag: React.FC<GroceryBagContainerProps> = ({ session }) => {
  const dispatch = useAppDispatch();
  const isRecipesLoading = useAppSelector(selectRecipesLoading);
  const filters = useAppSelector(selectFilters);
  const recipes = useAppSelector(selectRecipes);
  const [lockedRecipesIds, setLockedRecipeIds] = useState<string[]>([]);
  const [recipeDetails, setRecipeDetails] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenRecipeDetails,
    onOpen: onOpenRecipeDetails,
    onClose: onCloseRecipeDetails,
  } = useDisclosure();

  const onClickFetchManyRecipes = useCallback(() => {
    const idsToReplace = recipes
      .filter((recipe) => lockedRecipesIds.indexOf(recipe.id) === -1)
      .map((recipe) => recipe.id);

    dispatch(fetchManyRecipes({
      ...filters,
      recipeCount: filters.recipeCount - lockedRecipesIds.length,
      // Make sure we dont get duplicates by sending all currently visible recipe ids
      ids: recipes.map((recipe) => recipe.id),
      // Array of IDs that are NOT currently locked
      idsToReplace,
    }));
  }, [dispatch, recipes, lockedRecipesIds, filters]);

  const onClickSaveFilters = useCallback((savedFilters) => {
    dispatch(setFilters(savedFilters));
    onClose();
  }, [dispatch]);

  const handleFetchNewRecipe = useCallback((id: string) => {
    dispatch(fetchSingleRecipe({
      ids: recipes.map((recipe) => recipe.id),
      idToReplace: id,
      ...filters,
    }));
  }, [dispatch, recipes, filters]);

  const handleClickLockRecipe = useCallback((id: string) => {
    if (lockedRecipesIds.includes(id)) {
      return setLockedRecipeIds((prev) => prev.filter((i) => i !== id));
    }

    setLockedRecipeIds((prev) => [...prev, id]);
  }, [lockedRecipesIds]);

  const handleClickRecipe = useCallback((id: string) => {
    const details = recipes.find((recipe) => recipe.id === id);
    setRecipeDetails(details);
    onOpenRecipeDetails();
  }, [recipes]);

  const onCloseRecipeDetailsCb = useCallback(() => {
    setRecipeDetails(null);
    onCloseRecipeDetails();
  }, []);

  const isCreateListAllowed = useMemo(() => {
    const isAllRecipesLocked = lockedRecipesIds.length === filters.recipeCount;
    const isUserLoggedIn = !!session?.user;
    return isAllRecipesLocked && isUserLoggedIn;
  }, [session, lockedRecipesIds, filters.recipeCount]);

  useEffect(() => {
    dispatch(fetchInitialRecipes());
  }, [dispatch]);

  if (isRecipesLoading === 'failed') return <p>something went wrong :(</p>;

  return (
    <Stack w="100%" pos="relative">
      <Box direction="column" mb={6}>
        <Heading mb={4} fontSize={{ base: '2xl', md: '3xl' }}>Skapa din Matkasse</Heading>
        <Button aria-label="Filter" leftIcon={<Icon as={FilterIcon} />} variant="solid" onClick={() => onOpen()}>
          Filter
        </Button>
        <GroceryBagModal isOpen={isOpen} onClickSaveFilters={onClickSaveFilters} />
        <RecipeDetailsModal
          isOpen={isOpenRecipeDetails}
          onClose={onCloseRecipeDetailsCb}
          details={recipeDetails}
        />
      </Box>
      <Button onClick={onClickFetchManyRecipes}>Try me</Button>
      <GroceryBagCards
        recipes={recipes}
        lockedRecipesIds={lockedRecipesIds}
        handleClickLockRecipe={handleClickLockRecipe}
        handleFetchNewRecipe={handleFetchNewRecipe}
        handleClickRecipe={handleClickRecipe}
      />
      <CreateList
        isCreateListAllowed={isCreateListAllowed}
        recipeCount={filters.recipeCount}
        lockedRecipeIdsCount={lockedRecipesIds.length}
        recipes={recipes}
      />
    </Stack>
  );
};

export default GroceryBag;
