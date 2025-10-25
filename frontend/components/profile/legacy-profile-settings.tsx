// --- 7. Legacy Profile Settings ---
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { Settings, Banknote, LogOut, Lock } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { DialogHeader } from "../ui/dialog";
import { Button } from "../ui/button";

interface LegacyProfileSettingsProps {
  logout: () => void;
  isArtist: boolean;
}

export const LegacyProfileSettings: React.FC<LegacyProfileSettingsProps> = ({
  logout,
  isArtist,
}) => (
  <>
    <div className="mt-8 px-4">
      <h2 className="text-lg font-semibold mb-3 text-white">Settings</h2>
      <div className="space-y-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start bg-gray-800 text-white border-gray-700"
            >
              <Settings className="h-4 w-4 mr-2" />
              Account Settings
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 text-white border-gray-700">
            <DialogHeader>
              <DialogTitle>Account Settings</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <Button
                variant="outline"
                className="w-full justify-start bg-gray-700 text-white border-gray-600"
              >
                <Settings className="h-4 w-4 mr-2" />
                Profile Settings
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-gray-700 text-white border-gray-600"
              >
                <Banknote className="h-4 w-4 mr-2" />
                Payment Methods
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-gray-700 text-white border-gray-600"
                onClick={logout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Button
          variant="outline"
          className="w-full justify-start bg-gray-800 text-white border-gray-700 mt-2"
          onClick={logout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>

        {!isArtist && (
          <Card className="bg-gray-800 border-gray-700 mt-4">
            <CardContent className="p-4">
              <div className="flex items-center">
                <Lock className="h-5 w-5 text-bright-yellow mr-2" />
                <div>
                  <h3 className="text-white font-medium">Become an Artist</h3>
                  <p className="text-sm text-gray-400">
                    Apply to become a verified artist on DROPSLAND
                  </p>
                </div>
                <Button className="ml-auto bg-bright-yellow hover:bg-bright-yellow-700 text-black">
                  Apply
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
    <div className="mt-8 px-4 pb-8">
      <Button
        variant="outline"
        size="lg"
        className="w-full bg-gray-800 text-red-400 border-red-500/30 hover:bg-red-500/10 hover:border-red-500"
        onClick={logout}
      >
        <LogOut className="h-4 w-4 mr-2" />
        Logout
      </Button>
    </div>
  </>
);
