"use client";

/**
 * Componente ejemplo para mintear tickets usando Solana
 * Este componente muestra cómo conectar tu frontend con el programa Solana
 */

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export function TicketMinter() {
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();
  const { toast } = useToast();

  const [ticketData, setTicketData] = useState({
    buyerName: "",
    exhibitionName: "",
    ticketNumber: 1,
  });
  const [minting, setMinting] = useState(false);

  const handleMintTicket = async () => {
    if (!connected || !publicKey) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your Solana wallet first",
        variant: "destructive",
      });
      return;
    }

    setMinting(true);

    try {
      // Aquí llamarías a tu función del programa Solana
      // const tx = await mintTicket(program, publicKey, ticketData)

      // Por ahora, simulamos la transacción
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast({
        title: "Ticket Minted! 🎫",
        description: `Ticket #${ticketData.ticketNumber} for ${ticketData.buyerName}`,
      });

      // Resetear form
      setTicketData({
        buyerName: "",
        exhibitionName: "",
        ticketNumber: ticketData.ticketNumber + 1,
      });
    } catch (error) {
      console.error("Error minting ticket:", error);
      toast({
        title: "Error",
        description: "Failed to mint ticket. Please try again.",
        variant: "destructive",
      });
    } finally {
      setMinting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Mint Exhibition Ticket NFT</CardTitle>
        <CardDescription>
          Create a soulbound ticket on Solana blockchain
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!connected ? (
          <div className="text-center p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              Please connect your Solana wallet to mint tickets
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Buyer Name</label>
              <Input
                placeholder="Adam"
                value={ticketData.buyerName}
                onChange={(e) =>
                  setTicketData({ ...ticketData, buyerName: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Exhibition Name</label>
              <Input
                placeholder="My Exhibition 2025"
                value={ticketData.exhibitionName}
                onChange={(e) =>
                  setTicketData({
                    ...ticketData,
                    exhibitionName: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Ticket Number</label>
              <Input
                type="number"
                value={ticketData.ticketNumber}
                onChange={(e) =>
                  setTicketData({
                    ...ticketData,
                    ticketNumber: parseInt(e.target.value),
                  })
                }
              />
            </div>

            <Button
              onClick={handleMintTicket}
              disabled={
                minting || !ticketData.buyerName || !ticketData.exhibitionName
              }
              className="w-full"
            >
              {minting ? "Minting..." : "Mint Ticket NFT"}
            </Button>

            {publicKey && (
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground">
                  Connected Wallet:
                </p>
                <p className="text-xs font-mono break-all">
                  {publicKey.toBase58()}
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
