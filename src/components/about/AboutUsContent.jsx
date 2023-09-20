import {  Stack } from "@chakra-ui/react";
import PropTypes from 'prop-types';
function AboutUsContent (props) {
  const { children } = props;

  return (
    <Stack
      bg={'blue'}
      boxShadow={'lg'}
      p={8}
      rounded={'xl'}
      align={'center'}
      pos={'relative'}
      _after={{
        content: `""`,
        w: 0,
        h: 0,
        borderLeft: 'solid transparent',
        borderLeftWidth: 16,
        borderRight: 'solid transparent',
        borderRightWidth: 16,
        borderTop: 'solid',
        borderTopWidth: 16,
        borderTopColor: 'blue',
        pos: 'absolute',
        bottom: '-16px',
        left: '50%',
        transform: 'translateX(-50%)',
      }}
    >
      {children}
    </Stack>
  );
}

AboutUsContent.propTypes = {
  children: PropTypes.node.isRequired,
};
export default AboutUsContent;
