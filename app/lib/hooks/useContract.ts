// import { Contract } from 'ethers';
// import { useMemo } from 'react';
// import { CONTRACT_ADDRESSES } from '../../../lib/contracts/contractAddresses';
// import TrexGamePaymentABI from '../../../lib/contracts/abis/TrexGamePayment.json';
// import { useWallet } from './useWallet';

// export function useGameContract() {
//   const { provider } = useWallet();

//   return useMemo(() => {
//     if (!provider) return null;

//     return new Contract(
//       CONTRACT_ADDRESSES.TREX_GAME,
//       TrexGamePaymentABI,
//       provider.getSigner()
//     );
//   }, [provider]);
// }