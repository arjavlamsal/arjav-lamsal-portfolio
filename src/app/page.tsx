import { StarsBackground } from '@/components/animate-ui/stars-background';
import Dock from '@/components/Dock';
import Menu from '@/components/Menu';

const page = () => {
  return (
    <>
      <StarsBackground className="absolute inset-0 flex items-center justify-center" />
      <Menu />
      <Dock />
    </>
  )
}

export default page