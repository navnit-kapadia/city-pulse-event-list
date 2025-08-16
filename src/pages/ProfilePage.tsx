
import { Heading, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import type { FC } from 'react';

import Layout from '@/components/common/Layout';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import UserProfile from '@/components/profile/UserProfile';

const ProfilePage: FC = () => {
  const { t } = useTranslation();
  
  return (
    <Layout>
      <ProtectedRoute>
        <VStack spacing={6} align="stretch">
          <Heading size="xl">{t('profile.title')}</Heading>
          <UserProfile />
        </VStack>
      </ProtectedRoute>
    </Layout>
  );
};

export default ProfilePage;
