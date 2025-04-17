"use client";
import { useEffect, useState } from 'react';
import { StarsBackground } from '@/components/animate-ui/stars-background';
import Dock from '@/components/Dock';
import LoadingScreen from '@/components/LoadingScreen';
import Menu from '@/components/Menu';

const Page = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 3 seconds delay

    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, []);

  if (isLoading) {
    return <LoadingScreen />; // Show only the loading screen while loading
  }

  return (
    <>
      <Menu />
      <Dock />
    </>
  );
};

export default Page;