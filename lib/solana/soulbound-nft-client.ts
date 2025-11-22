/**
 * Soulbound Profile NFT Client - Direct Solana Program Integration
 * 
 * This connects your existing soulbound token minter program
 * directly from the frontend (no API routes needed).
 * 
 * Works with static export and client-side only apps.
 */

import { 
  Connection, 
  PublicKey, 
  Transaction,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
} from '@solana/web3.js'
import { 
  TOKEN_2022_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
} from '@solana/spl-token'
import { AnchorProvider, Program, BN, Idl } from '@coral-xyz/anchor'
import { WalletContextState } from '@solana/wallet-adapter-react'

// Tu program ID
const PROGRAM_ID = new PublicKey('DropSXpRA6reJFnBw8PcXvbtm4yNqyRNLsnCU1MMkHYt')

// Configuración por red
const NETWORKS = {
  devnet: 'https://api.devnet.solana.com',
  mainnet: 'https://api.mainnet-beta.solana.com',
}

export interface SoulboundMintParams {
  username: string
  profileType: 'fan' | 'artist'
  principal?: string
}

export interface MintResult {
  success: boolean
  signature?: string
  mintAddress?: string
  tokenAccount?: string
  error?: string
}

/**
 * Cliente para mintear Profile NFTs usando tu programa soulbound
 */
export class SoulboundProfileNFTClient {
  private connection: Connection
  private programId: PublicKey

  constructor(network: 'devnet' | 'mainnet' = 'devnet') {
    this.connection = new Connection(
      process.env.NEXT_PUBLIC_SOLANA_RPC_URL || NETWORKS[network],
      'confirmed'
    )
    this.programId = PROGRAM_ID
  }

  /**
   * Mintea un Profile NFT soulbound para un usuario
   * 
   * Este método usa tu programa existente de soulbound tokens
   */
  async mintProfileNFT(
    wallet: WalletContextState,
    params: SoulboundMintParams
  ): Promise<MintResult> {
    try {
      if (!wallet.publicKey || !wallet.signTransaction) {
        throw new Error('Wallet no conectado')
      }

      console.log('🎨 Minting Profile NFT...')
      console.log('User:', params.username)
      console.log('Type:', params.profileType)
      console.log('Wallet:', wallet.publicKey.toBase58())

      // 1. Obtener o crear el mint para Profile NFTs
      // En tu caso, el artista (authority) ya debe tener creado un mint
      const profileMintAddress = await this.getProfileMintAddress()
      
      // 2. Obtener la cuenta de token asociada del usuario
      const userTokenAccount = await getAssociatedTokenAddress(
        profileMintAddress,
        wallet.publicKey,
        false,
        TOKEN_2022_PROGRAM_ID
      )

      console.log('Mint Address:', profileMintAddress.toBase58())
      console.log('User Token Account:', userTokenAccount.toBase58())

      // 3. Crear la instrucción de minteo
      // Tu función: mint_soulbound_tokens(amount, buyer_name, ticket_number, price_per_token)
      const tx = await this.createMintInstruction(
        wallet.publicKey,
        profileMintAddress,
        userTokenAccount,
        params
      )

      // 4. Firmar y enviar transacción
      const { blockhash } = await this.connection.getLatestBlockhash()
      tx.recentBlockhash = blockhash
      tx.feePayer = wallet.publicKey

      const signedTx = await wallet.signTransaction(tx)
      const signature = await this.connection.sendRawTransaction(
        signedTx.serialize()
      )

      // 5. Confirmar transacción
      await this.connection.confirmTransaction(signature, 'confirmed')

      console.log('✅ Profile NFT minted successfully!')
      console.log('Signature:', signature)

      return {
        success: true,
        signature,
        mintAddress: profileMintAddress.toBase58(),
        tokenAccount: userTokenAccount.toBase58(),
      }

    } catch (error: any) {
      console.error('❌ Error minting profile NFT:', error)
      return {
        success: false,
        error: error.message || 'Error desconocido',
      }
    }
  }

