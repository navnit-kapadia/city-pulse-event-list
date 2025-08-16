
import { VStack, Spinner, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import type { FC } from 'react';

type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface LoadingSpinnerProps {
  message?: string;
  size?: SpinnerSize;
}

const LoadingSpinner: FC<LoadingSpinnerProps> = ({ message, size = 'xl' }) => {
  const { t } = useTranslation();

  return (
    <VStack spacing={4} py={8}>
      <Spinner size={size} color="primary.500" thickness="4px" speed="0.65s" />
      <Text color="gray.600" fontSize="md">
        {message || t('common.loading')}
      </Text>
    </VStack>
  );
};

export default LoadingSpinner;
