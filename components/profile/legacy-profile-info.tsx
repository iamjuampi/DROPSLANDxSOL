import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

interface LegacyProfileInfoProps {
  legacyProfile: any;
  isEditing: boolean;
  editedBio: string;
  onBioChange: (bio: string) => void;
  balance: number;
  donated: number;
}

export const LegacyProfileInfo: React.FC<LegacyProfileInfoProps> = ({
  legacyProfile,
  isEditing,
  editedBio,
  onBioChange,
  balance,
  donated,
}) => (
  <div className="mt-16 px-4">
    <div className="flex items-center">
      <h1 className="text-xl font-bold text-white">{legacyProfile.name}</h1>
      {legacyProfile.isVerified && (
        <div className="ml-1 -mt-1">
          {/* SVG for verified badge */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 256 256"
            className="inline-block"
          >
            <g transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
              <path
                d="M 49.66 1.125 L 49.66 1.125 c 4.67 -2.393 10.394 -0.859 13.243 3.548 l 0 0 c 1.784 2.761 4.788 4.495 8.071 4.66 l 0 0 c 5.241 0.263 9.431 4.453 9.694 9.694 v 0 c 0.165 3.283 1.899 6.286 4.66 8.071 l 0 0 c 4.407 2.848 5.941 8.572 3.548 13.242 l 0 0 c -1.499 2.926 -1.499 6.394 0 9.319 l 0 0 c 2.393 4.67 0.859 10.394 -3.548 13.242 l 0 0 c -2.761 1.784 -4.495 4.788 -4.66 8.071 v 0 c -0.263 5.241 -4.453 9.431 -9.694 9.694 h 0 c -3.283 0.165 -6.286 1.899 -8.071 4.66 l 0 0 c -2.848 4.407 -8.572 5.941 -13.242 3.548 l 0 0 c -2.926 -1.499 -6.394 -1.499 -9.319 0 l 0 0 c -4.67 2.393 -10.394 0.859 -13.242 -3.548 l 0 0 c -1.784 -2.761 -4.788 -4.495 -8.071 -4.66 h 0 c -5.241 -0.263 -9.431 -4.453 -9.694 -9.694 l 0 0 c -0.165 -3.283 -1.899 -6.286 -4.66 -8.071 l 0 0 C 0.266 60.054 -1.267 54.33 1.125 49.66 l 0 0 c 1.499 -2.926 1.499 -6.394 0 -9.319 l 0 0 c -2.393 -4.67 -0.859 -10.394 3.548 -13.242 l 0 0 c 2.761 -1.784 4.495 -4.788 4.66 -8.071 l 0 0 c 0.263 -5.241 4.453 -9.431 9.694 -9.694 l 0 0 c 3.283 -0.165 6.286 -1.899 8.071 -4.66 l 0 0 c 2.848 -4.407 8.572 -5.941 13.242 -3.548 l 0 0 C 43.266 2.624 46.734 2.624 49.66 1.125 z"
                fill="#0083f9"
              />
              <polygon
                points="36.94,66.3 36.94,66.3 36.94,46.9 36.94,46.9 62.8,35.34 72.5,45.04"
                fill="#0077e3"
              />
              <polygon
                points="36.94,66.3 17.5,46.87 27.2,37.16 36.94,46.9 60.11,23.7 69.81,33.39"
                fill="#ffffff"
              />
            </g>
          </svg>
        </div>
      )}
    </div>
    <p className="text-gray-400">{legacyProfile.handle}</p>

    <div className="flex items-center mt-2">
      <Badge
        variant="outline"
        className="bg-gray-800 text-gray-300 border-gray-700"
      >
        {legacyProfile.category}
      </Badge>
      <span className="text-sm text-gray-400 ml-2">
        Member since {legacyProfile.memberSince}
      </span>
    </div>

    {isEditing ? (
      <div className="mt-3 space-y-3">
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Bio</label>
          <Textarea
            value={editedBio}
            onChange={(e) => onBioChange(e.target.value)}
            className="text-sm text-gray-300 border border-gray-700 p-2 rounded-md bg-gray-800 w-full"
            placeholder="Tell us about yourself..."
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Category</label>
          <Input
            defaultValue={legacyProfile.category}
            className="text-sm text-gray-300 border border-gray-700 p-2 rounded-md bg-gray-800"
          />
        </div>
      </div>
    ) : (
      <p className="text-sm mt-3 text-gray-300">{legacyProfile.bio}</p>
    )}

    {/* Stats for Legacy Profile */}
    <div className="flex gap-4 mt-4">
      <div>
        <p className="text-sm text-gray-400">Balance</p>
        <div className="flex items-center">
          <span className="font-bold text-white">{balance} $DROPS</span>
        </div>
      </div>
      <div>
        <p className="text-sm text-gray-400">Purchased</p>
        <div className="flex items-center">
          <span className="font-bold text-white">{donated} $DROPS</span>
        </div>
      </div>
      <div>
        <p className="text-sm text-gray-400">Artists</p>
        <p className="font-bold text-white">8</p>
      </div>
    </div>
  </div>
);
