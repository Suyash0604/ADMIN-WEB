import {
  Users,
  Shield,
  BadgeCheck,
  KeyRound,
  MapPin,
  UserCog,
  Building2,
  FileText,
  Files,
  Package,
  Radio,
  Cable,
  PhoneCall,
  Server,
  BrainCircuit,
  AudioLines,
  Volume2,
  Languages as LanguagesIcon,
  Waypoints,
  GitCompareArrows,
} from "lucide-react";

export const SERVICES = {
  RBAC: "RBAC service",
  CLIENT: "Client service",
  AI: "AI Services",
};

export const summaryTiles = [
  { key: "clients", label: "Clients", value: 2, caption: "Client service" },
  { key: "users", label: "Users", value: 2, caption: "RBAC service" },
  { key: "aiModels", label: "AI models", value: 3, caption: "LLM/STT/TTS" },
  { key: "mappings", label: "Mappings", value: 3, caption: "RBAC + language" },
];

export const entities = [
  {
    key: "users",
    label: "Users",
    records: 2,
    service: SERVICES.RBAC,
    icon: Users,
    featured: true,
    description: "People with access to the platform and their profiles.",
  },
  { key: "roles", label: "Roles", records: 2, service: SERVICES.RBAC, icon: Shield },
  { key: "designations", label: "Designations", records: 2, service: SERVICES.RBAC, icon: BadgeCheck },
  { key: "designationRoles", label: "Designation Roles", records: 1, service: SERVICES.RBAC, icon: KeyRound },
  { key: "buLocations", label: "BU Locations", records: 1, service: SERVICES.RBAC, icon: MapPin },
  { key: "userAssignments", label: "User Assignments", records: 1, service: SERVICES.RBAC, icon: UserCog },

  {
    key: "clients",
    label: "Clients",
    records: 1,
    service: SERVICES.CLIENT,
    icon: Building2,
    featured: true,
    description: "Organizations onboarded and configured on the platform.",
  },
  { key: "legalDocuments", label: "Legal Documents", records: 1, service: SERVICES.CLIENT, icon: FileText },
  { key: "masterDocuments", label: "Master Documents", records: 1, service: SERVICES.CLIENT, icon: Files },
  { key: "masterProducts", label: "Master Products", records: 1, service: SERVICES.CLIENT, icon: Package },
  { key: "masterChannels", label: "Master Channels", records: 1, service: SERVICES.CLIENT, icon: Radio },
  { key: "productChannels", label: "Product Channels", records: 1, service: SERVICES.CLIENT, icon: Cable },
  { key: "callingConfig", label: "Calling Config", records: 1, service: SERVICES.CLIENT, icon: PhoneCall },

  {
    key: "providers",
    label: "Providers",
    records: 3,
    service: SERVICES.AI,
    icon: Server,
    featured: true,
    description: "External AI vendors powering the LLM, STT and TTS models.",
  },
  { key: "llmModels", label: "LLM Models", records: 1, service: SERVICES.AI, icon: BrainCircuit },
  { key: "sttModels", label: "STT Models", records: 1, service: SERVICES.AI, icon: AudioLines },
  { key: "ttsModels", label: "TTS Models", records: 1, service: SERVICES.AI, icon: Volume2 },
  { key: "languages", label: "Languages", records: 1, service: SERVICES.AI, icon: LanguagesIcon },
  { key: "languageSttMap", label: "Language STT Map", records: 1, service: SERVICES.AI, icon: Waypoints },
  { key: "languageTtsMap", label: "Language TTS Map", records: 1, service: SERVICES.AI, icon: GitCompareArrows },
];

export const serviceOrder = [SERVICES.RBAC, SERVICES.CLIENT, SERVICES.AI];
