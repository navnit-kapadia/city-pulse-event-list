import React from 'react';

import Login from '@/components/auth/Login';
import Layout from '@/components/common/Layout';

const LoginPage: React.FC = () => {
  return (
    <Layout>
      <Login />
    </Layout>
  );
};

export default LoginPage;
