import PageHeader from '../components/base/PageHeader';
import AboutUsContent from '../components/about/AboutUsContent';
import { AboutUs, AboutUsHeading } from '../components/about/AboutUsHeading';
import { AboutUsAvatar } from '../components/about/AboutUsAvatar';
import { AboutUsText } from '../components/about/AboutUsText';
import AboutSlideContent from '../components/about/AboutSlideContent';
import teamMembers from '../components/about/TeamMembers';
import {
  Box,
  Heading,
  Text,
  Stack,
  Container,
  Center,
  Button,

} from '@chakra-ui/react';


import { useDisclosure } from '@chakra-ui/react';
import IMAGES from '../assets/Images';
export default function About() {
  const { isOpen, onToggle } = useDisclosure();
  const headerText = 'ABOUT CODE WAVE TEAM';
  const accompanyingText = 'We believe in the power of community';

  return (
    <Box bgImg={IMAGES.about}
    bgSize={'cover'}
    >
      <Container maxW={'7xl'} py={16} as={Stack} spacing={12}>
        <Stack spacing={0} align={'center'}>
        <PageHeader headerText={headerText} accompanyingText={accompanyingText}/>
        </Stack>

        <Stack
          direction={{ base: 'column', md: 'row' }}
          spacing={{ base: 10, md: 4, lg: 10 }}
        >
          {teamMembers.map((teamMember, index) => (
            <AboutUs key={index}>
              <AboutUsContent>
                <AboutUsHeading>{teamMember.name}</AboutUsHeading>
                <AboutUsText>{teamMember.text}</AboutUsText>
              </AboutUsContent>
              <AboutUsAvatar
                src={teamMember.imageSrc}
                name={teamMember.name}
                title={teamMember.title}
              />
            </AboutUs>
          ))}
        </Stack>
        <Center mt="4">
          <Button
            onClick={onToggle}
            bg="blue"
            size="lg"
            _hover={{ bg: 'yellow', color: 'black' }}
          >
            Learn More
          </Button>
        </Center>
        <AboutSlideContent isOpen={isOpen} onToggle={onToggle} />
      </Container>
    </Box>
  );
}
