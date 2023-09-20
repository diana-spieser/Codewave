
import SidebarContent from "./SideBarContent";
import MobileNav from "./MobileNav";
import { useDisclosure } from '@chakra-ui/react';
import { Drawer, DrawerContent } from '@chakra-ui/react';


const SidebarWithHeader = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
<>
      <SidebarContent onClose={() => onClose} display={{ base: 'none', md: 'block' }} />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full">
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />
</>

  )
}


export default SidebarWithHeader;
