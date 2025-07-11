const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add custom resolver for better web compatibility
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Platform-specific file extensions
config.resolver.sourceExts = [...config.resolver.sourceExts, 'web.tsx', 'web.ts', 'web.jsx', 'web.js'];

// Ensure proper asset resolution
config.resolver.assetExts.push('png', 'jpg', 'jpeg', 'gif', 'svg');

// Web-specific module resolution to avoid native module issues
config.resolver.resolverMainFields = ['browser', 'main'];

// Add aliases for web platform to avoid native module imports
config.resolver.alias = {
  ...config.resolver.alias,
  // Alias react-native-maps to a web-compatible version on web platform
  'react-native-maps': require.resolve('./components/MapView.web.tsx'),
};

// Add resolver for platform-specific modules
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Handle react-native-maps specifically for web
  if (platform === 'web' && moduleName === 'react-native-maps') {
    return {
      filePath: require.resolve('./components/MapView.web.tsx'),
      type: 'sourceFile',
    };
  }
  
  // Let Metro handle other modules normally
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
