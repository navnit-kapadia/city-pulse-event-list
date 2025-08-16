import { Box, Input, Button, HStack, VStack, useBreakpointValue } from '@chakra-ui/react';
import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { KeyboardEvent, ChangeEvent } from 'react';

import { useEventStore } from '@/store/eventStore';

interface SearchFormProps {
  onSearch?: () => void;
  initialKeyword?: string;
  initialCity?: string;
}

const SearchForm = memo(({ onSearch, initialKeyword = '', initialCity = '' }: SearchFormProps) => {
  const { t } = useTranslation();
  const { searchEvents, isLoading } = useEventStore();
  const [keyword, setKeyword] = useState(initialKeyword);
  const [city, setCity] = useState(initialCity);

  const handleSearch = async (): Promise<void> => {
    if (keyword.trim() || city.trim()) {
      await searchEvents(keyword.trim(), city.trim());
      onSearch?.();
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleKeywordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setKeyword(e.target.value);
  };

  const handleCityChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setCity(e.target.value);
  };

  const inputSize = useBreakpointValue({ base: 'md', md: 'lg' }) ?? 'md';

  return (
    <Box p={{ base: 4, md: 6 }} bg="white" borderRadius="lg" shadow="sm" data-testid="search-form">
      <VStack spacing={4}>
        <HStack
          spacing={4}
          width="full"
          direction={{ base: 'column', md: 'row' }}
          alignItems={{ base: 'stretch', md: 'center' }}
        >
          <Input
            placeholder={t('search.keywordPlaceholder')}
            value={keyword}
            onChange={handleKeywordChange}
            onKeyPress={handleKeyPress}
            size={inputSize}
            aria-label={t('search.keywordPlaceholder')}
            flex="1"
          />
          <Input
            placeholder={t('search.cityPlaceholder')}
            value={city}
            onChange={handleCityChange}
            onKeyPress={handleKeyPress}
            size={inputSize}
            aria-label={t('search.cityPlaceholder')}
            flex="1"
          />
        </HStack>
        <Button
          colorScheme="primary"
          size={inputSize}
          width={{ base: 'full', md: 'auto' }}
          minW={{ md: '200px' }}
          onClick={handleSearch}
          isLoading={isLoading}
          loadingText={t('common.loading')}
          isDisabled={!keyword.trim() && !city.trim()}
          aria-label={t('search.searchButton')}
        >
          {t('search.searchButton')}
        </Button>
      </VStack>
    </Box>
  );
});

export default SearchForm;
