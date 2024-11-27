import { useRouter } from 'next/router';

export const useLocation = () => {
  const router = useRouter();
  
  const getLocationFromPath = (path) => {
    if (!path) return { name: 'Bangalore', value: 'bangalore' };
    
    const parts = path.split('/');
    if (parts[1] === 'bangalore') {
      const locationValue = parts[2];
      if (locationValue && !['lab-test', 'center'].includes(locationValue)) {
        const locationName = locationValue
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        return { name: locationName, value: locationValue };
      }
    }
    return { name: 'Bangalore', value: 'bangalore' };
  };

  const currentLocation = getLocationFromPath(router.asPath);
  
  const getLocationAwareContent = (content) => {
    if (!content) return '';
    
    let updatedContent = content;
    
    // Replace {Location} placeholder
    updatedContent = updatedContent.replace(/\{Location\}/g, currentLocation.name);
    
    // If we're on a specific location page (not main Bangalore), replace "Bangalore" with location name
    if (currentLocation.value !== 'bangalore') {
      updatedContent = updatedContent.replace(/Bangalore/g, currentLocation.name);
    }
    
    return updatedContent;
  };

  return {
    currentLocation,
    getLocationAwareContent
  };
};