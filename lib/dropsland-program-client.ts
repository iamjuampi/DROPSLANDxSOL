/**
 * Cliente para interactuar con el programa DROPSLAND de Solana
 *
 * Funcionalidades:
 * 1. Profile NFTs (soulbound) - Para usuarios que se registran
 * 2. Music NFTs - Para artistas que suben música
 * 3. Rewards System - Sistema de recompensas con tokens
 */

import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  Keypair,
  SYSVAR_RENT_PUBKEY,
} from "@solana/web3.js";
import { AnchorProvider, Program, BN, web3 } from "@coral-xyz/anchor";
import {
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountInstruction,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";

// Program ID de tu programa (actualizado con el correcto)
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

export interface RewardData {
  title: string;
  description: string;
  requiredTokens: number;
  rewardType:
    | "exclusive_content"
    | "meet_greet"
    | "merchandise"
    | "early_access";
}

/**
 * Hook principal para interactuar con el programa DROPSLAND
 */
export function useDropslandProgram() {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  if (!wallet) {
    return null;
  }

  const provider = new AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });

  // Create program instance
  const program = new Program(
    // You'll need to import your IDL here
    {} as any, // Replace with actual IDL
    provider,
  );

  return {
    connection,
    wallet,
    provider,
    programId: DROPSLAND_PROGRAM_ID,
    program,
  };
}

/**
 * 1. MINT PROFILE NFT (Soulbound)
 * Crea un NFT de perfil no transferible para nuevos usuarios
 */
