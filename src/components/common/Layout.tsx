import { Box, Container, type BoxProps, type ContainerProps } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import Header from './Header';

import type { FC, ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

type Direction = 'rtl' | 'ltr';
type Language = 'ar' | 'en';

interface LayoutStyle extends Pick<BoxProps, 'minH' | 'bg' | 'dir' | 'fontFamily'> {}

interface ContainerStyle extends Pick<ContainerProps, 'maxW' | 'py'> {}

const Layout: FC<LayoutProps> = ({ children }) => {
  const { i18n } = useTranslation();

  const currentLanguage = i18n.language as Language;

  const layoutConfig = useMemo(() => {
    const isRTL = currentLanguage === 'ar';

    return {
      direction: (isRTL ? 'rtl' : 'ltr') as Direction,
      fontFamily: isRTL ? 'Arabic' : 'inherit',
      isRTL,
    };
  }, [currentLanguage]);

  const containerStyle = useMemo<LayoutStyle>(
    () => ({
      minH: '100vh',
      bg: 'gray.50',
      dir: layoutConfig.direction,
      fontFamily: layoutConfig.fontFamily,
    }),
    [layoutConfig.direction, layoutConfig.fontFamily]
  );

  const containerProps = useMemo<ContainerStyle>(
    () => ({
      maxW: 'container.xl',
      py: 6,
    }),
    []
  );

  return (
    <Box {...containerStyle}>
      <Header />
      <Container {...containerProps}>{children}</Container>
    </Box>
  );
};

export default Layout;
