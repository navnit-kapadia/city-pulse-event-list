import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  HStack,
  Container,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import type { FC } from 'react';

import Layout from '@/components/common/Layout';

const PublicHomePage: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const bgGradient = useColorModeValue(
    'linear(to-br, primary.50, secondary.50)',
    'linear(to-br, primary.900, secondary.900)'
  );

  const handleSignIn = (): void => {
    navigate('/login');
  };

  const handleSignUp = (): void => {
    navigate('/signup');
  };

  return (
    <Layout>
      <Container maxW="container.xl" py={20}>
        <VStack spacing={12} align="center" textAlign="center">
          {/* Hero Section */}
          <Box bgGradient={bgGradient} borderRadius="2xl" p={12} w="full">
            <VStack spacing={6}>
              <Heading
                size="2xl"
                bgGradient="linear(to-r, primary.600, secondary.600)"
                bgClip="text"
              >
                {t('welcome.title')}
              </Heading>
              <Text fontSize="xl" color="gray.600" maxW="2xl">
                {t('welcome.subtitle')}
              </Text>
              <HStack spacing={4} pt={4}>
                <Button
                  leftIcon={<ExternalLinkIcon />}
                  colorScheme="primary"
                  size="lg"
                  variant="outline"
                  onClick={handleSignIn}
                >
                  {t('auth.signIn')}
                </Button>
                <Button variant="outline" colorScheme="primary" size="lg" onClick={handleSignUp}>
                  {t('auth.signUp')}
                </Button>
              </HStack>
            </VStack>
          </Box>

          {/* Features Section */}
          <VStack spacing={6} w="full">
            <Heading size="lg" color="gray.700">
              {t('welcome.featuresTitle')}
            </Heading>
            <Stack direction={{ base: 'column', md: 'row' }} spacing={8} w="full" justify="center">
              <VStack
                bg="white"
                p={6}
                borderRadius="lg"
                shadow="md"
                flex={1}
                textAlign="center"
                minH="200px"
              >
                <Text fontSize="3xl" mb={2}>
                  🎵
                </Text>
                <Heading size="md" mb={3} color="primary.600">
                  {t('welcome.features.discover.title')}
                </Heading>
                <Text color="gray.600" lineHeight="1.6">
                  {t('welcome.features.discover.description')}
                </Text>
              </VStack>

              <VStack
                bg="white"
                p={6}
                borderRadius="lg"
                shadow="md"
                flex={1}
                textAlign="center"
                minH="200px"
              >
                <Text fontSize="3xl" mb={2}>
                  ⭐
                </Text>
                <Heading size="md" mb={3} color="primary.600">
                  {t('welcome.features.favorites.title')}
                </Heading>
                <Text color="gray.600" lineHeight="1.6">
                  {t('welcome.features.favorites.description')}
                </Text>
              </VStack>

              <VStack
                bg="white"
                p={6}
                borderRadius="lg"
                shadow="md"
                flex={1}
                textAlign="center"
                minH="200px"
              >
                <Text fontSize="3xl" mb={2}>
                  📍
                </Text>
                <Heading size="md" mb={3} color="primary.600">
                  {t('welcome.features.location.title')}
                </Heading>
                <Text color="gray.600" lineHeight="1.6">
                  {t('welcome.features.location.description')}
                </Text>
              </VStack>
            </Stack>
          </VStack>

          {/* How it Works Section */}
          <VStack spacing={6} w="full" py={8}>
            <Heading size="lg" color="gray.700">
              {t('welcome.howItWorks.title')}
            </Heading>
            <Stack
              direction={{ base: 'column', md: 'row' }}
              spacing={8}
              w="full"
              justify="center"
              align="start"
            >
              <VStack textAlign="center" flex={1}>
                <Box
                  bg="primary.100"
                  borderRadius="full"
                  w="60px"
                  h="60px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  mb={4}
                >
                  <Text fontSize="24px" fontWeight="bold" color="primary.600">
                    1
                  </Text>
                </Box>
                <Heading size="sm" mb={2} color="primary.600">
                  {t('welcome.howItWorks.step1.title')}
                </Heading>
                <Text color="gray.600" fontSize="sm">
                  {t('welcome.howItWorks.step1.description')}
                </Text>
              </VStack>

              <VStack textAlign="center" flex={1}>
                <Box
                  bg="primary.100"
                  borderRadius="full"
                  w="60px"
                  h="60px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  mb={4}
                >
                  <Text fontSize="24px" fontWeight="bold" color="primary.600">
                    2
                  </Text>
                </Box>
                <Heading size="sm" mb={2} color="primary.600">
                  {t('welcome.howItWorks.step2.title')}
                </Heading>
                <Text color="gray.600" fontSize="sm">
                  {t('welcome.howItWorks.step2.description')}
                </Text>
              </VStack>

              <VStack textAlign="center" flex={1}>
                <Box
                  bg="primary.100"
                  borderRadius="full"
                  w="60px"
                  h="60px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  mb={4}
                >
                  <Text fontSize="24px" fontWeight="bold" color="primary.600">
                    3
                  </Text>
                </Box>
                <Heading size="sm" mb={2} color="primary.600">
                  {t('welcome.howItWorks.step3.title')}
                </Heading>
                <Text color="gray.600" fontSize="sm">
                  {t('welcome.howItWorks.step3.description')}
                </Text>
              </VStack>
            </Stack>
          </VStack>

          {/* Call to Action */}
          <Box
            bg="white"
            p={8}
            borderRadius="xl"
            shadow="lg"
            textAlign="center"
            w="full"
            maxW="2xl"
          >
            <Heading size="md" mb={4} color="gray.700">
              {t('welcome.cta.title')}
            </Heading>
            <Text fontSize="lg" color="gray.600" mb={6}>
              {t('welcome.cta.description')}
            </Text>
            <HStack spacing={4} justify="center">
              <Button
                colorScheme="primary"
                size="lg"
                onClick={() => navigate('/login')}
                leftIcon={<ExternalLinkIcon />}
              >
                {t('welcome.cta.getStarted')}
              </Button>
              <Button
                variant="outline"
                colorScheme="primary"
                size="lg"
                onClick={() => navigate('/signup')}
              >
                {t('welcome.cta.createAccount')}
              </Button>
            </HStack>
          </Box>
        </VStack>
      </Container>
    </Layout>
  );
};

export default PublicHomePage;
