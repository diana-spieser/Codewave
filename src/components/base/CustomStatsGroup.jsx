import { useState, useEffect } from 'react';
import {
  StatGroup,
  Stat,
  StatLabel,
  StatNumber,
  Avatar,
  AvatarGroup,
  StatHelpText,
} from '@chakra-ui/react';

import PropTypes from 'prop-types';

function CustomStatGroup({ numberOfPosts, activeUsers, avatarSrc }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const avatars = Array.from({ length: activeUsers }, (_, index) => (
    <Avatar
      key={index}
      src={avatarSrc[index % avatarSrc.length]}
      name={`User ${index + 1}`}
    />
  ));
  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <StatGroup
      maxH={'150px'}
      p={6}
      bg={'rgba(23, 25, 34, 0.8)'}
      color={'white'}
    >
      <Stat style={{ marginRight: '20px' }}>
        <StatLabel>Total Posts</StatLabel>
        <StatNumber textAlign={'center'}>{numberOfPosts}</StatNumber>
        <StatHelpText textAlign={'center'}>{formattedTime}</StatHelpText>
      </Stat>
      <Stat>
        <StatLabel>Active Users</StatLabel>
        <StatNumber textAlign={'center'}>{activeUsers}</StatNumber>
        <AvatarGroup size="sm" max={3}>
          {avatars}
        </AvatarGroup>
      </Stat>
    </StatGroup>
  );
}

CustomStatGroup.propTypes = {
  numberOfPosts: PropTypes.number,
  activeUsers: PropTypes.number,
  avatarSrc: PropTypes.arrayOf(PropTypes.string),
};
export default CustomStatGroup;
