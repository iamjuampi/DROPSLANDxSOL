import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import {
  createSignerFromKeypair,
  keypairIdentity,
  generateSigner,
  percentAmount,
  some,
} from "@metaplex-foundation/umi";
import { createFungible } from "@metaplex-foundation/mpl-token-metadata";
import fs from "fs";

const umi = createUmi("https://api.devnet.solana.com").use(mplTokenMetadata());

// Load the Solana CLI keypair
const secret = JSON.parse(
  fs.readFileSync(`${process.env.HOME}/.config/solana/id.json`, "utf8"),
);
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secret));

// Attach the signer identity
umi.use(keypairIdentity(createSignerFromKeypair(umi, keypair)));

// === Token Metadata List ===
const tokens = [
  {
    name: "DJ Khaled",
    symbol: "Khaled",
    uri: "https://dropsland.com/djkhaled.json",
    sellerFee: 5.5,
    decimals: 7,
  },
  {
    name: "DJ Tiësto",
    symbol: "Tiesto",
    uri: "https://dropsland.com/djtiesto.json",
    sellerFee: 4,
    decimals: 6,
  },
  {
    name: "DJ Calvin Harris",
    symbol: "Calvin",
    uri: "https://dropsland.com/djcalvinharris.json",
    sellerFee: 3,
    decimals: 6,
  },
];

// === Registry File Setup ===
const registryPath = "./registry.json";
let registry: any[] = [];
if (fs.existsSync(registryPath)) {
  registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
}

async function createTokens() {
  for (const token of tokens) {
    console.log(`\n🚀 Creating token: ${token.name} (${token.symbol})`);

    const mint = generateSigner(umi);

    await createFungible(umi, {
      mint,
      name: token.name,
      symbol: token.symbol,
      uri: token.uri,
      sellerFeeBasisPoints: percentAmount(token.sellerFee),
      decimals: some(token.decimals),
    }).sendAndConfirm(umi);

    console.log(`✅ Created ${token.symbol}: ${mint.publicKey.toString()}`);

    registry.push({
      name: token.name,
      symbol: token.symbol,
      mint: mint.publicKey.toString(),
      uri: token.uri,
      decimals: token.decimals,
      createdAt: new Date().toISOString(),
    });
  }

  // === Save registry ===
  fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2));
  console.log(`\n📘 Registry updated at ${registryPath}`);
}

createTokens().catch(console.error);
