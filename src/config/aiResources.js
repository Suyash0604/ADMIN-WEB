import {
  Server,
  BrainCircuit,
  AudioLines,
  Volume2,
  Languages as LanguagesIcon,
  Waypoints,
  GitCompareArrows,
} from "lucide-react";
import {
  providersApi,
  llmApi,
  sttApi,
  ttsApi,
  languagesApi,
  languageSttMapsApi,
  languageTtsMapsApi,
} from "../api/clientPlatform";
import { ROUTES } from "../lib/constants";

const timestampColumns = [
  { key: "created_at", label: "Created", type: "date" },
  { key: "updated_at", label: "Updated", type: "date" },
];

const activeField = {
  name: "is_active",
  label: "Active",
  type: "boolean",
  defaultValue: true,
  booleanLabels: { true: "Active", false: "Inactive" },
};

const providerColumn = {
  key: "provider",
  label: "Provider",
  accessor: (r) =>
    r.provider?.provider_name
      ? `${r.provider.provider_name} (#${r.provider_id})`
      : r.provider_id,
};

const providerTypeOptions = [
  { value: "LLM", label: "LLM — Large language model" },
  { value: "STT", label: "STT — Speech to text" },
  { value: "TTS", label: "TTS — Text to speech" },
];

export const aiResources = {
  providers: {
    key: "providers",
    path: ROUTES.ai.providers,
    title: "Providers",
    singular: "Provider",
    description: "External AI vendors powering the LLM, STT and TTS models.",
    icon: Server,
    api: providersApi,
    idKey: "id",
    idLabel: "Provider ID",
    hasList: true,
    useFormUrlEncoded: true,
    fields: [
      {
        name: "provider_name",
        label: "Provider name",
        type: "text",
        required: true,
        placeholder: "OpenAI",
      },
      {
        name: "provider_type",
        label: "Provider type",
        type: "select",
        required: true,
        placeholder: "Select provider type",
        options: providerTypeOptions,
      },
    ],
    columns: [
      { key: "id", label: "ID" },
      { key: "provider_name", label: "Name" },
      { key: "provider_type", label: "Type" },
      ...timestampColumns,
    ],
  },

  llmModels: {
    key: "llmModels",
    path: ROUTES.ai.llmModels,
    title: "LLM Models",
    singular: "LLM Model",
    description: "Large language models available for conversational AI.",
    icon: BrainCircuit,
    api: llmApi,
    idKey: "id",
    idLabel: "LLM ID",
    hasList: true,
    useFormUrlEncoded: true,
    fields: [
      {
        name: "provider_id",
        label: "Provider",
        type: "provider",
        providerType: "llm",
        required: true,
      },
      {
        name: "model_name",
        label: "Model name",
        type: "text",
        required: true,
        placeholder: "gpt-4o",
      },
      {
        name: "supports_streaming",
        label: "Supports streaming",
        type: "boolean",
        defaultValue: false,
        booleanLabels: { true: "Yes", false: "No" },
      },
      {
        name: "max_context_tokens",
        label: "Max context tokens",
        type: "number",
        placeholder: "128000",
      },
      activeField,
    ],
    columns: [
      { key: "id", label: "ID" },
      { key: "model_name", label: "Model" },
      providerColumn,
      { key: "supports_streaming", label: "Streaming", type: "boolean" },
      { key: "max_context_tokens", label: "Context tokens" },
      { key: "is_active", label: "Active", type: "boolean" },
      ...timestampColumns,
    ],
  },

  sttModels: {
    key: "sttModels",
    path: ROUTES.ai.sttModels,
    title: "STT Models",
    singular: "STT Model",
    description: "Speech-to-text models for voice transcription.",
    icon: AudioLines,
    api: sttApi,
    idKey: "id",
    idLabel: "STT ID",
    hasList: true,
    useFormUrlEncoded: true,
    fields: [
      {
        name: "provider_id",
        label: "Provider",
        type: "provider",
        providerType: "stt",
        required: true,
      },
      {
        name: "model_name",
        label: "Model name",
        type: "text",
        required: true,
        placeholder: "whisper-1",
      },
      {
        name: "is_realtime",
        label: "Realtime",
        type: "boolean",
        defaultValue: false,
        booleanLabels: { true: "Yes", false: "No" },
      },
      activeField,
    ],
    columns: [
      { key: "id", label: "ID" },
      { key: "model_name", label: "Model" },
      providerColumn,
      { key: "is_realtime", label: "Realtime", type: "boolean" },
      { key: "is_active", label: "Active", type: "boolean" },
      ...timestampColumns,
    ],
  },

  ttsModels: {
    key: "ttsModels",
    path: ROUTES.ai.ttsModels,
    title: "TTS Models",
    singular: "TTS Model",
    description: "Text-to-speech voices and models for audio output.",
    icon: Volume2,
    api: ttsApi,
    idKey: "id",
    idLabel: "TTS ID",
    hasList: true,
    useFormUrlEncoded: true,
    fields: [
      {
        name: "provider_id",
        label: "Provider",
        type: "provider",
        providerType: "tts",
        required: true,
      },
      {
        name: "model_name",
        label: "Model name",
        type: "text",
        required: true,
        placeholder: "tts-1",
      },
      { name: "voice", label: "Voice", type: "text", placeholder: "Rachel" },
      {
        name: "voice_id",
        label: "Voice ID",
        type: "text",
        placeholder: "Provider-specific voice ID",
      },
      { name: "gender", label: "Gender", type: "text", placeholder: "female" },
      {
        name: "sample_rate",
        label: "Sample rate (Hz)",
        type: "number",
        placeholder: "44100",
      },
      activeField,
    ],
    columns: [
      { key: "id", label: "ID" },
      { key: "model_name", label: "Model" },
      providerColumn,
      { key: "voice", label: "Voice" },
      { key: "gender", label: "Gender" },
      { key: "is_active", label: "Active", type: "boolean" },
      ...timestampColumns,
    ],
  },

  languages: {
    key: "languages",
    path: ROUTES.ai.languages,
    title: "Languages",
    singular: "Language",
    description: "Master language definitions used across STT and TTS mappings.",
    icon: LanguagesIcon,
    api: languagesApi,
    idKey: "id",
    idLabel: "Language ID",
    hasList: true,
    useFormUrlEncoded: true,
    fields: [
      {
        name: "name",
        label: "Language name",
        type: "text",
        required: true,
        placeholder: "English (US)",
      },
      {
        name: "code",
        label: "Language code",
        type: "text",
        required: true,
        placeholder: "en-US",
      },
    ],
    columns: [
      { key: "id", label: "ID" },
      { key: "name", label: "Name" },
      { key: "code", label: "Code" },
      ...timestampColumns,
    ],
  },

  languageSttMap: {
    key: "languageSttMap",
    path: ROUTES.ai.languageSttMap,
    title: "Language STT Map",
    singular: "Language STT Mapping",
    description: "Maps a master language to an STT model.",
    icon: Waypoints,
    api: languageSttMapsApi,
    idKey: "id",
    idLabel: "Mapping ID",
    hasList: true,
    useFormUrlEncoded: true,
    fields: [
      {
        name: "language_id",
        label: "Language",
        type: "languageId",
        required: true,
      },
      {
        name: "stt_id",
        label: "STT model",
        type: "sttModel",
        required: true,
      },
    ],
    columns: [
      { key: "id", label: "ID" },
      {
        key: "language",
        label: "Language",
        accessor: (r) =>
          r.language?.name
            ? `${r.language.name} (#${r.language_id})`
            : r.language_id,
      },
      {
        key: "stt",
        label: "STT model",
        accessor: (r) =>
          r.stt?.model_name
            ? `${r.stt.model_name} (#${r.stt_id})`
            : r.stt_id,
      },
      ...timestampColumns,
    ],
  },

  languageTtsMap: {
    key: "languageTtsMap",
    path: ROUTES.ai.languageTtsMap,
    title: "Language TTS Map",
    singular: "Language TTS Mapping",
    description: "Maps a master language to a TTS model.",
    icon: GitCompareArrows,
    api: languageTtsMapsApi,
    idKey: "id",
    idLabel: "Mapping ID",
    hasList: true,
    useFormUrlEncoded: true,
    fields: [
      {
        name: "language_id",
        label: "Language",
        type: "languageId",
        required: true,
      },
      {
        name: "tts_id",
        label: "TTS model",
        type: "ttsModel",
        required: true,
      },
    ],
    columns: [
      { key: "id", label: "ID" },
      {
        key: "language",
        label: "Language",
        accessor: (r) =>
          r.language?.name
            ? `${r.language.name} (#${r.language_id})`
            : r.language_id,
      },
      {
        key: "tts",
        label: "TTS model",
        accessor: (r) =>
          r.tts?.model_name
            ? `${r.tts.model_name} (#${r.tts_id})`
            : r.tts_id,
      },
      ...timestampColumns,
    ],
  },
};

export const aiResourceList = Object.values(aiResources);
