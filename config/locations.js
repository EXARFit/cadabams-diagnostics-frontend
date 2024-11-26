// config/locations.js
export const BANGALORE_LOCATIONS = [
    { name: 'All Bangalore', value: 'bangalore', path: '/bangalore' },
    { name: 'Indiranagar', value: 'indiranagar', path: '/bangalore/indiranagar' },
    { name: 'Banashankari', value: 'banashankari', path: '/bangalore/banashankari' },
    { name: 'Jayanagar', value: 'jayanagar', path: '/bangalore/jayanagar' },
    { name: 'Kalyan Nagar', value: 'kalyannagar', path: '/bangalore/kalyannagar' },
    { name: 'Kanakapura Road', value: 'kanakapura', path: '/bangalore/kanakapura' }
  ];
  
  export const RADIOLOGY_OPTIONS = [
    { name: 'XRay', path: '/xray-scan' },
    { name: 'MRI', path: '/mri-scan' },
    { name: 'CT Scan', path: '/ct-scan' },
    { name: 'Ultrasound', path: '/ultrasound-scan' },
    { name: 'MSK scans', path: '/msk-scan' },
    { name: 'Pregnancy scans', path: '/pregnancy-scan' }
  ];
  
  export const getLocationFromPath = (path) => {
    if (!path) return BANGALORE_LOCATIONS[0];
    
    const parts = path.split('/');
    if (parts[1] === 'bangalore') {
      // Don't treat service names as locations
      const serviceNames = [
        'center',
        'lab-test',
        ...RADIOLOGY_OPTIONS.map(opt => opt.path.slice(1))
      ];
      
      if (parts.length > 2 && !serviceNames.includes(parts[2])) {
        return (
          BANGALORE_LOCATIONS.find(loc => loc.value === parts[2]) ||
          BANGALORE_LOCATIONS[0]
        );
      }
    }
    return BANGALORE_LOCATIONS[0];
  };
  
  export const getLocationAwarePath = (basePath, currentLocation) => {
    if (!currentLocation || currentLocation.value === 'bangalore') {
      return `/bangalore${basePath}`;
    }
    return `/bangalore/${currentLocation.value}${basePath}`;
  };
  
  export const isServicePath = (path) => {
    if (!path) return false;
    const parts = path.split('/');
    const serviceNames = [
      'center',
      'lab-test',
      ...RADIOLOGY_OPTIONS.map(opt => opt.path.slice(1))
    ];
    return serviceNames.includes(parts[parts.length - 1]);
  };