export async function mintProfileNFT(
  program: Program,
  wallet: PublicKey,
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
    const createMintIx = await program.methods
      .createMintAccount(`${profileData.username} Profile`, "PROFILE", 0)
      .accounts({
        mint: profileMint.publicKey,
        artist: wallet,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
      })
      .instruction();

    transaction.add(createMintIx);

    // 2. Crear token account asociado
    const createAtaIx = createAssociatedTokenAccountInstruction(
      wallet,
      tokenAccount,
      wallet,
      profileMint.publicKey,
      TOKEN_2022_PROGRAM_ID,
    );
    transaction.add(createAtaIx);

    // 3. Mintear 1 token (gratis para perfil)
    const mintTokenIx = await program.methods
      .mintSoulboundTokens(
        new BN(1),
        profileData.username,
        new BN(0), // ticket number
        new BN(0), // price (gratis)
      )
      .accounts({
        mint: profileMint.publicKey,
        tokenAccount: tokenAccount,
        buyer: wallet,
        artist: wallet,
        token2022Program: TOKEN_2022_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .instruction();

    transaction.add(mintTokenIx);

    // 4. Hacer tokens no transferibles (soulbound)
    const freezeIx = await program.methods
      .freezeTokens()
      .accounts({
        mint: profileMint.publicKey,
        artist: wallet,
        token2022Program: TOKEN_2022_PROGRAM_ID,
      })
      .instruction();

    transaction.add(freezeIx);

    // Enviar transacción
    const signature = await program.provider?.sendAndConfirm?.(transaction, [
      profileMint,
    ]);
    if (!signature) {
      throw new Error("Failed to send transaction");
    }

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
  program: Program,
  artistWallet: PublicKey,
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
    const createMintIx = await program.methods
      .createMintAccount(musicData.title, "MUSIC", 0)
      .accounts({
        mint: musicMint.publicKey,
        artist: artistWallet,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
      })
      .instruction();

    transaction.add(createMintIx);

    // 2. Crear token account del artista
    const createAtaIx = createAssociatedTokenAccountInstruction(
      artistWallet,
      artistTokenAccount,
      artistWallet,
      musicMint.publicKey,
      TOKEN_2022_PROGRAM_ID,
    );
    transaction.add(createAtaIx);

    // 3. Mintear 1 token al artista (gratis para el creador)
    const mintTokenIx = await program.methods
      .mintSoulboundTokens(
        new BN(1),
        musicData.artist,
        new BN(0),
        new BN(0), // gratis para el artista
      )
      .accounts({
        mint: musicMint.publicKey,
        tokenAccount: artistTokenAccount,
        buyer: artistWallet,
        artist: artistWallet,
        token2022Program: TOKEN_2022_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .instruction();

    transaction.add(mintTokenIx);

    // Enviar transacción
    const signature = await program.provider?.sendAndConfirm?.(transaction, [
      musicMint,
    ]);
    if (!signature) {
      throw new Error("Failed to send transaction");
    }

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
  program: Program,
  buyerWallet: PublicKey,
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

    // 2. Comprar token (con pago)
    const buyTokenIx = await program.methods
      .mintSoulboundTokens(
        new BN(1),
        "Music Buyer",
        new BN(0),
        new BN(price * LAMPORTS_PER_SOL), // precio en lamports
      )
      .accounts({
        mint: musicMint,
        tokenAccount: buyerTokenAccount,
        buyer: buyerWallet,
        artist: artistWallet,
        token2022Program: TOKEN_2022_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .instruction();

    transaction.add(buyTokenIx);

    // 3. Hacer token no transferible (soulbound)
    const freezeIx = await program.methods
      .freezeTokens()
      .accounts({
        mint: musicMint,
        artist: artistWallet,
        token2022Program: TOKEN_2022_PROGRAM_ID,
      })
      .instruction();

    transaction.add(freezeIx);

    // Enviar transacción
    const signature = await program.provider?.sendAndConfirm?.(transaction);
    if (!signature) {
      throw new Error("Failed to send transaction");
    }

    console.log("✅ Music NFT purchased!", signature);
    return signature;
  } catch (error) {
    console.error("❌ Error buying music NFT:", error);
    throw error;
  }
}

/**
 * 4. CREATE REWARD
 * Los artistas pueden crear recompensas para sus fans
 */
export async function createReward(
  program: Program,
  artistWallet: PublicKey,
  rewardData: RewardData,
): Promise<string> {
  try {
    console.log("🎁 Creating reward...", rewardData.title);

    // Generar ID único para la recompensa
    const rewardId = Date.now();

    const createRewardIx = await program.methods
      .addReward(
        new BN(rewardId),
        rewardData.title,
        rewardData.description,
        new BN(rewardData.requiredTokens),
      )
      .accounts({
        reward: web3.PublicKey.findProgramAddressSync(
          [
            Buffer.from("reward"),
            artistWallet.toBuffer(),
            new BN(rewardId).toArrayLike(Buffer, "le", 8),
          ],
          program.programId,
        )[0],
        artist: artistWallet,
        systemProgram: SystemProgram.programId,
      })
      .instruction();

    const transaction = new Transaction().add(createRewardIx);
    const signature = await program.provider?.sendAndConfirm?.(transaction);
    if (!signature) {
      throw new Error("Failed to send transaction");
    }

    console.log("✅ Reward created!", signature);
    return signature;
  } catch (error) {
    console.error("❌ Error creating reward:", error);
    throw error;
  }
}

/**
 * 5. CLAIM REWARD
 * Los fans pueden reclamar recompensas quemando tokens
 */
export async function claimReward(
  program: Program,
  fanWallet: PublicKey,
  artistWallet: PublicKey,
  rewardId: number,
  tokenMint: PublicKey,
): Promise<string> {
  try {
    console.log("🎁 Claiming reward...", rewardId);

    // Obtener token account del fan
    const fanTokenAccount = getAssociatedTokenAddressSync(
      tokenMint,
      fanWallet,
      false,
      TOKEN_2022_PROGRAM_ID,
    );

    const claimRewardIx = await program.methods
      .claimReward(new BN(rewardId))
      .accounts({
        reward: web3.PublicKey.findProgramAddressSync(
          [
            Buffer.from("reward"),
            artistWallet.toBuffer(),
            new BN(rewardId).toArrayLike(Buffer, "le", 8),
          ],
          program.programId,
        )[0],
        tokenAccount: fanTokenAccount,
        buyer: fanWallet,
        artist: artistWallet,
        token2022Program: TOKEN_2022_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .instruction();

    const transaction = new Transaction().add(claimRewardIx);
    const signature = await program.provider?.sendAndConfirm?.(transaction);
    if (!signature) {
      throw new Error("Failed to send transaction");
    }

    console.log("✅ Reward claimed!", signature);
    return signature;
  } catch (error) {
    console.error("❌ Error claiming reward:", error);
    throw error;
  }
}

/**
 * 6. GET USER PROFILE NFT
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
 * 7. GET USER MUSIC NFTS
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
