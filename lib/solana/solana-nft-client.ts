/**
 * Cliente simplificado para NFTs de Solana
 *
 * Funcionalidades:
 * 1. Profile NFTs (soulbound) - Para usuarios que se registran
 * 2. Music NFTs - Para artistas que suben música
 * 3. Conexión directa con el programa de Solana
 */

import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  Keypair,
  SYSVAR_RENT_PUBKEY,
  AccountMeta,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountInstruction,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createMintToInstruction,
  createInitializeMintInstruction,
  MINT_SIZE,
  getMinimumBalanceForRentExemptMint,
} from "@solana/spl-token";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";

// Program ID de tu programa
export const DROPSLAND_PROGRAM_ID = new PublicKey(
  "DropSXpRA6reJFnBw8PcXvbtm4yNqyRNLsnCU1MMkHYt",
);

// Tipos para el programa
export interface ProfileNFTData {
  username: string;
  profileType: "fan" | "artist";
  principal?: string;
  createdAt: string;
}

export interface MusicNFTData {
  title: string;
  artist: string;
  description: string;
  genre: string;
  duration: number;
  audioUrl: string;
  coverImageUrl: string;
  price: number; // en SOL
}

/**
 * Hook principal para interactuar con NFTs de Solana
 */
export function useSolanaNFTs() {
  const { connection } = useConnection();
  const { publicKey, connected, signTransaction } = useWallet();

  if (!connected || !publicKey || !signTransaction) {
    return {
      connected: false,
      publicKey: null,
      connection,
      signTransaction: null,
    };
  }

  return {
    connected: true,
    publicKey,
    connection,
    signTransaction,
  };
}

/**
 * 1. MINT PROFILE NFT (Soulbound)
 * Crea un NFT de perfil no transferible para nuevos usuarios
 */
export async function mintProfileNFT(
  connection: Connection,
  wallet: PublicKey,
  signTransaction: any,
  profileData: ProfileNFTData,
): Promise<string> {
  try {
    console.log("🎨 Minting Profile NFT...", profileData.username);

    // Crear mint account para el perfil
    const profileMint = Keypair.generate();

    // Crear token account asociado
    const tokenAccount = getAssociatedTokenAddressSync(
      profileMint.publicKey,
      wallet,
      false,
      TOKEN_2022_PROGRAM_ID,
    );

    // Crear transacción
    const transaction = new Transaction();

    // 1. Crear mint account
    const mintRent = await getMinimumBalanceForRentExemptMint(connection);

    const createMintIx = SystemProgram.createAccount({
      fromPubkey: wallet,
      newAccountPubkey: profileMint.publicKey,
      lamports: mintRent,
      space: MINT_SIZE,
      programId: TOKEN_2022_PROGRAM_ID,
    });

    transaction.add(createMintIx);

    // 2. Inicializar mint
    const initMintIx = createInitializeMintInstruction(
      profileMint.publicKey,
      0, // decimals
      wallet, // mint authority
      wallet, // freeze authority
      TOKEN_2022_PROGRAM_ID,
    );

    transaction.add(initMintIx);

    // 3. Crear token account asociado
    const createAtaIx = createAssociatedTokenAccountInstruction(
      wallet,
      tokenAccount,
      wallet,
      profileMint.publicKey,
      TOKEN_2022_PROGRAM_ID,
    );
    transaction.add(createAtaIx);

    // 4. Mintear 1 token (gratis para perfil)
    const mintTokenIx = createMintToInstruction(
      profileMint.publicKey,
      tokenAccount,
      wallet,
      1, // amount
      [],
      TOKEN_2022_PROGRAM_ID,
    );
    transaction.add(mintTokenIx);

    // 5. Llamar al programa para hacer soulbound
    const soulboundIx = new TransactionInstruction({
      keys: [
        { pubkey: profileMint.publicKey, isSigner: false, isWritable: true },
        { pubkey: wallet, isSigner: true, isWritable: false },
        { pubkey: TOKEN_2022_PROGRAM_ID, isSigner: false, isWritable: false },
      ],
      programId: DROPSLAND_PROGRAM_ID,
      data: Buffer.from([1]), // freeze_tokens instruction
    });

    transaction.add(soulboundIx);

    // Enviar transacción
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = wallet;

    const signedTransaction = await signTransaction(transaction);
    const signature = await connection.sendRawTransaction(
      signedTransaction.serialize(),
    );

    console.log("✅ Profile NFT minted!", signature);
    return signature;
  } catch (error) {
    console.error("❌ Error minting profile NFT:", error);
    throw error;
  }
}

/**
 * 2. MINT MUSIC NFT
 * Crea un NFT de música para artistas
 */
