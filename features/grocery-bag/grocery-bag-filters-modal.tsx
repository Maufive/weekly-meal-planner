/* eslint-disable react/jsx-props-no-spreading */
import React, { useCallback, useState } from 'react';
import {
  Button,
  Modal as ChakraModal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Box,
  Heading,
  Text,
  Flex,
  useColorModeValue,
  Tag,
  TagLeftIcon,
  TagLabel,
  Select,
  Icon,
} from '@chakra-ui/react';
import { PlusIcon, MinusIcon, SaveIcon } from '@heroicons/react/solid';
import { POPULAR_CATEGORIES } from '../../constants';
import { Filters } from '../../types';

interface ModalProps {
  isOpen: boolean;
  onClickSaveFilters: ({
    categories,
    time,
  }) => void;
  filters: Filters;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClickSaveFilters,
  filters,
}) => {
  const [categories, setSelectedCatergories] = useState<string[]>([]);
  const [time, setTime] = useState<string>(filters.time);

  const handleChangeTimeRequired = useCallback((event: React.FormEvent<HTMLSelectElement>) => {
    setTime(event.currentTarget.value);
  }, []);

  const handleClickTag = useCallback((tag: string) => {
    const isActive = categories?.includes(tag);

    if (isActive) {
      const newArr = categories.filter((t) => t !== tag);
      return setSelectedCatergories(newArr);
    }

    setSelectedCatergories((prev) => [...prev, tag]);
  }, [categories]);

  const onClickSave = useCallback(() => {
    onClickSaveFilters({ time, categories });
  }, [onClickSaveFilters, time, categories]);

  return (
    <ChakraModal
      isCentered
      onClose={onClickSave}
      isOpen={isOpen}
      motionPreset="slideInBottom"
      size="lg"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading as="h2" size="md" color={useColorModeValue('gray.700', 'gray.400')}>
            Filter
          </Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex direction="column">
            <Box mb={6}>
              <Heading as="h2" size="md" mb={2}>
                Populära filter
              </Heading>
              <Text color={useColorModeValue('gray.700', 'gray.400')}>Här kan du sätta några filter för att bättre anpassa dina förslag på olika recept</Text>
            </Box>
            <Flex w="100%" justify="space-between" align="center" mb={10}>
              <Text fontWeight="700">Tillagningstid</Text>
              <Select placeholder="Välj tillagningstid" w="12rem" onChange={handleChangeTimeRequired} value={time || ''}>
                <option value="Under 30 min">Under 30 min</option>
                <option value="Under 45 min">Under 45 min</option>
                <option value="Under 60 min">Under 60 min</option>
                <option value="Över 60 min">Över 60 min</option>
              </Select>
            </Flex>
            <Flex direction="column" w="100%">
              <Text fontWeight="700" mb={4}>Kategorier</Text>
              <Flex w="100%" wrap="wrap">
                {POPULAR_CATEGORIES.map((category) => {
                  const isActive = categories?.includes(category);
                  return (
                    <Tag
                      as={Button}
                      onClick={() => handleClickTag(category)}
                      size="lg"
                      variant={isActive ? 'solid' : 'ghost'}
                      colorScheme="green"
                      borderRadius="full"
                      key={category}
                      mb={4}
                      mr={2}
                      _hover={{
                        bg: 'green.500',
                        color: 'white',
                      }}
                    >
                      <TagLeftIcon boxSize="12px" as={isActive ? MinusIcon : PlusIcon} />
                      <TagLabel>{category}</TagLabel>
                    </Tag>
                  );
                })}
              </Flex>
            </Flex>
          </Flex>
        </ModalBody>
        <ModalFooter justifyContent="center">
          <Button
            w="100%"
            colorScheme="green"
            variant="solid"
            leftIcon={<Icon as={SaveIcon} />}
            mr={3}
            onClick={onClickSave}
          >
            Spara
          </Button>
        </ModalFooter>
      </ModalContent>
    </ChakraModal>
  );
};

export default Modal;
