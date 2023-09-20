import PropTypes from 'prop-types';
import { HStack, Tag } from '@chakra-ui/react';
import { useRadio, useRadioGroup, Box } from '@chakra-ui/react';
import { FiTrendingUp, FiActivity} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';


export const PostTags = (props) => {
  const { marginTop = 0, tags } = props;

  return (
    <HStack spacing={2} marginTop={marginTop}>
      {tags.map((tag) => {
        return (
          <Tag size={'md'} variant="solid" bg="blue" key={tag}>
            {tag}
          </Tag>
        );
      })}
    </HStack>
  );
};

PostTags.propTypes = {
  marginTop: PropTypes.number,
  tags: PropTypes.array,
};

export function RadioCard({ children, icon, ...props }) {
  const { getInputProps, getRadioProps } = useRadio(props);
  const input = getInputProps();
  const radio = getRadioProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...radio}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        _checked={{
          bg: 'blue',
          color: 'white',
          borderColor: 'blue',
        }}
        _focus={{
          boxShadow: 'outline',
        }}
        px={5}
        py={3}
        display={'flex'}
      >
        {icon && <Box mr={2}>{icon}</Box>}
        {children}
      </Box>
    </Box>
  );
}
RadioCard.propTypes = {
  children: PropTypes.node,
  icon: PropTypes.node,
};

export function PostFilter({ onChange, options, selectedCategory }) {
const navigate = useNavigate();
const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'category',
    defaultValue: selectedCategory,
    onChange: (value) => {
      onChange(value);

      if (value === 'Top Trending' || value === 'Most Recent') {
        navigate('/'); // Navigate to the home page for Top Trending or Most Recent
      } else {
       navigate(`/codewave-posts/${value.toLowerCase()}`); // Navigate to the specific category URL
      }
    },
  });

  const group = getRootProps();

  return (
    <HStack mb={4} {...group}>
      {options.map((value) => {
        const radio = getRadioProps({ value });
        let icon = null;
        if (value === 'Top Trending') {
          icon = <FiTrendingUp />;
        } else if (value === 'Most Recent') {
          icon = <FiActivity />;
        }

        return (
          <RadioCard key={value} icon={icon} {...radio}>
            {value}
          </RadioCard>
        );
      })}
    </HStack>
  );
}
PostFilter.propTypes = {
  onChange: PropTypes.func,
  options: PropTypes.array,
  selectedCategory: PropTypes.string,
};
