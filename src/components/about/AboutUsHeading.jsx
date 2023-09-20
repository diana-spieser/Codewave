import { Box, Heading } from "@chakra-ui/react";
import PropTypes from 'prop-types';
export const AboutUs = (props) => {
  const { children } = props;
  return <Box>{children}</Box>;
};

AboutUs.propTypes = {
  children: PropTypes.node.isRequired,
};

export const AboutUsHeading = (props) => {
  const { children } = props;

  return (
    <Heading as={'h3'} fontSize={'xl'}>
      {children}
    </Heading>
  );
};

AboutUsHeading.propTypes = {
  children: PropTypes.node.isRequired,
};
