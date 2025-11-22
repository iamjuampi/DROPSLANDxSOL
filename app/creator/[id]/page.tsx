import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Banknote,
  Share2,
  Star,
  Users,
  Heart,
  MessageCircle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DonateForm from "@/components/wallet/donate-form";
import { artists } from "@/data";
import { Artist } from "@/types";
import { NotFoundError } from "@/components/profile/artist-not-found-error";

export async function generateStaticParams() {
  return [
    { id: "iamjuampi" },
    { id: "banger" },
    { id: "nicolamarti" },
    { id: "axs" },
  ];
}

export default function CreatorPage({ params }: { params: { id: string } }) {
  const artist = artists.find((artist) => artist.id === params.id);
  if (!artist) {
    return <NotFoundError />;
  }

  return (
    <div className="min-h-screen bg-background">
      <BannerSection artist={artist} />

      <div className="container px-4 md:px-6">
        <ArtistProfileInfo artist={artist} />
        <div className="grid gap-6 md:grid-cols-3 lg:gap-8 py-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{artist.description}</p>
              </CardContent>
            </Card>

            <PostsTabs artist={artist} />
          </div>

          <div>
            <DonateForm creatorId={artist.id} creatorName={artist.name} />
          </div>
        </div>
      </div>
    </div>
  );
}

function PostsTabs({ artist }: { artist: Artist }) {
  return (
    <Tabs defaultValue="posts">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="posts">Recent Posts</TabsTrigger>
        <TabsTrigger value="rewards">Rewards</TabsTrigger>
      </TabsList>
      <TabsContent value="posts" className="mt-4 space-y-4">
        {artist.posts.map((post, index) => (
          <Card key={index}>
            <CardHeader className="p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={artist.avatar} alt={artist.name} />
                  <AvatarFallback>{artist.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{artist.name}</p>
                  <p className="text-sm text-muted-foreground">{post.time}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-sm mb-3">{post.content}</p>
              {post.image && (
                <div className="mb-3 rounded-lg overflow-hidden">
                  <Image
                    src={post.image}
                    alt="Post image"
                    width={400}
                    height={200}
                    className="w-full h-auto"
                  />
                </div>
              )}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <button className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  {post.likes}
                </button>
                <button className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  {post.comments}
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </TabsContent>
      <TabsContent value="rewards" className="mt-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Basic Support</CardTitle>
                <div className="flex items-center text-primary font-bold">
                  <Banknote className="mr-1 h-4 w-4" />5 $DROPS
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Access to exclusive posts</li>
                <li>Early access to new tracks</li>
              </ul>
              <Button className="mt-4 w-full">Select</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Premium Support</CardTitle>
                <div className="flex items-center text-primary font-bold">
                  <Banknote className="mr-1 h-4 w-4" />
                  20 $DROPS
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>All basic rewards</li>
                <li>Exclusive track downloads</li>
                <li>Name in credits</li>
              </ul>
              <Button className="mt-4 w-full">Select</Button>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
}

function BannerSection({ artist }: { artist: Artist }) {
  return (
    <div className="relative h-48 md:h-64 lg:h-80 w-full">
      <Image
        src={artist.coverImage || "/placeholder.svg?height=300&width=1200"}
        alt={`${artist.name}'s cover image`}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      <Button
        asChild
        variant="outline"
        size="sm"
        className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm"
      >
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Link>
      </Button>
    </div>
  );
}

function ArtistProfileInfo({ artist }: { artist: Artist }) {
  return (
    <div className="relative -mt-20 mb-6 flex flex-col items-center">
      <Avatar className="h-32 w-32">
        <AvatarImage src={artist.avatar} alt={artist.name} />
        <AvatarFallback>{artist.name.substring(0, 2)}</AvatarFallback>
      </Avatar>
      <h1 className="mt-4 text-3xl font-bold">{artist.name}</h1>
      <p className="text-muted-foreground">{artist.handle}</p>
      <div className="mt-2 flex items-center gap-2">
        <Badge variant="outline">{artist.genre}</Badge>
        {artist.featured && (
          <Badge variant="secondary">
            <Star className="mr-1 h-3 w-3" /> Featured Artist
          </Badge>
        )}
      </div>
      <div className="mt-4 flex items-center gap-6 text-sm">
        <div className="flex items-center">
          <Banknote className="mr-1 h-4 w-4 text-primary" />
          <span>{artist.blgReceived.toLocaleString()} $DROPS received</span>
        </div>
        <div className="flex items-center">
          <Users className="mr-1 h-4 w-4" />
          <span>{artist.supporters.toLocaleString()} supporters</span>
        </div>
      </div>
      <div className="mt-6 flex gap-2">
        <Button size="lg" className="gap-2">
          <Banknote className="h-4 w-4" />
          Buy {artist.tokenName}
        </Button>
        <Button variant="outline" size="lg">
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
