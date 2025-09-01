// Import required polyfills first
import 'text-encoding';
import 'react-native-get-random-values';

import { Buffer } from 'buffer';
global.Buffer = Buffer;

import '@ethersproject/shims';

// Then import the expo router
import 'expo-router/entry';