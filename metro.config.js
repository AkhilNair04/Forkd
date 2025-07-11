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

module.exports = config;
