// Contract deployment script
// Automates Clarity contract deployment to Stacks

import fs from 'fs';
import path from 'path';
import { makeContractDeploy, broadcastTransaction, AnchorMode } from '@stacks/transactions';
import { StacksTestnet } from '@stacks/network';

const CONTRACTS = [
  { name: 'tipjar', file: 'contracts/tipjar.clar' },
  { name: 'tip-token', file: 'contracts/tip-token.clar' },
  { name: 'tip-registry', file: 'contracts/tip-registry.clar' },
  { name: 'tip-rewards', file: 'contracts/tip-rewards.clar' },
  { name: 'tip-governance', file: 'contracts/tip-governance.clar' },
];

const network = new StacksTestnet();
const DEPLOYER_KEY = process.env.DEPLOYER_PRIVATE_KEY || '';

async function deployContract(contractName, contractFile) {
  const codeBody = fs.readFileSync(path.resolve(contractFile), 'utf-8');
  console.log(`Deploying ${contractName}...`);

  const tx = await makeContractDeploy({
    contractName,
    codeBody,
    senderKey: DEPLOYER_KEY,
    network,
    anchorMode: AnchorMode.Any,
    fee: 10000n,
  });

  const result = await broadcastTransaction(tx, network);
  console.log(`${contractName} deployed: ${result.txid}`);
  return result;
}

async function deployAll() {
  console.log('Starting deployment pipeline...');
  const results = [];

  for (const contract of CONTRACTS) {
    try {
      const result = await deployContract(contract.name, contract.file);
      results.push({ ...contract, txid: result.txid, status: 'success' });
    } catch (err) {
      console.error(`Failed to deploy ${contract.name}:`, err.message);
      results.push({ ...contract, status: 'failed', error: err.message });
    }
  }

  console.log('\nDeployment Summary:');
  results.forEach(r => console.log(`  ${r.name}: ${r.status}${r.txid ? ' (' + r.txid + ')' : ''}`));
}

deployAll();