export async function mintMusicNFT(
  connection: Connection,
  artistWallet: PublicKey,
  signTransaction: any,
  musicData: MusicNFTData,
): Promise<string> {
  try {
    console.log("🎵 Minting Music NFT...", musicData.title);

    // Crear mint account para la música
    const musicMint = Keypair.generate();

    // Crear token account asociado del artista
    const artistTokenAccount = getAssociatedTokenAddressSync(
      musicMint.publicKey,
      artistWallet,
      false,
      TOKEN_2022_PROGRAM_ID,
    );

    // Crear transacción
    const transaction = new Transaction();

    // 1. Crear mint account
    const mintRent = await getMinimumBalanceForRentExemptMint(connection);

    const createMintIx = SystemProgram.createAccount({
      fromPubkey: artistWallet,
      newAccountPubkey: musicMint.publicKey,
      lamports: mintRent,
      space: MINT_SIZE,
      programId: TOKEN_2022_PROGRAM_ID,
    });

    transaction.add(createMintIx);

    // 2. Inicializar mint
    const initMintIx = createInitializeMintInstruction(
      musicMint.publicKey,
      0, // decimals
      artistWallet, // mint authority
      artistWallet, // freeze authority
      TOKEN_2022_PROGRAM_ID,
    );

    transaction.add(initMintIx);

    // 3. Crear token account del artista
    const createAtaIx = createAssociatedTokenAccountInstruction(
      artistWallet,
      artistTokenAccount,
      artistWallet,
      musicMint.publicKey,
      TOKEN_2022_PROGRAM_ID,
    );
    transaction.add(createAtaIx);

    // 4. Mintear 1 token al artista (gratis para el creador)
    const mintTokenIx = createMintToInstruction(
      musicMint.publicKey,
      artistTokenAccount,
      artistWallet,
      1, // amount
      [],
      TOKEN_2022_PROGRAM_ID,
    );
    transaction.add(mintTokenIx);

    // Enviar transacción
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = artistWallet;

    const signedTransaction = await signTransaction(transaction);
    const signature = await connection.sendRawTransaction(
      signedTransaction.serialize(),
    );

    console.log("✅ Music NFT minted!", signature);
    return signature;
  } catch (error) {
    console.error("❌ Error minting music NFT:", error);
    throw error;
  }
}

/**
 * 3. BUY MUSIC NFT
 * Permite a los fans comprar música NFT
 */
export async function buyMusicNFT(
  connection: Connection,
  buyerWallet: PublicKey,
  signTransaction: any,
  musicMint: PublicKey,
  artistWallet: PublicKey,
  price: number,
): Promise<string> {
  try {
    console.log("💰 Buying Music NFT...", musicMint.toBase58());

    // Crear token account del comprador
    const buyerTokenAccount = getAssociatedTokenAddressSync(
      musicMint,
      buyerWallet,
      false,
      TOKEN_2022_PROGRAM_ID,
    );

    // Crear transacción
    const transaction = new Transaction();

    // 1. Crear token account del comprador si no existe
    const createAtaIx = createAssociatedTokenAccountInstruction(
      buyerWallet,
      buyerTokenAccount,
      buyerWallet,
      musicMint,
      TOKEN_2022_PROGRAM_ID,
    );
    transaction.add(createAtaIx);

    // 2. Transferir SOL al artista
    const transferIx = SystemProgram.transfer({
      fromPubkey: buyerWallet,
      toPubkey: artistWallet,
      lamports: price * LAMPORTS_PER_SOL,
    });
    transaction.add(transferIx);

    // 3. Comprar token (con pago)
    const buyTokenIx = createMintToInstruction(
      musicMint,
      buyerTokenAccount,
      artistWallet, // mint authority
      1, // amount
      [],
      TOKEN_2022_PROGRAM_ID,
    );
    transaction.add(buyTokenIx);

    // 4. Hacer token no transferible (soulbound)
    const freezeIx = new TransactionInstruction({
      keys: [
        { pubkey: musicMint, isSigner: false, isWritable: true },
        { pubkey: artistWallet, isSigner: false, isWritable: false },
        { pubkey: TOKEN_2022_PROGRAM_ID, isSigner: false, isWritable: false },
      ],
      programId: DROPSLAND_PROGRAM_ID,
      data: Buffer.from([1]), // freeze_tokens instruction
    });

    transaction.add(freezeIx);

    // Enviar transacción
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = buyerWallet;

    const signedTransaction = await signTransaction(transaction);
    const signature = await connection.sendRawTransaction(
      signedTransaction.serialize(),
    );

    console.log("✅ Music NFT purchased!", signature);
    return signature;
  } catch (error) {
    console.error("❌ Error buying music NFT:", error);
    throw error;
  }
}

/**
 * 4. GET USER PROFILE NFT
 * Verifica si un usuario tiene un NFT de perfil
 */
export async function getUserProfileNFT(
  connection: Connection,
  userWallet: PublicKey,
): Promise<boolean> {
  try {
    // Buscar todos los token accounts del usuario
    const tokenAccounts = await connection.getTokenAccountsByOwner(userWallet, {
      programId: TOKEN_2022_PROGRAM_ID,
    });

    // Verificar si tiene algún token con amount > 0
    for (const account of tokenAccounts.value) {
      const accountInfo = await connection.getTokenAccountBalance(
        account.pubkey,
      );
      if (accountInfo.value.amount !== "0") {
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error("❌ Error checking profile NFT:", error);
    return false;
  }
}

/**
 * 5. GET USER MUSIC NFTS
 * Obtiene todos los NFTs de música de un usuario
 */
export async function getUserMusicNFTs(
  connection: Connection,
  userWallet: PublicKey,
): Promise<any[]> {
  try {
    const tokenAccounts = await connection.getTokenAccountsByOwner(userWallet, {
      programId: TOKEN_2022_PROGRAM_ID,
    });

    const musicNFTs = [];

    for (const account of tokenAccounts.value) {
      const accountInfo = await connection.getTokenAccountBalance(
        account.pubkey,
      );
      if (accountInfo.value.amount !== "0") {
        // Aquí podrías obtener metadata del NFT
        musicNFTs.push({
          mint: (account.account.data as any).parsed?.info?.mint,
          amount: accountInfo.value.amount,
          account: account.pubkey,
        });
      }
    }

    return musicNFTs;
  } catch (error) {
    console.error("❌ Error getting music NFTs:", error);
    return [];
  }
}

/**
 * Helper: Obtener balance de SOL
 */
export async function getSolBalance(
  connection: Connection,
  publicKey: PublicKey,
): Promise<number> {
  const balance = await connection.getBalance(publicKey);
  return balance / LAMPORTS_PER_SOL;
}
