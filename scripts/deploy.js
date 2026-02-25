// Contract deployment script
// Automates Clarity contract deployment to Stacks

import fs from 'fs';
import path from 'path';
import { makeContractDeploy, broadcastTransaction, AnchorMode } from '@stacks/transactions';
import { StacksTestnet } from '@stacks/network';