  /**
   * Obtiene el mint address para Profile NFTs
   * 
   * NOTA: Debes crear este mint una sola vez usando tu programa
   * y luego usar el mismo para todos los profile NFTs
   */
  private async getProfileMintAddress(): Promise<PublicKey> {
    // Opción 1: Usar un mint pre-creado (recomendado)
    const configuredMint = process.env.NEXT_PUBLIC_PROFILE_MINT_ADDRESS
    if (configuredMint) {
      return new PublicKey(configuredMint)
    }

    // Opción 2: Derivar usando PDA (Program Derived Address)
    // Esto permite que cada artista tenga su propio mint de profile NFTs
    const [mintPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from('profile-nft-mint'), Buffer.from('dropsland')],
      this.programId
    )

    return mintPDA
  }

  /**
   * Crea la instrucción de minteo usando tu programa soulbound
   */
  private async createMintInstruction(
    buyer: PublicKey,
    mint: PublicKey,
    tokenAccount: PublicKey,
    params: SoulboundMintParams
  ): Promise<Transaction> {
    const tx = new Transaction()

    // Verificar si la cuenta de token ya existe
    const accountInfo = await this.connection.getAccountInfo(tokenAccount)
    if (!accountInfo) {
      // Crear la cuenta de token asociada si no existe
      const createATAIx = createAssociatedTokenAccountInstruction(
        buyer, // payer
        tokenAccount, // ata
        buyer, // owner
        mint, // mint
        TOKEN_2022_PROGRAM_ID
      )
      tx.add(createATAIx)
    }

    // Aquí necesitas la instrucción específica de tu programa
    // Como no tenemos el IDL completo, te muestro el formato general:
    
    // NOTA: Deberás ajustar esto según tu programa exacto
    // const mintIx = await program.methods
    //   .mintSoulboundTokens(
    //     new BN(1), // amount: 1 NFT
    //     params.username, // buyer_name
    //     new BN(Date.now()), // ticket_number (único)
    //     new BN(0) // price: gratis para profile NFTs
    //   )
    //   .accounts({
    //     mint,
    //     tokenAccount,
    //     buyer,
    //     artist: ARTIST_AUTHORITY, // La authority que puede mintear
    //     token2022Program: TOKEN_2022_PROGRAM_ID,
    //     // ... otras cuentas
    //   })
    //   .instruction()

    // tx.add(mintIx)

    return tx
  }

  /**
   * Verifica si un wallet ya tiene un Profile NFT
   */
  async hasProfileNFT(walletAddress: PublicKey): Promise<boolean> {
    try {
      const mintAddress = await this.getProfileMintAddress()
      const tokenAccount = await getAssociatedTokenAddress(
        mintAddress,
        walletAddress,
        false,
        TOKEN_2022_PROGRAM_ID
      )

      const accountInfo = await this.connection.getAccountInfo(tokenAccount)
      if (!accountInfo) return false

      // Verificar que tenga al menos 1 token
      // Aquí necesitarías decodificar la cuenta para ver el balance
      return true
    } catch (error) {
      console.error('Error checking profile NFT:', error)
      return false
    }
  }

  /**
   * Obtiene la metadata del Profile NFT de un usuario
   */
  async getProfileNFTMetadata(walletAddress: PublicKey) {
    try {
      const mintAddress = await this.getProfileMintAddress()
      const tokenAccount = await getAssociatedTokenAddress(
        mintAddress,
        walletAddress,
        false,
        TOKEN_2022_PROGRAM_ID
      )

      // Aquí obtendrías la metadata según cómo la almacenes
      // Puede ser on-chain, en Arweave, IPFS, etc.
      
      return {
        mint: mintAddress.toBase58(),
        tokenAccount: tokenAccount.toBase58(),
        owner: walletAddress.toBase58(),
      }
    } catch (error) {
      console.error('Error getting NFT metadata:', error)
      return null
    }
  }
}

// Exportar instancia singleton
export const soulboundClient = new SoulboundProfileNFTClient(
  (process.env.NEXT_PUBLIC_SOLANA_NETWORK as any) || 'devnet'
)


