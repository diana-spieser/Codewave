import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  styles: {
    global: ({ colorMode }) => ({
      body: {
        bg: colorMode === 'dark' ? 'gray.900' : '#fffffe',
        color: colorMode === 'dark' ? '#fffffe' : 'black',
        fontFamily: 'sans-serif',
      },

      a: {
        textDecoration: 'none',
        _hover: {
          textDecoration: 'none',
        },
      },
    }),
  },
  colors: {
    brand: {
      900: '#1a365d',
      800: '#153e75',
      700: '#2a69ac',
    },
    // Customize other colors for your dark theme here
    // For example:
    black: '#000000',
    blue: '#0F6292',
    green: '#16FF00',
    yellow: '#FFED00',
  },
  components: {
    MenuItem: {
      baseStyle: {
        textDecoration: 'none', // Remove underline
        _hover: {
          textDecoration: 'none', // Remove underline on hover
        },
        color: 'yellow',
      },
    },
    MenuList: {
      baseStyle: ({ colorMode }) => ({
        bg: colorMode === 'dark' ? 'gray.900' : 'white',
        color: colorMode === 'dark' ? 'white' : 'black',
        fontFamily: 'sans-serif',
      }),
    },
  },
});

export default theme;
