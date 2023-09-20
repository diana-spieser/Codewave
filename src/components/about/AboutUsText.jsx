
import { Text } from "@chakra-ui/react";
import PropTypes from 'prop-types';
export const AboutUsText = (props) => {
  const { children } = props;

  return (
    <Text
      textAlign={'center'}

      fontSize={'sm'}
    >
      {children}
    </Text>
  );
};
  AboutUsText.propTypes = {
    children: PropTypes.node.isRequired,
  };
