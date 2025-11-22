/**
 * Cliente para interactuar con programas de Solana desde el frontend
 *
 * Flujo:
 * 1. Usuario conecta wallet (ya tienes SolanaWalletButton)
 * 2. Frontend llama funciones de este cliente
 * 3. Cliente crea transacciones usando el Program ID
 * 4. Usuario firma con su wallet
 * 5. Transacción se envía a blockchain
 */

import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { AnchorProvider, Program, Idl } from "@coral-xyz/anchor";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";

// El Program ID de tu programa (se genera cuando haces anchor deploy)
export const DROPSLAND_PROGRAM_ID = new PublicKey(
  "2EpreJPoJC6wEHk3hShxffGyPbmEaNLyDMKQmbSsTWXH",
);

/**
 * Hook personalizado para interactuar con tu programa Solana
 */
export function useSolanaProgram() {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  if (!wallet) {
    return null;
  }

  // Crear provider de Anchor
  const provider = new AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });

  return {
    connection,
    wallet,
    provider,
    programId: DROPSLAND_PROGRAM_ID,
  };
}

/**
 * Ejemplo: Función para llamar a initialize de tu programa
 */
export async function initializeProgram(
  program: Program,
  wallet: PublicKey,
): Promise<string> {
  try {
    const tx = await program.methods
      .initialize()
      .accounts({
        // Aquí van las cuentas que necesita tu programa
        user: wallet,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log("Transaction signature:", tx);
    return tx;
  } catch (error) {
    console.error("Error initializing program:", error);
    throw error;
  }
}

/**
 * Ejemplo: Mint de NFT/Ticket
 */
export async function mintTicket(
  program: Program,
  wallet: PublicKey,
  ticketData: {
    name: string;
    buyerName: string;
    exhibitionName: string;
    ticketNumber: number;
  },
): Promise<string> {
  try {
    // Generar PDA (Program Derived Address) para el NFT
    const [ticketPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("ticket"),
        wallet.toBuffer(),
        Buffer.from(ticketData.ticketNumber.toString()),
      ],
      program.programId,
    );

    const tx = await program.methods
      .mintTicket(
        ticketData.name,
        ticketData.buyerName,
        ticketData.exhibitionName,
        ticketData.ticketNumber,
      )
      .accounts({
        ticket: ticketPda,
        buyer: wallet,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log("Ticket minted! Signature:", tx);
    return tx;
  } catch (error) {
    console.error("Error minting ticket:", error);
    throw error;
  }
}

/**
 * Obtener datos de un ticket
 */
export async function getTicketData(program: Program, ticketPda: PublicKey) {
  try {
    // Check if program has the account structure we expect
    if (!program.account || typeof program.account !== "object") {
      throw new Error("Program account structure not available");
    }

    // Use a more generic approach to fetch account data
    const accountInfo =
      await program.provider.connection.getAccountInfo(ticketPda);
    if (!accountInfo) {
      throw new Error("Ticket account not found");
    }

    // Return the raw account data - you may need to deserialize this based on your program's structure
    return {
      account: ticketPda,
      data: accountInfo.data,
      owner: accountInfo.owner,
      lamports: accountInfo.lamports,
    };
  } catch (error) {
    console.error("Error fetching ticket:", error);
    throw error;
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
